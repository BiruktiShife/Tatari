"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Clock3,
  MapPin,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailableJobs } from "@/components/dashboard/AvailableJobs";

type MeResponse = {
  id: string;
  name?: string | null;
  businessName?: string | null;
  serviceAreas?: string[];
};

type JobItem = {
  id: string;
  timeline?: string;
  budgetAmount?: number | null;
  budgetMax?: number | null;
  budgetMin?: number | null;
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

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState("Provider");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [availableJobs, setAvailableJobs] = useState<JobItem[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.replace("/login");
        return;
      }

      let user: { role?: string } = {};
      try {
        user = JSON.parse(storedUser);
      } catch {
        router.replace("/login");
        return;
      }

      if (user.role !== "PROVIDER") {
        router.replace(`/${user.role === "CLIENT" ? "client" : "admin"}`);
        return;
      }

      setAuthorized(true);

      try {
        const [meRes, availableRes, nearbyRes] = await Promise.all([
          fetch(resolveApiUrl("/auth/me"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/jobs/provider/available"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/jobs/provider/nearby"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.ok) {
          const me: MeResponse = await meRes.json();
          setProviderName(me.businessName || me.name || "Provider");
          setServiceAreas(me.serviceAreas || []);
        }

        if (availableRes.ok) {
          const data = await availableRes.json();
          setAvailableJobs(Array.isArray(data) ? data : []);
        }

        if (nearbyRes.ok) {
          const data = await nearbyRes.json();
          setNearbyJobs(Array.isArray(data) ? data : []);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const metrics = useMemo(() => {
    const urgentCount = availableJobs.filter(
      (j) => j.timeline === "URGENT",
    ).length;
    const totalBudget = availableJobs.reduce((sum, job) => {
      if (job.budgetAmount != null) return sum + job.budgetAmount;
      if (job.budgetMax != null) return sum + job.budgetMax;
      if (job.budgetMin != null) return sum + job.budgetMin;
      return sum;
    }, 0);
    const averageBudget = availableJobs.length
      ? Math.round(totalBudget / availableJobs.length)
      : 0;

    return {
      openMarket: availableJobs.length,
      nearby: nearbyJobs.length,
      urgent: urgentCount,
      avgBudget: averageBudget,
    };
  }, [availableJobs, nearbyJobs]);

  if (!authorized) return null;
  if (loading) {
    return <div className="text-sm text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
              <Sparkles className="h-4 w-4" />
              Provider Dashboard
            </div>
            <h1 className="text-3xl font-bold">Welcome back, {providerName}</h1>
            <p className="text-slate-200 mt-2">
              {serviceAreas.length
                ? `Tracking jobs across ${serviceAreas.join(", ")}`
                : "Set your service areas to receive more relevant nearby jobs."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="text-slate-900">
              <Link href="/provider/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Open Marketplace Jobs</p>
              <Briefcase className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-semibold mt-2">{metrics.openMarket}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Jobs In Your Area</p>
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-semibold mt-2">{metrics.nearby}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Urgent Opportunities</p>
              <TriangleAlert className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-semibold mt-2">{metrics.urgent}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Avg Listed Budget</p>
              <Clock3 className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-3xl font-semibold mt-2">₵ {metrics.avgBudget}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AvailableJobs />
        </div>

        <Card className="border-slate-200">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Next Actions
            </h2>
            <Button asChild className="w-full justify-between">
              <Link href="/provider/jobs">
                Review Available Jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link href="/provider/my-jobs">
                Manage My Jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link href="/provider/service-area">
                Update Service Areas <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link href="/provider/profile">
                Edit Public Profile <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
