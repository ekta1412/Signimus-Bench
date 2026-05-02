import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    // Revalidate the /articles path to regenerate pSEO pages
    revalidatePath('/articles');

    return NextResponse.json({ revalidated: true, now: Date.now() }, { status: 200 });
  } catch (error) {
    console.error('Error revalidating pSEO pages:', error);
    return NextResponse.json({ error: 'Error revalidating pSEO pages' }, { status: 500 });
  }
}
