import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ProfileInput = {
  id?: string;
  name?: string;
  title?: string;
  experience?: string;
  skills?: unknown;
  monthlyRate?: string;
  resumeLink?: string;
  marketRate?: string;
  professionalSummary?: string;
  fullExperience?: string;
  company_name?: string;
  company_type?: string;
  fulfilled_by?: string;
  contact_number?: string;
  work_email?: string;
  platform_fee?: string | null;
};

type ProfilesRequestBody = ProfileInput | ProfileInput[] | { profiles?: ProfileInput[] };

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function getConnection() {
  return mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: process.env.TIDB_PASSWORD,
    database: 'signimus_jobs',
    ssl: { rejectUnauthorized: false },
  });
}

async function ensureProfilesTable(conn: mysql.Connection) {
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

function parseSkills(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((skill) => String(skill || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      return parseSkills(JSON.parse(value || "[]"));
    } catch {
      return value.split(/[;,]/).map((skill) => skill.trim()).filter(Boolean);
    }
  }
  return [];
}

function createId(profile: ProfileInput, index = 0) {
  const source = String(profile.id || profile.name || "profile")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return `${source || "profile"}-${Date.now().toString(36)}-${index}`;
}

function profileToRow(profile: ProfileInput, index = 0) {
  return {
    id: String(profile.id || createId(profile, index)).trim(),
    name: String(profile.name || "").trim(),
    title: String(profile.title || "").trim(),
    experience: String(profile.experience || "0 years").trim(),
    skills: JSON.stringify(parseSkills(profile.skills)),
    monthly_rate: String(profile.monthlyRate || "On Request").trim(),
    resume_link: String(profile.resumeLink || "Profile on Request").trim(),
    market_rate: String(profile.marketRate || "80,000").trim(),
    summary: profile.professionalSummary ? String(profile.professionalSummary).trim() : null,
    full_experience: profile.fullExperience ? String(profile.fullExperience).trim() : null,
    company_name: profile.company_name ? String(profile.company_name).trim() : null,
    company_type: String(profile.company_type || "signimus").trim().toLowerCase(),
    fulfilled_by: String(profile.fulfilled_by || "Signimus").trim(),
    contact_number: profile.contact_number ? String(profile.contact_number).trim() : null,
    work_email: profile.work_email ? String(profile.work_email).trim() : null,
    platform_fee: profile.platform_fee ? String(profile.platform_fee).trim() : null,
  };
}

function rowToProfile(row: Record<string, any>) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    experience: row.experience || "",
    skills: parseSkills(row.skills),
    monthlyRate: row.monthly_rate || "On Request",
    resumeLink: row.resume_link || "Profile on Request",
    marketRate: row.market_rate || "80,000",
    professionalSummary: row.summary || undefined,
    fullExperience: row.full_experience || undefined,
    company_name: row.company_name || undefined,
    company_type: row.company_type || "signimus",
    fulfilled_by: row.fulfilled_by || (row.company_type === "partner" ? "Partner" : "Signimus"),
    contact_number: row.contact_number || undefined,
    work_email: row.work_email || undefined,
    platform_fee: row.platform_fee || undefined,
    joinedAt: row.created_at ? new Date(row.created_at).getTime() : 0,
    source: "tidb",
  };
}

export async function GET() {
  let conn: mysql.Connection | undefined;
  try {
    conn = await getConnection();
    await ensureProfilesTable(conn);
    const [rows] = await conn.execute("SELECT * FROM profiles ORDER BY created_at DESC");
    return NextResponse.json((rows as Record<string, any>[]).map(rowToProfile));
  } catch (error) {
    console.error("api/profiles GET TiDB error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load profiles" },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.end();
  }
}

export async function POST(request: Request) {
  let conn: mysql.Connection | undefined;
  try {
    const body = (await request.json()) as ProfilesRequestBody;
    const profiles = Array.isArray(body)
      ? body
      : Array.isArray((body as { profiles?: ProfileInput[] }).profiles)
        ? (body as { profiles: ProfileInput[] }).profiles
        : [body as ProfileInput];
    const rows = profiles.map(profileToRow).filter((row) => row.name && row.title);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    conn = await getConnection();
    await ensureProfilesTable(conn);

    await conn.query(
      `INSERT INTO profiles
        (id, name, title, experience, skills, monthly_rate, resume_link, market_rate,
         summary, full_experience, company_name, company_type, fulfilled_by,
         contact_number, work_email, platform_fee)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         name=VALUES(name),
         title=VALUES(title),
         experience=VALUES(experience),
         skills=VALUES(skills),
         monthly_rate=VALUES(monthly_rate),
         resume_link=VALUES(resume_link),
         market_rate=VALUES(market_rate),
         summary=VALUES(summary),
         full_experience=VALUES(full_experience),
         company_name=VALUES(company_name),
         company_type=VALUES(company_type),
         fulfilled_by=VALUES(fulfilled_by),
         contact_number=VALUES(contact_number),
         work_email=VALUES(work_email),
         platform_fee=VALUES(platform_fee)`,
      [
        rows.map((row) => [
          row.id, row.name, row.title, row.experience, row.skills,
          row.monthly_rate, row.resume_link, row.market_rate, row.summary,
          row.full_experience, row.company_name, row.company_type,
          row.fulfilled_by, row.contact_number, row.work_email, row.platform_fee,
        ]),
      ]
    );

    return NextResponse.json({
      success: true,
      count: rows.length,
      message: rows.length === 1 ? "Profile saved to TiDB" : "Profiles saved to TiDB",
    });
  } catch (error) {
    console.error("api/profiles POST TiDB error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save profile" },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.end();
  }
}