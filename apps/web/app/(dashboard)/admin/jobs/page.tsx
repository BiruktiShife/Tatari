"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  User,
  AlertCircle,
  Eye,
  MoreVertical,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type AdminJob = {
  id: string;
  title: string;
  status: string;
  category: string;
  timeline?: string;
  location?: string;
  createdAt?: string;
  budgetType?: string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  acceptedQuoteAmount?: number | null;
  client?: { id: string; name: string } | null;
  provider?: { id: string; name: string } | null;
};

type JobsResponse = {
  jobs: AdminJob[];
  categories: string[];
  stats: {
    active: number;
    totalValue: number;
    pendingQuotes: number;
    completionRate: number;
  };
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-blue-100 text-blue-800",
  accepted: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
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

function formatBudget(job: AdminJob) {
  if (job.acceptedQuoteAmount != null) return `₵ ${job.acceptedQuoteAmount}`;
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

function formatCsvValue(value: unknown) {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function AdminJobsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [stats, setStats] = useState<JobsResponse["stats"]>({
    active: 0,
    totalValue: 0,
    pendingQuotes: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setJobs([]);
        setError("Missing admin token. Please log in again.");
        return;
      }

      const query = new URLSearchParams();
      if (searchQuery.trim()) query.set("search", searchQuery.trim());
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (categoryFilter !== "all") query.set("category", categoryFilter);

      const res = await fetch(resolveApiUrl(`/admin/users/jobs?${query.toString()}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load jobs.");
      }

      const data: JobsResponse = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      setCategories(
        Array.isArray(data.categories) && data.categories.length
          ? data.categories
          : ["all"],
      );
      setStats(
        data.stats || {
          active: 0,
          totalValue: 0,
          pendingQuotes: 0,
          completionRate: 0,
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs.");
      setJobs([]);
      setCategories(["all"]);
      setStats({ active: 0, totalValue: 0, pendingQuotes: 0, completionRate: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchJobs, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleStatusUpdate = async (jobId: string, status: string) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Not authenticated",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status.");
      }
      toast({ title: "Job status updated" });
      await fetchJobs();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Unable to update job status.",
        variant: "destructive",
      });
    }
  };

  const visibleJobs = useMemo(() => jobs, [jobs]);

  const handleExportJobs = () => {
    if (!jobs.length) {
      toast({
        title: "No jobs to export",
        description: "Try adjusting filters to include more jobs.",
      });
      return;
    }

    const headers = [
      "Job ID",
      "Title",
      "Status",
      "Category",
      "Timeline",
      "Location",
      "Created At",
      "Budget",
      "Client",
      "Provider",
    ];

    const rows = jobs.map((job) => [
      job.id,
      job.title,
      statusLabel(job.status),
      job.category || "",
      job.timeline || "",
      job.location || "",
      job.createdAt || "",
      formatBudget(job),
      job.client?.name || "",
      job.provider?.name || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(formatCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `jobs-export-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Jobs Management</h1>
            <p className="text-slate-200 mt-2">
              Monitor and manage all platform jobs.
            </p>
          </div>
          <Button
            variant="secondary"
            className="text-slate-900"
            onClick={handleExportJobs}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Export Jobs
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, client, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₵ {stats.totalValue}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <div className="text-sm text-gray-600">Pending Quotes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            ) : visibleJobs.length ? (
              visibleJobs.map((job) => {
                const statusKey = (job.status || "PENDING").toLowerCase();
                return (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {job.location || "Location not specified"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatPostedAgo(job.createdAt)}
                          </div>
                          <Badge variant="outline">{job.category}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div className="font-medium">
                          {job.client?.name || "Client"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.provider ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <User size={14} className="text-green-600" />
                          </div>
                          <div className="font-medium">{job.provider.name}</div>
                        </div>
                      ) : (
                        <Badge variant="outline">Awaiting Provider</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[statusKey] || "bg-gray-100 text-gray-700"}>
                        {statusLabel(job.status)}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {job.timeline || "Flexible"}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{formatBudget(job)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/jobs/${job.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusKey !== "completed" && (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleStatusUpdate(job.id, "COMPLETED")}
                              >
                                Mark Completed
                              </DropdownMenuItem>
                            )}
                            {statusKey !== "cancelled" && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleStatusUpdate(job.id, "CANCELLED")}
                              >
                                Cancel Job
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
