"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AdminJobDetail = {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  timeline?: string | null;
  location?: string | null;
  address?: string | null;
  budgetType?: string | null;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  acceptedQuoteAmount?: number | null;
  createdAt?: string;
  updatedAt?: string;
  client?: { id: string; name: string; email?: string | null; phone?: string | null } | null;
  provider?: { id: string; name: string } | null;
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

function formatBudget(job: AdminJobDetail) {
  if (job.acceptedQuoteAmount != null) return `₵ ${job.acceptedQuoteAmount}`;
  if (job.budgetType === "RANGE") {
    return `₵ ${job.budgetMin ?? 0} - ${job.budgetMax ?? 0}`;
  }
  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `₵ ${job.budgetAmount}/hr`
      : `₵ ${job.budgetAmount}`;
  }
  return "Not set";
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function AdminJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = useMemo(() => String(params?.id || ""), [params]);
  const [job, setJob] = useState<AdminJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Missing admin token. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(resolveApiUrl(`/admin/users/jobs/${jobId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load job details.");
        }
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-red-600">{error || "Job not found."}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Badge variant="outline">{job.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5" />
            {job.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">{job.description}</div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {job.location || "Location not specified"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created {formatDateTime(job.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Updated {formatDateTime(job.updatedAt)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{job.category}</Badge>
            <Badge variant="outline">{job.timeline || "Flexible"}</Badge>
            <Badge variant="outline">{formatBudget(job)}</Badge>
          </div>
          {job.address && (
            <div className="text-sm text-gray-600">
              Address: {job.address}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{job.client?.name || "Client"}</div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              {job.client?.email || "—"}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              {job.client?.phone || "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{job.provider?.name || "Not assigned"}</div>
            <div className="text-gray-600">
              Accepted Quote:{" "}
              {job.acceptedQuoteAmount != null
                ? `₵ ${job.acceptedQuoteAmount}`
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
