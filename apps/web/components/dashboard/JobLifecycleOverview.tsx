"use client";

import React from "react";
import { Activity, CheckCircle2, PlayCircle, Clock } from "lucide-react";

// Types maintained for full compatibility
export type JobLifecycleCounts = {
  started: number;
  inProgress: number;
  completed: number;
};

type JobLifecycleOverviewProps = {
  counts: JobLifecycleCounts;
  title?: string;
  subtitle?: string;
};

const items = [
  {
    key: "started",
    label: "Project Started",
    helper: "Pending & Accepted",
    icon: PlayCircle,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    key: "inProgress",
    label: "Work In Progress",
    helper: "Active execution",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "completed",
    label: "Successfully Done",
    helper: "Finalized & Paid",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
] as const;

export function JobLifecycleOverview({
  counts,
  title = "Service Pipeline",
  subtitle = "Real-time visibility into your project workflow",
}: JobLifecycleOverviewProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

      <div className="mb-10">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 font-medium mt-1">{subtitle}</p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* The connecting line on desktop */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-slate-100 -z-0" />

        {items.map((item, i) => {
          const Icon = item.icon;
          const value = counts[item.key as keyof JobLifecycleCounts] || 0;

          return (
            <div
              key={item.key}
              className="relative z-10 flex flex-col items-center md:items-start group/item"
            >
              <div className="flex items-center gap-6 mb-4">
                {/* Icon Circle */}
                <div
                  className={`h-20 w-20 rounded-[1.5rem] ${item.bg} ${item.color} ${item.border} border-2 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-300`}
                >
                  <Icon size={32} strokeWidth={2.5} />
                </div>

                {/* Vertical Divider for Mobile (visible only on small screens) */}
                <div className="md:hidden h-12 w-px bg-slate-100" />

                {/* Counter Area */}
                <div>
                  <div className="text-4xl font-black text-slate-900 leading-none">
                    {value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-1">
                    <Clock size={10} /> Real-time
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div className="text-center md:text-left space-y-1">
                <h4 className="text-lg font-bold text-slate-900 leading-tight">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  {item.helper}
                </p>
              </div>

              {/* Decorative Step Indicator */}
              <div className="absolute -top-3 -right-3 hidden lg:flex h-7 w-7 rounded-full bg-white border border-slate-100 items-center justify-center text-[10px] font-black text-slate-300">
                0{i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
