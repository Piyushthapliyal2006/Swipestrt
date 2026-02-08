"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import UserDropdown from "@/components/user-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"

// Sample co-founder data with 15 profiles
const coFounders = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Full-Stack Developer",
    bio: "5 years of experience building SaaS products. Looking to join a fintech or healthtech startup.",
    skills: ["React", "Node.js", "AWS", "MongoDB"],
    image: "/images/profiles/forest-path.png",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Product Manager",
    bio: "Former PM at Google. Passionate about AI and machine learning applications.",
    skills: ["Product Strategy", "User Research", "Agile", "Data Analysis"],
    image: "/images/profiles/sci-fi-eye.png",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Marketing Specialist",
    bio: "Growth marketer with experience scaling B2B SaaS startups from zero to $1M ARR.",
    skills: ["SEO", "Content Marketing", "Paid Acquisition", "Analytics"],
    image: "/images/profiles/moon.png",
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "UX/UI Designer",
    bio: "Designer with a focus on creating intuitive user experiences for mobile and web applications.",
    skills: ["Figma", "User Testing", "Wireframing", "Design Systems"],
    image: "/images/profiles/water-samurai.png",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Backend Engineer",
    bio: "Specialized in building scalable infrastructure and microservices architecture.",
    skills: ["Go", "Kubernetes", "Docker", "PostgreSQL"],
    image: "/images/profiles/green-character.png",
  },
  {
    id: 6,
    name: "Emma Wilson",
    role: "Data Scientist",
    bio: "PhD in Machine Learning with expertise in NLP and computer vision. Looking to join an AI-focused startup.",
    skills: ["Python", "TensorFlow", "PyTorch", "Data Visualization"],
    image: "/images/profiles/lightning-character.png",
  },
  {
    id: 7,
    name: "Jason Lee",
    role: "Growth Hacker",
    bio: "Helped 3 startups achieve product-market fit. Specializes in user acquisition and retention strategies.",
    skills: ["Growth Strategy", "A/B Testing", "User Onboarding", "Retention"],
    image: "/images/profiles/fire-character.png",
  },
  {
    id: 8,
    name: "Olivia Martinez",
    role: "Frontend Developer",
    bio: "Expert in creating responsive, accessible web applications with modern frameworks.",
    skills: ["React", "Vue", "TypeScript", "Tailwind CSS"],
    image: "/images/profiles/orange-character.png",
  },
  {
    id: 9,
    name: "Raj Patel",
    role: "DevOps Engineer",
    bio: "Experienced in building CI/CD pipelines and managing cloud infrastructure at scale.",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes"],
    image: "/images/profiles/dark-character.png",
  },
  {
    id: 10,
    name: "Sophia Wang",
    role: "Business Development",
    bio: "Former VC with extensive network in Silicon Valley. Helped startups raise over $50M in funding.",
    skills: ["Fundraising", "Partnerships", "Sales", "Negotiation"],
    image: "/images/profiles/sky-character.png",
  },
  {
    id: 11,
    name: "Thomas Brown",
    role: "Mobile Developer",
    bio: "iOS and Android expert with 7+ published apps totaling over 1M downloads.",
    skills: ["Swift", "Kotlin", "React Native", "Flutter"],
    image: "/images/profiles/forest-path.png",
  },
  {
    id: 12,
    name: "Aisha Johnson",
    role: "Financial Analyst",
    bio: "Former investment banker with expertise in financial modeling and startup valuation.",
    skills: ["Financial Modeling", "Valuation", "Fundraising", "Excel"],
    image: "/images/profiles/sci-fi-eye.png",
  },
  {
    id: 13,
    name: "Carlos Mendez",
    role: "Blockchain Developer",
    bio: "Built multiple DeFi protocols and NFT platforms. Passionate about Web3 and decentralized applications.",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js"],
    image: "/images/profiles/moon.png",
  },
  {
    id: 14,
    name: "Nina Patel",
    role: "Content Strategist",
    bio: "Created content strategies for B2B SaaS companies that increased organic traffic by 300%.",
    skills: ["Content Marketing", "SEO", "Copywriting", "Brand Voice"],
    image: "/images/profiles/water-samurai.png",
  },
  {
    id: 15,
    name: "Kevin Zhang",
    role: "Hardware Engineer",
    bio: "Developed IoT devices and consumer electronics. Looking to join a hardware startup.",
    skills: ["PCB Design", "Embedded Systems", "IoT", "Prototyping"],
    image: "/images/profiles/green-character.png",
  },
]

