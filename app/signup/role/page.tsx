"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Briefcase, Users, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

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
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <Link href="/signup/verify" className="flex items-center gap-2">
          <ChevronLeft className="size-4" />
          <span>Back to Verification</span>
        </Link>
        <div className="flex items-center gap-2 font-bold">
          <Image src="/images/swipestart-logo.png" alt="SwipeStart Logo" width={32} height={32} className="size-8" />
          <span>SwipeStart</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/40"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="relative z-10 flex flex-col justify-center px-12 py-24 text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-5xl font-bold mb-6">
                Almost There,
                <br />
                {username || "User"}!
              </h2>
              <p className="text-xl opacity-90 max-w-md">
                Tell us about your role so we can personalize your experience and connect you with the right people.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Choose Your Role</h1>
              <p className="text-muted-foreground mt-2">Select the option that best describes your current situation</p>
            </div>

            <div className="space-y-6">
              <div
                className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedRole === "founder"
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("founder")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      selectedRole === "founder" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">I'm a Founder</h3>
                    <p className="text-muted-foreground text-sm">
                      I have a startup idea or existing business and I'm looking for a co-founder to join me.
                    </p>
                  </div>
                  {selectedRole === "founder" && (
                    <CheckCircle2 className="absolute top-4 right-4 size-5 text-primary" />
                  )}
                </div>
              </div>

              <div
                className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedRole === "cofounder"
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedRole("cofounder")}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      selectedRole === "cofounder" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">I'm a Co-Founder</h3>
                    <p className="text-muted-foreground text-sm">
                      I want to join an existing startup and contribute my skills and expertise.
                    </p>
                  </div>
                  {selectedRole === "cofounder" && (
                    <CheckCircle2 className="absolute top-4 right-4 size-5 text-primary" />
                  )}
                </div>
              </div>

              <Button onClick={handleContinue} className="w-full" disabled={isLoading || !selectedRole}>
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
