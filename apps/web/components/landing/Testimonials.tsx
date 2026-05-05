"use client";
import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    name: "Sarah M.",
    role: "Homeowner in Bole",
    content:
      "I needed a plumber urgently on a Sunday. Found Samuel through Tatari and he fixed the leak in 30 minutes. The payment was secure and easy.",
    service: "Plumbing",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Michael T.",
    role: "Restaurant Owner",
    content:
      "Our AC broke during peak hours. The technician arrived within 20 minutes. Tatari literally saved our business for the day!",
    service: "AC Repair",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Dawit Abraham",
    role: "Verified Professional",
    content:
      "Since joining Tatari as an electrician, my monthly income has tripled. I don't have to worry about marketing; the clients come to me.",
    service: "Electrician",
    rating: 5,
    avatar: "DA",
    isPro: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none mb-4 px-4 py-1 text-sm">
            Success Stories
          </Badge>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
            Trusted by the community
          </h2>
          <p className="text-lg text-slate-600">
            Join thousands of satisfied users who have transformed how they find
            and provide services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, i) => (
            <Card
              key={i}
              className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
            >
              <CardContent className="p-8">
                <Quote
                  className="absolute top-6 right-8 text-slate-100 group-hover:text-indigo-50 transition-colors"
                  size={40}
                />

                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                  &ldquo;{review.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-900">
                        {review.name}
                      </span>
                      {review.isPro && (
                        <CheckCircle size={14} className="text-indigo-600" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      {review.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact Stats Bar */}
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            {[
              { label: "Tasks Completed", value: "12,000+" },
              { label: "Verified Pros", value: "850+" },
              { label: "Avg. Response", value: "14m" },
              { label: "Customer Rating", value: "4.9/5" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-extrabold mb-2 text-indigo-400">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
