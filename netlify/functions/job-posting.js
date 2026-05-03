const mysql = require('mysql2/promise');

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

async function getConnection() {
  return mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  });
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

function safeParseList(value) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

async function listJobs() {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );
    const jobs = rows.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type || 'Full-Time / Remote',
      experience: row.experience || 'Experience flexible',
      location: row.location || 'Remote (India)',
      badge: row.badge || 'Open',
      badgeColor: row.badge_color || getBadgeColor(row.badge),
      iconClass: row.icon_class || 'fas fa-briefcase',
      summary: row.summary || '',
      responsibilities: safeParseList(row.responsibilities),
      requirements: safeParseList(row.requirements),
      salary: row.salary || 'On Request',
      applyEmail: row.apply_email || 'contact@signimus.com',
      createdAt: row.created_at,
    }));
    return json(200, { jobs });
  } catch (error) {
    console.error('listJobs error:', error);
    return json(500, { error: error.message });
  } finally {
    if (conn) await conn.end();
  }
}

async function createJob(event) {
  let conn;
  try {
    const body = JSON.parse(event.body || '{}');
    const title = String(body.title || body.jobTitle || '').trim();
    const type = String(body.type || body.jobType || 'Full-Time / Remote').trim();
    const experience = String(body.experience || 'Experience flexible').trim();
    const location = String(body.location || 'Remote (India)').trim();
    const rawBadge = String(body.badge || 'Open').trim();
    const badge = ['Open', 'Urgent', 'Hiring'].includes(rawBadge) ? rawBadge : 'Open';
    const summary = String(body.summary || '').trim();
    const responsibilities = normalizeList(body.responsibilities);
    const requirements = normalizeList(body.requirements);
    const salary = String(body.salary || 'On Request').trim();
    const applyEmail = String(body.applyEmail || 'contact@signimus.com').trim();
    const iconClass = String(body.iconClass || 'fas fa-briefcase').trim();
    const badgeColor = getBadgeColor(badge);

    if (!title) {
      return json(400, { error: 'Job title is required' });
    }

    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    conn = await getConnection();
    await conn.execute(
      `INSERT INTO jobs 
        (id, title, type, experience, location, badge, badge_color,
         icon_class, summary, responsibilities, requirements, salary, apply_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, title, type, experience, location, badge, badgeColor,
        iconClass, summary,
        JSON.stringify(responsibilities.length ? responsibilities : ['Role responsibilities will be discussed during screening.']),
        JSON.stringify(requirements.length ? requirements : ['Relevant experience and strong communication skills.']),
        salary, applyEmail,
      ]
    );

    return json(200, { message: 'Job saved successfully', id });
  } catch (error) {
    console.error('createJob error:', error);
    return json(500, { error: error.message });
  } finally {
    if (conn) await conn.end();
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});

  try {
    if (event.httpMethod === 'GET') return await listJobs();
    if (event.httpMethod === 'POST') return await createJob(event);
    return json(405, { error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Job posting function error:', error);
    return json(503, { error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
