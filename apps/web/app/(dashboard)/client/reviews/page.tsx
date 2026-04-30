"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  Sparkles,
  Award,
  Briefcase,
  Quote,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types
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
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const averageRatingValue = useMemo(() => {
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
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Trust & Quality
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Share your experience to help the Tatari community find the best
            experts.
          </p>
        </div>
      </section>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Feedback Score",
            val: averageRatingValue.toFixed(1),
            icon: Award,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Total Reviews",
            val: reviews.length,
            icon: MessageSquare,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Pending Tasks",
            val: pending.length,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 leading-none">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Main Tabs */}
      <Tabs defaultValue="pending" className="w-full space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-md">
          <TabsTrigger
            value="pending"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Action Needed ({pending.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            History
          </TabsTrigger>
        </TabsList>

        {/* PENDING REVIEWS TAB */}
        <TabsContent value="pending" className="space-y-6 outline-none">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2
                className="animate-spin inline-block text-indigo-600"
                size={40}
              />
            </div>
          ) : pending.length > 0 ? (
            pending.map((item) => (
              <Card
                key={item.jobId}
                className="group rounded-[2.5rem] border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col lg:flex-row">
                  <div className="p-8 lg:w-1/3 bg-slate-50 flex flex-col justify-center border-r border-slate-100">
                    <Badge className="w-fit mb-4 bg-amber-100 text-amber-700 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase">
                      Awaiting Feedback
                    </Badge>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                      {item.providerName}
                    </h3>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <Briefcase size={16} /> {item.jobTitle}
                    </p>
                    <p className="text-slate-400 text-xs mt-4 font-bold uppercase tracking-widest">
                      Completed{" "}
                      {new Date(item.completedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-8 flex-1 space-y-6">
                    <div>
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 block">
                        Rate Quality of Work
                      </Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setRatings((v) => ({ ...v, [item.jobId]: i }))
                            }
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              size={32}
                              className={`transition-colors ${i <= (ratings[item.jobId] || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest block">
                        Share your thoughts
                      </Label>
                      <Textarea
                        placeholder="How was the service? (Communication, quality, timing...)"
                        className="min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 text-lg focus:ring-2 focus:ring-indigo-500/20"
                        value={comments[item.jobId] || ""}
                        onChange={(e) =>
                          setComments((v) => ({
                            ...v,
                            [item.jobId]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => submitReview(item)}
                        disabled={submitting[item.jobId] || !item.providerId}
                        className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                      >
                        {submitting[item.jobId] ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                            Submit Feedback <ArrowRight size={18} />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <CheckCircle2
                className="mx-auto text-emerald-400 mb-4"
                size={48}
              />
              <h3 className="text-xl font-bold text-slate-900">
                All caught up!
              </h3>
              <p className="text-slate-500 mt-2">
                You've reviewed all your completed projects.
              </p>
            </div>
          )}
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="space-y-6 outline-none">
          {reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="rounded-[2rem] border-slate-100 bg-white p-8 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl shadow-lg shadow-slate-100">
                        <AvatarFallback className="bg-slate-900 text-white font-bold text-lg">
                          {(
                            review.reviewee?.businessName ||
                            review.reviewee?.name
                          )?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900">
                          {review.reviewee?.businessName ||
                            review.reviewee?.name}
                        </h4>
                        <p className="text-sm font-bold text-indigo-600">
                          {review.job?.title}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-8 relative">
                    <Quote
                      className="absolute -top-2 -left-2 text-slate-50"
                      size={48}
                    />
                    <p className="text-lg text-slate-700 leading-relaxed font-medium italic relative z-10 pl-4 border-l-4 border-indigo-50">
                      {review.comment || "Great service, would recommend."}
                    </p>
                  </div>

                  {review.response && (
                    <div className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-100 ml-8 relative group">
                      <div className="absolute -top-3 left-6 bg-white border border-slate-100 rounded-full px-3 py-1 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Provider Response
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {review.response}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Quote className="mx-auto text-slate-100 mb-4" size={64} />
              <p className="text-slate-400 font-bold italic">
                No review history yet.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
