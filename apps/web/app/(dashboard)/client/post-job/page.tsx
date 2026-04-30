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
  Zap,
  ArrowLeft,
  Loader2,
  X,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

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
    location: "bole",
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
    "Graphic Design",
    "Web Development",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Missing info",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?role=client");
      return;
    }

    try {
      const url = resolveApiUrl("/jobs");
      const body = new FormData();
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("description", formData.description);
      body.append("budgetType", formData.budgetType.toUpperCase());
      if (formData.budgetAmount)
        body.append("budgetAmount", String(formData.budgetAmount));
      body.append("timeline", formData.timeline.toUpperCase());
      body.append("location", formData.location);
      if (formData.address) body.append("address", formData.address);
      if (preferredProvider?.id)
        body.append("preferredProviderId", preferredProvider.id);
      formData.photos.forEach((file) => body.append("photos", file));

      const res = await fetch(url, {
        method: "POST",
        body,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to post job");

      toast({
        title: "Job Posted!",
        description: "Professionals will now start sending quotes.",
      });
      router.push("/client/jobs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 5),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Create a New Project
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Describe what you need and get quotes within minutes.
          </p>
        </div>
        {preferredProvider && (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 px-4 py-2 border-emerald-100 rounded-xl gap-2 h-fit">
            <CheckCircle2 size={16} /> Sending to {preferredProvider.name}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Core Details */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Project Details
            </h2>
          </div>

          <div className="grid gap-8">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold ml-1">
                Project Title
              </Label>
              <Input
                placeholder="e.g. Install kitchen sink and faucet"
                className="h-14 bg-slate-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-indigo-500/20"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Category
                </Label>
                <Select
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, category: v }))
                  }
                >
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {serviceCategories.map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold ml-1">
                  Location
                </Label>
                <Select
                  defaultValue="bole"
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, location: v }))
                  }
                >
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="bole">Bole, Addis Ababa</SelectItem>
                    <SelectItem value="kasanchis">
                      Kasanchis, Addis Ababa
                    </SelectItem>
                    <SelectItem value="mexico">Mexico, Addis Ababa</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-bold ml-1">
                Description
              </Label>
              <Textarea
                placeholder="Be as detailed as possible. Include requirements, materials needed, and the specific problem..."
                className="min-h-[180px] bg-slate-50 border-none rounded-3xl p-6 text-lg focus:ring-2 focus:ring-indigo-500/20"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Budget & Time */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Budget & Timeline
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Budget Selection */}
            <div className="space-y-4">
              <Label className="text-slate-700 font-bold ml-1">
                Budget Type
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "fixed", label: "Fixed Price", icon: DollarSign },
                  { id: "hourly", label: "Hourly Rate", icon: Clock },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, budgetType: btn.id as any }))
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2
                                ${formData.budgetType === btn.id ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"}`}
                  >
                    <btn.icon size={20} />
                    <span className="font-bold text-sm">{btn.label}</span>
                  </button>
                ))}
              </div>
              <div className="relative mt-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ETB
                </span>
                <Input
                  type="number"
                  placeholder="Amount"
                  className="h-14 pl-14 bg-slate-50 border-none rounded-2xl font-bold text-lg"
                  value={formData.budgetAmount}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, budgetAmount: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Timeline Selection */}
            <div className="space-y-4">
              <Label className="text-slate-700 font-bold ml-1">Priority</Label>
              <div className="space-y-3">
                {[
                  {
                    id: "urgent",
                    label: "Urgent",
                    desc: "ASAP / Within 24h",
                    icon: Zap,
                    color: "text-rose-500",
                  },
                  {
                    id: "within_week",
                    label: "Within a week",
                    desc: "Flexible next 7 days",
                    icon: Calendar,
                    color: "text-indigo-500",
                  },
                  {
                    id: "flexible",
                    label: "Flexible",
                    desc: "No specific rush",
                    icon: Clock,
                    color: "text-slate-400",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, timeline: item.id as any }))
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all
                                ${formData.timeline === item.id ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-slate-50 bg-slate-50 hover:border-slate-200"}`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <item.icon className={item.color} size={20} />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {formData.timeline === item.id && (
                      <div className="h-4 w-4 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Photos */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm text-center">
          <div className="flex items-center gap-3 mb-8 text-left">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Photos (Optional)
            </h2>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-slate-50 rounded-[2rem] p-12 hover:border-indigo-100 hover:bg-slate-50/50 transition-all cursor-pointer group"
          >
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-400">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Click to upload photos
            </h3>
            <p className="text-slate-500 mt-1 font-medium italic">
              Help professionals understand the scope visually (Max 5)
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {formData.photos.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              {formData.photos.map((file, i) => (
                <div
                  key={i}
                  className="relative group h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] p-2 text-center text-slate-500 font-bold truncate">
                    {file.name}
                  </div>
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((p) => ({
                        ...p,
                        photos: p.photos.filter((_, idx) => idx !== i),
                      }));
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {formData.photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:border-indigo-600 transition-all"
                >
                  <Plus size={32} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="ghost"
            className="h-14 px-8 text-slate-500 font-bold text-lg hover:bg-slate-100 rounded-2xl w-full sm:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-100 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Posting...
              </span>
            ) : (
              "Post Your Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <PostJobContent />
    </Suspense>
  );
}
