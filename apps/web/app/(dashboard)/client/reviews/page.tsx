"use client";

import React, { useState } from "react";
import {
  Star,
  Filter,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const reviews = [
  {
    id: "1",
    provider: "Samuel Plumbing",
    job: "Fix Kitchen Sink Leak",
    rating: 5,
    date: "2 days ago",
    review:
      "Samuel arrived on time and fixed the leak in 30 minutes. Very professional and cleaned up after himself. Highly recommend!",
    response: "Thank you for the kind words! Happy to help anytime.",
    helpful: 3,
    providerAvatar: "SP",
    status: "completed",
  },
  {
    id: "2",
    provider: "Dawit Painting",
    job: "Paint Living Room",
    rating: 4,
    date: "1 week ago",
    review:
      "Good quality work, but took longer than estimated. Clean job though and good attention to detail.",
    response: null,
    helpful: 1,
    providerAvatar: "DP",
    status: "completed",
  },
  {
    id: "3",
    provider: "Mike AC Repair",
    job: "AC Installation",
    rating: 5,
    date: "2 weeks ago",
    review:
      "Excellent service! Mike was knowledgeable, efficient, and explained everything clearly. The AC works perfectly.",
    response: "Glad you're happy with the installation! Stay cool!",
    helpful: 5,
    providerAvatar: "MA",
    status: "completed",
  },
];

const pendingReviews = [
  {
    id: "4",
    provider: "Home Clean Experts",
    job: "Deep Cleaning",
    rating: null,
    date: "Yesterday",
    providerAvatar: "HC",
    status: "completed",
  },
  {
    id: "5",
    provider: "Furniture Assembly Pro",
    job: "Bed Frame Assembly",
    rating: null,
    date: "3 days ago",
    providerAvatar: "FA",
    status: "completed",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("my-reviews");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [newReview, setNewReview] = useState({
    providerId: "",
    rating: 5,
    comment: "",
    recommend: true,
  });

  const filteredReviews =
    ratingFilter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(ratingFilter));

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-gray-600 mt-2">
          Share your experience and help others make informed decisions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{averageRating}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i <= Math.floor(parseFloat(averageRating))
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">Average rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{reviews.length}</div>
            <div className="text-sm text-gray-600">Reviews given</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <div className="text-sm text-gray-600">Pending reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-gray-600">Response rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="my-reviews">
            My Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Reviews ({pendingReviews.length})
          </TabsTrigger>
        </TabsList>

        {/* My Reviews Tab */}
        <TabsContent value="my-reviews" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
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
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">Export Reviews</Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card
                key={review.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Provider Info */}
                    <div className="lg:w-48">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {review.providerAvatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{review.provider}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {review.job}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i <= review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-semibold">
                            {review.rating}.0
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          {review.date}
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <p className="text-gray-700">{review.review}</p>

                        {review.response && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare
                                size={16}
                                className="text-blue-500"
                              />
                              <span className="font-semibold">
                                Provider's Response:
                              </span>
                            </div>
                            <p className="text-gray-600">{review.response}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="h-8">
                              <ThumbsUp size={16} className="mr-2" />
                              Helpful ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8">
                              Edit Review
                            </Button>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <Award size={12} className="mr-1" />
                            Verified Purchase
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Reviews */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No reviews found</div>
              <p className="text-gray-500">Try changing your filter criteria</p>
            </div>
          )}
        </TabsContent>

        {/* Pending Reviews Tab */}
        <TabsContent value="pending" className="space-y-6">
          <div className="space-y-6">
            {pendingReviews.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Job Info */}
                    <div className="lg:w-48">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-bold text-blue-600">
                            {job.providerAvatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{job.provider}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {job.job}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        Completed {job.date}
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Your Rating</Label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  setNewReview((prev) => ({
                                    ...prev,
                                    rating: i,
                                  }))
                                }
                                className="p-1"
                              >
                                <Star
                                  size={24}
                                  className={`${
                                    i <= newReview.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  } hover:text-yellow-400 hover:fill-yellow-400`}
                                />
                              </button>
                            ))}
                            <span className="ml-4 font-semibold">
                              {newReview.rating}.0
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="comment" className="mb-2 block">
                            Your Review
                          </Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your experience with this provider..."
                            rows={4}
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview((prev) => ({
                                ...prev,
                                comment: e.target.value,
                              }))
                            }
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Be specific about what you liked or didn't like.
                            Your review helps other clients.
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="recommend"
                                checked={newReview.recommend}
                                onChange={(e) =>
                                  setNewReview((prev) => ({
                                    ...prev,
                                    recommend: e.target.checked,
                                  }))
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label
                                htmlFor="recommend"
                                className="text-sm font-normal"
                              >
                                I recommend this provider
                              </Label>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline">Skip Review</Button>
                            <Button>Submit Review</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Caught Up */}
          {pendingReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-green-500 text-lg mb-2">
                <Award size={48} className="mx-auto mb-4" />
                All Caught Up!
              </div>
              <p className="text-gray-600 mb-6">
                You've reviewed all your completed jobs. Thank you for helping
                the community!
              </p>
              <Button variant="outline">View Your Review History</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-800 mb-4">
            Review Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="space-y-2">
              <div className="font-medium">Do:</div>
              <ul className="space-y-1">
                <li>✓ Be specific about your experience</li>
                <li>✓ Focus on the service quality</li>
                <li>✓ Mention timelines and communication</li>
                <li>✓ Keep it factual and honest</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Don't:</div>
              <ul className="space-y-1">
                <li>✗ Include personal information</li>
                <li>✗ Use offensive language</li>
                <li>✗ Make false claims</li>
                <li>✗ Review before job completion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
