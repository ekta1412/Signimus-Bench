module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkSupabaseConnectivity",
    ()=>checkSupabaseConnectivity,
    "getSupabaseEnv",
    ()=>getSupabaseEnv,
    "requiredEnv",
    ()=>requiredEnv,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript) <locals>");
;
;
const requiredEnv = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
];
function readStagingEnv() {
    try {
        const envPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), "staging.env");
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])(envPath)) return {};
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["readFileSync"])(envPath, "utf8").split(/\r?\n/).reduce((acc, line)=>{
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
function isLocalSupabaseUrl(url) {
    return Boolean(url && /127\.0\.0\.1|localhost/.test(url));
}
function getSupabaseEnv() {
    const stagingEnv = readStagingEnv();
    const envUrl = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://xcjcqakmozslobggcmgh.supabase.co");
    const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjamNxYWttb3pzbG9iZ2djbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODA4MDIsImV4cCI6MjA3MDg1NjgwMn0.k4snZMw53y_1WgPhHFULiT-XW73kEP78AEQDj7VueTg");
    if (!envUrl || isLocalSupabaseUrl(envUrl)) {
        return {
            url: stagingEnv.SUPABASE_URL || stagingEnv.NEXT_PUBLIC_SUPABASE_URL || envUrl,
            key: stagingEnv.SUPABASE_SERVICE_ROLE_KEY || stagingEnv.SUPABASE_ANON_KEY || stagingEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || envKey
        };
    }
    return {
        url: envUrl,
        key: envKey
    };
}
async function checkSupabaseConnectivity() {
    const { url, key } = getSupabaseEnv();
    if (!url || !key) {
        return {
            ok: false,
            error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY"
        };
    }
    try {
        const res = await fetch(`${url}/auth/v1/settings`, {
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`
            },
            // Keep this fast; avoid caching in dev
            cache: "no-store"
        });
        return {
            ok: res.ok,
            status: res.status,
            error: res.ok ? undefined : `HTTP ${res.status}`
        };
    } catch (e) {
        return {
            ok: false,
            error: e instanceof Error ? e.message : "Network error"
        };
    }
}
;
const { url, key } = getSupabaseEnv();
if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}
const fetchWithTimeout = async (input, init = {})=>{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 10000);
    try {
        return await fetch(input, {
            ...init,
            signal: init.signal || controller.signal
        });
    } finally{
        clearTimeout(timeout);
    }
};
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key, {
    global: {
        fetch: fetchWithTimeout
    }
});
}),
"[project]/app/api/job-posting/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
function normalizeList(value) {
    if (!Array.isArray(value)) return [];
    return value.map((item)=>String(item || "").trim()).filter(Boolean).slice(0, 10);
}
function getBadgeColor(badge) {
    if (badge === "Urgent") return "bg-red-100 text-red-600";
    if (badge === "Hiring") return "bg-green-100 text-green-600";
    return "bg-blue-100 text-blue-600";
}
function parseJobDescription(value) {
    try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object" && parsed.kind === "signimus-job-details") {
            return parsed;
        }
    } catch  {
    // Older rows store a plain job description string.
    }
    return null;
}
async function GET() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('job_postings').select('id, job_title, company_name, location, job_description, client_email, created_at').order('created_at', {
            ascending: false
        });
        if (error) {
            console.error('Error fetching job postings:', error);
            return new Response(JSON.stringify({
                error: error.message
            }), {
                status: 500
            });
        }
        const jobs = (data || []).map((row)=>{
            const details = parseJobDescription(row.job_description || "");
            const badge = details?.badge || "Open";
            const summary = details?.summary || row.job_description || "New hiring requirement added by Signimus.";
            return {
                id: row.id,
                title: row.job_title,
                companyName: row.company_name,
                type: details?.type || "Full-Time / Remote",
                experience: details?.experience || "Experience flexible",
                location: row.location,
                badge,
                badgeColor: getBadgeColor(badge),
                iconClass: "fas fa-briefcase",
                summary,
                responsibilities: normalizeList(details?.responsibilities).length > 0 ? normalizeList(details?.responsibilities) : [
                    "Role responsibilities will be discussed during screening."
                ],
                requirements: normalizeList(details?.requirements).length > 0 ? normalizeList(details?.requirements) : [
                    "Relevant experience and strong communication skills."
                ],
                salary: details?.salary || "On Request",
                applyEmail: details?.applyEmail || row.client_email || "contact@signimus.com",
                createdAt: row.created_at,
                source: "supabase"
            };
        });
        return new Response(JSON.stringify({
            jobs
        }), {
            status: 200
        });
    } catch (e) {
        console.error('Error processing job list request:', e);
        const message = e instanceof Error ? e.message : "Unknown error";
        const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
        return new Response(JSON.stringify({
            error: message
        }), {
            status
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";
        const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "Signimus";
        const location = typeof body.location === "string" ? body.location.trim() : "";
        const rawJobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
        const notifyOnResumeSubmission = Boolean(body.notifyOnResumeSubmission);
        const jobType = typeof body.jobType === "string" ? body.jobType.trim() : "";
        const experience = typeof body.experience === "string" ? body.experience.trim() : "";
        const salary = typeof body.salary === "string" ? body.salary.trim() : "";
        const badge = typeof body.badge === "string" ? body.badge.trim() : "Open";
        const summary = typeof body.summary === "string" ? body.summary.trim() : "";
        const responsibilities = normalizeList(body.responsibilities);
        const requirements = normalizeList(body.requirements);
        const applyEmail = typeof body.applyEmail === "string" ? body.applyEmail.trim() : "";
        const hasStructuredJobDetails = Boolean(jobType || experience || salary || badge !== "Open" || summary || responsibilities.length || requirements.length || applyEmail);
        const jobDescription = hasStructuredJobDetails ? JSON.stringify({
            kind: "signimus-job-details",
            type: jobType || "Full-Time / Remote",
            experience: experience || "Experience flexible",
            salary: salary || "On Request",
            badge: [
                "Open",
                "Urgent",
                "Hiring"
            ].includes(badge) ? badge : "Open",
            summary: summary || rawJobDescription || "New hiring requirement added by Signimus.",
            responsibilities,
            requirements,
            applyEmail: applyEmail || "contact@signimus.com"
        }) : rawJobDescription;
        if (!jobTitle || !companyName || !location || !jobDescription) {
            return new Response(JSON.stringify({
                error: "Missing required job posting fields"
            }), {
                status: 400
            });
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('job_postings').insert([
            {
                job_title: jobTitle,
                company_name: companyName,
                location,
                job_description: jobDescription,
                notify_client: notifyOnResumeSubmission,
                client_email: applyEmail || null
            }
        ]).select();
        if (error) {
            console.error('Error inserting data:', error);
            return new Response(JSON.stringify({
                error: error.message
            }), {
                status: 500
            });
        }
        return new Response(JSON.stringify({
            message: 'Job posting created successfully',
            data
        }), {
            status: 200
        });
    } catch (e) {
        console.error('Error processing request:', e);
        const message = e instanceof Error ? e.message : "Unknown error";
        const status = /fetch failed|network|econnrefused|enotfound|timeout/i.test(message) ? 503 : 500;
        return new Response(JSON.stringify({
            error: message
        }), {
            status
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00qjvlt._.js.map