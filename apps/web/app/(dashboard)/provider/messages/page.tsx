"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  User,
  Send,
  MoreVertical,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

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

type JobDetail = {
  id: string;
  title: string;
  client?: { name?: string | null };
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

export default function ProviderMessagesPage() {
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
  const [conversationsError, setConversationsError] = useState<string | null>(
    null,
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadConversations = async () => {
    if (!token) return;
    setLoadingConversations(true);
    setConversationsError(null);
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
    } catch (err) {
      setConversations([]);
      setConversationsError(
        err instanceof Error ? err.message : "Failed to load conversations.",
      );
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
    if (!jobId) return;

    const existing = conversations.find((c) => c.jobId === jobId);
    if (existing) {
      setSelected({
        jobId: existing.jobId,
        otherUserId: existing.otherUserId,
        otherUserName: existing.otherUserName,
        jobTitle: existing.jobTitle,
      });
      return;
    }

    const loadJobForDraft = async () => {
      if (!token) return;
      try {
        const res = await fetch(resolveApiUrl(`/jobs/provider/${jobId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const job: JobDetail = await res.json();
        setSelected({
          jobId: job.id,
          otherUserName: job.client?.name || "Client",
          jobTitle: job.title || "Job",
        });
      } catch {
        // ignore
      }
    };
    loadJobForDraft();
  }, [conversations, searchParams, token]);

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
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
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
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-5 sm:p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
          <Sparkles className="h-4 w-4" />
          Client Communication
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
        <p className="text-slate-200 mt-1">
          Coordinate with clients and close job details faster.
        </p>
      </div>

      <div className="min-h-[520px] md:h-[calc(100vh-280px)] flex flex-col md:flex-row border rounded-xl overflow-hidden bg-white">
        <aside className="w-full md:w-80 md:border-r border-b md:border-b-0 bg-slate-50/60">
          <div className="p-3 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto md:h-[calc(100vh-355px)] max-h-[320px] md:max-h-none">
            {loadingConversations ? (
              <div className="p-4 text-sm text-gray-500">
                Loading conversations...
              </div>
            ) : conversationsError ? (
              <div className="p-4 text-sm text-red-600">
                {conversationsError}
              </div>
            ) : filteredConversations.length ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.key}
                  className={`w-full text-left p-3 border-b hover:bg-white transition-colors ${
                    selected?.jobId === conv.jobId &&
                    selected?.otherUserId === conv.otherUserId
                      ? "bg-white"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(conv.otherUserName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">{conv.otherUserName}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(conv.lastMessageAt)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {conv.jobTitle}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500">No conversations yet</div>
            )}
          </div>
        </aside>

        <section className="flex-1 flex flex-col min-h-[360px]">
          {selected ? (
            <>
              <header className="p-4 border-b flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {getInitials(selected.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{selected.otherUserName}</div>
                    <div className="text-sm text-gray-500 truncate">{selected.jobTitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/provider/jobs/${selected.jobId}`}>View Job Details</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/40">
                {loadingMessages ? (
                  <div className="text-sm text-gray-500">Loading messages...</div>
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
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white text-gray-900 border rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div
                              className={`text-xs mt-1.5 flex items-center gap-1 ${
                                mine ? "text-blue-200" : "text-gray-500"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                              {mine && <CheckCheck className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-sm text-gray-500">
                      No messages yet. Start the conversation.
                    </CardContent>
                  </Card>
                )}
              </div>

              <footer className="p-3 border-t bg-white">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[54px] max-h-40 resize-y"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 grid place-items-center bg-slate-50/40">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <p className="font-medium">Select a conversation</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a client thread from the left to start messaging.
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
