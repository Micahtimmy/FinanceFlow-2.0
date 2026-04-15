import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'

export type GoalId =
  | 'budget'
  | 'save'
  | 'debt'
  | 'invest'
  | 'net-worth'
  | 'emergency-fund'
  | 'income'
  | 'retire'
  | 'bills'
  | 'spending'

export interface GoalOption {
  id: GoalId
  title: string
  description: string
  routesTo: string
  icon: string
}

export const goalOptions: GoalOption[] = [
  {
    id: 'budget',
    title: 'Get on a budget',
    description: "I want to know where my money goes every month",
    routesTo: '/dashboard?focus=budget',
    icon: '📊',
  },
  {
    id: 'save',
    title: 'Build my savings',
    description: "I'm working towards a specific savings target",
    routesTo: '/savings',
    icon: '💰',
  },
  {
    id: 'debt',
    title: 'Pay off debt',
    description: 'I want a clear plan to eliminate what I owe',
    routesTo: '/debt-tracker',
    icon: '💳',
  },
  {
    id: 'invest',
    title: 'Start investing',
    description: 'I want to grow my wealth beyond a savings account',
    routesTo: '/investments',
    icon: '📈',
  },
  {
    id: 'net-worth',
    title: 'Track net worth',
    description: 'I want a complete picture of my assets and liabilities',
    routesTo: '/net-worth',
    icon: '🏦',
  },
  {
    id: 'emergency-fund',
    title: 'Build emergency fund',
    description: 'I need 3-6 months of expenses saved first',
    routesTo: '/savings?type=emergency',
    icon: '🛡️',
  },
  {
    id: 'income',
    title: 'Grow my income',
    description: 'I want to track side income and hit a revenue goal',
    routesTo: '/income-tracker',
    icon: '💵',
  },
  {
    id: 'retire',
    title: 'Plan for retirement',
    description: 'I want to understand if I\'m on track for the future',
    routesTo: '/retirement',
    icon: '🏖️',
  },
  {
    id: 'bills',
    title: 'Manage bills',
    description: 'I keep missing payments and want to stay on top of them',
    routesTo: '/bills',
    icon: '📅',
  },
  {
    id: 'spending',
    title: 'Cut spending',
    description: 'I want to find where I\'m overspending and fix it',
    routesTo: '/analytics?focus=spending',
    icon: '✂️',
  },
]

export interface OnboardingState {
  currentStep: number
  selectedGoal: GoalId | null
  displayName: string
  monthlyIncome: number
  primaryCurrency: string
  firstActionData: Record<string, unknown>
  isComplete: boolean
}

type OnboardingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_GOAL'; payload: GoalId }
  | { type: 'SET_PROFILE'; payload: { displayName: string; monthlyIncome: number; primaryCurrency: string } }
  | { type: 'SET_FIRST_ACTION_DATA'; payload: Record<string, unknown> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' }
  | { type: 'HYDRATE'; payload: OnboardingState }

const initialState: OnboardingState = {
  currentStep: 1,
  selectedGoal: null,
  displayName: '',
  monthlyIncome: 0,
  primaryCurrency: 'USD',
  firstActionData: {},
  isComplete: false,
}

const STORAGE_KEY = 'financeflow-onboarding'

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_GOAL':
      return { ...state, selectedGoal: action.payload }
    case 'SET_PROFILE':
      return {
        ...state,
        displayName: action.payload.displayName,
        monthlyIncome: action.payload.monthlyIncome,
        primaryCurrency: action.payload.primaryCurrency,
      }
    case 'SET_FIRST_ACTION_DATA':
      return { ...state, firstActionData: action.payload }
    case 'COMPLETE_ONBOARDING':
      return { ...state, isComplete: true }
    case 'RESET_ONBOARDING':
      return initialState
    case 'HYDRATE':
      return action.payload
    default:
      return state
  }
}

interface OnboardingContextType {
  state: OnboardingState
  setStep: (step: number) => void
  setGoal: (goal: GoalId) => void
  setProfile: (profile: { displayName: string; monthlyIncome: number; primaryCurrency: string }) => void
  setFirstActionData: (data: Record<string, unknown>) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  getSelectedGoalDetails: () => GoalOption | undefined
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as OnboardingState
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch {
        // Invalid stored data, use initial state
      }
    }
  }, [])

  // Persist to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setStep = (step: number) => dispatch({ type: 'SET_STEP', payload: step })
  const setGoal = (goal: GoalId) => dispatch({ type: 'SET_GOAL', payload: goal })
  const setProfile = (profile: { displayName: string; monthlyIncome: number; primaryCurrency: string }) =>
    dispatch({ type: 'SET_PROFILE', payload: profile })
  const setFirstActionData = (data: Record<string, unknown>) =>
    dispatch({ type: 'SET_FIRST_ACTION_DATA', payload: data })
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' })
  const resetOnboarding = () => dispatch({ type: 'RESET_ONBOARDING' })

  const getSelectedGoalDetails = () => {
    if (!state.selectedGoal) return undefined
    return goalOptions.find((g) => g.id === state.selectedGoal)
  }

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setStep,
        setGoal,
        setProfile,
        setFirstActionData,
        completeOnboarding,
        resetOnboarding,
        getSelectedGoalDetails,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
