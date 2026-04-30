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
  Zap,
  Target,
  Compass,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Types
type MeResponse = { serviceAreas?: string[] };
type JobItem = { location?: string };

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
  if (apiUrl && !apiUrl.startsWith("http"))
    return `${window.location.origin}${path}`;
  return `${apiUrl.replace(/\/$/, "")}${path}`;
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
        const token = localStorage.getItem("token");
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addArea = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (areas.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    setAreas((prev) => [...prev, trimmed]);
    setNewArea("");
    toast({
      title: "Area Added",
      description: `Added ${trimmed} to your list. Save to apply changes.`,
    });
  };

  const removeArea = (area: string) => {
    setAreas((prev) => prev.filter((a) => a !== area));
  };

  const saveAreas = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(resolveApiUrl("/auth/me/provider-profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceAreas: areas }),
      });
      if (!res.ok) throw new Error();
      toast({
        title: "Coverage Updated",
        description: "Your service areas are now live.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not update service areas.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const areaStats = useMemo(() => {
    return areas.map((area) => ({
      area,
      jobs: nearbyJobs.filter((job) =>
        (job.location || "").toLowerCase().includes(area.toLowerCase()),
      ).length,
    }));
  }, [areas, nearbyJobs]);

  const totalNearbyJobs = useMemo(
    () => areaStats.reduce((sum, item) => sum + item.jobs, 0),
    [areaStats],
  );
  const topArea = useMemo(
    () => [...areaStats].sort((a, b) => b.jobs - a.jobs)[0]?.area || "N/A",
    [areaStats],
  );
  const suggestions = suggestedAreas.filter(
    (a) => !areas.some((active) => active.toLowerCase() === a.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-bold italic">
          Mapping your coverage...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-2">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-none px-4 py-1 font-bold">
              Coverage Hub
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Territory Settings
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Control which districts you receive job notifications from.
            </p>
          </div>
          <Button
            onClick={saveAreas}
            disabled={saving}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 gap-2"
          >
            {saving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> Apply Coverage
              </>
            )}
          </Button>
        </div>
      </section>

      {/* 2. Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active Districts",
            val: areas.length,
            icon: Compass,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Matching Leads",
            val: totalNearbyJobs,
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Primary Hub",
            val: topArea,
            icon: Target,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all"
          >
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900 leading-none">
                  {stat.val}
                </h3>
              </div>
              <div
                className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={28} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. Manage Areas */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden p-2">
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Manage Territory
                </h2>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Current Active Districts
                </Label>
                <div className="flex flex-wrap gap-3">
                  {areas.length > 0 ? (
                    areas.map((area) => (
                      <Badge
                        key={area}
                        className="bg-slate-50 text-slate-700 hover:bg-slate-100 px-4 py-2.5 rounded-2xl border-slate-200 gap-3 group transition-all"
                      >
                        <span className="font-bold text-sm">{area}</span>
                        <button
                          onClick={() => removeArea(area)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] w-full text-center">
                      <p className="text-slate-400 font-medium italic">
                        No areas selected. Your marketplace reach is currently
                        0.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Add New Region
                </Label>
                <div className="flex gap-3">
                  <Input
                    placeholder="Type a district name (e.g. Merkato)"
                    className="h-14 bg-slate-50 border-none rounded-2xl text-lg focus:ring-indigo-500/20 shadow-inner"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addArea(newArea)}
                  />
                  <Button
                    onClick={() => addArea(newArea)}
                    className="h-14 w-14 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white shadow-lg shrink-0"
                  >
                    <Plus size={24} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Area Intelligence Snapshot */}
          <div className="space-y-4 px-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <TrendingUp size={16} /> Lead Intelligence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {areaStats.map((item) => (
                <div
                  key={item.area}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all"
                >
                  <div>
                    <h4 className="font-black text-slate-900">{item.area}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {item.jobs} Active Leads
                    </p>
                  </div>
                  <button
                    onClick={() => removeArea(item.area)}
                    className="text-slate-200 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Suggestions Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] bg-indigo-600 text-white border-none p-8 shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-300" /> Regional
                Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((area) => (
                  <button
                    key={area}
                    onClick={() => addArea(area)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center gap-2 group"
                  >
                    <Plus
                      size={14}
                      className="group-hover:scale-125 transition-transform"
                    />{" "}
                    {area}
                  </button>
                ))}
                {suggestions.length === 0 && (
                  <p className="text-indigo-100 text-sm italic">
                    You have covered all recommended areas!
                  </p>
                )}
              </div>
              <p className="mt-8 text-xs text-indigo-100 leading-relaxed font-medium">
                Expansion Tip: Adding 3 or more districts increases your lead
                volume by <span className="text-white font-bold">~45%</span>.
              </p>
            </div>
          </Card>

          <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">
              How it works
            </h4>
            <div className="space-y-4">
              {[
                "Receive instant SMS for jobs in active areas",
                "Priority ranking for local verified pros",
                "Switch coverage on/off anytime",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
