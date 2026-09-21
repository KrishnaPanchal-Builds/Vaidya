"""
MediKiosk — Hybrid RAG Semantic Translator

Maps colloquial Indian folk idioms and clinical entity phrases to:
  - Allopathic ICD-11 codes
  - NAMASTE Ayush morbidity codes
  - WHO ICD-11 TM2 Traditional Medicine codes

Architecture:
  1. Dense search via BGE-m3 embeddings → local FAISS FlatIP index (in-process, ~2 ms)
  2. Sparse search via BM25 → local SQLite FTS5
  3. Reciprocal Rank Fusion (RRF, k=60) for final ranking
  4. Threshold filter (RRF score >= 0.65 required for acceptance)
  5. Double coding output: both allopathic and Ayush codes returned

The combined RRF approach handles:
  - Dense: semantic similarity for metaphorical folk phrases
  - Sparse: exact term matching for clinical terminologies

No external services required — the FAISS index is built from data/bm25_index.db
at startup and saved to data/faiss_index.bin for instant subsequent loads.
"""
from __future__ import annotations

import json
import logging
import sqlite3
import time
from pathlib import Path
from typing import Any

import numpy as np

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Global Clients ────────────────────────────────────────────────────────────
_faiss_index = None            # faiss.IndexFlatIP instance
_faiss_id_map: list[dict] = []  # row index → metadata dict
_bge_model = None
_bm25_db: sqlite3.Connection | None = None

DATA_DIR = Path(__file__).parent.parent.parent / "data"
BM25_DB_PATH = DATA_DIR / "bm25_index.db"
FAISS_INDEX_PATH = DATA_DIR / "faiss_index.bin"
FAISS_META_PATH = DATA_DIR / "faiss_meta.json"

RRF_K = 60                  # RRF smoothing constant
RRF_THRESHOLD = 0.65        # Minimum score for acceptance
TOP_K = 5                   # Candidates per retrieval method


async def init_rag_translator() -> None:
    """
    Initialise BGE-m3 embedding model and local FAISS vector index.
    Called once at application startup via lifespan hook.

    The FAISS index is either:
      a) Loaded from data/faiss_index.bin (fast path, subsequent runs), or
      b) Built from the NAMASTE codes in data/bm25_index.db (first run / after
         a corpus reload) and then saved for next time.
    """
    global _bge_model, _faiss_index, _faiss_id_map, _bm25_db

    # ── BGE-m3 Embedding Model ────────────────────────────────────────────────
    try:
        from FlagEmbedding import FlagModel  # type: ignore[import]
        _bge_model = FlagModel(
            "BAAI/bge-m3",
            use_fp16=False,
            normalize_embeddings=True,
        )
        logger.info("BGE-m3 embedding model loaded.")
    except Exception as exc:
        logger.error("Failed to load BGE-m3: %s — RAG will use BM25 only.", exc)

    # ── FAISS local index ──────────────────────────────────────────────────────
    try:
        import faiss  # type: ignore[import]

        if FAISS_INDEX_PATH.exists() and FAISS_META_PATH.exists():
            # Fast path: load pre-built index from disk
            _faiss_index = faiss.read_index(str(FAISS_INDEX_PATH))
            with open(FAISS_META_PATH, encoding="utf-8") as f:
                _faiss_id_map = json.load(f)
            logger.info(
                "FAISS index loaded from disk (%d vectors).", _faiss_index.ntotal
            )
        else:
            # Build path: embed NAMASTE corpus and persist
            logger.info("Building FAISS index from NAMASTE corpus…")
            _faiss_index, _faiss_id_map = _build_faiss_index(faiss)
            if _faiss_index is not None and _faiss_index.ntotal > 0:
                faiss.write_index(_faiss_index, str(FAISS_INDEX_PATH))
                with open(FAISS_META_PATH, "w", encoding="utf-8") as f:
                    json.dump(_faiss_id_map, f, ensure_ascii=False)
                logger.info(
                    "FAISS index built (%d vectors) and saved.", _faiss_index.ntotal
                )
    except Exception as exc:
        logger.error("FAISS init failed: %s — dense search disabled.", exc)

    # ── BM25 SQLite ───────────────────────────────────────────────────────────
    try:
        _bm25_db = sqlite3.connect(str(BM25_DB_PATH), check_same_thread=False)
        _bm25_db.row_factory = sqlite3.Row
        logger.info("BM25 SQLite index opened.")
    except Exception as exc:
        logger.error("Failed to open BM25 DB: %s", exc)


