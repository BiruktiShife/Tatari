"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUsers = {
  all: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+251 91 234 5678",
      type: "client",
      status: "active",
      joined: "Jan 15, 2024",
      jobs: 12,
      rating: "4.8",
      avatar: "JD",
    },
    {
      id: "2",
      name: "Samuel Plumbing",
      email: "samuel@example.com",
      phone: "+251 92 345 6789",
      type: "provider",
      status: "verified",
      joined: "Dec 20, 2023",
      jobs: 42,
      rating: "4.9",
      avatar: "SP",
    },
    {
      id: "3",
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+251 93 456 7890",
      type: "client",
      status: "active",
      joined: "Feb 5, 2024",
      jobs: 5,
      rating: "4.5",
      avatar: "SS",
    },
    {
      id: "4",
      name: "Dawit Painting",
      email: "dawit@example.com",
      phone: "+251 94 567 8901",
      type: "provider",
      status: "pending_verification",
      joined: "Mar 1, 2024",
      jobs: 0,
      rating: "-",
      avatar: "DP",
    },
  ],
  clients: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      type: "client",
      status: "active",
      jobs: 12,
    },
    {
      id: "3",
      name: "Sarah Smith",
      email: "sarah@example.com",
      type: "client",
      status: "active",
      jobs: 5,
    },
  ],
  providers: [
    {
      id: "2",
      name: "Samuel Plumbing",
      email: "samuel@example.com",
      type: "provider",
      status: "verified",
      jobs: 42,
    },
    {
      id: "4",
      name: "Dawit Painting",
      email: "dawit@example.com",
      type: "provider",
      status: "pending_verification",
      jobs: 0,
    },
  ],
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  verified: "bg-blue-100 text-blue-800",
  pending_verification: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all platform users and providers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="client">Clients Only</SelectItem>
              <SelectItem value="provider">Providers Only</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">845</div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">402</div>
                <div className="text-sm text-gray-600">Providers</div>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-gray-600">
                  Pending Verification
                </div>
              </div>
              <UserX className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">
            All Users ({mockUsers.all.length})
          </TabsTrigger>
          <TabsTrigger value="clients">
            Clients ({mockUsers.clients.length})
          </TabsTrigger>
          <TabsTrigger value="providers">
            Providers ({mockUsers.providers.length})
          </TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.all.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-medium text-blue-600">
                            {user.avatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.type === "provider" ? "default" : "outline"
                        }
                      >
                        {user.type === "provider" ? "Provider" : "Client"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status === "verified"
                          ? "Verified"
                          : user.status === "pending_verification"
                            ? "Pending Verification"
                            : user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} />
                        {user.joined}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.jobs}</div>
                      {user.rating && (
                        <div className="text-sm text-gray-500">
                          Rating: {user.rating}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          {user.status === "pending_verification" && (
                            <DropdownMenuItem className="text-green-600">
                              Verify Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jobs Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.clients.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.jobs}</TableCell>
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

        {/* Providers Tab */}
        <TabsContent value="providers">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jobs Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.providers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status === "verified"
                          ? "Verified"
                          : "Pending Verification"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.jobs}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        {user.status === "pending_verification"
                          ? "Review"
                          : "View"}
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
