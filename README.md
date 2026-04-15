# FinanceFlow 2.0

A modern personal finance management application built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard** - Financial health score, quick actions, spending overview
- **Transactions** - Track income and expenses with categories
- **Budget** - Set and monitor category budgets
- **Savings Goals** - Create and track savings targets
- **Bills** - Manage recurring bills and due dates
- **Analytics** - Visualize spending patterns
- **Net Worth** - Track assets and liabilities
- **Debt Tracker** - Debt payoff calculator (avalanche vs snowball)
- **Investments** - Portfolio tracking
- **Income Tracker** - Multiple income stream management
- **Retirement Planning** - Retirement calculator with projections

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (data visualization)
- Radix UI (accessible components)
- React Router v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd FinanceFlow-2.0

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables (Optional)

Copy `.env.example` to `.env.local` for AI-powered insights:

```bash
cp .env.example .env.local
```

Add your Google Gemini API key to enable AI insights. The app works without it using rule-based insights.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy - Vercel auto-detects Vite configuration

### Netlify

1. Push your code to GitHub
2. Import in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### Manual Build

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Testing Notes

This is a **frontend-only demo application**:

- Data is stored in browser localStorage
- Each user/browser has independent data
- Data does not sync across devices
- Sample data is pre-loaded for demonstration

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
