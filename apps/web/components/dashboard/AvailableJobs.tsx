"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, User } from "lucide-react";
import Link from "next/link";

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
  client?: {
    name?: string | null;
  };
};

function resolveJobsApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) {
        return `${apiUrl.replace(/\/$/, "")}${path}`;
      }
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

  const diffMs = Date.now() - postedAt;
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatBudget(job: ApiJob) {
  if (job.budgetType === "RANGE") {
    const min = job.budgetMin ?? 0;
    const max = job.budgetMax ?? 0;
    return `$${min} - $${max}`;
  }

  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `$${job.budgetAmount}/hr`
      : `$${job.budgetAmount}`;
  }

  return "Budget not specified";
}

export function AvailableJobs() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNearbyJobs = async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const url = resolveJobsApiUrl("/jobs/provider/nearby");
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch nearby jobs");
        }

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not fetch jobs";
        setError(message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyJobs();
  }, []);

  const alertCount = jobs.length;
  const uiJobs = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        title: job.title,
        client: job.client?.name || "Client",
        location: job.location || "Nearby area",
        budget: formatBudget(job),
        posted: formatPostedAgo(job.createdAt),
        urgency:
          job.timeline === "URGENT"
            ? "high"
            : job.timeline === "WITHIN_WEEK"
              ? "medium"
              : "low",
        category: job.category || "General",
      })),
    [jobs],
  );

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Available Jobs Near You</CardTitle>
            <CardDescription>
              Jobs matching your skills and service area
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-medium">
            {alertCount} Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-gray-500">Loading available jobs...</div>
        ) : error ? (
          <div className="text-sm text-red-600">
            Could not load nearby jobs right now.
          </div>
        ) : uiJobs.length === 0 ? (
          <div className="text-sm text-gray-500">
            No nearby jobs found yet for your service areas.
          </div>
        ) : (
          <div className="space-y-3">
            {uiJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    {job.urgency === "high" && <Badge variant="destructive">Urgent</Badge>}
                    {job.urgency === "medium" && (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        Within Week
                      </Badge>
                    )}
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{job.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-32">
                  <Button size="sm" asChild>
                    <Link href={`/provider/jobs/${job.id}`}>View Job</Link>
                  </Button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        <div className="mt-5 text-center">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/provider/jobs">View All Available Jobs</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
