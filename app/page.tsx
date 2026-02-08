"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight, Menu, X, Moon, Sun, ArrowRight, Star, Zap, Shield, Users, BarChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import UserDropdown from "@/components/user-dropdown"
import { DottedSurface } from "@/components/ui/dotted-surface"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Refs for scroll targets
  const topRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Smooth scroll function
  const scrollToSection = (elementRef: React.RefObject<HTMLDivElement>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    setMobileMenuOpen(false)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Smart Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce errors.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Advanced Analytics",
      description: "Gain valuable insights with real-time data visualization and reporting.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with integrated communication tools.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description: "Keep your data safe with end-to-end encryption and compliance features.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Seamless Integration",
      description: "Connect with your favorite tools through our extensive API ecosystem.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      icon: <Star className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col relative" ref={topRef}>
      {/* Animated Dotted Surface Background */}
      <DottedSurface />

      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/images/swipestart-logo.png" alt="SwipeStart Logo" width={32} height={32} className="size-8" />
            <span>SwipeStart</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => scrollToSection(topRef)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FEATURES
            </button>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              PRICING
            </Link>
            <Link
              href="/browse"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              BROWSE
            </Link>
            <button
              onClick={() => scrollToSection(faqRef)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </button>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-colors duration-300"
            >
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <UserDropdown />
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-colors duration-300"
            >
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <button className="py-2 text-sm font-medium text-left" onClick={() => scrollToSection(topRef)}>
                HOME
              </button>
              <button className="py-2 text-sm font-medium text-left" onClick={() => scrollToSection(featuresRef)}>
                FEATURES
              </button>
              <Link href="/pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                PRICING
              </Link>
              <Link href="/browse" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                BROWSE
              </Link>
              <button className="py-2 text-sm font-medium text-left" onClick={() => scrollToSection(faqRef)}>
                FAQ
              </button>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/profile" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="rounded-full">
                    Sign Up
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Launching Soon
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Find Your Co-Founder Today
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The platform designed to connect founders with suitable co-founders based on their needs and interests.
                Find the perfect match to build your startup dream team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="rounded-full h-12 px-8 text-base">
                    Join Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-transparent">
                  Explore More
                </Button>
              </div>
              <div className="mt-6"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/original-5abae4c9c018698b5989e4a99fa4d82c.jpg-rW2QmKId7Wi2W2QuyKq9ENIGGEZbYS.jpeg"
                  alt="Co-founder collaboration illustration"
                  className="w-full h-auto rounded-xl object-cover"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">Trusted by innovative companies worldwide</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={`/placeholder-0fk2h.png?height=32&width=120&text=Logo${i}`}
                    alt={`Company logo ${i}`}
                    width={120}
                    height={32}
                    className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-20 md:py-32 bg-background text-foreground relative"
          ref={featuresRef}
        >
          <div className="container px-4 md:px-6 mx-auto">
            {/* Feature 1: Smart Matching System */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <div className="inline-block p-2 bg-pink-600/20 rounded-full mb-4">
                  <div className="bg-pink-600 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M12 2a5 5 0 0 0-5 5v14a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z"></path>
                      <path d="M9 9h6"></path>
                      <path d="M9 13h6"></path>
                      <path d="M9 17h6"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Smart matching system</h2>
                <p className="text-lg text-muted-foreground">
                  Find a co-founder that complements your weaknesses. Our algorithm analyzes skills, experience, and
                  goals to suggest perfect matches.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>AI-powered compatibility scoring</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Weekly curated introductions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Skill gap analysis</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="h-8 bg-card flex items-center px-4 border-b border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">app.swipestart.io/match</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-3 ${i === 5 ? "bg-muted ring-2 ring-green-500" : "bg-muted/50"}`}
                        >
                          <div className="w-full aspect-square rounded-full bg-muted/70 mb-2 overflow-hidden">
                            <Image
                              src={`/placeholder-60x60.png?height=60&width=60&text=${i}`}
                              alt="Profile"
                              width={60}
                              height={60}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs font-medium truncate">User {i}</div>
                          <div className="text-xs text-muted-foreground truncate">Role</div>
                          {i === 5 && (
                            <div className="mt-2 text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-center">
                              95% Match
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Detailed Profile View */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24 md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <div className="inline-block p-2 bg-blue-600/20 rounded-full mb-4">
                  <div className="bg-blue-600 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Detailed profile view</h2>
                <p className="text-lg text-muted-foreground">
                  Make snap decisions with digestible profile summaries or dive deeper if they pique your interest.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Skill visualization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Portfolio and past projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Verified credentials</span>
                  </li>
                </ul>
              </div>
              <div className="relative md:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-xl"></div>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="h-8 bg-card flex items-center px-4 border-b border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">app.swipestart.io/profile</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-muted/70 overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=64&width=64&text=SW"
                            alt="Profile"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Steve Wozniak</h3>
                          <p className="text-blue-400">Engineer</p>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4 mb-4">
                        <p className="text-sm text-card-foreground">
                          Bringing the best user experiences to life through innovative technology solutions and
                          creative problem-solving.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Design</p>
                          <div className="h-2 bg-muted/70 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Engineering</p>
                          <div className="h-2 bg-muted/70 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Marketing</p>
                          <div className="h-2 bg-muted/70 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Contact Easily with Social Media */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <div className="inline-block p-2 bg-purple-600/20 rounded-full mb-4">
                  <div className="bg-purple-600 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Contact easily with social media</h2>
                <p className="text-lg text-muted-foreground">
                  Connect with potential co-founders through their preferred channels. No more dead-end messaging.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Direct messaging platform</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Social media integration</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Meeting scheduler</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg blur-xl"></div>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="h-8 bg-card flex items-center px-4 border-b border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">app.swipestart.io/schedule</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <h3 className="font-medium mb-4">What time works best for you?</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="text-sm">Any time, pick for me.</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-purple-500 mr-2 flex-shrink-0"></div>
                          <span className="text-sm">Preferred time</span>
                        </div>
                      </div>
                      <h3 className="font-medium mt-6 mb-4">What time?</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-purple-500 mr-2 flex-shrink-0"></div>
                          <span className="text-sm">Morning</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="text-sm">Evening</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="text-sm">Between two times</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Customize Your Own Filter */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24 md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <div className="inline-block p-2 bg-yellow-600/20 rounded-full mb-4">
                  <div className="bg-yellow-600 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Customize your own filter</h2>
                <p className="text-lg text-muted-foreground">
                  Filter co-founder matches by the things that matter most to you. Set your preferences and find your
                  perfect match.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Advanced filtering options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Save custom filters</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Location and remote preferences</span>
                  </li>
                </ul>
              </div>
              <div className="relative md:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg blur-xl"></div>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="h-8 bg-card flex items-center px-4 border-b border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">app.swipestart.io/filters</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Skills</h3>
                          <div className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                            Required
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                            UI Design
                          </div>
                          <div className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                            Software Development
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <h3 className="font-medium mb-2">Stage</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Idea</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Prototype</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <h3 className="font-medium mb-2">Experience</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">First-time founder</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Serial entrepreneur</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <h3 className="font-medium mb-2">Work preference</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Remote</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">In-person</span>
                          <div className="w-4 h-4 border border-gray-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Community Success Stories */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block p-2 bg-green-600/20 rounded-full mb-4">
                  <div className="bg-green-600 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                      <path d="M12 7c1.5 0 2.5.5 3 1"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Community success stories</h2>
                <p className="text-lg text-muted-foreground">
                  Get inspired by real success stories from founders who met on our platform and built amazing startups
                  together.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Real founder testimonials</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Case studies of successful startups</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 bg-green-500/20 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Funding and growth metrics</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-xl"></div>
                <div className="relative border border-border rounded-lg overflow-hidden shadow-md">
                  <div className="h-8 bg-card flex items-center px-4 border-b border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-muted-foreground">app.swipestart.io/stories</div>
                  </div>
                  <div className="bg-card p-4">
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted/70 border-2 border-border overflow-hidden">
                              <Image
                                src="/placeholder.svg?height=32&width=32&text=A"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-muted/70 border-2 border-border overflow-hidden">
                              <Image
                                src="/placeholder.svg?height=32&width=32&text=B"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium">Alex & Ben</h3>
                            <p className="text-xs text-muted-foreground">Co-founders of TechFlow</p>
                          </div>
                          <div className="ml-auto bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
                            $2.5M Raised
                          </div>
                        </div>
                        <p className="text-sm text-card-foreground">
                          "We met on SwipeStart in 2022 and immediately clicked. Our complementary skills in product and
                          engineering helped us build and launch in just 3 months!"
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-muted/70 border-2 border-border overflow-hidden">
                              <Image
                                src="/placeholder.svg?height=32&width=32&text=S"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-muted/70 border-2 border-border overflow-hidden">
                              <Image
                                src="/placeholder.svg?height=32&width=32&text=M"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium">Sarah & Michael</h3>
                            <p className="text-xs text-muted-foreground">Co-founders of GreenGrow</p>
                          </div>
                          <div className="ml-auto bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
                            10K+ Users
                          </div>
                        </div>
                        <p className="text-sm text-card-foreground">
                          "Finding a co-founder with the right values was crucial for our sustainability startup.
                          SwipeStart's matching algorithm connected us based on our shared mission."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Process, Powerful Results</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Get started in minutes and see the difference our platform can make for your business.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: "Create Account",
                  description: "Sign up in seconds with just your email and password to join the SwipeStart community.",
                },
                {
                  step: "02",
                  title: "Register Your Role",
                  description:
                    "Specify whether you're a founder looking for a co-founder or a co-founder offering your skills and expertise.",
                },
                {
                  step: "03",
                  title: "Start Swiping",
                  description:
                    "Browse co-founders according to your interests and connect with them. Co-founders get instant updates when founders are interested.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Don't take our word for it, see what our clients say
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  We're honored by the feedback, and it fuels our commitment to delivering exceptional services. Read
                  the reviews to hear firsthand how SwipeStart is making a positive impact on people's lives. Your trust
                  is our greatest achievement.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 relative">
                {[
                  {
                    rating: 5,
                    text: "A thorough report was done on our financial situation of what insurance covers etc existing. Better deals were found. These were processed on our behalf, which took a lot of stress away. Updates were given as required and outstanding responses chased after.",
                    author: "Jeannie Grant",
                    date: "June 01, 2023",
                  },
                  {
                    rating: 5,
                    text: "I have been a client of SwipeStart for 8 years now and have always found the advice provided by Ernie Brown excellent. Ernie always takes the time to explain things really clearly to me and ensures I understand and am well informed and therefore able to make appropriate decisions.",
                    author: "Derval Russell",
                    date: "November 09, 2023",
                  },
                  {
                    rating: 5,
                    text: "Claire was extremely helpful and knowledgeable. Her advice was considered, concise and exactly what I needed. I would highly recommend her to anyone seeking guidance on finding the perfect co-founder.",
                    author: "Sophie Williams",
                    date: "October 15, 2023",
                  },
                ].map((testimonial, i) => (
                  <div key={i} className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex mb-4">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, j) => (
                          <svg
                            key={j}
                            className="w-5 h-5 text-green-500 fill-current"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                    </div>
                    <p className="mb-6">{testimonial.text}</p>
                    <div className="mt-auto">
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8 gap-2">
                <button
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32" ref={faqRef}>
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about our platform.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does the 14-day free trial work?",
                    answer:
                      "Our 14-day free trial gives you full access to all features of your selected plan. No credit card is required to sign up, and you can cancel at any time during the trial period with no obligation.",
                  },
                  {
                    question: "Can I change plans later?",
                    answer:
                      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.",
                  },
                  {
                    question: "Is there a limit to how many users I can add?",
                    answer:
                      "The number of users depends on your plan. The Starter plan allows up to 5 team members, the Professional plan allows up to 20, and the Enterprise plan has no limit on team members.",
                  },
                  {
                    question: "Do you offer discounts for nonprofits or educational institutions?",
                    answer:
                      "Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please contact our sales team for more information.",
                  },
                  {
                    question: "How secure is my data?",
                    answer:
                      "We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regularly undergo security audits. Our platform is compliant with GDPR, CCPA, and other relevant regulations.",
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer:
                      "Support varies by plan. All plans include email support, with the Professional plan offering priority email support. The Enterprise plan includes 24/7 phone and email support. We also have an extensive knowledge base and community forum available to all users.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Transform Your Workflow?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of satisfied customers who have streamlined their processes and boosted productivity with
                our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">
                    Join Now
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                >
                  Explore More
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4"></p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <Image
                  src="/images/swipestart-logo.png"
                  alt="SwipeStart Logo"
                  width={32}
                  height={32}
                  className="size-8"
                />
                <span>SwipeStart</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connect with the perfect co-founder for your startup. Find partners who complement your skills and share
                your vision.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} SwipeStart. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
