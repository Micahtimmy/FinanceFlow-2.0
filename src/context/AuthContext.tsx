import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isDemoMode: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo mode user for when Supabase is not configured
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@financeflow.app',
  app_metadata: {},
  user_metadata: { display_name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, auto-login with demo user
      setUser(DEMO_USER)
      setIsLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (isDemoMode) {
        setUser({ ...DEMO_USER, email, user_metadata: { display_name: displayName } })
        return { error: null }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      })

      return { error: error as Error | null }
    },
    []
  )

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      setUser({ ...DEMO_USER, email })
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error: error as Error | null }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (isDemoMode) {
      setUser(DEMO_USER)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    return { error: error as Error | null }
  }, [])

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setUser(null)
      return
    }

    await supabase.auth.signOut()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (isDemoMode) {
      return { error: null }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    return { error: error as Error | null }
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    if (isDemoMode) {
      return { error: null }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    return { error: error as Error | null }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDemoMode,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
