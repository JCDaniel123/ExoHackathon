import { ClassifierForm } from "@/components/classifier-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ClassifyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">Exoplanet Data Analyzer</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Enter exoplanet parameters to analyze whether the signal represents a confirmed exoplanet or a false
            positive using advanced data reading algorithms.
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Our system analyzes key features including orbital period, transit duration, transit depth, and additional
            parameters. Required fields are marked with *.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>
                  Upload a CSV file containing filter data or raw exoplanet observations. The file can include any
                  combination of the supported parameters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground mb-2">For bulk data analysis, use the Data Explorer</p>
                    <Button asChild>
                      <Link href="/data">Go to Data Explorer</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Enter Exoplanet Parameters</CardTitle>
                <CardDescription>
                  Manually input the key features for classification. Values should be based on observational data from
                  transit photometry.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassifierForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Feature Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Orbital Period (days)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The time it takes for the planet to complete one orbit around its host star. Typical values range from
                0.5 to 500+ days.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Transit Duration (hours)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The length of time the planet takes to cross in front of its star as seen from Earth. Usually between 1
                and 10 hours.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Transit Depth (fraction)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The fractional decrease in star brightness during transit. Typically 0.001 to 0.05 for confirmed
                exoplanets.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Stellar Magnitude</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The apparent brightness of the host star. Lower values indicate brighter stars. Range typically 8 to 16.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Planet Radius (Earth radii)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The size of the planet relative to Earth. Values range from 0.5 (smaller than Earth) to 20+ (gas
                giants).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
