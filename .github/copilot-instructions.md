# AI Copilot Instructions - Efficience Analytics

**Project:** Dental practice management & analytics platform  
**Tech Stack:** Next.js 13+ (App Router), TypeScript, React, Tailwind CSS, MongoDB, OpenAI  
**Language:** French (user-facing), TypeScript/JavaScript (codebase)  

---

## Architecture Overview

### Core Structure: "Three-Layer Model"
1. **UI Layer** (`app/`, `components/`) - React components with Radix UI + Tailwind
2. **Service Layer** (`lib/`) - Business logic (AI, database, email, PDF, KPIs)
3. **Context & State** (`context/AppContext.tsx`) - Centralized patient/clinic data

**Key Pattern:** All pages use `AppProvider` wrapper (in `app/layout.tsx`). This ensures shared state across the app for patient data and server connectivity.

### Data Flow
```
User Action → React Component ("use client")
  ↓
Hook (useAI, useAuth, useCustom)
  ↓
Service Layer (lib/*.ts)
  ↓
API Route (app/api/*/) OR External Service (MongoDB, OpenAI)
  ↓
Response → State Update → Re-render
```

---

## Critical Files & Their Purpose

| File | Purpose | Key Content |
|------|---------|-------------|
| [context/AppContext.tsx](context/AppContext.tsx) | Global state for patients, cabinet data | Patient CRUD, server health check, fallback mock data |
| [lib/openai-service.ts](lib/openai-service.ts) | AI predictions & recommendations | `generatePredictions()`, `generateRecommendations()`, `generateReportWithAI()`, `analyzeCabinet()` |
| [lib/db.ts](lib/db.ts) | MongoDB connection management | Persistent connection caching (required pattern) |
| [app/layout.tsx](app/layout.tsx) | Root layout with AppProvider | Sidebar visibility logic, ChatWidget placement, theme |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Main analytics dashboard | KPI cards, charts (Recharts), real-time metrics |
| [app/api/analyses/](app/api/analyses/) | Analysis endpoints | Revenue, hours, appointments by practitioner |
| [lib/report-utils.ts](lib/report-utils.ts) | Report generation utilities | `generatePDF()`, `exportToCSV()`, `sendEmailReport()` |
| [lib/kpiService.ts](lib/kpiService.ts) | KPI calculations | Cabinet performance metrics, production tracking |

---

## Development Workflows

### Starting the Dev Server
```bash
npm run dev  # Starts on http://localhost:3000
```
Automatically redirects to `/register`. Use mock auth or MongoDB integration.

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Key Environment Variables (`.env.local`)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/efficience
OPENAI_API_KEY=sk-proj-your-key-here
DATABASE_NAME=efficience
```

**Important:** Server-side code can access env vars; client-side needs `NEXT_PUBLIC_` prefix.

---

## Project-Specific Conventions

### 1. Component Structure
- All interactive components use `"use client"` directive
- Styling: **Tailwind CSS** + **Shadcn/ui** components (50+ pre-built)
- Example: Dark theme background: `#030712`, primary blue: `#3b82f6`, success green: `#10b981`
- Charts: **Recharts** (responsive containers with fixed heights in parents)

### 2. State Management
- **Global:** `AppContext.tsx` - for shared patient/clinic data
- **Local:** `useState()` in individual components
- **Server State:** MongoDB via API routes

**Pattern:** Never duplicate data. Always fetch from `AppContext` or API endpoints.

### 3. AI Integration (OpenAI Claude 3.5 Sonnet)
Located in [lib/openai-service.ts](lib/openai-service.ts):
- `generatePredictions(data)` - Predicts revenue, patient growth, conversion rates
- `generateRecommendations(data, prediction)` - Actionable clinic improvements
- `generateReportWithAI(cabinetName, data, period)` - Generates AI-powered reports
- `analyzeCabinet(data)` - Deep clinic analysis for insights

Usage example:
```tsx
import { useAI } from '@/hooks/use-ai'

const { predictions, loading } = await useAI(cabinetData)
```

### 4. Database Pattern
MongoDB integration uses **connection pooling** to avoid exhausting connections:
```typescript
// Required pattern in lib/db.ts
if (cached.conn) return cached.conn  // Reuse existing
if (cached.promise) return cached.promise  // Wait for pending
// Otherwise create new connection and cache it
```

