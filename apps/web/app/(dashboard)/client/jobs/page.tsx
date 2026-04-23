"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  Sparkles,
  BriefcaseBusiness,
  HandCoins,
  MessageCircleMore,
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
import { useToast } from "@/hooks/use-toast";

type JobItem = {
  id: string;
  title: string;
  category?: string;
  status?: string;
  budgetType?: "FIXED" | "HOURLY" | "RANGE" | string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  location?: string;
  quotesCount?: number;
  timeline?: string;
  createdAt?: string;
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

function resolveJobsUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}/jobs`;
    } catch (e) {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}/jobs`;
      throw e;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    return origin.includes("localhost")
      ? `http://localhost:3003/jobs`
      : `${origin}/jobs`;
  }
  return `/jobs`;
}

function resolveApiBase() {
  return resolveJobsUrl().replace(/\/jobs$/, "");
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

function formatBudget(job: JobItem) {
  if (job.budgetType === "RANGE") return `₵ ${job.budgetMin ?? 0} - ${job.budgetMax ?? 0}`;
  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `₵ ${job.budgetAmount}/hr`
      : `₵ ${job.budgetAmount}`;
  }
  return "Budget not set";
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

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingJobId, setApprovingJobId] = useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(resolveJobsUrl(), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          console.error("Failed to fetch jobs", await res.text());
          setJobs([]);
          return;
        }

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = !q
        ? true
        : [job.title, job.location, job.category]
            .filter(Boolean)
            .some((val) => String(val).toLowerCase().includes(q));

      const jobStatus = (job.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ? true : jobStatus === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const activeJobs = filteredJobs.filter(
    (j) => !["completed", "cancelled", "expired"].includes((j.status || "").toLowerCase()),
  );
  const pendingJobs = filteredJobs.filter(
    (j) => (j.status || "").toLowerCase() === "pending",
  );
  const completedJobs = filteredJobs.filter(
    (j) => (j.status || "").toLowerCase() === "completed",
  );

  const stats = useMemo(() => {
    const active = jobs.filter(
      (j) => !["COMPLETED", "CANCELLED", "EXPIRED"].includes((j.status || "").toUpperCase()),
    ).length;
    const quotes = jobs.reduce((sum, j) => sum + (j.quotesCount || 0), 0);
    const budget = jobs.reduce((sum, j) => {
      if (j.budgetAmount != null) return sum + j.budgetAmount;
      if (j.budgetMax != null) return sum + j.budgetMax;
      if (j.budgetMin != null) return sum + j.budgetMin;
      return sum;
    }, 0);
    return { active, quotes, budget, total: jobs.length };
  }, [jobs]);

  const handleApproveCompletion = async (jobId: string) => {
    try {
      setApprovingJobId(jobId);
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
      const res = await fetch(
        resolveJobsUrl().replace(/\/jobs$/, `/jobs/${jobId}/approve-completion`),
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to approve completion.");
      }
      toast({
        title: "Completion approved",
        description: "Payment has been released to the provider.",
      });
    } catch (err) {
      toast({
        title: "Approval failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setApprovingJobId(null);
    }
  };

  const handlePayNow = async (jobId: string) => {
    try {
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
      const res = await fetch(`${resolveApiBase()}/payments/chapa/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.message || "Failed to initialize payment.";
        throw new Error(message);
      }
      if (data?.status === "paid") {
        toast({
          title: "Payment already completed",
          description: "This job is already paid.",
        });
        return;
      }
      if (data?.checkout_url) {
        window.location.href = data.checkout_url as string;
        return;
      }
      toast({
        title: "Payment error",
        description: "Missing checkout URL from payment provider.",
        variant: "destructive",
      });
    } catch (err) {
      toast({
        title: "Payment failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
          <Sparkles className="h-4 w-4" />
          Client Jobs Hub
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-slate-200 mt-2">
              Track your job requests, quotes, and progress in one place.
            </p>
          </div>
          <Button asChild variant="secondary" className="text-slate-900">
            <Link href="/client/post-job">Post New Job</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Active Jobs</p>
              <BriefcaseBusiness className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Jobs</p>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Quotes Received</p>
              <MessageCircleMore className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.quotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Visible Budget</p>
              <HandCoins className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">₵ {Math.round(stats.budget)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs by title, location, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
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
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingJobs.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          ) : activeJobs.length ? (
            activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApproveCompletion={handleApproveCompletion}
                onPayNow={handlePayNow}
                approving={approvingJobId === job.id}
              />
            ))
          ) : (
            <EmptyState message="No active jobs found." />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingJobs.length ? (
            pendingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApproveCompletion={handleApproveCompletion}
                onPayNow={handlePayNow}
                approving={approvingJobId === job.id}
              />
            ))
          ) : (
            <EmptyState message="No pending jobs right now." />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedJobs.length ? (
            completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApproveCompletion={handleApproveCompletion}
                onPayNow={handlePayNow}
                approving={approvingJobId === job.id}
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

function JobCard({
  job,
  onApproveCompletion,
  onPayNow,
  approving,
}: {
  job: JobItem;
  onApproveCompletion: (id: string) => void;
  onPayNow: (id: string) => void;
  approving: boolean;
}) {
  const statusKey = (job.status || "pending").toLowerCase();
  const badgeStyle = statusColors[statusKey] || "bg-gray-100 text-gray-700";

  return (
    <Card className="border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <Badge className={badgeStyle}>{statusLabel(job.status)}</Badge>
              {job.category && <Badge variant="outline">{job.category}</Badge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={15} />
                <span>{job.location || "Location not provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <span>Posted {formatPostedAgo(job.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{job.timeline || "Flexible timeline"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:items-end gap-3">
            <div className="text-xl font-bold text-slate-900">{formatBudget(job)}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/client/jobs/${job.id}`}>View Details</Link>
              </Button>
              {statusKey === "pending" && (
                <Button size="sm" asChild>
                  <Link href={`/client/jobs/${job.id}/quotes`}>
                    View Quotes ({job.quotesCount || 0})
                  </Link>
                </Button>
              )}
              {statusKey === "in_progress" && (
                <>
                  <Button size="sm" asChild>
                    <Link href={`/client/jobs/${job.id}/updates`}>
                      View Updates
                    </Link>
                  </Button>
                  <Button size="sm" onClick={() => onPayNow(job.id)}>
                    Pay Now
                  </Button>
                </>
              )}
              {statusKey === "completed" && (
                <Button
                  size="sm"
                  onClick={() => onApproveCompletion(job.id)}
                  disabled={approving}
                >
                  {approving ? "Approving..." : "Approve & Release Payment"}
                </Button>
              )}
              {statusKey === "completed" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/client/disputes/new?jobId=${job.id}`}>
                    Raise Dispute
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
