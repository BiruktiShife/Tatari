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
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800",
  investigating: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
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
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Disputes Management</h1>
            <p className="text-slate-200 mt-2">
              Review and resolve platform disputes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search disputes by title, user, or job..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-gray-600">Active Disputes</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {stats.resolvedThisMonth}
                </div>
                <div className="text-sm text-gray-600">Resolved This Month</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {stats.avgResolutionDays}
                </div>
                <div className="text-sm text-gray-600">
                  Avg. Resolution Time (days)
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {stats.resolutionRate}%
                </div>
                <div className="text-sm text-gray-600">Resolution Rate</div>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList className="mb-6 grid grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="open">
            Open Disputes ({openDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedDisputes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <Card>
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
                        className="text-center text-sm text-gray-500"
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
                            <div className="text-sm text-gray-500">
                              Case #{dispute.id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                <span className="text-sm">
                                  {formatUserType(dispute.raisedBy?.type)}:{" "}
                                  {dispute.raisedBy?.name || "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
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
                              className={
                                priorityColors[dispute.priority] ||
                                priorityColors.low
                              }
                            >
                              {dispute.priority.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                statusColors[statusKey] ||
                                "bg-gray-100 text-gray-700"
                              }
                            >
                              {formatStatus(dispute.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
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
          <Card>
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
                        className="text-center text-sm text-gray-500"
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
                          <div className="text-sm text-gray-500">
                            Case #{dispute.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          {dispute.resolution || "Resolved"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock size={14} />
                            Opened: {formatDate(dispute.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Resolved: {formatDate(dispute.resolvedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
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
                        className="text-center text-sm text-gray-500"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>Case overview and context.</DialogDescription>
          </DialogHeader>
          {detailDispute && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Title:</span>{" "}
                {detailDispute.title}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{" "}
                {formatStatus(detailDispute.status)}
              </div>
              <div>
                <span className="text-gray-500">Priority:</span>{" "}
                {detailDispute.priority.toUpperCase()}
              </div>
              <div>
                <span className="text-gray-500">Job:</span>{" "}
                {detailDispute.job?.title || "—"}
              </div>
              <div>
                <span className="text-gray-500">Raised by:</span>{" "}
                {detailDispute.raisedBy?.name || "—"} (
                {formatUserType(detailDispute.raisedBy?.type)})
              </div>
              <div>
                <span className="text-gray-500">Against:</span>{" "}
                {detailDispute.against?.name || "—"}
              </div>
              <div>
                <span className="text-gray-500">Opened:</span>{" "}
                {formatDate(detailDispute.createdAt)}
              </div>
              <div>
                <span className="text-gray-500">Resolved:</span>{" "}
                {formatDate(detailDispute.resolvedAt)}
              </div>
              <div>
                <span className="text-gray-500">Description:</span>{" "}
                {detailDispute.description || "—"}
              </div>
              <div>
                <span className="text-gray-500">Resolution:</span>{" "}
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
        <DialogContent>
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
