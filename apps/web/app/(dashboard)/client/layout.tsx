"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type MeResponse = {
  name?: string | null;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    return origin.includes("localhost")
      ? `http://localhost:3003${path}`
      : `${origin}${path}`;
  }

  return path;
}

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Client");

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.replace("/login");
        return;
      }

      let user: { role?: string; name?: string } = {};
      try {
        user = JSON.parse(storedUser);
      } catch {
        router.replace("/login");
        return;
      }

      if (user.role !== "CLIENT") {
        router.replace(`/${user.role === "PROVIDER" ? "provider" : "admin"}`);
        return;
      }

      setAuthorized(true);
      if (user.name) setUserName(user.name);

      try {
        const res = await fetch(resolveApiUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const me: MeResponse = await res.json();
          if (me.name?.trim()) setUserName(me.name.trim());
        }
      } catch {
        // keep fallback name from localStorage if API is unavailable
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  if (!authorized || loading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading workspace...</div>
    );
  }

  return (
    <DashboardLayout userType="client" userName={userName}>
      <div className="space-y-6">{children}</div>
    </DashboardLayout>
  );
}
