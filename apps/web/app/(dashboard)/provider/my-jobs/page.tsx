"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  ClipboardCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  MessageSquare,
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
import Link from "next/link";

const myJobs = {
  active: [
    {
      id: "1",
      title: "Fix Kitchen Sink Leak",
      client: "John Doe",
      status: "in_progress",
      statusText: "In Progress",
      price: "₵ 500",
      location: "Bole, Addis",
      scheduled: "Today, 2:00 PM",
      timeline: "Urgent",
    },
    {
      id: "2",
      title: "Install New Shower",
      client: "Sarah Smith",
      status: "scheduled",
      statusText: "Scheduled",
      price: "₵ 1,200",
      location: "Kasanchis, Addis",
      scheduled: "Tomorrow, 10:00 AM",
      timeline: "Within Week",
    },
  ],
  pending: [
    {
      id: "3",
      title: "Paint Living Room Walls",
      client: "Mike Johnson",
      status: "quote_submitted",
      statusText: "Quote Submitted",
      price: "₵ 1,500",
      location: "Mexico, Addis",
      submitted: "2 days ago",
      timeline: "Flexible",
    },
  ],
  completed: [
    {
      id: "4",
      title: "AC Installation",
      client: "Emma Wilson",
      status: "completed",
      statusText: "Completed",
      price: "₵ 3,500",
      location: "Bole, Addis",
      completed: "1 week ago",
      rating: 5,
      review: "Excellent work! Very professional.",
    },
  ],
};

const statusColors: Record<string, string> = {
  quote_submitted: "bg-blue-100 text-blue-800",
  scheduled: "bg-purple-100 text-purple-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ProviderMyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your jobs in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/provider/jobs">Find New Jobs</Link>
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
              <SelectItem value="quote_submitted">Quote Submitted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">₵ 5,200</div>
              <div className="text-sm text-gray-600">Pending Payment</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Quotes Submitted</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">96%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active">
            Active ({myJobs.active.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({myJobs.pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({myJobs.completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Jobs Tab */}
        <TabsContent value="active" className="space-y-4">
          {myJobs.active.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        {/* Pending Jobs Tab */}
        <TabsContent value="pending" className="space-y-4">
          {myJobs.pending.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        {/* Completed Jobs Tab */}
        <TabsContent value="completed" className="space-y-4">
          {myJobs.completed.map((job) => (
            <div key={job.id} className="border rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge className={statusColors[job.status]}>
                          {job.statusText}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="font-medium">Client: {job.client}</div>
                        {job.rating && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            {"★".repeat(job.rating)}
                            {"☆".repeat(5 - job.rating)}
                            <span>({job.rating}/5)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{job.price}</div>
                      <div className="text-sm text-gray-500">
                        Completed {job.completed}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  {job.review && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-1">Client Review:</div>
                      <p className="text-gray-600">{job.review}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <Button variant="outline" asChild>
                    <Link href={`/provider/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    Request Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Job Card Component
function JobCard({ job }: { job: any }) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <Badge className={statusColors[job.status]}>
                  {job.statusText}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="font-medium">Client: {job.client}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{job.price}</div>
              {job.scheduled && (
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
                  <Clock size={14} />
                  {job.scheduled}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle size={16} />
              <span>{job.timeline}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:w-48">
          <Button variant="outline" asChild>
            <Link href={`/provider/jobs/${job.id}`}>View Details</Link>
          </Button>
          {job.status === "in_progress" && (
            <Button asChild>
              <Link href={`/provider/jobs/${job.id}/update`}>
                Update Progress
              </Link>
            </Button>
          )}
          {job.status === "scheduled" && (
            <Button>
              <CheckCircle className="h-4 w-4 mr-1" />
              Start Job
            </Button>
          )}
          {job.status === "quote_submitted" && (
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message Client
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
