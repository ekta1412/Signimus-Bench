import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // uses service role key; cannot run on Edge
export const dynamic = "force-dynamic";

function json(status: number, body: Record<string, unknown>) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return json(400, { ok: false, error: "Missing email or password" });
    }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || (!serviceRole && !anonKey)) {
      return json(500, { ok: false, error: "Missing Supabase URL or key" });
    }

    if (!serviceRole) {
      const client = createClient(url, anonKey as string, { auth: { persistSession: false } });
      const { data, error } = await client.auth.signUp({ email, password });

      if (error) {
        const msg = String(error.message || "Unknown error");
        if (/already\s+registered|duplicate|exists|already exists/i.test(msg)) {
          return json(200, { ok: true, alreadyExisted: true });
        }
        return json(200, { ok: false, error: msg });
      }

      return json(200, {
        ok: true,
        userId: data.user?.id,
        needsEmailConfirmation: !data.session,
      });
    }

    const admin = createClient(url, serviceRole, { auth: { persistSession: false } });

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      const msg = String((error as { message?: string })?.message || error || "Unknown error");
      if (/already\s+registered|duplicate|exists|already exists/i.test(msg)) {
        return json(200, { ok: true, alreadyExisted: true });
      }
      return json(200, { ok: false, error: msg });
    }

    return json(200, { ok: true, userId: data.user?.id });
  } catch (e: unknown) {
    return json(500, { ok: false, error: (e instanceof Error) ? e.message : "Unknown error" });
  }
}
