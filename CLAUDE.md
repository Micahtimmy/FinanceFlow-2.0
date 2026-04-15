# CLAUDE.md

# FinanceFlow 2.0 — Master Implementation Prompt
---

## SYSTEM INSTRUCTIONS

You are a **Senior Full-Stack Product Engineer** and **UX Architect** operating at Staff-level seniority. You are simultaneously:
- A systems thinker who maps every user action to an outcome
- A visual designer who can judge whether a component meets Stripe-grade polish
- A financial domain expert who understands budget lifecycles, recurring transactions, and savings mechanics
- A ruthless QA engineer who terminates every dead-end, placeholder, and broken state before it ships

Your coding standards are non-negotiable:
- **TypeScript strict mode** — no `any`, no `@ts-ignore`, no implicit returns
- **React 19** with Server Components awareness where applicable
- **Tailwind v4** — use CSS variables and the `@theme` directive, no arbitrary values unless absolutely justified
- **shadcn/ui** — extend components, never fight them
- **Framer Motion** — all transitions use shared layout animations where elements move between routes
- **React Router v7** — use the data router pattern with loaders and actions
- **Recharts** — all charts must be responsive, accessible, and animated on mount
- **Zero placeholders** — every `// TODO`, `"Coming soon"`, and `disabled` button is a product failure
- **Every route has three states**: loading (skeleton), error (boundary with recovery action), and empty (zero-state with a CTA)

---

## CONTEXTUAL MAPPING — FILES TO AUDIT

Before writing a single line of code, perform a **full codebase audit** in this exact sequence:

```
1. Read the entire /src directory tree
2. Map every route in the router configuration
3. Identify every component in /src/components
4. Read every type definition in /src/types
5. Find every API call / data fetch
6. Identify every hardcoded string that should be a variable
7. List every feature that is stubbed, disabled, or hidden
```

Produce a **Gap Report** in this format before any implementation begins:

```
DEAD ENDS:       [list every button/link that goes nowhere]
MISSING STATES:  [list every component missing loading/error/empty]
BROKEN LOGIC:    [list every financial calculation that is incorrect or absent]
UI DEBT:         [list every component that is below Stripe-grade polish]
MISSING ROUTES:  [list every route that should exist but doesn't]
```

Only after the Gap Report is complete, proceed to implementation in the priority order defined below.

---

## THE NO-GAP MANDATE

These rules are absolute. Violating them is a build failure:

1. **No orphan routes.** Every page must be reachable from at least one navigation element.
2. **No stubbed features.** If a button exists, it must do something real. Delete it if it can't.
3. **No `console.log` in production paths.** Use a proper logger or remove it.
4. **No hardcoded user data.** Every name, number, and currency must come from state or context.
5. **No unhandled promise rejections.** Every async operation has a `.catch()` or `try/catch`.
6. **No inaccessible components.** Every interactive element has an `aria-label` or visible text. All color contrasts meet WCAG AA.
7. **No layout shifts.** Use skeleton loaders that match the exact dimensions of the real content.
8. **No feature flags without implementation.** Either build it or remove the flag.

---

## PRIORITY 1 — ONBOARDING FLOW (Build First)

The onboarding flow is the product's first impression. It must be flawless.

### Architecture
Create route: `/onboarding` with sub-routes `/onboarding/welcome`, `/onboarding/goal`, `/onboarding/profile`, `/onboarding/first-action`, `/onboarding/complete`

Store onboarding state in a React Context (`OnboardingContext`) persisted to `localStorage`. Once complete, set `user.onboardingComplete = true` and never show it again.

### Step 1 — `/onboarding/welcome`
- Full-viewport splash with the FinanceFlow logo animated in (Framer Motion: `initial={{ opacity: 0, y: 24 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}`)
- Headline: **"Your money. Finally makes sense."** — rendered with a multicolor gradient (Stripe-style, using `bg-clip-text text-transparent bg-gradient-to-r`)
- Subheadline: "Tell us one thing and we'll build your financial home around it."
- Single CTA button: "Let's start →" — transitions to Step 2

### Step 2 — `/onboarding/goal` (THE CORE SCREEN)
This is the most important screen in the entire product. It must feel premium.

**Layout**: Full-screen card grid. Headline: "What's your primary financial goal right now?"

**Goal Options** (render as interactive cards in a 2×N grid, each with an icon, title, and one-line description):

