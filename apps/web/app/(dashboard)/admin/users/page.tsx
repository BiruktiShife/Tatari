"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  type: "client" | "provider" | "admin" | string;
  status:
    | "active"
    | "pending"
    | "verified"
    | "pending_verification"
    | "suspended"
    | "rejected"
    | string;
  joined: string;
  jobs: number;
  rating: number | null;
};

type UsersResponse = {
  users: AdminUser[];
  stats: {
    total: number;
    clients: number;
    providers: number;
    pendingVerification: number;
  };
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  verified: "bg-blue-100 text-blue-800",
  pending_verification: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-gray-100 text-gray-800",
  inactive: "bg-gray-100 text-gray-800",
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
      throw err;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    return origin.includes("localhost")
      ? `http://localhost:3003${path}`
      : `${origin}${path}`;
  }

  return path;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UsersResponse["stats"]>({
    total: 0,
    clients: 0,
    providers: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUsers([]);
        setError("Missing admin token. Please log in again.");
        return;
      }

      const query = new URLSearchParams();
      if (searchQuery.trim()) query.set("search", searchQuery.trim());
      if (userTypeFilter !== "all") query.set("type", userTypeFilter);
      if (statusFilter !== "all") query.set("status", statusFilter);

      const res = await fetch(
        resolveApiUrl(`/admin/users?${query.toString()}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load users.");
      }

      const data: UsersResponse = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
      setStats(
        data.stats || {
          total: 0,
          clients: 0,
          providers: 0,
          pendingVerification: 0,
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
      setUsers([]);
      setStats({ total: 0, clients: 0, providers: 0, pendingVerification: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userTypeFilter, statusFilter]);

  const filtered = useMemo(() => users, [users]);
  const clients = useMemo(
    () => filtered.filter((u) => u.type === "client"),
    [filtered],
  );
  const providers = useMemo(
    () => filtered.filter((u) => u.type === "provider"),
    [filtered],
  );

  const handleApprove = async (userId: string) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Not authenticated",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      const res = await fetch(resolveApiUrl(`/admin/users/${userId}/approve`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to approve user.");
      }
      toast({ title: "User approved" });
      await fetchUsers();
    } catch (err) {
      toast({
        title: "Approval failed",
        description: err instanceof Error ? err.message : "Unable to approve user.",
        variant: "destructive",
      });
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Not authenticated",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
      const res = await fetch(resolveApiUrl(`/admin/users/${userId}/suspend`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to suspend user.");
      }
      toast({ title: "User suspended" });
      await fetchUsers();
    } catch (err) {
      toast({
        title: "Suspend failed",
        description: err instanceof Error ? err.message : "Unable to suspend user.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="pending_verification">Pending Verification</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
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
                <div className="text-2xl font-bold">{stats.clients}</div>
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
                <div className="text-2xl font-bold">{stats.providers}</div>
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
                <div className="text-2xl font-bold">{stats.pendingVerification}</div>
                <div className="text-sm text-gray-600">Pending Verification</div>
              </div>
              <UserX className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Users ({filtered.length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="providers">Providers ({providers.length})</TabsTrigger>
        </TabsList>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filtered.length ? (
                  filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="font-medium text-blue-600">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
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
                            {user.phone || "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.type === "provider" ? "default" : "outline"}>
                          {user.type === "provider"
                            ? "Provider"
                            : user.type === "admin"
                              ? "Admin"
                              : "Client"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status] || "bg-gray-100 text-gray-700"}>
                          {user.status === "verified"
                            ? "Verified"
                            : user.status === "pending_verification"
                              ? "Pending Verification"
                              : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} />
                          {formatDate(user.joined)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.jobs}</div>
                        {user.rating != null && (
                          <div className="text-sm text-gray-500">Rating: {user.rating}</div>
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
                            {user.status === "pending_verification" || user.status === "pending" ? (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleApprove(user.id)}
                              >
                                Approve Account
                              </DropdownMenuItem>
                            ) : null}
                            {user.type !== "admin" && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleSuspend(user.id)}
                              >
                                Suspend User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : clients.length ? (
                  clients.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status] || "bg-gray-100 text-gray-700"}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.jobs}</TableCell>
                      <TableCell className="text-right">
                        {user.status === "pending" ? (
                          <Button size="sm" onClick={() => handleApprove(user.id)}>
                            Approve
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleSuspend(user.id)}>
                            Suspend
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                      No clients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                      Loading providers...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : providers.length ? (
                  providers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status] || "bg-gray-100 text-gray-700"}>
                          {user.status === "verified"
                            ? "Verified"
                            : user.status === "pending_verification"
                              ? "Pending Verification"
                              : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.jobs}</TableCell>
                      <TableCell className="text-right">
                        {user.status === "pending_verification" ? (
                          <Button size="sm" onClick={() => handleApprove(user.id)}>
                            Approve
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleSuspend(user.id)}>
                            Suspend
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                      No providers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
