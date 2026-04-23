"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  BriefcaseBusiness,
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

function FindProvidersContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
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
  const providerIdFromQuery = searchParams.get("providerId");

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
    if (!providerIdFromQuery) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const fetchProvider = async () => {
      try {
        const url = resolveApiUrl(`/auth/providers/${providerIdFromQuery}`);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const hourlyRate = Math.max(0, Number(data.hourlyRate || 0));
        const hourlyMin = Math.max(0, Math.round(hourlyRate * 0.85));
        const hourlyMax = Math.max(hourlyMin, Math.round(hourlyRate * 1.15));
        setProfileProvider({
          id: data.id,
          name: data.businessName || data.name || "Service Provider",
          rating: Number(data.rating || 0),
          reviews: Number(data.reviews || 0),
          category: data.serviceCategory || "General Services",
          hourlyMin,
          hourlyMax,
          location: data.location || "Not set",
          distance: 0,
          verified: data.verificationStatus === "VERIFIED",
          completedJobs: Number(data.completedJobs || 0),
          responseTime: data.responseTime || "Not set",
          badges: Array.isArray(data.badges) ? data.badges : [],
          description: data.bio || "Professional service provider on the platform.",
          availability: data.availability || "Available Tomorrow",
        });
      } catch {
        // ignore lookup errors for deep link
      }
    };

    fetchProvider();
  }, [providerIdFromQuery]);

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
        if (filters.minRating > 0)
          query.set("minRating", String(filters.minRating));
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
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load providers",
        );
        setProviders([]);
        setCategories(["all"]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, sortBy, priceRange, filters]);

  const toggleSaveProvider = (provider: Provider) => {
    const alreadySaved = savedProviderIds.includes(provider.id);
    setSavedProviderIds((prev) =>
      alreadySaved
        ? prev.filter((id) => id !== provider.id)
        : [...prev, provider.id],
    );
    toast({
      title: alreadySaved ? "Removed from saved providers" : "Provider saved",
      description: alreadySaved
        ? `${provider.name} was removed from your saved list.`
        : `${provider.name} was added to your saved list.`,
    });
  };

  return (
    <div className="space-y-6 text-slate-900">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              <Sparkles className="h-4 w-4" />
              Trusted Marketplace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Find Service Providers
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Compare verified professionals, pricing, ratings, and response speed.
            </p>
          </div>
          <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
            <Link href="/client/post-job">Post a Job</Link>
          </Button>
        </div>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, category, skill, or location..."
                className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[190px]">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
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
                <SelectTrigger className="w-full border-slate-300 bg-white text-slate-900 sm:w-[190px]">
                  <Filter className="mr-2 h-4 w-4" />
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

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Hourly Rate</h3>
                <div className="px-1">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={50}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>₵ {priceRange[0]}</span>
                    <span>₵ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Provider Filters</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({ ...prev, verifiedOnly: checked as boolean }))
                      }
                    />
                    <Label htmlFor="verified" className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                      <CheckCircle size={14} className="text-emerald-600" />
                      Verified Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={filters.availableNow}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({ ...prev, availableNow: checked as boolean }))
                      }
                    />
                    <Label htmlFor="available" className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                      <Clock size={14} className="text-sky-600" />
                      Available Now
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 3.5, 4.0, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={filters.minRating === rating ? "default" : "outline"}
                      className="h-9 w-full justify-start"
                      onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                    >
                      {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-3">
          {loading ? (
            <Card className="border-slate-200">
              <CardContent className="py-12 text-center text-sm text-slate-500">
                Loading providers...
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50/80">
              <CardContent className="py-12 text-center text-sm text-red-700">
                {error}
              </CardContent>
            </Card>
          ) : (
            providers.map((provider) => (
              <Card
                key={provider.id}
                className="border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-700">
                      <span className="text-xl font-bold text-white">
                        {provider.name.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {provider.name}
                            </h3>
                            {provider.badges.map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="border-slate-200 bg-slate-100 text-slate-700"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-1 text-slate-600">{provider.description}</p>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
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
                          <div className="text-2xl font-semibold text-slate-900">
                            ₵ {provider.hourlyMin}-{provider.hourlyMax}
                          </div>
                          <div className="text-sm text-slate-500">per hour</div>
                          <div className="mt-2">
                            <Badge
                              variant="outline"
                              className={
                                provider.availability === "Available Now"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-sky-200 bg-sky-50 text-sky-700"
                              }
                            >
                              {provider.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span>{provider.responseTime} avg. response</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => setProfileProvider(provider)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setContactProvider(provider)}>
                            Contact Provider
                          </Button>
                          <Button
                            size="sm"
                            variant={savedProviderIds.includes(provider.id) ? "default" : "outline"}
                            className={
                              savedProviderIds.includes(provider.id)
                                ? ""
                                : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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
            <Card className="border-slate-200">
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">
                  No providers match your current filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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

      <Dialog open={Boolean(profileProvider)} onOpenChange={(open) => !open && setProfileProvider(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>{profileProvider?.name || "Provider Profile"}</DialogTitle>
            <DialogDescription className="text-slate-600">
              Detailed provider information from your current search results.
            </DialogDescription>
          </DialogHeader>
          {profileProvider && (
            <div className="space-y-3 text-sm text-slate-700">
              <div><span className="text-slate-500">Category:</span> {profileProvider.category}</div>
              <div><span className="text-slate-500">Hourly Rate:</span> ₵ {profileProvider.hourlyMin}-{profileProvider.hourlyMax}</div>
              <div><span className="text-slate-500">Rating:</span> {profileProvider.rating} ({profileProvider.reviews} reviews)</div>
              <div><span className="text-slate-500">Location:</span> {profileProvider.location}</div>
              <div><span className="text-slate-500">Completed Jobs:</span> {profileProvider.completedJobs}</div>
              <div><span className="text-slate-500">Description:</span> {profileProvider.description}</div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              onClick={() => {
                if (profileProvider) setContactProvider(profileProvider);
                setProfileProvider(null);
              }}
            >
              Contact Provider
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setProfileProvider(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(contactProvider)} onOpenChange={(open) => !open && setContactProvider(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Contact {contactProvider?.name || "Provider"}</DialogTitle>
            <DialogDescription className="text-slate-600">
              Start communication by opening messages for an existing job, or post a new job request for this provider.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
              <Link href="/client/messages">Open Messages</Link>
            </Button>
            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
              <Link
                href={
                  contactProvider
                    ? `/client/post-job?preferredProviderId=${encodeURIComponent(contactProvider.id)}&preferredProviderName=${encodeURIComponent(contactProvider.name)}`
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

export default function FindProvidersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading providers...</div>}>
      <FindProvidersContent />
    </Suspense>
  );
}
