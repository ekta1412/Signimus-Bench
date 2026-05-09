const mysql = require('mysql2/promise');

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

async function getConnection() {
  return mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: process.env.TIDB_PASSWORD,
    database: 'signimus_jobs',
    ssl: { rejectUnauthorized: false },
  });
}

async function ensureProfilesTable(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id VARCHAR(190) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      experience VARCHAR(120),
      skills LONGTEXT,
      monthly_rate VARCHAR(120),
      resume_link TEXT,
      market_rate VARCHAR(120),
      summary TEXT,
      full_experience LONGTEXT,
      company_name VARCHAR(255),
      company_type VARCHAR(40) DEFAULT 'signimus',
      fulfilled_by VARCHAR(120),
      contact_number VARCHAR(80),
      work_email VARCHAR(255),
      platform_fee VARCHAR(40),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX profiles_created_at_idx (created_at)
    )
  `);
}

function parseSkills(value) {
  if (Array.isArray(value)) {
    return value.map((skill) => String(skill || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    try {
      return parseSkills(JSON.parse(value || '[]'));
    } catch (error) {
      return value.split(/[;,]/).map((skill) => skill.trim()).filter(Boolean);
    }
  }
  return [];
}

function createId(profile, index = 0) {
  const source = String(profile.id || profile.name || 'profile')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return `${source || 'profile'}-${Date.now().toString(36)}-${index}`;
}

function profileToRow(profile, index = 0) {
  return {
    id: String(profile.id || createId(profile, index)).trim(),
    name: String(profile.name || '').trim(),
    title: String(profile.title || '').trim(),
    experience: String(profile.experience || '0 years').trim(),
    skills: JSON.stringify(parseSkills(profile.skills)),
    monthly_rate: String(profile.monthlyRate || 'On Request').trim(),
    resume_link: String(profile.resumeLink || 'Profile on Request').trim(),
    market_rate: String(profile.marketRate || '80,000').trim(),
    summary: profile.professionalSummary ? String(profile.professionalSummary).trim() : null,
    full_experience: profile.fullExperience ? String(profile.fullExperience).trim() : null,
    company_name: profile.company_name ? String(profile.company_name).trim() : null,
    company_type: String(profile.company_type || 'signimus').trim().toLowerCase(),
    fulfilled_by: String(profile.fulfilled_by || 'Signimus').trim(),
    contact_number: profile.contact_number ? String(profile.contact_number).trim() : null,
    work_email: profile.work_email ? String(profile.work_email).trim() : null,
    platform_fee: profile.platform_fee ? String(profile.platform_fee).trim() : null,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let conn;
  try {
    const body = JSON.parse(event.body || '{}');
    const profiles = Array.isArray(body)
      ? body
      : Array.isArray(body.profiles)
        ? body.profiles
        : [body];
    const rows = profiles.map(profileToRow).filter((row) => row.name && row.title);

    if (rows.length === 0) {
      return json(400, { error: 'Name and title are required' });
    }

    conn = await getConnection();
    await ensureProfilesTable(conn);

    await conn.query(
      `INSERT INTO profiles
        (id, name, title, experience, skills, monthly_rate, resume_link, market_rate,
         summary, full_experience, company_name, company_type, fulfilled_by,
         contact_number, work_email, platform_fee)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         name=VALUES(name),
         title=VALUES(title),
         experience=VALUES(experience),
         skills=VALUES(skills),
         monthly_rate=VALUES(monthly_rate),
         resume_link=VALUES(resume_link),
         market_rate=VALUES(market_rate),
         summary=VALUES(summary),
         full_experience=VALUES(full_experience),
         company_name=VALUES(company_name),
         company_type=VALUES(company_type),
         fulfilled_by=VALUES(fulfilled_by),
         contact_number=VALUES(contact_number),
         work_email=VALUES(work_email),
         platform_fee=VALUES(platform_fee)`,
      [
        rows.map((row) => [
          row.id, row.name, row.title, row.experience, row.skills,
          row.monthly_rate, row.resume_link, row.market_rate, row.summary,
          row.full_experience, row.company_name, row.company_type,
          row.fulfilled_by, row.contact_number, row.work_email, row.platform_fee,
        ]),
      ]
    );

    return json(200, {
      success: true,
      count: rows.length,
      message: rows.length === 1 ? 'Profile saved to TiDB' : 'Profiles saved to TiDB',
    });
  } catch (error) {
    console.error('add-profile TiDB error:', error);
    return json(500, { error: error.message || 'Unable to save profile' });
  } finally {
    if (conn) await conn.end();
  }
};