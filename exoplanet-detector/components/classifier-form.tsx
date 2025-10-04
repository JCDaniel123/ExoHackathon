"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClassificationResult {
  classification: string
  confidence: number
  probability_exoplanet: number
  probability_false_positive: number
  features: any
  timestamp: string
}

export function ClassifierForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)

  const [formData, setFormData] = useState({
    orbital_period: "",
    transit_duration: "",
    transit_depth: "",
    stellar_magnitude: "",
    planet_radius: "",
    insolation_flux: "",
    surface_gravity: "",
    impact_parameter: "",
    snr: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orbital_period: Number.parseFloat(formData.orbital_period),
          transit_duration: Number.parseFloat(formData.transit_duration),
          transit_depth: Number.parseFloat(formData.transit_depth),
          stellar_magnitude: Number.parseFloat(formData.stellar_magnitude),
          planet_radius: Number.parseFloat(formData.planet_radius),
          insolation_flux: formData.insolation_flux ? Number.parseFloat(formData.insolation_flux) : undefined,
          surface_gravity: formData.surface_gravity ? Number.parseFloat(formData.surface_gravity) : undefined,
          impact_parameter: formData.impact_parameter ? Number.parseFloat(formData.impact_parameter) : undefined,
          snr: formData.snr ? Number.parseFloat(formData.snr) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Classification failed")
      }

      const data = await response.json()
      setResult(data)

      toast({
        title: "Classification Complete",
        description: `Result: ${data.classification}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to classify exoplanet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const isFormValid =
    formData.orbital_period !== "" && formData.transit_duration !== "" && formData.transit_depth !== ""

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="orbital_period">Orbital Period (days) *</Label>
            <Input
              id="orbital_period"
              name="orbital_period"
              type="number"
              step="0.01"
              placeholder="e.g., 3.52"
              value={formData.orbital_period}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transit_duration">Transit Duration (hours) *</Label>
            <Input
              id="transit_duration"
              name="transit_duration"
              type="number"
              step="0.01"
              placeholder="e.g., 2.8"
              value={formData.transit_duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transit_depth">Transit Depth (fraction) *</Label>
            <Input
              id="transit_depth"
              name="transit_depth"
              type="number"
              step="0.0001"
              placeholder="e.g., 0.012"
              value={formData.transit_depth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stellar_magnitude">Stellar Magnitude</Label>
            <Input
              id="stellar_magnitude"
              name="stellar_magnitude"
              type="number"
              step="0.01"
              placeholder="e.g., 12.5"
              value={formData.stellar_magnitude}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planet_radius">Planet Radius (Earth radii)</Label>
            <Input
              id="planet_radius"
              name="planet_radius"
              type="number"
              step="0.01"
              placeholder="e.g., 1.8"
              value={formData.planet_radius}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insolation_flux">Insolation Flux (Earth flux)</Label>
            <Input
              id="insolation_flux"
              name="insolation_flux"
              type="number"
              step="0.01"
              placeholder="e.g., 450.2"
              value={formData.insolation_flux}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surface_gravity">Surface Gravity (m/s²)</Label>
            <Input
              id="surface_gravity"
              name="surface_gravity"
              type="number"
              step="0.01"
              placeholder="e.g., 15.3"
              value={formData.surface_gravity}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact_parameter">Impact Parameter</Label>
            <Input
              id="impact_parameter"
              name="impact_parameter"
              type="number"
              step="0.001"
              placeholder="e.g., 0.456"
              value={formData.impact_parameter}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snr">Signal-to-Noise Ratio (SNR)</Label>
            <Input
              id="snr"
              name="snr"
              type="number"
              step="0.01"
              placeholder="e.g., 25.4"
              value={formData.snr}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button type="submit" disabled={!isFormValid || loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Data
            </>
          )}
        </Button>
      </form>

      {result && (
        <Card className="border-2 border-primary/50 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {result.classification === "Confirmed" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                Classification Result
              </CardTitle>
              <Badge variant={result.classification === "Confirmed" ? "default" : "secondary"}>
                {result.classification}
              </Badge>
            </div>
            <CardDescription>Analysis completed at {new Date(result.timestamp).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Exoplanet Probability</p>
                <p className="text-2xl font-bold">{(result.probability_exoplanet * 100).toFixed(1)}%</p>
              </div>
            </div>

            <Alert>
              <AlertTitle>Interpretation</AlertTitle>
              <AlertDescription>
                {result.classification === "Confirmed"
                  ? "The analysis indicates this signal is likely a genuine exoplanet based on the provided parameters."
                  : "The analysis suggests this signal is likely a false positive caused by stellar activity or instrumental artifacts."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
