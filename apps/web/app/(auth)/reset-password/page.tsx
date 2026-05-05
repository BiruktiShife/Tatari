"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const role = searchParams.get("role") || "client";
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      toast({
        title: "Reset token required",
        description: "Open the link from your email or paste the token here.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please enter the same password twice.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(resolveApiUrl("/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to reset password");

      setIsDone(true);
      toast({
        title: "Password updated",
        description: "You can sign in with your new password now.",
      });

      setTimeout(() => {
        router.push(`/login?role=${role}`);
      }, 1200);
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
    <div className="fixed inset-0 flex w-screen h-screen bg-white overflow-hidden">
      <div className="hidden md:flex md:w-1/2 lg:w-[60%] relative bg-slate-950 p-12 flex-col justify-between">
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Lock size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Tatari
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            Choose a stronger key and keep moving.
          </h2>
          <div className="space-y-5 text-slate-300 text-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-indigo-500" />
              <span>One secure update for your account.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-indigo-500" />
              <span>Return to the same dashboard after sign-in.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} Tatari Inc.
        </div>
      </div>

      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-white">
        <div className="max-w-[420px] w-full mx-auto">
          <Link
            href={`/forgot-password?role=${role}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 group transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold italic">Back</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Reset password
            </h1>
            <p className="text-slate-600">
              Pick a new password for your Tatari account.
            </p>
          </div>

          {isDone ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 size={18} />
                <span>Password updated</span>
              </div>
              <p className="text-sm text-slate-700">
                Redirecting you to sign in...
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label className="text-slate-900 font-bold text-sm">
                Reset Token
              </Label>
              <Input
                name="token"
                placeholder="Paste reset token here"
                className="h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 transition-all font-mono text-xs"
                value={token}
                onChange={(event) => setToken(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-900 font-bold text-sm">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
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

            <div className="space-y-2">
              <Label className="text-slate-900 font-bold text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 text-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