| Goal ID | Title | Description | Routes To |
|---|---|---|---|
| `budget` | Get on a budget | "I want to know where my money goes every month" | `/dashboard?focus=budget` |
| `save` | Build my savings | "I'm working towards a specific savings target" | `/savings` |
| `debt` | Pay off debt | "I want a clear plan to eliminate what I owe" | `/debt-tracker` |
| `invest` | Start investing | "I want to grow my wealth beyond a savings account" | `/investments` |
| `net-worth` | Track net worth | "I want a complete picture of my assets and liabilities" | `/net-worth` |
| `emergency-fund` | Build emergency fund | "I need 3-6 months of expenses saved first" | `/savings?type=emergency` |
| `income` | Grow my income | "I want to track side income and hit a revenue goal" | `/income-tracker` |
| `retire` | Plan for retirement | "I want to understand if I'm on track for the future" | `/retirement` |
| `bills` | Manage bills | "I keep missing payments and want to stay on top of them" | `/bills` |
| `spending` | Cut spending | "I want to find where I'm overspending and fix it" | `/analytics?focus=spending` |

**Card interaction**:
- Default: border `border-border`, subtle shadow
- Hover: border color transitions to the app's primary accent, card lifts `translateY(-2px)` via Framer Motion
- Selected: filled accent background, white text, checkmark icon appears via `AnimatePresence`
- Only one goal selectable at a time (but user can change it)

After selection, show a contextual message below the grid: *"Great. We'll set up your [Goal Title] dashboard now."*

CTA: "Build my [Goal Title] →" — disabled until a card is selected.

### Step 3 — `/onboarding/profile`
Collect the minimum viable profile data. Do NOT ask for more than this:
- **Display name** (text input, "What should we call you?")
- **Monthly income** (currency input with currency selector, "Roughly how much do you earn each month after tax?")
- **Primary currency** (dropdown, pre-selected based on browser locale)

Design: Single-column form, large inputs, no labels above inputs — use floating labels (shadcn style). Show a soft progress indicator (Step 3 of 5).

### Step 4 — `/onboarding/first-action`
This step is **dynamic** based on the goal selected in Step 2:

| Goal | First Action Screen |
|---|---|
| `budget` | "Create your first budget category" — mini budget builder with 3 pre-filled categories |
| `save` | "Name your first savings goal" — name + target amount + target date |
| `debt` | "Add your first debt" — name + balance + interest rate + minimum payment |
| `invest` | "What are you investing in?" — checklist: Stocks, ETFs, Crypto, Property, Other |
| `net-worth` | "Add your first asset" — name + type + estimated value |
| `emergency-fund` | Auto-calculate target: `monthly_income × 3` — show the number, confirm |
| `income` | "Set your income goal" — target monthly amount + income sources |
| `retire` | "Set your retirement age" — slider from current age to 75 |
| `bills` | "Add your first recurring bill" — name + amount + due date |
| `spending` | "Which category do you overspend in most?" — pick from a list |

### Step 5 — `/onboarding/complete`
- Celebratory animation (confetti burst using a lightweight canvas approach, NOT a heavy library — implement manually with `<canvas>`)
- Summary card: "Here's what we've set up for you" — lists the goal, the action taken, and the next recommended step
- CTA: "Go to my dashboard →" — navigates to the goal-appropriate route and sets `onboardingComplete = true`

---

## PRIORITY 2 — DASHBOARD REDESIGN

### The Financial Pulse Score (Hero Component)
The single most important number on the dashboard. Position it at the top of the page, full-width card.

**Calculation Logic** (implement in `/src/lib/financial-pulse.ts`):

```typescript
export function calculatePulseScore(data: FinancialData): PulseScore {
  const budgetScore = data.budgetAdherence * 40;        // 0-40 points
  const savingsScore = data.savingsVelocity * 30;       // 0-30 points
  const cashFlowScore = data.netCashFlowRatio * 30;     // 0-30 points
  const total = Math.round(budgetScore + savingsScore + cashFlowScore);
  
  return {
    score: Math.min(100, Math.max(0, total)),
    grade: total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Fair' : 'Needs Attention',
    color: total >= 80 ? 'emerald' : total >= 60 ? 'blue' : total >= 40 ? 'amber' : 'red',
    breakdown: { budgetScore, savingsScore, cashFlowScore }
  };
}
```

**Visual Design**:
- Large score number (display font, ~96px) with a color that transitions based on the grade
- Circular progress ring around the number (SVG, animated on mount)
- Below the number: three sub-scores as small pill badges (Budget, Savings, Cash Flow)
- Right side of the card: a sparkline of the score over the last 30 days (Recharts `LineChart`, no axes, just the line)

