"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AuthLayout from "@/components/ui/auth-layout"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Phone number is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      sessionStorage.setItem(
        "pendingSignup",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        }),
      )

      // Navigate to OTP verification page
      router.push("/signup/verify")
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
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl text-zinc-50">Create an account</CardTitle>
        <CardDescription className="text-zinc-400">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
            disabled={isLoading}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900/80"
            disabled={isLoading}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Google
          </Button>
        </div>

        <div className="relative">
          <Separator className="bg-zinc-800" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
            or continue with
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-zinc-300">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="yourusername"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.username ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.phone ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.password ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 ${errors.confirmPassword ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full h-10 mt-2 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
        Already have an account?
        <Link className="ml-1 text-zinc-200 hover:underline" href="/login">
          Log in
        </Link>
      </CardFooter>
    </AuthLayout>
  )
}
