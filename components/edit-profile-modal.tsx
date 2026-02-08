"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, User, Mail, Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  onSave: (updatedData: any) => void
}

export default function EditProfileModal({ isOpen, onClose, userData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    about: userData?.about || userData?.experience || "",
    interests: userData?.interests || "",
    currentStatus: userData?.currentStatus || "",
    socialLinks: {
      linkedin: userData?.socialLinks?.linkedin || "",
      twitter: userData?.socialLinks?.twitter || "",
      github: userData?.socialLinks?.github || "",
      instagram: userData?.socialLinks?.instagram || "",
    },
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would upload the image to a server here
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Prepare updated user data
      const updatedUserData = {
        ...userData,
        ...formData,
        profileImage: profileImagePreview || userData?.profileImage,
      }

      // Call the onSave callback with the updated data
      onSave(updatedUserData)

      // Show success toast
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      // Close the modal
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Close modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                  {profileImagePreview || userData?.profileImage ? (
                    <Image
                      src={profileImagePreview || userData?.profileImage || "/placeholder.svg"}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="size-16 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <Label
                    htmlFor="profileImage"
                    className="cursor-pointer flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Upload className="size-4" />
                    <span>Change Profile Picture</span>
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              {/* About */}
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Tell us about yourself"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Textarea
                  id="interests"
                  name="interests"
                  placeholder="What are your interests?"
                  value={formData.interests}
                  onChange={handleChange}
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Current Status */}
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status</Label>
                <Input
                  id="currentStatus"
                  name="currentStatus"
                  type="text"
                  placeholder="e.g., Founder, Entrepreneur, Developer"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <Label>Social Media Links</Label>

                <div className="relative">
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    placeholder="LinkedIn URL"
                    value={formData.socialLinks.linkedin}
                    onChange={handleSocialLinkChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                <div className="relative">
                  <Input
                    id="twitter"
                    name="twitter"
                    type="url"
                    placeholder="Twitter URL"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialLinkChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                <div className="relative">
                  <Input
                    id="github"
                    name="github"
                    type="url"
                    placeholder="GitHub URL"
                    value={formData.socialLinks.github}
                    onChange={handleSocialLinkChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                <div className="relative">
                  <Input
                    id="instagram"
                    name="instagram"
                    type="url"
                    placeholder="Instagram URL"
                    value={formData.socialLinks.instagram}
                    onChange={handleSocialLinkChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
