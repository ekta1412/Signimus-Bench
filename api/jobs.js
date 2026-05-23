const mysql = require('mysql2/promise');
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};
function send(res, status, body) {
  res.status(status);
  Object.entries(headers).forEach(([k,v]) => res.setHeader(k,v));
  res.json(body);
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
function safeParseList(value) {
  try { const p = JSON.parse(value||'[]'); return Array.isArray(p)?p:[]; } catch { return []; }
}
function getBadgeColor(badge) {
  if (badge==='Urgent') return 'bg-red-100 text-red-600';
  if (badge==='Hiring') return 'bg-green-100 text-green-600';
  return 'bg-blue-100 text-blue-600';
}
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(`CREATE TABLE IF NOT EXISTS jobs (id VARCHAR(160) PRIMARY KEY, title VARCHAR(255) NOT NULL, type VARCHAR(120), experience VARCHAR(120), location VARCHAR(255), badge VARCHAR(40), badge_color VARCHAR(80), icon_class VARCHAR(120), summary TEXT, responsibilities LONGTEXT, requirements LONGTEXT, salary VARCHAR(120), apply_email VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM jobs ORDER BY created_at DESC');
      const jobs = rows.map(row => ({
        id: row.id, title: row.title, type: row.type||'Full-Time / Remote',
        experience: row.experience||'Experience flexible', location: row.location||'Remote (India)',
        badge: row.badge||'Open', badgeColor: row.badge_color||getBadgeColor(row.badge),
        iconClass: row.icon_class||'fas fa-briefcase', summary: row.summary||'',
        responsibilities: safeParseList(row.responsibilities),
        requirements: safeParseList(row.requirements),
        salary: row.salary||'On Request', applyEmail: row.apply_email||'contact@signimus.com',
      }));
      return send(res, 200, { jobs });
    }
    if (req.method === 'POST') {
      const body = req.body;
      const title = String(body.title||body.jobTitle||'').trim();
      if (!title) return send(res, 400, { error: 'Job title is required' });
      const id = Date.now().toString(36)+Math.random().toString(36).slice(2);
      const badge = ['Open','Urgent','Hiring'].includes(body.badge)?body.badge:'Open';
      await conn.execute(
        `INSERT INTO jobs (id,title,type,experience,location,badge,badge_color,icon_class,summary,responsibilities,requirements,salary,apply_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [id, title, String(body.type||'Full-Time / Remote').trim(),
         String(body.experience||'Experience flexible').trim(),
         String(body.location||'Remote (India)').trim(),
         badge, getBadgeColor(badge),
         String(body.iconClass||'fas fa-briefcase').trim(),
         String(body.summary||'').trim(),
         JSON.stringify(Array.isArray(body.responsibilities)?body.responsibilities:['Role responsibilities will be discussed during screening.']),
         JSON.stringify(Array.isArray(body.requirements)?body.requirements:['Relevant experience and strong communication skills.']),
         String(body.salary||'On Request').trim(),
         String(body.applyEmail||'contact@signimus.com').trim()]
      );
      return send(res, 200, { message: 'Job saved', id });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch(error) {
    console.error('jobs error:', error);
    return send(res, 500, { error: error.message });
  } finally {
    if(conn) await conn.end();
  }
}
