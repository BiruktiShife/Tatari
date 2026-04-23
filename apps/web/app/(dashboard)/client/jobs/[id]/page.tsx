"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  accepted: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-700",
};

const statusTextColor: Record<string, string> = {
  pending: "text-amber-800",
  active: "text-blue-800",
  accepted: "text-indigo-800",
  in_progress: "text-purple-800",
  completed: "text-emerald-800",
  cancelled: "text-red-700",
  expired: "text-gray-700",
};
// simple type for job, may be extended
interface JobDetail {
  id: string;
  title: string;
  status?: string;
  description?: string;
  location?: string;
  posted?: string;
  timeline?: string;
  price?: string;
  photos?: string[];
}

type JobApi = JobDetail & {
  price?: string | number;
  budgetAmount?: number | null;
  createdAt?: string;
  created_at?: string;
  photos?: string[];
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchJob = async () => {
      try {
        let url = "";
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        if (apiUrl) {
          try {
            new URL(apiUrl);
            url = `${apiUrl.replace(/\/$/, "")}/jobs/${id}`;
          } catch (e) {
            if (apiUrl.startsWith("/"))
              url = `${apiUrl.replace(/\/$/, "")}/jobs/${id}`;
            else throw e;
          }
        } else {
          if (typeof window !== "undefined" && window.location) {
            const origin = window.location.origin;
            url = origin.includes("localhost")
              ? `http://localhost:3003/jobs/${id}`
              : `${origin}/jobs/${id}`;
          } else {
            url = `/jobs/${id}`;
          }
        }

        console.log("Fetching job", id, "from", url);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          // try fallback when the detail route is unsupported
          if (res.status === 404) {
            console.warn("job detail 404, attempting list fallback");
            const listUrl = url.replace(/\/jobs\/[^/]+$/, "/jobs");
            const listRes = await fetch(listUrl, {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (listRes.ok) {
              const listData = await listRes.json();
              const found = Array.isArray(listData)
                ? (listData as JobApi[]).find(
                    (j) => j.id === id || (j as { _id?: string })._id === id,
                  )
                : null;
              if (found) {
                console.log("fallback job data", found);
                const normalized: JobDetail = {
                  ...found,
                  price: String(found.price ?? found.budgetAmount ?? ""),
                  posted: found.posted || found.createdAt || found.created_at || "",
                  photos: Array.isArray(found.photos) ? found.photos : [],
                };
                setJob(normalized);
                return;
              }
            }
          }
          throw new Error(
            `Failed to load job (${res.status} ${res.statusText}) ${text}`,
          );
        }
        const data: JobApi = await res.json();
        console.log("fetched job data", data);
        const normalized: JobDetail = {
          ...data,
          price: String(data.price ?? data.budgetAmount ?? ""),
          posted: data.posted || data.createdAt || data.created_at || "",
          photos: Array.isArray(data.photos) ? data.photos : [],
        };
        setJob(normalized);
      } catch (e: unknown) {
        console.error("Job fetch error", e);
        setError(e instanceof Error ? e.message : "Error fetching job");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!job) return <div>No job found</div>;

  const statusKey = (job.status || "").toLowerCase();

  const photos: string[] = job.photos || [];
  const currentPhoto = photos[photoIndex] || null;

  const nextPhoto = () => {
    setPhotoIndex((i) => (i + 1) % photos.length);
  };
  const prevPhoto = () => {
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* image column */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt="job photo"
              width={800}
              height={600}
              className="object-cover rounded-lg max-h-96 w-full"
              unoptimized
            />
          ) : (
            <div className="bg-gray-100 w-full h-64 flex items-center justify-center">
              No image
            </div>
          )}
          {photos.length > 1 && (
            <div className="mt-4 flex gap-2">
              <Button onClick={prevPhoto}>Previous</Button>
              <Button onClick={nextPhoto}>Next</Button>
            </div>
          )}
        </div>

        {/* details column */}
        <div className="flex-1 space-y-4">
          <h1
            className={`text-2xl font-bold ${statusTextColor[statusKey] || "text-gray-900"}`}
          >
            {job.title}
          </h1>
          <Badge className={statusColors[statusKey] || ""}>{job.status}</Badge>
          {job.description && <p>{job.description}</p>}
          <div>Location: {job.location}</div>
          <div>Posted: {formatDate(job.posted)}</div>
          <div>Timeline: {job.timeline}</div>
          <div>Price: {job.price || "—"}</div>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </div>
    </div>
  );
}
