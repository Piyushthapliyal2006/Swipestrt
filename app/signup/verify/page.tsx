"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import AuthLayout from "@/components/ui/auth-layout"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

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
    <AuthLayout>
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl text-zinc-50">Verify Phone</CardTitle>
        <CardDescription className="text-zinc-400">
          We've sent a verification code to <span className="font-medium text-zinc-300">{phone || "your phone"}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-bold rounded-md bg-zinc-950 border border-zinc-800 text-zinc-50 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <Button 
          onClick={verifyOtp} 
          className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200" 
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-zinc-400 mb-2">Didn't receive the code?</p>
          <Button
            variant="link"
            onClick={resendOtp}
            disabled={countdown > 0 || isLoading}
            className="text-zinc-300 hover:text-zinc-50 p-0 h-auto"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
          </Button>
        </div>
      </CardContent>
    </AuthLayout>
  )
}
