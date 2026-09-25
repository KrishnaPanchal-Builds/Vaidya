-- =============================================================================
-- TRAUMABRIDGE AI — POSTGRESQL PRODUCTION SCHEMA
-- Run: psql -U tba_user -d traumabridge -f migrations/001_initial_schema.sql
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ── Enum Types ────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
    'PARAMEDIC',
    'ER_PHYSICIAN',
    'BLOOD_BANK_TECH',
    'SYS_ADMIN'
);

CREATE TYPE transit_status AS ENUM (
    'ACTIVE',
    'EN_ROUTE',
    'ARRIVED',
    'HANDED_OVER',
    'CANCELLED'
);

CREATE TYPE triage_priority AS ENUM (
    'P1',  -- Immediate / Resuscitation
    'P2',  -- Emergent
    'P3',  -- Urgent
    'P4'   -- Non-urgent
);

CREATE TYPE contraindication_severity AS ENUM (
    'CRITICAL',  -- Lethal interaction (e.g., Warfarin + Thrombolytics)
    'HIGH',      -- Severe interaction requiring intervention
    'MODERATE',  -- Monitor closely
    'LOW'        -- Minor interaction
);

-- ── Shared updated_at trigger ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TABLE: hospitals
-- Description: Hospital registry with ABDM facility codes.
-- =============================================================================

