"use client";

import React, { useState } from "react";
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

export default function LoginPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3003/auth/login", {
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

      let data: any = null;
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
          toast({
            title: "Approval pending",
            description:
              "Your account is awaiting approval. Please wait for an admin to approve you.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Login failed",
          description: message || "Invalid credentials",
          variant: "destructive",
        });
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

      const role = data.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/client");
      }
    } catch (error) {
      toast({
        title: "Server error",
        description: "Unable to connect to server.",
        variant: "destructive",
      });
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
            Don't have an account?{" "}
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
