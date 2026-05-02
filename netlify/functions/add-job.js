const { handler: jobPostingHandler } = require('./job-posting');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const job = JSON.parse(event.body || '{}');
    const payload = {
      jobTitle: job.jobTitle || job.title,
      companyName: job.companyName || 'Signimus',
      location: job.location,
      jobDescription: job.jobDescription || job.summary || 'New hiring requirement added by Signimus.',
      jobType: job.jobType || job.type,
      experience: job.experience,
      salary: job.salary,
      badge: job.badge,
      summary: job.summary,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      applyEmail: job.applyEmail,
      notifyOnResumeSubmission: Boolean(job.notifyOnResumeSubmission),
    };

    return jobPostingHandler({
      ...event,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Add job function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
