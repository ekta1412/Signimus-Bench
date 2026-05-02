"use client";

import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function BenchPage() {
  useEffect(() => {
    try {
      const qs = window.location.search || "";
      window.location.replace(`/bench/index.html${qs}`);
    } catch {
      window.location.replace(`/bench/index.html`);
    }
  }, []);

  return null;
}
