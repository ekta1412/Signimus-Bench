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
function parseSkills(value) {
  if (Array.isArray(value)) return value.map(s => String(s||'').trim()).filter(Boolean);
  if (typeof value === 'string') {
    try { return parseSkills(JSON.parse(value||'[]')); } catch { return value.split(/[;,]/).map(s=>s.trim()).filter(Boolean); }
  }
  return [];
}
function rowToProfile(row) {
  return {
    id: row.id, name: row.name, title: row.title,
    experience: row.experience||'', skills: parseSkills(row.skills),
    monthlyRate: row.monthly_rate||'On Request', resumeLink: row.resume_link||'Profile on Request',
    marketRate: row.market_rate||'80,000',
    company_type: row.company_type||'signimus',
    fulfilled_by: row.fulfilled_by||(row.company_type==='partner'?'Partner':'Signimus'),
    joinedAt: row.created_at?new Date(row.created_at).getTime():0, source:'tidb',
  };
}
function profileToRow(profile, index=0) {
  const base = String(profile.id||profile.name||'profile').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
  return [
    String(profile.id||`${base}-${Date.now().toString(36)}-${index}`).trim().slice(0,190),
    String(profile.name||'').trim().slice(0,255),
    String(profile.title||'').trim().slice(0,255),
    String(profile.experience||'0 years').trim().slice(0,120),
    JSON.stringify(parseSkills(profile.skills)),
    String(profile.monthlyRate||'On Request').trim().slice(0,120),
    String(profile.resumeLink||'Profile on Request').trim().slice(0,500),
    String(profile.marketRate||'80,000').trim().slice(0,120),
    profile.professionalSummary?String(profile.professionalSummary).trim().slice(0,1000):null,
    profile.fullExperience?String(profile.fullExperience).trim().slice(0,5000):null,
    profile.company_name?String(profile.company_name).trim().slice(0,255):null,
    String(profile.company_type||'signimus').trim().toLowerCase().slice(0,40),
    String(profile.fulfilled_by||'Signimus').trim().slice(0,120),
    profile.contact_number?String(profile.contact_number).trim().slice(0,80):null,
    profile.work_email?String(profile.work_email).trim().slice(0,255):null,
    profile.platform_fee?String(profile.platform_fee).trim().slice(0,40):null,
  ];
}
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(`CREATE TABLE IF NOT EXISTS profiles (id VARCHAR(190) PRIMARY KEY, name VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, experience VARCHAR(120), skills LONGTEXT, monthly_rate VARCHAR(120), resume_link TEXT, market_rate VARCHAR(120), summary TEXT, full_experience LONGTEXT, company_name VARCHAR(255), company_type VARCHAR(40) DEFAULT 'signimus', fulfilled_by VARCHAR(120), contact_number VARCHAR(80), work_email VARCHAR(255), platform_fee VARCHAR(40), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM profiles ORDER BY created_at DESC');
      return send(res, 200, { profiles: (rows||[]).map(rowToProfile) });
    }
    if (req.method === 'POST') {
      const body = req.body;
      const profiles = Array.isArray(body)?body:Array.isArray(body.profiles)?body.profiles:[body];
      const rows = profiles.map(profileToRow).filter(r=>r[1]&&r[2]);
      if (rows.length===0) return send(res, 400, { error: 'Name and title required' });
      // Insert one by one to avoid bulk insert issues
      let count = 0;
      for (const row of rows) {
        try {
          await conn.execute(
            `INSERT INTO profiles (id,name,title,experience,skills,monthly_rate,resume_link,market_rate,summary,full_experience,company_name,company_type,fulfilled_by,contact_number,work_email,platform_fee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),title=VALUES(title),experience=VALUES(experience),skills=VALUES(skills),monthly_rate=VALUES(monthly_rate),resume_link=VALUES(resume_link),market_rate=VALUES(market_rate)`,
            row
          );
          count++;
        } catch(e) { console.error('Row insert error:', e.message, row[1]); }
      }
      return send(res, 200, { success:true, count });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch(error) {
    console.error('profiles error:', error);
    return send(res, 500, { error: error.message });
  } finally {
    if(conn) await conn.end();
  }
}
