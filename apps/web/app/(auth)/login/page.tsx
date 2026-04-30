"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Zap,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const role = searchParams.get("role") || "client";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(resolveApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (data.accessToken) localStorage.setItem("token", data.accessToken);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      toast({ title: "Welcome back!", description: "Redirecting..." });
      router.push(
        data.user?.role === "ADMIN"
          ? "/admin"
          : data.user?.role === "PROVIDER"
            ? "/provider"
            : "/client",
      );
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Force the div to be full width and height, ignoring potential parent padding
    <div className="fixed inset-0 flex w-screen h-screen bg-white overflow-hidden">
      {/* LEFT SIDE: Brand/Visual (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[60%] relative bg-slate-950 p-12 flex-col justify-between">
        {/* Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Tatari
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 mb-6 px-4 py-1 text-xs rounded-full uppercase tracking-widest font-bold">
            Platform for Pros
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            The future of <span className="text-indigo-500">work</span> in
            Ethiopia.
          </h2>
          <div className="space-y-5">
            {[
              "Verified skilled professionals",
              "100% secure escrow payments",
              "Real-time task tracking",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-slate-300 text-lg"
              >
                <CheckCircle2 size={20} className="text-indigo-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} Tatari Inc.
        </div>
      </div>

      {/* RIGHT SIDE: Form (Full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-[420px] w-full mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 group transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold italic">Back to home</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Welcome back
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-lg">Logging in as</span>
              <Badge className="bg-indigo-600 text-white border-none px-3 py-0.5 capitalize text-sm font-bold">
                {role}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-900 font-bold text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  name="email"
                  type="email"
                  placeholder="name@mail.com"
                  className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-900 font-bold text-sm">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-sm text-indigo-600 font-bold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 text-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
            <p className="text-center text-slate-600 text-sm">
              Need to login as a {role === "client" ? "Provider" : "Client"}?{" "}
              <Link
                href={`/login?role=${role === "client" ? "provider" : "client"}`}
                className="text-indigo-600 font-bold hover:underline"
              >
                Switch Role
              </Link>
            </p>
            <p className="text-center text-slate-600 text-sm">
              New to Tatari?{" "}
              <Link
                href={`/register?role=${role}`}
                className="text-slate-900 font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
