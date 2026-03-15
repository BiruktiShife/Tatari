"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  BriefcaseBusiness,
  HandCoins,
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
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Provider = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  category: string;
  hourlyMin: number;
  hourlyMax: number;
  location: string;
  distance: number;
  verified: boolean;
  completedJobs: number;
  responseTime: string;
  badges: string[];
  description: string;
  availability: "Available Now" | "Available Today" | "Available Tomorrow";
};

type ProvidersResponse = {
  providers: Provider[];
  categories: string[];
  stats: {
    total: number;
    verified: number;
    avgRating: number;
    avgRate: number;
  };
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

export default function FindProvidersPage() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    avgRating: 0,
    avgRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filters, setFilters] = useState({
    verifiedOnly: true,
    availableNow: false,
    minRating: 0,
  });
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>([]);
  const [profileProvider, setProfileProvider] = useState<Provider | null>(null);
  const [contactProvider, setContactProvider] = useState<Provider | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedProviderIds");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedProviderIds(parsed.filter((id) => typeof id === "string"));
      }
    } catch {
      setSavedProviderIds([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedProviderIds", JSON.stringify(savedProviderIds));
  }, [savedProviderIds]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const query = new URLSearchParams();
        if (searchQuery.trim()) query.set("search", searchQuery.trim());
        if (selectedCategory !== "all") query.set("category", selectedCategory);
        query.set("minRate", String(priceRange[0]));
        query.set("maxRate", String(priceRange[1]));
        query.set("verifiedOnly", String(filters.verifiedOnly));
        query.set("availableNow", String(filters.availableNow));
        if (filters.minRating > 0) query.set("minRating", String(filters.minRating));
        query.set("sortBy", sortBy);

        const url = resolveApiUrl(`/auth/providers?${query.toString()}`);
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load providers");
        }

        const data: ProvidersResponse = await res.json();
        setProviders(Array.isArray(data.providers) ? data.providers : []);
        setCategories(
          Array.isArray(data.categories) && data.categories.length
            ? data.categories
            : ["all"],
        );
        setStats(
          data.stats || {
            total: 0,
            verified: 0,
            avgRating: 0,
            avgRate: 0,
          },
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load providers");
        setProviders([]);
        setCategories(["all"]);
        setStats({ total: 0, verified: 0, avgRating: 0, avgRate: 0 });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, sortBy, priceRange, filters]);

  const toggleSaveProvider = (provider: Provider) => {
    const alreadySaved = savedProviderIds.includes(provider.id);
    setSavedProviderIds((prev) =>
      alreadySaved ? prev.filter((id) => id !== provider.id) : [...prev, provider.id],
    );
    toast({
      title: alreadySaved ? "Removed from saved providers" : "Provider saved",
      description: alreadySaved
        ? `${provider.name} was removed from your saved list.`
        : `${provider.name} was added to your saved list.`,
    });
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
          <Sparkles className="h-4 w-4" />
          Trusted Marketplace
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Find Service Providers</h1>
            <p className="text-slate-200 mt-2">
              Compare verified professionals, pricing, ratings, and response speed.
            </p>
          </div>
          <Button asChild variant="secondary" className="text-slate-900">
            <Link href="/client/post-job">Post a Job</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Providers</p>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Verified Pros</p>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.verified}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Average Rating</p>
              <Star className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">{stats.avgRating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Avg Hourly Rate</p>
              <HandCoins className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-3xl font-semibold mt-1">₵ {stats.avgRate}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, category, skill, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[190px]">
                  <BriefcaseBusiness className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[190px]">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Hourly Rate</h3>
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
                    <span>₵ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Provider Filters</h3>
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
                      <CheckCircle size={14} className="text-emerald-600" />
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
                      <Clock size={14} className="text-blue-600" />
                      Available Now
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 3.5, 4.0, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={filters.minRating === rating ? "default" : "outline"}
                      className="w-full justify-start h-9"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating: rating,
                        }))
                      }
                    >
                      {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-gray-500">
                Loading providers...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : (
            providers.map((provider) => (
              <Card
                key={provider.id}
                className="border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-white text-xl font-bold">{provider.name.charAt(0)}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{provider.name}</h3>
                            {provider.badges.map((badge) => (
                              <Badge key={badge} variant="secondary">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-600 mt-1">{provider.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                              <span>
                                {provider.rating} ({provider.reviews} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {provider.location} | {provider.distance} km away
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BriefcaseBusiness className="h-4 w-4" />
                              <span>{provider.completedJobs} jobs completed</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:text-right">
                          <div className="text-2xl font-bold">
                            ₵ {provider.hourlyMin}-{provider.hourlyMax}
                          </div>
                          <div className="text-sm text-gray-500">per hour</div>
                          <div className="mt-2">
                            <Badge
                              variant="outline"
                              className={
                                provider.availability === "Available Now"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {provider.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{provider.responseTime} avg. response</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setProfileProvider(provider)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" onClick={() => setContactProvider(provider)}>
                            Contact Provider
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              savedProviderIds.includes(provider.id)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleSaveProvider(provider)}
                          >
                            {savedProviderIds.includes(provider.id) ? "Saved" : "Save"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {!loading && !error && providers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No providers match your current filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("rating");
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(profileProvider)}
        onOpenChange={(open) => !open && setProfileProvider(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{profileProvider?.name || "Provider Profile"}</DialogTitle>
            <DialogDescription>
              Detailed provider information from your current search results.
            </DialogDescription>
          </DialogHeader>
          {profileProvider && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>{" "}
                {profileProvider.category}
              </div>
              <div>
                <span className="text-gray-500">Hourly Rate:</span> ₵{" "}
                {profileProvider.hourlyMin}-{profileProvider.hourlyMax}
              </div>
              <div>
                <span className="text-gray-500">Rating:</span> {profileProvider.rating} (
                {profileProvider.reviews} reviews)
              </div>
              <div>
                <span className="text-gray-500">Location:</span>{" "}
                {profileProvider.location}
              </div>
              <div>
                <span className="text-gray-500">Completed Jobs:</span>{" "}
                {profileProvider.completedJobs}
              </div>
              <div>
                <span className="text-gray-500">Description:</span>{" "}
                {profileProvider.description}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (profileProvider) {
                  setContactProvider(profileProvider);
                }
                setProfileProvider(null);
              }}
            >
              Contact Provider
            </Button>
            <Button onClick={() => setProfileProvider(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(contactProvider)}
        onOpenChange={(open) => !open && setContactProvider(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Contact {contactProvider?.name || "Provider"}
            </DialogTitle>
            <DialogDescription>
              Start communication by opening messages for an existing job, or
              post a new job request for this provider.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild variant="outline">
              <Link href="/client/messages">Open Messages</Link>
            </Button>
            <Button asChild>
              <Link
                href={
                  contactProvider
                    ? `/client/post-job?preferredProviderId=${encodeURIComponent(
                        contactProvider.id,
                      )}&preferredProviderName=${encodeURIComponent(
                        contactProvider.name,
                      )}`
                    : "/client/post-job"
                }
              >
                Post Job for Provider
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
