"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, X, MessageSquare, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/hooks/use-sidebar";

interface HeaderProps {
  userName: string;
  userType: "client" | "provider" | "admin";
}

type NotificationCounts = {
  messages: number;
  reviews: number;
  jobs: number;
};

type NotificationItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
      throw err;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    return origin.includes("localhost")
      ? `http://localhost:3003${path}`
      : `${origin}${path}`;
  }

  return path;
}

export function Header({ userName, userType }: HeaderProps) {
  const router = useRouter();
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    reviews: 0,
    jobs: 0,
  });
  const [unseenCounts, setUnseenCounts] = useState<NotificationCounts>({
    messages: 0,
    reviews: 0,
    jobs: 0,
  });
  const [lastSeenSnapshot, setLastSeenSnapshot] =
    useState<NotificationCounts | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    // clear any stored auth tokens or user info
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // add other clearance if needed
    }
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    let isMounted = true;
    const loadCounts = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const res = await fetch(
          resolveApiUrl("/notifications/sidebar-counts"),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;
        const nextCounts: NotificationCounts = {
          messages: Number(data?.messages || 0),
          reviews: Number(data?.reviews || 0),
          jobs: Number(data?.jobs || 0),
        };
        setCounts(nextCounts);
        if (!lastSeenSnapshot) {
          setUnseenCounts(nextCounts);
        } else {
          setUnseenCounts({
            messages: Math.max(0, nextCounts.messages - lastSeenSnapshot.messages),
            reviews: Math.max(0, nextCounts.reviews - lastSeenSnapshot.reviews),
            jobs: Math.max(0, nextCounts.jobs - lastSeenSnapshot.jobs),
          });
        }
      } catch {
        // silent fail for header notifications
      }
    };

    const refresh = () => loadCounts();
    loadCounts();
    const interval = setInterval(refresh, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [lastSeenSnapshot]);

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];
    if (userType === "client") {
      if (unseenCounts.messages > 0) {
        items.push({
          key: "messages",
          title: "New messages",
          description: `${unseenCounts.messages} unread message${
            unseenCounts.messages > 1 ? "s" : ""
          } from providers`,
          href: "/client/messages",
          icon: MessageSquare,
        });
      }
      if (unseenCounts.reviews > 0) {
        items.push({
          key: "reviews",
          title: "Pending reviews",
          description: `${unseenCounts.reviews} job${
            unseenCounts.reviews > 1 ? "s" : ""
          } awaiting your feedback`,
          href: "/client/reviews",
          icon: Star,
        });
      }
    }
    if (userType === "provider") {
      if (unseenCounts.messages > 0) {
        items.push({
          key: "messages",
          title: "New messages",
          description: `${unseenCounts.messages} unread message${
            unseenCounts.messages > 1 ? "s" : ""
          } from clients`,
          href: "/provider/messages",
          icon: MessageSquare,
        });
      }
      if (unseenCounts.reviews > 0) {
        items.push({
          key: "reviews",
          title: "New reviews",
          description: `${unseenCounts.reviews} review${
            unseenCounts.reviews > 1 ? "s" : ""
          } received recently`,
          href: "/provider/reviews",
          icon: Star,
        });
      }
      if (unseenCounts.jobs > 0) {
        items.push({
          key: "jobs",
          title: "New job postings",
          description: `${unseenCounts.jobs} new job${
            unseenCounts.jobs > 1 ? "s" : ""
          } posted in the last 24 hours`,
          href: "/provider/jobs",
          icon: Briefcase,
        });
      }
    }
    if (userType === "admin") {
      if (unseenCounts.jobs > 0) {
        items.push({
          key: "jobs",
          title: "New job postings",
          description: `${unseenCounts.jobs} new job${
            unseenCounts.jobs > 1 ? "s" : ""
          } created recently`,
          href: "/admin/jobs",
          icon: Briefcase,
        });
      }
      if (unseenCounts.reviews > 0) {
        items.push({
          key: "reviews",
          title: "New reviews",
          description: `${unseenCounts.reviews} review${
            unseenCounts.reviews > 1 ? "s" : ""
          } submitted recently`,
          href: "/admin/analytics",
          icon: Star,
        });
      }
    }
    return items;
  }, [unseenCounts, userType]);

  const totalNotificationsRaw = useMemo(() => {
    const safe = (value: number) => (Number.isFinite(value) ? value : 0);
    if (userType === "client") {
      return Math.max(
        0,
        safe(unseenCounts.messages) + safe(unseenCounts.reviews),
      );
    }
    if (userType === "provider") {
      return Math.max(
        0,
        safe(unseenCounts.messages) +
          safe(unseenCounts.reviews) +
          safe(unseenCounts.jobs),
      );
    }
    if (userType === "admin") {
      return Math.max(
        0,
        safe(unseenCounts.jobs) + safe(unseenCounts.reviews),
      );
    }
    return 0;
  }, [
    unseenCounts.messages,
    unseenCounts.reviews,
    unseenCounts.jobs,
    userType,
  ]);

  const totalNotifications = notifications.length
    ? totalNotificationsRaw
    : 0;

  const handleNotificationClick = (item: NotificationItem) => {
    if (item.key === "messages") {
      setUnseenCounts((prev) => ({ ...prev, messages: 0 }));
    }
    if (item.key === "reviews") {
      setUnseenCounts((prev) => ({ ...prev, reviews: 0 }));
    }
    if (item.key === "jobs") {
      setUnseenCounts((prev) => ({ ...prev, jobs: 0 }));
    }
    router.push(item.href);
  };

  useEffect(() => {
    if (!isNotificationsOpen) return;
    if (totalNotifications === 0) return;
    setLastSeenSnapshot(counts);
    setUnseenCounts({ messages: 0, reviews: 0, jobs: 0 });
  }, [counts, isNotificationsOpen, totalNotifications]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-white">TT</span>
            </div>
            <span className="font-bold text-xl hidden lg:inline">Tatari</span>
            <span className="font-bold text-xl lg:hidden">HSH</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {totalNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length ? (
                notifications.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.key}
                      className="cursor-pointer"
                      onSelect={() => handleNotificationClick(item)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-slate-100 p-2">
                          <Icon size={16} className="text-slate-700" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center text-sm text-gray-500">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/avatars/${userType}.png`} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userType === "provider" ? "Service Provider" : userType}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
