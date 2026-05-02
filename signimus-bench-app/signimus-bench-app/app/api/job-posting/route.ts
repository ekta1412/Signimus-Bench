import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { jobTitle, companyName, location, jobDescription, notifyOnResumeSubmission } = await request.json();

    if (!jobTitle || !companyName || !location || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into the 'job_postings' table
    const { data, error } = await supabase
      .from('job_postings')
      .insert([
        {
          job_title: jobTitle,
          company_name: companyName,
          location: location,
          job_description: jobDescription,
          notify_on_resume_submission: notifyOnResumeSubmission,
        },
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Job posted successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error handling job posting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
