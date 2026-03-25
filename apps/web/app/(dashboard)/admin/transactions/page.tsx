"use client";

import React, { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockTransactions = {
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
    },
  ],
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
};

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-slate-200 mt-2">
              Monitor all platform transactions and fees.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="text-slate-900">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Report
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search transactions by ID, client, or job..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ 24,500</div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ 1,225</div>
                <div className="text-sm text-gray-600">Platform Fees</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">124</div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ 1,200</div>
                <div className="text-sm text-gray-600">Pending Release</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 grid grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="all">
            All Transactions ({mockTransactions.all.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({mockTransactions.pending.length})
          </TabsTrigger>
          <TabsTrigger value="fees">Platform Fees</TabsTrigger>
        </TabsList>

        {/* All Transactions Tab */}
        <TabsContent value="all">
          <Card>
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.all.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono font-medium">
                      {tx.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tx.job}</div>
                        <div className="text-sm text-gray-500">
                          {tx.client} → {tx.provider}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {tx.type === "fee" ? "Membership" : "Job Payment"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg">
                      {tx.amount}
                    </TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[tx.status]}>
                        {tx.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : tx.status === "pending" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{tx.fee}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
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

        {/* Pending Transactions Tab */}
        <TabsContent value="pending">
          <Card>
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
                {mockTransactions.pending.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono font-medium">
                      {tx.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{tx.job}</div>
                      <div className="text-sm text-gray-500">
                        {tx.client} → {tx.provider}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-lg">
                      {tx.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
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
