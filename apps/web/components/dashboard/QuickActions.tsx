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
import {
  Plus,
  MessageSquare,
  Star,
  MapPin,
  FileText,
  Settings,
} from "lucide-react";

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: "plus" | "message" | "star" | "map" | "file" | "settings";
  variant: "default" | "outline" | "secondary";
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const iconMap = {
  plus: Plus,
  message: MessageSquare,
  star: Star,
  map: MapPin,
  file: FileText,
  settings: Settings,
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you might want to do</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = iconMap[action.icon];

            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start h-auto py-3 px-4"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-start gap-3 text-left">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-600 opacity-80">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Additional helpful tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Quick Tip</h4>
          <p className="text-sm text-gray-600">
            Be specific in your job descriptions to get better quotes from
            providers. Include details like timeline, materials needed, and
            specific requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
