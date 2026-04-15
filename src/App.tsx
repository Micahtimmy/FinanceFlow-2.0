import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { UserProvider } from '@/context/UserContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { router } from '@/router'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <OnboardingProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </OnboardingProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
