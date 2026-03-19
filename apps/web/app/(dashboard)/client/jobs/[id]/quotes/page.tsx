"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString();
}

export default function ClientJobQuotesPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pendingQuotes = useMemo(
    () => quotes.filter((q) => q.status === "PENDING"),
    [quotes],
  );
  const acceptedQuote = useMemo(
    () => quotes.find((q) => q.status === "ACCEPTED"),
    [quotes],
  );

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Quotes</h1>
        <p className="text-gray-600 mt-2">
          Compare providers and accept the best offer.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading quotes...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : quotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            No quotes yet. Providers will respond soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quotes.map((quote) => {
            const providerName =
              quote.provider?.businessName ||
              quote.provider?.name ||
              "Provider";
            return (
              <Card key={quote.id} className="border-slate-200">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{providerName}</h3>
                        <Badge variant="outline">{quote.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {quote.providerRating != null
                          ? `${quote.providerRating}★ (${quote.providerReviews ?? 0})`
                          : "No reviews yet"}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted {formatDate(quote.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Quote</div>
                      <div className="text-2xl font-semibold">
                        ₵ {quote.amount}
                      </div>
                    </div>
                  </div>

                  {(quote.description || quote.timeline || quote.materials || quote.warranty) && (
                    <div className="mt-4 grid gap-2 text-sm text-gray-600">
                      {quote.description && <div>{quote.description}</div>}
                      {quote.timeline && (
                        <div>
                          <span className="font-medium">Timeline:</span>{" "}
                          {quote.timeline}
                        </div>
                      )}
                      {quote.materials && (
                        <div>
                          <span className="font-medium">Materials:</span>{" "}
                          {quote.materials}
                        </div>
                      )}
                      {quote.warranty && (
                        <div>
                          <span className="font-medium">Warranty:</span>{" "}
                          {quote.warranty}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {quote.status === "PENDING" && !acceptedQuote && (
                      <Button onClick={() => handleAccept(quote.id)}>
                        Accept Quote
                      </Button>
                    )}
                    {quote.status === "ACCEPTED" && (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        Accepted
                      </Badge>
                    )}
                    {quote.status === "REJECTED" && (
                      <Badge variant="secondary">Rejected</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {pendingQuotes.length > 0 && !acceptedQuote && (
        <div className="text-sm text-gray-500">
          Accepting a quote will assign the provider and close other offers.
        </div>
      )}
    </div>
  );
}
