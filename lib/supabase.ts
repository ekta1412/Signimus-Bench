import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const requiredEnv = ["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;

function readStagingEnv() {
  try {
    const envPath = join(process.cwd(), "staging.env");
    if (!existsSync(envPath)) return {};

    return readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .reduce<Record<string, string>>((acc, line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return acc;
        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) return acc;
        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();
        if (key) acc[key] = value;
        return acc;
      }, {});
  } catch (error) {
    console.warn("Unable to read staging.env fallback.", error);
    return {};
  }
}

function isLocalSupabaseUrl(url?: string) {
  return Boolean(url && /127\.0\.0\.1|localhost/.test(url));
}

function isPlaceholderValue(value?: string) {
  return Boolean(
    value &&
      (/^your[_-]/i.test(value) ||
        /_here$/i.test(value) ||
        value.includes("your_") ||
        value.includes("your-"))
  );
}

function getUsableEnvValue(value?: string) {
  const trimmed = value?.trim();
  return trimmed && !isPlaceholderValue(trimmed) ? trimmed : undefined;
}

function getUsableUrl(value?: string) {
  const candidate = getUsableEnvValue(value);
  if (!candidate) return undefined;
  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function getSupabaseEnv() {
  const stagingEnv = readStagingEnv();
  const envUrl = getUsableUrl(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const envKey =
    getUsableEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    getUsableEnvValue(process.env.SUPABASE_ANON_KEY) ||
    getUsableEnvValue(process.env.SUPABASE_KEY) ||
    getUsableEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const stagingUrl = getUsableUrl(stagingEnv.SUPABASE_URL || stagingEnv.NEXT_PUBLIC_SUPABASE_URL);
  const stagingKey =
    getUsableEnvValue(stagingEnv.SUPABASE_SERVICE_ROLE_KEY) ||
    getUsableEnvValue(stagingEnv.SUPABASE_ANON_KEY) ||
    getUsableEnvValue(stagingEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!envUrl || isLocalSupabaseUrl(envUrl)) {
    return {
      url: stagingUrl || envUrl,
      key: stagingKey || envKey,
    };
  }

  return {
    url: envUrl,
    key: envKey,
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

const fetchWithTimeout: typeof fetch = async (input, init = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal || controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

function createMissingSupabaseClient(): ReturnType<typeof createClient> {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
      },
    }
  ) as ReturnType<typeof createClient>;
}

export const supabase = url && key
  ? createClient(url, key, {
      global: {
        fetch: fetchWithTimeout,
      },
    })
  : createMissingSupabaseClient();
