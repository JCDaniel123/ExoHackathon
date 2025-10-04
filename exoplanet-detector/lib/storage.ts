// Client-side storage utilities for persisting exoplanet data
import type { ExoplanetData } from "./dummy-data"

const STORAGE_KEY = "exoplanet_data"

export function saveExoplanets(data: ExoplanetData[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadExoplanets(): ExoplanetData[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("[v0] Failed to parse stored data:", error)
        return []
      }
    }
  }
  return []
}

export function clearExoplanets(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
