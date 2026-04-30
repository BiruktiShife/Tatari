"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  Briefcase,
  MessageSquare,
  ChevronRight,
  Plus,
  Loader2,
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

// Types & Config
type JobItem = {
  id: string;
  title: string;
  category?: string;
  status?: string;
  budgetType?: string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  location?: string;
  quotesCount?: number;
  timeline?: string;
  createdAt?: string;
};

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: "bg-amber-50 text-amber-700", label: "Pending" },
  active: { color: "bg-blue-50 text-blue-700", label: "Active" },
  accepted: { color: "bg-indigo-50 text-indigo-700", label: "Accepted" },
  in_progress: { color: "bg-purple-50 text-purple-700", label: "In Progress" },
  completed: { color: "bg-emerald-50 text-emerald-700", label: "Completed" },
  cancelled: { color: "bg-rose-50 text-rose-700", label: "Cancelled" },
};

function resolveJobsUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}/jobs`;
  return `${apiUrl.replace(/\/$/, "")}/jobs`;
}

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(resolveJobsUrl(), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (job.status || "").toLowerCase() === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const active = jobs.filter(
      (j) =>
        !["COMPLETED", "CANCELLED"].includes(j.status?.toUpperCase() || ""),
    ).length;
    const quotes = jobs.reduce((sum, j) => sum + (j.quotesCount || 0), 0);
    return { active, quotes, total: jobs.length };
  }, [jobs]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[100px] -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1">
              Project Hub
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight">
              My Projects
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your service requests and track real-time progress.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 text-lg font-bold"
          >
            <Link href="/client/post-job" className="gap-2">
              <Plus size={20} /> Post New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: "Active Requests",
            value: stats.active,
            icon: Briefcase,
            color: "text-indigo-600",
          },
          {
            label: "Quotes Received",
            value: stats.quotes,
            icon: MessageSquare,
            color: "text-blue-600",
          },
          {
            label: "Total Posted",
            value: stats.total,
            icon: Sparkles,
            color: "text-amber-500",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-3xl bg-white overflow-hidden"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center ${s.color}`}
              >
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">
                  {s.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={20}
          />
          <Input
            className="h-14 pl-12 bg-white border-slate-100 rounded-2xl text-base shadow-sm focus:ring-indigo-500/20"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-14 w-full md:w-[240px] bg-white border-slate-100 rounded-2xl shadow-sm">
            <Filter className="mr-2 text-slate-400" size={18} />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 mb-8">
          <TabsTrigger
            value="all"
            className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-xl px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="text-slate-400 font-medium">
                Loading your projects...
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobListItem key={job.id} job={job} />)
          ) : (
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-[2rem]">
              <CardContent className="py-20 text-center">
                <div className="bg-white h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Briefcase className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  No projects found
                </h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  Try adjusting your filters or post a new request to get
                  started.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function JobListItem({ job }: { job: JobItem }) {
  const fallbackStatus = {
    color: "bg-slate-100 text-slate-600",
    label: "Pending",
  };
  const status =
    statusConfig[(job.status || "pending").toLowerCase()] || fallbackStatus;
  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className={`px-3 py-1 rounded-full border-none font-bold text-xs ${status.color}`}
          >
            {status.label}
          </Badge>
          {job.category && (
            <Badge
              variant="outline"
              className="bg-slate-50 border-slate-200 text-slate-500 capitalize"
            >
              {job.category}
            </Badge>
          )}
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {job.title}
        </h3>

        <div className="flex flex-wrap items-center gap-6 text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-slate-400" />{" "}
            <span className="font-medium">{job.location || "Addis Ababa"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />{" "}
            <span className="font-medium">{job.timeline || "Flexible"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-slate-400" />{" "}
            <span className="font-medium">{job.quotesCount || 0} Quotes</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-6 lg:pt-0">
        <div className="text-2xl font-black text-slate-900">
          {job.budgetAmount
            ? `₵ ${job.budgetAmount.toLocaleString()}`
            : "Variable"}
        </div>
        <Button
          asChild
          className="bg-slate-900 hover:bg-slate-800 rounded-xl px-6 font-bold group-hover:bg-indigo-600 transition-colors"
        >
          <Link href={`/client/jobs/${job.id}`}>
            View Project <ChevronRight size={18} className="ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
