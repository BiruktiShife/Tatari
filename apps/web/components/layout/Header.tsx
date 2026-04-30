"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Zap,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/hooks/use-sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userName: string;
  userType: "client" | "provider" | "admin";
}

export function Header({ userName, userType }: HeaderProps) {
  const router = useRouter();
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-white border-b border-slate-50",
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={toggleMobileSidebar}
          >
            {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              Tatari
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-slate-50 group"
              >
                <Bell
                  size={20}
                  className="text-slate-500 group-hover:text-indigo-600 transition-colors"
                />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 rounded-[1.5rem] p-2 border-slate-100 shadow-2xl"
            >
              <DropdownMenuLabel className="font-black text-slate-900 px-4 py-3">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400 font-medium italic">
                  All caught up!
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="pl-1 pr-3 py-1 h-11 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all gap-3"
              >
                <Avatar className="h-8 w-8 rounded-xl shadow-sm border-2 border-white">
                  <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-900 leading-none">
                    {userName.split(" ")[0]}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {userType}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-2 border-slate-100 shadow-2xl"
            >
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem
                className="rounded-xl font-bold text-rose-600 gap-2 focus:bg-rose-50 focus:text-rose-600"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
