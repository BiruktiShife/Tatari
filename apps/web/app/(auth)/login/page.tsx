"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const role = searchParams.get("role") || "client";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      nextErrors.password = "Password is required";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(resolveApiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      let data: {
        message?: string;
        accessToken?: string;
        user?: { role?: string };
      } | null = null;
      let rawText = "";
      try {
        data = await res.json();
      } catch {
        rawText = await res.text().catch(() => "");
      }

      if (!res.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : rawText || "Login failed";
        if (res.status === 403) {
          const fallback =
            role === "provider"
              ? "Please wait for approval."
              : "Your account is awaiting approval. Please wait for an admin to approve you.";
          toast({
            title: "Approval pending",
            description: message || fallback,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Login failed",
          description: message || "Invalid credentials",
          variant: "destructive",
        });
        setErrors((prev) => ({ ...prev, form: message || "Login failed" }));
        return;
      }

      // ✅ Save JWT if backend returns it (note: backend returns `accessToken`) (backend uses camelCase property)
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      // dev-only debug info
      if (process.env.NODE_ENV !== "production") {
        console.debug("login response", data);
        const stored = localStorage.getItem("token");
        toast({
          title: "Debug",
          description: `token ${stored ? "stored" : "missing"}`,
        });
      }
      toast({
        title: "Successfully logged in!",
        description: "Redirecting to dashboard...",
      });

      const userRole = data.user?.role;

      if (userRole === "ADMIN") {
        router.push("/admin");
      } else if (userRole === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/client");
      }
    } catch {
      toast({
        title: "Server error",
        description: "Unable to connect to server.",
        variant: "destructive",
      });
      setErrors((prev) => ({
        ...prev,
        form: "Unable to connect to server. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your {role === "client" ? "client" : "service provider"}{" "}
          account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          )}
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Switch role */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Signing in as a {role}?{" "}
            <Link
              href={`/login?role=${role === "client" ? "provider" : "client"}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Switch to {role === "client" ? "Service Provider" : "Client"}
            </Link>
          </p>
        </div>

        {/* Sign up */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register?role=${role}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </CardContent>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
