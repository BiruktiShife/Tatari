"use client";

import React, { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Image,
  MoreVertical,
  CheckCheck,
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

// Define types
interface Message {
  id: string;
  sender: "provider" | "you";
  text: string;
  timestamp: string;
}

interface Provider {
  name: string;
  avatar: string;
  job: string;
  status: "active" | "completed";
}

interface Conversation {
  id: string;
  provider: Provider;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: "1",
    provider: {
      name: "Samuel Plumbing",
      avatar: "SP",
      job: "Fix Kitchen Sink",
      status: "active",
    },
    lastMessage: "I can come tomorrow at 10 AM. Does that work for you?",
    timestamp: "10:30 AM",
    unread: 2,
    messages: [
      {
        id: "1",
        sender: "provider",
        text: "Hi John, I saw your job posting. I can fix your sink.",
        timestamp: "Yesterday, 2:30 PM",
      },
      {
        id: "2",
        sender: "you",
        text: "Great! When are you available?",
        timestamp: "Yesterday, 2:45 PM",
      },
      {
        id: "3",
        sender: "provider",
        text: "I can come tomorrow at 10 AM. Does that work for you?",
        timestamp: "Today, 10:30 AM",
      },
    ],
  },
  {
    id: "2",
    provider: {
      name: "Dawit Painting",
      avatar: "DP",
      job: "Paint Living Room",
      status: "completed",
    },
    lastMessage: "The paint has dried completely. You can move furniture back.",
    timestamp: "2 days ago",
    unread: 0,
    messages: [
      {
        id: "1",
        sender: "provider",
        text: "Paint job completed successfully.",
        timestamp: "2 days ago",
      },
    ],
  },
  {
    id: "3",
    provider: {
      name: "Marta Graphic Design",
      avatar: "MG",
      job: "Logo Design",
      status: "active",
    },
    lastMessage: "Here are the logo concepts I promised.",
    timestamp: "1 week ago",
    unread: 0,
    messages: [],
  },
];

// Type-safe function to get default conversation
const getDefaultConversation = (): Conversation => {
  return initialConversations[0]; // We know this exists
};

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    getDefaultConversation().id
  );
  const [message, setMessage] = useState("");

  // Get active conversation with type-safe fallback
  const getActiveConversation = (): Conversation => {
    const found = conversations.find((c) => c.id === activeConversationId);
    // TypeScript now knows this always returns a Conversation
    return found || getDefaultConversation();
  };

  const activeConversation = getActiveConversation();

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "you",
      text: message,
      timestamp: "Just now",
    };

    // Update conversations state
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: message,
            timestamp: "Just now",
            unread: 0,
          };
        }
        return conv;
      })
    );

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600 mt-2">
          Communicate with your service providers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-250px)]">
            <CardContent className="p-0">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="overflow-y-auto h-[calc(100vh-350px)]">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                      activeConversationId === conversation.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setActiveConversationId(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {conversation.provider.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold truncate">
                            {conversation.provider.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {conversation.provider.job}
                          </Badge>
                          <Badge
                            variant={
                              conversation.provider.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {conversation.provider.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-2">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 bg-blue-600">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window - Now safe to access activeConversation properties */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-250px)]">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {activeConversation.provider.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {activeConversation.provider.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeConversation.provider.job}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      activeConversation.provider.status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {activeConversation.provider.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Job Details</DropdownMenuItem>
                      <DropdownMenuItem>View Provider Profile</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Block Provider
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === "you"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-xs mt-2 flex items-center gap-1 ${
                          msg.sender === "you"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp}
                        {msg.sender === "you" && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="icon">
                          <Paperclip size={18} />
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                          <Image size={18} />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        Press Enter to send, Shift+Enter for new line
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="h-12"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">15 min</div>
            <div className="text-sm text-gray-600">Avg. response time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-gray-600">Platform support</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">Secure</div>
            <div className="text-sm text-gray-600">End-to-end encrypted</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
