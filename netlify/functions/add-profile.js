const mysql = require('mysql2/promise');

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let profile;
  try {
    profile = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON' });
  }

  const {
    id, name, title, experience, skills,
    monthlyRate, resumeLink, marketRate,
    professionalSummary, fullExperience,
    company_name, company_type, fulfilled_by,
    contact_number, work_email, platform_fee
  } = profile;

  if (!name || !title) return json(400, { error: 'Name and title are required' });

  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  });

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(160) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        experience VARCHAR(80),
        skills LONGTEXT,
        monthly_rate VARCHAR(80),
        resume_link TEXT,
        market_rate VARCHAR(80),
        summary TEXT,
        full_experience LONGTEXT,
        company_name VARCHAR(255),
        company_type VARCHAR(40),
        fulfilled_by VARCHAR(160),
        contact_number VARCHAR(80),
        work_email VARCHAR(255),
        platform_fee VARCHAR(40),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.execute(
      `INSERT INTO profiles 
        (id, name, title, experience, skills, monthly_rate, resume_link, market_rate,
         summary, full_experience, company_name, company_type, fulfilled_by,
         contact_number, work_email, platform_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), experience=VALUES(experience), skills=VALUES(skills),
         monthly_rate=VALUES(monthly_rate), resume_link=VALUES(resume_link),
         market_rate=VALUES(market_rate), summary=VALUES(summary),
         full_experience=VALUES(full_experience), company_name=VALUES(company_name),
         company_type=VALUES(company_type), fulfilled_by=VALUES(fulfilled_by),
         contact_number=VALUES(contact_number), work_email=VALUES(work_email),
         platform_fee=VALUES(platform_fee)`,
      [
        id || `profile-${Date.now()}`,
        name, title,
        experience || '0 years',
        JSON.stringify(Array.isArray(skills) ? skills : []),
        monthlyRate || 'On Request',
        resumeLink || 'Profile on Request',
        marketRate || '80,000',
        professionalSummary || null,
        fullExperience || null,
        company_name || null,
        company_type || 'signimus',
        fulfilled_by || 'Signimus',
        contact_number || null,
        work_email || null,
        platform_fee || null,
      ]
    );
    return json(200, { success: true, message: 'Profile saved to database' });
  } finally {
    await conn.end();
  }
};
