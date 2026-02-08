"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, MapPin, ExternalLink, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditProfileModal from "@/components/edit-profile-modal"
import ImageCropperModal from "@/components/image-cropper-modal"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [likedProfiles, setLikedProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null)
  const [tempCoverPhotoUrl, setTempCoverPhotoUrl] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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

      // Set default profile image if not present
      if (!userData.profileImage) {
        userData.profileImage = "/placeholder.svg?height=128&width=128&text=User"
      }

      // Set default cover photo if not present
      if (!userData.coverPhoto) {
        userData.coverPhoto = "/placeholder.svg?height=300&width=900&text=Cover+Photo"
      }

      setUserData(userData)
      setCoverPhotoUrl(userData.coverPhoto)

      // Get liked profiles from session storage (if any)
      const likedProfilesStr = sessionStorage.getItem("likedProfiles")
      if (likedProfilesStr) {
        setLikedProfiles(JSON.parse(likedProfilesStr))
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/signup")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSaveProfile = (updatedData: any) => {
    // Update user data in state
    setUserData(updatedData)

    // Update user data in session storage
    const userDataStr = sessionStorage.getItem("pendingSignup")
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      const newUserData = { ...userData, ...updatedData }
      sessionStorage.setItem("pendingSignup", JSON.stringify(newUserData))
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const tempUrl = URL.createObjectURL(file)
      setTempCoverPhotoUrl(tempUrl)
      setIsCropperOpen(true)
    }
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setCoverPhotoUrl(croppedImageUrl)

    // Update user data with new cover photo
    const updatedUserData = { ...userData, coverPhoto: croppedImageUrl }
    setUserData(updatedUserData)

    // Update user data in session storage
    const userDataStr = sessionStorage.getItem("pendingSignup")
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      const newUserData = { ...userData, coverPhoto: croppedImageUrl }
      sessionStorage.setItem("pendingSignup", JSON.stringify(newUserData))
    }

    toast({
      title: "Cover Photo Updated",
      description: "Your cover photo has been updated successfully.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Mock skills based on user type
  const skills =
    userData.userType === "founder"
      ? ["Business Strategy", "Leadership", "Product Vision", "Marketing", "Fundraising"]
      : ["Product Design", "UX Design", "Frontend Development", "React", "TypeScript"]

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover photo */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={coverPhotoUrl || "/placeholder.svg?height=300&width=900&text=Cover+Photo"}
            alt="Cover photo"
            fill
            className="object-cover"
            priority
          />

          {/* Change cover photo button */}
          <div className="absolute bottom-4 right-4">
            <label htmlFor="coverPhoto" className="cursor-pointer">
              <div className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors text-foreground px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                <Camera className="size-4" />
                <span>Change</span>
              </div>
              <input
                id="coverPhoto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoChange}
              />
            </label>
          </div>
        </div>

        {/* Profile picture */}
        <div className="absolute left-8 -bottom-16 rounded-full border-4 border-background">
          <div className="w-32 h-32 rounded-full bg-muted overflow-hidden">
            <Image
              src={userData.profileImage || "/placeholder.svg?height=128&width=128&text=User"}
              alt={userData.fullName || userData.username}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="container pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{userData.fullName || userData.username}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="size-4" />
              <span>Los Angeles, United States</span>
            </div>
            {userData.currentStatus && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {userData.currentStatus}
                </Badge>
                {userData.userType === "founder" && userData.cofounderType && (
                  <Badge variant="outline" className="capitalize">
                    Seeking {userData.cofounderType} co-founder
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button className="gap-2" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="size-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* About section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-muted-foreground">{userData.about || userData.experience || "No information provided."}</p>
        </div>

        {/* Interests section */}
        {userData.interests && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Interests</h2>
            <p className="text-muted-foreground">{userData.interests}</p>
          </div>
        )}

        {/* Skills section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Social links */}
        {userData.socialLinks && Object.values(userData.socialLinks).some((link) => !!link) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Social Links</h2>
            <div className="flex flex-wrap gap-4">
              {userData.socialLinks.linkedin && (
                <a
                  href={userData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  LinkedIn <ExternalLink className="size-3" />
                </a>
              )}
              {userData.socialLinks.twitter && (
                <a
                  href={userData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Twitter <ExternalLink className="size-3" />
                </a>
              )}
              {userData.socialLinks.github && (
                <a
                  href={userData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  GitHub <ExternalLink className="size-3" />
                </a>
              )}
              {userData.socialLinks.instagram && (
                <a
                  href={userData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Instagram <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Connections section */}
        <div className="mt-12">
          <Tabs defaultValue="liked">
            <TabsList>
              <TabsTrigger value="liked">Liked Profiles</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="liked" className="mt-6">
              {likedProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedProfiles.map((profile) => (
                    <Card key={profile.id} className="overflow-hidden">
                      <div className="h-32 bg-muted">
                        <Image
                          src={profile.image || "/placeholder.svg"}
                          alt={profile.name}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-primary font-medium text-sm">{profile.role}</p>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{profile.bio}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {profile.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium">No liked profiles yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Start browsing and swipe right on profiles you're interested in.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/browse">Browse Profiles</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="matches" className="mt-6">
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-medium">No matches yet</h3>
                <p className="text-muted-foreground mt-2">
                  When someone you've liked also likes you, they'll appear here.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/browse">Browse Profiles</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />

      {/* Image Cropper Modal */}
      {tempCoverPhotoUrl && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageUrl={tempCoverPhotoUrl}
          onCropComplete={handleCropComplete}
          aspectRatio={3 / 1} // Cover photo aspect ratio
        />
      )}
    </div>
  )
}
