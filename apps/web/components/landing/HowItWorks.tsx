import React from "react";
import {
  Search,
  MessageSquare,
  UserCheck,
  DollarSign,
  PlayCircle,
  Activity,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

const steps = [
  {
    icon: Search,
    title: "Post Your Task",
    description:
      "Describe what you need, set your budget, and pin your location.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Get Instant Quotes",
    description:
      "Receive quotes from available professionals in your area within minutes.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: UserCheck,
    title: "Choose Your Pro",
    description: "Compare reviews, ratings, and prices. Select the best match.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: DollarSign,
    title: "Pay Securely",
    description:
      "100% payment protection. Funds released only after job completion.",
    color: "bg-orange-100 text-orange-600",
  },
];

const lifecycle = [
  {
    role: "Client",
    roleColor: "bg-blue-50 text-blue-700 border-blue-200",
    stages: [
      {
        title: "Job Start",
        icon: PlayCircle,
        description:
          "Confirm scope, approve the quote, and release the escrow deposit.",
        badge: "Client approval",
      },
      {
        title: "In Progress",
        icon: Activity,
        description:
          "Track updates, respond to questions, and request changes if needed.",
        badge: "Live updates",
      },
      {
        title: "Completion",
        icon: CheckCircle2,
        description:
          "Review work, mark complete, and release final payment securely.",
        badge: "Final sign-off",
      },
    ],
  },
  {
    role: "Provider",
    roleColor: "bg-green-50 text-green-700 border-green-200",
    stages: [
      {
        title: "Job Start",
        icon: PlayCircle,
        description:
          "Accept the job, confirm arrival time, and start with verified scope.",
        badge: "Start confirmed",
      },
      {
        title: "In Progress",
        icon: Activity,
        description:
          "Share milestones, upload photos, and keep the client informed.",
        badge: "Milestones",
      },
      {
        title: "Completion",
        icon: CheckCircle2,
        description:
          "Submit completion proof and receive payout after client approval.",
        badge: "Payout ready",
      },
    ],
  },
  {
    role: "Admin",
    roleColor: "bg-amber-50 text-amber-700 border-amber-200",
    stages: [
      {
        title: "Job Start",
        icon: PlayCircle,
        description:
          "Verify accounts, validate escrow funding, and lock job terms.",
        badge: "Compliance",
      },
      {
        title: "In Progress",
        icon: Activity,
        description:
          "Monitor communications, handle disputes, and audit progress logs.",
        badge: "Oversight",
      },
      {
        title: "Completion",
        icon: ShieldCheck,
        description:
          "Resolve issues, release funds, and close the job record.",
        badge: "Closeout",
      },
    ],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Habesha Skills Hub Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent, and secure process for both clients and service
            providers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <Card className="h-full border-2 hover:border-blue-300 transition-colors hover:shadow-lg">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6`}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Job lifecycle */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Job Lifecycle: Start, Progress, Completion
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Clear responsibilities across client, provider, and admin keep
              every job transparent, accountable, and on time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {lifecycle.map((role) => (
              <Card key={role.role} className="border-2">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${role.roleColor}`}
                  >
                    {role.role}
                  </div>
                  <div className="mt-6 space-y-5">
                    {role.stages.map((stage) => {
                      const Icon = stage.icon;
                      return (
                        <div
                          key={`${role.role}-${stage.title}`}
                          className="flex gap-4"
                        >
                          <div className="mt-1 h-10 w-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {stage.title}
                              </h4>
                              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                {stage.badge}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {stage.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Providers */}
        <div className="mt-20 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Are you a service professional?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of professionals who are growing their business
                with Habesha Skills Hub. Get more clients, manage your schedule,
                and get paid securely.
              </p>
              <ul className="space-y-3">
                {[
                  "Earn up to 3x more than traditional jobs",
                  "Get paid within 24 hours after job completion",
                  "Build your reputation with verified reviews",
                  "Work on your own schedule",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-4">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
                <Button size="lg">Become a Provider</Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">$2,850+</div>
                    <div className="text-gray-600">
                      Average monthly earnings
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Samuel E.</span>
                      <span className="font-semibold">$4,200</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Marta A.</span>
                      <span className="font-semibold">$3,800</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
