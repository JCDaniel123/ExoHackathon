// Dummy exoplanet data that can easily be replaced with real model predictions
export interface ExoplanetData {
  id: string
  name: string
  snr: number // Signal-to-Noise Ratio
  flag_1: boolean
  flag_2: boolean
  flag_3: boolean
  flag_4: boolean
  disposition_score: number
  planetary_radius: number // Earth radii
  insolation_flux: number // Earth flux
  surface_gravity: number // m/s²
  orbital_period: number // days
  transit_duration: number // hours
  transit_depth: number // fraction
  impact_parameter: number
  stellar_magnitude: number
  classification: "Confirmed" | "Candidate" | "False Positive"
  confidence: number
}

// Generate dummy exoplanet data
export function generateDummyExoplanets(count = 50): ExoplanetData[] {
  const data: ExoplanetData[] = []

  for (let i = 0; i < count; i++) {
    const classification = Math.random() > 0.3 ? "Confirmed" : Math.random() > 0.5 ? "Candidate" : "False Positive"

    data.push({
      id: `KOI-${1000 + i}`,
      name: `Kepler-${1000 + i}b`,
      snr: Number((Math.random() * 50 + 5).toFixed(2)),
      flag_1: Math.random() > 0.7,
      flag_2: Math.random() > 0.8,
      flag_3: Math.random() > 0.85,
      flag_4: Math.random() > 0.9,
      disposition_score: Number((Math.random() * 0.5 + 0.5).toFixed(3)),
      planetary_radius: Number((Math.random() * 15 + 0.5).toFixed(2)),
      insolation_flux: Number((Math.random() * 2000 + 0.1).toFixed(2)),
      surface_gravity: Number((Math.random() * 30 + 2).toFixed(2)),
      orbital_period: Number((Math.random() * 400 + 0.5).toFixed(2)),
      transit_duration: Number((Math.random() * 8 + 1).toFixed(2)),
      transit_depth: Number((Math.random() * 0.04 + 0.001).toFixed(4)),
      impact_parameter: Number((Math.random() * 0.9).toFixed(3)),
      stellar_magnitude: Number((Math.random() * 8 + 8).toFixed(2)),
      classification,
      confidence: Number((Math.random() * 0.3 + 0.7).toFixed(3)),
    })
  }

  return data
}

// Parse CSV data
export function parseCSV(csvText: string): ExoplanetData[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  const data: ExoplanetData[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index]
    })

    // Map CSV columns to our data structure
    data.push({
      id: row.id || row.koi_id || `KOI-${i}`,
      name: row.name || row.kepler_name || `Kepler-${i}b`,
      snr: Number.parseFloat(row.snr || row.koi_snr || Math.random() * 50 + 5),
      flag_1: row.flag_1 === "true" || row.flag_1 === "1",
      flag_2: row.flag_2 === "true" || row.flag_2 === "1",
      flag_3: row.flag_3 === "true" || row.flag_3 === "1",
      flag_4: row.flag_4 === "true" || row.flag_4 === "1",
      disposition_score: Number.parseFloat(row.disposition_score || row.koi_score || Math.random()),
      planetary_radius: Number.parseFloat(row.planetary_radius || row.koi_prad || Math.random() * 15),
      insolation_flux: Number.parseFloat(row.insolation_flux || row.koi_insol || Math.random() * 2000),
      surface_gravity: Number.parseFloat(row.surface_gravity || row.koi_slogg || Math.random() * 30),
      orbital_period: Number.parseFloat(row.orbital_period || row.koi_period || Math.random() * 400),
      transit_duration: Number.parseFloat(row.transit_duration || row.koi_duration || Math.random() * 8),
      transit_depth: Number.parseFloat(row.transit_depth || row.koi_depth || Math.random() * 0.04),
      impact_parameter: Number.parseFloat(row.impact_parameter || row.koi_impact || Math.random()),
      stellar_magnitude: Number.parseFloat(row.stellar_magnitude || row.koi_kepmag || Math.random() * 8 + 8),
      classification: (row.classification || row.koi_disposition || "Candidate") as any,
      confidence: Number.parseFloat(row.confidence || Math.random() * 0.3 + 0.7),
    })
  }

  return data
}
