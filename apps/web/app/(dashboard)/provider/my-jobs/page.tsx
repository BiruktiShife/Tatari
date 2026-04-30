"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  MessageSquare,
  Loader2,
  ExternalLink,
  User,
  Zap,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// 1. Configuration Constants
const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-amber-50 text-amber-700", label: "Pending" },
  active: { color: "bg-blue-50 text-blue-700", label: "Active" },
  accepted: { color: "bg-indigo-50 text-indigo-700", label: "Accepted" },
  in_progress: { color: "bg-purple-50 text-purple-700", label: "In Progress" },
  completed: { color: "bg-emerald-50 text-emerald-700", label: "Completed" },
  cancelled: { color: "bg-rose-50 text-rose-700", label: "Cancelled" },
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

// 2. Sub-component for Job Rows
function JobRow({
  job,
  onAction,
  loading,
}: {
  job: any;
  onAction: (id: string, action: "start" | "complete") => void;
  loading: boolean;
}) {
  const fallback = { color: "bg-slate-100 text-slate-600", label: "Pending" };
  const status = statusConfig[job.status?.toLowerCase()] || fallback;
  const isAccepted = job.status?.toUpperCase() === "ACCEPTED";
  const isInProgress = job.status?.toUpperCase() === "IN_PROGRESS";

  return (
    <Card className="group rounded-[2.5rem] border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0 flex flex-col lg:flex-row">
        <div className="p-8 flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={`px-3 py-1 rounded-full border-none font-bold text-[10px] uppercase tracking-wider ${status.color}`}
            >
              {status.label}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest"
            >
              {job.category || "General"}
            </Badge>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
            {job.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <User size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  Client
                </p>
                <p className="text-slate-900">
                  {job.client?.name || "Verified Client"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  Location
                </p>
                <p className="text-slate-900">
                  {job.location || "Addis Ababa"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:w-80 bg-slate-50 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100">
          <div className="mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Contract Value
            </p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              ETB {job.budgetAmount?.toLocaleString() || "—"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-white transition-all"
            >
              <Link href={`/provider/jobs/${job.id}`}>
                View Details <ExternalLink size={14} className="ml-2" />
              </Link>
            </Button>

            {isAccepted && (
              <Button
                className="h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                onClick={() => onAction(job.id, "start")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Initialize Project"
                )}
              </Button>
            )}

            {isInProgress && (
              <>
                <Button
                  asChild
                  className="h-11 rounded-xl font-bold bg-slate-900 hover:bg-indigo-600 transition-all text-white"
                >
                  <Link
                    href={`/provider/jobs/${job.id}/update`}
                    className="gap-2"
                  >
                    <MessageSquare size={16} /> Post Milestone
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onAction(job.id, "complete")}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Finalize & Close"
                  )}
                </Button>
              </>
            )}

            {job.status?.toUpperCase() !== "COMPLETED" && (
              <Button
                asChild
                variant="ghost"
                className="h-11 rounded-xl font-bold text-slate-400 hover:text-indigo-600"
              >
                <Link href={`/provider/messages?job=${job.id}`}>Open Chat</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 3. Main Page Component
export default function ProviderMyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(resolveApiUrl("/jobs/provider/my"), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobAction = async (
    jobId: string,
    action: "start" | "complete",
  ) => {
    setActionLoading(jobId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(resolveApiUrl(`/jobs/${jobId}/${action}`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to ${action} job.`);

      toast({ title: "Success", description: `Project status updated.` });
      fetchJobs(); // Refresh the list
    } catch (err: any) {
      toast({
        title: "Action Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    const active = jobs.filter(
      (j) =>
        !["COMPLETED", "CANCELLED", "EXPIRED"].includes(
          (j.status || "").toUpperCase(),
        ),
    ).length;
    const revenue = jobs.reduce((sum, j) => sum + (j.budgetAmount || 0), 0);
    const completedCount = jobs.filter(
      (j) => (j.status || "").toUpperCase() === "COMPLETED",
    ).length;
    const rate = jobs.length
      ? Math.round((completedCount / jobs.length) * 100)
      : 0;

    return { active, revenue, total: jobs.length, rate };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || job.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold">
              My Portfolio
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Active Projects
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Manage your assigned tasks and track your business growth.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-500/20"
          >
            <Link href="/provider/jobs" className="gap-2">
              Find More Work <ChevronRight size={18} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Active Jobs",
            val: stats.active,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Revenue Pipeline",
            val: `ETB ${stats.revenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Assigned Jobs",
            val: stats.total,
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Completion Rate",
            val: `${stats.rate}%`,
            icon: ShieldCheck,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white"
          >
            <CardContent className="p-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">
                  {s.val}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}
              >
                <s.icon size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={20}
          />
          <Input
            className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base"
            placeholder="Search by project name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-14 w-full md:w-[220px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
            <Filter className="mr-2 text-slate-400" size={18} />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs and Job List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-md mb-8">
          <TabsTrigger
            value="all"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All Jobs
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Ongoing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 outline-none">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                Syncing your projects...
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onAction={handleJobAction}
                loading={actionLoading === job.id}
              />
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <Zap className="mx-auto text-slate-200 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900">
                No projects found
              </h3>
              <p className="text-slate-500 mt-2">
                Browse the marketplace to find your next contract.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
