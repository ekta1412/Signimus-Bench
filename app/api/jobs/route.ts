import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function getConnection() {
  return mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
    port: 4000,
    user: '4U2qZCUDWtsTpiQ.root',
    password: process.env.TIDB_PASSWORD || 'VJVsC0FBMekCd5ez',
    database: 'signimus_jobs',
    ssl: { rejectUnauthorized: false },
  });
}

async function ensureJobsTable(conn: mysql.Connection) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(160) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(120),
      experience VARCHAR(120),
      location VARCHAR(255),
      badge VARCHAR(40),
      badge_color VARCHAR(80),
      icon_class VARCHAR(120),
      summary TEXT,
      responsibilities LONGTEXT,
      requirements LONGTEXT,
      salary VARCHAR(120),
      apply_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function getBadgeColor(badge?: string) {
  if (badge === "Urgent") return "bg-red-100 text-red-600";
  if (badge === "Hiring") return "bg-green-100 text-green-600";
  return "bg-blue-100 text-blue-600";
}

function safeParseList(value: unknown) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value || "[]") : value;
    return Array.isArray(parsed) ? parsed.map((item) => String(item || "").trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  let conn: mysql.Connection | undefined;
  try {
    conn = await getConnection();
    await ensureJobsTable(conn);
    const [rows] = await conn.execute("SELECT * FROM jobs ORDER BY created_at DESC");
    const jobs = (rows as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type || "Full-Time / Remote",
      experience: row.experience || "Experience flexible",
      location: row.location || "Remote (India)",
      badge: row.badge || "Open",
      badgeColor: row.badge_color || getBadgeColor(row.badge),
      iconClass: row.icon_class || "fas fa-briefcase",
      summary: row.summary || "",
      responsibilities: safeParseList(row.responsibilities),
      requirements: safeParseList(row.requirements),
      salary: row.salary || "On Request",
      applyEmail: row.apply_email || "contact@signimus.com",
      createdAt: row.created_at,
      source: "database",
    }));
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("api/jobs GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load jobs" },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.end();
  }
}

export async function POST(request: Request) {
  let conn: mysql.Connection | undefined;
  try {
    const job = await request.json();
    if (!job.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const id = job.id || job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 160);

    conn = await getConnection();
    await ensureJobsTable(conn);

    await conn.execute(
      `INSERT INTO jobs (id, title, type, experience, location, badge, badge_color, icon_class, summary, responsibilities, requirements, salary, apply_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), type=VALUES(type), experience=VALUES(experience),
         location=VALUES(location), badge=VALUES(badge), badge_color=VALUES(badge_color),
         icon_class=VALUES(icon_class), summary=VALUES(summary),
         responsibilities=VALUES(responsibilities), requirements=VALUES(requirements),
         salary=VALUES(salary), apply_email=VALUES(apply_email)`,
      [
        id, job.title, job.type || '', job.experience || '', job.location || '',
        job.badge || 'Open', job.badgeColor || getBadgeColor(job.badge), job.iconClass || 'fas fa-briefcase',
        job.summary || '',
        JSON.stringify(job.responsibilities || []),
        JSON.stringify(job.requirements || []),
        job.salary || '', job.applyEmail || 'contact@signimus.com'
      ]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("api/jobs POST error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save job" }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}