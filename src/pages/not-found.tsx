import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" strokeWidth={1} />
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mt-2 text-center max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
