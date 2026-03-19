"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  MessageSquare,
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

type ProviderJob = {
  id: string;
  title: string;
  status?: string;
  timeline?: string;
  location?: string;
  createdAt?: string;
  budgetType?: "FIXED" | "HOURLY" | "RANGE" | string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  client?: { name?: string | null };
  quotes?: { amount?: number | null; status?: string }[];
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  accepted: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-700",
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
  const postedAt = new Date(createdAt).getTime();
  if (Number.isNaN(postedAt)) return "Recently";

  const mins = Math.max(1, Math.floor((Date.now() - postedAt) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatBudget(job: ProviderJob) {
  const acceptedAmount = job.quotes?.find((q) => q.amount != null)?.amount;
  if (acceptedAmount != null) return `₵ ${acceptedAmount}`;

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

function statusLabel(status?: string) {
  const key = (status || "PENDING").toUpperCase();
  if (key === "IN_PROGRESS") return "In Progress";
  if (key === "PENDING") return "Pending";
  if (key === "ACCEPTED") return "Accepted";
  if (key === "COMPLETED") return "Completed";
  if (key === "ACTIVE") return "Active";
  if (key === "CANCELLED") return "Cancelled";
  if (key === "EXPIRED") return "Expired";
  return key.charAt(0) + key.slice(1).toLowerCase();
}

function timelineLabel(timeline?: string) {
  const key = (timeline || "FLEXIBLE").toUpperCase();
  if (key === "URGENT") return "Urgent";
  if (key === "WITHIN_WEEK") return "Within Week";
  return "Flexible";
}

export default function ProviderMyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<ProviderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingJobId, setStartingJobId] = useState<string | null>(null);
  const [completingJobId, setCompletingJobId] = useState<string | null>(null);
  const { toast } = useToast();

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
        const res = await fetch(resolveApiUrl("/jobs/provider/my"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const text = await res.text();
          setJobs([]);
          setError(text || "Failed to fetch your jobs.");
          return;
        }
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
        setError("Failed to fetch your jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleStartJob = async (jobId: string) => {
    try {
      setStartingJobId(jobId);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Missing token",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      const res = await fetch(resolveApiUrl(`/jobs/${jobId}/start`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to start job.");
      }
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "IN_PROGRESS" } : job,
        ),
      );
      toast({
        title: "Job started",
        description: "You marked this job as in progress.",
      });
    } catch (err) {
      toast({
        title: "Start failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setStartingJobId(null);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      setCompletingJobId(jobId);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Missing token",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      const res = await fetch(resolveApiUrl(`/jobs/${jobId}/complete`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to complete job.");
      }
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "COMPLETED" } : job,
        ),
      );
      toast({
        title: "Job completed",
        description: "You marked this job as completed.",
      });
    } catch (err) {
      toast({
        title: "Complete failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingJobId(null);
    }
  };

  const filteredJobs = useMemo(() => {
    let list = [...jobs];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((job) =>
        [job.title, job.location, job.client?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q)),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(
        (job) => (job.status || "").toLowerCase() === statusFilter,
      );
    }
    return list;
  }, [jobs, searchQuery, statusFilter]);

  const activeJobs = filteredJobs.filter(
    (j) =>
      !["completed", "cancelled", "expired"].includes(
        (j.status || "").toLowerCase(),
      ),
  );
  const pendingJobs = filteredJobs.filter(
    (j) => (j.status || "").toLowerCase() === "pending",
  );
  const completedJobs = filteredJobs.filter(
    (j) => (j.status || "").toLowerCase() === "completed",
  );

  const stats = useMemo(() => {
    const active = jobs.filter(
      (j) =>
        !["COMPLETED", "CANCELLED", "EXPIRED"].includes(
          (j.status || "").toUpperCase(),
        ),
    ).length;
    const totalValue = jobs.reduce((sum, j) => {
      const acceptedAmount = j.quotes?.find((q) => q.amount != null)?.amount;
      if (acceptedAmount != null) return sum + acceptedAmount;
      if (j.budgetAmount != null) return sum + j.budgetAmount;
      if (j.budgetMax != null) return sum + j.budgetMax;
      if (j.budgetMin != null) return sum + j.budgetMin;
      return sum;
    }, 0);
    const completed = jobs.filter(
      (j) => (j.status || "").toUpperCase() === "COMPLETED",
    ).length;
    const completionRate = jobs.length
      ? Math.round((completed / jobs.length) * 100)
      : 0;
    return {
      active,
      totalValue,
      assigned: jobs.length,
      completionRate,
    };
  }, [jobs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your jobs in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/provider/jobs">Find New Jobs</Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, client, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">₵ {Math.round(stats.totalValue)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.assigned}</div>
              <div className="text-sm text-gray-600">Assigned Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          ) : error ? (
            <EmptyState message={error} />
          ) : activeJobs.length ? (
            activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStart={handleStartJob}
                onComplete={handleCompleteJob}
                starting={startingJobId === job.id}
                completing={completingJobId === job.id}
              />
            ))
          ) : (
            <EmptyState message="No active jobs found." />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          ) : error ? (
            <EmptyState message={error} />
          ) : pendingJobs.length ? (
            pendingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStart={handleStartJob}
                onComplete={handleCompleteJob}
                starting={startingJobId === job.id}
                completing={completingJobId === job.id}
              />
            ))
          ) : (
            <EmptyState message="No pending jobs right now." />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          ) : error ? (
            <EmptyState message={error} />
          ) : completedJobs.length ? (
            completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStart={handleStartJob}
                onComplete={handleCompleteJob}
                starting={startingJobId === job.id}
                completing={completingJobId === job.id}
              />
            ))
          ) : (
            <EmptyState message="No completed jobs yet." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="py-10 text-center text-sm text-gray-500">
        {message}
      </CardContent>
    </Card>
  );
}

// Job Card Component
function JobCard({
  job,
  onStart,
  onComplete,
  starting,
  completing,
}: {
  job: ProviderJob;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  starting: boolean;
  completing: boolean;
}) {
  const statusKey = (job.status || "PENDING").toLowerCase();
  const badgeStyle = statusColors[statusKey] || "bg-gray-100 text-gray-700";
  const upperStatus = (job.status || "").toUpperCase();

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <Badge className={badgeStyle}>{statusLabel(job.status)}</Badge>
              </div>
              <div className="mt-2">
                <div className="font-medium">
                  Client: {job.client?.name || "Client"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatBudget(job)}</div>
              <div className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
                <Clock size={14} />
                Posted {formatPostedAgo(job.createdAt)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{job.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle size={16} />
              <span>{timelineLabel(job.timeline)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:w-48">
          <Button variant="outline" asChild>
            <Link href={`/provider/jobs/${job.id}`}>View Details</Link>
          </Button>
          {upperStatus === "IN_PROGRESS" && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/provider/jobs/${job.id}/update`}>Post Update</Link>
              </Button>
              <Button onClick={() => onComplete(job.id)} disabled={completing}>
                {completing ? "Completing..." : "Mark Complete"}
              </Button>
            </>
          )}
          {upperStatus === "ACCEPTED" && (
            <Button onClick={() => onStart(job.id)} disabled={starting}>
              <CheckCircle className="h-4 w-4 mr-1" />
              {starting ? "Starting..." : "Start Job"}
            </Button>
          )}
          {upperStatus !== "COMPLETED" && (
            <Button variant="outline" asChild>
              <Link
                href={`/provider/messages?job=${job.id}`}
                className="inline-flex items-center justify-center gap-1"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message Client
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
