import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Dynamic metadata that works with any domain
export const metadata: Metadata = {
  title: "SwipeStart - Find Your Perfect Co-Founder",
  description:
    "The platform designed to connect founders with suitable co-founders based on your needs and interests. Find the perfect match to build your startup dream team.",
  keywords: ["co-founder", "startup", "entrepreneur", "business partner", "networking", "SwipeStart"],
  authors: [{ name: "SwipeStart" }],
  creator: "SwipeStart",
  publisher: "SwipeStart",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SwipeStart",
    title: "SwipeStart - Find Your Perfect Co-Founder",
    description:
      "The platform designed to connect founders with suitable co-founders based on your needs and interests. Find the perfect match to build your startup dream team.",
    images: [
      {
        url: "/images/swipestart-logo.png",
        width: 1200,
        height: 630,
        alt: "SwipeStart Logo - Find Your Perfect Co-Founder",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "SwipeStart Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SwipeStart",
    creator: "@SwipeStart",
    title: "SwipeStart - Find Your Perfect Co-Founder",
    description:
      "The platform designed to connect founders with suitable co-founders based on your needs and interests.",
    images: [
      {
        url: "/images/swipestart-logo.png",
        alt: "SwipeStart Logo - Find Your Perfect Co-Founder",
      },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
