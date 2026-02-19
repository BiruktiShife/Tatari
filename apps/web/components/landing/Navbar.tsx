"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">TT</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Tatari</span>
                <p className="text-xs text-gray-500 -mt-1">
                  Connecting talent with opportunity
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#services"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </Link>

            {/* Dropdown for role selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User size={16} />
                  Join As
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/register?role=client" className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>I Need a Service</span>
                    <span className="ml-2 text-xs text-gray-500">Client</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/register?role=provider"
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>I Provide a Service</span>
                    <span className="ml-2 text-xs text-gray-500">Provider</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#services"
                className="text-gray-700 hover:text-blue-600 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 px-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>

              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register?role=client">I Need a Service</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register?role=provider">
                    I Provide a Service
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
