"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Homeowner, Bole",
    content:
      "I needed a plumber urgently on a Sunday. Found Samuel through Habesha Skills Hub and he fixed the issue in 30 minutes. The platform made everything so easy!",
    rating: 5,
    avatar: "SM",
    service: "Plumbing Repair",
  },
  {
    name: "Michael T.",
    role: "Restaurant Owner, Kazanchis",
    content:
      "Our AC broke during peak hours. Found a technician within 15 minutes who arrived in 30 minutes. Saved our business for the day!",
    rating: 5,
    avatar: "MT",
    service: "AC Repair",
  },
  {
    name: "Liya K.",
    role: "Small Business Owner",
    content:
      "Found an amazing graphic designer for my startup logo. The escrow payment system gave me peace of mind. Will use again!",
    rating: 5,
    avatar: "LK",
    service: "Graphic Design",
  },
  {
    name: "Samuel E.",
    role: "Service Provider",
    content:
      "As an electrician, this platform has tripled my monthly income. I get quality leads and get paid on time. Life-changing!",
    rating: 5,
    avatar: "SE",
    service: "Electrical Services",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our clients and service providers are saying about their
            experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.slice(0, 2).map((testimonial) => (
            <Card
              key={testimonial.name}
              className="border-2 hover:border-blue-200 transition-colors"
            >
              <CardContent className="p-8">
                <Quote className="text-blue-100 mb-6" size={32} />
                <p className="text-lg text-gray-700 mb-6 italic">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {testimonial.service}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Tasks Completed" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "15 min", label: "Avg. Response Time" },
              { value: "₵ 2.5M+", label: "Paid to Providers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients and service providers today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Find a Professional
            </Button>
            <Button size="lg" variant="outline">
              Become a Provider
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
