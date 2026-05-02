
CREATE TABLE ugc_submissions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_content TEXT NOT NULL,
    platform TEXT NOT NULL,
    hashtag TEXT NOT NULL,
    virality_score FLOAT,
    status TEXT DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
