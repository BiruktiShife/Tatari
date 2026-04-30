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
  Loader2,
  ChevronRight,
  TrendingUp,
  Target,
  UserCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvailableJobs } from "@/components/dashboard/AvailableJobs";
import {
  JobLifecycleOverview,
  type JobLifecycleCounts,
} from "@/components/dashboard/JobLifecycleOverview";

// Types (Keep original logic)
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
  status?: string;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState("Provider");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [availableJobs, setAvailableJobs] = useState<JobItem[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<JobItem[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (!storedUser || !token) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.role !== "PROVIDER") {
        router.replace(`/${user.role === "CLIENT" ? "client" : "admin"}`);
        return;
      }
      setAuthorized(true);

      try {
        const [meRes, availableRes, nearbyRes, assignedRes] = await Promise.all(
          [
            fetch(resolveApiUrl("/auth/me"), {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(resolveApiUrl("/jobs/provider/available"), {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(resolveApiUrl("/jobs/provider/nearby"), {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(resolveApiUrl("/jobs/provider/my"), {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ],
        );

        if (meRes.ok) {
          const me: MeResponse = await meRes.json();
          setProviderName(me.businessName || me.name || "Provider");
          setServiceAreas(me.serviceAreas || []);
        }
        if (availableRes.ok) setAvailableJobs(await availableRes.json());
        if (nearbyRes.ok) setNearbyJobs(await nearbyRes.json());
        if (assignedRes.ok) setAssignedJobs(await assignedRes.json());
      } catch (e) {
        console.error("Fetch error", e);
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
    const totalBudget = availableJobs.reduce(
      (sum, job) =>
        sum + (job.budgetAmount ?? job.budgetMax ?? job.budgetMin ?? 0),
      0,
    );
    return {
      openMarket: availableJobs.length,
      nearby: nearbyJobs.length,
      urgent: urgentCount,
      avgBudget: availableJobs.length
        ? Math.round(totalBudget / availableJobs.length)
        : 0,
    };
  }, [availableJobs, nearbyJobs]);

  const lifecycleCounts: JobLifecycleCounts = useMemo(
    () => ({
      started: assignedJobs.filter((j) =>
        ["PENDING", "ACTIVE", "ACCEPTED"].includes(
          (j.status || "").toUpperCase(),
        ),
      ).length,
      inProgress: assignedJobs.filter(
        (j) => (j.status || "").toUpperCase() === "IN_PROGRESS",
      ).length,
      completed: assignedJobs.filter(
        (j) => (j.status || "").toUpperCase() === "COMPLETED",
      ).length,
    }),
    [assignedJobs],
  );

  if (!authorized) return null;
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-bold italic">
          Optimizing your marketplace...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* 1. Header Area */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back,{" "}
              <span className="text-indigo-400">
                {providerName.split(" ")[0]}
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              {serviceAreas.length
                ? `You are currently matching jobs in ${serviceAreas.join(", ")}.`
                : "Update your service areas to unlock nearby job opportunities."}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-indigo-50 h-14 px-8 rounded-2xl font-bold shadow-xl"
          >
            <Link href="/provider/jobs" className="gap-2">
              Browse Marketplace <ChevronRight size={20} />
            </Link>
          </Button>
        </div>
      </section>

      {/* 2. Business Intelligence Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Market Jobs",
            val: metrics.openMarket,
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Nearby Hits",
            val: metrics.nearby,
            icon: Target,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Urgent Leads",
            val: metrics.urgent,
            icon: TriangleAlert,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Avg. Market Rate",
            val: `ETB ${metrics.avgBudget}`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 leading-none">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Pipeline & Management */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Project Pipeline */}
        <div className="xl:col-span-8 space-y-8">
          <JobLifecycleOverview
            counts={lifecycleCounts}
            title="Active Project Pipeline"
            subtitle="Manage your current assigned jobs from start to final payout."
          />

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-2">
            <AvailableJobs />
          </div>
        </div>

        {/* Right: Growth Actions */}
        <div className="xl:col-span-4 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
            Next Steps
          </h3>

          <div className="grid gap-4">
            {[
              {
                title: "Review Market",
                desc: "Find new available jobs",
                href: "/provider/jobs",
                icon: Briefcase,
                primary: true,
              },
              {
                title: "My Assignments",
                desc: "View your current contracts",
                href: "/provider/my-jobs",
                icon: Clock3,
              },
              {
                title: "Service Areas",
                desc: "Update your work radius",
                href: "/provider/service-area",
                icon: MapPin,
              },
              {
                title: "Public Profile",
                desc: "Optimize how clients see you",
                href: "/provider/profile",
                icon: UserCircle,
              },
            ].map((action, i) => (
              <Link href={action.href} key={i}>
                <div
                  className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group cursor-pointer
                            ${
                              action.primary
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100"
                                : "bg-white border-slate-100 text-slate-900 hover:border-indigo-200"
                            }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center 
                                    ${action.primary ? "bg-white/20" : "bg-slate-50 text-indigo-600"}`}
                    >
                      <action.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base leading-tight">
                        {action.title}
                      </h4>
                      <p
                        className={`text-xs mt-1 ${action.primary ? "text-indigo-100" : "text-slate-400"}`}
                      >
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className={`transition-transform group-hover:translate-x-1 ${action.primary ? "text-white/50" : "text-slate-300"}`}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Platform Tip Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group mt-4 shadow-2xl">
            <Sparkles
              className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-125 transition-transform"
              size={140}
            />
            <div className="relative z-10">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-none mb-4">
                Pro Tip
              </Badge>
              <h4 className="text-xl font-bold mb-2">Boost Visibility</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Providers with verified business licenses receive{" "}
                <span className="text-white font-bold">2.4x more quotes</span>{" "}
                on average.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-indigo-400 font-bold hover:text-indigo-300"
              >
                Upload License <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
