import { checkSupabaseConnectivity, getSupabaseEnv } from '../lib/supabase';

async function main() {
  console.log('Checking Supabase connectivity...');
  // The check function needs env vars to be set. 
  // In a real CI/CD environment, these would be set globally.
  // For this script, we can load them from the Supabase local dev config.
  const { url, key } = getSupabaseEnv();
  if (!url || !key) {
    try {
      const status = JSON.parse(require('child_process').execSync('supabase status -o json', { encoding: 'utf-8' }));
      process.env.SUPABASE_URL = status.apiUrl;
      process.env.SUPABASE_ANON_KEY = status.anonKey;
    } catch (e: any) {
      console.error('Could not load Supabase env vars from CLI. Please run `supabase start`.');
      process.exit(1);
    }
  }

  const { ok, error } = await checkSupabaseConnectivity();

  if (ok) {
    console.log('✅ Supabase connection successful!');
    process.exit(0);
  } else {
    console.error('❌ Supabase connection failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
