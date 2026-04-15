import type { Transaction, RecurrencePattern } from '@/types'

interface RecurrenceDetectionResult {
  isRecurring: boolean
  pattern?: RecurrencePattern
  confidence: number
  averageInterval: number
  matchedTransactions: string[]
}

/**
 * Detects if a transaction is recurring based on merchant history
 *
 * Algorithm:
 * 1. Query the last 90 days of transactions from the same merchant
 * 2. Calculate the average interval in days between transactions
 * 3. If stdDev(intervals) < 3 days AND count >= 2: auto-classify as recurring
 * 4. Determine pattern based on average interval
 */
export function detectRecurrence(
  newTransaction: Transaction,
  allTransactions: Transaction[]
): RecurrenceDetectionResult {
  // Get transactions from the same merchant in the last 90 days
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const merchantTransactions = allTransactions
    .filter(
      (t) =>
        fuzzyMatchMerchant(t.merchantName, newTransaction.merchantName) &&
        t.id !== newTransaction.id &&
        new Date(t.date) >= ninetyDaysAgo
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Need at least 2 previous transactions to detect a pattern
  if (merchantTransactions.length < 2) {
    return {
      isRecurring: false,
      confidence: 0,
      averageInterval: 0,
      matchedTransactions: [],
    }
  }

  // Calculate intervals between transactions
  const intervals: number[] = []
  for (let i = 1; i < merchantTransactions.length; i++) {
    const prev = new Date(merchantTransactions[i - 1].date)
    const curr = new Date(merchantTransactions[i].date)
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    intervals.push(diffDays)
  }

  // Also include interval from last transaction to new transaction
  const lastTransaction = merchantTransactions[merchantTransactions.length - 1]
  const intervalToNew = Math.round(
    (new Date(newTransaction.date).getTime() - new Date(lastTransaction.date).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  intervals.push(intervalToNew)

  // Calculate average interval
  const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length

  // Calculate standard deviation
  const squaredDiffs = intervals.map((i) => Math.pow(i - avgInterval, 2))
  const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / squaredDiffs.length
  const stdDev = Math.sqrt(avgSquaredDiff)

  // Determine if recurring (stdDev < 3 days indicates consistent pattern)
  const isRecurring = stdDev < 3

  // Determine pattern based on average interval
  const pattern = determinePattern(avgInterval)

  // Calculate confidence (lower stdDev = higher confidence)
  const confidence = Math.max(0, Math.min(100, 100 - stdDev * 10))

  return {
    isRecurring,
    pattern: isRecurring ? pattern : undefined,
    confidence: Math.round(confidence),
    averageInterval: Math.round(avgInterval),
    matchedTransactions: merchantTransactions.map((t) => t.id),
  }
}

/**
 * Determines the recurrence pattern based on average interval in days
 */
function determinePattern(avgInterval: number): RecurrencePattern {
  if (avgInterval <= 1.5) return 'daily'
  if (avgInterval >= 5 && avgInterval <= 9) return 'weekly'
  if (avgInterval >= 12 && avgInterval <= 16) return 'biweekly'
  if (avgInterval >= 25 && avgInterval <= 35) return 'monthly'
  if (avgInterval >= 350 && avgInterval <= 380) return 'annually'
  return 'irregular'
}

/**
 * Fuzzy matches merchant names to account for slight variations
 * e.g., "Netflix.com" vs "NETFLIX" vs "Netflix Inc"
 */
export function fuzzyMatchMerchant(name1: string, name2: string): boolean {
  // Normalize both names
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric
      .replace(/inc$|llc$|corp$|com$|co$/, '') // Remove common suffixes

  const n1 = normalize(name1)
  const n2 = normalize(name2)

  // Exact match after normalization
  if (n1 === n2) return true

  // One is substring of the other
  if (n1.includes(n2) || n2.includes(n1)) return true

  // Calculate Levenshtein distance for similar names
  const distance = levenshteinDistance(n1, n2)
  const maxLength = Math.max(n1.length, n2.length)
  const similarity = 1 - distance / maxLength

  // Consider a match if similarity > 80%
  return similarity > 0.8
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length

  if (m === 0) return n
  if (n === 0) return m

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }

  return dp[m][n]
}

/**
 * Format recurrence pattern for display
 */
export function formatRecurrencePattern(pattern: RecurrencePattern): string {
  const patterns: Record<RecurrencePattern, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Every 2 weeks',
    monthly: 'Monthly',
    annually: 'Yearly',
    irregular: 'Irregular',
  }
  return patterns[pattern]
}

/**
 * Get the next expected date for a recurring transaction
 */
export function getNextOccurrence(
  lastDate: Date,
  pattern: RecurrencePattern
): Date {
  const next = new Date(lastDate)

  switch (pattern) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'biweekly':
      next.setDate(next.getDate() + 14)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'annually':
      next.setFullYear(next.getFullYear() + 1)
      break
    case 'irregular':
      // For irregular patterns, estimate based on average (default 30 days)
      next.setDate(next.getDate() + 30)
      break
  }

  return next
}
