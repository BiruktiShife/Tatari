"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetType: "fixed" as "fixed" | "hourly",
    budgetAmount: "",
    timeline: "flexible" as "urgent" | "within_week" | "flexible",
    location: "Bole, Addis Ababa",
    address: "",
    photos: [] as File[],
  });

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Cleaning",
    "Appliance Repair",
    "Carpentry",
    "Construction",
    "Moving",
    "Furniture Assembly",
    "Graphic Design",
    "Web Development",
    "Tutoring",
    "Translation",
    "Data Entry",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.category || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Job posted successfully!",
        description: "Providers will start sending quotes shortly.",
      });
      router.push("/dashboard/client/jobs");
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files.slice(0, 5)], // Limit to 5 files
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-gray-600 mt-2">
          Describe what you need and get quotes from local professionals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Be specific to get accurate quotes from providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Fix leaking kitchen sink"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Service Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe exactly what you need. Include details like:
• What's broken or needs to be done
• Specific requirements
• Materials needed (if any)
• Any special considerations"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="resize-none"
                required
              />
              <p className="text-sm text-gray-500">
                The more details you provide, the better quotes you'll receive.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
            <CardDescription>
              Set your budget and when you need the job done
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Budget Type</Label>
              <RadioGroup
                value={formData.budgetType}
                onValueChange={(value: "fixed" | "hourly") =>
                  setFormData((prev) => ({ ...prev, budgetType: value }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed" className="font-normal">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <span>Fixed Price</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Hourly Rate</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">
                {formData.budgetType === "fixed"
                  ? "Budget Amount (ETB)"
                  : "Hourly Rate (ETB/hour)"}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="budgetAmount"
                  type="number"
                  placeholder={
                    formData.budgetType === "fixed" ? "e.g., 5000" : "e.g., 250"
                  }
                  className="pl-10"
                  value={formData.budgetAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      budgetAmount: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>How soon do you need this?</Label>
              <RadioGroup
                value={formData.timeline}
                onValueChange={(value: "urgent" | "within_week" | "flexible") =>
                  setFormData((prev) => ({ ...prev, timeline: value }))
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="font-normal">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <div>
                        <div className="font-medium">
                          Urgent (Today/Tomorrow)
                        </div>
                        <div className="text-sm text-gray-500">
                          Need it done ASAP
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="within_week" id="within_week" />
                  <Label htmlFor="within_week" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      <div>
                        <div className="font-medium">Within This Week</div>
                        <div className="text-sm text-gray-500">
                          Flexible within 7 days
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible" className="font-normal">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-green-500" />
                      <div>
                        <div className="font-medium">Flexible</div>
                        <div className="text-sm text-gray-500">
                          No specific deadline
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Location & Photos Card */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Photos</CardTitle>
            <CardDescription>
              Help providers understand the job better
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Location</span>
                </div>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bole">Bole, Addis Ababa</SelectItem>
                  <SelectItem value="kasanchis">
                    Kasanchis, Addis Ababa
                  </SelectItem>
                  <SelectItem value="mexico">Mexico, Addis Ababa</SelectItem>
                  <SelectItem value="piassa">Piassa, Addis Ababa</SelectItem>
                  <SelectItem value="merkato">Merkato, Addis Ababa</SelectItem>
                  <SelectItem value="other">Other Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.location === "other" && (
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="photos">
                <div className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Photos (Optional)</span>
                </div>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="photos" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-700">
                    Click to upload photos
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Upload up to 5 photos of the problem area
                  </div>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </label>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">
                    Selected Photos:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.map((file, index) => (
                      <div
                        key={index}
                        className="relative border rounded-lg p-2"
                      >
                        <div className="text-sm truncate w-32">{file.name}</div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">
                  Tips for Better Quotes
                </h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Include specific measurements if applicable</li>
                  <li>
                    • Mention if you already have materials or need them
                    provided
                  </li>
                  <li>
                    • Specify access requirements (parking, building access)
                  </li>
                  <li>
                    • Mention any time restrictions (work hours only, weekends
                    only)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Save as draft functionality
                toast({
                  title: "Saved as draft",
                  description: "You can continue editing later.",
                });
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Job & Get Quotes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
