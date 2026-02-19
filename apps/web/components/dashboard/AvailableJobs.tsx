import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, User } from "lucide-react";

export function AvailableJobs() {
  const jobs = [
    {
      id: "1",
      title: "Fix Bathroom Tile Grout",
      client: "Mrs. Abebe",
      distance: "2.3 km",
      budget: "$80 - $120",
      posted: "30 min ago",
      urgency: "high",
      category: "Home Repair",
    },
    {
      id: "2",
      title: "Install AC Unit",
      client: "Mr. Solomon",
      distance: "4.1 km",
      budget: "$200 - $300",
      posted: "1 hour ago",
      urgency: "medium",
      category: "Appliance Repair",
    },
    {
      id: "3",
      title: "Repair Garden Fence",
      client: "Ms. Helen",
      distance: "1.8 km",
      budget: "$150 - $200",
      posted: "2 hours ago",
      urgency: "low",
      category: "Construction",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Available Jobs Near You</CardTitle>
            <CardDescription>
              Jobs matching your skills and service area
            </CardDescription>
          </div>
          <Badge variant="outline" className="animate-pulse">
            🔥 3 New Alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{job.title}</h3>
                    {job.urgency === "high" && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                    {job.urgency === "medium" && (
                      <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-700"
                      >
                        Soon
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{job.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{job.distance} away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>

                  <Badge variant="secondary">{job.category}</Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm">Submit Quote</Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" className="w-full">
            View All Available Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
