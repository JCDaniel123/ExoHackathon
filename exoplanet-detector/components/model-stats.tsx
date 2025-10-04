"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Database, Calendar, CheckCircle2 } from "lucide-react"

interface ModelMetrics {
  model_version: string
  trained_at: string
  dataset: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  training_samples: number
  validation_samples: number
  features: string[]
  feature_importance: number[]
  confusion_matrix: {
    true_positives: number
    false_positives: number
    true_negatives: number
    false_negatives: number
  }
  total_classifications: number
}

export function ModelStats() {
  const [stats, setStats] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/model-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Failed to load stats:", error)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return <div>Loading statistics...</div>
  }

  const featureData = stats.features.map((feature, index) => ({
    name: feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    importance: stats.feature_importance[index] * 100,
  }))

  const confusionData = [
    { name: "True Positives", value: stats.confusion_matrix.true_positives, color: "#22c55e" },
    { name: "True Negatives", value: stats.confusion_matrix.true_negatives, color: "#3b82f6" },
    { name: "False Positives", value: stats.confusion_matrix.false_positives, color: "#f59e0b" },
    { name: "False Negatives", value: stats.confusion_matrix.false_negatives, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats.accuracy * 100).toFixed(1)}%</div>
            <Progress value={stats.accuracy * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats.precision * 100).toFixed(1)}%</div>
            <Progress value={stats.precision * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recall
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats.recall * 100).toFixed(1)}%</div>
            <Progress value={stats.recall * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              F1 Score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(stats.f1_score * 100).toFixed(1)}%</div>
            <Progress value={stats.f1_score * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
          <CardDescription>Details about the current model version and training</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Model Version</p>
              <Badge variant="outline">{stats.model_version}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dataset</p>
              <p className="font-medium">{stats.dataset}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Trained At
              </p>
              <p className="font-medium">{new Date(stats.trained_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Classifications</p>
              <p className="font-medium">{stats.total_classifications.toLocaleString()}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Training Data</p>
            <div className="flex gap-4">
              <div>
                <span className="font-medium">{stats.training_samples.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground ml-1">training samples</span>
              </div>
              <div>
                <span className="font-medium">{stats.validation_samples.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground ml-1">validation samples</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Importance</CardTitle>
          <CardDescription>Relative importance of each feature in the classification decision</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="importance" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confusion Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix</CardTitle>
          <CardDescription>Model performance breakdown on validation data</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confusionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {confusionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <p className="text-sm font-medium">True Positives</p>
              </div>
              <p className="text-2xl font-bold">{stats.confusion_matrix.true_positives}</p>
              <p className="text-xs text-muted-foreground mt-1">Correctly identified exoplanets</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <p className="text-sm font-medium">True Negatives</p>
              </div>
              <p className="text-2xl font-bold">{stats.confusion_matrix.true_negatives}</p>
              <p className="text-xs text-muted-foreground mt-1">Correctly identified false positives</p>
            </div>

            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <p className="text-sm font-medium">False Positives</p>
              </div>
              <p className="text-2xl font-bold">{stats.confusion_matrix.false_positives}</p>
              <p className="text-xs text-muted-foreground mt-1">Incorrectly classified as exoplanets</p>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <p className="text-sm font-medium">False Negatives</p>
              </div>
              <p className="text-2xl font-bold">{stats.confusion_matrix.false_negatives}</p>
              <p className="text-xs text-muted-foreground mt-1">Missed exoplanets</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Alert>
        <AlertTitle>Performance Insights</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            The model achieves <strong>{(stats.accuracy * 100).toFixed(1)}%</strong> accuracy on validation data, with a
            precision of <strong>{(stats.precision * 100).toFixed(1)}%</strong> and recall of{" "}
            <strong>{(stats.recall * 100).toFixed(1)}%</strong>.
          </p>
          <p>
            Transit depth is the most important feature ({(stats.feature_importance[2] * 100).toFixed(1)}% importance),
            followed by transit duration and orbital period. This aligns with exoplanet detection theory, where the
            depth and shape of the transit signal are key indicators.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
