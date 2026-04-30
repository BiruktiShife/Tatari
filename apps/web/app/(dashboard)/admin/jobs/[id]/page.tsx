"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  ShieldCheck,
  DollarSign,
  Gavel,
  Link,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  client?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
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

export default function AdminJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<AdminJobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const rawId = params?.id;
  const jobId = Array.isArray(rawId) ? rawId[0] : rawId;
  const displayId = jobId ? jobId.slice(0, 8) : "—";
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
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back to Registry
        </button>
        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className="bg-slate-50 border-slate-200 text-slate-500 font-bold px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]"
          >
            Job ID: {displayId}
          </Badge>
          <Badge className="bg-indigo-600 text-white border-none font-bold px-4 py-1.5 rounded-xl">
            {job.status}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Project Profile */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black italic">
                  !
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Budget Config
                  </p>
                  <p className="text-xl font-black text-indigo-600">
                    ETB {job.budgetAmount || "Range"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Market Category
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-white border-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full"
                  >
                    {job.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Client Timeline
                  </p>
                  <p className="font-bold text-slate-900">
                    {job.timeline || "Flexible"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <ShieldCheck
                className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"
                size={120}
              />
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-400">
                <DollarSign size={20} /> Escrow Status
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                All project funds are held in the Tatari Secure sub-account and
                released only upon verification of this audit log.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl border-white/20 bg-white/5 font-bold hover:bg-white/10"
              >
                Audit Payments
              </Button>
            </div>
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900">
                  <Gavel size={20} /> Resolution Hub
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Admin controls to escalate to a formal dispute or mediate
                  between parties.
                </p>
              </div>
              <Button className="mt-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-100">
                Raise System Dispute
              </Button>
            </div>
          </div>
        </div>

        {/* Participant Intel Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-4">
              Participants
            </h3>

            <div className="space-y-10">
              {/* Client Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <User size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Client Brief
                  </h4>
                </div>
                <div className="pl-1 space-y-2">
                  <p className="text-sm font-bold text-slate-700">
                    {job.client?.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    <Mail size={12} /> {job.client?.email || "N/A"}
                  </p>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    <Phone size={12} /> {job.client?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Provider Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">
                    Provider Brief
                  </h4>
                </div>
                {job.provider ? (
                  <div className="pl-1 space-y-2">
                    <p className="text-sm font-bold text-slate-700">
                      {job.provider.name}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 italic">
                      Contract Accepted
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs text-indigo-600 font-bold"
                      asChild
                    >
                      <Link href={`/admin/users?search=${job.provider.id}`}>
                        Audit Pro History <ChevronRight size={12} />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic text-center">
                      Unassigned Marketplace Lead
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none bg-slate-50 p-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
              Internal Audit History
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Clock size={14} className="text-slate-300 mt-1" />
                <p className="text-xs text-slate-500 leading-normal">
                  <span className="font-bold text-slate-900">Created:</span>{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck size={14} className="text-slate-300 mt-1" />
                <p className="text-xs text-slate-500 leading-normal">
                  <span className="font-bold text-slate-900">Modified:</span>{" "}
                  {job.updatedAt
                    ? new Date(job.updatedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
