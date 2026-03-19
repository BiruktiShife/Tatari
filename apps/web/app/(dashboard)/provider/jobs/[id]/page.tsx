"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type JobDetail = {
  id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  budgetType?: string;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline?: string;
  client?: { name?: string | null };
  quotes?: { id: string; amount?: number | null; status?: string }[];
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

function formatBudget(job: JobDetail) {
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

export default function ProviderJobQuotePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [materials, setMaterials] = useState("");
  const [warranty, setWarranty] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing auth token. Please log in again.");
          setLoading(false);
          return;
        }
        const res = await fetch(resolveApiUrl(`/jobs/provider/${jobId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          setError(text || "Failed to load job.");
          setJob(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJob(data);
        const hasQuote = Array.isArray(data?.quotes) && data.quotes.length > 0;
        setAlreadySubmitted(hasQuote);
      } catch {
        setError("Failed to load job.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async () => {
    if (alreadySubmitted) {
      toast({
        title: "Quote already submitted",
        description: "You can only submit one quote per job.",
        variant: "destructive",
      });
      return;
    }
    const quoteAmount = Number(amount);
    if (!quoteAmount || quoteAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter a valid quote amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Missing token",
          description: "Please log in again.",
        });
        setSubmitting(false);
        return;
      }
      const res = await fetch(resolveApiUrl("/quotes"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          amount: quoteAmount,
          description: description.trim() || undefined,
          timeline: timeline.trim() || undefined,
          materials: materials.trim() || undefined,
          warranty: warranty.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit quote.");
      }
      toast({
        title: "Quote submitted",
        description: "The client will review your offer.",
      });
      setAlreadySubmitted(true);
      router.push("/provider/jobs");
    } catch (err) {
      toast({
        title: "Submit failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submit Quote</h1>
        <p className="text-gray-600 mt-2">
          Provide a clear estimate so the client can compare offers.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading job details...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : job ? (
        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              {job.category && <Badge variant="outline">{job.category}</Badge>}
            </div>
            <p className="text-gray-600">{job.description}</p>
            <div className="text-sm text-gray-600">
              Client: {job.client?.name || "Client"}
            </div>
            <div className="text-sm text-gray-600">Location: {job.location}</div>
            <div className="text-sm text-gray-600">Budget: {formatBudget(job)}</div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          {alreadySubmitted && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Quote already submitted. You can submit only one quote for this job.
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Quote Amount
            </label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter your price"
              disabled={alreadySubmitted}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your approach, scope, and assumptions"
              disabled={alreadySubmitted}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Timeline</label>
            <Input
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="Estimated duration"
              disabled={alreadySubmitted}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Materials
            </label>
            <Input
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Included materials, if any"
              disabled={alreadySubmitted}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Warranty</label>
            <Input
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="Warranty or guarantee details"
              disabled={alreadySubmitted}
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting || alreadySubmitted}>
            {alreadySubmitted
              ? "Quote Submitted"
              : submitting
                ? "Submitting..."
                : "Submit Quote"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
