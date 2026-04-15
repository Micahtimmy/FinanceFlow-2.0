import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/routes/Dashboard'
import { Transactions } from '@/routes/Transactions'
import { TransactionDetail } from '@/routes/TransactionDetail'
import { Budget } from '@/routes/Budget'
import { Savings } from '@/routes/Savings'
import { SavingsNew } from '@/routes/SavingsNew'
import { Bills } from '@/routes/Bills'
import { Analytics } from '@/routes/Analytics'
import { NetWorth } from '@/routes/NetWorth'
import { DebtTracker } from '@/routes/DebtTracker'
import { Investments } from '@/routes/Investments'
import { IncomeTracker } from '@/routes/IncomeTracker'
import { Retirement } from '@/routes/Retirement'
import { Settings } from '@/routes/Settings'
import { More } from '@/routes/More'
import { Import } from '@/routes/Import'
import { NotFound } from '@/routes/NotFound'
import {
  OnboardingLayout,
  Welcome,
  GoalSelection,
  Profile,
  FirstAction,
  Complete,
} from '@/routes/onboarding'
import { Login, Signup, ForgotPassword } from '@/routes/auth'

export const router = createBrowserRouter([
  // Auth routes
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/signup',
    element: <Signup />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  // Onboarding routes
  {
    path: '/onboarding',
    element: <OnboardingLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/onboarding/welcome" replace />,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'goal',
        element: <GoalSelection />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'first-action',
        element: <FirstAction />,
      },
      {
        path: 'complete',
        element: <Complete />,
      },
    ],
  },
  // Main app routes
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'transactions/:id',
        element: <TransactionDetail />,
      },
      {
        path: 'budget',
        element: <Budget />,
      },
      {
        path: 'savings',
        element: <Savings />,
      },
      {
        path: 'savings/new',
        element: <SavingsNew />,
      },
      {
        path: 'bills',
        element: <Bills />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'net-worth',
        element: <NetWorth />,
      },
      {
        path: 'debt-tracker',
        element: <DebtTracker />,
      },
      {
        path: 'investments',
        element: <Investments />,
      },
      {
        path: 'income-tracker',
        element: <IncomeTracker />,
      },
      {
        path: 'retirement',
        element: <Retirement />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'import',
        element: <Import />,
      },
      {
        path: 'more',
        element: <More />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
