import React from "react";
import { Shield, Clock, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform how you get things done
          </h2>
          <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
            Whether you need a service or want to offer one, Habesha Skills Hub
            makes it simple, secure, and profitable.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Shield,
                title: "100% Secure",
                desc: "Escrow payment protection",
              },
              {
                icon: Clock,
                title: "Fast Matching",
                desc: "Get quotes in minutes",
              },
              {
                icon: Users,
                title: "Verified Pros",
                desc: "Background checked providers",
              },
              {
                icon: Award,
                title: "Quality Guaranteed",
                desc: "Satisfaction or money back",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-blue-300" />
                  </div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-blue-200">{item.desc}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-6 text-lg"
            >
              Get Started for Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Watch Demo Video
            </Button>
          </div>

          <div className="mt-12 text-sm text-blue-300">
            No credit card required • Cancel anytime • 24/7 support
          </div>
        </div>
      </div>
    </section>
  );
}
