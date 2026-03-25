import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "client" | "provider" | "admin";
  userName?: string;
}

export function DashboardLayout({
  children,
  userType,
  userName = "User",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} userType={userType} />
      <div className="flex pt-16">
        <Sidebar userType={userType} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64 md:h-[calc(100vh-4rem)] md:overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
