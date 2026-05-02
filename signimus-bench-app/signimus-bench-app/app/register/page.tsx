"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Registration failed");
      }
      setSuccess(true);

      // auto-login for smoother UX
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Auto login failed", error.message);
      }

      // Notify admin of new registration (best effort)
      fetch("/api/notify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});

      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      // Fallback: attempt client-side sign up then sign in.
      // If email confirmation is required, sign-in may fail; in that case, show success message and stop.
      try {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw new Error(signUpErr.message);

        // Best-effort admin notification (non-blocking)
        fetch("/api/notify-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).catch(() => {});

        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr) {
          window.location.href = "/dashboard";
          return;
        }
        // Sign-in blocked (likely email confirmation). Consider registration successful and inform the user.
        setSuccess(true);
        return;
      } catch (fallbackErr: unknown) {
        setError(((err instanceof Error) ? err.message : String(err) || "Registration error") + "; fallback failed: " + ((fallbackErr instanceof Error) ? fallbackErr.message : String(fallbackErr) || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleRegister} className="bg-slate-50 p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded px-4 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Registration successful! Check your email to confirm.</p>}
      </form>
    </main>
  );
}
