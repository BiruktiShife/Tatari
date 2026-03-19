import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react";

export interface JobItem {
  id: string;
  title: string;
  provider: string;
  status: "pending" | "quoted" | "accepted" | "in_progress" | "completed";
  price: string;
  posted: string;
}

interface RecentJobsProps {
  jobs: JobItem[];
}

const statusConfig = {
  pending: {
    label: "Pending Quotes",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  quoted: {
    label: "Quotes Received",
    variant: "outline" as const,
    icon: DollarSign,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  accepted: {
    label: "Accepted",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  in_progress: {
    label: "In Progress",
    variant: "secondary" as const,
    icon: AlertCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
};

export function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your recent job postings and their status
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/client/jobs">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => {
            const status = statusConfig[job.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${status.bgColor} ${status.color}`}
                  >
                    <StatusIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{job.title}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Provider:{" "}
                      <span className="font-medium">{job.provider}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted {job.posted}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{job.price}</div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/dashboard/client/jobs/${job.id}`}>
                        Details
                      </Link>
                    </Button>
                    {job.status === "quoted" && (
                      <Button size="sm">Review Quotes</Button>
                    )}
                    {job.status === "in_progress" && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/client/jobs/${job.id}/updates`}>
                          View Updates
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No jobs yet</div>
            <Button asChild>
              <Link href="/dashboard/client/post-job">Post Your First Job</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
