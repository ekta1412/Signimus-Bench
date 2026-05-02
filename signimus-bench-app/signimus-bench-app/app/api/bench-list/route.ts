import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(request: Request) {
  try {
    // Fetch data from the 'bench_resources' table
    const { data, error } = await supabase
      .from('bench_resources')
      .select('id, name, skill, experience');

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error handling bench list fetch:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}