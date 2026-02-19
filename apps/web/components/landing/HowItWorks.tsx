import React from "react";
import { Search, MessageSquare, UserCheck, DollarSign } from "lucide-react";
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
