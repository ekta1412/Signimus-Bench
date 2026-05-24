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
  if (status === 200 && res.req && res.req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  }
  res.json(body);
}
let cachedConn = null;
async function getConnection() {
  if (cachedConn) { try { await cachedConn.ping(); return cachedConn; } catch { cachedConn = null; } }
  cachedConn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: 'VJVsC0FBMekCd5ez',
    database: 'signimus_jobs',
    ssl: { rejectUnauthorized: false },
    connectTimeout: 10000,
  });
  return cachedConn;
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
    marketRate: row.market_rate||'80,000', professionalSummary: row.summary||undefined,
    fullExperience: row.full_experience||undefined, company_name: row.company_name||undefined,
    company_type: row.company_type||'signimus',
    fulfilled_by: row.fulfilled_by||(row.company_type==='partner'?'Partner':'Signimus'),
    contact_number: row.contact_number||undefined, work_email: row.work_email||undefined,
    platform_fee: row.platform_fee||undefined,
    joinedAt: row.created_at?new Date(row.created_at).getTime():0, source:'tidb',
  };
}
function profileToRow(profile, index=0) {
  const id = String(profile.id||profile.name||'profile').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
  return {
    id: String(profile.id||`${id}-${Date.now().toString(36)}-${index}`).trim(),
    name: String(profile.name||'').trim(), title: String(profile.title||'').trim(),
    experience: String(profile.experience||'0 years').trim(),
    skills: JSON.stringify(parseSkills(profile.skills)),
    monthly_rate: String(profile.monthlyRate||'On Request').trim(),
    resume_link: String(profile.resumeLink||'Profile on Request').trim(),
    market_rate: String(profile.marketRate||'80,000').trim(),
    summary: profile.professionalSummary?String(profile.professionalSummary).trim():null,
    full_experience: profile.fullExperience?String(profile.fullExperience).trim():null,
    company_name: profile.company_name?String(profile.company_name).trim():null,
    company_type: String(profile.company_type||'signimus').trim().toLowerCase(),
    fulfilled_by: String(profile.fulfilled_by||'Signimus').trim(),
    contact_number: profile.contact_number?String(profile.contact_number).trim():null,
    work_email: profile.work_email?String(profile.work_email).trim():null,
    platform_fee: profile.platform_fee?String(profile.platform_fee).trim():null,
  };
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
      const rows = profiles.map(profileToRow).filter(r=>r.name&&r.title);
      if (rows.length===0) return send(res, 400, { error: 'Name and title required' });
      await conn.query(`INSERT INTO profiles (id,name,title,experience,skills,monthly_rate,resume_link,market_rate,summary,full_experience,company_name,company_type,fulfilled_by,contact_number,work_email,platform_fee) VALUES ? ON DUPLICATE KEY UPDATE name=VALUES(name),title=VALUES(title),experience=VALUES(experience),skills=VALUES(skills),monthly_rate=VALUES(monthly_rate),resume_link=VALUES(resume_link),market_rate=VALUES(market_rate),summary=VALUES(summary),full_experience=VALUES(full_experience),company_name=VALUES(company_name),company_type=VALUES(company_type),fulfilled_by=VALUES(fulfilled_by),contact_number=VALUES(contact_number),work_email=VALUES(work_email),platform_fee=VALUES(platform_fee)`,
        [rows.map(r=>[r.id,r.name,r.title,r.experience,r.skills,r.monthly_rate,r.resume_link,r.market_rate,r.summary,r.full_experience,r.company_name,r.company_type,r.fulfilled_by,r.contact_number,r.work_email,r.platform_fee])]);
      cachedConn = null;
      return send(res, 200, { success:true, count:rows.length });
    }
    return send(res, 405, { error: 'Method not allowed' });
  } catch(error) {
    cachedConn = null;
    console.error('profiles error:', error);
    return send(res, 500, { error: error.message });
  }
}
