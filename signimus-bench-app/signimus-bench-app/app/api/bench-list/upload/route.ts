import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { benchResources } = await request.json();

    if (!Array.isArray(benchResources) || benchResources.length === 0) {
      return NextResponse.json({ error: 'Invalid bench resources data' }, { status: 400 });
    }

    // Validate each bench resource
    for (const resource of benchResources) {
      if (!resource.name || !resource.skill || typeof resource.experience !== 'number') {
        return NextResponse.json({ error: 'Invalid bench resource format' }, { status: 400 });
      }
    }

    // Insert data into the 'bench_resources' table
    const { data, error } = await supabase
      .from('bench_resources')
      .insert(benchResources)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Bench resources uploaded successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error handling bench list upload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}