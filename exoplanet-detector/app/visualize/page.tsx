"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ExoplanetData } from "@/lib/dummy-data"

export default function VisualizePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<ExoplanetData | null>(null)
  const [planets, setPlanets] = useState<ExoplanetData[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    fetchPlanets()
  }, [])

  const fetchPlanets = async () => {
    try {
      const response = await fetch("/api/exoplanets")
      const result = await response.json()
      setPlanets(result.exoplanets.slice(0, 20)) // Limit to 20 for visualization
    } catch (error) {
      console.error("[v0] Failed to fetch planets:", error)
    }
  }

  useEffect(() => {
    if (!canvasRef.current || planets.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Planet positions and properties
    const planetObjects = planets.map((planet, index) => {
      const angle = (index / planets.length) * Math.PI * 2
      const distance = 100 + (planet.orbital_period / 10) * 2
      const size = Math.max(3, Math.min(planet.planetary_radius * 2, 15))

      return {
        data: planet,
        angle,
        distance,
        size,
        speed: 0.001 / (planet.orbital_period / 100),
        color:
          planet.classification === "Confirmed"
            ? "#3b82f6"
            : planet.classification === "Candidate"
              ? "#a855f7"
              : "#ef4444",
      }
    })

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw sun
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
      ctx.fillStyle = "#fbbf24"
      ctx.fill()
      ctx.shadowBlur = 20
      ctx.shadowColor = "#fbbf24"
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw orbits and planets
      planetObjects.forEach((planet) => {
        // Draw orbit
        ctx.beginPath()
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.stroke()

        // Calculate planet position
        const currentAngle = planet.angle + time * planet.speed
        const x = centerX + Math.cos(currentAngle) * planet.distance
        const y = centerY + Math.sin(currentAngle) * planet.distance

        // Draw planet
        ctx.beginPath()
        ctx.arc(x, y, planet.size, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.fill()
        ctx.shadowBlur = 10
        ctx.shadowColor = planet.color
        ctx.fill()
        ctx.shadowBlur = 0

        // Store position for hover detection
        planet.data.x = x
        planet.data.y = y
      })

      time += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Mouse move handler for hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      let found = false
      for (const planet of planetObjects) {
        const dx = mouseX - (planet.data.x || 0)
        const dy = mouseY - (planet.data.y || 0)
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < planet.size + 5) {
          setHoveredPlanet(planet.data)
          canvas.style.cursor = "pointer"
          found = true
          break
        }
      }

      if (!found) {
        setHoveredPlanet(null)
        canvas.style.cursor = "default"
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [planets])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">3D Solar System Visualization</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Explore discovered exoplanets in an interactive solar system. Hover over planets to see their details.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full rounded-lg"
                  style={{ background: "radial-gradient(circle, #0a0a1a 0%, #000000 100%)" }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm">Confirmed Exoplanet</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span className="text-sm">Candidate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm">False Positive</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-sm">Host Star</span>
                </div>
              </CardContent>
            </Card>

            {hoveredPlanet && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{hoveredPlanet.name}</CardTitle>
                  <CardDescription>ID: {hoveredPlanet.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Classification</span>
                    <Badge
                      variant={
                        hoveredPlanet.classification === "Confirmed"
                          ? "default"
                          : hoveredPlanet.classification === "Candidate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {hoveredPlanet.classification}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Radius</span>
                    <span className="text-sm font-mono">{hoveredPlanet.planetary_radius.toFixed(2)} R⊕</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Period</span>
                    <span className="text-sm font-mono">{hoveredPlanet.orbital_period.toFixed(2)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">SNR</span>
                    <span className="text-sm font-mono">{hoveredPlanet.snr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="text-sm font-mono">{(hoveredPlanet.confidence * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Hover over planets to view details</p>
                <p>• Planet size represents radius</p>
                <p>• Orbit distance represents period</p>
                <p>• Animation shows orbital motion</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
