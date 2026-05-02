const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let conn;
  try {
    const job = JSON.parse(event.body);
    conn = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    });

    const id = uuidv4();
    await conn.execute(
      `INSERT INTO jobs 
        (id, title, type, experience, location, badge, badge_color,
         icon, icon_class, summary, responsibilities, requirements, 
         salary, apply_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        job.title,
        job.type || '',
        job.experience || '',
        job.location || '',
        job.badge || 'New',
        job.badgeColor || 'bg-blue-100 text-blue-600',
        job.icon || '💼',
        job.iconClass || '',
        job.summary || '',
        JSON.stringify(job.responsibilities || []),
        JSON.stringify(job.requirements || []),
        job.salary || 'On Request',
        job.applyEmail || 'contact@signimus.com'
      ]
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, id })
    };

  } catch (err) {
    console.error('DB Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  } finally {
    if (conn) await conn.end();
  }
};