import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ProfileInput = {
  id?: string;
  name?: string;
  title?: string;
  experience?: string;
  skills?: string[];
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

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function getConnection() {
  return mysql.createConnection({
    host: getRequiredEnv("TIDB_HOST"),
    port: parseInt(process.env.TIDB_PORT || "4000", 10),
    user: getRequiredEnv("TIDB_USER"),
    password: getRequiredEnv("TIDB_PASSWORD"),
    database: getRequiredEnv("TIDB_DATABASE"),
    ssl: { rejectUnauthorized: true },
  });
}

async function ensureProfilesTable(conn: mysql.Connection) {
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
}

function parseSkills(value: unknown) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value || "[]") : value;
    return Array.isArray(parsed) ? parsed.map((skill) => String(skill || "").trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  let conn: mysql.Connection | undefined;
  try {
    conn = await getConnection();
    await ensureProfilesTable(conn);
    const [rows] = await conn.execute("SELECT * FROM profiles ORDER BY created_at DESC");

    const profiles = (rows as any[]).map((row) => ({
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
      fulfilled_by: row.company_type === "partner" ? "Partner" : row.fulfilled_by || undefined,
      contact_number: row.contact_number || undefined,
      work_email: row.work_email || undefined,
      platform_fee: row.platform_fee || undefined,
      joinedAt: row.created_at ? new Date(row.created_at).getTime() : 0,
      source: "database",
    }));

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("api/profiles GET error:", error);
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
    const profile = (await request.json()) as ProfileInput;
    const {
      id,
      name,
      title,
      experience,
      skills,
      monthlyRate,
      resumeLink,
      marketRate,
      professionalSummary,
      fullExperience,
      company_name,
      company_type,
      fulfilled_by,
      contact_number,
      work_email,
      platform_fee,
    } = profile;

    if (!name || !title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    conn = await getConnection();
    await ensureProfilesTable(conn);
    await conn.execute(
      `INSERT INTO profiles
        (id, name, title, experience, skills, monthly_rate, resume_link, market_rate,
         summary, full_experience, company_name, company_type, fulfilled_by,
         contact_number, work_email, platform_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), experience=VALUES(experience), skills=VALUES(skills),
         monthly_rate=VALUES(monthly_rate), resume_link=VALUES(resume_link),
         market_rate=VALUES(market_rate), summary=VALUES(summary),
         full_experience=VALUES(full_experience), company_name=VALUES(company_name),
         company_type=VALUES(company_type), fulfilled_by=VALUES(fulfilled_by),
         contact_number=VALUES(contact_number), work_email=VALUES(work_email),
         platform_fee=VALUES(platform_fee)`,
      [
        id || `profile-${Date.now()}`,
        name,
        title,
        experience || "0 years",
        JSON.stringify(Array.isArray(skills) ? skills : []),
        monthlyRate || "On Request",
        resumeLink || "Profile on Request",
        marketRate || "80,000",
        professionalSummary || null,
        fullExperience || null,
        company_name || null,
        company_type || "signimus",
        fulfilled_by || "Signimus",
        contact_number || null,
        work_email || null,
        platform_fee || null,
      ]
    );

    return NextResponse.json({ success: true, message: "Profile saved to database" });
  } catch (error) {
    console.error("api/profiles POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save profile" },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.end();
  }
}
