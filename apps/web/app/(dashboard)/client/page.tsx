"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  JobLifecycleOverview,
  type JobLifecycleCounts,
} from "@/components/dashboard/JobLifecycleOverview";

type MeResponse = {
  name?: string | null;
};

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

function formatPostedAgo(createdAt?: string) {
  if (!createdAt) return "recently";
  const postedAt = new Date(createdAt).getTime();
  if (Number.isNaN(postedAt)) return "recently";

  const mins = Math.max(1, Math.floor((Date.now() - postedAt) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function mapApiStatus(
  status?: string,
): "pending" | "quoted" | "accepted" | "in_progress" | "completed" {
  const normalized = (status || "").toUpperCase();
  if (normalized === "IN_PROGRESS") return "in_progress";
  if (normalized === "COMPLETED") return "completed";
  if (normalized === "ACCEPTED") return "accepted";
  if (normalized === "ACTIVE") return "quoted";
  return "pending";
}

function formatPrice(job: ApiJob) {
  if (job.budgetType === "RANGE") {
    return `$${job.budgetMin ?? 0} - $${job.budgetMax ?? 0}`;
  }
  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `$${job.budgetAmount}/hr`
      : `$${job.budgetAmount}`;
  }
  return "—";
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

      let user: { role?: string; name?: string } = {};
      try {
        user = JSON.parse(storedUser);
      } catch {
        router.replace("/login");
        return;
      }

      if (user.role !== "CLIENT") {
        router.replace(`/${user.role === "ADMIN" ? "admin" : "provider"}`);
        return;
      }

      setAuthorized(true);
      if (user.name) setClientName(user.name);

      try {
        const [meRes, jobsRes] = await Promise.all([
          fetch(resolveApiUrl("/auth/me"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/jobs"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.ok) {
          const me: MeResponse = await meRes.json();
          if (me.name?.trim()) setClientName(me.name.trim());
        }
        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(Array.isArray(data) ? data : []);
        } else {
          setJobs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const stats = useMemo(() => {
    const activeStatuses = new Set(["PENDING", "ACTIVE", "ACCEPTED", "IN_PROGRESS"]);
    const activeJobs = jobs.filter((job) =>
      activeStatuses.has((job.status || "").toUpperCase()),
    ).length;

    const totalSpent = jobs
      .filter((job) => (job.status || "").toUpperCase() === "COMPLETED")
      .reduce((sum, job) => {
        if (job.budgetAmount != null) return sum + job.budgetAmount;
        if (job.budgetMax != null) return sum + job.budgetMax;
        if (job.budgetMin != null) return sum + job.budgetMin;
        return sum;
      }, 0);

    const totalQuotes = jobs.reduce((sum, job) => sum + (job.quotesCount || 0), 0);
    const completedJobs = jobs.filter(
      (job) => (job.status || "").toUpperCase() === "COMPLETED",
    ).length;

    return [
      {
        title: "Active Jobs",
        value: String(activeJobs),
        change: `${jobs.length} total posted`,
        icon: "briefcase" as const,
      },
      {
        title: "Total Spent",
        value: `$${Math.round(totalSpent)}`,
        change: "Based on completed jobs",
        icon: "dollar" as const,
      },
      {
        title: "Quotes Received",
        value: String(totalQuotes),
        change: "Across all your jobs",
        icon: "users" as const,
      },
      {
        title: "Completed Jobs",
        value: String(completedJobs),
        change: "Successfully finished",
        icon: "star" as const,
      },
    ];
  }, [jobs]);

  const recentJobs = useMemo(
    () =>
      jobs.slice(0, 5).map((job) => ({
        id: job.id,
        title: job.title,
        provider: "Provider not assigned",
        status: mapApiStatus(job.status),
        price: formatPrice(job),
        posted: formatPostedAgo(job.createdAt),
      })),
    [jobs],
  );

  const lifecycleCounts: JobLifecycleCounts = useMemo(() => {
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
    return { started, inProgress, completed };
  }, [jobs]);

  if (!authorized) return null;
  if (loading) return <div className="text-sm text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {clientName}</h1>
        <p className="text-gray-600 mt-2">
          Find skilled professionals for your needs
        </p>
      </div>

      <StatsCards stats={stats} />

      <JobLifecycleOverview
        counts={lifecycleCounts}
        title="Your Job Lifecycle"
        subtitle="Live visibility into starts, in-progress work, and completions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions
            actions={[
              {
                title: "Post a New Job",
                description: "Get quotes from professionals",
                href: "/client/post-job",
                icon: "plus",
                variant: "default",
              },
              {
                title: "Message a Provider",
                description: "Contact your active providers",
                href: "/client/messages",
                icon: "message",
                variant: "outline",
              },
              {
                title: "Review Completed Jobs",
                description: "Rate your service experience",
                href: "/client/reviews",
                icon: "star",
                variant: "outline",
              },
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <RecentJobs jobs={recentJobs} />
        </div>
      </div>
    </div>
  );
}
