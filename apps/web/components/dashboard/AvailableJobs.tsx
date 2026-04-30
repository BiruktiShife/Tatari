"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Zap, ChevronRight, Loader2, Target } from "lucide-react";
import Link from "next/link";

// Types
type ApiJob = {
  id: string;
  title: string;
  category?: string;
  location?: string;
  budgetType?: "FIXED" | "HOURLY" | "RANGE";
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline?: "URGENT" | "WITHIN_WEEK" | "FLEXIBLE";
  createdAt?: string;
  client?: { name?: string | null };
};

// API Helper
function resolveJobsApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

// Logic Helpers
function formatPostedAgo(createdAt?: string) {
  if (!createdAt) return "recently";
  const postedAt = new Date(createdAt).getTime();
  const mins = Math.max(1, Math.floor((Date.now() - postedAt) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatBudget(job: ApiJob) {
  if (job.budgetType === "RANGE")
    return `ETB ${job.budgetMin ?? 0} - ${job.budgetMax ?? 0}`;
  if (job.budgetAmount != null)
    return job.budgetType === "HOURLY"
      ? `ETB ${job.budgetAmount}/hr`
      : `ETB ${job.budgetAmount}`;
  return "Variable";
}

export function AvailableJobs() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNearbyJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(resolveJobsApiUrl("/jobs/provider/nearby"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Could not fetch jobs");
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNearbyJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Marketplace Leads
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Newest jobs in your service areas
          </p>
        </div>
        <Badge className="bg-indigo-50 text-indigo-700 border-none rounded-full px-4 py-1 font-bold">
          {jobs.length} Matching
        </Badge>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] border border-slate-100">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Scanning Marketplace...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-50 rounded-[2rem] border border-rose-100 text-rose-600 font-medium">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Target className="mx-auto text-slate-200 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-900">
              No Nearby Leads
            </h3>
            <p className="text-slate-500 mt-1 max-w-[240px] mx-auto">
              Try expanding your service area in profile settings.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => {
              const isUrgent = job.timeline === "URGENT";
              return (
                <div
                  key={job.id}
                  className={`group bg-white p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-indigo-100/50 
                        ${isUrgent ? "border-indigo-100 shadow-sm" : "border-slate-100"}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {isUrgent && (
                        <Badge className="bg-rose-500 text-white border-none rounded-full px-3 animate-pulse">
                          <Zap size={10} className="mr-1 fill-white" /> Urgent
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 border-none px-3 capitalize font-bold"
                      >
                        {job.category || "General"}
                      </Badge>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">
                        Posted {formatPostedAgo(job.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <div className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <User size={14} />
                        </div>
                        {job.client?.name || "Verified Client"}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <MapPin size={16} className="text-indigo-600" />
                        {job.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right mb-1">
                        Budget
                      </p>
                      <p className="text-2xl font-black text-slate-900 leading-none">
                        {formatBudget(job)}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl px-6 font-bold h-11 transition-all"
                    >
                      <Link href={`/provider/jobs/${job.id}`} className="gap-2">
                        View Details <ChevronRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 text-center">
          <Button
            variant="link"
            className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:no-underline"
            asChild
          >
            <Link href="/provider/jobs">View Market Overview</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
