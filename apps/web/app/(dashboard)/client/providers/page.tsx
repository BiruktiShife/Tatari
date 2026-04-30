"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Star,
  MapPin,
  Clock,
  MessageSquare,
  Heart,
  CheckCircle2,
  Loader2,
  Zap,
  ShieldCheck,
  Briefcase,
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [, setError] = useState("");

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
          description:
            data.bio || "Professional service provider on the platform.",
          availability: data.availability || "Available Tomorrow",
        });
      } catch {
        // ignore lookup errors for deep link
      }
    };

    fetchProvider();
  }, [providerIdFromQuery]);
  // Place this inside FindProvidersContent, above the return statement
  const toggleSave = (p: Provider) => {
    const isSaved = savedProviderIds.includes(p.id);

    setSavedProviderIds((prev) =>
      isSaved ? prev.filter((id) => id !== p.id) : [...prev, p.id],
    );

    toast({
      title: isSaved ? "Removed from saved" : "Provider saved",
      description: isSaved
        ? `${p.name} was removed from your list.`
        : `${p.name} was added to your list.`,
      variant: isSaved ? "default" : ("success" as any), // Using 'as any' to avoid strict variant types if needed
    });
  };
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

  // const toggleSaveProvider = (provider: Provider) => {
  //   const alreadySaved = savedProviderIds.includes(provider.id);
  //   setSavedProviderIds((prev) =>
  //     alreadySaved
  //       ? prev.filter((id) => id !== provider.id)
  //       : [...prev, provider.id],
  //   );
  //   toast({
  //     title: alreadySaved ? "Removed from saved providers" : "Provider saved",
  //     description: alreadySaved
  //       ? `${provider.name} was removed from your saved list.`
  //       : `${provider.name} was added to your saved list.`,
  //   });
  // };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <Zap size={14} className="fill-indigo-400" />
              Verified Professionals
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Find an Expert
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Connect with top-rated service providers. Verified by Tatari for
              quality and reliability.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-black text-indigo-400">850+</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                Active Pros
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-black text-emerald-400">4.9/5</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                Avg. Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Global Search Bar */}
      <div className="relative -mt-14 z-20 px-4 md:px-12">
        <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              className="h-14 pl-12 border-none focus-visible:ring-0 text-lg"
              placeholder="What service do you need today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:block w-px h-10 bg-slate-100 my-auto" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-14 md:w-[220px] border-none focus:ring-0 font-bold text-slate-700 capitalize">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Services" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-bold shadow-lg shadow-indigo-100">
            Find Pro
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-2">
        {/* 3. Filter Sidebar (Sticky) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Advanced Filters</h3>
                <button
                  onClick={() => {}}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Reset
                </button>
              </div>
              <CardContent className="p-6 space-y-8">
                {/* Hourly Rate */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Budget (ETB/hr)
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={50}
                    className="py-4"
                  />
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>₵{priceRange[0]}</span>
                    <span>₵{priceRange[1]}</span>
                  </div>
                </div>

                {/* Status Filters */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Availability & Trust
                  </Label>
                  <div className="space-y-3">
                    {[
                      {
                        id: "verified",
                        label: "Verified Experts",
                        icon: ShieldCheck,
                        color: "text-indigo-600",
                        state: filters.verifiedOnly,
                      },
                      {
                        id: "available",
                        label: "Available Now",
                        icon: Clock,
                        color: "text-emerald-500",
                        state: filters.availableNow,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between group cursor-pointer"
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            [item.id === "verified"
                              ? "verifiedOnly"
                              : "availableNow"]: !item.state,
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={item.color} />
                          <span className="text-sm font-bold text-slate-600">
                            {item.label}
                          </span>
                        </div>
                        <Checkbox checked={item.state} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Minimum Rating
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[4.5, 4.0, 3.5, 0].map((r) => (
                      <Button
                        key={r}
                        variant={
                          filters.minRating === r ? "default" : "outline"
                        }
                        className={`h-10 rounded-xl font-bold text-xs ${filters.minRating === r ? "bg-indigo-600" : "border-slate-100 text-slate-500"}`}
                        onClick={() =>
                          setFilters((p) => ({ ...p, minRating: r }))
                        }
                      >
                        {r === 0 ? "All" : `${r}+ Stars`}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* 4. Provider Results List */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 font-medium">
              Found{" "}
              <span className="text-slate-900 font-bold">
                {providers.length}
              </span>{" "}
              professionals
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] border-none bg-transparent font-bold text-indigo-600 focus:ring-0">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Lowest Rate</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={40} />
              <p className="text-slate-400 font-bold italic">
                Finding the best experts...
              </p>
            </div>
          ) : providers.length > 0 ? (
            providers.map((p) => (
              <Card
                key={p.id}
                className="group rounded-[2.5rem] border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300"
              >
                <CardContent className="p-8 flex flex-col lg:flex-row gap-8">
                  {/* Avatar Block */}
                  <div className="relative shrink-0 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-100">
                      {p.name.charAt(0)}
                    </div>
                    {p.verified && (
                      <div className="absolute -bottom-2 bg-white rounded-full p-1 shadow-md">
                        <CheckCircle2 className="text-indigo-600" size={24} />
                      </div>
                    )}
                    <button
                      onClick={() => toggleSave(p)}
                      className={`mt-6 h-10 w-10 rounded-xl flex items-center justify-center border transition-all ${savedProviderIds.includes(p.id) ? "bg-rose-50 border-rose-100 text-rose-500 shadow-sm" : "border-slate-100 text-slate-300 hover:text-rose-400"}`}
                    >
                      <Heart
                        size={20}
                        className={
                          savedProviderIds.includes(p.id) ? "fill-rose-500" : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Info Block */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 font-bold text-sm">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={16} className="fill-amber-500" />{" "}
                            {p.rating}
                          </div>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">
                            {p.reviews} Reviews
                          </span>
                          <span className="text-slate-300">•</span>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 border-none capitalize"
                          >
                            {p.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-3xl font-black text-slate-900">
                          ₵{p.hourlyMin}
                          <span className="text-sm text-slate-400">/hr</span>
                        </div>
                        <Badge className="mt-1 bg-emerald-50 text-emerald-700 border-none rounded-full px-3">
                          {p.availability}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-slate-500 leading-relaxed italic line-clamp-2">
                      {p.description ||
                        "Top-rated professional with 5+ years experience in the field. Satisfaction guaranteed."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <MapPin size={16} className="text-slate-400" />{" "}
                        {p.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Briefcase size={16} className="text-slate-400" />{" "}
                        {p.completedJobs} Jobs Done
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Clock size={16} className="text-slate-400" />{" "}
                        {p.responseTime}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button
                        className="bg-slate-900 hover:bg-slate-800 h-12 px-8 rounded-xl font-bold text-white shadow-xl shadow-slate-100"
                        onClick={() => setContactProvider(p)}
                      >
                        Contact Expert
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                        onClick={() => setProfileProvider(p)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <Search className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-xl font-bold text-slate-900">
                No experts found
              </h3>
              <p className="text-slate-500 mt-2">
                Try adjusting your filters or searching for something else.
              </p>
              <Button
                variant="link"
                className="text-indigo-600 mt-4 font-bold"
                onClick={() => setSearchQuery("")}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* 5. Modern Dialogs (Keep original logic) */}
      <Dialog
        open={Boolean(profileProvider)}
        onOpenChange={() => setProfileProvider(null)}
      >
        <DialogContent className="rounded-[2.5rem] border-none p-10 max-w-2xl">
          {profileProvider && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-2xl font-black text-white">
                  {profileProvider.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">
                    {profileProvider.name}
                  </h2>
                  <p className="text-indigo-600 font-bold">
                    {profileProvider.category}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl">
                <div>
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Rate
                  </div>
                  <div className="font-bold">
                    ₵{profileProvider.hourlyMin}-{profileProvider.hourlyMax}/hr
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    Jobs
                  </div>
                  <div className="font-bold">
                    {profileProvider.completedJobs} Completed
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                {profileProvider.description}
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 h-14 rounded-2xl bg-indigo-600 font-bold shadow-xl shadow-indigo-100"
                  onClick={() => {
                    setContactProvider(profileProvider);
                    setProfileProvider(null);
                  }}
                >
                  Message Provider
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-2xl border-slate-200 font-bold px-8"
                  onClick={() => setProfileProvider(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(contactProvider)}
        onOpenChange={() => setContactProvider(null)}
      >
        <DialogContent className="rounded-[2.5rem] border-none p-10 text-center">
          <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Message {contactProvider?.name}
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Select how you&apos;d like to reach out to this professional.
          </p>
          <div className="flex flex-col gap-4">
            <Button
              className="h-14 rounded-2xl bg-slate-900 font-bold text-lg"
              asChild
            >
              <Link href="/client/messages">Open Inbox</Link>
            </Button>
            <Button
              className="h-14 rounded-2xl bg-indigo-600 font-bold text-lg shadow-xl shadow-indigo-100"
              asChild
            >
              <Link
                href={`/client/post-job?preferredProviderId=${contactProvider?.id}&preferredProviderName=${contactProvider?.name}`}
              >
                Post Project to {contactProvider?.name.split(" ")[0]}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="h-14 rounded-2xl font-bold text-slate-400"
              onClick={() => setContactProvider(null)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FindProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <FindProvidersContent />
    </Suspense>
  );
}
