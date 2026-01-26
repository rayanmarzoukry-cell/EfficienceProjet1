# AI Copilot Instructions - Efficience Analytics

**Project:** Dental practice management & analytics platform (Phase 4 - January 2026)  
**Tech Stack:** Next.js 13+ (App Router), TypeScript, React, Tailwind CSS, MongoDB, OpenAI (gpt-4o-mini), Ollama chatbot  
**Language:** French (user-facing), TypeScript/JavaScript (codebase), French comments in code  

---

## Quick Start for AI Agents

**Environment & Key Secrets:**
- `MONGODB_URI`: MongoDB Atlas connection (`mongodb+srv://...`)
- `OPENAI_API_KEY`: OpenAI API (gpt-4o-mini model used)
- `MONGODB_DB`: Database name (typically `rayan_dev2` in dev)

**How to start developing:**
```bash
npm run dev              # Starts Next.js on http://localhost:3000
npm run init:admin:*    # Initialize admin interface (choose bash/powershell/python)
npm run test:admin      # Test admin authentication
```

---

## Architecture: Three-Layer Model

1. **UI Layer** (`app/`, `components/`) - React components with Radix UI + Tailwind CSS
2. **Service Layer** (`lib/`) - Business logic (AI, database, authentication, reports)
3. **Context & State** (`context/AppContext.tsx`) - Centralized patient/cabinet data with MongoDB fallback

**Critical Pattern:** `AppProvider` wraps entire app in [app/layout.tsx](app/layout.tsx) → all pages access shared state, MongoDB health check, mock data fallback.

### Data Flow
```
User Action → "use client" Component
  ↓
Hook (useAuth, useAI, useAdmin-Auth)
  ↓
API Route (app/api/*/route.ts) OR Service (lib/*.ts)
  ↓
MongoDB (via mongoose with connection pooling) OR OpenAI
  ↓
Response → Context Update → Re-render
```

## Critical Files & Their Roles

| File | Purpose | Key Exports/Functions |
|------|---------|--------|
| [context/AppContext.tsx](context/AppContext.tsx) | Global patient data + MongoDB fallback | `AppProvider`, `useAppContext()` - patients array, `refreshData()`, fallback `defaultPatients` |
| [lib/db.ts](lib/db.ts) | MongoDB connection pooling | `initializeApp()` - caches connection in global.mongoose to avoid exhaustion |
| [lib/openai-service.ts](lib/openai-service.ts) | AI predictions & insights | `generatePredictions()`, `generateRecommendations()`, `analyzeCabinet()` (model: gpt-4o-mini) |
| [lib/admin-auth.ts](lib/admin-auth.ts) | JWT + bcrypt auth for admins | `hashPassword()`, `verifyPassword()`, `generateToken()`, `validateToken()` |
| [lib/types.ts](lib/types.ts) | TypeScript interfaces | Cabinet, DonneesCabinet, AnalysePerformance, Rapport, User |
| [app/layout.tsx](app/layout.tsx) | Root layout with AppProvider + ChatWidget | Sidebar visibility logic, theme setup, Ollama chatbot integration |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Main analytics dashboard | KPI cards, Recharts graphs, real-time /api/stats polling |
| [app/admin/page.tsx](app/admin/page.tsx) | Admin panel (users, imports, audit logs) | ProtectedLayout wrapper, AdminImport, AuditLog components |
| [hooks/use-auth.ts](hooks/use-auth.ts) | Client-side auth hook | `useAuth()` - accessToken, user, isAuthenticated, refreshToken() |
| [hooks/use-ai.ts](hooks/use-ai.ts) | AI wrapper hook | `useAI()` - getPredictions(), getRecommendations(), getAnalysis() with loading/error states |

---

## Middleware & Protected Routes

**Middleware** ([middleware.ts](middleware.ts)) protects these paths:
```
/dashboard/* → Requires auth_token cookie
/admin/*     → Requires admin role
/patients/*  → Requires auth_token
/cabinets/*  → Requires auth_token
/rapports/*  → Requires auth_token
```

Unauthenticated users redirected to `/login`. Roles: `admin` (full access) | `user` (limited access)

## Development Workflows

### Starting the Dev Server
```bash
npm run dev  # Starts Next.js on http://localhost:3000
```
- Automatically checks MongoDB connection on load
- Falls back to mock data if MongoDB unavailable
- Redirects to `/login` if no auth_token

### Admin Initialization (First Time Setup)
```bash
# Choose one - creates admin user in MongoDB
npm run init:admin:bash       # Linux/Mac
npm run init:admin:powershell # Windows PowerShell
npm run init:admin:python     # Cross-platform Python

# Test admin auth
npm run test:admin
```

### Building & Production
```bash
npm run build  # Outputs to .next/
npm start      # Runs production server
npm run lint   # TypeScript + ESLint check
```

### Key Environment Variables (`.env.local`)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rayan_dev2?retryWrites=true
OPENAI_API_KEY=sk-proj-...
MONGODB_DB=rayan_dev2
JWT_SECRET=change-in-production  # Used in lib/admin-auth.ts
```

**Important:** Server-side code can access all `env` vars; client-side needs `NEXT_PUBLIC_` prefix.

## Project-Specific Conventions

### 1. Component Structure
- All interactive components use `"use client"` directive
- Styling: **Tailwind CSS** + **Shadcn/ui** (50+ pre-built components in `components/ui/`)
- Color scheme: Dark background `#030712`, primary blue `#3b82f6`, success green `#10b981`, warning orange `#f59e0b`
- Charts: **Recharts** - always wrap in `<ResponsiveContainer>` with fixed parent height
- File structure: Interactive components in `components/`, UI primitives in `components/ui/`, layout in `components/layout/`

