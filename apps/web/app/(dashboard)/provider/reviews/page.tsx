"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Sparkles,
  Filter,
  Calendar,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProviderReview = {
  id: string;
  rating: number;
  comment?: string | null;
  response?: string | null;
  createdAt: string;
  reviewer?: { id: string; name?: string | null };
  job?: { id: string; title?: string | null };
};

type PendingFeedback = {
  jobId: string;
  jobTitle: string;
  completedAt: string;
  clientId: string;
  clientName: string;
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

export default function ProviderReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<Record<string, boolean>>({});
  const [feedbackRatings, setFeedbackRatings] = useState<Record<string, number>>(
    {},
  );
  const [feedbackComments, setFeedbackComments] = useState<Record<string, string>>(
    {},
  );
  const [submittingFeedback, setSubmittingFeedback] = useState<
    Record<string, boolean>
  >({});

  const loadReviews = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [receivedRes, pendingRes] = await Promise.all([
        fetch(resolveApiUrl("/reviews/provider"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(resolveApiUrl("/reviews/provider/pending"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews([]);
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        const list = Array.isArray(data) ? data : [];
        setPendingFeedback(list);

        const initRatings: Record<string, number> = {};
        const initComments: Record<string, string> = {};
        list.forEach((item: PendingFeedback) => {
          initRatings[item.jobId] = 5;
          initComments[item.jobId] = "";
        });
        setFeedbackRatings(initRatings);
        setFeedbackComments(initComments);
      } else {
        setPendingFeedback([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const q = search.trim().toLowerCase();
      const matchesQ = !q
        ? true
        : [review.reviewer?.name, review.job?.title, review.comment]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));

      const matchesRating =
        ratingFilter === "all" ? true : review.rating === Number(ratingFilter);

      return matchesQ && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  const stats = useMemo(() => {
    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    const unreplied = reviews.filter((r) => !r.response).length;
    return {
      count: reviews.length,
      avg,
      unreplied,
      pendingGiven: pendingFeedback.length,
    };
  }, [reviews, pendingFeedback.length]);

  const submitReply = async (reviewId: string) => {
    const text = (replyDrafts[reviewId] || "").trim();
    if (!text) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setReplying((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const res = await fetch(
        resolveApiUrl(`/reviews/provider/${reviewId}/response`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ response: text }),
        },
      );

      if (res.ok) {
        setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
        await loadReviews();
      }
    } finally {
      setReplying((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const submitClientFeedback = async (item: PendingFeedback) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setSubmittingFeedback((prev) => ({ ...prev, [item.jobId]: true }));
    try {
      const res = await fetch(resolveApiUrl("/reviews/provider"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: item.jobId,
          revieweeId: item.clientId,
          rating: feedbackRatings[item.jobId] || 5,
          comment: feedbackComments[item.jobId] || "",
        }),
      });
      if (res.ok) {
        setPendingFeedback((prev) =>
          prev.filter((pending) => pending.jobId !== item.jobId),
        );
        setFeedbackRatings((prev) => {
          const next = { ...prev };
          delete next[item.jobId];
          return next;
        });
        setFeedbackComments((prev) => {
          const next = { ...prev };
          delete next[item.jobId];
          return next;
        });
        await loadReviews();
      }
    } finally {
      setSubmittingFeedback((prev) => ({ ...prev, [item.jobId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
          <Sparkles className="h-4 w-4" />
          Reputation Center
        </div>
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <p className="text-slate-200 mt-2">
          Manage feedback you receive and give professional feedback to clients.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.avg.toFixed(1)}</div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.count}</div>
            <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.unreplied}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Replies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{stats.pendingGiven}</div>
            <div className="text-sm text-gray-600 mt-1">Client Feedback Pending</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="received">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 mb-4">
          <TabsTrigger value="received">Reviews About Me</TabsTrigger>
          <TabsTrigger value="give">Give Client Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by client, job, or review text..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-[190px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="p-6 text-sm text-gray-500">
                Loading reviews...
              </CardContent>
            </Card>
          ) : filtered.length ? (
            <div className="space-y-4">
              {filtered.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">
                          {review.reviewer?.name || "Client"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {review.job?.title || "Job"} • {formatDate(review.createdAt)}
                        </div>
                      </div>
                      <Badge variant="outline">{review.rating} / 5</Badge>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700">
                      {review.comment || "No comment provided."}
                    </p>

                    {review.response ? (
                      <div className="rounded-lg border bg-slate-50 p-3">
                        <div className="text-sm font-medium mb-1">Your response</div>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Reply to this review
                        </Label>
                        <Textarea
                          placeholder="Thank the client and address their feedback..."
                          value={replyDrafts[review.id] || ""}
                          onChange={(e) =>
                            setReplyDrafts((prev) => ({
                              ...prev,
                              [review.id]: e.target.value,
                            }))
                          }
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => submitReply(review.id)}
                            disabled={
                              replying[review.id] ||
                              !(replyDrafts[review.id] || "").trim()
                            }
                          >
                            {replying[review.id] ? "Posting..." : "Post Reply"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-500">
                No reviews found for the current filters.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="give" className="space-y-4">
          {pendingFeedback.length ? (
            pendingFeedback.map((item) => (
              <Card key={item.jobId}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="font-semibold">{item.clientName}</div>
                      <div className="text-sm text-gray-500">
                        {item.jobTitle} • Completed {formatDate(item.completedAt)}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <UserRoundCheck className="h-3.5 w-3.5 mr-1" />
                      Awaiting your feedback
                    </Badge>
                  </div>

                  <div>
                    <Label className="mb-2 block">Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          className="p-1"
                          onClick={() =>
                            setFeedbackRatings((prev) => ({
                              ...prev,
                              [item.jobId]: i,
                            }))
                          }
                        >
                          <Star
                            size={22}
                            className={
                              i <= (feedbackRatings[item.jobId] || 5)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Comment</Label>
                    <Textarea
                      placeholder="Write professional feedback about this client..."
                      value={feedbackComments[item.jobId] || ""}
                      onChange={(e) =>
                        setFeedbackComments((prev) => ({
                          ...prev,
                          [item.jobId]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => submitClientFeedback(item)}
                      disabled={submittingFeedback[item.jobId]}
                    >
                      {submittingFeedback[item.jobId]
                        ? "Submitting..."
                        : "Submit Feedback"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-gray-500">
                No pending client feedback.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
