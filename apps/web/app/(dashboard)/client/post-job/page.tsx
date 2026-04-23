"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

function PostJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const preferredProvider = useMemo(() => {
    const id = searchParams.get("preferredProviderId") || "";
    const name = searchParams.get("preferredProviderName") || "";
    return id ? { id, name } : null;
  }, [searchParams]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetType: "fixed" as "fixed" | "hourly",
    budgetAmount: "",
    timeline: "flexible" as "urgent" | "within_week" | "flexible",
    location: "Bole, Addis Ababa",
    address: "",
    photos: [] as File[],
  });

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Cleaning",
    "Appliance Repair",
    "Carpentry",
    "Construction",
    "Moving",
    "Furniture Assembly",
    "Graphic Design",
    "Web Development",
    "Tutoring",
    "Translation",
    "Data Entry",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      // Prefer an explicit environment variable. Falls back to development defaults.
      // In this repo the backend runs on 3003; many users were pointing to 3001 by mistake.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      let url = "";

      if (apiUrl) {
        try {
          new URL(apiUrl);
          url = `${apiUrl.replace(/\/$/, "")}/jobs`;
        } catch {
          // Not an absolute URL — allow leading-relative paths like "/api"
          if (apiUrl.startsWith("/")) {
            url = `${apiUrl.replace(/\/$/, "")}/jobs`;
          } else {
            toast({
              title: "Invalid API URL",
              description:
                "NEXT_PUBLIC_API_URL is not a valid URL. Check your environment configuration.",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        // Fallback to a reasonable dev default. we expect the frontend to run on 3000
        // and backend on 3003; using same-origin (3000) would cause CORS, so prefer
        // the hardcoded backend port when running locally.
        if (typeof window !== "undefined" && window.location) {
          const origin = window.location.origin;
          if (origin.includes("localhost")) {
            url = `http://localhost:3003/jobs`;
          } else {
            url = `${origin}/jobs`;
          }
        } else {
          url = `/jobs`;
        }
      }

      const body = new FormData();
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("description", formData.description);
      body.append(
        "budgetType",
        formData.budgetType === "fixed" ? "FIXED" : "HOURLY",
      );
      if (formData.budgetAmount)
        body.append("budgetAmount", String(formData.budgetAmount));
      body.append(
        "timeline",
        formData.timeline === "urgent"
          ? "URGENT"
          : formData.timeline === "within_week"
            ? "WITHIN_WEEK"
            : "FLEXIBLE",
      );
      body.append("location", formData.location);
      if (formData.address) body.append("address", formData.address);
      if (preferredProvider?.id) {
        body.append("preferredProviderId", preferredProvider.id);
      }

      // Attach photos (up to 5)
      formData.photos.slice(0, 5).forEach((file) => {
        body.append("photos", file);
      });

      // Try to get token from localStorage (adjust if you store auth differently)
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // If the user is not authenticated we can't post a job. prompt them.
      if (!token) {
        toast({
          title: "Not logged in",
          description: "Please sign in before posting a job.",
          variant: "destructive",
        });
        router.push("/auth/login?role=client");
        setIsSubmitting(false);
        return;
      }

      // In dev show a small toast with the final URL and token presence to help debug network/CORS issues
      if (process.env.NODE_ENV !== "production") {
        console.debug("Post job URL:", url);
        try {
          toast({
            title: "Sending request to API (dev)",
            description: `${url} — token ${token ? "present" : "missing"}`,
          });
        } catch {
          // ignore toast failures in edge cases
        }
      }

      const res = await fetch(url, {
        method: "POST",
        body,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({
          title: "Failed to post job",
          description: err?.message || "Server returned an error",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Job posted successfully!",
        description: "Providers will start sending quotes shortly.",
      });
      router.push("/client/jobs");
    } catch (error: unknown) {
      console.error("Post job error", error);
      // Provide more actionable feedback for network/URL/CORS failures
      const isNetworkError =
        error instanceof TypeError &&
        /failed to fetch/i.test(String(error.message));
      toast({
        title: isNetworkError ? "Network request failed" : "Failed to post job",
        description: isNetworkError
          ? "Could not reach the API. Check NEXT_PUBLIC_API_URL, server status, and CORS settings."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => {
      const next = [...prev.photos, ...files];
      if (next.length > 5) {
        toast({
          title: "Photo limit reached",
          description: "You can upload up to 5 photos per job.",
          variant: "destructive",
        });
      }
      return {
        ...prev,
        photos: next.slice(0, 5),
      };
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            Job request
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Post a New Job
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Describe what you need and get quotes from local professionals.
          </p>
          {preferredProvider && (
            <p className="text-sm font-medium text-emerald-700">
              This job will be sent to {preferredProvider.name || "your provider"}.
            </p>
          )}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Job Details</CardTitle>
            <CardDescription className="text-slate-600">
              Be specific to get accurate quotes from providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Fix leaking kitchen sink"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Service Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe exactly what you need. Include details like:
• What&apos;s broken or needs to be done
• Specific requirements
• Materials needed (if any)
• Any special considerations"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="resize-none border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                required
              />
              <p className="text-sm text-slate-500">
                The more details you provide, the better quotes you&apos;ll receive.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Budget & Timeline</CardTitle>
            <CardDescription className="text-slate-600">
              Set your budget and when you need the job done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Budget Type</Label>
              <RadioGroup
                value={formData.budgetType}
                onValueChange={(value: "fixed" | "hourly") =>
                  setFormData((prev) => ({ ...prev, budgetType: value }))
                }
                className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="font-normal">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <span>Fixed Price</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Hourly Rate</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">
                {formData.budgetType === "fixed"
                  ? "Budget Amount (ETB)"
                  : "Hourly Rate (ETB/hour)"}
              </Label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="budgetAmount"
                  type="number"
                  placeholder={formData.budgetType === "fixed" ? "e.g., 5000" : "e.g., 250"}
                  className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400"
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budgetAmount: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>How soon do you need this?</Label>
              <RadioGroup
                value={formData.timeline}
                onValueChange={(value: "urgent" | "within_week" | "flexible") =>
                  setFormData((prev) => ({ ...prev, timeline: value }))
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="font-normal">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-rose-500" />
                      <div>
                        <div className="font-medium text-slate-900">Urgent (Today/Tomorrow)</div>
                        <div className="text-sm text-slate-500">Need it done ASAP</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="within_week" id="within_week" />
                  <Label htmlFor="within_week" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-sky-500" />
                      <div>
                        <div className="font-medium text-slate-900">Within This Week</div>
                        <div className="text-sm text-slate-500">Flexible within 7 days</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-500" />
                      <div>
                        <div className="font-medium text-slate-900">Flexible</div>
                        <div className="text-sm text-slate-500">No specific deadline</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Location & Photos</CardTitle>
            <CardDescription className="text-slate-600">
              Help providers understand the job better.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
              >
                <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bole">Bole, Addis Ababa</SelectItem>
                  <SelectItem value="kasanchis">Kasanchis, Addis Ababa</SelectItem>
                  <SelectItem value="mexico">Mexico, Addis Ababa</SelectItem>
                  <SelectItem value="piassa">Piassa, Addis Ababa</SelectItem>
                  <SelectItem value="merkato">Merkato, Addis Ababa</SelectItem>
                  <SelectItem value="other">Other Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.location === "other" && (
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="photos">
                <div className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Photos (Optional)</span>
                </div>
              </Label>
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <div className="text-lg font-medium text-slate-700">
                    Click to upload photos
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Upload up to 5 photos of the problem area
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    onClick={(event) => {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-sm font-medium text-slate-900">
                    Selected Photos:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.map((file, index) => (
                      <div key={index} className="relative rounded-lg border border-slate-200 p-2">
                        <div className="w-32 truncate text-sm text-slate-700">{file.name}</div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              onClick={() => {
                toast({
                  title: "Saved as draft",
                  description: "You can continue editing later.",
                });
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
              {isSubmitting ? "Posting..." : "Post Job & Get Quotes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <PostJobContent />
    </Suspense>
  );
}
