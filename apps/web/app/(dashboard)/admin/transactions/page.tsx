"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Clock,
  TrendingUp,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  CreditCard,
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

// Config Mapping
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  completed: {
    label: "Settled",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  pending: { label: "In Escrow", color: "text-amber-700", bg: "bg-amber-50" },
  failed: { label: "Declined", color: "text-rose-700", bg: "bg-rose-50" },
  refunded: { label: "Refunded", color: "text-blue-700", bg: "bg-blue-50" },
};

const mockTransactions = [
  {
    id: "TX-001",
    amount: 500,
    client: "John Doe",
    provider: "Samuel Plumbing",
    job: "Fix Kitchen Sink Leak",
    date: "Mar 15, 2024",
    status: "completed",
    type: "payment",
    fee: 25,
  },
  {
    id: "TX-002",
    amount: 1200,
    client: "Sarah Smith",
    provider: "Dawit Painting",
    job: "Paint Living Room Walls",
    date: "Mar 14, 2024",
    status: "pending",
    type: "payment",
    fee: 60,
  },
  {
    id: "TX-003",
    amount: 3500,
    client: "Emma Wilson",
    provider: "Mike AC Services",
    job: "AC Installation",
    date: "Mar 10, 2024",
    status: "completed",
    type: "payment",
    fee: 175,
  },
  {
    id: "TX-004",
    amount: 250,
    client: "Mike Johnson",
    provider: "System",
    job: "Membership Fee",
    date: "Mar 01, 2024",
    status: "completed",
    type: "fee",
    fee: 0,
  },
];

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchesSearch = [tx.id, tx.client, tx.provider, tx.job].some((v) =>
        v.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      const matchesStatus =
        statusFilter === "all" || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
              Financial Ledger
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Marketplace Revenue
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Audit platform cash flow, platform service fees, and manage escrow
              release schedules.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold gap-2"
            >
              <Download size={18} /> Export Statement
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 gap-2">
              <TrendingUp size={20} /> Financial Report
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Balance Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Volume",
            val: "ETB 24,500",
            icon: CreditCard,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Platform Revenue",
            val: "ETB 1,225",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Escrow Hold",
            val: "ETB 8,400",
            icon: ShieldCheck,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Pending Payouts",
            val: "12",
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
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
                <h3 className="text-2xl font-black text-slate-900 leading-none">
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
            placeholder="Audit by transaction ID, job name, or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="month">
            <SelectTrigger className="h-14 w-[180px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
              <SelectValue placeholder="Timeline" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-[180px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
              <Filter className="mr-2 text-slate-400" size={16} />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Settled</SelectItem>
              <SelectItem value="pending">In Escrow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4. Main Ledger */}
      <Tabs defaultValue="all" className="w-full space-y-6">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-md">
          <TabsTrigger
            value="all"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Global Ledger
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Needs Release
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="outline-none animate-in fade-in">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-6 text-left">Internal ID</th>
                    <th className="px-8 py-6 text-left">Financial Flow</th>
                    <th className="px-8 py-6 text-left">Gross Amount</th>
                    <th className="px-8 py-6 text-left">Market Fee</th>
                    <th className="px-8 py-6 text-left">Status</th>
                    <th className="px-8 py-6 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((tx) => {
                    const fallback = {
                      label: "Unknown",
                      color: "text-slate-500",
                      bg: "bg-slate-100",
                    };
                    const status = statusConfig[tx.status] || fallback;
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <p className="font-mono font-bold text-slate-900 text-sm tracking-tighter">
                            {tx.id}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            {tx.date}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                              {tx.job}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              <span>{tx.client}</span>
                              <ChevronRight
                                size={10}
                                className="text-slate-300"
                              />
                              <span className="text-slate-600">
                                {tx.provider}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-900 text-lg">
                          ETB {tx.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-indigo-600">
                            ETB {tx.fee}
                          </p>
                          <p className="text-[10px] font-black text-slate-300 uppercase">
                            5% Platform
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <Badge
                            className={`border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-slate-300 hover:text-slate-900 hover:bg-white shadow-none"
                          >
                            <MoreHorizontal size={20} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="pending"
          className="outline-none animate-in fade-in"
        >
          {/* Pending logic simplified for visual showcase - uses same aesthetic */}
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <ShieldCheck className="mx-auto text-emerald-400 mb-4" size={48} />
            <p className="text-slate-500 font-bold italic">
              No payouts currently awaiting release.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
