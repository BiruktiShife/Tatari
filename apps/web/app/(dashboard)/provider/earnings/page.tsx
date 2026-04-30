"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  ChevronRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "recharts";

const transactions = [
  {
    id: "TX-001",
    job: "AC Installation",
    client: "Emma Wilson",
    date: "Mar 15, 2024",
    amount: 3500,
    status: "paid",
    type: "job",
  },
  {
    id: "TX-002",
    job: "Fix Bathroom Pipe",
    client: "John Doe",
    date: "Mar 14, 2024",
    amount: 800,
    status: "paid",
    type: "job",
  },
  {
    id: "TX-003",
    job: "Monthly Maintenance",
    client: "Mike Johnson",
    date: "Mar 10, 2024",
    amount: 1500,
    status: "pending",
    type: "job",
  },
  {
    id: "TX-004",
    job: "Withdrawal",
    client: "-",
    date: "Mar 01, 2024",
    amount: -5000,
    status: "completed",
    type: "withdrawal",
  },
];

export default function ProviderEarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("1");

  const availableBalance = 5800;
  const pendingBalance = 1500;
  const totalEarnings = 24500;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold">
              Revenue Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Earnings
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Track your income, manage payouts, and view your tax-ready
              statements.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold gap-2"
          >
            <Download size={18} /> Export Statement
          </Button>
        </div>
      </section>

      {/* 2. Balance Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Available Now",
            val: `ETB ${availableBalance.toLocaleString()}`,
            icon: Wallet,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            sub: "Ready for withdrawal",
          },
          {
            label: "Pending Clearance",
            val: `ETB ${pendingBalance.toLocaleString()}`,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
            sub: "Clears in 48 hours",
          },
          {
            label: "Total Revenue",
            val: `ETB ${totalEarnings.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            sub: "Lifetime performance",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 leading-none mb-2">
                  {stat.val}
                </h3>
                <p
                  className={`text-xs font-bold ${stat.color} flex items-center gap-1`}
                >
                  <stat.icon size={12} /> {stat.sub}
                </p>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. Withdrawal Flow */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden p-2">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ArrowUpRight size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Withdraw Funds
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Amount Selection */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      Transfer Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                        ETB
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-xl font-black text-indigo-600"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-medium ml-1">
                      Available: ETB {availableBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setWithdrawAmount(amt.toString())}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white transition-all text-sm font-bold text-slate-600"
                      >
                        ETB {amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payout Method */}
                <div className="space-y-4">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Destination Account
                  </Label>
                  <div className="space-y-3">
                    {[
                      {
                        id: "1",
                        type: "Telebirr Wallet",
                        last: "4321",
                        primary: true,
                      },
                      {
                        id: "2",
                        type: "Commercial Bank",
                        last: "8821",
                        primary: false,
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between
                                        ${selectedMethod === method.id ? "border-indigo-600 bg-indigo-50/50 shadow-sm" : "border-slate-50 bg-slate-50 hover:border-slate-200"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center ${selectedMethod === method.id ? "bg-indigo-600 text-white" : "bg-white text-slate-400"}`}
                          >
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {method.type}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                              **** {method.last}
                            </p>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle2 size={18} className="text-indigo-600" />
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full text-indigo-600 font-bold text-xs gap-2"
                    >
                      <Plus size={14} /> Add New Method
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Receipt Summary */}
            <div className="bg-slate-50 p-8 md:p-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Withdrawal</span>
                  <span className="text-slate-900">
                    ETB {withdrawAmount || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Processing (1%)</span>
                  <span className="text-rose-500">
                    - ETB{" "}
                    {(parseFloat(withdrawAmount || "0") * 0.01).toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="font-black text-slate-900">
                    Net Transfer
                  </span>
                  <span className="font-black text-indigo-600">
                    ETB {(parseFloat(withdrawAmount || "0") * 0.99).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="w-full md:w-auto h-14 px-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow-xl transition-all text-lg"
              >
                Confirm Payout
              </Button>
            </div>
          </Card>

          {/* 4. Transactions List */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
              <h3 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h3>
              <div className="flex gap-2">
                <Select defaultValue="month">
                  <SelectTrigger className="h-10 w-[140px] bg-white border-slate-100 rounded-xl shadow-sm text-xs font-bold text-slate-500">
                    <Calendar size={14} className="mr-2" /> <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 
                                        ${tx.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownRight size={24} />
                        ) : (
                          <ArrowUpRight size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {tx.job}
                        </h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {tx.date} • ID: {tx.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-10 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <div className="text-right">
                        <p
                          className={`text-lg font-black ${tx.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}
                        >
                          {tx.amount > 0
                            ? `+ETB ${tx.amount.toLocaleString()}`
                            : `-ETB ${Math.abs(tx.amount).toLocaleString()}`}
                        </p>
                        <Badge
                          className={`mt-1 border-none shadow-none text-[9px] font-black uppercase tracking-tighter rounded-full
                                            ${tx.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-slate-600"
                      >
                        <MoreHorizontal size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Insights Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Payout Security</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                Your earnings are protected by 256-bit encryption. We process
                payouts through verified channels to ensure your money arrives
                safely.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle2 size={16} className="text-emerald-400" />{" "}
                  PCI-DSS Compliant
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle2 size={16} className="text-emerald-400" />{" "}
                  Encrypted Subaccounts
                </div>
              </div>
            </div>
          </Card>

          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">
              Quick Help
            </h4>
            <div className="space-y-6">
              <button className="flex items-center justify-between w-full group text-left">
                <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  When will I get my money?
                </span>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button className="flex items-center justify-between w-full group text-left">
                <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  How are fees calculated?
                </span>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
              <button className="flex items-center justify-between w-full group text-left text-indigo-600 font-black text-xs uppercase tracking-widest pt-4 border-t border-slate-50">
                Visit Billing Center
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
