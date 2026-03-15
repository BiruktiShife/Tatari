"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserCheck,
  Briefcase,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Upload,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
  serviceAreas?: string[];
  verificationStatus?: string | null;
};

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  bio: string;
  hourlyRate: number | null;
  businessName: string;
  serviceCategory: string;
  serviceAreas: string[];
  verificationStatus: string;
};

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) {
        return `${apiUrl.replace(/\/$/, "")}${path}`;
      }
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

function mapApiToForm(user: ProviderProfileApi): ProfileForm {
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.address || "",
    experience: user.experience || "",
    bio: user.bio || "",
    hourlyRate: user.hourlyRate ?? null,
    businessName: user.businessName || "",
    serviceCategory: user.serviceCategory || "",
    serviceAreas: user.serviceAreas || [],
    verificationStatus: (user.verificationStatus || "PENDING").toLowerCase(),
  };
}

export default function ProviderProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileForm | null>(null);
  const [originalProfile, setOriginalProfile] = useState<ProfileForm | null>(
    null,
  );
  const [serviceAreasInput, setServiceAreasInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(resolveApiUrl("/auth/me"), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load profile");
        }
        const data: ProviderProfileApi = await res.json();
        const mapped = mapApiToForm(data);
        setProfile(mapped);
        setOriginalProfile(mapped);
        setServiceAreasInput(mapped.serviceAreas.join(", "));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not load profile";
        toast({
          title: "Profile load failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile);
      setServiceAreasInput(originalProfile.serviceAreas.join(", "));
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.location,
        experience: profile.experience,
        bio: profile.bio,
        hourlyRate: profile.hourlyRate,
        businessName: profile.businessName,
        serviceCategory: profile.serviceCategory,
        serviceAreas: profile.serviceAreas,
      };

      const res = await fetch(resolveApiUrl("/auth/me/provider-profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save profile");
      }

      const updated: ProviderProfileApi = await res.json();
      const mapped = mapApiToForm(updated);
      setProfile(mapped);
      setOriginalProfile(mapped);
      setServiceAreasInput(mapped.serviceAreas.join(", "));
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your provider profile has been saved.",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save profile";
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const services = useMemo(() => {
    if (!profile) return [];
    return [
      {
        id: "primary",
        name: profile.serviceCategory || "General Service",
        price:
          profile.hourlyRate != null
            ? `From ₵ ${profile.hourlyRate}/hr`
            : "Rate not set",
      },
    ];
  }, [profile]);

  if (loading || !profile) {
    return <div className="text-sm text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your professional profile and services
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck className="h-16 w-16 text-blue-600" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">
                        {profile.businessName || profile.name || "Provider"}
                      </h2>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {profile.verificationStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{profile.experience || "Not set"} experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" />
                        <span>No ratings yet</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.email || "Not set"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.phone || "Not set"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.location || "Not set"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Response: Not set</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="mb-2 block">Service Category</Label>
                  {isEditing ? (
                    <Input
                      value={profile.serviceCategory}
                      onChange={(e) =>
                        setProfile({ ...profile, serviceCategory: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profile.serviceCategory || "Not set"}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <Label className="mb-2 block">Service Areas (comma-separated)</Label>
                  {isEditing ? (
                    <Input
                      value={serviceAreasInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setServiceAreasInput(value);
                        const areas = value
                          .split(",")
                          .map((a) => a.trim())
                          .filter(Boolean);
                        setProfile({ ...profile, serviceAreas: areas });
                      }}
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profile.serviceAreas.length
                        ? profile.serviceAreas.join(", ")
                        : "Not set"}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Label className="mb-2 block">About Me</Label>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.bio || "No bio yet."}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Hourly Rate</div>
                <div className="text-2xl font-bold">
                  {profile.hourlyRate != null
                    ? `₵ ${profile.hourlyRate}`
                    : "Not set"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Service Category</div>
                <div className="text-2xl font-bold">
                  {profile.serviceCategory || "Not set"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold">96%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">On-time Completion</div>
                <div className="text-2xl font-bold">94%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
          <TabsTrigger value="services">Services & Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Skills & Expertise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.serviceAreas.length ? (
                  profile.serviceAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      {area}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Add service areas to show your expertise coverage.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Services & Pricing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-gray-600">{service.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Available for New Jobs
                    </Label>
                    <p className="text-sm text-gray-500">
                      Accept new job requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Emergency Services</Label>
                    <p className="text-sm text-gray-500">
                      Available for urgent jobs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label className="font-medium block mb-2">
                    Working Hours
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        9:00 AM - 6:00 PM (Standard)
                      </SelectItem>
                      <SelectItem value="extended">
                        8:00 AM - 8:00 PM (Extended)
                      </SelectItem>
                      <SelectItem value="flexible">Flexible Hours</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
