"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Briefcase,
  DollarSign,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type RevenuePoint = {
  label: string;
  revenue: number;
  jobs: number;
};

type CategoryPoint = {
  name: string;
  value: number;
  color: string;
};

type UserGrowthPoint = {
  label: string;
  users: number;
  providers: number;
};

type AnalyticsResponse = {
  stats: {
    totalUsers: number;
    activeJobs: number;
    platformRevenue: number;
    completionRate: number;
    avgRating: number;
    reviewCount: number;
    retentionRate: number;
  };
  revenueData: RevenuePoint[];
  categoryData: CategoryPoint[];
  userGrowthData: UserGrowthPoint[];
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

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AnalyticsResponse["stats"]>({
    totalUsers: 0,
    activeJobs: 0,
    platformRevenue: 0,
    completionRate: 0,
    avgRating: 0,
    reviewCount: 0,
    retentionRate: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setError("Missing admin token. Please log in again.");
          return;
        }

        const res = await fetch(
          resolveApiUrl(`/admin/users/analytics?range=${timeRange}`),
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load analytics.");
        }

        const data: AnalyticsResponse = await res.json();
        setStats(data.stats);
        setRevenueData(Array.isArray(data.revenueData) ? data.revenueData : []);
        setCategoryData(Array.isArray(data.categoryData) ? data.categoryData : []);
        setUserGrowthData(Array.isArray(data.userGrowthData) ? data.userGrowthData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Performance insights
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Analytics Dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Platform performance insights and metrics in a cleaner, higher-contrast layout.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => {
                const rows = [
                  ["Metric", "Value"],
                  ["Total Users", stats.totalUsers],
                  ["Active Jobs", stats.activeJobs],
                  ["Platform Revenue", stats.platformRevenue],
                  ["Completion Rate (%)", stats.completionRate],
                  ["Average Rating", stats.avgRating],
                  ["Total Reviews", stats.reviewCount],
                  ["Returning Clients (%)", stats.retentionRate],
                ];

                const section = (title: string, items: Record<string, number>) => [
                  [title, ""],
                  ["Label", "Value"],
                  ...Object.entries(items).map(([label, value]) => [label, value]),
                ];

                const revenueSection = section(
                  "Revenue & Jobs Overview",
                  Object.fromEntries(
                    revenueData.map((row) => [
                      row.label,
                      chartType === "revenue" ? row.revenue : row.jobs,
                    ]),
                  ),
                );

                const categoriesSection = [
                  ["Jobs by Category", ""],
                  ["Category", "Jobs"],
                  ...categoryData.map((row) => [row.name, row.value]),
                ];

                const growthSection = [
                  ["User Growth", ""],
                  ["Label", "Users", "Providers"],
                  ...userGrowthData.map((row) => [row.label, row.users, row.providers]),
                ];

                const csv = [
                  ["Analytics Export", `Range: ${timeRange}`],
                  [],
                  ...rows,
                  [],
                  ...revenueSection,
                  [],
                  ...categoriesSection,
                  [],
                  ...growthSection,
                ]
                  .map((row) =>
                    row
                      .map((value) => {
                        const str = value == null ? "" : String(value);
                        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
                      })
                      .join(","),
                  )
                  .join("\n");

                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const date = new Date().toISOString().slice(0, 10);
                link.download = `analytics-report-${timeRange}-${date}.csv`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </section>

      {loading && (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-sm text-slate-500">
            Loading analytics...
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-red-200 bg-red-50/80">
          <CardContent className="py-6 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.totalUsers}</div>
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
                <div className="text-2xl font-semibold text-slate-900">{stats.activeJobs}</div>
                <div className="text-sm text-slate-600">Active Jobs</div>
              </div>
              <Briefcase className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">₵ {stats.platformRevenue}</div>
                <div className="text-sm text-slate-600">Platform Revenue</div>
              </div>
              <DollarSign className="h-8 w-8 text-violet-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.completionRate}%</div>
                <div className="text-sm text-slate-600">Completion Rate</div>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="text-slate-900">Revenue & Jobs Overview</span>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[140px] border-slate-300 bg-white text-slate-900">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Compare performance over the selected time range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Legend />
                  {chartType === "revenue" ? (
                    <Bar dataKey="revenue" name="Revenue (₵)" fill="#0284c7" />
                  ) : (
                    <Bar dataKey="jobs" name="Jobs Count" fill="#059669" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Jobs by Category</CardTitle>
            <CardDescription className="text-slate-600">
              Distribution of jobs across service categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      const safePercent = typeof percent === "number" ? percent : 0;
                      return `${name}: ${(safePercent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900">
              User Growth & Provider Registration
            </CardTitle>
            <CardDescription className="text-slate-600">
              Track platform growth alongside provider onboarding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Total Users"
                    stroke="#0284c7"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="providers"
                    name="Service Providers"
                    stroke="#059669"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-slate-900">{stats.avgRating}</div>
              <div className="text-sm text-slate-600">Average Rating</div>
              <div className="mt-1 text-xs text-slate-500">
                Based on {stats.reviewCount} reviews
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-slate-900">
                {stats.retentionRate}%
              </div>
              <div className="text-sm text-slate-600">Returning Clients</div>
              <div className="mt-1 text-xs text-slate-500">
                Clients with more than one job
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-semibold text-slate-900">{stats.reviewCount}</div>
              <div className="text-sm text-slate-600">Total Reviews</div>
              <div className="mt-1 text-xs text-slate-500">
                All time reviews submitted
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
