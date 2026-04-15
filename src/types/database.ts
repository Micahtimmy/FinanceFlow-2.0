// Database types for Supabase
// These should be generated with `supabase gen types typescript` in production

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          monthly_income: number | null
          primary_currency: string
          financial_persona: string | null
          onboarding_complete: boolean
          primary_goal: string | null
          preferences: UserPreferences
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          monthly_income?: number | null
          primary_currency?: string
          financial_persona?: string | null
          onboarding_complete?: boolean
          primary_goal?: string | null
          preferences?: UserPreferences
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          monthly_income?: number | null
          primary_currency?: string
          financial_persona?: string | null
          onboarding_complete?: boolean
          primary_goal?: string | null
          preferences?: UserPreferences
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          amount: number
          currency: string
          type: 'expense' | 'income' | 'transfer'
          category_id: string | null
          merchant_name: string
          note: string | null
          is_recurring: boolean
          recurrence_pattern: string | null
          recurrence_group_id: string | null
          import_source: 'manual' | 'csv' | 'plaid'
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['transactions']['Row']>
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          color: string
          budget_amount: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['savings_goals']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['savings_goals']['Row']>
      }
      bills: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          due_date: string
          is_paid: boolean
          is_recurring: boolean
          recurrence_pattern: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['bills']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['bills']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'bill_due' | 'budget_alert' | 'savings_milestone' | 'insight' | 'system'
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
    }
  }
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  accentColor?: string
  font?: string
  dashboardDensity?: 'comfortable' | 'compact'
  notifications?: {
    billDue?: { email: boolean; push: boolean; inApp: boolean }
    budgetAlert?: { email: boolean; push: boolean; inApp: boolean }
    largeTransaction?: { email: boolean; push: boolean; inApp: boolean }
    aiInsight?: { email: boolean; push: boolean; inApp: boolean }
    weeklySummary?: { email: boolean; push: boolean; inApp: boolean }
    monthlyNetWorth?: { email: boolean; push: boolean; inApp: boolean }
    savingsGoal?: { email: boolean; push: boolean; inApp: boolean }
  }
}
