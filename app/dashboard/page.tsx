"use client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      window.location.href = "/";
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/";
      } else {
        setUser(data.user);
      }
    });
  }, []);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      window.location.href = "/";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl flex flex-col gap-4 border border-slate-200">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p className="text-slate-700">{user ? `Logged in as ${user.email}` : "Loading..."}</p>
        <button onClick={signOut} className="bg-slate-800 text-white rounded px-4 py-2 w-fit">Sign Out</button>
      </div>
    </main>
  );
}
