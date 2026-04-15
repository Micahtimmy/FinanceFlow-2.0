import type { FinancialData, PulseScore } from '@/types'

/**
 * Calculates the Financial Pulse Score based on budget adherence,
 * savings velocity, and cash flow ratio.
 *
 * The score is weighted:
 * - Budget adherence: 40 points (how well you stick to your budget)
 * - Savings velocity: 30 points (progress towards savings goals)
 * - Cash flow ratio: 30 points (income vs expenses)
 */
export function calculatePulseScore(data: FinancialData): PulseScore {
  // Budget adherence (0-1) gets 40 points
  // Higher adherence = more points (staying under budget is good)
  const budgetScore = Math.round(data.budgetAdherence * 40)

  // Savings velocity (0-1) gets 30 points
  // Higher velocity = more points (making progress on goals)
  const savingsScore = Math.round(data.savingsVelocity * 30)

  // Net cash flow ratio (0-1) gets 30 points
  // Higher ratio = more points (positive cash flow is good)
  const cashFlowScore = Math.round(data.netCashFlowRatio * 30)

  // Total score clamped between 0-100
  const total = Math.min(100, Math.max(0, budgetScore + savingsScore + cashFlowScore))

  // Determine grade and color based on score
  let grade: PulseScore['grade']
  let color: PulseScore['color']

  if (total >= 80) {
    grade = 'Excellent'
    color = 'emerald'
  } else if (total >= 60) {
    grade = 'Good'
    color = 'blue'
  } else if (total >= 40) {
    grade = 'Fair'
    color = 'amber'
  } else {
    grade = 'Needs Attention'
    color = 'red'
  }

  return {
    score: total,
    grade,
    color,
    breakdown: {
      budgetScore,
      savingsScore,
      cashFlowScore,
    },
  }
}

/**
 * Returns CSS color variable based on score color
 */
export function getScoreColor(color: PulseScore['color']): string {
  const colorMap: Record<PulseScore['color'], string> = {
    emerald: 'var(--color-success)',
    blue: 'var(--color-accent)',
    amber: 'var(--color-warning)',
    red: 'var(--color-danger)',
  }
  return colorMap[color]
}

/**
 * Generates historical pulse scores for the last N days
 * Used for the sparkline chart on the dashboard
 */
export function generatePulseHistory(
  currentScore: number,
  days: number = 30
): { date: string; score: number }[] {
  const history: { date: string; score: number }[] = []
  const now = new Date()

  // Generate realistic-looking historical data
  // Score should trend towards current score with some variance
  let score = currentScore - Math.floor(Math.random() * 15) - 5 // Start lower

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some random variance but trend towards current score
    const targetDiff = currentScore - score
    const change = targetDiff * 0.1 + (Math.random() - 0.5) * 5

    score = Math.min(100, Math.max(0, Math.round(score + change)))

    history.push({
      date: date.toISOString().split('T')[0],
      score,
    })
  }

  // Ensure last entry is the current score
  if (history.length > 0) {
    history[history.length - 1].score = currentScore
  }

  return history
}
