"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  User,
  Mail,
  Phone,
  Tag,
  Wallet,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProviderJobDetail = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  budgetType?: "FIXED" | "HOURLY" | "RANGE";
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline?: string;
  location?: string;
  address?: string | null;
  photos?: string[];
  createdAt?: string;
  quotesCount?: number;
  client?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
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

function formatBudget(job: ProviderJobDetail) {
  if (job.budgetType === "RANGE") {
    return `₵ ${job.budgetMin ?? 0} - ${job.budgetMax ?? 0}`;
  }
  if (job.budgetAmount != null) {
    return job.budgetType === "HOURLY"
      ? `₵ ${job.budgetAmount}/hr`
      : `₵ ${job.budgetAmount}`;
  }
  return "Budget not specified";
}

function formatDate(date?: string) {
  if (!date) return "Unknown";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString();
}

export default function ProviderJobDetailPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<ProviderJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const id = params?.id;
        if (!id) {
          setError("Invalid job id");
          setLoading(false);
          return;
        }

        const res = await fetch(resolveApiUrl(`/jobs/provider/${id}`), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch job");
        }

        const data = await res.json();
        setJob(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load job");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params?.id]);

  const statusClass = useMemo(() => {
    const status = (job?.status || "").toUpperCase();
    if (status === "PENDING") return "bg-amber-100 text-amber-800";
    if (status === "ACTIVE") return "bg-blue-100 text-blue-800";
    if (status === "ACCEPTED") return "bg-indigo-100 text-indigo-800";
    return "bg-gray-100 text-gray-700";
  }, [job?.status]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/provider/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>
        <Card>
          <CardContent className="p-6 text-red-600">
            {error || "Job not found"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button variant="outline" asChild>
          <Link href="/provider/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/provider/messages?job=${job.id}&intent=quote`}>
            Submit Quote
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <Badge className={statusClass}>{job.status || "PENDING"}</Badge>
            {job.category && (
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {job.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoLine icon={Wallet} label="Budget" value={formatBudget(job)} />
            <InfoLine
              icon={CalendarClock}
              label="Posted"
              value={formatDate(job.createdAt)}
            />
            <InfoLine
              icon={MapPin}
              label="Location"
              value={job.location || "Not specified"}
            />
            <InfoLine
              icon={FileText}
              label="Timeline"
              value={job.timeline || "Flexible"}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {job.description || "No description provided."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <InfoLine
                icon={User}
                label="Name"
                value={job.client?.name || "Not provided"}
              />
              <InfoLine
                icon={Mail}
                label="Email"
                value={job.client?.email || "Not provided"}
              />
              <InfoLine
                icon={Phone}
                label="Phone"
                value={job.client?.phone || "Not provided"}
              />
            </div>
          </div>

          {job.photos?.length ? (
            <div>
              <h3 className="font-semibold mb-2">Attachments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {job.photos.map((photo, idx) => (
                  <a
                    key={`${photo}-${idx}`}
                    href={photo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline truncate"
                  >
                    Attachment {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-gray-500" />
        <span>{value}</span>
      </div>
    </div>
  );
}
