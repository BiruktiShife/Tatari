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

  const totalSpent = 5200;
  const pendingPayments = 1150;
  const escrowBalance = 500;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "failed":
        return "border-rose-200 bg-rose-50 text-rose-700";
      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Billing center
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Payments
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage your payments, deposits, and transaction history.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            <Button
              variant="outline"
              className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
              <Wallet className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">₵ {totalSpent}</div>
                <div className="text-sm text-slate-600">Total Spent</div>
              </div>
              <div className="rounded-lg bg-sky-50 p-2">
                <TrendingUp className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">₵ {pendingPayments}</div>
                <div className="text-sm text-slate-600">Pending Payments</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-2">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">₵ {escrowBalance}</div>
                <div className="text-sm text-slate-600">Escrow Balance</div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="grid grid-cols-1 gap-2 bg-slate-100 p-1 sm:grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
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
                    <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
                      <SelectValue placeholder="Sort by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                      <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
                >
                  View All Statements
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Description</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Amount</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Method</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-200 hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          <div className="text-slate-900">{tx.date}</div>
                          <div className="text-sm text-slate-500">{tx.jobId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{tx.description}</div>
                          <div className="text-sm capitalize text-slate-500">{tx.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`font-semibold ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
                            {tx.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`border ${getStatusColor(tx.status)}`}>{tx.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            {tx.method === "Escrow" && (
                              <Shield size={14} className="text-sky-500" />
                            )}
                            {tx.method}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100 hover:text-slate-900">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-slate-900">₵ 5,200</div>
                <div className="text-sm text-slate-600">Total Payments</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-slate-900">₵ 250</div>
                <div className="text-sm text-slate-600">Total Refunds</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-2xl font-semibold text-slate-900">7</div>
                <div className="text-sm text-slate-600">Total Transactions</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="space-y-4">
            {upcomingPayments.map((payment) => (
              <Card key={payment.id} className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {payment.description}
                      </div>
                      <div className="mt-1 text-slate-600">
                        Due Date: {payment.dueDate}
                      </div>
                      <Badge variant="outline" className="mt-2 border-slate-200 bg-slate-50 text-slate-700">
                        {payment.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="text-left sm:text-right">
                        <div className="text-2xl font-semibold text-slate-900">
                          {payment.amount}
                        </div>
                        <div className="text-sm text-slate-500">Amount due</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                          View Details
                        </Button>
                        {payment.status === "pending_approval" && (
                          <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-sky-200 bg-sky-50/70 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-sky-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-sky-800">
                    100% Payment Protection
                  </h3>
                  <ul className="space-y-1 text-sm text-sky-700">
                    <li>• Funds held securely in escrow until you approve work</li>
                    <li>• Full refund if job is not completed satisfactorily</li>
                    <li>• Dispute resolution support available 24/7</li>
                    <li>• No hidden fees or charges</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                      <Shield className="h-6 w-6 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Platform Escrow</div>
                      <Badge className="border border-sky-200 bg-sky-50 text-sky-700">
                        Primary
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Balance:</span>
                    <span className="font-semibold text-slate-900">₵ {escrowBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Security:</span>
                    <span className="font-semibold text-emerald-600">100% Protected</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                    Add Funds
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <CreditCard className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Telebirr</div>
                      <div className="text-sm text-slate-500">•••• 1234</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700">
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                    Edit
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-300 text-red-600 hover:bg-slate-50">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold text-slate-900">Add Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Button variant="outline" className="h-24 flex-col border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <CreditCard className="mb-2 h-8 w-8" />
                  <span>Credit Card</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <span className="font-bold text-emerald-600">T</span>
                  </div>
                  <span>Telebirr</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                    <span className="font-bold text-sky-600">C</span>
                  </div>
                  <span>CBE Birr</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  <Wallet className="mb-2 h-8 w-8" />
                  <span>Bank Transfer</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50/70 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold text-slate-900">Payment Security</h3>
              <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
                <div className="space-y-2">
                  <div className="font-medium text-slate-900">PCI DSS Compliant</div>
                  <p className="text-slate-600">
                    We follow strict security standards for payment processing.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-900">Encryption</div>
                  <p className="text-slate-600">
                    All payment data is encrypted using 256-bit SSL encryption.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-slate-900">No Storage</div>
                  <p className="text-slate-600">
                    We don&apos;t store your card details on our servers.
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
