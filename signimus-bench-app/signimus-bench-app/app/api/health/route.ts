export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { checkSupabaseConnectivity } from "@/lib/supabase";

export async function GET(request: Request): Promise<Response> {
  try {
    const now = new Date().toISOString();
    const ua = request.headers.get("user-agent");
    // Check Supabase connection status
    const supabase = await checkSupabaseConnectivity();
    if (!supabase.ok) {
      // Log error to stdout for local dev/debug
      console.error("Supabase health error", supabase);
      return new Response(
        JSON.stringify({ ok: false, error: supabase.error || "Supabase unreachable", details: supabase, timestamp: now, userAgent: ua || null }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ ok: true, message: "Edge health OK - Supabase Connected", timestamp: now, userAgent: ua || null }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    let errorPayload: Record<string, unknown> = {};
    if (err instanceof Error) {
      errorPayload = {
        message: err.message,
        stack: err.stack,
        name: err.name,
      };
    } else {
      errorPayload = { message: 'Unknown error', raw: String(err) };
    }
    // For visibility in local dev
    console.error("/api/health caught error", errorPayload);
    return new Response(
      JSON.stringify({ ok: false, error: errorPayload }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
