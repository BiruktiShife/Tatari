"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  MoreVertical,
  CheckCheck,
  Sparkles,
  BriefcaseBusiness,
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

  const handleSelectConversation = (conv: Conversation) => {
    setSelected({
      jobId: conv.jobId,
      otherUserId: conv.otherUserId,
      otherUserName: conv.otherUserName,
      jobTitle: conv.jobTitle,
    });
  };

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
    <div className="space-y-5">
      <div className="min-h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:h-[calc(100vh-280px)] md:flex">
        <aside className="w-full border-b border-slate-200 bg-slate-50/60 md:w-80 md:border-b-0 md:border-r">
          <div className="border-b border-slate-200 bg-white p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto md:h-[calc(100vh-355px)] md:max-h-none">
            {loadingConversations ? (
              <div className="p-4 text-sm text-slate-500">
                Loading conversations...
              </div>
            ) : filteredConversations.length ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.key}
                  className={`w-full border-b border-slate-200 p-3 text-left transition-colors hover:bg-white ${
                    selected?.jobId === conversation.jobId &&
                    selected?.otherUserId === conversation.otherUserId
                      ? "bg-white"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        {getInitials(conversation.otherUserName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium text-slate-900">
                          {conversation.otherUserName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatTime(conversation.lastMessageAt)}
                        </p>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {conversation.lastMessage}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-xs text-slate-700"
                        >
                          {conversation.jobTitle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-sm text-slate-500">
                No conversations yet
              </div>
            )}
          </div>
        </aside>

        <section className="flex min-h-[360px] flex-1 flex-col">
          {selected ? (
            <>
              <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {getInitials(selected.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {selected.otherUserName}
                    </p>
                    <p className="flex items-center gap-1 truncate text-sm text-slate-500">
                      <BriefcaseBusiness className="h-3.5 w-3.5" />
                      {selected.jobTitle}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/client/jobs/${selected.jobId}`}>
                        View Job Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          selected.otherUserId
                            ? `/client/providers?providerId=${encodeURIComponent(
                                selected.otherUserId,
                              )}`
                            : "/client/providers"
                        }
                      >
                        View Provider Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              <div className="flex-1 overflow-y-auto bg-slate-50/40 p-4">
                {loadingMessages ? (
                  <div className="text-sm text-slate-500">
                    Loading messages...
                  </div>
                ) : messages.length ? (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const mine = msg.senderId === myUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
                              mine
                                ? "rounded-br-sm bg-slate-900 text-white"
                                : "rounded-bl-sm border border-slate-200 bg-white text-slate-900"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                            <p
                              className={`text-xs mt-1.5 flex items-center gap-1 ${
                                mine ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                              {mine && <CheckCheck className="h-3 w-3" />}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-slate-200">
                    <CardContent className="p-6 text-sm text-slate-500">
                      No messages yet in this conversation.
                    </CardContent>
                  </Card>
                )}
              </div>

              <footer className="border-t border-slate-200 bg-white p-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="min-h-[54px] max-h-40 resize-y border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="grid flex-1 place-items-center bg-slate-50/40">
              <Card className="w-full max-w-md border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <p className="font-medium text-slate-900">
                    No conversation selected
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Open a job conversation to start messaging providers.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ClientMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-slate-500">Loading messages...</div>
      }
    >
      <ClientMessagesContent />
    </Suspense>
  );
}
