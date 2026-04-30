"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Send, CheckCheck, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

type Conversation = {
  key: string;
  otherUserId: string;
  otherUserName: string;
  jobId: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageAt: string;
};

type MessageItem = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type SelectedConversation = {
  key: string;
  jobId: string;
  otherUserId?: string;
  otherUserName: string;
  jobTitle: string;
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

function ClientMessagesContent() {
  const searchParams = useSearchParams();
  const [myUserId, setMyUserId] = useState("");
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<SelectedConversation | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadConversations = async () => {
    if (!token) return;
    setLoadingConversations(true);
    try {
      const res = await fetch(resolveApiUrl("/messages/conversations"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setConversations([]);
        return;
      }
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id) setMyUserId(parsed.id);
      } catch {
        // ignore parse errors
      }
    }
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (!jobId || !conversations.length) return;

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
    const first = conversations[0];
    if (!selected && first) {
      setSelected({
        key: first.key,
        jobId: first.jobId,
        otherUserId: first.otherUserId,
        otherUserName: first.otherUserName,
        jobTitle: first.jobTitle,
      });
    }
  }, [conversations, selected]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.jobId, selected?.otherUserId]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      [c.otherUserName, c.jobTitle, c.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [conversations, search]);

  // const handleSelectConversation = (conv: Conversation) => {
  //   setSelected({
  //     jobId: conv.jobId,
  //     otherUserId: conv.otherUserId,
  //     otherUserName: conv.otherUserName,
  //     jobTitle: conv.jobTitle,
  //   });
  // };

  const sendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selected || !selected.otherUserId || !token) return;

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
      if (!res.ok) return;

      setNewMessage("");
      await loadMessages(selected);
      await loadConversations();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex h-[calc(100vh-180px)] min-h-[600px] rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200 overflow-hidden">
        {/* SIDEBAR: CONVERSATIONS */}
        <aside className="w-full md:w-96 border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
              Messages
            </h2>
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />
              <Input
                placeholder="Search chats..."
                className="h-12 pl-12 bg-white border-none rounded-2xl shadow-sm placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
            {loadingConversations ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Syncing Inbox
                </p>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.key}
                  onClick={() => setSelected(conv)}
                  className={`w-full p-4 rounded-3xl transition-all flex items-start gap-4 text-left border ${
                    selected?.key === conv.key
                      ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/50"
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
                    <p className="text-sm text-slate-500 truncate mb-2">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm italic font-medium">
                  No conversations found.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN: CHAT WINDOW */}
        <main className="flex-1 flex flex-col bg-white">
          {selected ? (
            <>
              {/* Chat Header */}
              <header className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl border-2 border-slate-100">
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
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight truncate max-w-[200px]">
                        Project: {selected.jobTitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-slate-100 text-slate-600 font-bold hidden md:flex"
                  >
                    <Link href={`/client/jobs/${selected.jobId}`}>
                      View Project
                    </Link>
                  </Button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
                {loadingMessages ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-slate-300" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const mine = msg.senderId === myUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] space-y-1`}>
                          <div
                            className={`px-5 py-3 rounded-3xl shadow-sm text-sm leading-relaxed ${
                              mine
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div
                            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${mine ? "justify-end text-slate-400" : "text-slate-400"}`}
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
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-50">
                    <MessageSquare size={64} />
                    <p className="font-bold uppercase tracking-[0.2em] text-xs">
                      No messages yet
                    </p>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <footer className="p-6 pt-2">
                <div className="bg-slate-50 rounded-[2rem] p-2 flex items-end gap-2 border border-slate-100 focus-within:border-indigo-200 transition-colors">
                  <Textarea
                    placeholder="Write a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="min-h-[50px] max-h-32 border-none bg-transparent focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 py-3 px-4 resize-none"
                  />
                  <Button
                    onClick={sendMessage}
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
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  Your Inbox
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Select a conversation from the sidebar to view project updates
                  and chat with professionals.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold text-slate-600"
                  asChild
                >
                  <Link href="/client/jobs">Manage Projects</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ClientMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <ClientMessagesContent />
    </Suspense>
  );
}
