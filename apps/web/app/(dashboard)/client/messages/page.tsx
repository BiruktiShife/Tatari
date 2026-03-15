"use client";

import React, { useEffect, useMemo, useState } from "react";
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

export default function ClientMessagesPage() {
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
    if (!selected && conversations.length) {
      const first = conversations[0];
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
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-5 sm:p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
          <Sparkles className="h-4 w-4" />
          Client Communication
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
        <p className="text-slate-200 mt-1">
          Keep all provider conversations organized by job.
        </p>
      </div>

      <div className="h-[calc(100vh-280px)] min-h-[520px] flex border rounded-xl overflow-hidden bg-white">
        <aside className="w-full md:w-80 border-r bg-slate-50/60">
          <div className="p-3 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-355px)]">
            {loadingConversations ? (
              <div className="p-4 text-sm text-gray-500">Loading conversations...</div>
            ) : filteredConversations.length ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.key}
                  className={`w-full text-left p-3 border-b hover:bg-white transition-colors ${
                    selected?.jobId === conversation.jobId &&
                    selected?.otherUserId === conversation.otherUserId
                      ? "bg-white"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(conversation.otherUserName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">
                          {conversation.otherUserName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageAt)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {conversation.jobTitle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-500">No conversations yet</div>
            )}
          </div>
        </aside>

        <section className="flex-1 flex flex-col">
          {selected ? (
            <>
              <header className="p-4 border-b flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">
                      {getInitials(selected.otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{selected.otherUserName}</p>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
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
                    <DropdownMenuItem>View Job Details</DropdownMenuItem>
                    <DropdownMenuItem>View Provider Profile</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/40">
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
                            <p
                              className={`text-xs mt-1.5 flex items-center gap-1 ${
                                mine ? "text-blue-200" : "text-gray-500"
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
                  <Card>
                    <CardContent className="p-6 text-sm text-gray-500">
                      No messages yet in this conversation.
                    </CardContent>
                  </Card>
                )}
              </div>

              <footer className="p-3 border-t bg-white">
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
                      className="min-h-[54px] max-h-40 resize-y"
                    />
                  </div>
                  <Button onClick={sendMessage} disabled={!newMessage.trim() || sending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-1 grid place-items-center bg-slate-50/40">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <p className="font-medium">No conversation selected</p>
                  <p className="text-sm text-gray-500 mt-1">
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
