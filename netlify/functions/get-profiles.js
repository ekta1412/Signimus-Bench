const mysql = require('mysql2/promise');

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
};

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

async function getConnection() {
  return mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: 'VJVsC0FBMekCd5ez',
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

function rowToProfile(row) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    experience: row.experience || '',
    skills: parseSkills(row.skills),
    monthlyRate: row.monthly_rate || 'On Request',
    resumeLink: row.resume_link || 'Profile on Request',
    marketRate: row.market_rate || '80,000',
    professionalSummary: row.summary || undefined,
    fullExperience: row.full_experience || undefined,
    company_name: row.company_name || undefined,
    company_type: row.company_type || 'signimus',
    fulfilled_by: row.fulfilled_by || (row.company_type === 'partner' ? 'Partner' : 'Signimus'),
    contact_number: row.contact_number || undefined,
    work_email: row.work_email || undefined,
    platform_fee: row.platform_fee || undefined,
    joinedAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    source: 'tidb',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  let conn;
  try {
    conn = await getConnection();
    await ensureProfilesTable(conn);
    const [rows] = await conn.execute('SELECT * FROM profiles ORDER BY created_at DESC');
    return json(200, { profiles: (rows || []).map(rowToProfile) });
  } catch (error) {
    console.error('get-profiles TiDB error:', error);
    return json(500, { error: error.message || 'Unable to load profiles' });
  } finally {
    if (conn) await conn.end();
  }
};