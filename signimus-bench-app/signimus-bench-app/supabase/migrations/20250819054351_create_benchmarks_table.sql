CREATE SCHEMA IF NOT EXISTS benchmarks;

CREATE TABLE benchmarks.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_a TEXT NOT NULL,
    code_b TEXT NOT NULL,
    time_a DOUBLE PRECISION NOT NULL,
    time_b DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);