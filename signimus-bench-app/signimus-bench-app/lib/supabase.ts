export const requiredEnv = ["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;

export function getSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  };
}

/**
 * Performs a lightweight health check against Supabase Auth settings.
 * Returns ok=false when env is missing or the endpoint is unreachable/unauthorized.
 */
export async function checkSupabaseConnectivity(): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
}> {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) {
    return { ok: false, error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" };
  }
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      // Keep this fast; avoid caching in dev
      cache: "no-store",
    });
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e: unknown) {
    return { ok: false, error: (e instanceof Error) ? e.message : "Network error" };
  }
}

import { createClient } from '@supabase/supabase-js';

const { url, key } = getSupabaseEnv();

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, key);
