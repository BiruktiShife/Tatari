"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AdminQuickStats } from "@/components/dashboard/AdminQuickStats";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    if (user.role !== "ADMIN") {
      router.replace(`/${user.role === "CLIENT" ? "client" : "provider"}`);
      return;
    }

    // ✅ Authorized
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null; // prevent flicker
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage the Habesha Skills Hub platform
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        stats={[
          {
            title: "Total Users",
            value: "1,247",
            change: "+124 this week",
            icon: "users",
          },
          {
            title: "Active Jobs",
            value: "89",
            change: "+12 today",
            icon: "briefcase",
          },
          {
            title: "Platform Revenue",
            value: "$8,450",
            change: "+$1,200 this month",
            icon: "dollar",
          },
          {
            title: "Dispute Cases",
            value: "3",
            change: "-2 resolved today",
            icon: "star",
          },
        ]}
      />

      {/* Admin-specific stats */}
      <AdminQuickStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verifications */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Pending Verifications</h3>
          <div className="space-y-3">
            {["Samuel Electric", "Dawit Painting", "Mikael Plumbing"].map(
              (name) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">
                      Service Provider
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Recent Disputes */}
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Disputes</h3>
          <div className="space-y-3">
            {[
              "Payment not released",
              "Job quality issue",
              "Late completion",
            ].map((issue) => (
              <div key={issue} className="p-3 border rounded">
                <div className="font-medium">{issue}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Opened 2 hours ago
                </div>
                <Button size="sm" variant="outline" className="mt-2">
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
