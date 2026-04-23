import React from "react";
import Link from "next/link";
import { Check, X, Zap, Shield, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect plan for your needs. No hidden fees, no
              surprises.
            </p>

            <Tabs defaultValue="client" className="w-full max-w-md mx-auto">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="client">For Clients</TabsTrigger>
                <TabsTrigger value="provider">For Providers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Client Pricing */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              For Service Seekers
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic</CardTitle>
                  <CardDescription>For occasional needs</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Free</span>
                    <span className="text-gray-500 ml-2">forever</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { text: "Post up to 3 jobs per month", included: true },
                      { text: "Browse service providers", included: true },
                      { text: "Basic messaging", included: true },
                      { text: "Standard support", included: true },
                      { text: "Priority customer support", included: false },
                      { text: "Multiple quotes comparison", included: false },
                      {
                        text: "Extended job posting duration",
                        included: false,
                      },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        {item.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-3" />
                        )}
                        <span
                          className={
                            item.included ? "text-gray-700" : "text-gray-400"
                          }
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/register?role=client">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan - Most Popular */}
              <Card className="border-2 border-blue-500 shadow-xl relative scale-105">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For frequent service needs</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₵ 199</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { text: "Unlimited job postings", included: true },
                      { text: "Priority in search results", included: true },
                      { text: "Advanced provider filtering", included: true },
                      { text: "Unlimited messaging", included: true },
                      { text: "Priority customer support", included: true },
                      {
                        text: "Side-by-side quotes comparison",
                        included: true,
                      },
                      { text: "Extended job posting duration", included: true },
                      { text: "Save favorite providers", included: true },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    asChild
                  >
                    <Link href="/register?role=client">Get Pro Plan</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Business Plan */}
              <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <CardDescription>
                    For companies & organizations
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₵ 499</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      { text: "Everything in Pro", included: true },
                      { text: "Dedicated account manager", included: true },
                      { text: "Custom service agreements", included: true },
                      { text: "Bulk job posting", included: true },
                      { text: "API access", included: true },
                      { text: "Custom reporting", included: true },
                      { text: "Team collaboration tools", included: true },
                      { text: "SLA guarantees", included: true },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact?plan=business">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Provider Pricing */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              For Service Providers
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Provider Plan */}
              <Card className="border-2 hover:border-green-300 transition-all hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Begin your journey</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Free</span>
                    <span className="text-gray-500 ml-2">to join</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-700 mb-2">
                      Commission: 15%
                    </div>
                    <p className="text-sm text-gray-600">
                      We take 15% of each completed job
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { text: "Create professional profile", included: true },
                      { text: "Receive job alerts", included: true },
                      { text: "Bid on up to 10 jobs/month", included: true },
                      { text: "Basic customer support", included: true },
                      { text: "Standard payout (3-5 days)", included: true },
                      { text: "Featured profile placement", included: false },
                      { text: "Priority job alerts", included: false },
                      { text: "Advanced analytics", included: false },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        {item.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-3" />
                        )}
                        <span
                          className={
                            item.included ? "text-gray-700" : "text-gray-400"
                          }
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/register?role=provider">Join as Starter</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Provider Plan */}
              <Card className="border-2 border-green-500 shadow-xl relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro Provider</CardTitle>
                  <CardDescription>Grow your business</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₵ 299</span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-700 mb-2">
                      Commission: 10%
                    </div>
                    <p className="text-sm text-gray-600">
                      We take only 10% of each completed job
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { text: "Everything in Starter", included: true },
                      { text: "Featured profile placement", included: true },
                      { text: "Priority job alerts", included: true },
                      { text: "Unlimited job bids", included: true },
                      { text: "Fast payout (24 hours)", included: true },
                      { text: "Advanced analytics dashboard", included: true },
                      { text: "Premium customer support", included: true },
                      { text: "Skills certification badge", included: true },
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    asChild
                  >
                    <Link href="/register?role=provider">Upgrade to Pro</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Features comparison */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Compare all features
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-4 px-6 font-semibold">
                      Feature
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Client Basic
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Client Pro
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Client Business
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Provider Starter
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Provider Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Job Postings",
                      "3/month",
                      "Unlimited",
                      "Unlimited",
                      "10/month",
                      "Unlimited",
                    ],
                    ["Commission Rate", "-", "-", "-", "15%", "10%"],
                    [
                      "Priority Support",
                      "Basic",
                      "24/7 Priority",
                      "Dedicated",
                      "Basic",
                      "Priority",
                    ],
                    ["Payment Protection", "✓", "✓", "✓", "✓", "✓"],
                    [
                      "Analytics Dashboard",
                      "Basic",
                      "Advanced",
                      "Custom",
                      "Basic",
                      "Advanced",
                    ],
                    ["API Access", "✗", "✗", "✓", "✗", "✗"],
                    ["Team Members", "1", "1", "Up to 10", "1", "1"],
                  ].map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`py-4 px-6 ${
                            cellIndex === 0 ? "font-medium" : "text-center"
                          }`}
                        >
                          {cell === "✓" ? (
                            <Check className="h-5 w-5 text-green-500 inline" />
                          ) : cell === "✗" ? (
                            <X className="h-5 w-5 text-red-500 inline" />
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why choose Habesha Skills Hub?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Secure Payments",
                  description:
                    "100% payment protection with escrow. Funds released only when you're satisfied.",
                },
                {
                  icon: Zap,
                  title: "Fast Matching",
                  description:
                    "Get matched with qualified professionals in minutes, not days.",
                },
                {
                  icon: Globe,
                  title: "Local Focus",
                  description:
                    "Designed for the Ethiopian market with local payment options and support.",
                },
                {
                  icon: Headphones,
                  title: "Dedicated Support",
                  description: "24/7 customer support in Amharic and English.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users today. No credit card required
              to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/register?role=client">Find a Professional</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/register?role=provider">Become a Provider</Link>
              </Button>
            </div>
            <p className="mt-8 text-gray-500">
              Need help deciding?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact our sales team
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
