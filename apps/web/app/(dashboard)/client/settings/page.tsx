"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Globe,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+251 911 234 567",
    location: "Bole, Addis Ababa",
    bio: "Homeowner looking for reliable service professionals.",
    language: "en",
    currency: "ETB",
  });

  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailQuotes: true,
    emailPromotions: false,
    pushJobAlerts: true,
    pushMessages: true,
    pushReminders: true,
    smsJobAlerts: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-8">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>Phone Number</span>
                  </div>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Primary Location</span>
                  </div>
                </Label>
                <Select
                  value={profile.location}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bole, Addis Ababa">
                      Bole, Addis Ababa
                    </SelectItem>
                    <SelectItem value="Kasanchis, Addis Ababa">
                      Kasanchis, Addis Ababa
                    </SelectItem>
                    <SelectItem value="Mexico, Addis Ababa">
                      Mexico, Addis Ababa
                    </SelectItem>
                    <SelectItem value="Piassa, Addis Ababa">
                      Piassa, Addis Ababa
                    </SelectItem>
                    <SelectItem value="Merkato, Addis Ababa">
                      Merkato, Addis Ababa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell providers a bit about yourself..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </span>
                </div>
                <div className="space-y-3">
                  <Button variant="outline">Upload New Photo</Button>
                  <p className="text-sm text-gray-500">
                    Recommended: Square image, at least 400x400 pixels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailJobAlerts", label: "Job alerts and updates" },
                { key: "emailQuotes", label: "New quotes and bids" },
                { key: "emailPromotions", label: "Promotions and newsletters" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor={item.key}>{item.label}</Label>
                  <Switch
                    id={item.key}
                    checked={
                      notifications[
                        item.key as keyof typeof notifications
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: checked,
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Control push notifications on this device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "pushJobAlerts", label: "Job status updates" },
                { key: "pushMessages", label: "New messages" },
                { key: "pushReminders", label: "Reminders and deadlines" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor={item.key}>{item.label}</Label>
                  <Switch
                    id={item.key}
                    checked={
                      notifications[
                        item.key as keyof typeof notifications
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: checked,
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Receive important updates via SMS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsJobAlerts">Job alerts via SMS</Label>
                  <p className="text-sm text-gray-500">
                    Receive urgent job updates via text message
                  </p>
                </div>
                <Switch
                  id="smsJobAlerts"
                  checked={notifications.smsJobAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      smsJobAlerts: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Login & Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSecurity((prev) => ({ ...prev, twoFactor: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="loginAlerts">Login Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified of new sign-ins to your account
                  </p>
                </div>
                <Switch
                  id="loginAlerts"
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) =>
                    setSecurity((prev) => ({ ...prev, loginAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout</Label>
                <Select
                  value={security.sessionTimeout.toString()}
                  onValueChange={(value) =>
                    setSecurity((prev) => ({
                      ...prev,
                      sessionTimeout: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="0">Never (not recommended)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Automatically log out after period of inactivity
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Password</h3>
                <Button variant="outline">Change Password</Button>
                <p className="text-sm text-gray-500">
                  Last changed: 2 months ago
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Chrome on Windows</div>
                    <div className="text-sm text-gray-500">
                      Addis Ababa, Ethiopia • Current session
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Log Out
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Safari on iPhone</div>
                    <div className="text-sm text-gray-500">
                      Addis Ababa, Ethiopia • 2 days ago
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Set your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">Amharic</SelectItem>
                    <SelectItem value="or">Oromiffa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={profile.currency}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="east-africa">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east-africa">
                      East Africa Time (GMT+3)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
              <CardDescription>
                Set defaults for your job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-budget">Default Budget Range</Label>
                <Select defaultValue="500-2000">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100-500">₵ 100 - 500</SelectItem>
                    <SelectItem value="500-2000">₵ 500 - 2,000</SelectItem>
                    <SelectItem value="2000-5000">₵ 2,000 - 5,000</SelectItem>
                    <SelectItem value="5000+">₵ 5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-timeline">Default Timeline</Label>
                <Select defaultValue="within_week">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      Urgent (Today/Tomorrow)
                    </SelectItem>
                    <SelectItem value="within_week">
                      Within This Week
                    </SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Auto-Save Drafts</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Automatically save job postings as drafts
                  </p>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your billing information and subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Current Plan: Basic</div>
                    <div className="text-sm text-gray-600">
                      Free forever plan
                    </div>
                  </div>
                  <Button>Upgrade Plan</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Billing History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">March 2024</div>
                      <div className="text-sm text-gray-500">No charges</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">February 2024</div>
                      <div className="text-sm text-gray-500">No charges</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Tax Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                  <Input id="tax-id" placeholder="Enter your tax ID" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>
                Configure how you receive invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-invoices">Email Invoices</Label>
                  <p className="text-sm text-gray-500">
                    Receive invoices via email
                  </p>
                </div>
                <Switch id="email-invoices" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="paper-invoices">Paper Invoices</Label>
                  <p className="text-sm text-gray-500">
                    Receive printed invoices by mail
                  </p>
                </div>
                <Switch id="paper-invoices" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" className="text-red-600">
          Delete Account
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Help & Support */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-semibold">Need help with your settings?</div>
              <p className="text-sm text-gray-600">
                Contact our support team for assistance with your account
                settings.
              </p>
              <Button variant="link" className="p-0 h-auto">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
