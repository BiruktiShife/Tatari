"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

type NewUserForm = {
  type: "client" | "provider";
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  businessName: string;
  serviceCategory: string;
  experience: string;
  hourlyRate: string;
  serviceAreas: string;
  bio: string;
};

type UserJob = {
  id: string;
  title: string;
  status: string;
  category?: string | null;
  timeline?: string | null;
  location?: string | null;
  createdAt: string;
  budgetType?: string | null;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
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

function formatCsvValue(value: unknown) {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
  const [jobsUser, setJobsUser] = useState<AdminUser | null>(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [userJobs, setUserJobs] = useState<UserJob[]>([]);
  const [addingUser, setAddingUser] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    type: "client",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    businessName: "",
    serviceCategory: "",
    experience: "",
    hourlyRate: "",
    serviceAreas: "",
    bio: "",
  });
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

  const handleCreateSubaccount = async (user: AdminUser) => {
    const bankCode = window.prompt("Chapa bank code (number):");
    if (!bankCode) return;
    const accountNumber = window.prompt("Account number:");
    if (!accountNumber) return;
    const accountName = window.prompt("Account name:");
    if (!accountName) return;

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

      const res = await fetch(resolveApiUrl("/admin/chapa/subaccount"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerId: user.id,
          bank_code: bankCode,
          account_number: accountNumber,
          account_name: accountName,
          business_name: user.name,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.message || "Failed to create subaccount.";
        throw new Error(message);
      }

      toast({
        title:
          data?.status === "exists"
            ? "Subaccount already exists"
            : "Subaccount created",
        description: data?.subaccount_id
          ? `ID: ${data.subaccount_id}`
          : "Saved to provider profile.",
      });
    } catch (err) {
      toast({
        title: "Creation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatBudget = (job: UserJob) => {
    if (job.budgetType === "RANGE") {
      const min = job.budgetMin ?? 0;
      const max = job.budgetMax ?? 0;
      return `₵ ${min}-${max}`;
    }
    if (job.budgetAmount != null) {
      return job.budgetType === "HOURLY"
        ? `₵ ${job.budgetAmount}/hr`
        : `₵ ${job.budgetAmount}`;
    }
    return "Not set";
  };

  const handleViewJobs = async (user: AdminUser) => {
    setJobsUser(user);
    setJobsLoading(true);
    setUserJobs([]);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("Missing admin token. Please log in again.");

      const res = await fetch(resolveApiUrl(`/admin/users/${user.id}/jobs`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load user jobs.");
      }
      const data = await res.json();
      setUserJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      toast({
        title: "Failed to load jobs",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setJobsLoading(false);
    }
  };

  const handleExportUsers = () => {
    if (!users.length) {
      toast({
        title: "No users to export",
        description: "Try adjusting filters to include more users.",
      });
      return;
    }

    const headers = [
      "User ID",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Status",
      "Joined",
      "Jobs",
      "Rating",
    ];

    const rows = users.map((user) => [
      user.id,
      user.name,
      user.email,
      user.phone || "",
      user.type,
      user.status,
      user.joined,
      user.jobs,
      user.rating ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(formatCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `users-export-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetNewUser = () => {
    setNewUser({
      type: "client",
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      businessName: "",
      serviceCategory: "",
      experience: "",
      hourlyRate: "",
      serviceAreas: "",
      bio: "",
    });
  };

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim()) {
      toast({
        title: "Missing fields",
        description: "Name, email, and phone are required.",
        variant: "destructive",
      });
      return;
    }
    if (!newUser.password || newUser.password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.type === "client" && !newUser.address.trim()) {
      toast({
        title: "Address required",
        description: "Client address is required.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.type === "provider") {
      if (
        !newUser.businessName.trim() ||
        !newUser.serviceCategory.trim() ||
        !newUser.experience.trim()
      ) {
        toast({
          title: "Missing provider fields",
          description: "Business name, category, and experience are required.",
          variant: "destructive",
        });
        return;
      }
      const rate = Number(newUser.hourlyRate);
      if (!Number.isFinite(rate) || rate <= 0) {
        toast({
          title: "Invalid hourly rate",
          description: "Hourly rate must be greater than 0.",
          variant: "destructive",
        });
        return;
      }
      const areas = newUser.serviceAreas
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      if (!areas.length) {
        toast({
          title: "Service areas required",
          description: "Provide at least one service area.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setAddUserLoading(true);
      const payload =
        newUser.type === "client"
          ? {
              name: newUser.name.trim(),
              email: newUser.email.trim(),
              phone: newUser.phone.trim(),
              password: newUser.password,
              address: newUser.address.trim(),
            }
          : {
              name: newUser.name.trim(),
              email: newUser.email.trim(),
              phone: newUser.phone.trim(),
              password: newUser.password,
              businessName: newUser.businessName.trim(),
              serviceCategory: newUser.serviceCategory.trim(),
              experience: newUser.experience.trim(),
              hourlyRate: Number(newUser.hourlyRate),
              serviceAreas: newUser.serviceAreas
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
              bio: newUser.bio.trim() || undefined,
            };

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        throw new Error("Missing admin token. Please log in again.");
      }
      const res = await fetch(resolveApiUrl("/admin/users"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newUser.type === "client" ? "CLIENT" : "PROVIDER",
          ...payload,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create user.");
      }

      toast({ title: "User created" });
      setAddingUser(false);
      resetNewUser();
      await fetchUsers();
    } catch (err) {
      toast({
        title: "Create failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddUserLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Users and providers
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Users Management
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage all platform users and providers from one clear, readable dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              onClick={handleExportUsers}
            >
              <Users className="mr-2 h-4 w-4" />
              Export Users
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setAddingUser(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users by name, email, or phone..."
            className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="User Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="client">Clients Only</SelectItem>
              <SelectItem value="provider">Providers Only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-600">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-sky-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.clients}</div>
                <div className="text-sm text-slate-600">Clients</div>
              </div>
              <Users className="h-8 w-8 text-slate-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.providers}</div>
                <div className="text-sm text-slate-600">Providers</div>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.pendingVerification}</div>
                <div className="text-sm text-slate-600">Pending Verification</div>
              </div>
              <UserX className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full space-y-4">
        <TabsList className="grid grid-cols-1 gap-2 bg-slate-100 p-1 sm:grid-cols-3">
          <TabsTrigger value="all">All Users ({filtered.length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="providers">Providers ({providers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
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
                            <DropdownMenuItem onClick={() => setDetailUser(user)}>
                              View User Details
                            </DropdownMenuItem>
                            {user.type === "client" && (
                              <DropdownMenuItem onClick={() => handleViewJobs(user)}>
                                View Jobs
                              </DropdownMenuItem>
                            )}
                            {user.status === "pending_verification" || user.status === "pending" ? (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleApprove(user.id)}
                              >
                                Approve Account
                              </DropdownMenuItem>
                            ) : null}
                            {user.type === "provider" && (
                              <DropdownMenuItem
                                onClick={() => handleCreateSubaccount(user)}
                              >
                                Create Chapa Subaccount
                              </DropdownMenuItem>
                            )}
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
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
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(detailUser)}
        onOpenChange={(open) => !open && setDetailUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Account information and activity summary.
            </DialogDescription>
          </DialogHeader>
          {detailUser && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> {detailUser.name}
              </div>
              <div>
                <span className="text-gray-500">Email:</span> {detailUser.email}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>{" "}
                {detailUser.phone || "—"}
              </div>
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {detailUser.type === "provider"
                  ? "Provider"
                  : detailUser.type === "admin"
                    ? "Admin"
                    : "Client"}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{" "}
                {detailUser.status === "pending_verification"
                  ? "Pending Verification"
                  : detailUser.status.charAt(0).toUpperCase() +
                    detailUser.status.slice(1)}
              </div>
              <div>
                <span className="text-gray-500">Joined:</span>{" "}
                {formatDate(detailUser.joined)}
              </div>
              <div>
                <span className="text-gray-500">Jobs:</span>{" "}
                {detailUser.jobs}
              </div>
              <div>
                <span className="text-gray-500">Rating:</span>{" "}
                {detailUser.rating != null ? detailUser.rating : "—"}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(jobsUser)}
        onOpenChange={(open) => !open && setJobsUser(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Jobs Posted</DialogTitle>
            <DialogDescription>
              {jobsUser?.name ? `Jobs created by ${jobsUser.name}.` : ""}
            </DialogDescription>
          </DialogHeader>
          {jobsLoading ? (
            <div className="text-sm text-gray-500">Loading jobs...</div>
          ) : userJobs.length ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>{job.status}</TableCell>
                      <TableCell>{job.category || "—"}</TableCell>
                      <TableCell>{formatBudget(job)}</TableCell>
                      <TableCell>{job.location || "—"}</TableCell>
                      <TableCell>{formatDate(job.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No jobs posted by this user.
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setJobsUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addingUser}
        onOpenChange={(open) => !open && setAddingUser(false)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              Create a client or provider account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="md:col-span-2">
              <Label className="mb-2 block">User Type</Label>
              <Select
                value={newUser.type}
                onValueChange={(value) =>
                  setNewUser((prev) => ({
                    ...prev,
                    type: value as NewUserForm["type"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Email</Label>
              <Input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Phone</Label>
              <Input
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="mb-2 block">Password</Label>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            {newUser.type === "client" ? (
              <div className="md:col-span-2">
                <Label className="mb-2 block">Address</Label>
                <Input
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>
            ) : (
              <>
                <div>
                  <Label className="mb-2 block">Business Name</Label>
                  <Input
                    value={newUser.businessName}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Service Category</Label>
                  <Input
                    value={newUser.serviceCategory}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        serviceCategory: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Experience</Label>
                  <Input
                    value={newUser.experience}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Hourly Rate (ETB)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newUser.hourlyRate}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        hourlyRate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2 block">
                    Service Areas (comma-separated)
                  </Label>
                  <Input
                    value={newUser.serviceAreas}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        serviceAreas: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2 block">Bio (optional)</Label>
                  <Textarea
                    value={newUser.bio}
                    onChange={(e) =>
                      setNewUser((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={addUserLoading}>
              {addUserLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

