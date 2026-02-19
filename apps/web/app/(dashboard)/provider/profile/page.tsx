"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Briefcase,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit,
  Save,
  X,
  Upload,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const skills = [
  "Plumbing Installation",
  "Pipe Repair",
  "Leak Detection",
  "Water Heater Installation",
  "Drain Cleaning",
  "Toilet Repair",
];

const services = [
  { id: "1", name: "Basic Plumbing Repair", price: "₵ 300-500" },
  { id: "2", name: "Pipe Installation", price: "₵ 800-1,200" },
  { id: "3", name: "Water Heater Setup", price: "₵ 1,500-2,500" },
  { id: "4", name: "Emergency Plumbing", price: "₵ 500-800" },
];

export default function ProviderProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Samuel Plumbing",
    email: "samuel@example.com",
    phone: "+251 91 234 5678",
    location: "Addis Ababa, Ethiopia",
    experience: "8 years",
    rating: 4.9,
    totalJobs: 42,
    bio: "Professional plumber with 8+ years of experience in residential and commercial plumbing. Specialized in pipe repair, installation, and emergency services. Committed to quality work and customer satisfaction.",
    hourlyRate: "₵ 500",
    minimumJob: "₵ 300",
    responseTime: "1-2 hours",
    verificationStatus: "verified",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your professional profile and services
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck className="h-16 w-16 text-blue-600" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {profile.verificationStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{profile.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" />
                        <span>
                          {profile.rating} ({profile.totalJobs} jobs)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                      />
                    ) : (
                      <span>{profile.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Response: {profile.responseTime}</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <Label className="mb-2 block">About Me</Label>
                  {isEditing ? (
                    <Textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-600">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Hourly Rate</div>
                <div className="text-2xl font-bold">{profile.hourlyRate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Minimum Job</div>
                <div className="text-2xl font-bold">{profile.minimumJob}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold">96%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">On-time Completion</div>
                <div className="text-2xl font-bold">94%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Services Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
          <TabsTrigger value="services">Services & Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Skills & Expertise</span>
                {isEditing && <Button size="sm">Add Skill</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-sm py-1 px-3"
                  >
                    {skill}
                    {isEditing && <X className="h-3 w-3 ml-2 cursor-pointer" />}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Services & Pricing</span>
                {isEditing && <Button size="sm">Add Service</Button>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{service.name}</div>
                      {isEditing ? (
                        <Input
                          value={service.price}
                          className="w-32 mt-1"
                          onChange={() => {}}
                        />
                      ) : (
                        <div className="text-gray-600">{service.price}</div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Available for New Jobs
                    </Label>
                    <p className="text-sm text-gray-500">
                      Accept new job requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Emergency Services</Label>
                    <p className="text-sm text-gray-500">
                      Available for urgent jobs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label className="font-medium block mb-2">
                    Working Hours
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        9:00 AM - 6:00 PM (Standard)
                      </SelectItem>
                      <SelectItem value="extended">
                        8:00 AM - 8:00 PM (Extended)
                      </SelectItem>
                      <SelectItem value="flexible">Flexible Hours</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
