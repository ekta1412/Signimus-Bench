const { createClient } = require('@supabase/supabase-js');

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }

  return createClient(url, key);
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 10);
}

function getBadgeColor(badge) {
  if (badge === 'Urgent') return 'bg-red-100 text-red-600';
  if (badge === 'Hiring') return 'bg-green-100 text-green-600';
  return 'bg-blue-100 text-blue-600';
}

function parseJobDescription(value) {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && parsed.kind === 'signimus-job-details') {
      return parsed;
    }
  } catch {
    // Older rows store a plain job description string.
  }
  return null;
}

function rowToJob(row) {
  const details = parseJobDescription(row.job_description || '');
  const badge = details?.badge || 'Open';
  const responsibilities = normalizeList(details?.responsibilities);
  const requirements = normalizeList(details?.requirements);

  return {
    id: row.id,
    title: row.job_title,
    companyName: row.company_name,
    type: details?.type || 'Full-Time / Remote',
    experience: details?.experience || 'Experience flexible',
    location: row.location,
    badge,
    badgeColor: getBadgeColor(badge),
    iconClass: 'fas fa-briefcase',
    summary: details?.summary || row.job_description || 'New hiring requirement added by Signimus.',
    responsibilities: responsibilities.length
      ? responsibilities
      : ['Role responsibilities will be discussed during screening.'],
    requirements: requirements.length
      ? requirements
      : ['Relevant experience and strong communication skills.'],
    salary: details?.salary || 'On Request',
    applyEmail: details?.applyEmail || row.client_email || 'contact@signimus.com',
    createdAt: row.created_at,
    source: 'supabase',
  };
}

async function listJobs() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('job_postings')
    .select('id, job_title, company_name, location, job_description, client_email, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return json(200, { jobs: (data || []).map(rowToJob) });
}

async function createJob(event) {
  const body = JSON.parse(event.body || '{}');
  const jobTitle = typeof body.jobTitle === 'string' ? body.jobTitle.trim() : '';
  const companyName = typeof body.companyName === 'string' ? body.companyName.trim() : 'Signimus';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const rawJobDescription = typeof body.jobDescription === 'string' ? body.jobDescription.trim() : '';
  const notifyOnResumeSubmission = Boolean(body.notifyOnResumeSubmission);
  const jobType = typeof body.jobType === 'string' ? body.jobType.trim() : '';
  const experience = typeof body.experience === 'string' ? body.experience.trim() : '';
  const salary = typeof body.salary === 'string' ? body.salary.trim() : '';
  const rawBadge = typeof body.badge === 'string' ? body.badge.trim() : 'Open';
  const badge = ['Open', 'Urgent', 'Hiring'].includes(rawBadge) ? rawBadge : 'Open';
  const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
  const responsibilities = normalizeList(body.responsibilities);
  const requirements = normalizeList(body.requirements);
  const applyEmail = typeof body.applyEmail === 'string' ? body.applyEmail.trim() : '';

  const hasStructuredJobDetails = Boolean(
    jobType ||
      experience ||
      salary ||
      badge !== 'Open' ||
      summary ||
      responsibilities.length ||
      requirements.length ||
      applyEmail
  );

  const jobDescription = hasStructuredJobDetails
    ? JSON.stringify({
        kind: 'signimus-job-details',
        type: jobType || 'Full-Time / Remote',
        experience: experience || 'Experience flexible',
        salary: salary || 'On Request',
        badge,
        summary: summary || rawJobDescription || 'New hiring requirement added by Signimus.',
        responsibilities,
        requirements,
        applyEmail: applyEmail || 'contact@signimus.com',
      })
    : rawJobDescription;

  if (!jobTitle || !companyName || !location || !jobDescription) {
    return json(400, { error: 'Missing required job posting fields' });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('job_postings')
    .insert([
      {
        job_title: jobTitle,
        company_name: companyName,
        location,
        job_description: jobDescription,
        notify_client: notifyOnResumeSubmission,
        client_email: applyEmail || null,
      },
    ])
    .select();

  if (error) throw error;
  return json(200, { message: 'Job posting created successfully', data });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});

  try {
    if (event.httpMethod === 'GET') return await listJobs();
    if (event.httpMethod === 'POST') return await createJob(event);
    return json(405, { error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Job posting function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = /missing supabase/i.test(message) ? 500 : 503;
    return json(statusCode, { error: message });
  }
};
