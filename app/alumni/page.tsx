import Link from "next/link"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/sections/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Linkedin } from "lucide-react"
import alumniData from "@/app/alumni/constants" 

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-4">Alumni Network</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Our alumni have gone on to achieve remarkable success in various fields. 
            Connect with former RobotiX Club members and see where their journey has taken them.
          </p>
        </div>

        <div className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <blockquote className="text-lg italic">
                "The RobotiX Club alumni network represents a powerful community of innovators, 
                researchers, and industry leaders who continue to push the boundaries of technology 
                and robotics across the globe."
              </blockquote>
              <div className="mt-4 font-semibold">— RobotiX Club Faculty Advisor</div>
            </CardContent>
          </Card>
        </div>

        {/* Alumni Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {alumniData.map((alumni, index) => (
            <AlumniCard key={index} alumni={alumni} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Are You an Alumni?</h2>
          <p className="text-muted-foreground mb-6">
            If you're a former RobotiX Club member and would like to be featured on this page, 
            we'd love to hear from you and share your success story.
          </p>
          <Button size="lg">Connect With Us</Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface SimpleAlumni {
  name: string
  branch: string
  linkedin: string
}

function AlumniCard({ alumni }: { alumni: SimpleAlumni }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src="/placeholder.svg" alt={alumni.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-semibold">
              {alumni.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{alumni.name}</CardTitle>
            <CardDescription className="text-primary font-medium">
              {alumni.branch} Engineering
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {/* No duplicate branch here */}
      </CardContent>
      <div className="px-6 pb-6 mt-2 flex gap-3">
        {alumni.linkedin && (
          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
        )}
      </div>
    </Card>
  )
}
