"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"

interface PredictionResult {
  prediction: number
  confidence: number
  probability_exoplanet: number
  probability_false_positive: number
}

export default function PredictPage() {
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

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Convert form data to numbers
      const numericData: Record<string, number> = {}
      for (const [key, value] of Object.entries(formData)) {
        const num = Number.parseFloat(value)
        if (isNaN(num)) {
          throw new Error(`Invalid number for ${key}`)
        }
        numericData[key] = num
      }

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numericData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: "koi_model_snr", label: "Model SNR", description: "Signal-to-noise ratio" },
    { key: "koi_prad", label: "Planet Radius (Earth radii)", description: "Planetary radius" },
    { key: "koi_insol", label: "Insolation Flux (Earth flux)", description: "Stellar flux" },
    { key: "koi_slogg", label: "Stellar Surface Gravity (log10)", description: "Surface gravity" },
    { key: "koi_period", label: "Orbital Period (days)", description: "Orbital period" },
    { key: "koi_duration", label: "Transit Duration (hours)", description: "Transit duration" },
    { key: "koi_depth", label: "Transit Depth (ppm)", description: "Transit depth" },
    { key: "koi_impact", label: "Impact Parameter", description: "Impact parameter" },
    { key: "koi_steff", label: "Stellar Effective Temperature (K)", description: "Star temperature" },
    { key: "koi_period_err1", label: "Period Error 1", description: "Upper error" },
    { key: "koi_period_err2", label: "Period Error 2", description: "Lower error" },
    { key: "koi_depth_err1", label: "Depth Error 1", description: "Upper error" },
    { key: "koi_depth_err2", label: "Depth Error 2", description: "Lower error" },
    { key: "koi_duration_err1", label: "Duration Error 1", description: "Upper error" },
    { key: "koi_duration_err2", label: "Duration Error 2", description: "Lower error" },
    { key: "koi_prad_err1", label: "Radius Error 1", description: "Upper error" },
    { key: "koi_prad_err2", label: "Radius Error 2", description: "Lower error" },
    { key: "koi_srad", label: "Stellar Radius (Solar radii)", description: "Star radius" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Exoplanet Prediction</h1>
            <p className="text-lg text-blue-200">
              Enter the Kepler Object of Interest (KOI) parameters to predict if it's an exoplanet
            </p>
          </div>

          <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Input Parameters</CardTitle>
              <CardDescription className="text-blue-200">
                Fill in all the required fields with numerical values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-white">
                        {field.label}
                      </Label>
                      <Input
                        id={field.key}
                        type="number"
                        step="any"
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        required
                        className="bg-slate-800 border-blue-500/30 text-white"
                        placeholder={field.description}
                      />
                    </div>
                  ))}
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Predict
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <Alert className="mt-6 bg-red-900/20 border-red-500/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <div className="mt-6 space-y-4">
                  <Card
                    className={`${
                      result.prediction === 1
                        ? "bg-green-900/20 border-green-500/50"
                        : "bg-red-900/20 border-red-500/50"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Prediction Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-white mb-2">
                          {result.prediction === 1 ? "Exoplanet Detected! 🪐" : "False Positive ❌"}
                        </p>
                        <p className="text-blue-200">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <p className="text-sm text-blue-200 mb-1">Exoplanet Probability</p>
                          <p className="text-xl font-bold text-white">
                            {(result.probability_exoplanet * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <p className="text-sm text-blue-200 mb-1">False Positive Probability</p>
                          <p className="text-xl font-bold text-white">
                            {(result.probability_false_positive * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
