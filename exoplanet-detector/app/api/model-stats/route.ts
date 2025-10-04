import { NextResponse } from "next/server"

export async function GET() {
  // In production, this would read from a database or file system
  // For now, return mock data that matches our training script
  const stats = {
    model_version: "1.0.0",
    trained_at: "2025-01-15T10:30:00Z",
    dataset: "NASA Kepler (Synthetic)",
    accuracy: 0.847,
    precision: 0.823,
    recall: 0.891,
    f1_score: 0.856,
    training_samples: 4000,
    validation_samples: 1000,
    features: ["orbital_period", "transit_duration", "transit_depth", "stellar_magnitude", "planet_radius"],
    feature_importance: [0.18, 0.22, 0.35, 0.15, 0.1],
    confusion_matrix: {
      true_positives: 445,
      false_positives: 96,
      true_negatives: 402,
      false_negatives: 57,
    },
    total_classifications: 12847,
  }

  return NextResponse.json(stats)
}
