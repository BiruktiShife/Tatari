"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  MapPin,
  Eye,
  MoreVertical,
  Zap,
  Download,
  TrendingUp,
  Target,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Config Mapping
const statusConfig: Record<
  string,
  { color: string; label: string; bg: string }
> = {
  pending: { color: "text-amber-700", bg: "bg-amber-50", label: "Pending" },
  active: { color: "text-blue-700", bg: "bg-blue-50", label: "Active" },
  accepted: { color: "text-indigo-700", bg: "bg-indigo-50", label: "Accepted" },
  in_progress: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    label: "In Progress",
  },
  completed: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    label: "Completed",
  },
  cancelled: { color: "text-rose-700", bg: "bg-rose-50", label: "Cancelled" },
  expired: { color: "text-slate-500", bg: "bg-slate-100", label: "Expired" },
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export default function AdminJobsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    totalValue: 0,
    pendingQuotes: 0,
    completionRate: 0,
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();
      if (searchQuery) query.set("search", searchQuery);
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (categoryFilter !== "all") query.set("category", categoryFilter);

      const res = await fetch(
        resolveApiUrl(`/admin/users/jobs?${query.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setCategories(data.categories || ["all"]);
        setStats(data.stats || stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchJobs, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleStatusUpdate = async (jobId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        resolveApiUrl(`/admin/users/jobs/${jobId}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );
      if (res.ok) {
        toast({
          title: "Updated",
          description: "Job status changed successfully.",
        });
        fetchJobs();
      }
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Admin Header */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
              Marketplace Audit
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Project Registry
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Comprehensive oversight of all platform service contracts and
              financial movements.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold gap-2"
          >
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </section>

      {/* 2. Intelligence Stats */}
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
            label: "Pipeline Value",
            val: `ETB ${stats.totalValue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Pending Quotes",
            val: stats.pendingQuotes,
            icon: Target,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Fulfillment",
            val: `${stats.completionRate}%`,
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
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
                className={`h-12 w-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <s.icon size={22} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={20}
          />
          <Input
            className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base placeholder:text-slate-400"
            placeholder="Audit by title, client name, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-[180px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600 capitalize">
              <Filter className="mr-2 text-slate-400" size={16} />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_progress">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-14 w-[200px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600 capitalize">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Services" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Data Grid */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-6 text-left">Project Overview</th>
                <th className="px-8 py-6 text-left">Market Participants</th>
                <th className="px-8 py-6 text-left">Audit Status</th>
                <th className="px-8 py-6 text-left">Value</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="animate-spin inline-block text-indigo-600" />
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const fallback = {
                    label: "Unknown",
                    color: "text-slate-500",
                    bg: "bg-slate-100",
                  };
                  const status =
                    statusConfig[job.status?.toLowerCase()] || fallback;
                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {job.location || "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3 overflow-hidden">
                            <Avatar className="h-8 w-8 ring-2 ring-white rounded-xl border border-slate-100">
                              <AvatarFallback className="bg-indigo-50 text-indigo-700 text-[10px] font-black">
                                C
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="h-8 w-8 ring-2 ring-white rounded-xl border border-slate-100">
                              <AvatarFallback
                                className={
                                  job.provider
                                    ? "bg-emerald-50 text-emerald-700 text-[10px] font-black"
                                    : "bg-slate-50 text-slate-400 text-[10px]"
                                }
                              >
                                {job.provider ? "P" : "?"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-slate-900">
                              {job.client?.name}
                            </p>
                            <p className="text-slate-400">
                              {job.provider?.name || "Awaiting Selection"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          className={`border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900">
                        {job.acceptedQuoteAmount
                          ? `ETB ${job.acceptedQuoteAmount}`
                          : `ETB ${job.budgetAmount || "—"}`}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-xl"
                            asChild
                          >
                            <Link href={`/admin/jobs/${job.id}`}>
                              <Eye size={18} />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                              >
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-2xl p-2 shadow-2xl border-slate-100"
                            >
                              <DropdownMenuItem
                                className="rounded-xl font-bold text-rose-600"
                                onClick={() =>
                                  handleStatusUpdate(job.id, "CANCELLED")
                                }
                              >
                                Force Cancel
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="rounded-xl font-bold text-emerald-600"
                                onClick={() =>
                                  handleStatusUpdate(job.id, "COMPLETED")
                                }
                              >
                                Force Complete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
