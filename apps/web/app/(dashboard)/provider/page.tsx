"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AvailableJobs } from "@/components/dashboard/AvailableJobs";

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    if (user.role !== "PROVIDER") {
      router.replace(`/${user.role === "CLIENT" ? "client" : "admin"}`);
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null; // prevent flicker
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Good morning, Samuel</h1>
        <p className="text-gray-600 mt-2">
          New jobs are waiting for your expertise
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        stats={[
          {
            title: "Active Jobs",
            value: "4",
            change: "+2 from last week",
            icon: "briefcase",
          },
          {
            title: "This Month Earnings",
            value: "$2,850",
            change: "+$450 from last month",
            icon: "dollar",
          },
          {
            title: "Avg. Response Time",
            value: "12 min",
            change: "-3 min improvement",
            icon: "users",
          },
          {
            title: "Your Rating",
            value: "4.9",
            change: "+0.1 from last week",
            icon: "star",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions
            actions={[
              {
                title: "Update Availability",
                description: "Set your working hours and days",
                href: "/dashboard/provider/settings",
                icon: "settings",
                variant: "default",
              },
              {
                title: "View New Job Alerts",
                description: "3 new jobs in your area",
                href: "/dashboard/provider/jobs",
                icon: "plus",
                variant: "outline",
              },
              {
                title: "Update Service Radius",
                description: "Change your coverage area",
                href: "/dashboard/provider/service-area",
                icon: "map",
                variant: "outline",
              },
            ]}
          />
        </div>

        {/* Available Jobs */}
        <div className="lg:col-span-2">
          <AvailableJobs />
        </div>
      </div>
    </div>
  );
}
