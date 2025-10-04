import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Map frontend field names to model feature names
    const modelInput = {
      koi_model_snr: data.snr || data.koi_model_snr || 0,
      koi_prad: data.planet_radius || data.koi_prad || 0,
      koi_insol: data.insolation_flux || data.koi_insol || 0,
      koi_slogg: data.surface_gravity || data.koi_slogg || 0,
      koi_period: data.orbital_period || data.koi_period || 0,
      koi_duration: data.transit_duration || data.koi_duration || 0,
      koi_depth: data.transit_depth || data.koi_depth || 0,
      koi_impact: data.impact_parameter || data.koi_impact || 0,
      koi_steff: data.stellar_temperature || data.koi_steff || 0,
      koi_period_err1: data.koi_period_err1 || 0,
      koi_period_err2: data.koi_period_err2 || 0,
      koi_depth_err1: data.koi_depth_err1 || 0,
      koi_depth_err2: data.koi_depth_err2 || 0,
      koi_duration_err1: data.koi_duration_err1 || 0,
      koi_duration_err2: data.koi_duration_err2 || 0,
      koi_prad_err1: data.koi_prad_err1 || 0,
      koi_prad_err2: data.koi_prad_err2 || 0,
      koi_srad: data.stellar_radius || data.koi_srad || 0,
    }

    // Validate required inputs
    if (!modelInput.koi_period || !modelInput.koi_duration || !modelInput.koi_depth) {
      return NextResponse.json({ error: "Missing required features" }, { status: 400 })
    }

    // Call Python script with model input
    const inputJson = JSON.stringify(modelInput)
    const { stdout, stderr } = await execAsync(`python3 scripts/predict_exoplanet.py '${inputJson}'`)

    if (stderr) {
      console.error("[v0] Python script error:", stderr)
    }

    const result = JSON.parse(stdout)

    let classification, confidence, probability_exoplanet, probability_false_positive

    if (result.error) {
      // If model file doesn't exist, fall back to dummy logic
      console.warn("[v0] Model error, using fallback:", result.error)
      const fallbackResult = getFallbackClassification(data, modelInput)
      classification = fallbackResult.classification
      confidence = fallbackResult.confidence
      probability_exoplanet = fallbackResult.probability_exoplanet
      probability_false_positive = fallbackResult.probability_false_positive
    } else {
      classification = result.prediction === 1 ? "Confirmed" : "False Positive"
      confidence = result.confidence
      probability_exoplanet = result.probability_exoplanet
      probability_false_positive = result.probability_false_positive
    }

    return NextResponse.json({
      classification,
      confidence,
      probability_exoplanet,
      probability_false_positive,
      features: modelInput,
      timestamp: new Date().toISOString(),
      model_used: result.error ? "Fallback (No ML Model)" : "ML Model",
    })
  } catch (error) {
    console.error("[v0] Classification error:", error)
    return NextResponse.json({ error: "Classification failed" }, { status: 500 })
  }
}

function getFallbackClassification(originalData: any, modelInput: any) {
  // Dummy classification logic (easily replaceable with real model)
  const threshold = 0.0095
  let prediction = modelInput.koi_depth > threshold ? 1 : 0

  // Additional factors for more realistic dummy classification
  if (modelInput.koi_model_snr && modelInput.koi_model_snr < 10) prediction = 0
  if (modelInput.koi_prad && modelInput.koi_prad > 20) prediction = 0

  const distance = Math.abs(modelInput.koi_depth - threshold)
  const confidence = Math.min(0.5 + distance * 50, 0.99)

  const classification = prediction === 1 ? "Confirmed" : "False Positive"

  return {
    classification,
    confidence,
    probability_exoplanet: prediction === 1 ? confidence : 1 - confidence,
    probability_false_positive: prediction === 0 ? confidence : 1 - confidence,
  }
}
