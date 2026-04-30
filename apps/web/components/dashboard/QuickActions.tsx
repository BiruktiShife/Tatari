"use client";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageSquare,
  Star,
  DollarSign,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

// 1. Ensure all icons used in the dashboard are mapped here
const iconMap = {
  plus: Plus,
  message: MessageSquare,
  star: Star,
  dollar: DollarSign,
};

interface Action {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof iconMap;
  variant: "default" | "outline";
}

export function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
        Quick Actions
      </h3>
      <div className="grid gap-4">
        {actions.map((action, i) => {
          // 2. Add a fallback to HelpCircle if the icon name is missing/wrong
          const Icon = iconMap[action.icon] || HelpCircle;

          return (
            <Link href={action.href} key={i} className="block">
              <div
                className={`p-5 rounded-3xl border transition-all flex items-center justify-between group cursor-pointer
                ${
                  action.variant === "default"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                    : "bg-white border-slate-100 text-slate-900 hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center 
                    ${action.variant === "default" ? "bg-white/20" : "bg-slate-50 text-indigo-600"}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">
                      {action.title}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${action.variant === "default" ? "text-indigo-100" : "text-slate-400"}`}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className={`transition-transform group-hover:translate-x-1 ${action.variant === "default" ? "text-white/50" : "text-slate-300"}`}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
