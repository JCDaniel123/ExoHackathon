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
  model_used?: string
}

export function ClassifierForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)

  const [formData, setFormData] = useState({
    koi_model_snr: "",
    koi_prad: "",
    koi_insol: "",
    koi_slogg: "",
    koi_period: "",
    koi_duration: "",
    koi_depth: "",
    koi_impact: "",
    koi_steff: "",
    koi_period_err1: "",
    koi_period_err2: "",
    koi_depth_err1: "",
    koi_depth_err2: "",
    koi_duration_err1: "",
    koi_duration_err2: "",
    koi_prad_err1: "",
    koi_prad_err2: "",
    koi_srad: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Convert all form data to numbers
      const payload: any = {}
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          payload[key] = Number.parseFloat(value)
        }
      })

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const isFormValid = formData.koi_period !== "" && formData.koi_duration !== "" && formData.koi_depth !== ""

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Core Features */}
          <div className="space-y-2">
            <Label htmlFor="koi_period">Orbital Period (days) *</Label>
            <Input
              id="koi_period"
              name="koi_period"
              type="number"
              step="any"
              placeholder="e.g., 3.52"
              value={formData.koi_period}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_duration">Transit Duration (hours) *</Label>
            <Input
              id="koi_duration"
              name="koi_duration"
              type="number"
              step="any"
              placeholder="e.g., 2.8"
              value={formData.koi_duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_depth">Transit Depth (ppm) *</Label>
            <Input
              id="koi_depth"
              name="koi_depth"
              type="number"
              step="any"
              placeholder="e.g., 0.012"
              value={formData.koi_depth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_model_snr">Signal-to-Noise Ratio</Label>
            <Input
              id="koi_model_snr"
              name="koi_model_snr"
              type="number"
              step="any"
              placeholder="e.g., 25.4"
              value={formData.koi_model_snr}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_prad">Planet Radius (Earth radii)</Label>
            <Input
              id="koi_prad"
              name="koi_prad"
              type="number"
              step="any"
              placeholder="e.g., 1.8"
              value={formData.koi_prad}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_insol">Insolation Flux (Earth flux)</Label>
            <Input
              id="koi_insol"
              name="koi_insol"
              type="number"
              step="any"
              placeholder="e.g., 450.2"
              value={formData.koi_insol}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_slogg">Surface Gravity (log10(cm/s²))</Label>
            <Input
              id="koi_slogg"
              name="koi_slogg"
              type="number"
              step="any"
              placeholder="e.g., 4.5"
              value={formData.koi_slogg}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_impact">Impact Parameter</Label>
            <Input
              id="koi_impact"
              name="koi_impact"
              type="number"
              step="any"
              placeholder="e.g., 0.456"
              value={formData.koi_impact}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_steff">Stellar Temperature (K)</Label>
            <Input
              id="koi_steff"
              name="koi_steff"
              type="number"
              step="any"
              placeholder="e.g., 5778"
              value={formData.koi_steff}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_srad">Stellar Radius (Solar radii)</Label>
            <Input
              id="koi_srad"
              name="koi_srad"
              type="number"
              step="any"
              placeholder="e.g., 1.0"
              value={formData.koi_srad}
              onChange={handleChange}
            />
          </div>

          {/* Error Measurements */}
          <div className="space-y-2">
            <Label htmlFor="koi_period_err1">Period Error (+)</Label>
            <Input
              id="koi_period_err1"
              name="koi_period_err1"
              type="number"
              step="any"
              placeholder="e.g., 0.001"
              value={formData.koi_period_err1}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_period_err2">Period Error (-)</Label>
            <Input
              id="koi_period_err2"
              name="koi_period_err2"
              type="number"
              step="any"
              placeholder="e.g., 0.001"
              value={formData.koi_period_err2}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_depth_err1">Depth Error (+)</Label>
            <Input
              id="koi_depth_err1"
              name="koi_depth_err1"
              type="number"
              step="any"
              placeholder="e.g., 0.0001"
              value={formData.koi_depth_err1}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_depth_err2">Depth Error (-)</Label>
            <Input
              id="koi_depth_err2"
              name="koi_depth_err2"
              type="number"
              step="any"
              placeholder="e.g., 0.0001"
              value={formData.koi_depth_err2}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_duration_err1">Duration Error (+)</Label>
            <Input
              id="koi_duration_err1"
              name="koi_duration_err1"
              type="number"
              step="any"
              placeholder="e.g., 0.01"
              value={formData.koi_duration_err1}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_duration_err2">Duration Error (-)</Label>
            <Input
              id="koi_duration_err2"
              name="koi_duration_err2"
              type="number"
              step="any"
              placeholder="e.g., 0.01"
              value={formData.koi_duration_err2}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_prad_err1">Radius Error (+)</Label>
            <Input
              id="koi_prad_err1"
              name="koi_prad_err1"
              type="number"
              step="any"
              placeholder="e.g., 0.1"
              value={formData.koi_prad_err1}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="koi_prad_err2">Radius Error (-)</Label>
            <Input
              id="koi_prad_err2"
              name="koi_prad_err2"
              type="number"
              step="any"
              placeholder="e.g., 0.1"
              value={formData.koi_prad_err2}
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
            <CardDescription>
              Analysis completed at {new Date(result.timestamp).toLocaleString()}
              {result.model_used && ` • ${result.model_used}`}
            </CardDescription>
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
