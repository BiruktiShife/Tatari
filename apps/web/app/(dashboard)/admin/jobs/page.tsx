"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  User,
  AlertCircle,
  Eye,
  MoreVertical,
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

const mockJobs = [
  {
    id: "1",
    title: "Fix Kitchen Sink Leak",
    client: "John Doe",
    provider: "Samuel Plumbing",
    status: "in_progress",
    price: "₵ 500",
    location: "Bole, Addis",
    posted: "2 days ago",
    timeline: "Urgent",
    category: "Plumbing",
  },
  {
    id: "2",
    title: "Paint Living Room Walls",
    client: "Sarah Smith",
    provider: "Dawit Painting",
    status: "accepted",
    price: "₵ 1,200",
    location: "Kasanchis, Addis",
    posted: "3 days ago",
    timeline: "Within Week",
    category: "Painting",
  },
  {
    id: "3",
    title: "Electrical Wiring for Garage",
    client: "Mike Johnson",
    provider: null,
    status: "pending",
    price: "Budget: ₵ 800-1,200",
    location: "Mexico, Addis",
    posted: "1 hour ago",
    timeline: "Flexible",
    category: "Electrical",
  },
  {
    id: "4",
    title: "AC Installation",
    client: "Emma Wilson",
    provider: "Mike AC Services",
    status: "completed",
    price: "₵ 3,500",
    location: "Bole, Addis",
    posted: "1 week ago",
    timeline: "Urgent",
    category: "HVAC",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Jobs Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all platform jobs
          </p>
        </div>
        <Button variant="outline">
          <Briefcase className="h-4 w-4 mr-2" />
          Export Jobs
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, client, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₵ 24,500</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">42</div>
            <div className="text-sm text-gray-600">Pending Quotes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">96%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {job.posted}
                      </div>
                      <Badge variant="outline">{job.category}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <div className="font-medium">{job.client}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {job.provider ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <User size={14} className="text-green-600" />
                      </div>
                      <div className="font-medium">{job.provider}</div>
                    </div>
                  ) : (
                    <Badge variant="outline">Awaiting Provider</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[job.status]}>
                    {job.status === "in_progress"
                      ? "In Progress"
                      : job.status.charAt(0).toUpperCase() +
                        job.status.slice(1)}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {job.timeline}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{job.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
