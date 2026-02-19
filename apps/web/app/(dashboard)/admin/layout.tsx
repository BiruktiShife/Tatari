"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In real app, get admin user from auth context
  const user = {
    name: "Admin User",
    email: "admin@habeshaskillshub.com",
    type: "admin" as const,
  };

  return (
    <DashboardLayout userType="admin" userName={user.name}>
      {children}
    </DashboardLayout>
  );
}
