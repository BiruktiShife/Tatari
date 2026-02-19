"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  User,
  AlertCircle,
  Star,
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

const availableJobs = [
  {
    id: "1",
    title: "Electrical Wiring for Garage",
    client: "Mike Johnson",
    budget: "₵ 800-1,200",
    location: "Mexico, Addis",
    posted: "1 hour ago",
    timeline: "Within Week",
    category: "Electrical",
    quotes: 2,
    urgent: true,
    distance: "2.5 km",
  },
  {
    id: "2",
    title: "Paint Living Room Walls",
    client: "Sarah Smith",
    budget: "₵ 1,000-1,500",
    location: "Kasanchis, Addis",
    posted: "3 hours ago",
    timeline: "Flexible",
    category: "Painting",
    quotes: 5,
    urgent: false,
    distance: "3.2 km",
  },
  {
    id: "3",
    title: "Fix Leaking Toilet",
    client: "Emma Wilson",
    budget: "₵ 300-500",
    location: "Bole, Addis",
    posted: "5 hours ago",
    timeline: "Urgent",
    category: "Plumbing",
    quotes: 3,
    urgent: true,
    distance: "1.8 km",
  },
];

const categories = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Painting",
  "Cleaning",
  "HVAC",
  "Carpentry",
  "Masonry",
];

export default function ProviderJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <p className="text-gray-600 mt-2">
            Find new opportunities that match your skills
          </p>
        </div>
        <Button asChild>
          <Link href="/provider/my-jobs">View My Jobs</Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, location, or category..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget">Highest Budget</SelectItem>
              <SelectItem value="distance">Nearest First</SelectItem>
              <SelectItem value="urgent">Urgent Jobs</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Briefcase className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-gray-600">Jobs Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">Urgent Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">₵ 45,200</div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    {job.urgent && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Client: {job.client}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {job.budget}
                  </div>
                  <Badge variant="outline">{job.category}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <div>
                    <div>{job.location}</div>
                    <div className="text-sm text-blue-600">
                      {job.distance} away
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <div>
                    <div>Posted {job.posted}</div>
                    <div className="text-sm">{job.timeline}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    {job.quotes} quotes submitted
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/provider/jobs/${job.id}`}>Submit Quote</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Jobs</Button>
      </div>
    </div>
  );
}
