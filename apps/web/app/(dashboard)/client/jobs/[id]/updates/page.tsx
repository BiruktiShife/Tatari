"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, MessageSquare } from "lucide-react";

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

export default function ClientJobUpdatesPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const [updates, setUpdates] = useState<JobUpdate[]>([]);
  const [, setLoading] = useState(true);
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

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Project Timeline
          </h1>
          <p className="text-slate-500 text-lg">
            Real-time milestones from your service provider.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-12 rounded-xl gap-2 font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
        >
          <MessageSquare size={18} /> Chat with Pro
        </Button>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[15px] before:w-px before:bg-slate-200 before:h-full before:z-0">
        {updates.map((update, i) => (
          <div key={update.id} className="relative z-10">
            <div
              className={`absolute -left-[27px] h-6 w-6 rounded-full border-4 border-white shadow-md flex items-center justify-center 
                            ${i === 0 ? "bg-indigo-600 ring-4 ring-indigo-50" : "bg-slate-300"}`}
            >
              {i === 0 && <Clock size={10} className="text-white" />}
            </div>
            <div
              className={`bg-white p-8 rounded-[2rem] border transition-all 
                            ${i === 0 ? "border-indigo-100 shadow-xl shadow-indigo-50 ring-1 ring-indigo-50" : "border-slate-100 opacity-80 shadow-sm"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  {update.provider?.businessName || "Update"}
                </div>
                <div className="text-xs font-bold text-slate-400 italic">
                  {new Date(update.createdAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {update.message}
              </p>
            </div>
          </div>
        ))}

        {updates.length === 0 && (
          <div className="bg-slate-50 p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-bold italic">
              Waiting for the provider to post the first update...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
