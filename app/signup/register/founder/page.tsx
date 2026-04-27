"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, User, Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import AuthLayout from "@/components/ui/auth-layout"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function FounderRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    experience: "",
    linkedin: "",
    twitter: "",
    github: "",
    instagram: "",
    currentStatus: "founder", // Default value
    cofounderType: "technical", // Default value
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [username, setUsername] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user came from role selection page
    const pendingSignup = sessionStorage.getItem("pendingSignup")
    if (!pendingSignup) {
      router.push("/signup")
      return
    }

    try {
      const userData = JSON.parse(pendingSignup)
      setUsername(userData.username || "")
      setFormData((prev) => ({
        ...prev,
        fullName: userData.username || "",
        email: userData.email || "",
      }))
    } catch (error) {
      router.push("/signup")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required"
    }

    if (!profileImage) {
      newErrors.profileImage = "Profile picture is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data in session storage for demo purposes
      const pendingSignup = sessionStorage.getItem("pendingSignup")
      if (pendingSignup) {
        const userData = JSON.parse(pendingSignup)
        userData.profileCompleted = true
        userData.userType = "founder"
        userData.fullName = formData.fullName
        userData.experience = formData.experience
        userData.socialLinks = {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          github: formData.github,
          instagram: formData.instagram,
        }
        userData.currentStatus = formData.currentStatus
        userData.cofounderType = formData.cofounderType

        // Store profile image
        if (profileImagePreview) {
          userData.profileImage = profileImagePreview
        }

        sessionStorage.setItem("pendingSignup", JSON.stringify(userData))
      }

      // Show success toast
      toast({
        title: "Registration Complete",
        description: "Your profile has been created successfully!",
      })

      // Redirect to home page or dashboard
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl text-zinc-50">Founder Profile</CardTitle>
        <CardDescription className="text-zinc-400">
          Complete your profile to find the perfect co-founder
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-950 flex items-center justify-center border-2 border-zinc-800">
              {profileImagePreview ? (
                <Image
                  src={profileImagePreview || "/placeholder.svg"}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="size-10 text-zinc-600" />
              )}
            </div>
            <div className="flex flex-col items-center">
              <Label
                htmlFor="profileImage"
                className="cursor-pointer flex items-center gap-2 text-zinc-300 hover:text-zinc-100 transition-colors text-sm"
              >
                <Upload className="size-4" />
                <span>Upload Profile Picture</span>
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
                disabled={isLoading}
              />
              {errors.profileImage && <p className="text-sm text-red-500 mt-1">{errors.profileImage}</p>}
            </div>
          </div>

          <div className="relative">
            <Separator className="bg-zinc-800" />
          </div>

          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="text-zinc-300">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.fullName ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Experience */}
          <div className="grid gap-2">
            <Label htmlFor="experience" className="text-zinc-300">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="Tell us about your professional background"
              value={formData.experience}
              onChange={handleChange}
              className={`bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 min-h-[80px] ${errors.experience ? "border-red-500" : ""}`}
              rows={3}
              disabled={isLoading}
            />
            {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
          </div>

          {/* Social Media Links */}
          <div className="grid gap-3">
            <Label className="text-zinc-300">Social Links</Label>

            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={handleChange}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="twitter"
                name="twitter"
                type="url"
                placeholder="Twitter URL"
                value={formData.twitter}
                onChange={handleChange}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="github"
                name="github"
                type="url"
                placeholder="GitHub URL"
                value={formData.github}
                onChange={handleChange}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="instagram"
                name="instagram"
                type="url"
                placeholder="Instagram URL"
                value={formData.instagram}
                onChange={handleChange}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Current Status */}
          <div className="grid gap-3">
            <Label className="text-zinc-300">Current Status</Label>
            <RadioGroup
              defaultValue={formData.currentStatus}
              onValueChange={(value) => handleRadioChange("currentStatus", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="founder" id="founder" className="border-zinc-700 text-zinc-50" />
                <Label htmlFor="founder" className="cursor-pointer text-zinc-400">
                  Founder
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entrepreneur" id="entrepreneur" className="border-zinc-700 text-zinc-50" />
                <Label htmlFor="entrepreneur" className="cursor-pointer text-zinc-400">
                  Entrepreneur
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Co-founder Type Preference */}
          <div className="grid gap-3">
            <Label className="text-zinc-300">Co-founder Preference</Label>
            <RadioGroup
              defaultValue={formData.cofounderType}
              onValueChange={(value) => handleRadioChange("cofounderType", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical" id="technical" className="border-zinc-700 text-zinc-50" />
                <Label htmlFor="technical" className="cursor-pointer text-zinc-400">
                  Technical Co-founder
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-technical" id="non-technical" className="border-zinc-700 text-zinc-50" />
                <Label htmlFor="non-technical" className="cursor-pointer text-zinc-400">
                  Non-Technical Co-founder
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full h-10 mt-1 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200" disabled={isLoading}>
            {isLoading ? "Completing Registration..." : "Complete Registration"}
          </Button>
        </form>
      </CardContent>
    </AuthLayout>
  )
}
