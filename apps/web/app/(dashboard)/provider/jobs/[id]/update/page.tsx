"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleString();
}

export default function ProviderJobUpdatesPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [updates, setUpdates] = useState<JobUpdate[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Progress Updates</h1>
        <p className="text-gray-600 mt-2">
          Share milestones and keep the client informed.
        </p>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the progress, milestones, or issues..."
          />
          <Button onClick={handlePost} disabled={submitting}>
            {submitting ? "Posting..." : "Post Update"}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-sm text-gray-500">Loading updates...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : updates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            No updates yet. Post your first update above.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {updates.map((update) => (
            <Card key={update.id} className="border-slate-200">
              <CardContent className="p-5">
                <div className="text-sm text-gray-500">
                  {formatDate(update.createdAt)}
                </div>
                <p className="text-gray-800 mt-2">{update.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
