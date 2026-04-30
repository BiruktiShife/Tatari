"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Upload,
  Clock,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  Loader2,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Types maintained for full logic compatibility
type ProviderProfileApi = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  businessName?: string | null;
  serviceCategory?: string | null;
  experience?: string | null;
  bio?: string | null;
  hourlyRate?: number | null;
  responseTime?: string | null;
  serviceAreas?: string[];
  verificationStatus?: string | null;
  rating?: number | null;
  reviews?: number | null;
  chapaSubaccountId?: string | null;
};

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  bio: string;
  hourlyRate: number | null;
  responseTime: string;
  businessName: string;
  serviceCategory: string;
  serviceAreas: string[];
  verificationStatus: string;
  chapaSubaccountId: string;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
}

function mapApiToForm(user: ProviderProfileApi): ProfileForm {
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.address || "",
    experience: user.experience || "",
    bio: user.bio || "",
    hourlyRate: user.hourlyRate ?? null,
    responseTime: user.responseTime || "",
    businessName: user.businessName || "",
    serviceCategory: user.serviceCategory || "",
    serviceAreas: user.serviceAreas || [],
    verificationStatus: (user.verificationStatus || "PENDING").toLowerCase(),
    chapaSubaccountId: user.chapaSubaccountId || "",
  };
}

export default function ProviderProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileForm | null>(null);
  const [, setOriginalProfile] = useState<ProfileForm | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(resolveApiUrl("/auth/me"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProviderProfileApi = await res.json();
        const mapped = mapApiToForm(data);
        setProfile(mapped);
        setOriginalProfile(mapped);
        setRating(data.rating ?? null);
        setReviews(data.reviews ?? null);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(resolveApiUrl("/auth/me/provider-profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...profile, address: profile.location }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Profile Updated",
        description: "Your changes are now live.",
      });
      setIsEditing(false);
    } catch {
      toast({ title: "Update Failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-bold italic">
          Loading your professional profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Identity Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold">
              Public Identity
            </Badge>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {profile.businessName || profile.name}
              </h1>
              {profile.verificationStatus === "verified" && (
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={20} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-slate-400 text-lg max-w-xl">
              Manage how clients see your professional brand and services.
            </p>
          </div>
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold"
                >
                  <X size={18} className="mr-2" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-100"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="lg"
                className="bg-white text-slate-900 hover:bg-indigo-50 h-14 px-8 rounded-2xl font-bold shadow-xl"
              >
                <Edit size={18} className="mr-2" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Main Profile Content */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden p-2">
            <div className="p-8 space-y-10">
              {/* Avatar & Summary Area */}
              <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-slate-50 pb-10">
                <div className="relative group">
                  <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-slate-50 shadow-xl overflow-hidden bg-indigo-600">
                    <AvatarFallback className="bg-indigo-600 text-white text-4xl font-black">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors">
                      <Upload size={18} />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 border-none px-3 font-bold uppercase text-[10px] tracking-widest"
                    >
                      {profile.serviceCategory}
                    </Badge>
                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 font-bold uppercase text-[10px] tracking-widest">
                      {profile.experience} Experience
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-500">
                    <Star size={20} className="fill-amber-400" />
                    <span className="text-xl font-black">
                      {rating || "New"}
                    </span>
                    <span className="text-slate-400 font-medium">
                      ({reviews || 0} Reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Contact Email
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      disabled={!isEditing}
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      disabled={!isEditing}
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Base Location
                  </Label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      disabled={!isEditing}
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Avg. Response Time
                  </Label>
                  <div className="relative">
                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      disabled={!isEditing}
                      value={profile.responseTime}
                      onChange={(e) =>
                        setProfile({ ...profile, responseTime: e.target.value })
                      }
                      className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Professional Bio
                </Label>
                <Textarea
                  disabled={!isEditing}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  className="min-h-[150px] bg-slate-50 border-none rounded-[2rem] p-6 text-lg"
                  placeholder="Tell clients about your expertise..."
                />
              </div>
            </div>
          </Card>

          {/* 3. Detailed Tabs */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 w-full max-w-lg mb-6">
              <TabsTrigger
                value="skills"
                className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                Availability
              </TabsTrigger>
              <TabsTrigger
                value="financials"
                className="rounded-xl font-bold px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
              >
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="skills"
              className="outline-none animate-in fade-in slide-in-from-bottom-2"
            >
              <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8">
                <div className="flex flex-wrap gap-3">
                  {profile.serviceAreas.map((area) => (
                    <Badge
                      key={area}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl border-none font-bold text-sm"
                    >
                      <MapPin size={14} className="mr-2" /> {area}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="availability"
              className="outline-none animate-in fade-in slide-in-from-bottom-2"
            >
              <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-900">
                      Market Visibility
                    </p>
                    <p className="text-xs text-slate-500">
                      Allow clients to find you in search
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-900">Urgent Requests</p>
                    <p className="text-xs text-slate-500">
                      Accept 24h emergency jobs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="financials"
              className="outline-none animate-in fade-in slide-in-from-bottom-2"
            >
              <Card className="rounded-[2.5rem] border-slate-100 shadow-sm p-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Chapa Subaccount ID
                  </Label>
                  <Input
                    disabled={!isEditing}
                    value={profile.chapaSubaccountId}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        chapaSubaccountId: e.target.value,
                      })
                    }
                    className="h-12 bg-slate-50 border-none rounded-xl font-mono text-sm"
                  />
                  <p className="text-[10px] text-slate-400 italic">
                    This ID is required to process your automated earnings
                    payouts.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 4. Insights Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              Business Insights
            </h3>

            <div className="space-y-6">
              {[
                {
                  label: "Hourly Rate",
                  val: `ETB ${profile.hourlyRate || "—"}`,
                  icon: TrendingUp,
                  color: "text-emerald-500",
                },
                {
                  label: "Completion Rate",
                  val: "96%",
                  icon: Target,
                  color: "text-indigo-600",
                },
                {
                  label: "Reliability",
                  val: "94%",
                  icon: Award,
                  color: "text-amber-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <stat.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`text-lg font-black ${stat.color}`}>
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="rounded-2xl bg-slate-950 p-6 text-white relative overflow-hidden group">
                <Zap
                  className="absolute -right-2 -bottom-2 text-white/10 group-hover:scale-125 transition-transform"
                  size={80}
                />
                <h4 className="text-indigo-400 font-bold text-sm mb-2">
                  Pro Performance
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are in the{" "}
                  <span className="text-white font-bold">Top 5%</span> of
                  providers in the {profile.serviceCategory} category.
                </p>
              </div>
            </div>
          </Card>

          {/* Profile Visibility Tips */}
          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-indigo-600" size={20} />
              <h4 className="font-bold text-indigo-900">Optimization Tip</h4>
            </div>
            <p className="text-sm text-indigo-700 leading-relaxed font-medium">
              Adding a detailed bio and at least 5 service areas increases your
              profile visits by <span className="font-black">~30%</span>.
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-indigo-600 font-bold mt-4"
            >
              View Public Profile <ChevronRight size={14} />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
