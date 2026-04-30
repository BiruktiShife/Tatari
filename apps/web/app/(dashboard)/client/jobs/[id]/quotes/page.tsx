"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";

type QuoteItem = {
  id: string;
  amount: number;
  description?: string | null;
  timeline?: string | null;
  materials?: string | null;
  warranty?: string | null;
  status: string;
  createdAt: string;
  providerRating?: number | null;
  providerReviews?: number | null;
  provider?: {
    id: string;
    name?: string | null;
    businessName?: string | null;
    avatar?: string | null;
  } | null;
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

export default function ClientJobQuotesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!jobId) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing auth token. Please log in again.");
          setQuotes([]);
          setLoading(false);
          return;
        }
        const res = await fetch(resolveApiUrl(`/quotes/job/${jobId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          setError(text || "Failed to load quotes.");
          setQuotes([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuotes(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load quotes.");
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [jobId]);

  const handleAccept = async (quoteId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Missing token",
          description: "Please log in again.",
        });
        return;
      }
      const res = await fetch(resolveApiUrl(`/quotes/${quoteId}/accept`), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to accept quote.");
      }
      const updated = quotes.map((q) =>
        q.id === quoteId
          ? { ...q, status: "ACCEPTED" }
          : { ...q, status: "REJECTED" },
      );
      setQuotes(updated);
      toast({
        title: "Quote accepted",
        description: "The provider has been assigned to your job.",
      });
      router.push("/client/jobs");
    } catch (err) {
      toast({
        title: "Accept failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Review Proposals
        </h1>
        <p className="text-slate-500 text-lg">
          Select the best professional for your project based on budget and
          rating.
        </p>
      </div>

      <div className="grid gap-6">
        {quotes.map((quote: any) => (
          <Card
            key={quote.id}
            className="rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Provider Info */}
                <div className="p-8 md:w-[300px] bg-slate-50 flex flex-col items-center text-center border-r border-slate-100">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-xl mb-4">
                    <AvatarFallback className="bg-indigo-600 text-white font-black text-xl">
                      {quote.provider?.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                    {quote.provider?.businessName || quote.provider?.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} className="fill-amber-500" />
                    <span>{quote.providerRating || "New"}</span>
                    <span className="text-slate-400 font-medium">
                      ({quote.providerReviews || 0})
                    </span>
                  </div>
                  <Badge className="mt-4 bg-emerald-50 text-emerald-700 border-none rounded-full flex gap-1 px-3">
                    <ShieldCheck size={12} /> Verified Pro
                  </Badge>
                </div>

                {/* Quote Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        Proposal Details
                      </div>
                      <p className="text-slate-600 italic leading-relaxed">
                        {quote.description || "No specific comments provided."}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-400">
                        Total Quote
                      </div>
                      <div className="text-3xl font-black text-indigo-600">
                        ₵ {quote.amount}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar size={14} /> Estimated:{" "}
                      {quote.timeline || "TBD"}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <DollarSign size={14} /> Warranty:{" "}
                      {quote.warranty || "Standard"}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold group-hover:scale-[1.02] transition-transform"
                      onClick={() => handleAccept(quote.id)}
                    >
                      Accept This Offer{" "}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 text-slate-500 font-bold"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
