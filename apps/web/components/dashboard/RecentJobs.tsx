"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  status: "pending" | "quoted" | "accepted" | "in_progress" | "completed";
  price: string;
  posted: string;
}

const statusStyles = {
  pending: "bg-slate-100 text-slate-600",
  quoted: "bg-indigo-50 text-indigo-700",
  accepted: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

export function RecentJobs({ jobs }: { jobs: Job[] }) {
  return (
    <div className="bg-white rounded-3xl">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Recent Projects</h3>
        <Link
          href="/client/jobs"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
        >
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400">
                    {job.posted}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {job.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                className={`px-3 py-1 rounded-full border-none shadow-none capitalize font-bold text-[10px] ${statusStyles[job.status]}`}
              >
                {job.status.replace("_", " ")}
              </Badge>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium italic">
            No active projects found. Post your first job to get started!
          </div>
        )}
      </div>
    </div>
  );
}
