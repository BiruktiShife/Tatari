"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Star, MessageSquare, Calendar, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type ClientReview = {
  id: string;
  rating: number;
  comment?: string | null;
  response?: string | null;
  createdAt: string;
  reviewee?: { id: string; name?: string | null; businessName?: string | null };
  job?: { id: string; title?: string | null };
};

type PendingReview = {
  jobId: string;
  jobTitle: string;
  completedAt: string;
  providerId: string | null;
  providerName: string | null;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
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

function formatDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

export default function ClientReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [reviewsRes, pendingRes] = await Promise.all([
        fetch(resolveApiUrl("/reviews/client"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(resolveApiUrl("/reviews/client/pending"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews([]);
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        const list = Array.isArray(data) ? data : [];
        setPending(list);
        const initRatings: Record<string, number> = {};
        const initComments: Record<string, string> = {};
        list.forEach((item: PendingReview) => {
          initRatings[item.jobId] = 5;
          initComments[item.jobId] = "";
        });
        setRatings(initRatings);
        setComments(initComments);
      } else {
        setPending([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    );
  }, [reviews]);

  const submitReview = async (item: PendingReview) => {
    if (!item.providerId) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setSubmitting((prev) => ({ ...prev, [item.jobId]: true }));
    try {
      const res = await fetch(resolveApiUrl("/reviews/client"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: item.jobId,
          revieweeId: item.providerId,
          rating: ratings[item.jobId] || 5,
          comment: comments[item.jobId] || "",
        }),
      });

      if (res.ok) {
        await loadData();
      }
    } finally {
      setSubmitting((prev) => ({ ...prev, [item.jobId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          <Sparkles className="h-4 w-4" />
          Feedback Center
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Reviews
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Rate completed jobs and help improve service quality.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-slate-900">{averageRating.toFixed(1)}</div>
            <div className="mt-1 text-sm text-slate-600">Average Rating Given</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-slate-900">{reviews.length}</div>
            <div className="mt-1 text-sm text-slate-600">Reviews Submitted</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-slate-900">{pending.length}</div>
            <div className="mt-1 text-sm text-slate-600">Pending Reviews</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid grid-cols-1 gap-2 bg-slate-100 p-1 sm:grid-cols-2">
          <TabsTrigger value="history">My Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <Card className="border-slate-200">
              <CardContent className="p-6 text-sm text-slate-500">Loading reviews...</CardContent>
            </Card>
          ) : reviews.length ? (
            reviews.map((review) => (
              <Card key={review.id} className="border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-semibold text-slate-900">
                        {review.reviewee?.businessName || review.reviewee?.name || "Provider"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {review.job?.title || "Job"} • {formatDate(review.createdAt)}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                      {review.rating} / 5
                    </Badge>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i <= review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-700">
                    {review.comment || "No comment provided."}
                  </p>

                  {review.response && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="text-sm font-medium flex items-center gap-2 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        Provider Response
                      </div>
                      <p className="text-sm text-slate-700">{review.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-8 text-center text-sm text-slate-500">
                No reviews submitted yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pending.length ? (
            pending.map((item) => (
              <Card key={item.jobId} className="border-slate-200 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-semibold text-slate-900">{item.providerName || "Provider"}</div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.jobTitle} • Completed {formatDate(item.completedAt)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="border border-amber-200 bg-amber-50 text-amber-700">
                      <Award className="h-3 w-3 mr-1" />
                      Awaiting review
                    </Badge>
                  </div>

                  <div>
                    <Label className="mb-2 block">Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setRatings((prev) => ({ ...prev, [item.jobId]: i }))
                          }
                          className="p-1"
                        >
                          <Star
                            size={22}
                            className={
                              i <= (ratings[item.jobId] || 5)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-slate-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Comment</Label>
                    <Textarea
                      placeholder="Share your experience..."
                      value={comments[item.jobId] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [item.jobId]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => submitReview(item)}
                      disabled={submitting[item.jobId] || !item.providerId}
                    >
                      {submitting[item.jobId] ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-8 text-center text-sm text-slate-500">
                No pending reviews. You are all caught up.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
