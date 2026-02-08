"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user came from signup page
    const pendingSignup = sessionStorage.getItem("pendingSignup")
    if (!pendingSignup) {
      router.push("/signup")
      return
    }

    try {
      const userData = JSON.parse(pendingSignup)
      setEmail(userData.email)
      setPhone(userData.phone)
    } catch (error) {
      router.push("/signup")
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    // Take only the last character if multiple characters are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a valid OTP (numbers only)
    if (!/^\d+$/.test(pastedData)) return

    const pastedOtp = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    pastedOtp.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "")
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const resendOtp = async () => {
    setCountdown(60)

    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your phone.",
    })

    // Start countdown again
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const verifyOtp = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits of the verification code")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any OTP is valid
      router.push("/signup/role")
    } catch (error) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <Link href="/signup" className="flex items-center gap-2">
          <ChevronLeft className="size-4" />
          <span>Back to Sign Up</span>
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
                Verify Your
                <br />
                Phone Number
              </h2>
              <p className="text-xl opacity-90 max-w-md">
                We've sent a verification code to your phone. Enter the code to continue your registration.
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
              <h1 className="text-3xl font-bold">Phone Verification</h1>
              <p className="text-muted-foreground mt-2">
                We've sent a verification code to <span className="font-medium">{phone || "your phone"}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold border border-border rounded-md bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button onClick={verifyOtp} className="w-full" disabled={isLoading || otp.join("").length !== 6}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
                <Button
                  variant="link"
                  onClick={resendOtp}
                  disabled={countdown > 0 || isLoading}
                  className="text-primary p-0 h-auto"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
