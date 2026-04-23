"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Briefcase, Zap } from "lucide-react";
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Zap className="text-white" size={22} />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Tatari</span>
                <p className="text-xs text-slate-500 -mt-0.5 font-medium">
                  Professional Services
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="#how-it-works"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              How It Works
            </Link>
            <Link
              href="#services"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              Services
            </Link>
            <Link
              href="#testimonials"
              className="text-slate-600 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              Testimonials
            </Link>

            {/* Dropdown for role selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <User size={16} />
                  Join As
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/register?role=client" className="cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4 text-indigo-600" />
                    <span>I Need a Service</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/register?role=provider"
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4 text-blue-600" />
                    <span>I Provide a Service</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
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
          <div className="md:hidden border-t border-slate-200 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="#how-it-works"
                className="text-slate-600 hover:text-indigo-600 px-3 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#services"
                className="text-slate-600 hover:text-indigo-600 px-3 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#testimonials"
                className="text-slate-600 hover:text-indigo-600 px-3 py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>

              <div className="flex flex-col space-y-2 px-3 pt-2 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="w-full border-slate-200"
                  asChild
                >
                  <Link href="/register?role=client">I Need a Service</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-200"
                  asChild
                >
                  <Link href="/register?role=provider">
                    I Provide a Service
                  </Link>
                </Button>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  asChild
                >
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
