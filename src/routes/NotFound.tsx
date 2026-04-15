import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <p className="mt-4 text-xl text-[var(--color-text-secondary)]">
          Page not found
        </p>
        <p className="mt-2 text-[var(--color-text-muted)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
