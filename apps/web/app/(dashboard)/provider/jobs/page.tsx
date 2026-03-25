"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  User,
  AlertCircle,
  Sparkles,
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

type JobItem = {
  id: string;
  title: string;
  category?: string;
  status?: "PENDING" | "ACTIVE" | string;
  timeline?: "URGENT" | "WITHIN_WEEK" | "FLEXIBLE" | string;
  budgetType?: "FIXED" | "HOURLY" | "RANGE" | string;
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
  if (!createdAt) return "Recently";
  const posted = new Date(createdAt).getTime();
  if (Number.isNaN(posted)) return "Recently";

  const mins = Math.max(1, Math.floor((Date.now() - posted) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatBudget(job: JobItem) {
  if (job.budgetType === "RANGE") {
    return `₵ ${job.budgetMin ?? 0} - ${job.budgetMax ?? 0}`;
  }
  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `₵ ${job.budgetAmount}/hr`
      : `₵ ${job.budgetAmount}`;
  }
  return "Budget not specified";
}

function timelineLabel(timeline?: string) {
  if (timeline === "URGENT") return "Urgent";
  if (timeline === "WITHIN_WEEK") return "Within Week";
  return "Flexible";
}

export default function ProviderJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setJobs([]);
          setError("Missing auth token. Please log in again.");
          setLoading(false);
          return;
        }
        const res = await fetch(resolveApiUrl("/jobs/provider/available"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const text = await res.text();
          setJobs([]);
          setError(text || "Failed to fetch available jobs.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
        setError("Failed to fetch available jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const categories = useMemo(() => {
    const fromData = Array.from(
      new Set(jobs.map((j) => j.category).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b));
    return ["all", ...fromData];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let list = [...jobs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((job) =>
        [job.title, job.location, job.category, job.client?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q)),
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((job) => job.category === selectedCategory);
    }

    list.sort((a, b) => {
      if (sortBy === "budget") {
        const aBudget = a.budgetAmount ?? a.budgetMax ?? a.budgetMin ?? 0;
        const bBudget = b.budgetAmount ?? b.budgetMax ?? b.budgetMin ?? 0;
        return bBudget - aBudget;
      }
      if (sortBy === "urgent") {
        const aUrgent = a.timeline === "URGENT" ? 1 : 0;
        const bUrgent = b.timeline === "URGENT" ? 1 : 0;
        return bUrgent - aUrgent;
      }
      return (
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    });

    return list;
  }, [jobs, searchQuery, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    const urgent = jobs.filter((j) => j.timeline === "URGENT").length;
    const totalBudget = jobs.reduce((sum, job) => {
      if (job.budgetAmount != null) return sum + job.budgetAmount;
      if (job.budgetMax != null) return sum + job.budgetMax;
      if (job.budgetMin != null) return sum + job.budgetMin;
      return sum;
    }, 0);
    return {
      total: jobs.length,
      urgent,
      totalBudget,
    };
  }, [jobs]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
              <Sparkles className="h-4 w-4" />
              Provider Marketplace
            </div>
            <h1 className="text-3xl font-bold">Available Jobs</h1>
            <p className="text-slate-200 mt-2">
              Browse and respond to current opportunities on the platform.
            </p>
          </div>
          <Button asChild variant="secondary" className="text-slate-900">
            <Link href="/provider/my-jobs">View My Jobs</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Jobs Available</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Urgent Jobs</div>
            <div className="text-2xl font-bold mt-1">{stats.urgent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Visible Budget</div>
            <div className="text-2xl font-bold mt-1">₵ {stats.totalBudget}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title, location, category, client..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[170px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="budget">Highest Budget</SelectItem>
                  <SelectItem value="urgent">Urgent First</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-sm text-gray-500">Loading available jobs...</div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No available jobs match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const urgent = job.timeline === "URGENT";
            return (
              <Card
                key={job.id}
                className="group border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                          {job.title}
                        </h3>
                        {urgent && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline">{job.category || "General"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{job.client?.name || "Client"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-xl font-bold text-emerald-700">
                        {formatBudget(job)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{job.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <Clock className="h-4 w-4 mt-0.5" />
                      <span>
                        Posted {formatPostedAgo(job.createdAt)} |{" "}
                        {timelineLabel(job.timeline)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.quotesCount || 0} quotes submitted</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/provider/jobs/${job.id}`}>Submit Quote</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
