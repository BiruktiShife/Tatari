"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MoreVertical,
  Gavel,
  Scale,
  History,
  Target,
  Loader2,
  ExternalLink,
  MessageSquare,
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
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Config Mapping
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "Open Case", color: "text-amber-700", bg: "bg-amber-50" },
  investigating: {
    label: "In Review",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  escalated: { label: "Escalated", color: "text-rose-700", bg: "bg-rose-50" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "Urgent", color: "bg-rose-500 text-white" },
  medium: { label: "Standard", color: "bg-amber-100 text-amber-700" },
  low: { label: "Low", color: "bg-slate-100 text-slate-500" },
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export default function AdminDisputesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolveDispute, setResolveDispute] = useState<any | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [stats, setStats] = useState({
    active: 0,
    resolvedThisMonth: 0,
    avgResolutionDays: 0,
    resolutionRate: 0,
  });

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();
      if (searchQuery) query.set("search", searchQuery);
      if (statusFilter !== "all") query.set("status", statusFilter);

      const res = await fetch(
        resolveApiUrl(`/admin/users/disputes?${query.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setDisputes(data.disputes || []);
        setStats(data.stats || stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchDisputes, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleResolve = async () => {
    if (!resolveDispute || !resolutionText.trim()) return;
    try {
      const token = localStorage.getItem("token");
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
      if (res.ok) {
        toast({
          title: "Case Closed",
          description: "Dispute has been successfully resolved.",
        });
        setResolveDispute(null);
        setResolutionText("");
        fetchDisputes();
      }
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-500/10 blur-[100px] z-0" />
        <div className="relative z-10 space-y-4">
          <Badge className="bg-rose-500/20 text-rose-300 border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
            Resolution Hub
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Dispute Mediation
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Audit platform conflicts, review evidence, and issue final verdicts
            on escrow releases.
          </p>
        </div>
      </section>

      {/* 2. Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Active Tickets",
            val: stats.active,
            icon: Gavel,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Resolved (MTD)",
            val: stats.resolvedThisMonth,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Avg. Cycle Time",
            val: `${stats.avgResolutionDays} Days`,
            icon: Clock,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Resolution Rate",
            val: `${stats.resolutionRate}%`,
            icon: Target,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 leading-none">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={22} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Global Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={20}
          />
          <Input
            className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base placeholder:text-slate-400"
            placeholder="Find by Case ID, Project Title, or Participant Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-[180px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
              <Filter className="mr-2 text-slate-400" size={16} />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="open">Open Cases</SelectItem>
              <SelectItem value="resolved">Closed Cases</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Disputes Registry */}
      <Tabs defaultValue="open" className="w-full space-y-6">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-md">
          <TabsTrigger
            value="open"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Queue
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Archive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="outline-none animate-in fade-in">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-6 text-left">Conflict Context</th>
                    <th className="px-8 py-6 text-left">
                      Plaintiff vs. Defendant
                    </th>
                    <th className="px-8 py-6 text-left">Priority</th>
                    <th className="px-8 py-6 text-left">Audit State</th>
                    <th className="px-8 py-6 text-right">Mediation</th>
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
                    disputes.map((d) => {
                      // 1. Get the keys
                      const sKey = (d.status || "open").toLowerCase();
                      const pKey = (d.priority || "low").toLowerCase();

                      // 2. Perform lookup and CAST the result to the required shape
                      // This tells TypeScript: "Status/Priority will DEFINITELY have these properties"
                      const status = (statusConfig[sKey] ||
                        statusConfig.open) as {
                        label: string;
                        color: string;
                        bg: string;
                      };
                      const priority = (priorityConfig[pKey] ||
                        priorityConfig.low) as { label: string; color: string };

                      const displayId =
                        typeof d.id === "string" ? d.id.slice(0, 8) : "...";

                      return (
                        <tr
                          key={d.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                              {d.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <History size={10} />{" "}
                              {new Date(d.createdAt).toLocaleDateString()} • ID:{" "}
                              {displayId}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs">
                            <p className="font-bold text-slate-900">
                              {d.raisedBy?.name || "Unknown"}
                            </p>
                            <p className="text-slate-400 italic">
                              Against: {d.against?.name || "—"}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            {/* TypeScript error should be gone now */}
                            <Badge
                              className={`border-none rounded-full px-3 py-0.5 font-bold text-[9px] uppercase tracking-tighter ${priority.color}`}
                            >
                              {priority.label}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">
                            {/* TypeScript error should be gone now */}
                            <Badge
                              className={`border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${status.bg} ${status.color}`}
                            >
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-xl text-slate-300 hover:text-slate-900"
                                >
                                  <MoreVertical size={20} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="rounded-2xl p-2 shadow-2xl border-slate-100"
                              >
                                <DropdownMenuItem className="rounded-xl font-bold gap-2 text-slate-600">
                                  <ExternalLink size={16} /> Audit Case
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="rounded-xl font-bold gap-2 text-emerald-600"
                                  onClick={() => setResolveDispute(d)}
                                >
                                  <Scale size={16} /> Close & Settle
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold gap-2 text-indigo-600">
                                  <MessageSquare size={16} /> Contact Parties
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 5. Resolution Dialog */}
      <Dialog
        open={Boolean(resolveDispute)}
        onOpenChange={() => setResolveDispute(null)}
      >
        <DialogContent className="rounded-[2.5rem] p-10 max-w-2xl border-none">
          <DialogHeader className="mb-6">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
              <ShieldAlert size={32} />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
              Final Resolution
            </DialogTitle>
            <DialogDescription>
              Issuing a final verdict on Case #
              {typeof resolveDispute?.id === "string"
                ? resolveDispute.id.slice(0, 8)
                : "..."}
              . This action is permanent.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400 ml-1">
              Resolution Summary
            </Label>
            <Textarea
              className="min-h-[150px] bg-slate-50 border-none rounded-[2rem] p-6 text-base"
              placeholder="Provide reasoning for this outcome..."
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <Button
              variant="ghost"
              className="rounded-xl font-bold px-8"
              onClick={() => setResolveDispute(null)}
            >
              Discard
            </Button>
            <Button
              className="rounded-xl bg-slate-900 px-10 font-bold h-12 hover:bg-emerald-600 transition-colors"
              onClick={handleResolve}
            >
              Commit Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