def _build_faiss_index(faiss_module: Any) -> tuple[Any, list[dict]]:
    """
    Embed every NAMASTE term in the BM25 SQLite DB and insert them into a
    FAISS FlatIP (inner-product) index.  Because BGE-m3 outputs L2-normalised
    vectors, inner product == cosine similarity.

    Returns (index, id_map) where id_map[i] is the metadata dict for FAISS
    row i.
    """
    if _bge_model is None:
        logger.warning("Cannot build FAISS index — BGE model not loaded.")
        return None, []

    conn = sqlite3.connect(str(BM25_DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(
            """SELECT namaste_code, english_term, hindi_term, marathi_term,
                      synonyms, icd11_tm2_code, icd11_allopathic_code,
                      dosha_association, severity_tier
               FROM namaste_codes"""
        ).fetchall()
    except Exception as exc:
        logger.error("Cannot read namaste_codes for FAISS build: %s", exc)
        conn.close()
        return None, []
    conn.close()

    if not rows:
        logger.warning("namaste_codes table is empty — FAISS index will be empty.")
        return None, []

    texts = []
    meta_list = []
    for row in rows:
        r = dict(row)
        combined = " | ".join(
            filter(
                None,
                [
                    r.get("english_term", ""),
                    r.get("hindi_term", ""),
                    r.get("marathi_term", ""),
                    r.get("synonyms", ""),
                ],
            )
        )
        texts.append(combined)
        meta_list.append(r)

    # Embed all texts in one batch (faster than per-item)
    try:
        embeddings = _bge_model.encode(texts, batch_size=32)
        vectors = np.array(embeddings, dtype=np.float32)
    except Exception as exc:
        logger.error("Embedding batch failed during FAISS build: %s", exc)
        return None, []

    dim = vectors.shape[1]
    index = faiss_module.IndexFlatIP(dim)  # cosine via inner product (vectors are normalised)
    index.add(vectors)
    return index, meta_list


def _embed(text: str) -> np.ndarray | None:
    """Generate a normalised L2 embedding using BGE-m3."""
    if _bge_model is None:
        return None
    try:
        embedding = _bge_model.encode([text], batch_size=1)
        return np.array(embedding[0], dtype=np.float32)
    except Exception as exc:
        logger.error("Embedding error: %s", exc)
        return None


def _dense_search(vector: np.ndarray) -> list[dict[str, Any]]:
    """Search the local FAISS index with a dense query vector."""
    if _faiss_index is None or _faiss_id_map is None or vector is None:
        return []
    try:
        q = vector.reshape(1, -1)
        scores, indices = _faiss_index.search(q, TOP_K)
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(_faiss_id_map):
                continue
            meta = _faiss_id_map[idx]
            results.append({
                "id": meta.get("namaste_code", str(idx)),
                "score": float(score),
                "metadata": meta,
                "namespace": "local_faiss",
            })
        return results
    except Exception as exc:
        logger.error("FAISS dense search error: %s", exc)
        return []


def _sparse_search(query: str) -> list[dict[str, Any]]:
    """BM25 full-text search against local SQLite FTS5 table."""
    if _bm25_db is None:
        return []
    try:
        # FTS5 MATCH query — sanitise input
        clean = query.replace('"', "").replace("'", "")
        cur = _bm25_db.execute(
            """
            SELECT id, term_en, term_hi, namaste_code, icd11_code,
                   icd11_tm2_code, dosha_indicators, rank
            FROM ontology_fts
            WHERE ontology_fts MATCH ?
            ORDER BY rank
            LIMIT ?
            """,
            (clean, TOP_K),
        )
        rows = cur.fetchall()
        return [dict(r) for r in rows]
    except Exception as exc:
        logger.error("BM25 search error: %s", exc)
        return []


def _rrf_fusion(
    dense_results: list[dict[str, Any]],
    sparse_results: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Reciprocal Rank Fusion.
    rrf_score(d) = Σ [ 1 / (k + rank_i(d)) ]
    where k=60 (standard RRF constant).
    """
    scores: dict[str, float] = {}
    metadata_map: dict[str, dict] = {}

    # Dense results: rank by FAISS cosine score (highest first)
    sorted_dense = sorted(dense_results, key=lambda x: x["score"], reverse=True)
    for rank, item in enumerate(sorted_dense, start=1):
        doc_id = item["id"]
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (RRF_K + rank)
        metadata_map[doc_id] = item.get("metadata", {})

    # Sparse results: rank by BM25 rank (lower FTS5 rank = better)
    for rank, item in enumerate(sparse_results, start=1):
        doc_id = str(item.get("id", f"bm25_{rank}"))
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (RRF_K + rank)
        if doc_id not in metadata_map:
            metadata_map[doc_id] = item

    # Sort by RRF score descending
    fused = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [
        {"id": doc_id, "rrf_score": score, "metadata": metadata_map.get(doc_id, {})}
        for doc_id, score in fused
    ]


# ── Public API ────────────────────────────────────────────────────────────────

async def translate_entity(phrase: str, language: str = "hi") -> dict[str, Any]:
    """
    Main entry point: map a clinical entity phrase to standardised codes.

    Args:
        phrase: Raw phrase from patient utterance (e.g., "Pitta bhadak gaya")
        language: Source language BCP-47 code

    Returns:
        {
          "allopathic": {"icd11_code": str, "display": str},
          "ayush": {"namaste_code": str, "term": str, "icd11_tm2_code": str},
          "dosha_indicators": [str],
          "confidence": float,
          "raw_phrase": str
        }
    """
    start = time.time()

    # Step 1: Embed
    vector = _embed(phrase)

    # Step 2: Parallel retrieval (dense + sparse)
    dense_results = _dense_search(vector) if vector is not None else []
    sparse_results = _sparse_search(phrase)

    # Step 3: RRF fusion
    fused = _rrf_fusion(dense_results, sparse_results)

    # Step 4: Threshold filter
    accepted = [r for r in fused if r["rrf_score"] >= RRF_THRESHOLD]

    elapsed_ms = (time.time() - start) * 1000
    logger.debug("RAG translate '%s': %d results in %.0fms", phrase[:30], len(accepted), elapsed_ms)

    if not accepted:
        return {
            "allopathic": {"icd11_code": None, "display": None},
            "ayush": {"namaste_code": None, "term": None, "icd11_tm2_code": None},
            "dosha_indicators": [],
            "confidence": 0.0,
            "raw_phrase": phrase,
            "mapped": False,
        }

    best = accepted[0]["metadata"]
    return {
        "allopathic": {
            "icd11_code": best.get("icd11_allopathic_code") or best.get("icd11_code"),
            "display": best.get("english_term") or best.get("term_en"),
        },
        "ayush": {
            "namaste_code": best.get("namaste_code"),
            "term": best.get("hindi_term") or best.get("namaste_term") or best.get("term_hi"),
            "icd11_tm2_code": best.get("icd11_tm2_code"),
        },
        "dosha_indicators": _parse_dosha_indicators(
            best.get("dosha_association") or best.get("dosha_indicators", "")
        ),
        "confidence": accepted[0]["rrf_score"],
        "raw_phrase": phrase,
        "mapped": True,
    }


def _parse_dosha_indicators(raw: str | list) -> list[str]:
    """Normalise dosha indicator field (may be comma string or list)."""
    if isinstance(raw, list):
        return raw
    if isinstance(raw, str) and raw:
        return [x.strip() for x in raw.split(",") if x.strip()]
    return []
