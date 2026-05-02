import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Insert into the 'subscribers' table
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
      }

      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription successful', data }, { status: 200 });
  } catch (error) {
    console.error('Error handling mailing list subscription:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