### Dashboard Layout (after the hero)
Use a responsive grid. On desktop: 3 columns. On mobile: 1 column.

**Required cards (all must be real data, no placeholders)**:
1. **Monthly Budget Overview** — donut chart showing spent vs. remaining, top 3 categories
2. **Savings Progress** — progress bars for each active savings goal
3. **Recent Transactions** — last 5 transactions with merchant icon (use first letter as avatar), category tag, amount colored red/green
4. **Bills Due** — next 7 days of upcoming bills with a traffic light urgency indicator
5. **Net Worth Trend** — area chart, 6-month history
6. **AI Insights Panel** — see Priority 5 for spec

### Quick Action Bar
Fixed bar below the top nav (or floating action button on mobile):
- "+ Add Transaction"
- "+ Add Bill"
- "Transfer to Savings"
- "View Reports"

Each must open a **modal** (not a new route) using shadcn's `<Dialog>`. The modal must close on Escape, have a visible close button, and trap focus correctly.

---

## PRIORITY 3 — FULL TRANSACTION DATA MODEL

### Types (create `/src/types/transaction.ts`)

```typescript
export type TransactionType = 'expense' | 'income' | 'transfer';
export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annually' | 'irregular';

export interface Transaction {
  id: string;
  userId: string;
  date: Date;
  amount: number;                    // Always positive; type determines direction
  currency: string;
  type: TransactionType;
  categoryId: string;
  merchantName: string;
  note?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  recurrenceGroupId?: string;        // Links all instances of same recurring transaction
  importSource: 'manual' | 'csv' | 'plaid';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Recurring Transaction Detection (implement in `/src/lib/recurrence-detector.ts`)
When a new transaction is saved, run this algorithm:
1. Query the last 90 days of transactions from the same merchant (fuzzy match on `merchantName`)
2. Calculate the average interval in days between those transactions
3. If `stdDev(intervals) < 3 days` AND `count >= 2`: auto-classify as recurring
4. Set `recurrencePattern` based on average interval:
   - `~1 day` → `daily`, `~7 days` → `weekly`, `~14 days` → `biweekly`, `~30 days` → `monthly`, `~365 days` → `annually`
5. Show a toast notification: "It looks like [Merchant] is a recurring expense. We've marked it as monthly."
6. Allow the user to dismiss or confirm the classification

### CSV Import
Create a full `/import` route with:
- Drag-and-drop file zone (accept `.csv` only)
- Column mapping UI: user maps their CSV columns to FinanceFlow fields (Date, Amount, Merchant, Category)
- Preview table showing first 5 rows after mapping
- Validation step: highlight rows with missing required fields in red
- "Import X transactions" confirm button
- Post-import: show summary toast with count and link to transactions list

---

## PRIORITY 4 — ACCOUNT SETTINGS (Complete Identity Suite)

Create `/settings` with a sidebar layout (tabs on mobile). Every section below must be fully functional.

### Section 1 — Profile
- Display name, email (with verified badge), avatar upload
- Preferred language, timezone, date format, number format

### Section 2 — Financial Identity
- **Monthly income** (with income type: Salary / Freelance / Mixed / Investment)
- **Primary currency**
- **Financial persona** (radio group, affects AI tone and dashboard layout):
  - 🎯 "Aggressive Saver" — maximize savings rate
  - 💳 "Debt Eliminator" — focus on payoff schedule
  - 📈 "Wealth Builder" — investment-forward view
  - ⚖️ "Balanced" — equal weight to all areas
  - 🆕 "Starting Fresh" — simplified view, educational tooltips
- **Tax filing status** (Single / Married Filing Jointly / Head of Household / Other)
- **Annual tax rate estimate** (used for investment returns calculations)

### Section 3 — Notifications
Matrix of toggles (Email vs. In-App vs. Push) for each event:
- Bill due in 3 days
- Budget category over 80%
- Large transaction detected (> user-set threshold)
- New AI insight generated
- Weekly financial summary
- Monthly net worth update
- Savings goal reached

### Section 4 — Security
- Change password (with strength meter)
- Two-factor authentication toggle (UI only — show setup flow with QR code placeholder)
- Active sessions list (device name, last active, "Sign out" button)
- Download my data (trigger JSON export of all user data)

### Section 5 — Appearance
- **Theme toggle**: Light / Dark / System — persisted to `localStorage`, applied via a `data-theme` attribute on `<html>`
- **Accent color**: 6 color options (Blue, Purple, Green, Orange, Rose, Slate) — each changes the CSS variable `--color-accent`
- **Dashboard density**: Comfortable / Compact — adjusts card padding and font sizes

### Section 6 — Danger Zone
- Archive account (soft delete)
- Delete all data
- Both require a confirmation dialog with the user typing "DELETE" to confirm

---

## PRIORITY 5 — AI INSIGHTS ENGINE (Google Gemini Integration)

### Setup
Use the Google Gemini API (REST, model: `gemini-1.5-flash`). Store the API key in an environment variable: `VITE_GEMINI_API_KEY`.

Create `/src/lib/ai-insights.ts`:

```typescript
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

