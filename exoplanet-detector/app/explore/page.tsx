"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Orbit } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { loadExoplanets } from "@/lib/storage"
import type { ExoplanetData } from "@/lib/dummy-data"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import type * as THREE from "three"

function Star() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={2} color="#fef08a" />
      <pointLight intensity={2} distance={100} decay={2} />
    </mesh>
  )
}

interface PlanetProps {
  planet: ExoplanetData
  index: number
  onClick: (planet: ExoplanetData) => void
}

function Planet({ planet, index, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const orbitRadius = 5 + index * 3
  const speed = 0.1 / (planet.orbital_period || 1)
  const planetSize = Math.max(0.2, Math.min(0.8, planet.planetary_radius * 0.1))
  const planetColor = planet.classification === "Confirmed" ? "#22c55e" : "#f59e0b"

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      const angle = time * speed + index * 0.5
      meshRef.current.position.x = Math.cos(angle) * orbitRadius
      meshRef.current.position.z = Math.sin(angle) * orbitRadius
    }
  })

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={() => onClick(planet)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[planetSize, 16, 16]} />
        <meshStandardMaterial color={planetColor} emissive={planetColor} emissiveIntensity={hovered ? 0.5 : 0.2} />
        {hovered && (
          <Html distanceFactor={10}>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm whitespace-nowrap pointer-events-none">
              {planet.name}
            </div>
          </Html>
        )}
      </mesh>
    </>
  )
}

function OrbitRings({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const radius = 5 + i * 3
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
          </mesh>
        )
      })}
    </>
  )
}

export default function ExplorePage() {
  const [exoplanets, setExoplanets] = useState<ExoplanetData[]>([])
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData | null>(null)

  useEffect(() => {
    const storedData = loadExoplanets()
    setExoplanets(storedData)
  }, [])

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
              No exoplanet data available. Please upload your exoplanet data in the Data Explorer to visualize it here.
            </AlertDescription>
          </Alert>

          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                Upload a CSV file with exoplanet data to populate this visualization
              </p>
              <Button asChild size="lg">
                <Link href="/data">Go to Data Explorer</Link>
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
            Explore {exoplanets.length} discovered exoplanet{exoplanets.length !== 1 ? "s" : ""} in an interactive 3D
            space
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full h-[600px] bg-gradient-to-b from-slate-950 to-slate-900">
                  <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 0, 0]} intensity={2} />
                    <Star />
                    <OrbitRings count={exoplanets.length} />
                    {exoplanets.map((planet, index) => (
                      <Planet key={planet.id} planet={planet} index={index} onClick={setSelectedPlanet} />
                    ))}
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={10}
                      maxDistance={50}
                    />
                  </Canvas>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {selectedPlanet ? (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedPlanet.name}</CardTitle>
                  <CardDescription>ID: {selectedPlanet.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Classification</p>
                    <p className="font-semibold text-lg">{selectedPlanet.classification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{(selectedPlanet.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orbital Period</p>
                    <p className="font-semibold">{selectedPlanet.orbital_period.toFixed(2)} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Planet Radius</p>
                    <p className="font-semibold">{selectedPlanet.planetary_radius.toFixed(2)} R⊕</p>
                  </div>
                  {selectedPlanet.snr && (
                    <div>
                      <p className="text-sm text-muted-foreground">SNR</p>
                      <p className="font-semibold">{selectedPlanet.snr.toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Transit Depth</p>
                    <p className="font-semibold">{selectedPlanet.transit_depth.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transit Duration</p>
                    <p className="font-semibold">{selectedPlanet.transit_duration.toFixed(2)} hours</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Click on Planets</CardTitle>
                  <CardDescription>Click any planet to see detailed information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use your mouse to rotate the view, scroll to zoom, and click on planets to see their details. Each
                    planet orbits the central star based on their orbital period.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-20 font-medium">Rotate:</div>
                  <div className="text-muted-foreground">Left click + drag</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 font-medium">Zoom:</div>
                  <div className="text-muted-foreground">Scroll wheel</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 font-medium">Pan:</div>
                  <div className="text-muted-foreground">Right click + drag</div>
                </div>
              </CardContent>
            </Card>

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