### 5. API Route Naming
- `app/api/[resource]/route.ts` - Standard CRUD
- `app/api/ai/*` - AI endpoints
- `app/api/analyses/*` - Analysis data (realisation, jours, rdv)
- `app/api/reports/*` - Report generation
- Return JSON only (no HTML from API routes)

### 6. Data Mock Pattern
**All pages work with mock data immediately.** Replace with real API calls:
```tsx
// Current (mock):
const mockCabinets = [{ id: 1, nom: "Cabinet A", ... }]

// When integrating:
const cabinets = await fetch('/api/cabinets').then(r => r.json())
```

Mock data locations: `data/patients_list.json`, `data/planning.ts`, `data/production.ts`, `AppContext.tsx`

---

## Common Integration Points

### Fetching Cabinet Data
```tsx
const [cabinets, setCabinets] = useState([])
useEffect(() => {
  fetch('/api/cabinets')
    .then(r => r.json())
    .then(data => setCabinets(data))
}, [])
```

### Generating Reports
```tsx
import { generatePDF } from '@/lib/report-utils'

const pdf = await generatePDF({
  title: "Rapport Cabinet",
  data: cabinetData,
  fileName: "rapport_cabinet.pdf"
})
```

### Using AI Predictions in Components
```tsx
const { predictions, loading } = useAI(cabinetData)
// Returns: { revenue_prediction, patient_growth, recommendations }
```

### Authentication
- Hook: [hooks/use-auth.ts](hooks/use-auth.ts)
- Uses JWT tokens, role-based access (admin/user)
- Cabinet access control: `canAccessCabinet(cabinetId)`

---

## Sidebar & Navigation Logic
- **Hidden on:** `/login`, `/register`, `/` (auth pages)
- **Visible on:** All authenticated pages
- Implemented in [app/layout.tsx](app/layout.tsx) via `pathname` check

---

## Chatbot Integration
- **Ollama-based chatbot** integrated in [components/chatbot/chat-widget.tsx](components/chatbot/chat-widget.tsx)
- Visible on all pages (placed in root layout after AppProvider)
- Models: Custom Modelfile for dental specialty available in `ProjetOllama/`

---

## Type System
Main types in [lib/types.ts](lib/types.ts):
```typescript
interface Cabinet { id, nom, caActuel, caObjectif, ... }
interface Patient { id, name, dateRDV, time, type, status, ... }
interface Report { id, cabinetId, period, generatedAt, ... }
interface KPI { cabinet_id, revenue, patient_count, conversion_rate, ... }
```

Use these when creating API responses and component props.

---

## Testing & Debugging

### Check Server Health
[context/AppContext.tsx](context/AppContext.tsx) has a health check that sets `isServerOnline` state.

### Mock Data Fallback
If Flask server is offline, app uses default patient data from `defaultPatients` array.

### Test Files
- `test-seed.ts` - MongoDB seed data
- `test-openai-key.js` - Verify OpenAI API key
- `seed_patients.py` - Python seed script

Run: `npm run dev`, navigate to test endpoints to verify integration.

---

## Deployment Notes
- **Next.js App Router** used (not Pages Router)
- **Vercel deployment** recommended for seamless Next.js integration
- Build output: `.next/` folder
- Watch for: Environment variables in deployment platform settings

---

## When Extending This Codebase
1. **New page?** Create in `app/[feature]/page.tsx`, add to sidebar navigation
2. **New component?** Place in `components/` (UI in `components/ui/`)
3. **New service?** Create in `lib/` and export functions
4. **New API?** Create `app/api/[route]/route.ts`, return JSON
5. **New KPI?** Add logic to `lib/kpiService.ts`, wire into dashboard
6. **AI feature?** Use functions from `lib/openai-service.ts`, wrap in `useAI()` hook

**Always:** Wrap interactive components with `"use client"`, use AppContext for shared state, document French text strings.

---

## Key Resources
- [GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md) - Quick start setup
- [IA_INTEGRATION_GUIDE.md](IA_INTEGRATION_GUIDE.md) - Deep dive on AI features
- [PROJECT_ANALYSIS_REPORT.md](PROJECT_ANALYSIS_REPORT.md) - Complete architecture breakdown
- [MODIFICATIONS_2026.md](MODIFICATIONS_2026.md) - January 2026 update details
- [README_ANALYTICS.md](README_ANALYTICS.md) - Full feature documentation
