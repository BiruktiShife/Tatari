"use client";
import { Briefcase, DollarSign, Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  briefcase: Briefcase,
  dollar: DollarSign,
  users: Users,
  star: Star,
};

interface StatsCardsProps {
  stats: {
    title: string;
    value: string;
    change: string;
    icon: keyof typeof iconMap;
  }[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
          <Card
            key={i}
            className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Icon size={20} />
                </div>
                <TrendingUp
                  size={16}
                  className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