export async function generateInsights(financialSnapshot: FinancialSnapshot): Promise<AIInsight[]> {
  const prompt = buildInsightPrompt(financialSnapshot);
  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: InsightResponseSchema
      }
    })
  });
  // parse and return structured insights
}
```

### The Insight Prompt (implement in `buildInsightPrompt`)
The prompt must include:
- Current month's budget per category vs. actual spend
- Days remaining in the month
- Last 3 months' average spend per category
- Current savings rate
- Any bills due in the next 7 days
- Net worth delta from last month

Then instruct the model: *"You are a warm, direct financial advisor. Return a JSON array of 3-5 insights. Each insight has: type (red_flag | opportunity | milestone | tip), title (max 8 words), body (max 25 words), severity (high | medium | low), actionLabel (max 4 words), actionRoute (app route string)."*

### Required Red Flag Detection
The AI must surface these, and the rule-based fallback must catch them if the AI call fails:

| Trigger | Insight |
|---|---|
| Category spend > 80% with > 10 days left | "⚠️ [Category] budget almost gone — 12 days early" |
| Spend in any category up > 40% vs 3-month average | "Unusual spike in [Category] — 43% above your average" |
| No savings contribution in 14+ days | "You haven't saved anything in 2 weeks" |
| Bill due in < 3 days with no payment logged | "⏰ [Bill Name] is due in 2 days" |
| Net worth decreased month-over-month | "Your net worth dipped this month — here's why" |
| Recurring transaction increased in cost | "Netflix just got more expensive — $2/mo increase detected" |

### AI Insights Panel (Dashboard Component)
- Card with header: "AI Insights" + a subtle sparkle icon
- Show 3 insight cards in a vertical list
- Each card: colored left border (red = high, amber = medium, blue = low severity), title in bold, body text, and an action button
- "Refresh Insights" button — debounced 60 seconds minimum between calls
- Timestamp: "Updated 3 minutes ago"
- Loading state: 3 skeleton cards with pulse animation
- Error state: "Couldn't load insights right now. Check your connection." with retry button

---

## PRIORITY 6 — VISUAL POLISH (Stripe-Grade)

### Design Language
The visual direction is **Stripe Dashboard meets Linear** — clean, confident, high-information-density, never cluttered. Light mode is the default; dark mode is first-class, not an afterthought.

### Typography
- **Headings**: Apply a multicolor gradient to all H1s and key hero numbers:
  ```css
  .gradient-text {
    background: linear-gradient(135deg, var(--color-accent) 0%, #a855f7 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```
- **Body**: System font stack — no Google Fonts required
- **Monospace** (for numbers, amounts): `font-variant-numeric: tabular-nums` on all currency displays

### Framer Motion Standards
Every page transition uses this shared layout config:
```typescript
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
};
```

Card hover interactions:
```typescript
export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98 }
};
```

Number count-up animation: All financial numbers (score, totals, net worth) must animate from 0 to their final value on mount using Framer Motion's `useMotionValue` + `useSpring`.

### Color System (Tailwind v4 `@theme`)
Add to your global CSS:
```css
@theme {
  --color-accent: #6366f1;      /* Indigo — primary */
  --color-accent-2: #a855f7;    /* Purple — secondary gradient */
  --color-accent-3: #ec4899;    /* Pink — tertiary gradient */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

### Component Polish Requirements
Every component must meet these standards:

**Buttons**:
- Primary: gradient background (accent → accent-2), white text, subtle shadow, `hover:shadow-lg hover:shadow-accent/25`
- All buttons: minimum 44×44px touch target

**Cards**:
- Border: `1px solid hsl(var(--border))` — never box-shadow as the only separator in light mode
- Dark mode: slightly lighter background than the page (`bg-card` vs `bg-background`)
- Hover on interactive cards: border color transitions to accent

**Inputs**:
- All inputs use floating labels
- Focus ring: `ring-2 ring-accent/30`
- Error state: red border + error message with icon below input

**Charts (Recharts)**:
- Custom tooltip: rounded corners, backdrop blur (`backdrop-blur-sm`), matches card style
- All colors from the design token system (no hardcoded hex in chart props)
- `animationBegin={0}` and `animationDuration={800}` on all chart data

**Navigation**:
- Sidebar on desktop (240px wide), bottom tab bar on mobile (< 768px)
- Active route: accent-colored left border + accent text + soft accent background
- User avatar in the bottom-left of the sidebar (desktop) — clicking opens a popover with Settings and Sign Out

### Light / Dark Mode
- Toggle in Settings (Priority 4) AND a quick toggle in the sidebar footer
- Implement via `data-theme="dark"` on `<html>` + Tailwind's `dark:` variant
- Persist to `localStorage` key `financeflow-theme`
- Respect `prefers-color-scheme` on first load if no preference is stored
- Test every single component in both modes before considering it done

---

## PRIORITY 7 — MISSING ROUTES (Build All)

These routes must exist with full implementations:

| Route | Purpose |
|---|---|
| `/` | Landing / redirect to `/dashboard` if authenticated |
| `/auth/login` | Email + password, Google OAuth button (UI only if backend not ready) |
| `/auth/signup` | Same as login + name field |
| `/auth/forgot-password` | Email input + success state |
| `/onboarding/*` | Full flow as specified in Priority 1 |
| `/dashboard` | As specified in Priority 2 |
| `/transactions` | Full transaction list, search, filter by category/date/type, sort |
| `/transactions/:id` | Transaction detail + edit form |
| `/budget` | Budget management — create/edit/delete categories + monthly view |
| `/savings` | Savings goals list + individual goal progress |
| `/savings/new` | Create savings goal wizard |
| `/debt-tracker` | Debt list + payoff calculator (avalanche vs. snowball method) |
| `/bills` | Bills list + calendar view + mark as paid |
| `/analytics` | Spending analytics — category breakdown, trends, period comparisons |
| `/net-worth` | Assets and liabilities + net worth chart |
| `/investments` | Investment tracking (manual entry) |
| `/income-tracker` | Income sources + monthly income chart |
| `/import` | CSV import flow |
| `/settings` | Full settings as specified in Priority 4 |
| `/settings/:section` | Direct link to a settings section |
| `/*` | 404 page with navigation back to dashboard |

---

## IMPLEMENTATION SEQUENCE

Execute in this strict order. Do not proceed to the next step until the current one is complete and visually verified:

1. **Codebase Audit** → produce the Gap Report
2. **Design System Setup** → Tailwind v4 theme, color variables, typography, Framer Motion configs
3. **Light/Dark Mode** → implement theme switching end-to-end before any components
4. **Onboarding Flow** → all 5 steps, fully functional
5. **Dashboard Redesign** → Pulse Score hero + all 6 cards with real data
6. **Transaction Data Model** → types, recurring detection, CSV import
7. **All Missing Routes** → stubs first, then fill in
8. **AI Insights** → Gemini integration + rule-based fallback
9. **Account Settings** → all 6 sections
10. **Visual Polish Pass** → go through every screen and apply the Framer Motion, typography, and color standards
11. **Accessibility Audit** → keyboard nav, aria labels, color contrast
12. **Mobile Responsive Pass** → every screen at 375px, 768px, 1280px

---

## FINAL CHECKLIST (Run Before Declaring Done)

- [ ] Every route is reachable from the navigation
- [ ] Every route has loading, error, and empty states
- [ ] Onboarding flow is skipped for returning users
- [ ] Goal selection in onboarding routes to the correct page
- [ ] Pulse Score updates when transactions change
- [ ] Recurring transaction detection fires on save
- [ ] CSV import handles bad data gracefully
- [ ] AI insights panel loads, refreshes, and handles errors
- [ ] All settings persist across page reloads
- [ ] Light and dark mode work on every single screen
- [ ] All charts animate on mount
- [ ] All modals trap focus and close on Escape
- [ ] All forms validate before submission
- [ ] All currency displays use `Intl.NumberFormat`
- [ ] The app works on mobile (375px viewport)
- [ ] No TypeScript errors (`tsc --noEmit` passes clean)
- [ ] No console errors in the browser
- [ ] `npm run build` succeeds with no warnings