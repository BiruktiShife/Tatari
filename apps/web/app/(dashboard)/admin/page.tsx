"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { JobLifecycleOverview } from "@/components/dashboard/JobLifecycleOverview";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users2,
} from "lucide-react";

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

type StatIcon = "briefcase" | "dollar" | "users" | "star";

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

  const stats = useMemo((): {
    title: string;
    value: string;
    change: string;
    icon: StatIcon;
  }[] => {
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

  const heroStats = [
    {
      label: "Users",
      value: summary ? summary.totalUsers : 0,
      icon: Users2,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Active jobs",
      value: summary ? summary.activeJobs : 0,
      icon: BriefcaseBusiness,
      tone: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Disputes",
      value: summary ? summary.disputeCases : 0,
      icon: TriangleAlert,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pending providers",
      value: summary ? summary.pendingProviders : 0,
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  const highlightCount = summary
    ? summary.recentPendingProviders.length + summary.recentDisputes.length
    : 0;

  return (
    <div className="space-y-6 pb-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-lg shadow-slate-200/60 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.10),_transparent_28%),linear-gradient(135deg,_rgba(248,250,252,1),_rgba(255,255,255,1))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] lg:items-end">
          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Platform Overview
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Monitor users, active jobs, disputes, and provider verification
                from a cleaner, more focused dashboard experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/admin/users")}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                Manage users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/jobs")}
                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                Review jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-3 py-8 text-sm text-slate-500">
            <Clock3 className="h-4 w-4 animate-spin" />
            Loading summary...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/80">
          <CardContent className="py-6 text-sm text-red-700">
            {error}
          </CardContent>
        </Card>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Pending verifications</CardTitle>
              <CardDescription>
                Providers waiting for review in the admin queue.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {summary?.recentPendingProviders?.length || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.recentPendingProviders?.length ? (
                summary.recentPendingProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium text-slate-900">
                          {provider.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="rounded-full border-amber-200 bg-amber-50 text-amber-700"
                        >
                          Pending
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Service provider • {formatRelative(provider.createdAt)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  No pending providers right now.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Recent disputes</CardTitle>
              <CardDescription>
                Track cases that need attention from the support team.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {summary?.recentDisputes?.length || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.recentDisputes?.length ? (
                summary.recentDisputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="rounded-2xl border border-slate-200 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900">
                          {dispute.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span>{formatRelative(dispute.createdAt)}</span>
                          <span className="text-slate-300">•</span>
                          <span>{dispute.status}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-slate-200 bg-slate-50 text-slate-600"
                      >
                        Open
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="mt-4">
                      Resolve
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                  No disputes found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Admin shortcuts</CardTitle>
          <CardDescription>
            Fast paths to the main management areas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Users",
              description: "Review providers, approvals, and account activity.",
              href: "/admin/users",
              tone: "text-sky-700 bg-sky-50 border-sky-200",
            },
            {
              title: "Jobs",
              description: "Inspect job states and marketplace execution.",
              href: "/admin/jobs",
              tone: "text-indigo-700 bg-indigo-50 border-indigo-200",
            },
            {
              title: "Transactions",
              description: "Follow revenue flows and payment issues.",
              href: "/admin/transactions",
              tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => router.push(item.href)}
              className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${item.tone}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{item.title}</div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="mt-2 text-sm opacity-80">{item.description}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
