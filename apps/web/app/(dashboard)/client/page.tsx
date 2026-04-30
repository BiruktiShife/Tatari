"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Bell,
  LayoutDashboard,
  MessageSquare,
  User as UserIcon,
  Zap,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  JobLifecycleOverview,
  type JobLifecycleCounts,
} from "@/components/dashboard/JobLifecycleOverview";

// Types (Keep original logic)
type MeResponse = { name?: string | null };
type ApiJob = {
  id: string;
  title: string;
  status?: string;
  budgetType?: string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  quotesCount?: number;
  createdAt?: string;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

// Logic Helpers (Keep original logic)
function formatPostedAgo(createdAt?: string) {
  if (!createdAt) return "recently";
  const postedAt = new Date(createdAt).getTime();
  const mins = Math.max(1, Math.floor((Date.now() - postedAt) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("Client");
  const [jobs, setJobs] = useState<ApiJob[]>([]);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.replace("/login");
        return;
      }
      const user = JSON.parse(storedUser);
      if (user.role !== "CLIENT") {
        router.replace(`/${user.role === "ADMIN" ? "admin" : "provider"}`);
        return;
      }

      setAuthorized(true);
      if (user.name) setClientName(user.name);

      // Find the init function inside your useEffect and update the fetch block:

      try {
        // Individual try-catches or a check to see if the server is alive
        const [meRes, jobsRes] = await Promise.all([
          fetch(resolveApiUrl("/auth/me"), {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false })), // Catch network errors for me
          fetch(resolveApiUrl("/jobs"), {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false })), // Catch network errors for jobs
        ]);

        if (meRes && "json" in meRes && meRes.ok) {
          const me: MeResponse = await meRes.json();
          if (me.name?.trim()) setClientName(me.name.trim());
        }

        if (jobsRes && "json" in jobsRes && jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(Array.isArray(data) ? data : []);
        } else {
          console.error("Could not reach backend server");
          setJobs([]); // Fallback to empty list instead of crashing
        }
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  // Stats Logic (Keep original logic)
  const stats = useMemo(() => {
    const activeJobs = jobs.filter((j) =>
      ["PENDING", "ACTIVE", "ACCEPTED", "IN_PROGRESS"].includes(
        (j.status || "").toUpperCase(),
      ),
    ).length;
    const totalSpent = jobs
      .filter((j) => (j.status || "").toUpperCase() === "COMPLETED")
      .reduce(
        (sum, j) => sum + (j.budgetAmount ?? j.budgetMax ?? j.budgetMin ?? 0),
        0,
      );
    const totalQuotes = jobs.reduce((sum, j) => sum + (j.quotesCount || 0), 0);
    const completedJobs = jobs.filter(
      (j) => (j.status || "").toUpperCase() === "COMPLETED",
    ).length;

    return [
      {
        title: "Active Projects",
        value: String(activeJobs),
        change: `${jobs.length} total`,
        icon: "briefcase" as const,
      },
      {
        title: "Total Investment",
        value: `ETB ${totalSpent.toLocaleString()}`,
        change: "Completed jobs",
        icon: "dollar" as const,
      },
      {
        title: "Quotes Received",
        value: String(totalQuotes),
        change: "New opportunities",
        icon: "users" as const,
      },
      {
        title: "Success Rate",
        value:
          completedJobs > 0
            ? `${Math.round((completedJobs / jobs.length) * 100)}%`
            : "0%",
        change: "Job completion",
        icon: "star" as const,
      },
    ];
  }, [jobs]);

  const recentJobsMapped = useMemo(
    () =>
      jobs.slice(0, 5).map((job) => ({
        id: job.id,
        title: job.title,
        status: (job.status?.toLowerCase() || "pending") as any,
        price: job.budgetAmount ? `ETB ${job.budgetAmount}` : "Variable",
        posted: formatPostedAgo(job.createdAt),
      })),
    [jobs],
  );

  const lifecycleCounts: JobLifecycleCounts = useMemo(
    () => ({
      started: jobs.filter((j) =>
        ["PENDING", "ACTIVE", "ACCEPTED"].includes(
          (j.status || "").toUpperCase(),
        ),
      ).length,
      inProgress: jobs.filter(
        (j) => (j.status || "").toUpperCase() === "IN_PROGRESS",
      ).length,
      completed: jobs.filter(
        (j) => (j.status || "").toUpperCase() === "COMPLETED",
      ).length,
    }),
    [jobs],
  );

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium animate-pulse">
          Syncing your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {clientName.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/client/post-job")}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 rounded-xl gap-2 h-11 px-6"
          >
            <Plus size={18} />
            <span>Post a Project</span>
          </Button>
        </div>
      </header>

      {/* Main Stats Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-indigo-600/20 to-transparent z-0" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-3 py-1">
              System Health: Excellent
            </Badge>
            <h2 className="text-2xl font-bold">Your Service Overview</h2>
            <p className="text-slate-400 max-w-md">
              You have{" "}
              <span className="text-white font-bold">
                {lifecycleCounts.inProgress} active projects
              </span>{" "}
              currently in progress. Check your messages for updates from your
              providers.
            </p>
          </div>

          <div className="hidden lg:block h-full w-px bg-slate-800" />

          <div className="flex flex-col justify-center">
            <div className="text-4xl font-black text-indigo-500">
              {lifecycleCounts.completed}
            </div>
            <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mt-1">
              Jobs Completed
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[75%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <StatsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Workflow & Recent Jobs */}
        <div className="xl:col-span-8 space-y-8">
          <JobLifecycleOverview
            counts={lifecycleCounts}
            title="Project Pipeline"
            subtitle="Real-time tracking of your service lifecycle from start to finish."
          />

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <RecentJobs jobs={recentJobsMapped} />
          </div>
        </div>

        {/* Right Column: Quick Actions & Profile */}
        <div className="xl:col-span-4 space-y-8">
          <QuickActions
            actions={[
              {
                title: "Post New Job",
                description: "Describe your needs and get quotes",
                href: "/client/post-job",
                icon: "plus",
                variant: "default",
              },
              {
                title: "Active Messages",
                description: "Chat with assigned providers",
                href: "/client/messages",
                icon: "message",
                variant: "outline",
              },
              {
                title: "Payment History",
                description: "View receipts and invoices",
                href: "/client/payments",
                icon: "dollar",
                variant: "outline",
              },
              {
                title: "Review Experts",
                description: "Give feedback on completed work",
                href: "/client/reviews",
                icon: "star",
                variant: "outline",
              },
            ]}
          />

          {/* Engagement Card */}
          <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 relative overflow-hidden group">
            <Zap
              className="absolute -right-4 -bottom-4 text-indigo-100 group-hover:scale-110 transition-transform"
              size={120}
            />
            <h4 className="text-indigo-900 font-bold text-lg mb-2 relative z-10">
              Tatari Pro Tips
            </h4>
            <p className="text-indigo-700/80 text-sm mb-6 relative z-10 leading-relaxed">
              Detailed job descriptions receive 40% more accurate quotes from
              professionals.
            </p>
            <Button
              size="sm"
              className="bg-indigo-600 text-white rounded-xl relative z-10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
