"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function BenchPage() {
  const router = useRouter();
  
  useEffect(() => {
    try {
      const qs = window.location.search || "";
      router.replace(`/bench${qs}`);
    } catch {
      router.replace(`/bench`);
    }
  }, [router]);

  return null;
}
