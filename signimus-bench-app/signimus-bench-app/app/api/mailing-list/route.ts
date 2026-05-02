import { supabase } from '../../../../lib/supabase';

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
  } catch (e: any) {
    console.error('Error processing request:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
