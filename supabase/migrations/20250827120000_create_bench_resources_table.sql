CREATE TABLE public.bench_resources (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    skill text NOT NULL,
    experience integer NOT NULL
);
