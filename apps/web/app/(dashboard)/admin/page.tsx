"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { JobLifecycleOverview } from "@/components/dashboard/JobLifecycleOverview";

type SummaryResponse = {
  totalUsers: number;
  activeJobs: number;
  totalRevenue: number;
  disputeCases: number;
  pendingProviders: number;
  jobLifecycle?: {
    started: number;
    inProgress: number;
    completed: number;
  };
  recentPendingProviders: { id: string; name: string; createdAt: string }[];
  recentDisputes: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
};

type AdminJobsResponse = {
  jobs: { status?: string }[];
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
  const [jobLifecycle, setJobLifecycle] = useState<{
    started: number;
    inProgress: number;
    completed: number;
  } | null>(null);
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
          setJobLifecycle(null);
          return;
        }
        const [summaryRes, jobsRes] = await Promise.all([
          fetch(resolveApiUrl("/admin/users/summary"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/admin/users/jobs"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!summaryRes.ok) {
          const text = await summaryRes.text();
          throw new Error(text || "Failed to load summary.");
        }
        const data: SummaryResponse = await summaryRes.json();
        setSummary(data);

        if (jobsRes.ok) {
          const jobsData: AdminJobsResponse = await jobsRes.json();
          const jobs = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
          const startedStatuses = new Set(["PENDING", "ACTIVE", "ACCEPTED"]);
          const started = jobs.filter((job) =>
            startedStatuses.has((job.status || "").toUpperCase()),
          ).length;
          const inProgress = jobs.filter(
            (job) => (job.status || "").toUpperCase() === "IN_PROGRESS",
          ).length;
          const completed = jobs.filter(
            (job) => (job.status || "").toUpperCase() === "COMPLETED",
          ).length;
          setJobLifecycle({ started, inProgress, completed });
        } else {
          setJobLifecycle(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load summary.",
        );
        setSummary(null);
        setJobLifecycle(null);
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
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Platform Overview</h1>
            <p className="text-slate-200 mt-2">
              Monitor and manage the Habesha Skills Hub platform.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading summary...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {summary &&
        !loading &&
        !error &&
        (summary.jobLifecycle || jobLifecycle) && (
          <JobLifecycleOverview
            counts={summary.jobLifecycle || jobLifecycle!}
            title="Platform Job Lifecycle"
            subtitle="Start, in-progress, and completed jobs across the marketplace."
          />
        )}

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
                    <div className="text-sm text-gray-500">
                      Service Provider
                    </div>
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
                          description:
                            "Use Users Management to approve providers.",
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
