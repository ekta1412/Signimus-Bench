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

function slugify(value) {
  return String(value || 'blog').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'blog';
}

async function getConnection() {
  return mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || '4000', 10),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true },
  });
}

async function ensureTable(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS hiring_blogs (
      id VARCHAR(160) PRIMARY KEY,
      slug VARCHAR(160) NOT NULL UNIQUE,
      skill VARCHAR(160) NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content LONGTEXT,
      read_minutes INT DEFAULT 6,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(204, {});
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (error) {
    return json(400, { error: 'Invalid JSON' });
  }

  const skill = String(body.skill || '').trim();
  const title = String(body.title || (skill ? `How to Hire ${skill} Talent` : '')).trim();
  const slug = slugify(body.slug || title || skill);
  const excerpt = String(body.excerpt || '').trim();
  const content = Array.isArray(body.content) ? body.content.map((item) => String(item || '').trim()).filter(Boolean) : [];
  const readMinutes = Number.isFinite(Number(body.readMinutes)) ? Number(body.readMinutes) : 6;

  if (!skill || !title) return json(400, { error: 'Skill and title are required' });

  let conn;
  try {
    conn = await getConnection();
    await ensureTable(conn);
    await conn.execute(
      `INSERT INTO hiring_blogs (id, slug, skill, title, excerpt, content, read_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         skill=VALUES(skill), title=VALUES(title), excerpt=VALUES(excerpt),
         content=VALUES(content), read_minutes=VALUES(read_minutes)`,
      [slug, slug, skill, title, excerpt, JSON.stringify(content), readMinutes]
    );
    return json(200, { success: true, slug });
  } catch (error) {
    console.error('add-blog error:', error);
    return json(500, { error: error.message });
  } finally {
    if (conn) await conn.end();
  }
};
