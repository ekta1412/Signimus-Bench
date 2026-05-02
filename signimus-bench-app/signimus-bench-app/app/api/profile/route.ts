// app/api/profile/route.ts
import { supabase } from '@/lib/supabase'; // Adjust the path as needed
import { NextResponse } from 'next/server';

// PUT /api/profile
// Update user profile metadata
export async function PUT(request: Request) {
  try {
    const { name } = await request.json();
    
    // Get the user from the request (you'll need to implement this)
    // This is a placeholder, you'll need to get the user from the session/access token
    const user = null; // Replace with actual user retrieval logic
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user metadata in Supabase
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        // Add other metadata fields as needed
      },
    });

    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated successfully', data });
  } catch (error) {
    console.error('Error handling profile update:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}