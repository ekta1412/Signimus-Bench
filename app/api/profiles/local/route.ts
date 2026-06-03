import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Profile = {
  id: string;
  name: string;
  title: string;
  experience: string;
  skills: string[];
  monthlyRate: string;
  resumeLink?: string;
  marketRate?: string;
};

export async function GET() {
  try {
    // Try to read from local developers.json file
    const filePath = path.join(process.cwd(), 'developers.json');
    
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Transform developers.json format to Profile format
      const profiles: Profile[] = data.developers
        .filter((dev: any) => dev.name && dev.name.trim())
        .map((dev: any) => ({
          id: dev.employee_id || dev.name.toLowerCase().replace(/\s+/g, '-'),
          name: dev.name,
          title: dev.skills ? dev.skills.split(',')[0].trim() : 'Developer',
          experience: dev.experience || 'Not specified',
          skills: dev.skills 
            ? dev.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
            : ['Developer'],
          monthlyRate: dev.monthly_rate_inr || 'On Request',
          resumeLink: dev.resume_link || 'Profile on Request',
          marketRate: dev.monthly_rate_inr || 'On Request',
        }));
      
      console.log(`✓ Loaded ${profiles.length} developers from developers.json`);
      return NextResponse.json(profiles);
    }
    
    // Fallback: return empty array if no file found
    return NextResponse.json([]);
  } catch (error) {
    console.error('api/profiles/local GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load profiles' },
      { status: 500 }
    );
  }
}