### 2. State Management Pattern
- **Global State:** `AppContext.tsx` - shared patients, cabinets, server status (no Redux needed)
- **Local State:** `useState()` for component-specific UI
- **Server State:** Fetch from `/api/*` routes, cache in React state, use stale-while-revalidate pattern
- **Rule:** Never duplicate data between Context and component state

Example pattern:
```tsx
const { patients, refreshData } = useAppContext()  // From global context
const [filters, setFilters] = useState({})         // Local UI state
const [cabinets, setCabinets] = useState([])       // Fetched once, cached
```

### 3. AI Integration (OpenAI gpt-4o-mini)
Located in [lib/openai-service.ts](lib/openai-service.ts):
- `generatePredictions(cabinetData)` - Revenue, patient growth, conversion forecasts
- `generateRecommendations(data, prediction)` - Actionable improvements with priority
- `analyzeCabinet(data)` - Deep performance analysis (used in `/app/debug-ia/`)
- All responses are JSON-structured, French context in prompts

Usage via hook:
```tsx
const { getPredictions, getRecommendations } = useAI()
const predictions = await getPredictions(cabinetData)
```

### 4. MongoDB Connection Pattern
**Required:** Connection pooling in [lib/db.ts](lib/db.ts) prevents connection exhaustion:
```typescript
if (cached.conn) return cached.conn              // Reuse existing
if (cached.promise) return cached.promise        // Wait for pending
cached.promise = connect()                       // Create & cache promise
cached.conn = await cached.promise               // Await and cache
```

### 5. API Route Structure
Routes in `app/api/[resource]/route.ts`:
- **CRUD patterns:** `/api/cabinets`, `/api/patients`, `/api/rapports`
- **AI endpoints:** `/api/ai/predictions`, `/api/ai/recommendations`
- **Admin only:** `/api/admin/users`, `/api/admin/audit`
- **Stats:** `/api/stats` (returns aggregated MongoDB data)
- **Auth:** `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- Return JSON only - validate `req.method` and token before proceeding

### 6. Authentication & Authorization
- **JWT tokens** stored in `auth_token` cookie (httpOnly, secure in prod)
- **Roles:** `admin` (all access) | `user` (cabinet-specific)
- **Cabinet access control:** User can only view their assigned cabinet (via `JWT payload.cabinetId`)
- Hook: `useAuth()` - provides `user`, `accessToken`, `isAuthenticated`, `refreshToken()`
- Admin auth: `hashPassword()` + `validateToken()` from `lib/admin-auth.ts`

---

## Common Integration Points

### 1. Fetching Cabinet Data
```tsx
useEffect(() => {
  fetch('/api/cabinets')
    .then(r => r.json())
    .then(data => setCabinets(data.cabinets || []))
    .catch(err => console.error('Failed to fetch cabinets:', err))
}, [])
```

### 2. Using AI Predictions in Components
```tsx
const { getPredictions } = useAI()
const result = await getPredictions({ id: '1', nom: 'Cabinet A', caActuel: 50000, ... })
// Returns: { caPredit, tauxConversion, patientsPrevus, riskFactors, confidence }
```

### 3. Accessing Global State
```tsx
// In any "use client" component:
const { patients, loading, isServerOnline, refreshData } = useAppContext()
// patients: Patient[] (from MongoDB or defaultPatients fallback)
// isServerOnline: boolean (true if MongoDB connected)
```

### 4. Admin Authentication Pattern
```tsx
// In protected admin routes:
import { useAdminAuth } from '@/hooks/use-admin-auth'
const { user, loading } = useAdminAuth()
if (!user) return <Redirect to="/admin/login" />
```

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
interface Cabinet {
  id: number; nom: string; objectifs: { chiffreAffaires, nombreRendezVous, tauxAbsence }
}
interface DonneesCabinet {
  cabinetId, periode, chiffreAffaires, nombreRendezVous, nombreAbsences, traitements
}
interface AnalysePerformance {
  cabinetId, scoreGlobal, metriques, analyse, recommandations
}
```

Use these when creating API responses and component props - TypeScript ensures type safety across API boundaries.

---

## Testing & Debugging

### Check Server Health
[context/AppContext.tsx](context/AppContext.tsx) has a health check that sets `isServerOnline` state.

### Mock Data Fallback
If MongoDB is unavailable, app uses default patient data from `defaultPatients` array in AppContext.

### Verify Environment
```bash
npm run test:admin              # Verify admin auth works
node -e "console.log(process.env.MONGODB_URI)" # Check MongoDB URI loaded
```

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

---

## Critical Patterns to Avoid

❌ **Don't:** Store duplicate state in both Context and component state  
✅ **Do:** Fetch data once and cache in state, use Context for app-wide shared data

❌ **Don't:** Create new MongoDB connections in every route handler  
✅ **Do:** Use `initializeApp()` from `lib/db.ts` with connection pooling

❌ **Don't:** Call OpenAI directly in components  
✅ **Do:** Use `useAI()` hook which wraps API routes that call OpenAI service

❌ **Don't:** Expose secrets in `NEXT_PUBLIC_*` env vars  
✅ **Do:** Keep secrets on server, expose only safe data to client
