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
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000'),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});

  let conn;
  try {
    conn = await getConnection();
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
    const [rows] = await conn.execute(
      'SELECT * FROM profiles ORDER BY created_at DESC'
    );

    const profiles = rows.map((row) => ({
      id: row.id,
      name: row.name,
      title: row.title,
      experience: row.experience || '',
      skills: (() => { try { return JSON.parse(row.skills || '[]'); } catch(e) { return []; } })(),
      monthlyRate: row.monthly_rate || 'On Request',
      resumeLink: row.resume_link || 'Profile on Request',
      marketRate: row.market_rate || '80,000',
      professionalSummary: row.summary || undefined,
      fullExperience: row.full_experience || undefined,
      company_name: row.company_name || undefined,
      company_type: row.company_type || 'signimus',
      fulfilled_by: row.company_type === 'partner' ? 'Partner' : (row.fulfilled_by || undefined),
      contact_number: row.contact_number || undefined,
      work_email: row.work_email || undefined,
      joinedAt: row.created_at ? new Date(row.created_at).getTime() : 0,
      source: 'database',
    }));

    return json(200, { profiles });
  } catch (err) {
    console.error('get-profiles error:', err);
    return json(500, { error: err.message });
  } finally {
    if (conn) await conn.end();
  }
};
