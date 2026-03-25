"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type MeResponse = {
  serviceAreas?: string[];
};

type JobItem = {
  location?: string;
};

const suggestedAreas = [
  "Bole",
  "Kasanchis",
  "Mexico",
  "Piassa",
  "Gerji",
  "CMC",
  "Lebu",
  "Ayat",
];

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

export default function ProviderServiceAreaPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");
  const [nearbyJobs, setNearbyJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;

        const [meRes, nearbyRes] = await Promise.all([
          fetch(resolveApiUrl("/auth/me"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(resolveApiUrl("/jobs/provider/nearby"), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.ok) {
          const me: MeResponse = await meRes.json();
          setAreas(Array.isArray(me.serviceAreas) ? me.serviceAreas : []);
        }
        if (nearbyRes.ok) {
          const jobs = await nearbyRes.json();
          setNearbyJobs(Array.isArray(jobs) ? jobs : []);
        }
      } catch {
        toast({
          title: "Could not load service areas",
          description: "Please refresh and try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const addArea = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (areas.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    setAreas((prev) => [...prev, trimmed]);
    setNewArea("");
  };

  const removeArea = (area: string) => {
    setAreas((prev) => prev.filter((a) => a !== area));
  };

  const saveAreas = async () => {
    setSaving(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) throw new Error("No auth token");

      const res = await fetch(resolveApiUrl("/auth/me/provider-profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceAreas: areas }),
      });

      if (!res.ok) {
        throw new Error("Failed to save service areas");
      }

      toast({
        title: "Saved",
        description: "Your service areas were updated successfully.",
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Could not update service areas.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const areaStats = useMemo(() => {
    return areas.map((area) => {
      const jobs = nearbyJobs.filter((job) =>
        (job.location || "").toLowerCase().includes(area.toLowerCase()),
      ).length;
      return { area, jobs };
    });
  }, [areas, nearbyJobs]);

  const totalNearbyJobs = useMemo(
    () => areaStats.reduce((sum, item) => sum + item.jobs, 0),
    [areaStats],
  );
  const topArea = useMemo(() => {
    if (!areaStats.length) return "N/A";
    return [...areaStats].sort((a, b) => b.jobs - a.jobs)[0]?.area || "N/A";
  }, [areaStats]);

  const suggestions = suggestedAreas.filter(
    (area) => !areas.some((a) => a.toLowerCase() === area.toLowerCase()),
  );

  if (loading) {
    return <div className="text-sm text-gray-500">Loading service areas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm mb-3">
              <Sparkles className="h-4 w-4" />
              Coverage Settings
            </div>
            <h1 className="text-3xl font-bold">Service Areas</h1>
            <p className="text-slate-200 mt-2">
              Define where you accept jobs and keep your coverage up to date.
            </p>
          </div>
          <Button onClick={saveAreas} disabled={saving} variant="secondary">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Areas"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Active Areas</div>
            <div className="text-3xl font-semibold mt-1">{areas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Nearby Job Matches</div>
            <div className="text-3xl font-semibold mt-1">{totalNearbyJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Top Area</div>
            <div className="text-3xl font-semibold mt-1">
              {topArea}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Service Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Current Areas</Label>
              <div className="flex flex-wrap gap-2">
                {areas.length ? (
                  areas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="py-1 px-3 text-sm gap-2"
                    >
                      <MapPin className="h-3 w-3" />
                      {area}
                      <button
                        onClick={() => removeArea(area)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={`Remove ${area}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No service areas added yet.
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Add New Area</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Type an area or district"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArea(newArea);
                    }
                  }}
                />
                <Button onClick={() => addArea(newArea)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" onClick={saveAreas} disabled={saving}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Coverage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestions.length ? (
                suggestions.map((area) => (
                  <Button
                    key={area}
                    size="sm"
                    variant="outline"
                    onClick={() => addArea(area)}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {area}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-gray-500">All suggestions added.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Area Performance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {areaStats.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {areaStats.map((item) => (
                <Card key={item.area}>
                  <CardContent className="pt-5">
                    <div className="text-sm text-gray-500">{item.area}</div>
                    <div className="text-2xl font-semibold mt-1">{item.jobs}</div>
                    <div className="text-xs text-gray-500 mt-1">matching jobs</div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-0 h-auto text-blue-600"
                        onClick={() => removeArea(item.area)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove area
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Add service areas to see performance by location.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
