"use client";

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {" "}
      {/* Softest slate background */}
      <Header userName={userName} userType={userType} />
      <div className="flex pt-16 h-screen overflow-hidden">
        <Sidebar userType={userType} />

        <main className="flex-1 overflow-y-auto md:ml-64 transition-all duration-300">
          <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-[1600px] animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
