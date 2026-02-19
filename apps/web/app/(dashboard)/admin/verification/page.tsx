"use client";

import React, { useState } from "react";
import {
  UserCheck,
  UserX,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Search,
  Filter,
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

const verificationRequests = [
  {
    id: "VR-001",
    name: "Dawit Painting",
    email: "dawit@example.com",
    service: "Painting & Decorating",
    submitted: "2 days ago",
    status: "pending",
    documents: 3,
    priority: "normal",
  },
  {
    id: "VR-002",
    name: "Samuel Electric",
    email: "samuel@example.com",
    service: "Electrical Services",
    submitted: "1 day ago",
    status: "pending",
    documents: 4,
    priority: "high",
  },
  {
    id: "VR-003",
    name: "Mikael Plumbing",
    email: "mikael@example.com",
    service: "Plumbing Services",
    submitted: "3 hours ago",
    status: "under_review",
    documents: 3,
    priority: "normal",
  },
];

const verifiedProviders = [
  {
    id: "VP-001",
    name: "Samuel Plumbing",
    email: "samuel.plumbing@example.com",
    service: "Plumbing",
    verified: "Jan 15, 2024",
    rating: 4.9,
    jobs: 42,
  },
  {
    id: "VP-002",
    name: "Mike AC Services",
    email: "mike.ac@example.com",
    service: "HVAC",
    verified: "Feb 1, 2024",
    rating: 4.7,
    jobs: 35,
  },
];

export default function AdminVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Provider Verification</h1>
          <p className="text-gray-600 mt-2">
            Review and verify service provider applications
          </p>
        </div>
        <Button variant="outline">
          <UserCheck className="h-4 w-4 mr-2" />
          Verification Guide
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search providers by name or service..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
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
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">402</div>
                <div className="text-sm text-gray-600">Verified Providers</div>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">1.2</div>
                <div className="text-sm text-gray-600">Avg. Days to Verify</div>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-600">Rejected This Month</div>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="pending">
            Pending Review ({verificationRequests.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified Providers ({verifiedProviders.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">Rejected Applications</TabsTrigger>
        </TabsList>

        {/* Pending Review Tab */}
        <TabsContent value="pending">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider Details</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-gray-500">
                          {request.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {request.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.service}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} />
                        {request.submitted}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400" />
                        <span>{request.documents} files</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          request.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {request.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }
                      >
                        {request.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Verified Providers Tab */}
        <TabsContent value="verified">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Verified Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Jobs Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifiedProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-500">
                          {provider.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{provider.service}</TableCell>
                    <TableCell>{provider.verified}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="text-yellow-500">
                          {"★".repeat(Math.floor(provider.rating))}
                        </div>
                        <span className="font-medium">{provider.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>{provider.jobs}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
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
