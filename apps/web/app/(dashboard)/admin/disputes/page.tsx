"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
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

const mockDisputes = {
  open: [
    {
      id: "1",
      title: "Payment not released",
      client: "John Doe",
      provider: "Samuel Plumbing",
      job: "Fix Kitchen Sink Leak",
      opened: "2 hours ago",
      priority: "high",
      status: "investigating",
    },
    {
      id: "2",
      title: "Job quality issue",
      client: "Sarah Smith",
      provider: "Dawit Painting",
      job: "Paint Living Room Walls",
      opened: "1 day ago",
      priority: "medium",
      status: "awaiting_response",
    },
  ],
  resolved: [
    {
      id: "3",
      title: "Late completion",
      client: "Mike Johnson",
      provider: "Mike AC Services",
      job: "AC Installation",
      opened: "1 week ago",
      resolved: "2 days ago",
      resolution: "Partial refund issued",
    },
  ],
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

const statusColors: Record<string, string> = {
  investigating: "bg-purple-100 text-purple-800",
  awaiting_response: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
};

export default function AdminDisputesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Disputes Management</h1>
          <p className="text-gray-600 mt-2">
            Review and resolve platform disputes
          </p>
        </div>
        <Button variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Dispute Guidelines
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search disputes by title, client, or job..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
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
          <Select>
            <SelectTrigger className="w-[180px]">
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">3</div>
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
                <div className="text-2xl font-bold">12</div>
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
                <div className="text-2xl font-bold">2.4</div>
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
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disputes Tabs */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="open">
            Open Disputes ({mockDisputes.open.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({mockDisputes.resolved.length})
          </TabsTrigger>
        </TabsList>

        {/* Open Disputes Tab */}
        <TabsContent value="open">
          <Card>
            <Table>
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
                {mockDisputes.open.map((dispute) => (
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
                            Client: {dispute.client}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm">
                            Provider: {dispute.provider}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{dispute.job}</TableCell>
                    <TableCell>
                      <Badge className={priorityColors[dispute.priority]}>
                        {dispute.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[dispute.status]}>
                        {dispute.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} />
                        {dispute.opened}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Resolved Disputes Tab */}
        <TabsContent value="resolved">
          <Card>
            <Table>
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
                {mockDisputes.resolved.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell>
                      <div className="font-medium">{dispute.title}</div>
                      <div className="text-sm text-gray-500">
                        Case #{dispute.id}
                      </div>
                    </TableCell>
                    <TableCell>{dispute.resolution}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} />
                        Opened: {dispute.opened}
                      </div>
                      <div className="text-sm text-gray-500">
                        Resolved: {dispute.resolved}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
