"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  DollarSign,
  Globe,
  User,
  Smartphone,
  Save,
  Mail,
  Lock,
  CreditCard,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProviderSettingsPage() {
  const [settings, setSettings] = useState({
    email: "samuel@example.com",
    phone: "+251 91 234 5678",
    language: "en",
    currency: "ETB",
    notifications: {
      email: true,
      sms: true,
      push: true,
      jobAlerts: true,
      messageAlerts: true,
      reviewAlerts: true,
    },
    privacy: {
      profilePublic: true,
      showEarnings: false,
      showLocation: true,
      allowMessages: true,
    },
    payment: {
      autoWithdraw: false,
      threshold: "5000",
      payoutMethod: "bank",
    },
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Save settings logic here
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and settings
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-8">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="payment">
            <DollarSign className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email Address</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      setSettings({ ...settings, language: value })
                    }
                  >
                    <SelectTrigger>
                      <Globe className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      setSettings({ ...settings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <DollarSign className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select defaultValue="addis">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addis">
                        East Africa Time (EAT)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Job Alerts</Label>
                        <p className="text-sm text-gray-500">
                          New jobs matching your profile
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.jobAlerts}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("jobAlerts", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Message Alerts</Label>
                        <p className="text-sm text-gray-500">
                          New messages from clients
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.messageAlerts}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("messageAlerts", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">
                          App notifications on your device
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("push", checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Review Alerts</Label>
                        <p className="text-sm text-gray-500">
                          New reviews from clients
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.reviewAlerts}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("reviewAlerts", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-gray-500">
                      Allow clients to view your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.profilePublic}
                    onCheckedChange={(checked) =>
                      handlePrivacyChange("profilePublic", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Earnings Publicly</Label>
                    <p className="text-sm text-gray-500">
                      Display your earnings statistics
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showEarnings}
                    onCheckedChange={(checked) =>
                      handlePrivacyChange("showEarnings", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Location</Label>
                    <p className="text-sm text-gray-500">
                      Show your approximate location to clients
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.showLocation}
                    onCheckedChange={(checked) =>
                      handlePrivacyChange("showLocation", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-gray-500">
                      Allow clients to message you directly
                    </p>
                  </div>
                  <Switch
                    checked={settings.privacy.allowMessages}
                    onCheckedChange={(checked) =>
                      handlePrivacyChange("allowMessages", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Withdraw</Label>
                    <p className="text-sm text-gray-500">
                      Automatically withdraw when balance reaches threshold
                    </p>
                  </div>
                  <Switch
                    checked={settings.payment.autoWithdraw}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, autoWithdraw: checked },
                      })
                    }
                  />
                </div>
                {settings.payment.autoWithdraw && (
                  <div>
                    <Label>Withdrawal Threshold</Label>
                    <Input
                      value={settings.payment.threshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            threshold: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <Label>Default Payout Method</Label>
                  <Select
                    value={settings.payment.payoutMethod}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, payoutMethod: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <CreditCard className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Tax ID / TIN</Label>
                    <Input placeholder="Enter your tax identification number" />
                  </div>
                  <div>
                    <Label>Business Registration Number</Label>
                    <Input placeholder="Enter business registration number" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Upload Tax Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Dashboard Density</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger>
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
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
