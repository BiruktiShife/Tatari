"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In real app, get provider user from auth context
  const user = {
    name: "Samuel Plumbing",
    email: "samuel@example.com",
    type: "provider" as const,
  };

  return (
    <DashboardLayout userType="provider" userName={user.name}>
      {children}
    </DashboardLayout>
  );
}
