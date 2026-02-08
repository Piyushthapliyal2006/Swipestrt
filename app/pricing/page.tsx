"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  // Define pricing plans with both monthly and yearly prices
  const plans = [
    {
      name: "Simple",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      description: "Free plan for all users.",
      bgColor: "bg-pink-300",
      features: [
        "Store up to 20 businesses",
        "2 collaborators",
        "Unlimited collaboration",
        "End to end encryption",
        "Mac, PC, Android, iOS, and Browser",
      ],
      cta: "Get Started Free",
    },
    {
      name: "Efficient",
      monthlyPrice: "$15",
      yearlyPrice: "$12",
      description: "Ideal for individual creators.",
      bgColor: "bg-teal-300",
      features: [
        "Everything in Simple",
        "512GB of business storage",
        "Unlimited management",
        "Unlimited collaborators",
        "Links with password protection",
      ],
      cta: "Get Efficient Plan",
    },
    {
      name: "Team",
      monthlyPrice: "$25",
      yearlyPrice: "$20",
      description: "Small teams with up to 10 users.",
      bgColor: "bg-yellow-400",
      features: ["Everything in Efficient", "Unlimited team members", "Custom storage plans", "White label branding"],
      cta: "Get Team Plan",
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground relative">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Grid pattern with more visible lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--muted))_30%,transparent_80%)]"></div>

        {/* Additional ambient light effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

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

      <main className="flex-1 container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">Pricing</h1>

          <div className="flex items-center justify-center gap-4 bg-muted/70 rounded-full p-1.5 w-fit mx-auto border border-border">
            <span
              className={`px-4 py-1.5 rounded-full cursor-pointer transition-colors ${billingCycle === "monthly" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </span>
            <div className="relative w-12 h-6 bg-muted rounded-full border border-border">
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all ${billingCycle === "yearly" ? "left-7" : "left-1"}`}
              ></div>
            </div>
            <div className="flex items-center">
              <span
                className={`px-4 py-1.5 rounded-full cursor-pointer transition-colors ${billingCycle === "yearly" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </span>
              <span className="text-sm text-yellow-400 ml-1">(Save 20%)</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className={`${plan.bgColor} rounded-lg p-8 text-black shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1`}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">
                    {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  {plan.name !== "Simple" && <span className="text-sm ml-1">/month</span>}
                </div>
                <p className="text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-black hover:bg-black/80 text-white">{plan.cta}</Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
