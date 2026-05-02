import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bench_resources')
      .select('*');

    if (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e: unknown) {
    console.error('Error processing request:', e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
