"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  FileText,
  ShieldAlert,
  ArrowLeft,
  Info,
  Gavel,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Types
type ClientJob = {
  id: string;
  title: string;
  status?: string;
  location?: string;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function ClientDisputeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<ClientJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const preselected = searchParams.get("jobId");
    if (preselected) setJobId(preselected);
  }, [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(resolveApiUrl("/jobs"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setJobs(
            list.filter(
              (job: ClientJob) =>
                String(job.status || "").toUpperCase() === "COMPLETED",
            ),
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === jobId),
    [jobs, jobId],
  );

  const handleSubmit = async () => {
    if (!jobId || !title.trim() || !description.trim()) {
      toast({
        title: "Missing details",
        description: "Please complete all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(resolveApiUrl("/disputes"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit dispute.");

      toast({
        title: "Dispute submitted",
        description: "Our resolution team will review this within 24 hours.",
      });
      router.push("/client/jobs");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* 1. Header Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-500/10 blur-[100px]" />
        <div className="relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Resolution Request
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              If a project wasn't completed as agreed, our mediation team is
              here to help you resolve the issue fairly.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* 2. The Form Area */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Gavel size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Dispute Details
              </h2>
            </div>

            <div className="space-y-6">
              {/* Job Selection */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Select Project
                </Label>
                <Select value={jobId} onValueChange={setJobId}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl text-slate-700">
                    <SelectValue
                      placeholder={
                        loading ? "Loading history..." : "Choose the project..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Job Preview */}
              {selectedJob && (
                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {selectedJob.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-indigo-600 font-bold mt-1 uppercase tracking-tight">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} /> {selectedJob.location}
                        </div>
                        <div className="flex items-center gap-1 font-black underline underline-offset-2">
                          COMPLETED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Title */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Dispute Reason
                </Label>
                <Input
                  placeholder="e.g. Scope of work was not completed"
                  className="h-14 bg-slate-50 border-none rounded-2xl text-lg focus:ring-rose-500/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Detailed Explanation
                </Label>
                <Textarea
                  placeholder="Please explain what went wrong and what your desired outcome is (e.g. partial refund, rework)..."
                  className="min-h-[200px] bg-slate-50 border-none rounded-[2rem] p-6 text-lg focus:ring-rose-500/20 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FileText size={20} /> Open Dispute File
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Resolution Guide Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border-none bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Resolution Process</h3>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Investigation",
                    desc: "Our team reviews the job history, messages, and evidence.",
                  },
                  {
                    step: "02",
                    title: "Mediation",
                    desc: "We speak with both you and the provider to find a fair solution.",
                  },
                  {
                    step: "03",
                    title: "Final Verdict",
                    desc: "A decision is made on funds release or refund within 3-5 days.",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="text-sm font-black opacity-40">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-bold">{s.title}</h4>
                      <p className="text-sm text-indigo-100 mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Support Notice */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-4">
            <Info className="text-slate-400 mt-1 shrink-0" size={20} />
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Tatari maintains a{" "}
              <span className="text-slate-900 font-bold">Safe-Pay Escrow</span>.
              No funds are released to the provider until a dispute is resolved
              or closed by the client.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDisputeNewPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <ClientDisputeContent />
    </Suspense>
  );
}
