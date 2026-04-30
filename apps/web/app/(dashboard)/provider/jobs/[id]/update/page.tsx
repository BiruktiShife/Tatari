"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, Loader2, Send } from "lucide-react";

type JobUpdate = {
  id: string;
  message: string;
  createdAt: string;
  provider?: { name?: string | null; businessName?: string | null } | null;
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

export default function ProviderJobUpdatesPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [updates, setUpdates] = useState<JobUpdate[]>([]);
  const [message, setMessage] = useState("");
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!jobId) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing auth token. Please log in again.");
          setUpdates([]);
          setLoading(false);
          return;
        }
        const res = await fetch(resolveApiUrl(`/jobs/${jobId}/updates`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          setError(text || "Failed to load updates.");
          setUpdates([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUpdates(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load updates.");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [jobId]);

  const handlePost = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast({
        title: "Add details",
        description: "Write a short progress update.",
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
        return;
      }
      const res = await fetch(resolveApiUrl(`/jobs/${jobId}/updates`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to post update.");
      }
      const created = await res.json();
      setUpdates((prev) => [created, ...prev]);
      setMessage("");
      toast({
        title: "Update posted",
        description: "The client can now see your progress.",
      });
    } catch (err) {
      toast({
        title: "Post failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20 px-2">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Project Log
        </h1>
        <p className="text-slate-500 text-lg">
          Post live milestones to keep your client informed and ensure payout.
        </p>
      </div>

      {/* UPDATE FORM */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200 overflow-hidden bg-white">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <h3 className="font-bold text-slate-900">Post Milestone</h3>
          </div>
          <Textarea
            className="min-h-[120px] bg-slate-50 border-none rounded-3xl p-6 text-lg"
            placeholder="What have you completed so far?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePost}
              disabled={submitting}
              className="h-12 px-10 bg-slate-900 hover:bg-indigo-600 rounded-xl font-bold gap-2"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send size={18} /> Log Update
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <div className="relative pl-10 space-y-8 before:absolute before:inset-0 before:left-[17px] before:w-px before:bg-slate-200 before:h-full">
        {updates.map((update, i) => (
          <div key={update.id} className="relative z-10 group">
            <div
              className={`absolute -left-[31px] h-9 w-9 rounded-full border-4 border-white shadow-md flex items-center justify-center 
                            ${i === 0 ? "bg-indigo-600" : "bg-slate-300"}`}
            >
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div
              className={`bg-white p-8 rounded-[2rem] border transition-all ${i === 0 ? "border-indigo-100 shadow-lg" : "border-slate-50 opacity-70"}`}
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                {new Date(update.createdAt).toLocaleString()}
              </p>
              <p className="text-lg text-slate-700 font-medium leading-relaxed italic">
                {update.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
