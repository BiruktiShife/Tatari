"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  DollarSign,
  Download,
  Calendar,
  Target,
  PieChart as PieChartIcon,
  Activity,
  Loader2,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

// Types
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
  revenueData: any[];
  categoryData: any[];
  userGrowthData: any[];
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          resolveApiUrl(`/admin/users/analytics?range=${timeRange}`),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) setData(await res.json());
      } catch (err) {
        setError("Failed to sync analytics engine.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
          Processing Platform Data...
        </p>
      </div>
    );
  }

  const stats = data?.stats ?? {
    totalUsers: 0,
    activeJobs: 0,
    platformRevenue: 0,
    completionRate: 0,
    avgRating: 0,
    reviewCount: 0,
    retentionRate: 0,
  };
  const revenueData = data?.revenueData ?? [];
  const categoryData = data?.categoryData ?? [];
  const userGrowthData = data?.userGrowthData ?? [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold text-[10px] uppercase tracking-widest">
              Platform Intel
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Marketplace Analytics
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Deep-dive into platform liquidity, user acquisition trends, and
              fulfillment performance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-14 w-full sm:w-[180px] bg-white/5 border-white/10 text-white rounded-2xl font-bold">
                <Calendar className="mr-2 text-indigo-400" size={18} />
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Fiscal Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-white text-slate-950 hover:bg-indigo-50 h-14 px-8 rounded-2xl font-bold shadow-xl">
              <Download size={18} className="mr-2" /> Export Dataset
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Gross Revenue",
            val: `ETB ${stats.platformRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Active Marketplace",
            val: stats?.activeJobs,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Platform Users",
            val: stats?.totalUsers,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Fulfillment Rate",
            val: `${stats?.completionRate}%`,
            icon: Target,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">
                  {s.val}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <s.icon size={22} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue/Jobs Bar Chart */}
        <Card className="lg:col-span-8 rounded-[2.5rem] border-none shadow-sm bg-white p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Activity Distribution
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Platform output over time
              </p>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setChartType("revenue")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === "revenue" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartType("jobs")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartType === "jobs" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Jobs
              </button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ fill: "#F8FAFC" }}
                />
                <Bar
                  dataKey={chartType === "revenue" ? "revenue" : "jobs"}
                  radius={[6, 6, 0, 0]}
                  fill="#4f46e5"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Pie Chart */}
        <Card className="lg:col-span-4 rounded-[2.5rem] border-none shadow-sm bg-white p-8 flex flex-col">
          <div className="mb-6 text-center lg:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Demand by Skill
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Top performing categories
            </p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const labelName =
                      typeof name === "string" ? name : "Category";
                    const safePercent =
                      typeof percent === "number" ? percent : 0;
                    return `${labelName}: ${Math.round(safePercent * 100)}%`;
                  }}
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.color ||
                        ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"][index % 4]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 pt-6 border-t border-slate-50">
            {categoryData.slice(0, 3).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: ["#4f46e5", "#10b981", "#f59e0b"][i],
                    }}
                  />
                  <span className="text-xs font-bold text-slate-600 capitalize">
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-900">
                  {cat.value} Jobs
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* User Growth Line Chart */}
        <Card className="lg:col-span-12 rounded-[2.5rem] border-none shadow-sm bg-white p-10 overflow-hidden">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Growth Trajectory
            </h3>
            <p className="text-slate-400 font-medium">
              New user acquisition vs. provider onboarding
            </p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Total Clients"
                  stroke="#4f46e5"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="providers"
                  name="Pros"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 4. Quantitative Performance snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Community Rating",
            val: stats?.avgRating,
            icon: Star,
            color: "text-amber-500",
            desc: `Based on ${stats?.reviewCount} reviews`,
          },
          {
            label: "Market Retention",
            val: `${stats?.retentionRate}%`,
            icon: Activity,
            color: "text-indigo-600",
            desc: "Clients with 2+ projects",
          },
          {
            label: "Audit Success",
            val: `${stats?.completionRate}%`,
            icon: CheckCircle2,
            color: "text-emerald-500",
            desc: "Job lifecycle success",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="rounded-3xl border border-slate-100 bg-white p-8 text-center space-y-4 shadow-sm"
          >
            <div
              className={`h-12 w-12 rounded-2xl bg-slate-50 ${item.color} flex items-center justify-center mx-auto`}
            >
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="text-3xl font-black text-slate-900">{item.val}</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {item.label}
              </p>
            </div>
            <p className="text-xs text-slate-500 font-medium italic">
              {item.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
