"use client";

import React, { useState } from "react";
import {
  Filter,
  Search,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const reviews = [
  {
    id: "1",
    client: "John Doe",
    job: "Fix Kitchen Sink Leak",
    rating: 5,
    date: "Mar 15, 2024",
    comment:
      "Excellent work! Samuel arrived on time and fixed the leak quickly. Very professional.",
    helpful: 3,
    clientAvatar: "JD",
  },
  {
    id: "2",
    client: "Emma Wilson",
    job: "AC Installation",
    rating: 5,
    date: "Mar 10, 2024",
    comment:
      "Perfect installation. Clean work and explained everything clearly. Highly recommended!",
    helpful: 5,
    clientAvatar: "EW",
  },
  {
    id: "3",
    client: "Mike Johnson",
    job: "Monthly Maintenance",
    rating: 4,
    date: "Mar 5, 2024",
    comment:
      "Good service, slightly delayed but good quality work. Would hire again.",
    helpful: 1,
    clientAvatar: "MJ",
  },
];

const ratingDistribution = [
  { stars: 5, count: 38, percentage: 90 },
  { stars: 4, count: 3, percentage: 7 },
  { stars: 3, count: 1, percentage: 2 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 },
];

export default function ProviderReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-gray-600 mt-2">
            See what clients are saying about your work
          </p>
        </div>
        <Button variant="outline">
          <Award className="h-4 w-4 mr-2" />
          Share Reviews
        </Button>
      </div>

      {/* Overall Rating */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Overall Stats */}
            <div className="text-center lg:text-left">
              <div className="text-5xl font-bold">4.9</div>
              <div className="flex items-center justify-center lg:justify-start gap-1 mt-2">
                {"★".repeat(5)}
                <span className="text-gray-500">(42 reviews)</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Based on 42 completed jobs
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="w-12 text-sm">{rating.stars} ★</div>
                  <Progress value={rating.percentage} className="flex-1 h-2" />
                  <div className="w-12 text-sm text-gray-600">
                    {rating.count}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold">96%</div>
                <div className="text-sm text-gray-600">Would recommend</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-gray-600">On-time arrival</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search reviews by client or job..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars Only</SelectItem>
              <SelectItem value="4">4 Stars & Above</SelectItem>
              <SelectItem value="3">3 Stars & Above</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Reviews (42)</TabsTrigger>
          <TabsTrigger value="replied">Replied (12)</TabsTrigger>
          <TabsTrigger value="unreplied">Unreplied (30)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const [hasReplied, setHasReplied] = useState(false);
  const [reply, setReply] = useState("");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Client Info */}
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {review.clientAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{review.client}</div>
              <div className="text-sm text-gray-500">{review.job}</div>
              <div className="text-sm text-gray-500">{review.date}</div>
            </div>
          </div>

          {/* Review Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <Badge variant="outline">{review.rating}.0</Badge>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHasReplied(!hasReplied)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {hasReplied ? "Hide Reply" : "Reply to Review"}
              </Button>
            </div>

            {/* Reply Section */}
            {hasReplied && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Your Reply</div>
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  rows={3}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Thank the client for their review..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHasReplied(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm">Post Reply</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
