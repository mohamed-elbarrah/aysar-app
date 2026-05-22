"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          setAuthorized(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }

    check();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f6f9]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2d2e83] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ التحقق...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
