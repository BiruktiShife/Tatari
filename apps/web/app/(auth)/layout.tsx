import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">TT</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                Tatari Hub
              </span>
              <p className="text-xs text-gray-500 -mt-1">
                Connecting talent with opportunity
              </p>
            </div>
          </Link>
        </header>

        {/* Auth Card */}
        <div className="max-w-md mx-auto">
          <Card className="border-2 shadow-xl">{children}</Card>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="mt-4">
              Need help?{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
