import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const modelInput = {
      koi_model_snr: data.snr || data.koi_model_snr || 0,
      koi_prad: data.planetary_radius || data.koi_prad || 0,
      koi_insol: data.insolation_flux || data.koi_insol || 0,
      koi_slogg: data.surface_gravity || data.koi_slogg || 0,
      koi_period: data.orbital_period || data.koi_period || 0,
      koi_duration: data.transit_duration || data.koi_duration || 0,
      koi_depth: data.transit_depth || data.koi_depth || 0,
      koi_impact: data.impact_parameter || data.koi_impact || 0,
      koi_steff: data.stellar_temperature || data.koi_steff || 5778, // Default to Sun's temperature
      koi_period_err1: data.koi_period_err1 || 0,
      koi_period_err2: data.koi_period_err2 || 0,
      koi_depth_err1: data.koi_depth_err1 || 0,
      koi_depth_err2: data.koi_depth_err2 || 0,
      koi_duration_err1: data.koi_duration_err1 || 0,
      koi_duration_err2: data.koi_duration_err2 || 0,
      koi_prad_err1: data.koi_prad_err1 || 0,
      koi_prad_err2: data.koi_prad_err2 || 0,
      koi_srad: data.stellar_radius || data.koi_srad || 1, // Default to Sun's radius
    }

    const inputJson = JSON.stringify(modelInput)
    const { stdout, stderr } = await execAsync(`python3 scripts/predict_exoplanet.py '${inputJson}'`)

    if (stderr) {
      console.error("[v0] Python script stderr:", stderr)
    }

    const result = JSON.parse(stdout)

    if (result.error) {
      console.error("[v0] ML Model error:", result.error)
      return NextResponse.json(
        {
          error: result.error,
          message:
            "Please ensure all .pkl files (exoplanet_model_final.pkl, feature_names_final.pkl, threshold_final.pkl) are in the scripts directory.",
        },
        { status: 500 },
      )
    }

    const classification = result.prediction_label === "Planet Candidate" ? "Candidate" : "False Positive"
    const confidence = result.confidence
    const probability_exoplanet = result.probability_exoplanet
    const probability_false_positive = result.probability_false_positive

    return NextResponse.json({
      classification,
      confidence,
      probability_exoplanet,
      probability_false_positive,
      features: modelInput,
      timestamp: new Date().toISOString(),
      model_used: "ML Model",
      threshold_used: result.threshold_used,
    })
  } catch (error) {
    console.error("[v0] Classification error:", error)
    return NextResponse.json(
      {
        error:
          "Classification failed. Please ensure Python and required packages (numpy, pickle) are installed, and all .pkl files are in the scripts directory.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
