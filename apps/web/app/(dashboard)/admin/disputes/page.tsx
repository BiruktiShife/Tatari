"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DisputeParty = {
  id: string;
  name: string;
  type: string;
};

type DisputeJob = {
  id: string;
  title: string;
};

type DisputeItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  description?: string | null;
  resolution?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  job?: DisputeJob | null;
  clientId?: string | null;
  providerId?: string | null;
  raisedBy?: DisputeParty | null;
  against?: DisputeParty | null;
};

type DisputesResponse = {
  disputes: DisputeItem[];
  stats: {
    active: number;
    resolvedThisMonth: number;
    avgResolutionDays: number;
    resolutionRate: number;
  };
};

const priorityColors: Record<string, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-sky-200 bg-sky-50 text-sky-700",
};

const statusColors: Record<string, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-700",
  investigating: "border-violet-200 bg-violet-50 text-violet-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  escalated: "border-rose-200 bg-rose-50 text-rose-700",
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

function formatPostedAgo(dateStr?: string | null) {
  if (!dateStr) return "—";
  const postedAt = new Date(dateStr).getTime();
  if (Number.isNaN(postedAt)) return "—";

  const mins = Math.max(1, Math.floor((Date.now() - postedAt) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function formatStatus(status: string) {
  const key = status.toUpperCase();
  if (key === "OPEN") return "Open";
  if (key === "INVESTIGATING") return "Investigating";
  if (key === "RESOLVED") return "Resolved";
  if (key === "ESCALATED") return "Escalated";
  return key.charAt(0) + key.slice(1).toLowerCase();
}

function formatUserType(type?: string) {
  if (!type) return "User";
  if (type === "CLIENT") return "Client";
  if (type === "PROVIDER") return "Provider";
  if (type === "ADMIN") return "Admin";
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export default function AdminDisputesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [detailDispute, setDetailDispute] = useState<DisputeItem | null>(null);
  const [resolveDispute, setResolveDispute] = useState<DisputeItem | null>(
    null,
  );
  const [resolutionText, setResolutionText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<DisputesResponse["stats"]>({
    active: 0,
    resolvedThisMonth: 0,
    avgResolutionDays: 0,
    resolutionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setDisputes([]);
          setError("Missing admin token. Please log in again.");
          return;
        }

        const query = new URLSearchParams();
        if (searchQuery.trim()) query.set("search", searchQuery.trim());
        if (statusFilter !== "all") query.set("status", statusFilter);

        const res = await fetch(
          resolveApiUrl(`/admin/users/disputes?${query.toString()}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load disputes.");
        }

        const data: DisputesResponse = await res.json();
        setDisputes(Array.isArray(data.disputes) ? data.disputes : []);
        setStats(
          data.stats || {
            active: 0,
            resolvedThisMonth: 0,
            avgResolutionDays: 0,
            resolutionRate: 0,
          },
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load disputes.",
        );
        setDisputes([]);
        setStats({
          active: 0,
          resolvedThisMonth: 0,
          avgResolutionDays: 0,
          resolutionRate: 0,
        });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, statusFilter, refreshKey]);

  const filteredDisputes = useMemo(() => {
    if (priorityFilter === "all") return disputes;
    return disputes.filter((d) => d.priority === priorityFilter);
  }, [disputes, priorityFilter]);

  const openDisputes = useMemo(
    () => filteredDisputes.filter((d) => d.status !== "RESOLVED"),
    [filteredDisputes],
  );
  const resolvedDisputes = useMemo(
    () => filteredDisputes.filter((d) => d.status === "RESOLVED"),
    [filteredDisputes],
  );

  const handleResolve = async () => {
    if (!resolveDispute) return;
    if (!resolutionText.trim()) {
      toast({
        title: "Resolution required",
        description: "Provide a resolution note before closing the dispute.",
        variant: "destructive",
      });
      return;
    }
    try {
      setActionLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("Missing admin token. Please log in again.");

      const res = await fetch(
        resolveApiUrl(`/admin/users/disputes/${resolveDispute.id}/resolve`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution: resolutionText.trim() }),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to resolve dispute.");
      }

      toast({ title: "Dispute resolved" });
      setResolveDispute(null);
      setResolutionText("");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast({
        title: "Resolve failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (dispute: DisputeItem) => {
    try {
      setActionLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("Missing admin token. Please log in again.");

      const res = await fetch(
        resolveApiUrl(`/admin/users/disputes/${dispute.id}/escalate`),
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to escalate dispute.");
      }

      toast({ title: "Dispute escalated" });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      toast({
        title: "Escalation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Dispute resolution
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Disputes Management
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Review and resolve platform disputes in a cleaner, more readable view.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search disputes by title, user, or job..."
            className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.active}</div>
                <div className="text-sm text-slate-600">Active Disputes</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stats.resolvedThisMonth}
                </div>
                <div className="text-sm text-slate-600">Resolved This Month</div>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stats.avgResolutionDays}
                </div>
                <div className="text-sm text-slate-600">
                  Avg. Resolution Time (days)
                </div>
              </div>
              <Clock className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  {stats.resolutionRate}%
                </div>
                <div className="text-sm text-slate-600">Resolution Rate</div>
              </div>
              <Shield className="h-8 w-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open" className="w-full space-y-4">
        <TabsList className="grid grid-cols-1 gap-2 bg-slate-100 p-1 sm:grid-cols-2">
          <TabsTrigger value="open">
            Open Disputes ({openDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedDisputes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <Card className="border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute Details</TableHead>
                    <TableHead>Parties Involved</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Opened</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-slate-500"
                      >
                        Loading disputes...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-red-600"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : openDisputes.length ? (
                    openDisputes.map((dispute) => {
                      const statusKey = dispute.status.toLowerCase();
                      return (
                        <TableRow key={dispute.id}>
                          <TableCell>
                            <div className="font-medium">{dispute.title}</div>
                            <div className="text-sm text-slate-500">
                              Case #{dispute.id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400" />
                                <span className="text-sm">
                                  {formatUserType(dispute.raisedBy?.type)}:{" "}
                                  {dispute.raisedBy?.name || "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400" />
                                <span className="text-sm">
                                  Against: {dispute.against?.name || "—"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {dispute.job?.title || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                                className={`border ${priorityColors[dispute.priority] || priorityColors.low}`}
                              >
                              {dispute.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                                className={`border ${statusColors[statusKey] || "border-slate-200 bg-slate-50 text-slate-700"}`}
                              >
                              {formatStatus(dispute.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock size={14} />
                              {formatPostedAgo(dispute.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setDetailDispute(dispute)}
                                  >
                                    Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setResolveDispute(dispute);
                                      setResolutionText(
                                        dispute.resolution || "",
                                      );
                                    }}
                                  >
                                    Resolve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEscalate(dispute)}
                                    disabled={actionLoading}
                                  >
                                    Escalate
                                  </DropdownMenuItem>
                                  {dispute.job?.id && (
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/admin/jobs/${dispute.job.id}`}
                                      >
                                        View Job
                                      </Link>
                                    </DropdownMenuItem>
                                  )}
                                  {dispute.clientId && dispute.job?.id && (
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/client/messages?job=${dispute.job.id}`}
                                      >
                                        Message Client
                                      </Link>
                                    </DropdownMenuItem>
                                  )}
                                  {dispute.providerId && dispute.job?.id && (
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/provider/messages?job=${dispute.job.id}`}
                                      >
                                        Message Provider
                                      </Link>
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
                      <TableCell
                        colSpan={7}
                        className="text-center text-sm text-gray-500"
                      >
                        No open disputes found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[840px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute Details</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Time to Resolve</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-slate-500"
                      >
                        Loading disputes...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-red-600"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : resolvedDisputes.length ? (
                    resolvedDisputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell>
                          <div className="font-medium">{dispute.title}</div>
                          <div className="text-sm text-slate-500">
                            Case #{dispute.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {dispute.resolution || "Resolved"}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock size={14} />
                            Opened: {formatDate(dispute.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Resolved: {formatDate(dispute.resolvedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setDetailDispute(dispute)}
                              >
                                Review
                              </DropdownMenuItem>
                              {dispute.job?.id && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/jobs/${dispute.job.id}`}>
                                    View Job
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {dispute.clientId && dispute.job?.id && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/client/messages?job=${dispute.job.id}`}
                                  >
                                    Message Client
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {dispute.providerId && dispute.job?.id && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/provider/messages?job=${dispute.job.id}`}
                                  >
                                    Message Provider
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-sm text-slate-500"
                      >
                        No resolved disputes found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(detailDispute)}
        onOpenChange={(open) => !open && setDetailDispute(null)}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>Case overview and context.</DialogDescription>
          </DialogHeader>
          {detailDispute && (
            <div className="space-y-3 text-sm text-slate-700">
              <div>
                <span className="text-slate-500">Title:</span>{" "}
                {detailDispute.title}
              </div>
              <div>
                <span className="text-slate-500">Status:</span>{" "}
                {formatStatus(detailDispute.status)}
              </div>
              <div>
                <span className="text-slate-500">Priority:</span>{" "}
                {detailDispute.priority.toUpperCase()}
              </div>
              <div>
                <span className="text-slate-500">Job:</span>{" "}
                {detailDispute.job?.title || "—"}
              </div>
              <div>
                <span className="text-slate-500">Raised by:</span>{" "}
                {detailDispute.raisedBy?.name || "—"} (
                {formatUserType(detailDispute.raisedBy?.type)})
              </div>
              <div>
                <span className="text-slate-500">Against:</span>{" "}
                {detailDispute.against?.name || "—"}
              </div>
              <div>
                <span className="text-slate-500">Opened:</span>{" "}
                {formatDate(detailDispute.createdAt)}
              </div>
              <div>
                <span className="text-slate-500">Resolved:</span>{" "}
                {formatDate(detailDispute.resolvedAt)}
              </div>
              <div>
                <span className="text-slate-500">Description:</span>{" "}
                {detailDispute.description || "—"}
              </div>
              <div>
                <span className="text-slate-500">Resolution:</span>{" "}
                {detailDispute.resolution || "—"}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDispute(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(resolveDispute)}
        onOpenChange={(open) => !open && setResolveDispute(null)}
      >
        <DialogContent className="border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Provide the resolution details before closing this case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              rows={4}
              placeholder="Resolution summary..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDispute(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Resolve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
