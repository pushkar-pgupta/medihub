// app/after-signin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AfterSignIn() {
  const search = useSearchParams();
  const roleFromUrl = search.get("role") || null;
  const invite = search.get("invite") || undefined; // optional invite passed in URL
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return; // wait until Clerk session is ready

    (async () => {
      try {
        const currentRole = (user?.publicMetadata?.role as string | undefined) || null;

        // If no role assigned and a role was requested via URL, try to set it
        if (!currentRole && roleFromUrl) {
          const res = await fetch("/api/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: roleFromUrl, invite }),
          });
          const json = await res.json();
          if (!res.ok || !json.ok) {
            setErr(json.error || "Failed to set role");
            setLoading(false);
            return;
          }
        }

        // Wait a tiny bit for Clerk session to refresh (or force reload)
        // Clerk session may not immediately reflect publicMetadata changes;
        // a safe approach: reload to refresh session.
        // If you prefer, you can call clerkClient on server to fetch, but reload is simple.
        // Redirect to role dashboard:
        const target =
          (user?.publicMetadata?.role as string | undefined) ||
          roleFromUrl ||
          "citizen";

        // Ensure the UI sees the new metadata: reload before redirect to pick up updates.
        window.location.href = `/${target}`;
      } catch (e: any) {
        setErr(e.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, roleFromUrl, invite, router]);

  if (loading) return <div style={{ padding: 24 }}>Signing you in & assigning role…</div>;
  if (err) return <div style={{ padding: 24 }}>Error: {err}</div>;
  return <div style={{ padding: 24 }}>Done — redirecting…</div>;
}
