"use client";

import React, { useState } from "react";
import {
  Filter,
  Download,
  CreditCard,
  Wallet,
  TrendingUp,
  Plus,
  Clock,
  ShieldCheck,
  MoreHorizontal,
  Search,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const transactions = [
  {
    id: "1",
    date: "Mar 15, 2024",
    desc: "Fix Kitchen Sink - Samuel Plumbing", // Changed 'description' to 'desc'
    amount: -500, // Changed from string to number
    status: "completed",
    type: "payment",
    method: "Escrow",
  },
  {
    id: "2",
    date: "Mar 10, 2024",
    desc: "Paint Living Room - Dawit Painting",
    amount: -1200,
    status: "completed",
    type: "payment",
    method: "Escrow",
  },
  {
    id: "4",
    date: "Mar 20, 2024",
    desc: "Plumbing Deposit",
    amount: -500,
    status: "pending",
    type: "deposit",
    method: "Telebirr",
  },
  {
    id: "5",
    date: "Mar 01, 2024",
    desc: "Refund - Cancelled Job",
    amount: 250,
    status: "completed",
    type: "refund",
    method: "Escrow",
  },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Premium Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Finances
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Manage your secure escrow payments and billing history.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold"
            >
              <Download size={18} className="mr-2" /> Export
            </Button>
            <Button className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-500/20">
              <Plus size={18} className="mr-2" /> Add Funds
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Invested",
            val: "₵ 5,200",
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Pending Approval",
            val: "₵ 1,150",
            icon: CreditCard,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Escrow Protection",
            val: "₵ 500",
            icon: ShieldCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-8"
      >
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-2xl">
          <TabsTrigger
            value="transactions"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="methods"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Methods
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6 outline-none">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={20}
              />
              <Input
                className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base"
                placeholder="Search transactions..."
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="h-14 md:w-[220px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
                <Filter className="mr-2 text-slate-400" size={18} />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-8 py-6 text-left">Timeline</th>
                      <th className="px-8 py-6 text-left">Reference</th>
                      <th className="px-8 py-6 text-left">Amount</th>
                      <th className="px-8 py-6 text-left">Security</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">
                            {tx.date}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            14:20 PM
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {tx.desc}
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-1 text-[10px] uppercase font-black border-slate-200 text-slate-400"
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                          <div
                            className={`text-lg font-black ${tx.amount > 0 ? "text-emerald-500" : "text-slate-900"}`}
                          >
                            {tx.amount > 0
                              ? `+ ₵${tx.amount}`
                              : `- ₵${Math.abs(tx.amount)}`}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${tx.status === "completed" ? "bg-emerald-500" : "bg-amber-400"}`}
                            />
                            <span className="text-sm font-bold text-slate-600 capitalize">
                              {tx.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-slate-300 hover:text-slate-900"
                          >
                            <MoreHorizontal size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-6 outline-none">
          <div className="grid gap-6">
            {[
              {
                title: "Electrical Wiring",
                pro: "Samuel Electric",
                amount: "₵ 800",
                date: "Mar 25",
                status: "Awaiting Approval",
              },
              {
                title: "Furniture Assembly",
                pro: "Tatari Logistics",
                amount: "₵ 350",
                date: "Mar 28",
                status: "In Progress",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="p-8 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <Badge className="bg-indigo-50 text-indigo-700 border-none rounded-full text-[10px] uppercase font-black">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Provider:{" "}
                      <span className="text-slate-900 font-bold">
                        {item.pro}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 mt-6 text-sm font-bold text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock size={16} /> Due {item.date}
                      </div>
                      <div className="flex items-center gap-2 text-indigo-600">
                        <ShieldCheck size={16} /> Escrow Protected
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 md:w-80 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Payable Amount
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-6">
                      {item.amount}
                    </div>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl font-bold h-12">
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-8 outline-none">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Method Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="flex justify-between items-start mb-12">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Wallet className="text-white" size={28} />
                </div>
                <Badge className="bg-emerald-500 text-white border-none">
                  Active
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Telebirr Balance
                </p>
                <h3 className="text-4xl font-black tracking-tight">
                  ₵ 2,450.00
                </h3>
              </div>
              <div className="mt-12 flex justify-between items-end">
                <p className="font-mono text-slate-400">**** **** **** 1234</p>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white p-0"
                >
                  Manage <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Add New Method */}
            <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:border-indigo-100 hover:bg-slate-50/50 transition-all cursor-pointer group">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Add Payment Method
              </h3>
              <p className="text-slate-500 mt-2 text-sm max-w-[200px]">
                Link your Telebirr, CBE Birr or Credit Card
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-indigo-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 border border-indigo-100">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Lock className="text-indigo-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-indigo-900 font-bold text-lg">
                Bank-Grade Security
              </h4>
              <p className="text-indigo-700/70 text-sm">
                Your financial data is encrypted using 256-bit SSL. Tatari never
                stores your full card details, and all payments are protected by
                our secure escrow system.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-indigo-200 text-indigo-600 font-bold px-8"
            >
              Learn More
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
