"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Briefcase,
  FileText,
  ShieldAlert,
  ArrowLeft,
  Info,
  Gavel,
  Loader2,
  MapPin,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type ProviderJob = {
  id: string;
  title: string;
  status?: string;
  location?: string;
  client?: { name?: string | null };
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function ProviderDisputeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<ProviderJob[]>([]);
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
        const res = await fetch(resolveApiUrl("/jobs/provider/my"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setJobs(
            list.filter(
              (job: ProviderJob) =>
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
        title: "Missing info",
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
        title: "Dispute Logged",
        description: "Our mediation team will review your case shortly.",
      });
      router.push("/provider/my-jobs");
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-2">
      {/* 1. Header Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rose-500/10 blur-[100px]" />
        <div className="relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Dashboard
          </button>
          <div className="space-y-3">
            <Badge className="bg-rose-500/20 text-rose-300 border-none px-4 py-1 font-bold">
              Mediation Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Open a Dispute
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              File a formal report regarding payment, scope changes, or client
              conduct. We aim for fair resolutions for all parties.
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* 2. Dispute Form */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Gavel size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Case Information
              </h2>
            </div>

            <div className="space-y-6">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Select Project
                </Label>
                <Select value={jobId} onValueChange={setJobId}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl text-slate-700">
                    <SelectValue
                      placeholder={
                        loading ? "Loading..." : "Which project has an issue?"
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

              {/* Job Preview Card */}
              {selectedJob && (
                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                      <Briefcase size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">
                        {selectedJob.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        <div className="flex items-center gap-1">
                          <User size={12} /> {selectedJob.client?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} /> {selectedJob.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dispute Title */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Reason for Dispute
                </Label>
                <Input
                  placeholder="e.g. Scope was significantly increased without payment"
                  className="h-14 bg-slate-50 border-none rounded-2xl text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Detailed Evidence
                </Label>
                <Textarea
                  placeholder="Please describe exactly what happened. Mention dates, agreed terms, and the specific conflict..."
                  className="min-h-[200px] bg-slate-50 border-none rounded-[2rem] p-6 text-lg focus:ring-indigo-500/20 resize-none"
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
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FileText size={20} /> Log Formal Dispute
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* 3. Mediation Guide Sidebar */}
        <aside className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border-none bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mediation Process</h3>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Review",
                    desc: "Our team examines the contract, your log, and chat history.",
                  },
                  {
                    step: "02",
                    title: "Hearings",
                    desc: "We request a statement from the client to hear their side.",
                  },
                  {
                    step: "03",
                    title: "Resolution",
                    desc: "A final ruling on escrow release is made within 72 hours.",
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

          {/* Support Policy Link */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-slate-400" size={20} />
              <h4 className="font-bold text-slate-900">Provider Rights</h4>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
              Tatari protects providers against non-payment for completed
              milestones. If work is verified, funds are guaranteed.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-indigo-600 font-bold group"
            >
              Read Support Policy{" "}
              <ChevronRight
                size={14}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function ProviderDisputeNewPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <ProviderDisputeContent />
    </Suspense>
  );
}
