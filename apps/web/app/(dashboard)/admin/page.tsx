"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Users2,
  Loader2,
  ChevronRight,
  Gavel,
  UserCheck,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { JobLifecycleOverview } from "@/components/dashboard/JobLifecycleOverview";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types
type SummaryResponse = {
  totalUsers: number;
  activeJobs: number;
  totalRevenue: number;
  disputeCases: number;
  pendingProviders: number;
  jobLifecycle?: { started: number; inProgress: number; completed: number };
  recentPendingProviders: { id: string; name: string; createdAt: string }[];
  recentDisputes: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }[];
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function formatRelative(dateStr: string) {
  const date = new Date(dateStr).getTime();
  const mins = Math.max(1, Math.floor((Date.now() - date) / 60000));
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [jobLifecycle, setJobLifecycle] = useState<{
    started: number;
    inProgress: number;
    completed: number;
  } | null>(null);

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
      try {
        const token = localStorage.getItem("token");
        const [summaryRes, jobsRes] = await Promise.all([
          fetch(resolveApiUrl("/admin/users/summary"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/admin/users/jobs"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (summaryRes.ok) setSummary(await summaryRes.json());
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const jobs = Array.isArray(jobsData.jobs) ? jobsData.jobs : [];
          const started = jobs.filter((j: any) =>
            ["PENDING", "ACTIVE", "ACCEPTED"].includes(
              (j.status || "").toUpperCase(),
            ),
          ).length;
          const inProgress = jobs.filter(
            (j: any) => (j.status || "").toUpperCase() === "IN_PROGRESS",
          ).length;
          const completed = jobs.filter(
            (j: any) => (j.status || "").toUpperCase() === "COMPLETED",
          ).length;
          setJobLifecycle({ started, inProgress, completed });
        }
      } catch (err) {
        console.error(err);
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
        title: "Total Platform Users",
        value: String(summary.totalUsers),
        change: `${summary.pendingProviders} pending approval`,
        icon: "users" as const,
      },
      {
        title: "Marketplace Load",
        value: String(summary.activeJobs),
        change: "Active projects live",
        icon: "briefcase" as const,
      },
      {
        title: "Gross Revenue",
        value: `ETB ${summary.totalRevenue.toLocaleString()}`,
        change: "System-wide tracking",
        icon: "dollar" as const,
      },
      {
        title: "Escalated Cases",
        value: String(summary.disputeCases),
        change: "Open dispute tickets",
        icon: "star" as const,
      },
    ];
  }, [summary]);

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-bold italic tracking-widest text-xs uppercase">
          Syncing Command Center...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 px-2">
      {/* 1. Admin Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
              Global Control
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Platform Overview
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Real-time monitoring of users, marketplace execution, and dispute
              resolution.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/admin/users")}
              size="lg"
              className="bg-white text-slate-900 hover:bg-indigo-50 h-14 px-8 rounded-2xl font-bold shadow-xl"
            >
              User Control <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats */}
      <StatsCards stats={stats} />

      {/* 3. Global Pipeline */}
      {(summary?.jobLifecycle || jobLifecycle) && (
        <JobLifecycleOverview
          counts={summary?.jobLifecycle || jobLifecycle!}
          title="Global Project Pipeline"
          subtitle="Start, in-progress, and completed jobs across the entire marketplace."
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 4. Verification Queue */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="text-indigo-600" size={22} /> Verification
              Queue
            </h3>
            <Badge className="bg-slate-100 text-slate-600 border-none rounded-full px-4">
              {summary?.recentPendingProviders?.length || 0} Waiting
            </Badge>
          </div>

          <div className="space-y-4">
            {summary?.recentPendingProviders?.length ? (
              summary.recentPendingProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="group rounded-[2rem] border-slate-100 bg-white hover:border-indigo-100 transition-all overflow-hidden shadow-sm hover:shadow-md"
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100">
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {provider.name}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Submitted {formatRelative(provider.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl font-bold text-slate-400 hover:text-slate-600"
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="bg-slate-900 hover:bg-indigo-600 rounded-xl px-6 font-bold h-10 transition-all"
                      >
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <CheckCircle2
                  className="mx-auto text-emerald-400 mb-2"
                  size={32}
                />
                <p className="text-slate-400 font-medium italic">
                  Approval queue is clear.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Support Queue */}
        <div className="xl:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Gavel className="text-rose-600" size={22} /> Support Tickets
            </h3>
          </div>

          <div className="space-y-4">
            {summary?.recentDisputes?.length ? (
              summary.recentDisputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className="rounded-[2rem] border-slate-100 bg-white p-6 shadow-sm group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-rose-50 text-rose-600 border-none rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-widest">
                      Active Dispute
                    </Badge>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {formatRelative(dispute.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight mb-4">
                    {dispute.title}
                  </h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Status: {dispute.status}
                    </span>
                    <Button
                      variant="link"
                      className="text-indigo-600 font-bold p-0 h-auto"
                    >
                      Mediate Case <ChevronRight size={14} />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-slate-400 font-medium italic">
                  No active disputes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Command Shortcuts */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
          Command Center Shortcuts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Users",
              desc: "Verifications & Bans",
              href: "/admin/users",
              icon: Users2,
              color: "text-sky-600",
              bg: "bg-sky-50",
            },
            {
              title: "Jobs",
              desc: "Milestone Audits",
              href: "/admin/jobs",
              icon: Activity,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              title: "Finances",
              desc: "Payouts & Flows",
              href: "/admin/transactions",
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.href)}
              className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-14 w-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={20}
                className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
