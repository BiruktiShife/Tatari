"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Briefcase,
  Zap,
  ArrowLeft,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// API Resolver (Consistent with Login)
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

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [userType, setUserType] = useState<"client" | "provider">(
    (searchParams.get("role") as "client" | "provider") || "client",
  );
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
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
  const regulatedCategories = new Set(["plumbing", "electrical", "hvac"]);
  const serviceAreasList = [
    "Bole",
    "Kasanchis",
    "Mexico",
    "Piassa",
    "Gerji",
    "CMC",
    "Lebu",
    "Megenagna",
    "Sarbet",
  ];

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "client" || role === "provider") setUserType(role);
  }, [searchParams]);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (formData.password.length < 8) newErrors.password = "Min 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mismatch";
    if (!agreeToTerms) newErrors.terms = "Please agree to terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Check your details",
        description: "Please fix the errors in Step 1",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        userType === "client"
          ? resolveApiUrl("/auth/register/client")
          : resolveApiUrl("/auth/register/provider");

      let res: Response;
      if (userType === "client") {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address,
          }),
        });
      } else {
        const payload = new FormData();
        payload.append("name", formData.fullName);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("password", formData.password);
        payload.append("businessName", formData.businessName);
        payload.append("serviceCategory", formData.serviceCategory);
        payload.append("experience", formData.experience);
        payload.append("hourlyRate", formData.hourlyRate);
        formData.serviceAreas.forEach((area) =>
          payload.append("serviceAreas", area),
        );
        if (formData.bio) payload.append("bio", formData.bio);
        if (businessLicenseFile)
          payload.append("businessLicense", businessLicenseFile);

        res = await fetch(endpoint, { method: "POST", body: payload });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast({
        title: "Account created!",
        description: "Please log in to continue.",
      });
      router.push("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 flex w-screen h-screen bg-white overflow-hidden">
      {/* Left Panel: Consistent with Login */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-slate-950 p-16 flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-indigo-600/20 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform hover:scale-105 w-fit"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Tatari
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
            {userType === "client"
              ? "Find the help you deserve."
              : "Take your business to the next level."}
          </h2>
          <div className="space-y-6">
            {(userType === "client"
              ? [
                  "Access 1000+ verified professionals",
                  "Escrow payment protection",
                  "Support available 24/7",
                ]
              : [
                  "Get high-quality leads daily",
                  "Keep 100% of your earnings",
                  "Build a verified profile",
                ]
            ).map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={22} className="text-indigo-500" />
                <span className="text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm italic">
          Empowering the Ethiopian workforce through technology.
        </div>
      </div>

      {/* Right Panel: Scrollable Form Area */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        <div className="w-full max-w-[520px] mx-auto px-8 py-12 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 group transition-colors"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-sm font-medium">Back to website</span>
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Create Account
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 font-medium">Step {step} of 2</p>
              <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-indigo-600 transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`}
                />
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 border-none capitalize font-bold">
                {userType}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              /* STEP 1: Basic Info */
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={userType === "client" ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-1 rounded-2xl ${userType === "client" ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "border-slate-200"}`}
                    onClick={() => setUserType("client")}
                  >
                    <User size={20} /> <span className="font-bold">Client</span>
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "provider" ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-1 rounded-2xl ${userType === "provider" ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "border-slate-200"}`}
                    onClick={() => setUserType("provider")}
                  >
                    <Briefcase size={20} />{" "}
                    <span className="font-bold">Provider</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      name="fullName"
                      placeholder="John Doe"
                      className="pl-12 h-12 bg-slate-50 rounded-xl"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Email Address
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="john@mail.com"
                      className="h-12 bg-slate-50 rounded-xl"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Phone
                    </Label>
                    <Input
                      name="phone"
                      placeholder="+251 9..."
                      className="h-12 bg-slate-50 rounded-xl"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Password (min 8 chars)
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="h-12 bg-slate-50 rounded-xl"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">
                    Confirm Password
                  </Label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    className="h-12 bg-slate-50 rounded-xl"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(v) => setAgreeToTerms(v as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-500">
                    I agree to the{" "}
                    <Link href="#" className="text-indigo-600 font-bold">
                      Terms & Privacy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="button"
                  className="w-full h-14 bg-indigo-600 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100"
                  onClick={handleNext}
                >
                  Continue to{" "}
                  {userType === "client" ? "Address" : "Business Details"}
                </Button>
              </div>
            ) : (
              /* STEP 2: Details */
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                {userType === "client" ? (
                  <div className="space-y-4">
                    <Label className="text-slate-700 font-semibold">
                      Home Address
                    </Label>
                    <Textarea
                      name="address"
                      placeholder="Bole, Addis Ababa, House #123..."
                      className="min-h-[120px] bg-slate-50 rounded-xl"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">
                        Business Name
                      </Label>
                      <Input
                        name="businessName"
                        placeholder="e.g. Reliable Plumbing"
                        className="h-12 bg-slate-50 rounded-xl"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">
                          Category
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData((p) => ({ ...p, serviceCategory: v }))
                          }
                        >
                          <SelectTrigger className="h-12 bg-slate-50 rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceCategories.map((c) => (
                              <SelectItem key={c} value={c.toLowerCase()}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">
                          Experience
                        </Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData((p) => ({ ...p, experience: v }))
                          }
                        >
                          <SelectTrigger className="h-12 bg-slate-50 rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1-3 Years</SelectItem>
                            <SelectItem value="3-5">3-5 Years</SelectItem>
                            <SelectItem value="5+">5+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold italic">
                        Hourly Rate (ETB)
                      </Label>
                      <Input
                        name="hourlyRate"
                        type="number"
                        className="h-12 bg-slate-50 rounded-xl"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">
                        Service License (PDF/JPG)
                      </Label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer relative">
                        <Upload
                          className="mx-auto text-slate-400 mb-2"
                          size={24}
                        />
                        <p className="text-xs text-slate-500 font-medium">
                          {businessLicenseFile
                            ? businessLicenseFile.name
                            : "Click to upload your professional license"}
                        </p>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) =>
                            setBusinessLicenseFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">
                        Bio / Professional Summary
                      </Label>
                      <Textarea
                        name="bio"
                        className="min-h-[100px] bg-slate-50 rounded-xl"
                        value={formData.bio}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-[2] h-12 bg-indigo-600 rounded-xl font-bold shadow-xl shadow-indigo-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
