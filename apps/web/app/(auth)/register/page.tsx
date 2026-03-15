"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Building,
  Briefcase,
  MapPin,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function resolveApiUrl(path: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (apiUrl) {
    try {
      new URL(apiUrl);
      return `${apiUrl.replace(/\/$/, "")}${path}`;
    } catch (err) {
      if (apiUrl.startsWith("/")) return `${apiUrl.replace(/\/$/, "")}${path}`;
      throw err;
    }
  }

  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    return origin.includes("localhost")
      ? `http://localhost:3003${path}`
      : `${origin}${path}`;
  }

  return path;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<"client" | "provider">(
    (searchParams.get("role") as "client" | "provider") || "client",
  );
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Client specific
    address: "",

    // Provider specific
    businessName: "",
    serviceCategory: "",
    experience: "",
    bio: "",
    hourlyRate: "",
    serviceAreas: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Cleaning",
    "HVAC",
    "Carpentry",
    "Masonry",
    "Landscaping",
    "Appliance Repair",
    "Other",
  ];

  const serviceAreasList = [
    "Bole",
    "Kasanchis",
    "Mexico",
    "Piassa",
    "Gerji",
    "CMC",
    "Bole Bulbula",
    "Lebu",
    "Megenagna",
    "Sarbet",
  ];

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "client" || role === "provider") {
      setUserType(role);
    }
  }, [searchParams]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agreeToTerms)
      newErrors.terms = "You must agree to the terms and conditions";

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (userType === "client") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
    } else {
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!formData.serviceCategory)
        newErrors.serviceCategory = "Service category is required";
      if (!formData.experience)
        newErrors.experience = "Years of experience is required";
      if (!formData.hourlyRate)
        newErrors.hourlyRate = "Hourly rate is required";
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep1();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setStep(2);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const step2Errors = validateStep2();
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        userType === "client"
          ? resolveApiUrl("/auth/register/client")
          : resolveApiUrl("/auth/register/provider");

      const payload =
        userType === "client"
          ? {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              address: formData.address,
            }
          : {
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              password: formData.password,
              businessName: formData.businessName,
              serviceCategory: formData.serviceCategory,
              experience: formData.experience,
              hourlyRate: Number(formData.hourlyRate),
              serviceAreas: formData.serviceAreas,
              bio: formData.bio,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Make sure backend is running.");
    }

    setIsLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleServiceArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter((a) => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Tatari Hub</h1>
          <p className="text-gray-600 mt-2">
            Connect with skilled professionals or offer your services
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="text-center">
              <CardTitle>Create Your Account</CardTitle>
              <p className="text-gray-600 mt-1">
                Step {step} of 2 •{" "}
                {step === 1
                  ? "Basic Information"
                  : userType === "client"
                    ? "Client Details"
                    : "Provider Details"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* User Type Selection (Step 1 only) */}
            {step === 1 && (
              <div className="mb-6">
                <Label className="block mb-3 text-center">
                  I want to join as:
                </Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant={userType === "client" ? "default" : "outline"}
                    className="flex-1 flex flex-col h-24 py-4"
                    onClick={() => setUserType("client")}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <span>Client</span>
                    <span className="text-xs font-normal mt-1">
                      I need a service
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "provider" ? "default" : "outline"}
                    className="flex-1 flex flex-col h-24 py-4"
                    onClick={() => setUserType("provider")}
                  >
                    <Briefcase className="h-6 w-6 mb-2" />
                    <span>Provider</span>
                    <span className="text-xs font-normal mt-1">
                      I provide a service
                    </span>
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+251 91 234 5678"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters with letters and numbers
                    </p>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) =>
                          setAgreeToTerms(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal cursor-pointer"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <Button type="button" className="w-full" onClick={handleNext}>
                    Continue to{" "}
                    {userType === "client"
                      ? "Client Details"
                      : "Provider Details"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userType === "client" ? (
                    /* Client Details */
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            id="address"
                            name="address"
                            placeholder="Enter your full address"
                            className="pl-10 min-h-[100px]"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.address && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">
                              Client Benefits
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800">
                              <li>
                                • Find verified service providers near you
                              </li>
                              <li>• Compare quotes and reviews</li>
                              <li>• Secure payment system</li>
                              <li>• 24/7 customer support</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Provider Details */
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="businessName"
                            name="businessName"
                            placeholder="Your business or trade name"
                            className="pl-10"
                            value={formData.businessName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.businessName && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.businessName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceCategory">
                            Service Category
                          </Label>
                          <Select
                            value={formData.serviceCategory}
                            onValueChange={(value) =>
                              handleSelectChange("serviceCategory", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceCategories.map((category) => (
                                <SelectItem
                                  key={category}
                                  value={category.toLowerCase()}
                                >
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.serviceCategory && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.serviceCategory}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">
                            Years of Experience
                          </Label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) =>
                              handleSelectChange("experience", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 years</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.experience && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.experience}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (ETB)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            ₵
                          </span>
                          <Input
                            id="hourlyRate"
                            name="hourlyRate"
                            type="number"
                            placeholder="500"
                            className="pl-8"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.hourlyRate && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.hourlyRate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Service Areas</Label>
                        <div className="flex flex-wrap gap-2">
                          {serviceAreasList.map((area) => (
                            <Button
                              key={area}
                              type="button"
                              variant={
                                formData.serviceAreas.includes(area)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => toggleServiceArea(area)}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {area}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio/Description</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell clients about your skills and experience..."
                          className="min-h-[100px]"
                          value={formData.bio}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">
                              Provider Benefits
                            </h4>
                            <ul className="mt-2 space-y-1 text-sm text-green-800">
                              <li>• Get matched with clients in your area</li>
                              <li>• Set your own rates and schedule</li>
                              <li>• Receive secure payments</li>
                              <li>• Build your reputation with reviews</li>
                              <li>• Priority listing for verified providers</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Already have an account */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
