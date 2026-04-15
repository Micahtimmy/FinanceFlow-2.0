import type { Transaction, Category, Bill, SavingsGoal } from '@/types'

export type InsightType = 'red_flag' | 'opportunity' | 'milestone' | 'tip'
export type InsightSeverity = 'high' | 'medium' | 'low'

export interface AIInsight {
  id: string
  type: InsightType
  title: string
  body: string
  severity: InsightSeverity
  actionLabel: string
  actionRoute: string
  createdAt: Date
}

export interface FinancialSnapshot {
  categories: Category[]
  transactions: Transaction[]
  bills: Bill[]
  savingsGoals: SavingsGoal[]
  monthlyIncome: number
}

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

/**
 * Generate AI insights using Google Gemini API
 * Falls back to rule-based insights if API call fails
 */
export async function generateInsights(
  snapshot: FinancialSnapshot,
  apiKey?: string
): Promise<AIInsight[]> {
  // Try Gemini API first if API key is available
  if (apiKey) {
    try {
      const geminiInsights = await callGeminiAPI(snapshot, apiKey)
      if (geminiInsights.length > 0) {
        return geminiInsights
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to rule-based insights:', error)
    }
  }

  // Fall back to rule-based insights
  return generateRuleBasedInsights(snapshot)
}

/**
 * Call the Gemini API for AI-powered insights
 */
async function callGeminiAPI(
  snapshot: FinancialSnapshot,
  apiKey: string
): Promise<AIInsight[]> {
  const prompt = buildInsightPrompt(snapshot)

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('No content in Gemini response')
  }

  try {
    const parsed = JSON.parse(text)
    return (parsed.insights || parsed).map((insight: Partial<AIInsight>, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: insight.type || 'tip',
      title: insight.title || '',
      body: insight.body || '',
      severity: insight.severity || 'medium',
      actionLabel: insight.actionLabel || 'View',
      actionRoute: insight.actionRoute || '/dashboard',
      createdAt: new Date(),
    }))
  } catch {
    throw new Error('Failed to parse Gemini response as JSON')
  }
}

/**
 * Build the prompt for Gemini API
 */
function buildInsightPrompt(snapshot: FinancialSnapshot): string {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()

  // Calculate spending per category this month
  const categorySpending: Record<string, { budgeted: number; spent: number }> = {}
  snapshot.categories.forEach((cat) => {
    if (cat.budgetAmount) {
      categorySpending[cat.name] = {
        budgeted: cat.budgetAmount,
        spent: 0,
      }
    }
  })

  snapshot.transactions.forEach((tx) => {
    if (tx.type === 'expense' && new Date(tx.date) >= startOfMonth) {
      const category = snapshot.categories.find((c) => c.id === tx.categoryId)
      if (category && categorySpending[category.name]) {
        categorySpending[category.name].spent += tx.amount
      }
    }
  })

  // Calculate 3-month average spend per category
  const threeMonthsAgo = new Date(now)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const historicalSpending: Record<string, number> = {}

  snapshot.transactions.forEach((tx) => {
    if (tx.type === 'expense' && new Date(tx.date) >= threeMonthsAgo) {
      const category = snapshot.categories.find((c) => c.id === tx.categoryId)
      if (category) {
        historicalSpending[category.name] = (historicalSpending[category.name] || 0) + tx.amount
      }
    }
  })

  // Divide by 3 to get monthly average
  Object.keys(historicalSpending).forEach((key) => {
    historicalSpending[key] = Math.round(historicalSpending[key] / 3)
  })

  // Calculate savings rate
  const monthlyExpenses = snapshot.transactions
    .filter((tx) => tx.type === 'expense' && new Date(tx.date) >= startOfMonth)
    .reduce((sum, tx) => sum + tx.amount, 0)
  const savingsRate =
    snapshot.monthlyIncome > 0
      ? Math.round(((snapshot.monthlyIncome - monthlyExpenses) / snapshot.monthlyIncome) * 100)
      : 0

  // Bills due in next 7 days
  const sevenDaysFromNow = new Date(now)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const upcomingBills = snapshot.bills.filter(
    (b) => !b.isPaid && new Date(b.dueDate) >= now && new Date(b.dueDate) <= sevenDaysFromNow
  )

  const prompt = `You are a warm, direct financial advisor analyzing a user's financial data.

CURRENT FINANCIAL STATE:
- Days remaining in month: ${daysRemaining}
- Monthly income: $${snapshot.monthlyIncome}
- Current savings rate: ${savingsRate}%

BUDGET VS ACTUAL (this month):
${Object.entries(categorySpending)
  .map(([name, data]) => `- ${name}: $${data.spent} of $${data.budgeted} (${Math.round((data.spent / data.budgeted) * 100)}%)`)
  .join('\n')}

3-MONTH AVERAGE SPENDING:
${Object.entries(historicalSpending)
  .map(([name, avg]) => `- ${name}: $${avg}/month`)
  .join('\n')}

UPCOMING BILLS (next 7 days):
${upcomingBills.length > 0 ? upcomingBills.map((b) => `- ${b.name}: $${b.amount} due ${new Date(b.dueDate).toLocaleDateString()}`).join('\n') : '- No bills due'}

SAVINGS GOALS:
${snapshot.savingsGoals.map((g) => `- ${g.name}: $${g.currentAmount} of $${g.targetAmount} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`).join('\n')}

Return a JSON array of 3-5 insights. Each insight must have:
- type: "red_flag" | "opportunity" | "milestone" | "tip"
- title: max 8 words, be specific with numbers
- body: max 25 words, actionable advice
- severity: "high" | "medium" | "low"
- actionLabel: max 4 words, a call-to-action
- actionRoute: a valid app route like "/budget", "/savings", "/bills", "/analytics"

Focus on:
1. Categories over 80% budget with days remaining
2. Spending spikes vs 3-month average
3. Bills due soon
4. Savings milestones or lack of progress

Return ONLY the JSON array, no markdown.`

  return prompt
}

