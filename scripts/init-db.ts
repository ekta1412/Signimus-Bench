import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://xcjcqakmozslobggcmgh.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjamNxYWttb3pzbG9iZ2djbWdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4MDgwMiwiZXhwIjoyMDcwODU2ODAyfQ.kwIp6njsRytz8VJJ0GL0mNapPyJXFP75hT8Ee8gKCiI'; // Service role key from doppler.env

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTables() {
  try {
    // Create subscribers table
    const { error: subscribersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscribers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (subscribersError) {
      console.error('Error creating subscribers table:', subscribersError);
    } else {
      console.log('Subscribers table created successfully');
    }

    // Create job_postings table
    const { error: jobPostingsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS job_postings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_title TEXT NOT NULL,
          company_name TEXT NOT NULL,
          location TEXT NOT NULL,
          job_description TEXT NOT NULL,
          notify_client BOOLEAN DEFAULT FALSE,
          client_email TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (jobPostingsError) {
      console.error('Error creating job_postings table:', jobPostingsError);
    } else {
      console.log('Job postings table created successfully');
    }

    // Create bench_resources table
    const { error: benchResourcesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bench_resources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          skill TEXT NOT NULL,
          experience TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (benchResourcesError) {
      console.error('Error creating bench_resources table:', benchResourcesError);
    } else {
      console.log('Bench resources table created successfully');
    }
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();