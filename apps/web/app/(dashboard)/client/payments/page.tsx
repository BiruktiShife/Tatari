"use client";

import React, { useState } from "react";
import {
  Filter,
  Download,
  CreditCard,
  Wallet,
  TrendingUp,
  Shield,
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

const transactions = [
  {
    id: "1",
    date: "2024-03-15",
    description: "Fix Kitchen Sink - Samuel Plumbing",
    amount: "-₵ 500",
    status: "completed",
    type: "payment",
    method: "Escrow",
    jobId: "JOB-001",
  },
  {
    id: "2",
    date: "2024-03-10",
    description: "Paint Living Room - Dawit Painting",
    amount: "-₵ 1,200",
    status: "completed",
    type: "payment",
    method: "Escrow",
    jobId: "JOB-002",
  },
  {
    id: "3",
    date: "2024-03-05",
    description: "AC Installation - Mike AC Repair",
    amount: "-₵ 3,500",
    status: "completed",
    type: "payment",
    method: "Escrow",
    jobId: "JOB-003",
  },
  {
    id: "4",
    date: "2024-03-20",
    description: "Plumbing Deposit",
    amount: "-₵ 500",
    status: "pending",
    type: "deposit",
    method: "Telebirr",
    jobId: "JOB-004",
  },
  {
    id: "5",
    date: "2024-03-01",
    description: "Refund - Cancelled Job",
    amount: "+₵ 250",
    status: "completed",
    type: "refund",
    method: "Escrow",
    jobId: "JOB-005",
  },
];

const upcomingPayments = [
  {
    id: "6",
    description: "Electrical Wiring - Samuel Electric",
    amount: "₵ 800",
    dueDate: "2024-03-25",
    status: "pending_approval",
  },
  {
    id: "7",
    description: "Furniture Assembly",
    amount: "₵ 350",
    dueDate: "2024-03-28",
    status: "awaiting_completion",
  },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("transactions");

  const totalSpent = 5200; // Sum of completed payments
  const pendingPayments = 1150; // Sum of upcoming payments
  const escrowBalance = 500; // Current escrow balance

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600 mt-2">
            Manage your payments, deposits, and transaction history
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Wallet className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ {totalSpent}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ {pendingPayments}</div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₵ {escrowBalance}</div>
                <div className="text-sm text-gray-600">Escrow Balance</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="payments">Payments Only</SelectItem>
                  <SelectItem value="deposits">Deposits Only</SelectItem>
                  <SelectItem value="refunds">Refunds Only</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">
                    Amount: High to Low
                  </SelectItem>
                  <SelectItem value="amount-low">
                    Amount: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              View All Statements
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-6 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-6 font-semibold">
                        Description
                      </th>
                      <th className="text-left py-3 px-6 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-6 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 font-semibold">
                        Method
                      </th>
                      <th className="text-left py-3 px-6 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>{tx.date}</div>
                          <div className="text-sm text-gray-500">
                            {tx.jobId}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium">{tx.description}</div>
                          <div className="text-sm text-gray-500 capitalize">
                            {tx.type}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`font-semibold ${
                              tx.amount.startsWith("+")
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {tx.amount}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {tx.method === "Escrow" && (
                              <Shield size={14} className="text-blue-500" />
                            )}
                            {tx.method}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Receipt
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">₵ 5,200</div>
                <div className="text-sm text-gray-600">Total Payments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">₵ 250</div>
                <div className="text-sm text-gray-600">Total Refunds</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upcoming Payments Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-lg">
                        {payment.description}
                      </div>
                      <div className="text-gray-600 mt-1">
                        Due Date: {payment.dueDate}
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {payment.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {payment.amount}
                        </div>
                        <div className="text-sm text-gray-500">Amount due</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">View Details</Button>
                        {payment.status === "pending_approval" && (
                          <Button>Pay Now</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Protection Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    100% Payment Protection
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>
                      • Funds held securely in escrow until you approve work
                    </li>
                    <li>
                      • Full refund if job is not completed satisfactorily
                    </li>
                    <li>• Dispute resolution support available 24/7</li>
                    <li>• No hidden fees or charges</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Method */}
            <Card className="border-2 border-blue-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Platform Escrow</div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Primary
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
                    <span className="font-semibold">₵ {escrowBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security:</span>
                    <span className="font-semibold text-green-600">
                      100% Protected
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Add Funds
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Telebirr Method */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Telebirr</div>
                      <div className="text-sm text-gray-500">•••• 1234</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Method */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Add Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <CreditCard className="h-8 w-8 mb-2" />
                  <span>Credit Card</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <div className="w-8 h-8 mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-green-600">T</span>
                  </div>
                  <span>Telebirr</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <div className="w-8 h-8 mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-blue-600">C</span>
                  </div>
                  <span>CBE Birr</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Wallet className="h-8 w-8 mb-2" />
                  <span>Bank Transfer</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Payment Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">PCI DSS Compliant</div>
                  <p className="text-gray-600">
                    We follow strict security standards for payment processing.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Encryption</div>
                  <p className="text-gray-600">
                    All payment data is encrypted using 256-bit SSL encryption.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">No Storage</div>
                  <p className="text-gray-600">
                    We don't store your card details on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
