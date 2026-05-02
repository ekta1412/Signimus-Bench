const mysql = require('mysql2/promise');

exports.handler = async () => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: parseInt(process.env.TIDB_PORT || '4000'),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      ssl: { rejectUnauthorized: true }
    });

    const [rows] = await conn.execute(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );

    const jobs = rows.map(job => ({
      id: job.id,
      title: job.title,
      type: job.type,
      experience: job.experience,
      location: job.location,
      badge: job.badge,
      badgeColor: job.badge_color,
      icon: job.icon || '',
      iconClass: job.icon_class || '',
      summary: job.summary,
      responsibilities: JSON.parse(job.responsibilities || '[]'),
      requirements: JSON.parse(job.requirements || '[]'),
      salary: job.salary,
      applyEmail: job.apply_email,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ jobs })
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