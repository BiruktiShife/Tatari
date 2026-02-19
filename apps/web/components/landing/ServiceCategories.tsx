import React from "react";
import {
  Wrench,
  PaintBucket,
  Cpu,
  GraduationCap,
  Home,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    icon: Wrench,
    title: "Home Repair",
    description: "Plumbing, electrical, appliance repair",
    count: "250+ Pros",
    color: "bg-blue-100 text-blue-600",
    popular: true,
  },
  {
    icon: PaintBucket,
    title: "Painting & Renovation",
    description: "Interior, exterior, wall treatments",
    count: "180+ Pros",
    color: "bg-green-100 text-green-600",
    popular: true,
  },
  {
    icon: Home,
    title: "Cleaning Services",
    description: "Home cleaning, deep cleaning, office",
    count: "320+ Pros",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Cpu,
    title: "Appliance Repair",
    description: "AC, fridge, washing machine, oven",
    count: "150+ Pros",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Code,
    title: "Digital Services",
    description: "Web design, graphic design, social media",
    count: "210+ Pros",
    color: "bg-red-100 text-red-600",
    popular: true,
  },
  {
    icon: GraduationCap,
    title: "Tutoring",
    description: "Academic subjects, languages, skills",
    count: "190+ Pros",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export default function ServiceCategories() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Service Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find trusted professionals for all your needs. All services are
            backed by our satisfaction guarantee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-white rounded-xl p-6 border hover:border-blue-300 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={24} />
                  </div>
                  {category.popular && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Popular
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.count}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-blue-600"
                  >
                    Browse →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="mr-4">
            View All Categories
          </Button>
          <Button size="lg">Post Your Task</Button>
        </div>
      </div>
    </section>
  );
}
