"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Briefcase,
  MapPin,
  User,
  Zap,
  ChevronRight,
  Loader2,
  Target,
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
import Link from "next/link";

// Types
type JobItem = {
  id: string;
  title: string;
  category?: string;
  status?: string;
  timeline?: "URGENT" | "WITHIN_WEEK" | "FLEXIBLE" | string;
  budgetType?: string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  location?: string;
  quotesCount?: number;
  createdAt?: string;
  client?: { name?: string | null };
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export default function ProviderJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(resolveApiUrl("/jobs/provider/available"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) setJobs(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let list = jobs.filter(
      (j) =>
        (!searchQuery ||
          j.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "all" || j.category === selectedCategory),
    );
    // ... sorting logic ...
    return list;
  }, [jobs, searchQuery, selectedCategory, sortBy]);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      urgent: jobs.filter((j) => j.timeline === "URGENT").length,
      avg: jobs.length
        ? Math.round(
            jobs.reduce((s, j) => s + (j.budgetAmount ?? 0), 0) / jobs.length,
          )
        : 0,
    }),
    [jobs],
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold">
              Live Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Available Leads
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Browse high-quality projects matching your expertise.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-500/20"
          >
            <Link href="/provider/my-jobs">Manage My Projects</Link>
          </Button>
        </div>
      </section>

      {/* 2. Intelligence Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: "Market Size",
            val: stats.total,
            icon: Briefcase,
            color: "text-indigo-600",
          },
          {
            label: "Urgent Fixes",
            val: stats.urgent,
            icon: Zap,
            color: "text-rose-500",
          },
          {
            label: "Avg. Budget",
            val: `ETB ${stats.avg}`,
            icon: Target,
            color: "text-emerald-500",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-3xl bg-white overflow-hidden"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <s.icon className={s.color} size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">
                  {s.val}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Search & Filter Area */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={20}
          />
          <Input
            className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base"
            placeholder="Search by skill, location or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-14 w-[180px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="budget">High Budget</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-14 w-[200px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Categories</SelectItem>
              {/* Map categories here */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2
              className="animate-spin inline-block text-indigo-600"
              size={40}
            />
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="group rounded-[2.5rem] border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {job.timeline === "URGENT" && (
                        <Badge className="bg-rose-500 text-white border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                          Urgent
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-500 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider "
                      >
                        {job.category}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {job.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Budget
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      ETB {job.budgetAmount || "TBD"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <MapPin size={16} className="text-indigo-600" />{" "}
                    {job.location || "Addis Ababa"}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <User size={16} className="text-slate-400" />{" "}
                    {job.client?.name || "Verified Client"}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
                    Posted 2h ago
                  </span>
                  <Button
                    asChild
                    className="bg-slate-900 hover:bg-indigo-600 rounded-xl px-8 font-bold h-12 transition-all group-hover:scale-[1.02]"
                  >
                    <Link href={`/provider/jobs/${job.id}`}>
                      View & Quote <ChevronRight size={18} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
