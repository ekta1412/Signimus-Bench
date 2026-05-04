const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

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
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  let conn;
  try {
    const body = JSON.parse(event.body || '{}');
    const name = String(body.name || '').trim();
    const title = String(body.title || '').trim();
    if (!name || !title) return json(400, { error: 'Name and title are required' });

    const skills = Array.isArray(body.skills) ? body.skills : [];
    const id = uuidv4();

    conn = await getConnection();
    await conn.execute(
      `INSERT INTO profiles (id, name, title, experience, skills, monthly_rate, resume_link, market_rate, summary, full_experience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        title,
        String(body.experience || '').trim(),
        JSON.stringify(skills),
        String(body.monthlyRate || 'On Request').trim(),
        String(body.resumeLink || 'Profile on Request').trim(),
        String(body.marketRate || '80,000').trim(),
        String(body.professionalSummary || '').trim(),
        String(body.fullExperience || '').trim(),
      ]
    );

    return json(200, { success: true, id });
  } catch (err) {
    console.error('add-profile error:', err);
    return json(500, { error: err.message });
  } finally {
    if (conn) await conn.end();
  }
};
