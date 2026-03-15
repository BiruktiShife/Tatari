"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AdminQuickStats } from "@/components/dashboard/AdminQuickStats";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type SummaryResponse = {
  totalUsers: number;
  activeJobs: number;
  totalRevenue: number;
  disputeCases: number;
  pendingProviders: number;
  recentPendingProviders: { id: string; name: string; createdAt: string }[];
  recentDisputes: { id: string; title: string; status: string; createdAt: string }[];
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
      throw err;
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

function formatRelative(dateStr: string) {
  const date = new Date(dateStr).getTime();
  if (Number.isNaN(date)) return "Recently";
  const mins = Math.max(1, Math.floor((Date.now() - date) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    if (user.role !== "ADMIN") {
      router.replace(`/${user.role === "CLIENT" ? "client" : "provider"}`);
      return;
    }

    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing admin token. Please log in again.");
          setSummary(null);
          return;
        }
        const res = await fetch(resolveApiUrl("/admin/users/summary"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load summary.");
        }
        const data: SummaryResponse = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary.");
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [authorized]);

  const stats = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: "Total Users",
        value: String(summary.totalUsers),
        change: `${summary.pendingProviders} pending providers`,
        icon: "users",
      },
      {
        title: "Active Jobs",
        value: String(summary.activeJobs),
        change: "Across all active statuses",
        icon: "briefcase",
      },
      {
        title: "Platform Revenue",
        value: `$${summary.totalRevenue}`,
        change: "Revenue tracking not configured",
        icon: "dollar",
      },
      {
        title: "Dispute Cases",
        value: String(summary.disputeCases),
        change: "Open, investigating, escalated",
        icon: "star",
      },
    ];
  }, [summary]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage the Habesha Skills Hub platform
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading summary...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <StatsCards stats={stats} />
      )}

      <AdminQuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Pending Verifications</h3>
          <div className="space-y-3">
            {summary?.recentPendingProviders?.length ? (
              summary.recentPendingProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-gray-500">Service Provider</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push("/admin/users");
                        toast({
                          title: "Approve provider",
                          description: "Use Users Management to approve providers.",
                        });
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No pending providers.</div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Disputes</h3>
          <div className="space-y-3">
            {summary?.recentDisputes?.length ? (
              summary.recentDisputes.map((dispute) => (
                <div key={dispute.id} className="p-3 border rounded">
                  <div className="font-medium">{dispute.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatRelative(dispute.createdAt)} • {dispute.status}
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    Resolve
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No disputes found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
