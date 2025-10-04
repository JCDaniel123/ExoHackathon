import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      "koi_model_snr",
      "koi_prad",
      "koi_insol",
      "koi_slogg",
      "koi_period",
      "koi_duration",
      "koi_depth",
      "koi_impact",
      "koi_steff",
      "koi_period_err1",
      "koi_period_err2",
      "koi_depth_err1",
      "koi_depth_err2",
      "koi_duration_err1",
      "koi_duration_err2",
      "koi_prad_err1",
      "koi_prad_err2",
      "koi_srad",
    ]

    const missingFields = requiredFields.filter((field) => !(field in data))
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Run Python script
    const scriptPath = path.join(process.cwd(), "scripts", "predict_exoplanet.py")
    const inputData = JSON.stringify(data)

    return new Promise((resolve) => {
      const python = spawn("python3", [scriptPath, inputData])

      let stdout = ""
      let stderr = ""

      python.stdout.on("data", (data) => {
        stdout += data.toString()
      })

      python.stderr.on("data", (data) => {
        stderr += data.toString()
      })

      python.on("close", (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ error: `Python script failed: ${stderr}` }, { status: 500 }))
          return
        }

        try {
          const result = JSON.parse(stdout)
          resolve(NextResponse.json(result))
        } catch (error) {
          resolve(NextResponse.json({ error: "Failed to parse prediction result" }, { status: 500 }))
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
