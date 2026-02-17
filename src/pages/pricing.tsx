import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const tiers = [
  { name: 'Starter', price: '$29', description: 'Small teams', cta: 'Start free trial' },
  { name: 'Professional', price: '$79', description: 'Growing firms', cta: 'Start free trial' },
  { name: 'Enterprise', price: 'Custom', description: 'Large organizations', cta: 'Contact sales' },
]

export function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Pricing</h1>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your firm.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-2xl font-bold">{t.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <Button className="mt-4 w-full" asChild>
                  <Link to="/signup">{t.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
