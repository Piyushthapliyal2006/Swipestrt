"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User, Bell, Shield, CreditCard, HelpCircle, Search, Mail, Trash2, ChevronLeft, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

// Define the sections for the sidebar
const sections = [
  { id: "account", label: "Account Settings", icon: <User className="size-4" /> },
  { id: "discovery", label: "Discovery Preferences", icon: <Search className="size-4" /> },
  { id: "notifications", label: "Notification Settings", icon: <Bell className="size-4" /> },
  { id: "privacy", label: "Privacy & Security", icon: <Shield className="size-4" /> },
  { id: "subscription", label: "Subscription", icon: <CreditCard className="size-4" /> },
  { id: "support", label: "Support & Feedback", icon: <HelpCircle className="size-4" /> },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form states
  const [accountSettings, setAccountSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [discoverySettings, setDiscoverySettings] = useState({
    isVisible: true,
    preferredTraits: {
      technical: true,
      business: true,
      design: false,
      marketing: false,
      sales: false,
    },
    industryPreferences: {
      technology: true,
      healthcare: false,
      finance: false,
      education: false,
      ecommerce: true,
    },
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    matchAlerts: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    blockedUsers: [],
    messagePermission: "everyone", // "everyone", "matches", "nobody"
  })

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    currentPlan: "free", // "free", "pro", "enterprise"
    billingCycle: "monthly", // "monthly", "yearly"
    paymentMethod: null,
  })

  useEffect(() => {
    // Check if user is logged in
    const userDataStr = sessionStorage.getItem("pendingSignup")
    if (!userDataStr) {
      router.push("/signup")
      return
    }

    try {
      const userData = JSON.parse(userDataStr)
      if (!userData.profileCompleted) {
        router.push("/signup/role")
        return
      }
      setUserData(userData)

      // Initialize form states with user data
      setAccountSettings({
        ...accountSettings,
        email: userData.email || "",
      })

      // In a real app, you would fetch these settings from an API
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/signup")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSaveSettings = (section: string) => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // Update user data in session storage based on section
      const userDataStr = sessionStorage.getItem("pendingSignup")
      if (userDataStr) {
        const userData = JSON.parse(userDataStr)

        switch (section) {
          case "account":
            if (accountSettings.email) {
              userData.email = accountSettings.email
            }
            break
          case "discovery":
            userData.discoverySettings = discoverySettings
            break
          case "notifications":
            userData.notificationSettings = notificationSettings
            break
          case "privacy":
            userData.privacySettings = privacySettings
            break
          case "subscription":
            userData.subscriptionSettings = subscriptionSettings
            break
        }

        sessionStorage.setItem("pendingSignup", JSON.stringify(userData))
      }

      setIsSaving(false)
      setSaveSuccess(true)

      // Show success toast
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Clear user data from session storage
        sessionStorage.removeItem("pendingSignup")
        sessionStorage.removeItem("likedProfiles")

        // Show success toast
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully.",
        })

        // Redirect to home page
        router.push("/")
      }, 1500)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="size-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 font-bold">
            <Image src="/images/swipestart-logo.png" alt="SwipeStart Logo" width={32} height={32} className="size-8" />
            <span>SwipeStart</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="sticky top-24 space-y-1 rounded-lg border bg-card p-1 shadow-sm">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="rounded-lg border bg-card shadow-sm">
              {/* Account Settings */}
              {activeSection === "account" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && <span className="text-sm text-muted-foreground">Saving changes...</span>}
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check className="size-4" /> Changes saved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Change Email */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Email</h3>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={accountSettings.email}
                          onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                          placeholder="Enter your email address"
                        />
                      </div>
                      <Button onClick={() => handleSaveSettings("account")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Email"}
                      </Button>
                    </div>

                    <Separator />

                    {/* Update Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Update Password</h3>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={accountSettings.currentPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                          placeholder="Enter your new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={accountSettings.confirmPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                          placeholder="Confirm your new password"
                        />
                      </div>
                      <Button onClick={() => handleSaveSettings("account")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Update Password"}
                      </Button>
                    </div>

                    <Separator />

                    {/* Delete Account */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Delete Account</h3>
                      <p className="text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="size-4 mr-2" /> Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Discovery Preferences */}
              {activeSection === "discovery" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Discovery Preferences</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && <span className="text-sm text-muted-foreground">Saving changes...</span>}
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check className="size-4" /> Changes saved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Toggle Visibility */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Profile Visibility</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Show Profile</div>
                          <div className="text-sm text-muted-foreground">
                            {discoverySettings.isVisible
                              ? "Your profile is visible to other users"
                              : "Your profile is hidden from other users"}
                          </div>
                        </div>
                        <Switch
                          checked={discoverySettings.isVisible}
                          onCheckedChange={(checked) =>
                            setDiscoverySettings({ ...discoverySettings, isVisible: checked })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Preferred Co-founder Traits */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Preferred Co-founder Traits</h3>
                      <p className="text-sm text-muted-foreground">
                        Select the skills and traits you're looking for in a co-founder
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="technical"
                            checked={discoverySettings.preferredTraits.technical}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                preferredTraits: { ...discoverySettings.preferredTraits, technical: checked },
                              })
                            }
                          />
                          <Label htmlFor="technical">Technical Skills</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="business"
                            checked={discoverySettings.preferredTraits.business}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                preferredTraits: { ...discoverySettings.preferredTraits, business: checked },
                              })
                            }
                          />
                          <Label htmlFor="business">Business Acumen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="design"
                            checked={discoverySettings.preferredTraits.design}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                preferredTraits: { ...discoverySettings.preferredTraits, design: checked },
                              })
                            }
                          />
                          <Label htmlFor="design">Design Skills</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="marketing"
                            checked={discoverySettings.preferredTraits.marketing}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                preferredTraits: { ...discoverySettings.preferredTraits, marketing: checked },
                              })
                            }
                          />
                          <Label htmlFor="marketing">Marketing Experience</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sales"
                            checked={discoverySettings.preferredTraits.sales}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                preferredTraits: { ...discoverySettings.preferredTraits, sales: checked },
                              })
                            }
                          />
                          <Label htmlFor="sales">Sales Experience</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Industry Filter Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Industry Filter Preferences</h3>
                      <p className="text-sm text-muted-foreground">Select the industries you're interested in</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="technology"
                            checked={discoverySettings.industryPreferences.technology}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                industryPreferences: { ...discoverySettings.industryPreferences, technology: checked },
                              })
                            }
                          />
                          <Label htmlFor="technology">Technology</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="healthcare"
                            checked={discoverySettings.industryPreferences.healthcare}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                industryPreferences: { ...discoverySettings.industryPreferences, healthcare: checked },
                              })
                            }
                          />
                          <Label htmlFor="healthcare">Healthcare</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="finance"
                            checked={discoverySettings.industryPreferences.finance}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                industryPreferences: { ...discoverySettings.industryPreferences, finance: checked },
                              })
                            }
                          />
                          <Label htmlFor="finance">Finance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="education"
                            checked={discoverySettings.industryPreferences.education}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                industryPreferences: { ...discoverySettings.industryPreferences, education: checked },
                              })
                            }
                          />
                          <Label htmlFor="education">Education</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="ecommerce"
                            checked={discoverySettings.industryPreferences.ecommerce}
                            onCheckedChange={(checked) =>
                              setDiscoverySettings({
                                ...discoverySettings,
                                industryPreferences: { ...discoverySettings.industryPreferences, ecommerce: checked },
                              })
                            }
                          />
                          <Label htmlFor="ecommerce">E-commerce</Label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => handleSaveSettings("discovery")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Discovery Preferences"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === "notifications" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Notification Settings</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && <span className="text-sm text-muted-foreground">Saving changes...</span>}
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check className="size-4" /> Changes saved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive notifications about matches and messages via email
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">App Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive in-app notifications about matches and messages
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings.appNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, appNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Match Alerts</div>
                          <div className="text-sm text-muted-foreground">Get notified when you match with someone</div>
                        </div>
                        <Switch
                          checked={notificationSettings.matchAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({ ...notificationSettings, matchAlerts: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => handleSaveSettings("notifications")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Notification Settings"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Security */}
              {activeSection === "privacy" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Privacy & Security</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && <span className="text-sm text-muted-foreground">Saving changes...</span>}
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check className="size-4" /> Changes saved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Blocked Users */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Blocked Users</h3>
                      {privacySettings.blockedUsers.length > 0 ? (
                        <div className="space-y-2">
                          {privacySettings.blockedUsers.map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                  <User className="size-5 text-secondary-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setPrivacySettings({
                                    ...privacySettings,
                                    blockedUsers: privacySettings.blockedUsers.filter((_, i) => i !== index),
                                  })
                                }
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <p className="text-muted-foreground">You haven't blocked any users yet.</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Message Permissions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Message Permissions</h3>
                      <div className="space-y-2">
                        <Label htmlFor="messagePermission">Allow messages from:</Label>
                        <Select
                          value={privacySettings.messagePermission}
                          onValueChange={(value) =>
                            setPrivacySettings({ ...privacySettings, messagePermission: value })
                          }
                        >
                          <SelectTrigger id="messagePermission" className="w-full">
                            <SelectValue placeholder="Select who can message you" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="matches">Matches Only</SelectItem>
                            <SelectItem value="nobody">Nobody</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => handleSaveSettings("privacy")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Privacy Settings"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription */}
              {activeSection === "subscription" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Subscription</h2>
                    <div className="flex items-center gap-2">
                      {isSaving && <span className="text-sm text-muted-foreground">Saving changes...</span>}
                      {saveSuccess && (
                        <span className="flex items-center gap-1 text-sm text-green-500">
                          <Check className="size-4" /> Changes saved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Current Plan */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <div className="bg-muted p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold capitalize">
                              {subscriptionSettings.currentPlan === "free"
                                ? "Free Plan"
                                : subscriptionSettings.currentPlan === "pro"
                                  ? "Pro Plan"
                                  : "Enterprise Plan"}
                            </h4>
                            <p className="text-muted-foreground">
                              {subscriptionSettings.billingCycle === "monthly" ? "Billed Monthly" : "Billed Yearly"}
                            </p>
                          </div>
                          <Badge variant={subscriptionSettings.currentPlan === "free" ? "outline" : "default"}>
                            {subscriptionSettings.currentPlan === "free" ? "Current" : "Active"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="size-4 text-green-500" />
                            <span>Basic profile features</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="size-4 text-green-500" />
                            <span>Limited matches per day</span>
                          </div>
                          {subscriptionSettings.currentPlan !== "free" && (
                            <>
                              <div className="flex items-center gap-2">
                                <Check className="size-4 text-green-500" />
                                <span>Unlimited matches</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check className="size-4 text-green-500" />
                                <span>Advanced filtering</span>
                              </div>
                            </>
                          )}
                          {subscriptionSettings.currentPlan === "enterprise" && (
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Priority support</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Upgrade/Downgrade Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Upgrade Your Plan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          className={`border rounded-lg p-4 ${subscriptionSettings.currentPlan === "free" ? "bg-muted/50 border-primary" : ""}`}
                        >
                          <h4 className="font-bold text-lg">Free</h4>
                          <div className="text-2xl font-bold mt-2 mb-4">$0</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Basic profile</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>5 matches per day</span>
                            </div>
                          </div>
                          <Button
                            variant={subscriptionSettings.currentPlan === "free" ? "outline" : "default"}
                            className="w-full mt-4"
                            disabled={subscriptionSettings.currentPlan === "free"}
                            onClick={() => setSubscriptionSettings({ ...subscriptionSettings, currentPlan: "free" })}
                          >
                            {subscriptionSettings.currentPlan === "free" ? "Current Plan" : "Downgrade"}
                          </Button>
                        </div>

                        <div
                          className={`border rounded-lg p-4 ${subscriptionSettings.currentPlan === "pro" ? "bg-muted/50 border-primary" : ""}`}
                        >
                          <h4 className="font-bold text-lg">Pro</h4>
                          <div className="text-2xl font-bold mt-2 mb-4">
                            ${subscriptionSettings.billingCycle === "monthly" ? "19" : "190"}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{subscriptionSettings.billingCycle === "monthly" ? "month" : "year"}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>All Free features</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Unlimited matches</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Advanced filtering</span>
                            </div>
                          </div>
                          <Button
                            variant={subscriptionSettings.currentPlan === "pro" ? "outline" : "default"}
                            className="w-full mt-4"
                            disabled={subscriptionSettings.currentPlan === "pro"}
                            onClick={() => setSubscriptionSettings({ ...subscriptionSettings, currentPlan: "pro" })}
                          >
                            {subscriptionSettings.currentPlan === "pro"
                              ? "Current Plan"
                              : subscriptionSettings.currentPlan === "enterprise"
                                ? "Downgrade"
                                : "Upgrade"}
                          </Button>
                        </div>

                        <div
                          className={`border rounded-lg p-4 ${subscriptionSettings.currentPlan === "enterprise" ? "bg-muted/50 border-primary" : ""}`}
                        >
                          <h4 className="font-bold text-lg">Enterprise</h4>
                          <div className="text-2xl font-bold mt-2 mb-4">
                            ${subscriptionSettings.billingCycle === "monthly" ? "49" : "490"}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{subscriptionSettings.billingCycle === "monthly" ? "month" : "year"}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>All Pro features</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Priority matching</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-green-500" />
                              <span>Dedicated support</span>
                            </div>
                          </div>
                          <Button
                            variant={subscriptionSettings.currentPlan === "enterprise" ? "outline" : "default"}
                            className="w-full mt-4"
                            disabled={subscriptionSettings.currentPlan === "enterprise"}
                            onClick={() =>
                              setSubscriptionSettings({ ...subscriptionSettings, currentPlan: "enterprise" })
                            }
                          >
                            {subscriptionSettings.currentPlan === "enterprise" ? "Current Plan" : "Upgrade"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Billing Cycle */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing Cycle</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="monthly"
                            name="billingCycle"
                            checked={subscriptionSettings.billingCycle === "monthly"}
                            onChange={() =>
                              setSubscriptionSettings({ ...subscriptionSettings, billingCycle: "monthly" })
                            }
                            className="h-4 w-4 text-primary"
                          />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="yearly"
                            name="billingCycle"
                            checked={subscriptionSettings.billingCycle === "yearly"}
                            onChange={() =>
                              setSubscriptionSettings({ ...subscriptionSettings, billingCycle: "yearly" })
                            }
                            className="h-4 w-4 text-primary"
                          />
                          <Label htmlFor="yearly">Yearly (Save 20%)</Label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button onClick={() => handleSaveSettings("subscription")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Subscription Settings"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Support & Feedback */}
              {activeSection === "support" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Support & Feedback</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Help Center / FAQs */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Help Center</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h4 className="font-medium">Getting Started</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Learn how to set up your profile and start matching
                          </p>
                        </div>
                        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h4 className="font-medium">Account Settings</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Manage your account, privacy, and security settings
                          </p>
                        </div>
                        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h4 className="font-medium">Matching Algorithm</h4>
                          <p className="text-sm text-muted-foreground mt-1">Learn how our matching algorithm works</p>
                        </div>
                        <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h4 className="font-medium">Billing & Subscriptions</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Manage your subscription and payment methods
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-2">
                        View All Help Articles
                      </Button>
                    </div>

                    <Separator />

                    {/* Report a Bug */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Report a Bug</h3>
                      <div className="space-y-2">
                        <Label htmlFor="bugDescription">Describe the issue</Label>
                        <Textarea
                          id="bugDescription"
                          placeholder="Please provide details about the bug you encountered..."
                          rows={4}
                        />
                      </div>
                      <Button>Submit Bug Report</Button>
                    </div>

                    <Separator />

                    {/* Submit Feedback */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Submit Feedback</h3>
                      <div className="space-y-2">
                        <Label htmlFor="feedbackType">Feedback Type</Label>
                        <Select defaultValue="suggestion">
                          <SelectTrigger id="feedbackType" className="w-full">
                            <SelectValue placeholder="Select feedback type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="suggestion">Suggestion</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="praise">Praise</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedbackDescription">Your Feedback</Label>
                        <Textarea
                          id="feedbackDescription"
                          placeholder="We value your feedback! Please share your thoughts..."
                          rows={4}
                        />
                      </div>
                      <Button>Submit Feedback</Button>
                    </div>

                    <Separator />

                    {/* Contact Support */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Contact Support</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 border rounded-lg p-4">
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Send us an email and we'll get back to you within 24 hours
                          </p>
                          <Button variant="outline" className="mt-4">
                            <Mail className="size-4 mr-2" /> support@swipestart.com
                          </Button>
                        </div>
                        <div className="flex-1 border rounded-lg p-4">
                          <h4 className="font-medium">Live Chat</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Chat with our support team in real-time during business hours
                          </p>
                          <Button className="mt-4">Start Live Chat</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
