"use client";

import React, { useState } from "react";
import { Bell, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function Header({ userName, userType }: HeaderProps) {
  const [notifications] = useState(3); // Mock notification count
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
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

          <div className="hidden md:block w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={`Search ${userType === "client" ? "providers" : "jobs"}...`}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userType === "client" && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">New quote received</p>
                        <p className="text-sm text-gray-500">
                          Plumber quoted $150
                        </p>
                        <p className="text-xs text-gray-400">2 min ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
              {userType === "provider" && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <Bell size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">New job alert!</p>
                        <p className="text-sm text-gray-500">
                          Electrical work needed nearby
                        </p>
                        <p className="text-xs text-gray-400">5 min ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
