import { MiniNavbar } from "@/components/ui/mini-navbar"

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <div className="absolute inset-0 opacity-20 dark:opacity-100">
        <img
          className="w-full h-full object-cover grayscale"
          src="/images/stars-background.jpg"
          alt="Background Stars"
        />
      </div>

      <MiniNavbar />

      <main className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4 pt-24">
        <h1 className="text-8xl md:text-9xl font-bold mb-4 tracking-tight drop-shadow-xl">SWIPESTART</h1>
        <div className="flex flex-col sm:flex-row items-center text-xl text-muted-foreground mb-8 space-y-2 sm:space-y-0 sm:space-x-2">
          <span>Animated Mini Navbar Demo</span>
          <button className="px-4 py-1 border border-border bg-muted/60 rounded-full text-foreground transition-colors duration-200 cursor-pointer text-base inline-flex items-center justify-center">
            <span>Try It Out</span>
          </button>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This is a demo of the animated mini navbar. Notice the smooth hover animations on the navigation links and the
          responsive mobile menu.
        </p>
      </main>
    </div>
  )
}
