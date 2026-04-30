"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { Label } from "recharts";

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

export default function ProviderJobQuotePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [materials] = useState("");
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
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-2">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Submit Proposal
        </h1>
        <p className="text-slate-500 text-lg">
          Send your best offer to the client with a clear breakdown of services.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* PROJECT BRIEF */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] border-none bg-slate-950 p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
            <div className="relative z-10 space-y-6">
              <Badge className="bg-indigo-600 border-none px-4 py-1">
                Project Brief
              </Badge>
              <h2 className="text-3xl font-bold leading-tight">{job?.title}</h2>
              <p className="text-slate-400 leading-relaxed text-sm italic">
                {job?.description}
              </p>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                  <MapPin size={16} /> {job?.location}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-indigo-400">
                  <DollarSign size={16} /> Client Budget: ETB{" "}
                  {job?.budgetAmount}
                </div>
              </div>
            </div>
          </Card>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
            <ShieldCheck className="text-indigo-600 mt-1 shrink-0" />
            <p className="text-sm text-indigo-900/70 leading-relaxed font-medium">
              Your payment is secured by{" "}
              <span className="font-bold text-indigo-900">
                Tatari Secure-Pay
              </span>
              . Funds are deposited by the client before you start.
            </p>
          </div>
        </div>

        {/* PROPOSAL FORM */}
        <div className="lg:col-span-7">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8 md:p-12 space-y-8 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-black">
                Offer
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Your Quotation
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Total Quote Amount (ETB)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                    ETB
                  </span>
                  <Input
                    type="number"
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl text-xl font-black text-indigo-600"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Execution Plan
                </Label>
                <Textarea
                  className="min-h-[150px] bg-slate-50 border-none rounded-[2rem] p-6 text-base"
                  placeholder="How will you solve this? Mention tools and approach..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold ml-1">
                    Estimated Timeline
                  </Label>
                  <Input
                    className="h-14 bg-slate-50 border-none rounded-2xl"
                    placeholder="e.g. 2 Days"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold ml-1">
                    Warranty Provided
                  </Label>
                  <Input
                    className="h-14 bg-slate-50 border-none rounded-2xl"
                    placeholder="e.g. 6 Months"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Proposal"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
