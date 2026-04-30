"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Sparkles,
  Filter,
  Award,
  Briefcase,
  Quote,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Reply,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types
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
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}
function formatDate(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export default function ProviderReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<PendingFeedback[]>([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<Record<string, boolean>>({});
  const [feedbackRatings, setFeedbackRatings] = useState<
    Record<string, number>
  >({});
  const [feedbackComments, setFeedbackComments] = useState<
    Record<string, string>
  >({});
  const [submittingFeedback, setSubmittingFeedback] = useState<
    Record<string, boolean>
  >({});

  const loadReviews = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const [receivedRes, pendingRes] = await Promise.all([
        fetch(resolveApiUrl("/reviews/provider"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(resolveApiUrl("/reviews/provider/pending"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (receivedRes.ok) setReviews(await receivedRes.json());
      if (pendingRes.ok) {
        const list = await pendingRes.json();
        setPendingFeedback(list);
        list.forEach((item: PendingFeedback) => {
          setFeedbackRatings((prev) => ({ ...prev, [item.jobId]: 5 }));
          setFeedbackComments((prev) => ({ ...prev, [item.jobId]: "" }));
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const stats = useMemo(() => {
    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return {
      count: reviews.length,
      avg,
      unreplied: reviews.filter((r) => !r.response).length,
      pendingGiven: pendingFeedback.length,
    };
  }, [reviews, pendingFeedback]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        !search ||
        [r.reviewer?.name, r.job?.title, r.comment].some((v) =>
          v?.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesRating =
        ratingFilter === "all" || r.rating === Number(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [reviews, search, ratingFilter]);

  const submitReply = async (reviewId: string) => {
    const text = (replyDrafts[reviewId] || "").trim();
    if (!text) return;
    const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
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
      if (res.ok) await loadReviews();
    } finally {
      setSubmittingFeedback((prev) => ({ ...prev, [item.jobId]: false }));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 space-y-4">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold uppercase tracking-widest text-[10px]">
            Reputation Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Market Credibility
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Respond to clients and build a profile that stands out to high-value
            projects.
          </p>
        </div>
      </section>

      {/* 2. Stats Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Feedback Score",
            val: stats.avg.toFixed(1),
            icon: Award,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Total Reviews",
            val: stats.count,
            icon: MessageSquare,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Reply Needed",
            val: stats.unreplied,
            icon: Reply,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Pending Given",
            val: stats.pendingGiven,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-7 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={22} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <Tabs defaultValue="received" className="w-full space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-md">
          <TabsTrigger
            value="received"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Received
          </TabsTrigger>
          <TabsTrigger
            value="give"
            className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Give Feedback
          </TabsTrigger>
        </TabsList>

        {/* REVIEWS ABOUT ME TAB */}
        <TabsContent value="received" className="space-y-6 outline-none">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={20}
              />
              <Input
                className="h-14 pl-12 bg-white border-none rounded-2xl shadow-sm text-base"
                placeholder="Search by client or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-14 md:w-[220px] bg-white border-none rounded-2xl shadow-sm font-bold text-slate-600">
                <Filter className="mr-2 text-slate-400" size={18} />
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <Loader2
                  className="animate-spin inline-block text-indigo-600"
                  size={40}
                />
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((r) => (
                <Card
                  key={r.id}
                  className="rounded-[2.5rem] border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-4">
                      <Avatar className="h-14 w-14 rounded-2xl shadow-lg border-2 border-slate-50">
                        <AvatarFallback className="bg-slate-900 text-white font-bold">
                          {r.reviewer?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 leading-tight">
                          {r.reviewer?.name}
                        </h4>
                        <p className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 mt-1">
                          <Briefcase size={14} /> {r.job?.title}
                        </p>
                        <div className="flex gap-1 mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < r.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  <div className="mt-8 relative">
                    <Quote
                      className="absolute -top-2 -left-2 text-slate-50"
                      size={48}
                    />
                    <p className="text-lg text-slate-700 leading-relaxed font-medium italic relative z-10 pl-4 border-l-4 border-indigo-50">
                      {r.comment || "Professional and efficient. Great work!"}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-50">
                    {r.response ? (
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 ml-8 relative">
                        <div className="absolute -top-3 left-6 bg-white border border-slate-100 rounded-full px-3 py-1 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Your Response
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {r.response}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 ml-8 animate-in fade-in slide-in-from-top-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                          <Reply size={14} /> Send a professional response
                        </Label>
                        <div className="bg-slate-50 rounded-[2rem] p-2 border border-slate-100 focus-within:border-indigo-200 transition-all flex flex-col gap-2">
                          <Textarea
                            className="border-none bg-transparent focus-visible:ring-0 text-base resize-none min-h-[100px]"
                            placeholder="e.g. Thank you! It was a pleasure working with you..."
                            value={replyDrafts[r.id] || ""}
                            onChange={(e) =>
                              setReplyDrafts((v) => ({
                                ...v,
                                [r.id]: e.target.value,
                              }))
                            }
                          />
                          <div className="flex justify-end pr-2 pb-2">
                            <Button
                              onClick={() => submitReply(r.id)}
                              disabled={
                                replying[r.id] || !replyDrafts[r.id]?.trim()
                              }
                              className="bg-slate-900 rounded-xl px-6 h-10 font-bold text-xs"
                            >
                              {replying[r.id] ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Post Response"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Sparkles className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold italic">
                  No reviews found with these filters.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* GIVE CLIENT FEEDBACK TAB */}
        <TabsContent value="give" className="space-y-6 outline-none">
          {pendingFeedback.length > 0 ? (
            pendingFeedback.map((item) => (
              <Card
                key={item.jobId}
                className="group rounded-[2.5rem] border-slate-100 bg-white hover:border-indigo-100 transition-all duration-300 overflow-hidden shadow-sm"
              >
                <CardContent className="p-0 flex flex-col lg:flex-row">
                  <div className="p-8 lg:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col justify-center">
                    <Badge className="w-fit mb-4 bg-emerald-50 text-emerald-700 border-none rounded-full px-3 py-1 font-bold text-[10px] uppercase">
                      Job Finalized
                    </Badge>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {item.clientName}
                    </h3>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-2">
                      <Briefcase size={16} /> {item.jobTitle}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">
                      Completed On
                    </p>
                    <p className="font-bold text-slate-900">
                      {formatDate(item.completedAt)}
                    </p>
                  </div>

                  <div className="p-8 flex-1 space-y-8">
                    <div>
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                        Rate the Client Experience
                      </Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setFeedbackRatings((v) => ({
                                ...v,
                                [item.jobId]: i,
                              }))
                            }
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              size={32}
                              className={
                                i <= (feedbackRatings[item.jobId] || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                        Comments (Optional)
                      </Label>
                      <Textarea
                        className="min-h-[120px] bg-slate-50 border-none rounded-3xl p-6 text-lg"
                        placeholder="How was the client? (Clear instructions, communication, promptness...)"
                        value={feedbackComments[item.jobId] || ""}
                        onChange={(e) =>
                          setFeedbackComments((v) => ({
                            ...v,
                            [item.jobId]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => submitClientFeedback(item)}
                        disabled={submittingFeedback[item.jobId]}
                        className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all"
                      >
                        {submittingFeedback[item.jobId] ? (
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
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <CheckCircle2
                className="mx-auto text-emerald-400 mb-4"
                size={48}
              />
              <h3 className="text-xl font-bold text-slate-900">
                Excellent Work!
              </h3>
              <p className="text-slate-500 mt-2">
                You have completed all pending feedback for your clients.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
