import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      orbital_period,
      transit_duration,
      transit_depth,
      stellar_magnitude,
      planet_radius,
      insolation_flux,
      surface_gravity,
      impact_parameter,
      snr,
    } = data

    // Validate required inputs
    if (!orbital_period || !transit_duration || !transit_depth) {
      return NextResponse.json({ error: "Missing required features" }, { status: 400 })
    }

    // Dummy classification logic (easily replaceable with real model)
    // This simulates model behavior and can be swapped with actual ML inference
    const threshold = 0.0095
    let prediction = transit_depth > threshold ? 1 : 0

    // Additional factors for more realistic dummy classification
    if (snr && snr < 10) prediction = 0
    if (planet_radius && planet_radius > 20) prediction = 0

    const distance = Math.abs(transit_depth - threshold)
    const confidence = Math.min(0.5 + distance * 50, 0.99)

    const classification = prediction === 1 ? "Confirmed" : "False Positive"

    return NextResponse.json({
      classification,
      confidence: confidence,
      probability_exoplanet: prediction === 1 ? confidence : 1 - confidence,
      probability_false_positive: prediction === 0 ? confidence : 1 - confidence,
      features: {
        orbital_period,
        transit_duration,
        transit_depth,
        stellar_magnitude,
        planet_radius,
        insolation_flux,
        surface_gravity,
        impact_parameter,
        snr,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Classification error:", error)
    return NextResponse.json({ error: "Classification failed" }, { status: 500 })
  }
}
