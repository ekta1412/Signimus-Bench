import { supabase } from '../../../lib/supabase';

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 10);
}

function getBadgeColor(badge: string) {
  if (badge === "Urgent") return "bg-red-100 text-red-600";
  if (badge === "Hiring") return "bg-green-100 text-green-600";
  return "bg-blue-100 text-blue-600";
}

function parseJobDescription(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && parsed.kind === "signimus-job-details") {
      return parsed as {
        type?: string;
        experience?: string;
        salary?: string;
        badge?: string;
        summary?: string;
        responsibilities?: string[];
        requirements?: string[];
        applyEmail?: string;
      };
    }
  } catch {
    // Older rows store a plain job description string.
  }
  return null;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('id, job_title, company_name, location, job_description, client_email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching job postings:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const jobs = (data || []).map((row) => {
      const details = parseJobDescription(row.job_description || "");
      const badge = details?.badge || "Open";
      const summary = details?.summary || row.job_description || "New hiring requirement added by Signimus.";

      return {
        id: row.id,
        title: row.job_title,
        companyName: row.company_name,
        type: details?.type || "Full-Time / Remote",
        experience: details?.experience || "Experience flexible",
        location: row.location,
        badge,
        badgeColor: getBadgeColor(badge),
        iconClass: "fas fa-briefcase",
        summary,
        responsibilities: normalizeList(details?.responsibilities).length > 0
          ? normalizeList(details?.responsibilities)
          : ["Role responsibilities will be discussed during screening."],
        requirements: normalizeList(details?.requirements).length > 0
          ? normalizeList(details?.requirements)
          : ["Relevant experience and strong communication skills."],
        salary: details?.salary || "On Request",
        applyEmail: details?.applyEmail || row.client_email || "contact@signimus.com",
        createdAt: row.created_at,
        source: "supabase",
      };
    });

    return new Response(JSON.stringify({ jobs }), { status: 200 });
  } catch (e: unknown) {
    console.error('Error processing job list request:', e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "Signimus";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const rawJobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
    const notifyOnResumeSubmission = Boolean(body.notifyOnResumeSubmission);
    const jobType = typeof body.jobType === "string" ? body.jobType.trim() : "";
    const experience = typeof body.experience === "string" ? body.experience.trim() : "";
    const salary = typeof body.salary === "string" ? body.salary.trim() : "";
    const badge = typeof body.badge === "string" ? body.badge.trim() : "Open";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const responsibilities = normalizeList(body.responsibilities);
    const requirements = normalizeList(body.requirements);
    const applyEmail = typeof body.applyEmail === "string" ? body.applyEmail.trim() : "";

    const hasStructuredJobDetails = Boolean(
      jobType || experience || salary || badge !== "Open" || summary || responsibilities.length || requirements.length || applyEmail
    );
    const jobDescription = hasStructuredJobDetails
      ? JSON.stringify({
          kind: "signimus-job-details",
          type: jobType || "Full-Time / Remote",
          experience: experience || "Experience flexible",
          salary: salary || "On Request",
          badge: ["Open", "Urgent", "Hiring"].includes(badge) ? badge : "Open",
          summary: summary || rawJobDescription || "New hiring requirement added by Signimus.",
          responsibilities,
          requirements,
          applyEmail: applyEmail || "contact@signimus.com",
        })
      : rawJobDescription;

    if (!jobTitle || !companyName || !location || !jobDescription) {
      return new Response(JSON.stringify({ error: "Missing required job posting fields" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('job_postings')
      .insert([
        { 
          job_title: jobTitle,
          company_name: companyName,
          location,
          job_description: jobDescription,
          notify_client: notifyOnResumeSubmission,
          client_email: applyEmail || null
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Job posting created successfully', data }), { status: 200 });
  } catch (e: unknown) {
    console.error('Error processing request:', e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
    return new Response(JSON.stringify({ error: message }), { status });
  }
}
