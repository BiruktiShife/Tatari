"use client";
import {
  Wrench,
  PaintBucket,
  Cpu,
  GraduationCap,
  Home,
  Code,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    icon: Wrench,
    title: "Home Repair",
    desc: "Plumbing & Electrical",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Code,
    title: "Digital Pro",
    desc: "Design & Development",
    color: "bg-indigo-50 text-indigo-600",
    hot: true,
  },
  {
    icon: Home,
    title: "Cleaning",
    desc: "Deep Home & Office",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: GraduationCap,
    title: "Tutoring",
    desc: "Languages & Skills",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: PaintBucket,
    title: "Renovation",
    desc: "Interior & Exterior",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Cpu,
    title: "Tech Support",
    desc: "Appliances & Hardware",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function ServiceCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-slate-600 text-lg">
              Choose from over 50+ professional services tailored to your needs.
            </p>
          </div>
          <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
            View All Categories <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <cat.icon size={28} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {cat.title}
                </h3>
                {cat.hot && (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
                    Hot
                  </Badge>
                )}
              </div>
              <p className="text-slate-600">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
