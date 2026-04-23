"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  DollarSign,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Transaction = {
  id: string;
  amount: string;
  client: string;
  provider: string;
  job: string;
  date: string;
  status: "completed" | "pending" | "failed" | "refunded";
  type: "payment" | "fee";
  fee: string;
};

const mockTransactions: Record<string, Transaction[]> = {
  all: [
    {
      id: "TX-001",
      amount: "₵ 500",
      client: "John Doe",
      provider: "Samuel Plumbing",
      job: "Fix Kitchen Sink Leak",
      date: "Mar 15, 2024",
      status: "completed",
      type: "payment",
      fee: "₵ 25",
    },
    {
      id: "TX-002",
      amount: "₵ 1,200",
      client: "Sarah Smith",
      provider: "Dawit Painting",
      job: "Paint Living Room Walls",
      date: "Mar 14, 2024",
      status: "pending",
      type: "payment",
      fee: "₵ 60",
    },
    {
      id: "TX-003",
      amount: "₵ 3,500",
      client: "Emma Wilson",
      provider: "Mike AC Services",
      job: "AC Installation",
      date: "Mar 10, 2024",
      status: "completed",
      type: "payment",
      fee: "₵ 175",
    },
    {
      id: "TX-004",
      amount: "₵ 250",
      client: "Mike Johnson",
      provider: "System",
      job: "Membership Fee",
      date: "Mar 1, 2024",
      status: "completed",
      type: "fee",
      fee: "₵ 0",
    },
  ],
  pending: [
    {
      id: "TX-002",
      amount: "₵ 1,200",
      client: "Sarah Smith",
      provider: "Dawit Painting",
      job: "Paint Living Room Walls",
      date: "Mar 14, 2024",
      status: "pending",
      type: "payment",
      fee: "₵ 60",
    },
  ],
};

const statusColors: Record<Transaction["status"], string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  refunded: "border-sky-200 bg-sky-50 text-sky-700",
};

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");

  const allTransactions = mockTransactions.all;
  const pendingTransactions = mockTransactions.pending;

  const filteredAll = useMemo(() => {
    return allTransactions.filter((tx) => {
      const haystack = `${tx.id} ${tx.client} ${tx.provider} ${tx.job}`.toLowerCase();
      const matchesSearch = haystack.includes(searchQuery.toLowerCase().trim());
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allTransactions, searchQuery, statusFilter]);

  const metrics = useMemo(
    () => [
      {
        label: "Total Volume",
        value: "₵ 24,500",
        icon: DollarSign,
        tone: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "Platform Fees",
        value: "₵ 1,225",
        icon: TrendingUp,
        tone: "text-sky-600 bg-sky-50",
      },
      {
        label: "Transactions",
        value: "124",
        icon: CheckCircle,
        tone: "text-violet-600 bg-violet-50",
      },
      {
        label: "Pending",
        value: String(pendingTransactions.length),
        icon: Clock,
        tone: "text-amber-600 bg-amber-50",
      },
    ],
    [pendingTransactions.length],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Financial operations
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Transactions
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Monitor platform payments, fees, and pending releases in a cleaner view.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              <DollarSign className="mr-2 h-4 w-4" />
              Financial Report
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">{metric.value}</div>
                    <div className="text-sm text-slate-600">{metric.label}</div>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-900">Transaction filters</CardTitle>
          <CardDescription className="text-slate-600">
            Search the ledger and narrow by date range or status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search transactions by ID, client, or job..."
                className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 text-slate-600">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Job Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAll.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono font-medium text-slate-900">
                        {tx.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{tx.job}</div>
                          <div className="text-sm text-slate-500">
                            {tx.client} &rarr; {tx.provider}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{tx.amount}</TableCell>
                      <TableCell className="text-slate-600">{tx.date}</TableCell>
                      <TableCell>
                        <Badge className={`border ${statusColors[tx.status]}`}>
                          {tx.status === "completed" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : tx.status === "pending" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{tx.fee}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[820px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Job Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Days Pending</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono font-medium text-slate-900">{tx.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{tx.job}</div>
                        <div className="text-sm text-slate-500">
                          {tx.client} &rarr; {tx.provider}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">{tx.amount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>2 days</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm">Release Payment</Button>
                          <Button variant="outline" size="sm">
                            Hold
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
