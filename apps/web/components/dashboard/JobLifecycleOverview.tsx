import React from "react";
import { Activity, CheckCircle2, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    label: "Job Start",
    helper: "Pending, active, accepted",
    icon: PlayCircle,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    key: "inProgress",
    label: "In Progress",
    helper: "Work underway",
    icon: Activity,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "completed",
    label: "Completed",
    helper: "Work finished",
    icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-700",
  },
] as const;

export function JobLifecycleOverview({
  counts,
  title = "Job Lifecycle",
  subtitle = "Track start, progress, and completion at a glance.",
}: JobLifecycleOverviewProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            const value = counts[item.key];
            return (
              <div
                key={item.key}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-4"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.tone}`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </div>
                  <div className="text-2xl font-semibold text-slate-900 mt-1">
                    {value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.helper}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
