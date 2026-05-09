import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
