import { Mail, MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background decorative planets */}
      <div className="absolute top-20 right-10 w-48 h-48 opacity-10 planet-visual">
        <img src="/jupiter-planet.png" alt="" className="w-full h-full rotating" />
      </div>
      <div className="absolute bottom-40 left-10 w-56 h-56 opacity-10 planet-visual" style={{ animationDelay: "3s" }}>
        <img src="/saturn-with-rings.png" alt="" className="w-full h-full rotating" />
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              Have questions about exoplanet detection or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:contact@exodetect.space"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    contact@exodetect.space
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle>Research Inquiries</CardTitle>
                  <CardDescription>For academic collaboration</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:research@exodetect.space"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    research@exodetect.space
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>We typically respond within</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">24-48 hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center space-y-4">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Before reaching out, you might find answers in our{" "}
              <a href="/about" className="text-primary hover:text-primary/80 transition-colors font-medium">
                About page
              </a>{" "}
              or{" "}
              <a href="/statistics" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Statistics section
              </a>
              . For technical documentation about our detection methods, visit our educational resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
