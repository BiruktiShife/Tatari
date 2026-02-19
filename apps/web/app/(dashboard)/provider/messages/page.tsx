"use client";

import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  User,
  Clock,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const conversations = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Thanks for fixing the sink!",
    time: "10:30 AM",
    unread: 0,
    job: "Fix Kitchen Sink Leak",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Sarah Smith",
    lastMessage: "When can you start the painting?",
    time: "Yesterday",
    unread: 3,
    job: "Paint Living Room Walls",
    avatar: "SS",
  },
  {
    id: "3",
    name: "Mike Johnson",
    lastMessage: "I've sent the quote, please review",
    time: "2 days ago",
    unread: 0,
    job: "Electrical Wiring",
    avatar: "MJ",
  },
];

const messages = [
  {
    id: "1",
    sender: "client",
    text: "Hi Samuel, when can you start the painting job?",
    time: "10:00 AM",
  },
  {
    id: "2",
    sender: "me",
    text: "Hi Sarah! I can start tomorrow at 10 AM.",
    time: "10:05 AM",
  },
  {
    id: "3",
    sender: "client",
    text: "Perfect! What's your quote for the living room walls?",
    time: "10:10 AM",
  },
  {
    id: "4",
    sender: "me",
    text: "For a standard living room, it would be ₵ 1,200 including materials.",
    time: "10:15 AM",
  },
  {
    id: "5",
    sender: "client",
    text: "That sounds reasonable. Let's proceed!",
    time: "10:20 AM",
  },
];

export default function ProviderMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("2");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Send message logic
      setNewMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with your clients</p>
      </div>

      <div className="flex-1 flex border rounded-lg overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-80 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-300px)]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedConversation === conv.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {conv.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{conv.name}</div>
                      <div className="text-xs text-gray-500">{conv.time}</div>
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {conv.job}
                      </Badge>
                      {conv.unread > 0 && (
                        <Badge className="bg-blue-600 text-white">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-green-100 text-green-600">
                  SS
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Sarah Smith</div>
                <div className="text-sm text-gray-500">
                  Paint Living Room Walls • Online
                </div>
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
                  <DropdownMenuItem>View Job Details</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === "me"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        msg.sender === "me" ? "text-blue-200" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                      {msg.sender === "me" && (
                        <CheckCheck className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[60px] pr-12"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
