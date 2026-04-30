"use client";
import React from "react";
import { Search, Shield, Clock, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Expert help, <span className="text-indigo-600">on demand.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Connect with verified professionals for home, digital, and creative
            services. Quality work, secured payments, and 24/7 support.
          </p>
        </div>

        {/* Modern Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-[2] relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                className="h-14 pl-12 border-none focus-visible:ring-0 text-base"
                placeholder="What do you need help with?"
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200 my-auto" />
            <div className="flex-1 relative">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                className="h-14 pl-12 border-none focus-visible:ring-0 text-base"
                placeholder="Location"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-indigo-200"
            >
              Find Pro
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: Shield, label: "Verified Experts", color: "text-blue-600" },
            { icon: Clock, label: "Quick Response", color: "text-emerald-600" },
            { icon: Star, label: "4.9/5 Rating", color: "text-amber-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className={item.color} size={22} />
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
