# Construction Material Cost Estimator

A production-ready Next.js 15 web application for calculating construction material quantities and costs.

## Features

- **Area Based Estimation** — Input total built-up area and building specs to generate a full material estimate
- **Drawing Layout Estimation** — Enter individual room dimensions; the app calculates totals
- **16 Materials** — Cement, sand, aggregate, steel, bricks, tiles, paint, MEP, doors, windows, roofing and more
- **Configurable Rates** — Edit all unit rates in the Materials database; persisted locally
- **Cost Breakdown** — Material cost, labor, contingency, tax, grand total
- **Interactive Charts** — Recharts-powered pie and bar charts
- **Excel & CSV Export** — Multi-sheet Excel workbook (xlsx) and CSV download
- **Settings** — Waste factor, contingency, tax, labor rates, quality multipliers
- **Responsive** — Works on desktop, tablet, and mobile
- **Persistent State** — Zustand store with localStorage persistence

---

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn

### Installation

```bash
# Clone / download and unzip the project
cd construction-estimator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
construction-estimator/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (sidebar + topbar)
│   ├── page.tsx                # Redirects to /dashboard
│   ├── dashboard/page.tsx      # Dashboard overview
│   ├── estimate/page.tsx       # New estimate (area + layout tabs)
│   ├── materials/page.tsx      # Materials database
│   ├── reports/page.tsx        # Generated reports + export
│   └── settings/page.tsx       # Settings
├── components/
│   ├── charts/
│   │   ├── CostPieChart.tsx    # Recharts doughnut chart
│   │   └── MaterialBarChart.tsx
│   ├── forms/
│   │   ├── AreaEstimatorForm.tsx
│   │   └── LayoutEstimatorForm.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   └── ui/
│       └── MetricCard.tsx
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # Rates, units, categories, defaults
│   ├── estimationEngine.ts     # Core calculation logic
│   ├── excelExport.ts          # xlsx + CSV export
│   ├── store.ts                # Zustand state management
│   └── utils.ts                # cn(), formatCurrency(), etc.
├── styles/
│   └── globals.css             # Tailwind + custom component classes
├── public/                     # Static assets
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

No environment variables are required for the base application. All state is managed client-side with Zustand + localStorage.

If you integrate a backend or CMS later, create a `.env.local` file:

```env
# Example future variables
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## Deployment

### Vercel (Recommended)

1. Push your project to a GitHub / GitLab / Bitbucket repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Leave all settings at their defaults (Next.js is auto-detected)
5. Click **Deploy**

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Netlify

Next.js App Router requires a Netlify adapter:

```bash
npm install @netlify/plugin-nextjs
```

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Then deploy via the Netlify dashboard or CLI.

### Self-hosted (Node.js)

```bash
npm run build
npm run start        # Runs on port 3000
```

Use a reverse proxy (nginx / Caddy) to serve on port 80/443.

---

## Estimation Logic

The estimation engine uses industry-standard ratios per 1,000 sq ft:

| Material | Base quantity per 1,000 sq ft |
|---|---|
| Cement | 400 bags |
| Sand | 1,800 cu ft |
| Aggregate | 2,200 cu ft |
| Steel | 4,000 kg |
| Bricks | 8,000 nos |

All quantities are scaled by:
- **Quality multiplier** (Economy 0.8×, Standard 1.0×, Premium 1.35×)
- **Wall thickness factor** (4.5 inch = 0.75, 9 inch = 1.0)
- **Structure type multiplier** (Steel +20%, Load Bearing −10%)
- **Waste factor** applied per-material before cost total
- **Labor, contingency, and tax** applied on cost subtotals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (with localStorage persistence) |
| Charts | Recharts |
| Export | xlsx (SheetJS) |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