export default function BrowsePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProfiles, setLikedProfiles] = useState<number[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<number[]>([])
  const [exitDirection, setExitDirection] = useState<null | "left" | "right">(null)
  const [isMobile, setIsMobile] = useState(false)

  // Motion values for drag
  const x = useMotionValue(0)

  // Even more subtle rotation (max 5 degrees instead of 10)
  const rotate = useTransform(x, [-250, 0, 250], [-5, 0, 5])

  // Smoother opacity transition
  const cardOpacity = useTransform(x, [-300, -200, 0, 200, 300], [0.7, 0.9, 1, 0.9, 0.7])

  // Like/Pass indicators with more subtle fade
  const likeOpacity = useTransform(x, [0, 50, 150], [0, 0.3, 0.8])
  const passOpacity = useTransform(x, [-150, -50, 0], [0.8, 0.3, 0])

  // Card reference for dimensions
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset motion values when card changes
  useEffect(() => {
    x.set(0)
  }, [currentIndex, x])

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100

    if (info.offset.x > threshold) {
      // Swiped right - like
      handleSwipe("right")
    } else if (info.offset.x < -threshold) {
      // Swiped left - dislike
      handleSwipe("left")
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    const currentProfile = coFounders[currentIndex]

    if (direction === "right") {
      setLikedProfiles((prev) => {
        const updatedLikes = [...prev, currentProfile.id]

        // Store liked profiles in session storage
        const likedProfilesData = updatedLikes
          .map((id) => coFounders.find((profile) => profile.id === id))
          .filter(Boolean)

        sessionStorage.setItem("likedProfiles", JSON.stringify(likedProfilesData))

        return updatedLikes
      })
    } else {
      setDislikedProfiles((prev) => [...prev, currentProfile.id])
    }

    setExitDirection(direction)

    // Move to next profile after animation completes
    setTimeout(() => {
      if (currentIndex < coFounders.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setExitDirection(null)
      }
    }, 300)
  }

  const resetBrowsing = () => {
    setCurrentIndex(0)
    setLikedProfiles([])
    setDislikedProfiles([])
    setExitDirection(null)

    // Clear liked profiles from session storage
    sessionStorage.removeItem("likedProfiles")
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserDropdown />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold text-center mb-4">Find Your Co-Founder</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
          Swipe right on profiles you're interested in connecting with, or swipe left to pass.
        </p>

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="relative w-full h-[500px] overflow-visible">
            <AnimatePresence mode="wait">
              {currentIndex < coFounders.length ? (
                <motion.div
                  ref={cardRef}
                  key={coFounders[currentIndex].id}
                  className="absolute w-full h-full cursor-grab active:cursor-grabbing touch-none"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 0.95, y: 0, opacity: 0.8, x: 0, rotate: 0 }}
                  animate={{
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  exit={
                    exitDirection === "left"
                      ? {
                          x: -300,
                          opacity: 0,
                          rotate: -5,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        }
                      : exitDirection === "right"
                        ? {
                            x: 300,
                            opacity: 0,
                            rotate: 5,
                            transition: {
                              duration: 0.3,
                              ease: "easeOut",
                            },
                          }
                        : { opacity: 0 }
                  }
                  style={{
                    x,
                    rotate,
                    opacity: cardOpacity,
                    touchAction: "none",
                    zIndex: 10,
                  }}
                >
                  {/* Like indicator */}
                  <motion.div
                    className="absolute top-10 right-10 bg-green-500/90 text-white font-bold text-3xl rounded-lg px-5 py-1.5 rotate-3 z-10 pointer-events-none border-2 border-white"
                    style={{ opacity: likeOpacity }}
                  >
                    LIKE
                  </motion.div>

                  {/* Pass indicator */}
                  <motion.div
                    className="absolute top-10 left-10 bg-red-500/90 text-white font-bold text-3xl rounded-lg px-5 py-1.5 -rotate-3 z-10 pointer-events-none border-2 border-white"
                    style={{ opacity: passOpacity }}
                  >
                    PASS
                  </motion.div>

                  <Card className="w-full h-full overflow-hidden border-2 shadow-lg">
                    <div className="relative h-3/5 bg-muted">
                      <Image
                        src={coFounders[currentIndex].image || "/placeholder.svg"}
                        alt={coFounders[currentIndex].name}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0}
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold">{coFounders[currentIndex].name}</h2>
                      <p className="text-primary font-medium">{coFounders[currentIndex].role}</p>
                      <p className="text-muted-foreground mt-2 mb-4 line-clamp-2">{coFounders[currentIndex].bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {coFounders[currentIndex].skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="rounded-full">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Card className="w-full h-full flex flex-col items-center justify-center p-6">
                    <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
                    <p className="text-muted-foreground mb-6 text-center">You've viewed all available co-founders</p>

                    <div className="flex flex-col gap-4 items-center">
                      <div className="flex gap-8 items-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-500">{likedProfiles.length}</div>
                          <div className="text-sm text-muted-foreground">Liked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500">{dislikedProfiles.length}</div>
                          <div className="text-sm text-muted-foreground">Passed</div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetBrowsing}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium mt-4"
                      >
                        Start Over
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentIndex < coFounders.length && (
            <div className="mt-6 flex items-center justify-between w-full max-w-xs">
              <div className="text-sm">
                <span className="font-medium text-red-500">{dislikedProfiles.length}</span> Passed
              </div>
              <div className="text-xs text-muted-foreground">
                {currentIndex + 1} of {coFounders.length}
              </div>
              <div className="text-sm">
                <span className="font-medium text-green-500">{likedProfiles.length}</span> Liked
              </div>
            </div>
          )}

          {currentIndex < coFounders.length && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>{isMobile ? "Swipe" : "Drag"} cards left to pass, right to like</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
