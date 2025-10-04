"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Orbit } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ExoplanetData {
  id: string
  classification: string
  confidence: number
  orbital_period: number
  planet_radius: number
  snr?: number
}

export default function ExplorePage() {
  const [exoplanets, setExoplanets] = useState<ExoplanetData[]>([])
  const [hoveredPlanet, setHoveredPlanet] = useState<ExoplanetData | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Fetch classified exoplanets
    fetch("/api/exoplanets")
      .then((res) => res.json())
      .then((data) => setExoplanets(data.exoplanets || []))
      .catch((error) => console.error("[v0] Failed to load exoplanets:", error))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    // Animation state
    let time = 0

    // Draw function
    const draw = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      if (!isFinite(centerX) || !isFinite(centerY) || canvas.width === 0 || canvas.height === 0) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw central star
      const starGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
      starGradient.addColorStop(0, "#fef08a")
      starGradient.addColorStop(0.5, "#fbbf24")
      starGradient.addColorStop(1, "rgba(251, 191, 36, 0)")
      ctx.fillStyle = starGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Draw star core
      ctx.fillStyle = "#fef3c7"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw exoplanets
      exoplanets.forEach((planet, index) => {
        const orbitRadius = 100 + index * 60
        const speed = 0.0005 / (planet.orbital_period || 1)
        const angle = time * speed + index * 0.5

        const x = centerX + Math.cos(angle) * orbitRadius
        const y = centerY + Math.sin(angle) * orbitRadius

        // Draw orbit path
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Draw planet
        const planetSize = Math.max(5, Math.min(15, planet.planet_radius * 2))
        const planetColor = planet.classification === "CONFIRMED" ? "#22c55e" : "#f59e0b"

        if (isFinite(x) && isFinite(y) && isFinite(planetSize)) {
          const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, planetSize)
          planetGradient.addColorStop(0, planetColor)
          planetGradient.addColorStop(1, planetColor + "80")
          ctx.fillStyle = planetGradient
          ctx.beginPath()
          ctx.arc(x, y, planetSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // Check hover
        const dx = mousePos.x - x
        const dy = mousePos.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < planetSize + 5) {
          setHoveredPlanet(planet)
          // Draw highlight
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, planetSize + 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      time += 16
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", updateSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [exoplanets, mousePos])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setHoveredPlanet(null)
  }

  if (exoplanets.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Orbit className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-balance">3D Exoplanet Explorer</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Visualize discovered exoplanets in an interactive 3D solar system
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No exoplanet data available yet. Please classify some exoplanets first to see them visualized here.
            </AlertDescription>
          </Alert>

          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                Start by analyzing exoplanet data to populate this 3D visualization
              </p>
              <Button asChild size="lg">
                <Link href="/classify">Go to Classifier</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">3D Exoplanet Explorer</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Explore {exoplanets.length} discovered exoplanet{exoplanets.length !== 1 ? "s" : ""} in an interactive solar
            system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="w-full h-[600px] bg-gradient-to-b from-slate-950 to-slate-900 cursor-crosshair"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {hoveredPlanet ? (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Planet {hoveredPlanet.id}</CardTitle>
                  <CardDescription>Detailed Information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Classification</p>
                    <p className="font-semibold text-lg">{hoveredPlanet.classification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{(hoveredPlanet.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orbital Period</p>
                    <p className="font-semibold">{hoveredPlanet.orbital_period.toFixed(2)} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Planet Radius</p>
                    <p className="font-semibold">{hoveredPlanet.planet_radius.toFixed(2)} R⊕</p>
                  </div>
                  {hoveredPlanet.snr && (
                    <div>
                      <p className="text-sm text-muted-foreground">SNR</p>
                      <p className="font-semibold">{hoveredPlanet.snr.toFixed(2)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hover Over Planets</CardTitle>
                  <CardDescription>Move your cursor over planets to see details</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each planet orbits the central star at different speeds based on their orbital period. Green planets
                    are confirmed exoplanets, while orange ones are candidates.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm">Confirmed Exoplanet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span className="text-sm">Candidate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-400" />
                  <span className="text-sm">Host Star</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
