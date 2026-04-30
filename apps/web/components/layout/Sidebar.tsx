"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  MessageSquare,
  Star,
  DollarSign,
  Users,
  BarChart3,
  MapPin,
  UserCheck,
  ClipboardCheck,
  ShieldCheck,
  HelpCircle,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarProps {
  userType: "client" | "provider" | "admin";
}

const NAV_GROUPS = {
  client: [
    {
      label: "Overview",
      items: [{ href: "/client", label: "Dashboard", icon: Home }],
    },
    {
      label: "Marketplace",
      items: [
        { href: "/client/post-job", label: "Post a Job", icon: Briefcase },
        { href: "/client/jobs", label: "My Projects", icon: ClipboardCheck },
        { href: "/client/providers", label: "Find Experts", icon: Users },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/client/messages", label: "Messages", icon: MessageSquare },
        { href: "/client/payments", label: "Billing", icon: DollarSign },
        { href: "/client/reviews", label: "Reviews", icon: Star },
      ],
    },
  ],
  provider: [
    {
      label: "Overview",
      items: [{ href: "/provider", label: "Dashboard", icon: Home }],
    },
    {
      label: "Work",
      items: [
        { href: "/provider/jobs", label: "Available Jobs", icon: Briefcase },
        {
          href: "/provider/my-jobs",
          label: "Current Projects",
          icon: ClipboardCheck,
        },
        { href: "/provider/service-area", label: "Service Area", icon: MapPin },
      ],
    },
    {
      label: "Business",
      items: [
        { href: "/provider/profile", label: "Public Profile", icon: UserCheck },
        { href: "/provider/messages", label: "Messages", icon: MessageSquare },
        { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
        { href: "/provider/reviews", label: "Reviews", icon: Star },
        {
          href: "/provider/disputes/new",
          label: "Disputes",
          icon: ShieldCheck,
        },
      ],
    },
  ],
  admin: [
    {
      label: "Management",
      items: [
        { href: "/admin", label: "Overview", icon: Home },
        { href: "/admin/users", label: "User Control", icon: Users },
        { href: "/admin/jobs", label: "Job Audit", icon: Briefcase },
      ],
    },
    {
      label: "Financials",
      items: [
        {
          href: "/admin/transactions",
          label: "Transactions",
          icon: DollarSign,
        },
        { href: "/admin/disputes", label: "Disputes", icon: ShieldCheck },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
  ],
};

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const { isMobileSidebarOpen, closeMobileSidebar } = useSidebar();
  const groups = NAV_GROUPS[userType] || NAV_GROUPS.client;

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-100 bg-white transition-all duration-300 md:translate-x-0",
          isMobileSidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col justify-between py-6">
          <div className="px-4 space-y-8">
            {groups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {group.label}
                </h4>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileSidebar}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                          isActive
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <item.icon
                          size={18}
                          className={cn(
                            isActive ? "text-white" : "text-slate-400",
                          )}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
