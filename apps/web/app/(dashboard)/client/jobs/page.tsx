"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
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

const mockJobs = {
  active: [
    {
      id: "1",
      title: "Fix Kitchen Sink Leak",
      provider: "Samuel Plumbing",
      status: "in_progress",
      statusText: "In Progress",
      price: "₵ 500",
      location: "Bole, Addis",
      posted: "2 days ago",
      timeline: "Urgent",
      quotes: 3,
      providerAvatar: "SP",
    },
    {
      id: "2",
      title: "Paint Living Room Walls",
      provider: "Dawit Painting",
      status: "accepted",
      statusText: "Accepted",
      price: "₵ 1,200",
      location: "Kasanchis, Addis",
      posted: "3 days ago",
      timeline: "Within Week",
      quotes: 5,
      providerAvatar: "DP",
    },
  ],
  pending: [
    {
      id: "3",
      title: "Electrical Wiring for Garage",
      provider: null,
      status: "pending",
      statusText: "Awaiting Quotes",
      price: "Budget: ₵ 800-1,200",
      location: "Mexico, Addis",
      posted: "1 hour ago",
      timeline: "Flexible",
      quotes: 2,
      providerAvatar: null,
    },
  ],
  completed: [
    {
      id: "4",
      title: "AC Installation",
      provider: "Mike AC Services",
      status: "completed",
      statusText: "Completed",
      price: "₵ 3,500",
      location: "Bole, Addis",
      posted: "1 week ago",
      timeline: "Urgent",
      quotes: 4,
      providerAvatar: "MA",
      rating: 5,
      review: "Excellent work! Very professional.",
    },
    {
      id: "5",
      title: "Furniture Assembly",
      provider: "Home Setup Pros",
      status: "completed",
      statusText: "Completed",
      price: "₵ 750",
      location: "Piassa, Addis",
      posted: "2 weeks ago",
      timeline: "Within Week",
      quotes: 3,
      providerAvatar: "HS",
      rating: 4,
      review: "Good job, slightly delayed but good quality.",
    },
  ],
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <p className="text-gray-600 mt-2">
            Track all your posted jobs and quotes
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/client/post-job">Post New Job</Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, provider, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Awaiting Quotes</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₵ 1,700</div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-gray-600">Total Quotes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-gray-600">Avg. Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active">
            Active Jobs ({mockJobs.active.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Quotes ({mockJobs.pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({mockJobs.completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Jobs Tab */}
        <TabsContent value="active" className="space-y-4">
          {mockJobs.active.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        {/* Pending Quotes Tab */}
        <TabsContent value="pending" className="space-y-4">
          {mockJobs.pending.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        {/* Completed Jobs Tab */}
        <TabsContent value="completed" className="space-y-4">
          {mockJobs.completed.map((job) => (
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
                      {job.provider && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {job.providerAvatar}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{job.provider}</div>
                            {job.rating && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                {"★".repeat(job.rating)}
                                {"☆".repeat(5 - job.rating)}
                                <span>({job.rating}/5)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{job.price}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>Posted {job.posted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle size={16} />
                      <span>{job.timeline}</span>
                    </div>
                  </div>

                  {job.review && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-1">Your Review:</div>
                      <p className="text-gray-600">{job.review}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/client/jobs/${job.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {job.status === "completed" && (
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      Download Invoice
                    </Button>
                  )}
                  {job.status === "in_progress" && (
                    <Button asChild>
                      <Link href={`/dashboard/client/messages?job=${job.id}`}>
                        Message Provider
                      </Link>
                    </Button>
                  )}
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
              {job.provider && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {job.providerAvatar}
                    </span>
                  </div>
                  <div className="font-medium">{job.provider}</div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{job.price}</div>
              <div className="text-sm text-gray-500">{job.quotes} quotes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span>Posted {job.posted}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle size={16} />
              <span>{job.timeline}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:w-48">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/client/jobs/${job.id}`}>View Details</Link>
          </Button>
          {job.status === "pending" && (
            <Button asChild>
              <Link href={`/dashboard/client/jobs/${job.id}/quotes`}>
                View Quotes ({job.quotes})
              </Link>
            </Button>
          )}
          {job.status === "in_progress" && (
            <Button asChild>
              <Link href={`/dashboard/client/messages?job=${job.id}`}>
                Message Provider
              </Link>
            </Button>
          )}
          {job.status === "accepted" && (
            <Button
              variant="outline"
              className="border-green-200 text-green-700"
            >
              Make Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
