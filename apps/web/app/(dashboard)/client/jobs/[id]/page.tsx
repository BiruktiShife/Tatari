"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Types
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
  budgetAmount?: number | null;
  createdAt?: string;
  quotesCount?: number;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  accepted: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-700",
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const baseUrl = apiUrl.startsWith("http")
          ? apiUrl
          : window.location.origin;
        const url = `${baseUrl.replace(/\/$/, "")}/jobs/${id}`;

        const token = localStorage.getItem("token");
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) throw new Error("Failed to load job details");

        const data = await res.json();

        // Normalize data
        const normalized: JobDetail = {
          ...data,
          price: data.budgetAmount ? `ETB ${data.budgetAmount}` : data.price,
          posted: data.createdAt || data.created_at || data.posted,
          photos: Array.isArray(data.photos) ? data.photos : [],
        };

        setJob(normalized);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-20 text-center">
        <p className="text-red-500 font-bold mb-4">{error || "No job found"}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const statusKey = (job.status || "pending").toLowerCase();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 pb-20">
      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Projects
      </button>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Col: Media & Description */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-xl border border-slate-100">
            {job.photos && job.photos.length > 0 ? (
              <>
                <Image
                  src={
                    job.photos && job.photos[photoIndex]
                      ? job.photos[photoIndex]
                      : ""
                  }
                  fill
                  alt="Project photo"
                  className="object-cover"
                  unoptimized
                />
                {job.photos.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/90 text-slate-900 hover:bg-white"
                      onClick={() =>
                        setPhotoIndex(
                          (i) =>
                            (i - 1 + job.photos!.length) % job.photos!.length,
                        )
                      }
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/90 text-slate-900 hover:bg-white"
                      onClick={() =>
                        setPhotoIndex((i) => (i + 1) % job.photos!.length)
                      }
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShieldCheck size={48} className="mb-2 opacity-20" />
                <span className="font-medium italic text-sm text-slate-400">
                  No visual attachments provided
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Project Description
            </h2>
            <div className="text-lg text-slate-600 leading-relaxed bg-white p-8 rounded-3xl border border-slate-100 shadow-sm whitespace-pre-wrap">
              {job.description ||
                "No detailed description provided for this project."}
            </div>
          </div>
        </div>

        {/* Right Col: Details Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/50 overflow-hidden">
            <div className="bg-slate-950 p-8 text-white">
              <Badge
                className={`${statusColors[statusKey]} mb-4 px-3 py-1 border-none capitalize font-bold`}
              >
                {job.status}
              </Badge>
              <h1 className="text-3xl font-bold leading-tight tracking-tight">
                {job.title}
              </h1>
            </div>
            <CardContent className="p-8 space-y-8 bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Est. Budget
                  </p>
                  <p className="text-2xl font-black text-indigo-600">
                    {job.price || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Timeline
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {job.timeline || "Flexible"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <span className="font-bold text-slate-700">
                    {job.location || "Addis Ababa, Ethiopia"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    Posted on{" "}
                    {job.posted
                      ? new Date(job.posted).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <Button
                  className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-xl shadow-indigo-200 transition-all"
                  onClick={() => router.push(`/client/jobs/${id}/quotes`)}
                >
                  View Quotes ({job.quotesCount || 0})
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  onClick={() => router.push(`/client/messages`)}
                >
                  <MessageSquare size={18} className="mr-2 text-indigo-600" />{" "}
                  Discussion
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust badge */}
          <div className="px-8 py-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
            <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Payments are held in a secure escrow and released only when you
              are satisfied with the work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
