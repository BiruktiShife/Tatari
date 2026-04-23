"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BriefcaseBusiness,
  FileText,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ClientJob = {
  id: string;
  title: string;
  status?: string;
  location?: string;
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
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setJobs([]);
          return;
        }
        const res = await fetch(resolveApiUrl("/jobs"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setJobs([]);
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setJobs(
          list.filter(
            (job: ClientJob) =>
              String(job.status || "").toUpperCase() === "COMPLETED",
          ),
        );
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
    if (!jobId) {
      toast({
        title: "Select a job",
        description: "Choose the job you want to dispute.",
        variant: "destructive",
      });
      return;
    }
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing details",
        description: "Provide a title and description for the dispute.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast({
          title: "Missing token",
          description: "Please log in again.",
          variant: "destructive",
        });
        return;
      }
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
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit dispute.");
      }
      toast({
        title: "Dispute submitted",
        description: "Our support team will review your request.",
      });
      router.push("/client/jobs");
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Support request
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Submit a Dispute
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Report an issue with a completed or active job.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <Shield className="h-4 w-4 mr-2" />
            Support Policy
          </Button>
        </div>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Dispute Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Select Job</Label>
            <Select value={jobId} onValueChange={setJobId}>
              <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                <SelectValue
                  placeholder={loading ? "Loading jobs..." : "Choose a job"}
                />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedJob && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <BriefcaseBusiness className="h-4 w-4" />
                {selectedJob.title}
              </div>
              <div className="mt-1">
                Status: {selectedJob.status || "—"}
              </div>
              <div>Location: {selectedJob.location || "—"}</div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Dispute Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Work not completed as agreed"
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <Label className="mb-2 block">Describe the Issue</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide dates, what went wrong, and expected resolution."
              rows={5}
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="bg-slate-900 text-white hover:bg-slate-800">
            <FileText className="h-4 w-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientDisputeNewPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <ClientDisputeContent />
    </Suspense>
  );
}
