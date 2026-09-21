#!/usr/bin/env python
"""
MediKiosk — Local FAISS Vector Index Builder

Reads the NAMASTE codes from data/namaste_codes.csv (via the BM25 SQLite
index populated by idiom_corpus_loader.py), computes BGE-m3 embeddings for
every term, and saves the result as:

    data/faiss_index.bin   — FAISS FlatIP index (cosine via inner product)
    data/faiss_meta.json   — Row → metadata mapping

This script replaces the old seed_pinecone.py. No external API key or internet
connection is required — everything runs locally inside the backend container.

Prerequisites:
    1. Run idiom corpus loader first:
       uv run python -m app.nlp.idiom_corpus_loader [--reset]

Usage:
    uv run python scripts/build_faiss_index.py [--force]

    --force    Delete and rebuild index even if data/faiss_index.bin exists.
"""
from __future__ import annotations

import argparse
import json
import logging
import sqlite3
import sys
from pathlib import Path

# ── Ensure project root is on sys.path when running as a script ───────────────
_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_ROOT))

from app.nlp.idiom_corpus_loader import BM25_DB_PATH, DATA_DIR

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("build_faiss_index")

FAISS_INDEX_PATH = DATA_DIR / "faiss_index.bin"
FAISS_META_PATH = DATA_DIR / "faiss_meta.json"


def build_index(force: bool = False) -> None:
    """Embed all NAMASTE terms and write faiss_index.bin + faiss_meta.json."""

    if FAISS_INDEX_PATH.exists() and not force:
        logger.info(
            "Index already exists at %s. Use --force to rebuild.", FAISS_INDEX_PATH
        )
        return

    # ── 1. Load NAMASTE corpus from SQLite ────────────────────────────────────
    logger.info("Reading NAMASTE codes from %s …", BM25_DB_PATH)
    conn = sqlite3.connect(str(BM25_DB_PATH))
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """SELECT namaste_code, english_term, hindi_term, marathi_term,
                  synonyms, icd11_tm2_code, icd11_allopathic_code,
                  dosha_association, severity_tier
           FROM namaste_codes"""
    ).fetchall()
    conn.close()

    if not rows:
        logger.error(
            "namaste_codes table is empty. Run idiom_corpus_loader.py first."
        )
        sys.exit(1)

    meta_list = []
    texts = []
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

    logger.info("Loaded %d NAMASTE terms.", len(texts))

    # ── 2. Load BGE-m3 ────────────────────────────────────────────────────────
    logger.info("Loading BGE-m3 embedding model (first run may download weights)…")
    try:
        from FlagEmbedding import FlagModel  # type: ignore[import]
        import numpy as np

        model = FlagModel(
            "BAAI/bge-m3",
            use_fp16=False,
            normalize_embeddings=True,
        )
    except ImportError as exc:
        logger.error("FlagEmbedding not installed: %s", exc)
        sys.exit(1)

    # ── 3. Embed ──────────────────────────────────────────────────────────────
    logger.info("Embedding %d terms in batches of 32 …", len(texts))
    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True)
    import numpy as np  # noqa: F811

    vectors = np.array(embeddings, dtype=np.float32)
    logger.info("Embeddings computed. Dimension: %d.", vectors.shape[1])

    # ── 4. Build FAISS FlatIP index ───────────────────────────────────────────
    try:
        import faiss  # type: ignore[import]
    except ImportError as exc:
        logger.error("faiss-cpu not installed: %s", exc)
        sys.exit(1)

    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)
    logger.info("FAISS index built: %d vectors, dim=%d.", index.ntotal, dim)

    # ── 5. Persist ────────────────────────────────────────────────────────────
    faiss.write_index(index, str(FAISS_INDEX_PATH))
    with open(FAISS_META_PATH, "w", encoding="utf-8") as f:
        json.dump(meta_list, f, ensure_ascii=False, indent=2)

    logger.info("Saved index → %s", FAISS_INDEX_PATH)
    logger.info("Saved meta  → %s", FAISS_META_PATH)

    # Mark as indexed in SQLite embeddings_meta
    conn = sqlite3.connect(str(BM25_DB_PATH))
    conn.execute("UPDATE embeddings_meta SET vector_indexed = 1")
    conn.commit()
    conn.close()
    logger.info("embeddings_meta.vector_indexed updated.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Build the local FAISS vector index for MediKiosk RAG"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Delete and rebuild the index even if it already exists",
    )
    args = parser.parse_args()
    build_index(force=args.force)

    print("\n  ✓ MediKiosk FAISS index build complete.")
    print(f"    Index:    {FAISS_INDEX_PATH}")
    print(f"    Metadata: {FAISS_META_PATH}")
    print("\n  The backend will load this index automatically on next startup.")
