"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import AuthLayout from "@/components/ui/auth-layout"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<"founder" | "cofounder" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user came from verification page
    const pendingSignup = sessionStorage.getItem("pendingSignup")
    if (!pendingSignup) {
      router.push("/signup")
      return
    }

    try {
      const userData = JSON.parse(pendingSignup)
      setUsername(userData.username)
    } catch (error) {
      router.push("/signup")
    }
  }, [router])

  const handleContinue = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    try {
      // Store role in session storage
      const pendingSignup = sessionStorage.getItem("pendingSignup")
      if (pendingSignup) {
        const userData = JSON.parse(pendingSignup)
        userData.role = selectedRole
        sessionStorage.setItem("pendingSignup", JSON.stringify(userData))
      }

      // Redirect to the appropriate registration page based on role
      if (selectedRole === "founder") {
        router.push("/signup/register/founder")
      } else {
        router.push("/signup/register/cofounder")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl text-zinc-50">Choose Your Role</CardTitle>
        <CardDescription className="text-zinc-400">
          Almost there, <span className="text-zinc-300 font-medium">{username || "User"}</span>! Select your role to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div
          className={`relative p-5 border rounded-xl cursor-pointer transition-all ${
            selectedRole === "founder"
              ? "border-zinc-500 bg-zinc-800/50"
              : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
          }`}
          onClick={() => setSelectedRole("founder")}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full ${
                selectedRole === "founder" ? "bg-zinc-50 text-zinc-900" : "bg-zinc-900 text-zinc-400"
              }`}
            >
              <Briefcase className="size-5" />
            </div>
            <div>
              <h3 className={`font-medium text-lg mb-1 ${selectedRole === "founder" ? "text-zinc-50" : "text-zinc-300"}`}>I'm a Founder</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                I have a startup idea or business and I'm looking for a co-founder.
              </p>
            </div>
            {selectedRole === "founder" && (
              <CheckCircle2 className="absolute top-4 right-4 size-5 text-zinc-50" />
            )}
          </div>
        </div>

        <div
          className={`relative p-5 border rounded-xl cursor-pointer transition-all ${
            selectedRole === "cofounder"
              ? "border-zinc-500 bg-zinc-800/50"
              : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
          }`}
          onClick={() => setSelectedRole("cofounder")}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full ${
                selectedRole === "cofounder" ? "bg-zinc-50 text-zinc-900" : "bg-zinc-900 text-zinc-400"
              }`}
            >
              <Users className="size-5" />
            </div>
            <div>
              <h3 className={`font-medium text-lg mb-1 ${selectedRole === "cofounder" ? "text-zinc-50" : "text-zinc-300"}`}>I'm a Co-Founder</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                I want to join an existing startup and contribute my skills.
              </p>
            </div>
            {selectedRole === "cofounder" && (
              <CheckCircle2 className="absolute top-4 right-4 size-5 text-zinc-50" />
            )}
          </div>
        </div>

        <Button 
          onClick={handleContinue} 
          className="w-full h-10 mt-2 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200" 
          disabled={isLoading || !selectedRole}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </CardContent>
    </AuthLayout>
  )
}
