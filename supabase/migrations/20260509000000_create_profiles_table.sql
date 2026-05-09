CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    experience TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    monthly_rate TEXT,
    resume_link TEXT,
    market_rate TEXT,
    summary TEXT,
    full_experience TEXT,
    company_name TEXT,
    company_type TEXT DEFAULT 'signimus',
    fulfilled_by TEXT,
    contact_number TEXT,
    work_email TEXT,
    platform_fee TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles (created_at DESC);
