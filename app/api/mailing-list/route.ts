import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email: email }])
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Subscription successful', data }), { status: 200 });
  } catch (e: unknown) {
    console.error('Error processing request:', e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
