"use client";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function ClientDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    if (user.role !== "CLIENT") {
      router.replace(`/${user.role === "ADMIN" ? "admin" : "provider"}`);
      return;
    }
    // ✅ Authorized
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null; // prevent flicker
  }
  return (
    // <DashboardLayout userType="client" userName="John Doe">
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John</h1>
        <p className="text-gray-600 mt-2">
          Find skilled professionals for your needs
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        stats={[
          {
            title: "Active Jobs",
            value: "3",
            change: "+1 from last week",
            icon: "briefcase",
          },
          {
            title: "Total Spent",
            value: "$1,250",
            change: "+$300 from last month",
            icon: "dollar",
          },
          {
            title: "Providers Hired",
            value: "7",
            change: "+2 this month",
            icon: "users",
          },
          {
            title: "Avg. Rating",
            value: "4.8",
            change: "+0.2 from last month",
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
                title: "Post a New Job",
                description: "Get quotes from professionals",
                href: "/client/post-job",
                icon: "plus",
                variant: "default",
              },
              {
                title: "Message a Provider",
                description: "Contact your active providers",
                href: "/messages",
                icon: "message",
                variant: "outline",
              },
              {
                title: "Review Completed Jobs",
                description: "Rate your service experience",
                href: "/reviews",
                icon: "star",
                variant: "outline",
              },
            ]}
          />
        </div>

        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <RecentJobs
            jobs={[
              {
                id: "1",
                title: "Fix Kitchen Sink Leak",
                provider: "Mikael Plumbing",
                status: "in_progress",
                price: "$120",
                posted: "2 days ago",
              },
              {
                id: "2",
                title: "Paint Living Room",
                provider: "Dawit Painting",
                status: "completed",
                price: "$450",
                posted: "1 week ago",
              },
              {
                id: "3",
                title: "Electrical Wiring",
                provider: "Samuel Electric",
                status: "quoted",
                price: "$320",
                posted: "3 days ago",
              },
            ]}
          />
        </div>
      </div>
    </div>
    // </DashboardLayout>
  );
}
