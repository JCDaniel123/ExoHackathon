import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, BarChart3, Upload, Zap, Database, ArrowRight, Sparkles, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/10 to-background" />

        <div className="absolute top-20 right-10 w-64 h-64 opacity-20 planet-visual">
          <img src="/jupiter-planet.png" alt="" className="w-full h-full rotating" />
        </div>
        <div className="absolute top-40 left-20 w-48 h-48 opacity-15 planet-visual" style={{ animationDelay: "3s" }}>
          <img src="/earth-blue-planet.jpg" alt="" className="w-full h-full rotating" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by NASA Mission Data
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Discover Exoplanets with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Advanced Data Analysis
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Analyze data from NASA Kepler, K2, and TESS missions to identify and classify exoplanets with precision
              data reading and visualization tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/classify">
                  Start Analyzing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">84.7%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">12.8K+</div>
                <div className="text-sm text-muted-foreground">Classifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">5K+</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="absolute top-20 right-20 w-56 h-56 opacity-10 planet-visual" style={{ animationDelay: "5s" }}>
          <img src="/neptune-blue-planet.jpg" alt="" className="w-full h-full rotating" />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our data analysis pipeline processes key exoplanet features to make accurate predictions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Input Exoplanet Parameters</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Provide key features like orbital period, transit duration, transit depth, stellar magnitude, and
                  planet radius either manually or via CSV upload.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our system analyzes the data using patterns learned from thousands of confirmed exoplanets and false
                  positives from NASA missions.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Classification Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive instant classification as either a confirmed exoplanet or false positive, along with
                  confidence scores and probability metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30 relative">
        <div className="absolute top-40 left-10 w-48 h-48 opacity-10 planet-visual" style={{ animationDelay: "2s" }}>
          <img src="/saturn-with-rings.png" alt="" className="w-full h-full rotating" />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Powerful Features for Exoplanet Detection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Built for researchers and enthusiasts alike, with tools to analyze, classify, and understand exoplanet
              data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link href="/classify" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle>Advanced Data Reading</CardTitle>
                  <CardDescription>
                    Automated analysis of exoplanet parameters using sophisticated algorithms trained on NASA data
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/data" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle>CSV Data Upload</CardTitle>
                  <CardDescription>
                    Upload filter data or raw exoplanet observations for instant analysis and classification
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/statistics" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-pink-400" />
                  </div>
                  <CardTitle>Real-Time Statistics</CardTitle>
                  <CardDescription>
                    View accuracy metrics, feature importance, and comprehensive data analysis in real-time
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/explore" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle>3D Visualization</CardTitle>
                  <CardDescription>
                    Explore discovered exoplanets in an interactive 3D solar system with detailed information
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/classify" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle>Instant Results</CardTitle>
                  <CardDescription>Get classification results with confidence scores in milliseconds</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/about" className="block">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle>Educational Resources</CardTitle>
                  <CardDescription>
                    Learn about exoplanet detection methods and the science behind transit photometry
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-blue-950/20 to-purple-950/20 relative">
        <div
          className="absolute bottom-20 right-20 w-56 h-56 opacity-15 planet-visual"
          style={{ animationDelay: "4s" }}
        >
          <img src="/mars-red-planet.jpg" alt="" className="w-full h-full rotating" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-balance">Ready to Discover New Worlds?</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Start analyzing exoplanet data with our advanced detection system today.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/classify">
                Launch Analyzer
                <Rocket className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