/**
 * Generate rule-based insights as a fallback
 */
export function generateRuleBasedInsights(snapshot: FinancialSnapshot): AIInsight[] {
  const insights: AIInsight[] = []
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  // Calculate spending per category this month
  const categorySpending: Map<string, { category: Category; spent: number }> = new Map()

  snapshot.categories.forEach((cat) => {
    if (cat.budgetAmount) {
      categorySpending.set(cat.id, { category: cat, spent: 0 })
    }
  })

  snapshot.transactions.forEach((tx) => {
    if (tx.type === 'expense' && new Date(tx.date) >= startOfMonth) {
      const catData = categorySpending.get(tx.categoryId)
      if (catData) {
        catData.spent += tx.amount
      }
    }
  })

  // Rule 1: Category spend > 80% with > 10 days left
  categorySpending.forEach(({ category, spent }) => {
    if (!category.budgetAmount) return

    const percentage = (spent / category.budgetAmount) * 100
    if (percentage >= 80 && daysRemaining > 10) {
      insights.push({
        id: `rule-budget-${category.id}`,
        type: 'red_flag',
        title: `${category.name} budget almost gone`,
        body: `You've used ${Math.round(percentage)}% with ${daysRemaining} days left. Consider cutting back.`,
        severity: 'high',
        actionLabel: 'View Budget',
        actionRoute: '/budget',
        createdAt: now,
      })
    }
  })

  // Rule 2: Spending spike vs 3-month average (> 40%)
  const threeMonthsAgo = new Date(now)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const historicalByCategory: Map<string, number[]> = new Map()

  snapshot.transactions.forEach((tx) => {
    if (tx.type === 'expense' && new Date(tx.date) >= threeMonthsAgo && new Date(tx.date) < startOfMonth) {
      const amounts = historicalByCategory.get(tx.categoryId) || []
      amounts.push(tx.amount)
      historicalByCategory.set(tx.categoryId, amounts)
    }
  })

  categorySpending.forEach(({ category, spent }) => {
    const historical = historicalByCategory.get(category.id) || []
    if (historical.length === 0) return

    const avgMonthlySpend = historical.reduce((a, b) => a + b, 0) / 3
    if (avgMonthlySpend > 0) {
      // Project current spending to full month
      const daysPassed = daysInMonth - daysRemaining
      const projectedSpend = daysPassed > 0 ? (spent / daysPassed) * daysInMonth : spent
      const increase = ((projectedSpend - avgMonthlySpend) / avgMonthlySpend) * 100

      if (increase > 40) {
        insights.push({
          id: `rule-spike-${category.id}`,
          type: 'red_flag',
          title: `Unusual ${category.name} spending`,
          body: `You're on track to spend ${Math.round(increase)}% more than your 3-month average.`,
          severity: 'medium',
          actionLabel: 'Review Spending',
          actionRoute: '/analytics?focus=spending',
          createdAt: now,
        })
      }
    }
  })

  // Rule 3: No savings contribution in 14+ days
  const twoWeeksAgo = new Date(now)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const recentSavingsTransfers = snapshot.transactions.filter(
    (tx) =>
      tx.type === 'transfer' &&
      new Date(tx.date) >= twoWeeksAgo &&
      tx.note?.toLowerCase().includes('saving')
  )

  if (recentSavingsTransfers.length === 0 && snapshot.savingsGoals.length > 0) {
    insights.push({
      id: 'rule-no-savings',
      type: 'tip',
      title: "Haven't saved in 2 weeks",
      body: 'Even small contributions add up. Consider setting up automatic transfers.',
      severity: 'medium',
      actionLabel: 'Add Savings',
      actionRoute: '/savings',
      createdAt: now,
    })
  }

  // Rule 4: Bill due in < 3 days
  const threeDaysFromNow = new Date(now)
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

  snapshot.bills.forEach((bill) => {
    if (!bill.isPaid && new Date(bill.dueDate) <= threeDaysFromNow && new Date(bill.dueDate) >= now) {
      const daysUntilDue = Math.ceil(
        (new Date(bill.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      insights.push({
        id: `rule-bill-${bill.id}`,
        type: 'red_flag',
        title: `${bill.name} due ${daysUntilDue === 0 ? 'today' : daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} days`}`,
        body: `Don't forget to pay your $${bill.amount} ${bill.name} bill.`,
        severity: daysUntilDue <= 1 ? 'high' : 'medium',
        actionLabel: 'View Bills',
        actionRoute: '/bills',
        createdAt: now,
      })
    }
  })

  // Rule 5: Savings goal milestone (75%, 90%, 100%)
  snapshot.savingsGoals.forEach((goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100

    if (percentage >= 100) {
      insights.push({
        id: `rule-goal-complete-${goal.id}`,
        type: 'milestone',
        title: `${goal.name} goal reached!`,
        body: `Congratulations! You've saved $${goal.currentAmount.toLocaleString()} for your goal.`,
        severity: 'low',
        actionLabel: 'Celebrate',
        actionRoute: '/savings',
        createdAt: now,
      })
    } else if (percentage >= 90) {
      insights.push({
        id: `rule-goal-90-${goal.id}`,
        type: 'milestone',
        title: `${goal.name} is 90% complete`,
        body: `Just $${(goal.targetAmount - goal.currentAmount).toLocaleString()} more to reach your goal!`,
        severity: 'low',
        actionLabel: 'View Progress',
        actionRoute: '/savings',
        createdAt: now,
      })
    } else if (percentage >= 75) {
      insights.push({
        id: `rule-goal-75-${goal.id}`,
        type: 'milestone',
        title: `${goal.name} is 75% funded`,
        body: `Great progress! Keep it up to reach your goal soon.`,
        severity: 'low',
        actionLabel: 'View Progress',
        actionRoute: '/savings',
        createdAt: now,
      })
    }
  })

  // Limit to 5 insights, prioritizing high severity
  return insights
    .sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
    .slice(0, 5)
}

/**
 * Get border color class based on insight type
 */
export function getInsightBorderColor(type: InsightType): string {
  const colors: Record<InsightType, string> = {
    red_flag: 'border-[var(--color-danger)]',
    opportunity: 'border-[var(--color-accent)]',
    milestone: 'border-[var(--color-success)]',
    tip: 'border-[var(--color-warning)]',
  }
  return colors[type]
}

/**
 * Get background color class based on insight type
 */
export function getInsightBgColor(type: InsightType): string {
  const colors: Record<InsightType, string> = {
    red_flag: 'bg-[var(--color-danger)]/5',
    opportunity: 'bg-[var(--color-accent)]/5',
    milestone: 'bg-[var(--color-success)]/5',
    tip: 'bg-[var(--color-warning)]/5',
  }
  return colors[type]
}
