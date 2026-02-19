"use client";

import React, { useState } from "react";
import {
  Save,
  Shield,
  Bell,
  CreditCard,
  Users,
  Globe,
  Key,
  AlertCircle,
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

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    platform: {
      name: "Habesha Skills Hub",
      supportEmail: "support@habesha-skills.com",
      supportPhone: "+251 911 234 567",
      commissionRate: 10,
      currency: "ETB",
      timezone: "Africa/Addis_Ababa",
      maintenanceMode: false,
    },
    security: {
      require2FA: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      ipWhitelist: "",
    },
    notifications: {
      emailAdminAlerts: true,
      emailReports: true,
      pushSystemAlerts: true,
      smsCriticalAlerts: false,
      discordWebhook: "",
    },
    payment: {
      autoPayout: true,
      payoutThreshold: 1000,
      holdPeriod: 24,
      allowedMethods: ["telebirr", "cbe", "bank"],
      commissionFee: 10,
    },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-red-600">
            Reset All
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="platform" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-8">
          <TabsTrigger value="platform">
            <Globe className="h-4 w-4 mr-2" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>
                Basic platform details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platform.name}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: { ...prev.platform, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.platform.supportEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: {
                          ...prev.platform,
                          supportEmail: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.platform.supportPhone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: {
                          ...prev.platform,
                          supportPhone: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="50"
                    value={settings.platform.commissionRate}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: {
                          ...prev.platform,
                          commissionRate: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.platform.currency}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: { ...prev.platform, currency: value },
                      }))
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
                  <Select
                    value={settings.platform.timezone}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        platform: { ...prev.platform, timezone: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Addis_Ababa">
                        Addis Ababa (GMT+3)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable the platform for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.platform.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      platform: { ...prev.platform, maintenanceMode: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require2FA">Require 2FA for Admins</Label>
                    <p className="text-sm text-gray-500">
                      All admin accounts must use two-factor authentication
                    </p>
                  </div>
                  <Switch
                    id="require2FA"
                    checked={settings.security.require2FA}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, require2FA: checked },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Select
                    value={settings.security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          sessionTimeout: parseInt(value),
                        },
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">
                      Minimum Password Length
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min="6"
                      max="32"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordMinLength: parseInt(e.target.value) || 8,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            maxLoginAttempts: parseInt(e.target.value) || 5,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP Whitelist (Optional)</Label>
                  <Textarea
                    id="ipWhitelist"
                    placeholder="Enter IP addresses, one per line"
                    value={settings.security.ipWhitelist}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          ipWhitelist: e.target.value,
                        },
                      }))
                    }
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Restrict admin access to specific IP addresses. Leave empty
                    to allow all.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Security Recommendations
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Enable 2FA for all admin accounts</li>
                    <li>• Regularly rotate admin passwords</li>
                    <li>• Review admin access logs weekly</li>
                    <li>• Restrict access to production database</li>
                    <li>
                      • Implement IP whitelisting for sensitive operations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive platform notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailAdminAlerts">Email Admin Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Critical platform alerts via email
                    </p>
                  </div>
                  <Switch
                    id="emailAdminAlerts"
                    checked={settings.notifications.emailAdminAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailAdminAlerts: checked,
                        },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailReports">Daily/Weekly Reports</Label>
                    <p className="text-sm text-gray-500">
                      Platform performance reports via email
                    </p>
                  </div>
                  <Switch
                    id="emailReports"
                    checked={settings.notifications.emailReports}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailReports: checked,
                        },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushSystemAlerts">Push System Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Real-time system notifications
                    </p>
                  </div>
                  <Switch
                    id="pushSystemAlerts"
                    checked={settings.notifications.pushSystemAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          pushSystemAlerts: checked,
                        },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsCriticalAlerts">
                      SMS Critical Alerts
                    </Label>
                    <p className="text-sm text-gray-500">
                      Urgent alerts via SMS (system downtime, security issues)
                    </p>
                  </div>
                  <Switch
                    id="smsCriticalAlerts"
                    checked={settings.notifications.smsCriticalAlerts}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          smsCriticalAlerts: checked,
                        },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                  <Input
                    id="discordWebhook"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={settings.notifications.discordWebhook}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          discordWebhook: e.target.value,
                        },
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500">
                    For sending notifications to Discord channels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment processing and payout settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoPayout">Auto Payout</Label>
                    <p className="text-sm text-gray-500">
                      Automatically process provider payouts
                    </p>
                  </div>
                  <Switch
                    id="autoPayout"
                    checked={settings.payment.autoPayout}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: { ...prev.payment, autoPayout: checked },
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="payoutThreshold">
                      Payout Threshold (ETB)
                    </Label>
                    <Input
                      id="payoutThreshold"
                      type="number"
                      value={settings.payment.payoutThreshold}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            payoutThreshold: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                    <p className="text-sm text-gray-500">
                      Minimum amount for automatic payout
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holdPeriod">Hold Period (hours)</Label>
                    <Input
                      id="holdPeriod"
                      type="number"
                      value={settings.payment.holdPeriod}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            holdPeriod: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                    <p className="text-sm text-gray-500">
                      Time to hold funds before payout
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allowed Payment Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {["telebirr", "cbe", "bank", "cash"].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`method-${method}`}
                          checked={settings.payment.allowedMethods.includes(
                            method
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings((prev) => ({
                                ...prev,
                                payment: {
                                  ...prev.payment,
                                  allowedMethods: [
                                    ...prev.payment.allowedMethods,
                                    method,
                                  ],
                                },
                              }));
                            } else {
                              setSettings((prev) => ({
                                ...prev,
                                payment: {
                                  ...prev.payment,
                                  allowedMethods:
                                    prev.payment.allowedMethods.filter(
                                      (m) => m !== method
                                    ),
                                },
                              }));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`method-${method}`}
                          className="text-sm font-normal capitalize"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionFee">Platform Commission (%)</Label>
                  <Input
                    id="commissionFee"
                    type="number"
                    min="0"
                    max="50"
                    value={settings.payment.commissionFee}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        payment: {
                          ...prev.payment,
                          commissionFee: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <p className="text-sm text-gray-500">
                    Percentage taken from each transaction
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management Settings</CardTitle>
              <CardDescription>
                Configure user registration and management policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireVerification">
                      Require Verification
                    </Label>
                    <p className="text-sm text-gray-500">
                      Require ID verification for all providers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoApproveClients">
                      Auto-Approve Clients
                    </Label>
                    <p className="text-sm text-gray-500">
                      Automatically approve new client registrations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="suspensionPolicy">
                    Account Suspension Policy
                  </Label>
                  <Select defaultValue="14">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">
                        7 days for first offense
                      </SelectItem>
                      <SelectItem value="14">
                        14 days for first offense
                      </SelectItem>
                      <SelectItem value="30">
                        30 days for first offense
                      </SelectItem>
                      <SelectItem value="permanent">
                        Permanent for serious violations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ratingThreshold">
                    Minimum Rating Threshold
                  </Label>
                  <Input
                    id="ratingThreshold"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue="3.5"
                  />
                  <p className="text-sm text-gray-500">
                    Providers below this rating get warning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Important Notes
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>
                      • Changes to commission rates affect future transactions
                      only
                    </li>
                    <li>
                      • Payment method changes require provider notification
                    </li>
                    <li>
                      • Security settings changes may require admin
                      re-authentication
                    </li>
                    <li>• Always test notification settings after changes</li>
                    <li>• Document all configuration changes in changelog</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
