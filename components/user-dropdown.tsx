"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userDataStr = sessionStorage.getItem("pendingSignup")
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        if (userData.profileCompleted) {
          setUserData(userData)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("pendingSignup")
    setUserData(null)
    setIsOpen(false)
    router.push("/")
  }

  if (!userData) {
    return (
      <div className="flex gap-4 items-center">
        <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          Log in
        </Link>
        <Link href="/signup" className="rounded-full">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-2 text-sm font-medium">
            Sign Up
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border">
          <Image
            src={userData.profileImage || "/placeholder.svg?height=36&width=36&text=User"}
            alt={userData.fullName || userData.username}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border overflow-hidden z-50"
          >
            <div className="py-2 px-4 border-b border-border">
              <p className="font-medium truncate">{userData.fullName || userData.username}</p>
              <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="size-4" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="size-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-muted w-full text-left transition-colors"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