CREATE TABLE hospitals (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_code       VARCHAR(20) UNIQUE NOT NULL,  -- ABDM facility code
    name                VARCHAR(300) NOT NULL,
    district            VARCHAR(100),
    state               VARCHAR(100),
    latitude            NUMERIC(10, 8),
    longitude           NUMERIC(11, 8),
    blood_bank_present  BOOLEAN DEFAULT FALSE,
    trauma_center_level INTEGER CHECK (trauma_center_level BETWEEN 1 AND 4),
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_hospitals_updated_at
    BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TABLE: users
-- Description: System users with role-based access control.
-- =============================================================================

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id         VARCHAR(50) UNIQUE NOT NULL,
    full_name           VARCHAR(200) NOT NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    phone               VARCHAR(20) UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    role                user_role NOT NULL DEFAULT 'PARAMEDIC',
    hospital_id         UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_employee_id_format CHECK (employee_id ~ '^[A-Z0-9-]{4,50}$'),
    CONSTRAINT chk_email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

CREATE INDEX idx_users_role       ON users(role) WHERE is_active = TRUE;
CREATE INDEX idx_users_hospital   ON users(hospital_id) WHERE is_active = TRUE;
CREATE INDEX idx_users_email      ON users(email);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TABLE: transits
-- Description: Lifetime incident tracker for individual emergency runs.
-- Each row represents one ambulance call from dispatch to handover.
-- =============================================================================

CREATE TABLE transits (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transit_code            VARCHAR(20) UNIQUE NOT NULL,  -- TBA-YYYYMMDD-XXXX
    paramedic_id            UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    hospital_id             UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    status                  transit_status NOT NULL DEFAULT 'ACTIVE',

    -- Patient identification (ABHA or emergency unknown)
    abha_id                 VARCHAR(20),          -- 14-digit ABHA number
    abha_address            VARCHAR(255),         -- user@abdm
    patient_name            VARCHAR(200) NOT NULL DEFAULT 'Unknown',
    patient_age             INTEGER CHECK (patient_age BETWEEN 0 AND 130),
    patient_sex             VARCHAR(1) CHECK (patient_sex IN ('M', 'F', 'O')),
    is_unknown_patient      BOOLEAN NOT NULL DEFAULT FALSE,

    -- MIST Protocol data (raw extracted from voice)
    mechanism_of_injury     TEXT,
    injuries_raw            TEXT[] DEFAULT '{}',
    treatment_raw           TEXT[] DEFAULT '{}',
    vitals_raw              JSONB DEFAULT '{}',
    mist_confidence         NUMERIC(3, 2) CHECK (mist_confidence BETWEEN 0.0 AND 1.0),

    -- Computed clinical scores (deterministic Python, not AI)
    rts_score               NUMERIC(6, 4),
    rts_coded_gcs           INTEGER,
    rts_coded_sbp           INTEGER,
    rts_coded_rr            INTEGER,
    shock_index             NUMERIC(5, 2),
    shock_urgency           VARCHAR(20),
    cpss_score              INTEGER CHECK (cpss_score BETWEEN 0 AND 3),
    cpss_stroke_probability NUMERIC(3, 2),
    gcs_total               INTEGER CHECK (gcs_total BETWEEN 3 AND 15),

    -- Triage
    triage_priority         triage_priority,
    triage_color            VARCHAR(10),
    nels_protocol           VARCHAR(50),

    -- MoRTH Cashless Accident Scheme (Road Accident victims)
    morTH_scheme_eligible   BOOLEAN DEFAULT FALSE,
    morTH_claim_id          VARCHAR(50),
    morTH_cashless_amount   NUMERIC(10, 2),
    is_road_accident        BOOLEAN DEFAULT FALSE,
    fir_number              VARCHAR(50),

    -- GPS & timing
    origin_latitude         NUMERIC(10, 8),
    origin_longitude        NUMERIC(11, 8),
    destination_latitude    NUMERIC(10, 8),
    destination_longitude   NUMERIC(11, 8),
    eta_seconds             INTEGER,
    dispatch_time           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    arrival_time            TIMESTAMP WITH TIME ZONE,
    handover_time           TIMESTAMP WITH TIME ZONE,

    -- Anti-fraud: Cryptographic asystole proof
    asystole_detected       BOOLEAN DEFAULT FALSE,
    asystole_timestamp      TIMESTAMP WITH TIME ZONE,
    asystole_hash           VARCHAR(64),   -- SHA-256 hex digest

    -- Audit
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_abha_format CHECK (
        abha_id IS NULL OR abha_id ~ '^\d{14}$'
    ),
    CONSTRAINT chk_transit_code_format CHECK (
        transit_code ~ '^TBA-\d{8}-\d{4}$'
    )
);

CREATE INDEX idx_transits_paramedic       ON transits(paramedic_id, dispatch_time DESC);
CREATE INDEX idx_transits_hospital_status ON transits(hospital_id, status)
    WHERE status IN ('ACTIVE', 'EN_ROUTE', 'ARRIVED');
CREATE INDEX idx_transits_abha            ON transits(abha_id) WHERE abha_id IS NOT NULL;
CREATE INDEX idx_transits_morTH           ON transits(morTH_claim_id)
    WHERE morTH_scheme_eligible = TRUE;
CREATE INDEX idx_transits_asystole        ON transits(asystole_timestamp)
    WHERE asystole_detected = TRUE;

CREATE TRIGGER trg_transits_updated_at
    BEFORE UPDATE ON transits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TABLE: vitals_series
-- Description: Time-series telemetry tracking (one row per reading).
-- =============================================================================

CREATE TABLE vitals_series (
    id                  BIGSERIAL PRIMARY KEY,
    transit_id          UUID NOT NULL REFERENCES transits(id) ON DELETE CASCADE,
    recorded_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Vital signs
    heart_rate          INTEGER,
    systolic_bp         INTEGER,
    diastolic_bp        INTEGER,
    respiratory_rate    INTEGER,
    spo2                INTEGER,
    temperature_celsius NUMERIC(4, 1),
    gcs_total           INTEGER,
    pain_score          INTEGER,

    -- Device metadata (IEEE 11073 support)
    source_device       VARCHAR(50) DEFAULT 'MANUAL_ENTRY',
    device_serial       VARCHAR(100),
    is_ieee_11073       BOOLEAN DEFAULT FALSE,

    -- Quality
    confidence_score    NUMERIC(3, 2) CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    is_abnormal         BOOLEAN DEFAULT FALSE,

    CONSTRAINT chk_hr_range  CHECK (heart_rate IS NULL OR heart_rate BETWEEN 0 AND 300),
    CONSTRAINT chk_sbp_range CHECK (systolic_bp IS NULL OR systolic_bp BETWEEN 0 AND 300),
    CONSTRAINT chk_spo2      CHECK (spo2 IS NULL OR spo2 BETWEEN 0 AND 100),
    CONSTRAINT chk_gcs       CHECK (gcs_total IS NULL OR gcs_total BETWEEN 3 AND 15)
);

-- High-performance compound index for time-series queries
CREATE INDEX idx_vitals_lookup   ON vitals_series(transit_id, recorded_at DESC);
CREATE INDEX idx_vitals_abnormal ON vitals_series(transit_id, is_abnormal)
    WHERE is_abnormal = TRUE;
CREATE INDEX idx_vitals_device   ON vitals_series(source_device, device_serial)
    WHERE source_device != 'MANUAL_ENTRY';
CREATE INDEX idx_vitals_brin     ON vitals_series USING BRIN(recorded_at)
    WITH (pages_per_range = 32);

-- =============================================================================
-- TABLE: scanned_contraindications
-- Description: OCR-extracted medications and drug interaction analysis.
-- =============================================================================

CREATE TABLE scanned_contraindications (
    id                      BIGSERIAL PRIMARY KEY,
    transit_id              UUID NOT NULL REFERENCES transits(id) ON DELETE CASCADE,
    scanned_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- OCR metadata
    raw_ocr_text            TEXT,
    image_storage_url       VARCHAR(500),
    ocr_confidence          NUMERIC(3, 2) CHECK (ocr_confidence BETWEEN 0.0 AND 1.0),

    -- Extracted medications
    detected_medications    TEXT[] DEFAULT '{}',
    medication_confidence   JSONB DEFAULT '{}',   -- {drug_name: confidence_float}

    -- Contraindication analysis
    has_contraindication    BOOLEAN NOT NULL DEFAULT FALSE,
    severity                contraindication_severity,
    interacting_drugs       TEXT[] DEFAULT '{}',
    clinical_alert          TEXT,
    recommended_action      TEXT,

    -- Physician verification
    verified_by_physician   BOOLEAN DEFAULT FALSE,
    verified_by             UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at             TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_contraindication_alert CHECK (
        (has_contraindication = FALSE AND clinical_alert IS NULL)
        OR (has_contraindication = TRUE AND clinical_alert IS NOT NULL)
    )
);

CREATE INDEX idx_contraindications_transit  ON scanned_contraindications(transit_id, scanned_at DESC);
CREATE INDEX idx_contraindications_critical ON scanned_contraindications(severity, transit_id)
    WHERE severity IN ('CRITICAL', 'HIGH');
CREATE INDEX idx_contraindications_meds     ON scanned_contraindications USING GIN(detected_medications);

-- =============================================================================
-- ROW LEVEL SECURITY (RBAC)
-- =============================================================================

-- Paramedics see only their own transits; physicians see all for their hospital
CREATE POLICY paramedic_transit_isolation ON transits
    FOR SELECT
    USING (
        paramedic_id = current_setting('app.current_user_id')::UUID
        OR EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::UUID
            AND role IN ('ER_PHYSICIAN', 'SYS_ADMIN')
        )
    );

-- ER Physicians see only their hospital's transits
CREATE POLICY physician_hospital_isolation ON transits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::UUID
            AND role = 'ER_PHYSICIAN'
            AND hospital_id = transits.hospital_id
        )
        OR EXISTS (
            SELECT 1 FROM users
            WHERE id = current_setting('app.current_user_id')::UUID
            AND role = 'SYS_ADMIN'
        )
    );

ALTER TABLE transits                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals_series             ENABLE ROW LEVEL SECURITY;
ALTER TABLE scanned_contraindications ENABLE ROW LEVEL SECURITY;
