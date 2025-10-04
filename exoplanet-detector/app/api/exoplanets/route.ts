import { NextResponse } from "next/server"
import { generateDummyExoplanets } from "@/lib/dummy-data"

export async function GET() {
  // Return dummy exoplanet data
  // This can be replaced with actual database queries or model predictions
  const exoplanets = generateDummyExoplanets(100)

  return NextResponse.json({
    exoplanets,
    count: exoplanets.length,
    timestamp: new Date().toISOString(),
  })
}
