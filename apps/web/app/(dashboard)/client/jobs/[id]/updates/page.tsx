"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type JobUpdate = {
  id: string;
  message: string;
  createdAt: string;
  provider?: { name?: string | null; businessName?: string | null } | null;
};

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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}

export default function ClientJobUpdatesPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const [updates, setUpdates] = useState<JobUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!jobId) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing auth token. Please log in again.");
          setUpdates([]);
          setLoading(false);
          return;
        }
        const res = await fetch(resolveApiUrl(`/jobs/${jobId}/updates`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          setError(text || "Failed to load updates.");
          setUpdates([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUpdates(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load updates.");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [jobId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Progress Updates</h1>
          <p className="text-gray-600 mt-2">
            Monitor your job and stay aligned with the provider.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/client/messages">Message Provider</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading updates...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : updates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            No updates yet. The provider will post progress soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {updates.map((update) => {
            const providerName =
              update.provider?.businessName || update.provider?.name || "Provider";
            return (
              <Card key={update.id} className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {providerName} • {formatDate(update.createdAt)}
                    </div>
                  </div>
                  <p className="text-gray-800 mt-2">{update.message}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
