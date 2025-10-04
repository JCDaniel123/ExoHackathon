"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Rocket, BarChart3, BookOpen, Home, Orbit, Database } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/classify", label: "Classifier", icon: Rocket },
    { href: "/data", label: "Data", icon: Database },
    { href: "/explore", label: "3D Explorer", icon: Orbit },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/about", label: "About", icon: BookOpen },
  ]

  return (
    <nav className="border-b border-primary/20 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <Rocket className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              ExoDetect
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={
                    isActive ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" : "hover:bg-secondary/50"
                  }
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
