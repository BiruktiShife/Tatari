"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  CreditCard,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";

const earningsData = [
  { month: "Jan", earnings: 4200, jobs: 8 },
  { month: "Feb", earnings: 5200, jobs: 10 },
  { month: "Mar", earnings: 6100, jobs: 12 },
  { month: "Apr", earnings: 5800, jobs: 11 },
  { month: "May", earnings: 7200, jobs: 14 },
  { month: "Jun", earnings: 6800, jobs: 13 },
];

const transactions = [
  {
    id: "TX-001",
    job: "AC Installation",
    client: "Emma Wilson",
    date: "Mar 15, 2024",
    amount: "₵ 3,500",
    status: "paid",
    type: "job",
  },
  {
    id: "TX-002",
    job: "Fix Bathroom Pipe",
    client: "John Doe",
    date: "Mar 14, 2024",
    amount: "₵ 800",
    status: "paid",
    type: "job",
  },
  {
    id: "TX-003",
    job: "Monthly Maintenance",
    client: "Mike Johnson",
    date: "Mar 10, 2024",
    amount: "₵ 1,500",
    status: "pending",
    type: "job",
  },
  {
    id: "TX-004",
    job: "Withdrawal",
    client: "-",
    date: "Mar 1, 2024",
    amount: "₵ 5,000",
    status: "completed",
    type: "withdrawal",
  },
];

const payoutMethods = [
  { id: "1", type: "Bank Transfer", last4: "1234", primary: true },
  { id: "2", type: "Mobile Money", last4: "5678", primary: false },
];

export default function ProviderEarningsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("1");

  const availableBalance = 5800;
  const pendingBalance = 1500;
  const totalEarnings = 24500;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Earnings</h1>
            <p className="text-slate-200 mt-2">
              Track your earnings and manage payouts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="text-slate-900">
              <Download className="h-4 w-4 mr-2" />
              Export Statement
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ₵ {availableBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available Balance</div>
                <div className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ready to withdraw
                </div>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ₵ {pendingBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Pending Clearance</div>
                <div className="text-xs text-yellow-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Clears in 2-3 days
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ₵ {totalEarnings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Earnings</div>
                <div className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  All time
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Card */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Amount Input */}
            <div>
              <div className="mb-2 font-medium">Amount to Withdraw</div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  ₵
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Available: ₵ {availableBalance.toLocaleString()}
              </div>
              <div className="flex gap-2 mt-3">
                {[1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount(amount.toString())}
                  >
                    ₵ {amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <div className="mb-2 font-medium">Payout Method</div>
              <div className="space-y-3">
                {payoutMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{method.type}</div>
                        <div className="text-sm text-gray-500">
                          **** {method.last4}
                        </div>
                      </div>
                    </div>
                    {method.primary && <Badge variant="outline">Primary</Badge>}
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add New Method
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Withdrawal Summary</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>₵ {withdrawAmount || "0"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Processing Fee (1%)</span>
                    <span>
                      ₵ {(parseFloat(withdrawAmount || "0") * 0.01).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>You Receive</span>
                    <span>
                      ₵ {(parseFloat(withdrawAmount || "0") * 0.99).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full" disabled={!withdrawAmount}>
                Withdraw Funds
              </Button>
              <div className="text-xs text-gray-500 text-center">
                Funds typically arrive in 1-2 business days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 grid grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <div className="p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="font-semibold">Recent Transactions</div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Job / Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{tx.job}</div>
                        <div className="text-sm text-gray-500">{tx.client}</div>
                      </TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="font-bold">{tx.amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            tx.status === "paid" || tx.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {tx.status === "paid" || tx.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
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
