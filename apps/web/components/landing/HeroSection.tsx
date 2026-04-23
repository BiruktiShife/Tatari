import React from "react";
import { Search, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find trusted professionals for
              <span className="text-blue-600"> any task</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              From home repairs to digital services, connect with verified
              professionals in your area. Fast, secure, and satisfaction
              guaranteed.
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="What service do you need?"
                      className="pl-10 py-6 text-lg border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select>
                    <SelectTrigger className="py-6 text-lg border-2 border-blue-200">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addis">Addis Ababa</SelectItem>
                      <SelectItem value="bahir">Bahir Dar</SelectItem>
                      <SelectItem value="mekele">Mekele</SelectItem>
                      <SelectItem value="jimma">Jimma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="lg" className="py-6 px-8 text-lg">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">1,000+</div>
                  <div className="text-gray-600">Verified Pros</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">15 min</div>
                  <div className="text-gray-600">Avg. Response</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="text-purple-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-gray-600">Avg. Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image/Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4 transform rotate-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">YD</span>
                  </div>
                  <div>
                    <div className="font-semibold">Yohannes D.</div>
                    <div className="text-sm text-gray-500">Plumbing Expert</div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="font-semibold">4.9</span>
                      <span className="text-gray-500">(247 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-medium mb-2">
                  &quot;Fixed my kitchen sink in 30 minutes. Professional and
                  affordable!&quot;
                </div>
                <div className="text-gray-500">- Sarah M., Bole</div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-6 transform -rotate-1 ml-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="font-bold text-green-600">MA</span>
                  </div>
                  <div>
                    <div className="font-semibold">Marta A.</div>
                    <div className="text-sm text-gray-500">
                      Graphic Designer
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="font-semibold">5.0</span>
                      <span className="text-gray-500">(189 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-medium mb-2">
                  &quot;Designed our company logo overnight. Exceptional quality!&quot;
                </div>
                <div className="text-gray-500">- Tech Startup, Kazanchis</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
