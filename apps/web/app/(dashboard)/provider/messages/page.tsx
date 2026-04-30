"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  MoreHorizontal,
  CheckCheck,
  Briefcase,
  ChevronLeft,
  Loader2,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Logic helpers
function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type SelectedConversation = {
  key: string; // Required for active state tracking
  jobId: string;
  otherUserId?: string;
  otherUserName: string;
  jobTitle: string;
};

function ProviderMessagesContent() {
  const searchParams = useSearchParams();
  const [myUserId, setMyUserId] = useState("");
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<SelectedConversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch(resolveApiUrl("/messages/conversations"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (target: SelectedConversation) => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const query = target.otherUserId
        ? `?otherUserId=${encodeURIComponent(target.otherUserId)}`
        : "";
      const res = await fetch(
        resolveApiUrl(`/messages/job/${target.jobId}${query}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.id) setMyUserId(parsed.id);
    }
    loadConversations();
  }, []);

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (!jobId) return;

    const existing = conversations.find((c) => c.jobId === jobId);
    if (existing) {
      setSelected({
        key: existing.key,
        jobId: existing.jobId,
        otherUserId: existing.otherUserId,
        otherUserName: existing.otherUserName,
        jobTitle: existing.jobTitle,
      });
    }
  }, [conversations, searchParams]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected);
  }, [selected?.jobId, selected?.otherUserId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      [c.otherUserName, c.jobTitle].some((v) =>
        v.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [conversations, search]);

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selected || !token) return;
    setSending(true);
    try {
      const res = await fetch(resolveApiUrl("/messages"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selected.jobId,
          receiverId: selected.otherUserId,
          content,
        }),
      });
      if (res.ok) {
        setNewMessage("");
        await loadMessages(selected);
        await loadConversations();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* 1. Page Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[80px]" />
        <div className="relative z-10 space-y-2">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-3 font-bold text-[10px] uppercase tracking-widest">
            Workspace
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Lead Communication
          </h1>
          <p className="text-slate-400">
            Coordinate with clients and finalize project details.
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-280px)] min-h-[600px] rounded-[2.5rem] border border-slate-100 bg-white shadow-xl overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-full md:w-96 border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-6">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />
              <Input
                placeholder="Search clients or projects..."
                className="h-12 pl-12 bg-white border-none rounded-2xl shadow-sm text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
            {loadingConversations ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Loading Chats
                </p>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.key}
                  onClick={() => setSelected({ ...conv })}
                  className={`w-full p-4 rounded-3xl transition-all flex items-start gap-4 text-left border ${
                    selected?.key === conv.key
                      ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/30"
                      : "border-transparent hover:bg-white hover:shadow-md"
                  }`}
                >
                  <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">
                      {getInitials(conv.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-900 truncate">
                        {conv.otherUserName}
                      </p>
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate mb-2 leading-tight">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm italic">
                  No active threads.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* CHAT MAIN */}
        <main className="flex-1 flex flex-col bg-white relative">
          {selected ? (
            <>
              {/* Header */}
              <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl border-2 border-indigo-50">
                    <AvatarFallback className="bg-slate-950 text-white font-bold">
                      {getInitials(selected.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1">
                      {selected.otherUserName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                        Client • {selected.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-slate-100 text-slate-600 font-bold"
                  >
                    <Link href={`/provider/jobs/${selected.jobId}`}>
                      Project Details
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreHorizontal size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl p-2 border-slate-100 shadow-xl"
                    >
                      <DropdownMenuItem className="rounded-xl font-bold gap-2 text-rose-600">
                        <AlertCircle size={16} /> Report Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
                {loadingMessages ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-slate-200" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const mine = msg.senderId === myUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[70%] space-y-1">
                          <div
                            className={`px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-sm ${
                              mine
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div
                            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${mine ? "justify-end" : ""}`}
                          >
                            {formatTime(msg.createdAt)}
                            {mine && (
                              <CheckCheck
                                size={14}
                                className="text-emerald-500"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-40">
                    <MessageSquare size={48} />
                    <p className="font-black uppercase tracking-[0.2em] text-[10px]">
                      Start the conversation
                    </p>
                  </div>
                )}
              </div>

              {/* Input */}
              <footer className="p-6 pt-2 bg-white">
                <div className="bg-slate-50 rounded-[2rem] p-2 flex items-end gap-2 border border-slate-100 focus-within:border-indigo-200 transition-all">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[50px] max-h-32 border-none bg-transparent focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 py-3 px-4 resize-none text-base"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 shrink-0 mb-1 mr-1"
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/10">
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 text-center max-w-sm">
                <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Zap size={32} className="fill-indigo-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  Provider Inbox
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
                  Select a client message to coordinate project delivery and
                  milestones.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold text-slate-600"
                  asChild
                >
                  <Link href="/provider/jobs">Find More Work</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProviderMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <ProviderMessagesContent />
    </Suspense>
  );
}
