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
  Settings,
  MapPin,
  UserCheck,
  ClipboardCheck,
  Shield,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarProps {
  userType: "client" | "provider" | "admin";
}

const CLIENT_NAV_ITEMS = [
  { href: "/client", label: "Dashboard", icon: Home },
  { href: "/client/post-job", label: "Post a Job", icon: Briefcase },
  { href: "/client/jobs", label: "My Jobs", icon: ClipboardCheck },
  { href: "/client/providers", label: "Find Providers", icon: Users },
  {
    href: "/client/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  { href: "/client/reviews", label: "Reviews", icon: Star },
  { href: "/client/payments", label: "Payments", icon: DollarSign },
  { href: "/client/settings", label: "Settings", icon: Settings },
];

const PROVIDER_NAV_ITEMS = [
  { href: "/provider", label: "Dashboard", icon: Home },
  {
    href: "/provider/jobs",
    label: "Available Jobs",
    icon: Briefcase,
  },
  {
    href: "/provider/my-jobs",
    label: "My Jobs",
    icon: ClipboardCheck,
  },
  { href: "/provider/profile", label: "My Profile", icon: UserCheck },
  {
    href: "/provider/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  { href: "/provider/reviews", label: "My Reviews", icon: Star },
  { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
  {
    href: "/provider/service-area",
    label: "Service Area",
    icon: MapPin,
  },
  { href: "/provider/settings", label: "Settings", icon: Settings },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/disputes", label: "Disputes", icon: Shield },
  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: DollarSign,
  },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  {
    href: "/admin/verification",
    label: "Verification",
    icon: UserCheck,
  },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const { isMobileSidebarOpen } = useSidebar();

  const getNavItems = () => {
    switch (userType) {
      case "client":
        return CLIENT_NAV_ITEMS;
      case "provider":
        return PROVIDER_NAV_ITEMS;
      case "admin":
        return ADMIN_NAV_ITEMS;
      default:
        return CLIENT_NAV_ITEMS;
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white transition-transform md:relative md:top-0 md:translate-x-0",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={14} />
                <span>Platform Security</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All payments are secured with escrow
              </p>
            </div>

            <Link
              href="/help"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <HelpCircle size={18} />
              Help & Support
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
