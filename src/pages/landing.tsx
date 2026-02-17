import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ClipboardList,
  Calendar,
  Users,
  LayoutTemplate,
  BarChart3,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    title: 'Decision Log',
    description: 'Visual comparison cards with media and cost impacts. Clients approve or request changes inline.',
    icon: ClipboardList,
    href: '/login',
  },
  {
    title: 'Phase Timeline',
    description: 'Interactive phase-based timelines with milestones. Templates accelerate project setup.',
    icon: Calendar,
    href: '/login',
  },
  {
    title: 'Client Portal',
    description: 'Simplified UX, magic links, and weekly summaries. Low-friction approvals and e-sign capture.',
    icon: Users,
    href: '/login',
  },
  {
    title: 'Templates & Workflow',
    description: 'Reusable project patterns. Clone and apply templates for consistency and speed.',
    icon: LayoutTemplate,
    href: '/login',
  },
  {
    title: 'Reports & Analytics',
    description: 'Project health, pending approvals, and exportable reports for stakeholders.',
    icon: BarChart3,
    href: '/login',
  },
]

const steps = [
  'Create a project and apply a template',
  'Publish decision cards with options and cost impact',
  'Clients review and approve via magic link or portal',
  'Track everything in one place with full audit trail',
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto max-w-1280 px-6 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Client decisions & project hub for{' '}
              <span className="text-primary">architects</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              One source of truth for every client choice, approval, and deliverable. Reduce scope creep and miscommunication with visual decision cards, phase timelines, and legal-grade audit trails.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link to="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/login">Request Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards - Bento-style grid */}
      <section className="container mx-auto max-w-1280 px-6 py-16 lg:py-24">
        <h2 className="text-2xl font-semibold text-center mb-12">Everything you need to run projects</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="group-hover:text-primary p-0" asChild>
                  <Link to={f.href}>
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-1280 px-6 py-16 lg:py-24">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {i + 1}
                </div>
                <p className="text-muted-foreground pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-1280 px-6 py-16 lg:py-24">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to streamline client decisions?</CardTitle>
            <CardDescription className="text-base">
              Join architecture firms that use SpecLogix to keep every approval and deliverable in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto max-w-1280 px-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© SpecLogix. Client decision & project hub for architects.</span>
          <div className="flex gap-6">
            <Link to="/signup-/-login" className="text-sm text-muted-foreground hover:text-foreground">Sign in / Sign up</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
