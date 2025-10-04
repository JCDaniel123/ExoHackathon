import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Telescope, Satellite, Brain, Database, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance">About ExoDetect</h1>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Learn about exoplanet detection, our data analysis approach, and the science behind discovering worlds
            beyond our solar system.
          </p>
        </div>

        {/* What are Exoplanets */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Telescope className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">What are Exoplanets?</h2>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="leading-relaxed">
                Exoplanets, or extrasolar planets, are planets that orbit stars outside our solar system. Since the
                first confirmed detection in 1992, astronomers have discovered thousands of exoplanets using various
                detection methods.
              </p>

              <p className="leading-relaxed">
                These distant worlds come in all sizes, from small rocky planets like Earth to massive gas giants larger
                than Jupiter. Some orbit close to their stars with scorching temperatures, while others exist in the
                "habitable zone" where liquid water could potentially exist.
              </p>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-1">5,000+</div>
                  <div className="text-sm text-muted-foreground">Confirmed Exoplanets</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-1">3,700+</div>
                  <div className="text-sm text-muted-foreground">Planetary Systems</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-primary mb-1">800+</div>
                  <div className="text-sm text-muted-foreground">Multi-Planet Systems</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detection Methods */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Satellite className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Transit Method Detection</h2>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="leading-relaxed">
                The <strong>transit method</strong> is the most successful technique for discovering exoplanets. It
                works by detecting the tiny dip in a star's brightness when a planet passes in front of it from our
                perspective.
              </p>

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>How It Works</AlertTitle>
                <AlertDescription>
                  When a planet transits its star, it blocks a small fraction of the star's light. By precisely
                  measuring these periodic brightness dips, astronomers can determine the planet's size, orbital period,
                  and other characteristics.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 pt-2">
                <h4 className="font-semibold">Key Observable Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Transit Depth:</strong> The percentage of light blocked reveals the planet's size relative
                      to its star
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Transit Duration:</strong> How long the planet takes to cross the star's disk
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Orbital Period:</strong> The time between transits indicates the planet's orbital distance
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NASA Missions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">NASA Space Missions</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  2009-2018
                </Badge>
                <CardTitle>Kepler</CardTitle>
                <CardDescription>The pioneering exoplanet hunter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  NASA's Kepler mission discovered over 2,600 confirmed exoplanets by continuously monitoring 150,000
                  stars in a single patch of sky.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  2014-2018
                </Badge>
                <CardTitle>K2</CardTitle>
                <CardDescription>Kepler's extended mission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  After Kepler's reaction wheels failed, the K2 mission continued the search, discovering hundreds more
                  exoplanets across different regions of the sky.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  2018-Present
                </Badge>
                <CardTitle>TESS</CardTitle>
                <CardDescription>Transiting Exoplanet Survey Satellite</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  TESS surveys the entire sky, focusing on nearby bright stars to find exoplanets suitable for detailed
                  follow-up studies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Machine Learning Approach */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Our Machine Learning Approach</h2>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="leading-relaxed">
                ExoDetect AI uses a <strong>Random Forest classifier</strong> trained on NASA's open-source exoplanet
                datasets. The model learns to distinguish between genuine exoplanet signals and false positives caused
                by stellar activity, binary stars, or instrumental artifacts.
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold">Model Features:</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Orbital Period</strong>
                    <p className="text-muted-foreground text-xs mt-1">Time for one complete orbit</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Transit Duration</strong>
                    <p className="text-muted-foreground text-xs mt-1">Length of the transit event</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Transit Depth</strong>
                    <p className="text-muted-foreground text-xs mt-1">Brightness decrease during transit</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Stellar Magnitude</strong>
                    <p className="text-muted-foreground text-xs mt-1">Host star brightness</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm md:col-span-2">
                    <strong>Planet Radius</strong>
                    <p className="text-muted-foreground text-xs mt-1">Size relative to Earth</p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTitle>Model Performance</AlertTitle>
                <AlertDescription>
                  Our current model achieves 84.7% accuracy with 82.3% precision and 89.1% recall on validation data,
                  making it a reliable tool for preliminary exoplanet classification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is the AI model?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                The model achieves 84.7% accuracy on validation data. While this is suitable for preliminary
                classification and educational purposes, professional astronomers use additional verification methods
                before confirming exoplanet discoveries.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What causes false positives in exoplanet detection?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                False positives can be caused by eclipsing binary stars, stellar activity (like starspots), instrumental
                noise, or background eclipsing binaries. Our model is trained to recognize these patterns and
                distinguish them from genuine planetary transits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use this for research?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                ExoDetect AI is designed for educational purposes and preliminary analysis. For research-grade
                classifications, we recommend using professional tools and peer-reviewed methods. However, this platform
                is excellent for learning about exoplanet detection and exploring NASA mission data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Where does the training data come from?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our model is trained on open-source datasets from NASA's Kepler, K2, and TESS missions. These datasets
                include thousands of confirmed exoplanets and false positives, providing a robust foundation for machine
                learning classification.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How can I learn more about exoplanets?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                NASA provides excellent resources including the Exoplanet Archive, Eyes on Exoplanets visualization
                tool, and educational materials. The European Space Agency (ESA) and professional astronomy
                organizations also offer comprehensive exoplanet resources.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Resources */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Additional Resources</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NASA Exoplanet Archive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Access the complete catalog of confirmed exoplanets and mission data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eyes on Exoplanets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive 3D visualization of known exoplanets and their systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-br from-blue-950/20 to-purple-950/20 border-primary/20">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Start Classifying?</h3>
            <p className="text-muted-foreground">Try our data analyzer with your own exoplanet parameters.</p>
            <Button asChild size="lg">
              <Link href="/classify">Launch Classifier</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
