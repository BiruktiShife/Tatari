"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
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

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const role = searchParams.get("role") || "client";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter the email address on your account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(resolveApiUrl("/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to start reset");

      setSuccessMessage(data.message || "Check your email for reset steps.");

      toast({
        title: "Reset request received",
        description: data.message || "Check your email for reset steps.",
      });
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
              <Mail size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Tatari
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            Reset access without breaking your momentum.
          </h2>
          <div className="space-y-5 text-slate-300 text-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-indigo-500" />
              <span>Request a reset link with your email.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-indigo-500" />
              <span>Create a new password in one step.</span>
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
            href={`/login?role=${role}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 group transition-colors"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold italic">Back to login</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-slate-600">
              Enter your email and we&apos;ll prepare a reset link.
            </p>
          </div>

          {successMessage ? (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <CheckCircle2 size={18} />
                <span>Reset started</span>
              </div>
              <p className="text-sm text-slate-700">{successMessage}</p>
              <Link
                href={`/login?role=${role}`}
                className="inline-flex text-sm font-bold text-indigo-600 hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-100 text-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
