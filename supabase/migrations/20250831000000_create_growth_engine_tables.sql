
CREATE TABLE keyword_patterns (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    pattern TEXT NOT NULL,
    head_term TEXT,
    status TEXT DEFAULT 'Pending' NOT NULL,
    priority INT DEFAULT 1 NOT NULL,
    avg_conversion_rate FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE data_source (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    entity_name TEXT NOT NULL,
    feature1 TEXT,
    feature2 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
