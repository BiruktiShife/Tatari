"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const providers = [
  {
    id: "1",
    name: "Samuel Plumbing Co.",
    rating: 4.9,
    reviews: 247,
    category: "Plumbing",
    hourlyRate: "₵ 300-500",
    location: "Bole, Addis Ababa",
    distance: "2.3 km",
    verified: true,
    completedJobs: 189,
    responseTime: "15 min",
    badges: ["Top Rated", "Fast Responder"],
    description:
      "Expert plumber with 10+ years experience. Specialized in leaks, installations, and repairs.",
    availability: "Available Now",
  },
  {
    id: "2",
    name: "Dawit Electrical Services",
    rating: 4.8,
    reviews: 182,
    category: "Electrical",
    hourlyRate: "₵ 350-600",
    location: "Kasanchis, Addis",
    distance: "4.1 km",
    verified: true,
    completedJobs: 124,
    responseTime: "25 min",
    badges: ["Verified Pro"],
    description:
      "Certified electrician for residential and commercial projects. 24/7 emergency service.",
    availability: "Available Today",
  },
  {
    id: "3",
    name: "Marta Graphic Design",
    rating: 5.0,
    reviews: 89,
    category: "Digital Services",
    hourlyRate: "₵ 200-400",
    location: "Mexico, Addis",
    distance: "5.2 km",
    verified: true,
    completedJobs: 67,
    responseTime: "1 hour",
    badges: ["Top Rated"],
    description:
      "Professional graphic designer specializing in logos, branding, and social media content.",
    availability: "Available",
  },
  {
    id: "4",
    name: "Home Clean Experts",
    rating: 4.7,
    reviews: 156,
    category: "Cleaning",
    hourlyRate: "₵ 150-250",
    location: "Piassa, Addis",
    distance: "3.8 km",
    verified: true,
    completedJobs: 98,
    responseTime: "45 min",
    badges: [],
    description:
      "Deep cleaning, move-in/move-out cleaning, and regular maintenance.",
    availability: "Available Tomorrow",
  },
  {
    id: "5",
    name: "Mike AC Repair",
    rating: 4.6,
    reviews: 112,
    category: "Appliance Repair",
    hourlyRate: "₵ 400-700",
    location: "Bole, Addis",
    distance: "1.5 km",
    verified: false,
    completedJobs: 78,
    responseTime: "30 min",
    badges: [],
    description:
      "AC installation, repair, and maintenance. All brands supported.",
    availability: "Available Now",
  },
];

const categories = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Appliance Repair",
  "Carpentry",
  "Digital Services",
  "Tutoring",
];

export default function FindProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filters, setFilters] = useState({
    verifiedOnly: true,
    availableNow: false,
    minRating: 0,
  });

  const filteredProviders = providers.filter((provider) => {
    // Search filter
    if (
      searchQuery &&
      !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !provider.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      selectedCategory !== "All Categories" &&
      provider.category !== selectedCategory
    ) {
      return false;
    }

    // Verified filter
    if (filters.verifiedOnly && !provider.verified) {
      return false;
    }

    // Rating filter
    if (provider.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Find Service Providers</h1>
        <p className="text-gray-600 mt-2">
          Browse and connect with verified professionals in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategory === category}
                        onCheckedChange={() => setSelectedCategory(category)}
                      />
                      <Label
                        htmlFor={`cat-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="font-semibold">Hourly Rate (ETB)</h3>
                <div className="px-1">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={50}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₵ {priceRange[0]}</span>
                    <span>₵ {priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-3">
                <h3 className="font-semibold">Filters</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          verifiedOnly: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="verified"
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle size={14} className="text-green-500" />
                      Verified Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={filters.availableNow}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          availableNow: checked as boolean,
                        }))
                      }
                    />
                    <Label
                      htmlFor="available"
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <Clock size={14} className="text-blue-500" />
                      Available Now
                    </Label>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={filters.minRating === rating}
                        onCheckedChange={() =>
                          setFilters((prev) => ({ ...prev, minRating: rating }))
                        }
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`${
                                i < Math.floor(rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span>{rating}+</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Provider Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total in Area:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Response:</span>
                  <span className="font-medium">25 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-medium">4.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Hourly Rate:</span>
                  <span className="font-medium">₵ 320</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search providers by name, category, or skill..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <Card
                key={provider.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Provider Avatar */}
                    <div className="lg:w-24">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {provider.name.charAt(0)}
                        </span>
                      </div>
                      {provider.verified && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                          <CheckCircle size={12} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Provider Info */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">
                              {provider.name}
                            </h3>
                            {provider.badges.map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="bg-yellow-100 text-yellow-800"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-600 mt-1">
                            {provider.description}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Star
                                  size={16}
                                  className="text-yellow-500 fill-yellow-500"
                                />
                                <span className="font-semibold ml-1">
                                  {provider.rating}
                                </span>
                                <span className="text-gray-500 ml-1">
                                  ({provider.reviews} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} />
                              <span>
                                {provider.location} • {provider.distance} away
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Award size={16} />
                              <span>
                                {provider.completedJobs} jobs completed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:text-right">
                          <div className="text-2xl font-bold">
                            {provider.hourlyRate}
                          </div>
                          <div className="text-sm text-gray-500">per hour</div>
                          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                            <Clock size={14} />
                            <span>{provider.responseTime} avg. response</span>
                          </div>
                        </div>
                      </div>

                      {/* Availability & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              provider.availability === "Available Now"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {provider.availability}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {provider.category} Specialist
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button size="sm">Contact Provider</Button>
                          <Button variant="outline" size="sm">
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                No providers found
              </div>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setPriceRange([0, 1000]);
                  setFilters({
                    verifiedOnly: true,
                    availableNow: false,
                    minRating: 0,
                  });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
