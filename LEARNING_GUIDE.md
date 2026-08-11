# 🎓 Learning Guide — Realtime Debate Fact-Checking Platform

> A full-stack learning walkthrough built from the actual codebase.
> Goal: understand architecture, data flow, and patterns deeply enough to build a similar app independently.

---

## Table of Contents

- [Phase 1 — The Honest Architecture](#phase-1--the-honest-architecture)
- [Phase 2 — The Project Map](#phase-2--the-project-map)
- [Phase 3 — Feature Trace #1: List Debates](#phase-3--feature-trace-1-list-debates)
- [Exercise — Add a Delete Debate Feature](#exercise--add-a-delete-debate-feature)
- [Self-Check Questions](#self-check-questions)

---

## Phase 1 — The Honest Architecture

### ⚠️ The 4 Big Surprises

Before learning anything, you need to know the truth about this codebase. Some of what the project *claims* contradicts what it *does*.

| What the project claims | What's actually true |
|---|---|
| "MongoDB + Mongoose" | **No MongoDB.** Persistence is **JSON files** on disk (`Backend/data/*.json`) via a hand-rolled `storage.js` that *mimics* Mongoose method names (`findOne`, `findById`, `create`...). `Dbconfig.js` just creates a folder. |
| "Authentication" | JWTs are **issued** (on login & password reset) but **never verified** on incoming requests. There's no `jwt.verify` middleware. All `/api/debates`, `/api/arguments`, etc. are **fully public** — anyone can call them. |
| "Realtime / Socket.IO" | Backend has `socket.js`, but the **frontend has no `socket.io-client`**. The "live" debate room is faked with a local `setInterval` timer. |
| "AI queue / Redis / BullMQ" | `bullmq` & `ioredis` are in `package.json`, but the files using them (`models/ai/`, `models/arguments/`, `models/debates/`) are **dead code** — written in CommonJS (`require`) in an ESM project, referencing modules that don't exist (`config/redis`, `openai.provider`). Never imported. |

**Why this matters for learning:** This is actually a *great* teaching codebase, because it shows a **simple, working** architecture (JSON storage + controllers + services) **and** an abandoned "fancy" architecture (Redis queues + threading + turn management) side by side. You'll learn the simple one deeply, and understand *why* the fancy one was attempted.

---

### Technologies Actually Used

#### Frontend (what runs)

| Layer | Tech | Why |
|---|---|---|
| Build tool | **Vite 6** | Dev server + bundler (replaced Create React App / Webpack) |
| UI library | **React 19** | Component-based UI |
| Language | **TypeScript** (strict) | Catches type errors at build time |
| Routing | **React Router 7** (`BrowserRouter`) | Client-side routing (no page reload) |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (Radix primitives) | Utility-first CSS + accessible UI components |
| Charts | **recharts** (installed) + a hand-rolled CSS bar chart | Data viz |
| Forms | **react-hook-form** + **zod** | Form state + validation (declared but lightly used) |
| Toasts | **sonner** + a custom `use-toast` | Notifications |
| Icons | **lucide-react** | SVG icons |
| HTTP | **native `fetch`** (no axios) | Talking to the backend |

#### Backend (what runs)

| Layer | Tech | Why |
|---|---|---|
| Runtime | **Node.js** | JS on the server |
| Framework | **Express 5** | HTTP server + routing |
| Language | **JavaScript (ESM)** | `"type": "module"` in package.json |
| Realtime | **Socket.IO** (server only) | WebSocket layer — *not used by frontend* |
| Auth | **bcryptjs** + **jsonwebtoken** + **nodemailer** (Gmail) | Password hashing, JWT, email OTP |
| AI | **@google/generative-ai** (Gemini 2.0 Flash) | Fallacy detection, debate summaries, devil's advocate |
| Rate limiting | **express-rate-limit** | Only on `/api/auth/*` |
| Persistence | **JSON files** via `storage.js` | *Not* MongoDB |

#### Database

**None.** It's JSON files. The patterns transfer to a real DB, but today, it's files.

---

### High-Level Architecture (What Actually Runs)

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (user)                                              │
│                                                              │
│  React SPA (Vite build)                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Pages      │  │ Components  │  │  Hooks     │             │
│  │ (src/pages) │  │ (present.) │  │ (useState/ │             │
│  │              │  │              │  │  useEffect)│             │
│  └─────┬───────┘  └────────────┘  └────────────┘             │
│        │ calls                                                │
│        ▼                                                      │
│  ┌─────────────────────────────────┐                         │
│  │  src/services/api.ts            │  ← the ONLY bridge       │
│  │  (apiRequest + *API objects)     │     to the backend      │
│  └────────────┬────────────────────┘                         │
└───────────────┼─────────────────────────────────────────────┘
                │ HTTP (fetch) — JSON over POST/GET
                │ VITE_API_URL → http://localhost:5000/api
                │ (dev: Vite proxy /api → :5000)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Node + Express)   port 5000                        │
│                                                              │
│  app.js  →  cors + express.json (global middleware)          │
│                                                              │
│  server.js  →  mounts routers under /api/*                    │
│  ┌──────────────────────────────────────────────┐            │
│  │  /api/debates   → debate.routes.js            │            │
│  │  /api/arguments → argument.routes.js          │            │
│  │  /api/factcheck → factcheck.routes.js         │            │
│  │  /api/analytics → analytics.routes.js         │            │
│  │  /api/auth      → Authroute.js (rate-limited) │            │
│  │  /api/ai        → ai.routes.js                │            │
│  └────────────┬─────────────────────────────────┘            │
│               │ delegates to                                  │
│               ▼                                               │
│  ┌──────────────────────────────────────────────┐            │
│  │  controllers/  (HTTP layer: req→res)          │            │
│  │  debate, argument, factcheck, analytics,     │            │
│  │  Auth, ai                                     │            │
│  └────────────┬─────────────────────────────────┘            │
│               │ calls                                         │
│               ├─→ models/*.model.js  (façade)                  │
│               │       └→ config/storage.js  (JSON files)      │
│               │              └→ Backend/data/*.json          │
│               └─→ services/  (domain logic)                    │
│                   fallacy.service  (regex + Gemini)           │
│                   credibility.service (heuristic)            │
│                   gemini.service   (all Gemini AI calls)      │
└─────────────────────────────────────────────────────────────┘
```

### The Key Insight

Every request follows the **same 6-layer path**:

```
React component
  → api.ts (apiRequest)
  → fetch() over HTTP
  → Express route (routes/*.routes.js)
  → controller (controllers/*.controller.js)
  → model + services (models/*.model.js + services/*.service.js)
  → storage.js → JSON file on disk
  → response bubbles back up the same way
```

This **layering** is the single most important concept in full-stack web apps. Each layer has **one job** and talks only to its neighbors ("separation of concerns"). Every backend framework (Express, Fastify, NestJS, Django, Rails, Spring) follows some version of it.

---

### Answers to the 15 Architecture Questions

**1. What technologies are being used?**
Frontend: Vite + React 19 + TS + React Router + Tailwind/shadcn. Backend: Node + Express 5 + Socket.IO + bcrypt/JWT/nodemailer + Gemini. DB: JSON files (not Mongo).

**2. What is the frontend?**
A **Single-Page Application (SPA)**. The browser loads one HTML file and one JS bundle. React Router changes what's on screen *without* asking the server for a new HTML page. The server only serves JSON via the API.

**3. What is the backend?**
A **REST API server**. Listens on port 5000, accepts HTTP at `/api/*`, returns JSON. Also has a Socket.IO server attached (for realtime), but no client connects to it yet.

**4. What database is being used?**
**None.** Files: `Backend/data/debates.json`, `arguments.json`, `factchecks.json`, `users.json`, `otps.json`. The code is *structured* as if it were Mongo, so patterns transfer — but today, it's files.

**5. How does the frontend communicate with the backend?**
**HTTP requests using `fetch()`**, wrapped in `apiRequest` in `src/services/api.ts`. All requests go to `http://localhost:5000/api/<resource>`. In dev, Vite proxies `/api` to `:5000` to avoid CORS. Base URL from `import.meta.env.VITE_API_URL`.

**6. How does the backend communicate with the database?**
Controllers call **model objects** (`Debate.create()`, `Argument.find()`). Models delegate to `storage.js`, which reads/writes JSON files with `fs.readFileSync`/`writeFileSync`. **Synchronous file I/O** — simple but wouldn't scale.

**7. Where is authentication handled?**
In `Backend/controllers/Auth.js` + `Backend/routes/Authroute.js`. Handles signup, OTP email verification, login, forgot/reset password. **But** — critical — **no route actually checks auth.** The JWT is issued on login but never verified on protected endpoints. Security gap.

**8. Where is authorization handled?**
**Nowhere.** No role system, no "is this user allowed to do X" check. Auth (who are you) and authorization (what can you do) are different things — this project has a partial version of the first and none of the second.

**9. Where are API calls made?**
On the frontend, **only** in `src/services/api.ts`. Pages import `debateAPI`, `argumentAPI`, etc. Components never call `fetch` directly. Clean pattern: one place to change if the API moves.

**10. Where are routes defined?**
- **Frontend routes** (URL → page): `src/App.tsx` using `<Route>` from React Router.
- **Backend routes** (URL → controller): `Backend/routes/*.routes.js`, mounted in `server.js` under `/api/*`.

**11. Where are controllers/services/models defined?**
- **Controllers:** `Backend/controllers/*.js` — handle HTTP, call models + services, shape responses.
- **Services:** `Backend/services/*.js` — domain logic (fallacy detection, credibility scoring, Gemini calls).
- **Models:** `Backend/models/*.model.js` — data-access façades over `storage.js`.

**12. How is application state managed?**
**Locally, per component, with `useState`.** No global state library (no Redux, Zustand, Context). Each page fetches its own data and holds it in local state. Data is *not* shared between pages — navigating away loses it. Fine for small apps, doesn't scale.

**13. How are errors handled?**
**Inconsistently.** Each controller wraps its body in `try/catch` and returns `res.status(500).json({ message, status: false })`. **No central error-handling middleware.** On the frontend, each page has its own `error` state string and shows a red card. **No error boundaries** in React.

**14. How are environment variables/configuration handled?**
- **Backend:** `dotenv` loads `.env` at startup in `server.js`. Vars: `PORT`, `FRONTEND_URL`, `GEMINI_API_KEY`, `EMAIL`, `APP_PASS`, `PRIVATE_KEY`.
- **Frontend:** Vite exposes vars prefixed with `VITE_` via `import.meta.env`. Only `VITE_API_URL` is used.

**15. How does data travel from UI to MongoDB and back?**
Full path for "user submits an argument" (traced in detail in Phase 3):
```
1. User types in ArgumentInput (React component)
2. DebateRoomPage's handleSubmit runs
3. argumentAPI.createArgument({...}) is called  (src/services/api.ts)
4. apiRequest does fetch("POST /api/arguments", {body: JSON})
5. Express receives it → argument.routes.js → POST / → createArgument
6. argument.controller.js:
   a. validates body
   b. detectFallacy(claim)        → services/fallacy.service.js → Gemini
   c. calculateCredibility(evidence) → services/credibility.service.js
   d. Argument.create({...})      → models/argument.model.js → storage.js → arguments.json
   e. res.json({ message, data, status })
7. Frontend receives JSON → setState → React re-renders → success banner
```
No MongoDB involved — step 6d writes to a JSON file. But the *shape* of the flow is identical to a Mongo app.

---

## Phase 2 — The Project Map

Files grouped by **responsibility**, not alphabetically.

### Frontend — `Frontend/`

#### 📂 Entry & Configuration (essential — app can't start without these)

| File | What | Why | Depends on | Used by |
|---|---|---|---|---|
| `index.html` | The single HTML shell Vite loads | SPA entry — mounts React | nothing | Vite, browser |
| `src/main.tsx` | React bootstrap | Creates the root, renders `<App/>` in StrictMode | react-dom, App | index.html |
| `src/App.tsx` | Router | Maps URLs to page components | react-router-dom, all pages | main.tsx |
| `vite.config.ts` | Vite config | Path alias `@`→`src`, dev proxy `/api`→`:5000` | vite, plugin-react | Vite CLI |
| `tsconfig.json` | TS config | Strict mode, path mapping `@/*` | typescript | `tsc`, editor |
| `package.json` | Deps + scripts | Declares everything | — | npm/pnpm |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin | Processes `@import "tailwindcss"` | @tailwindcss/postcss | Vite build |
| `src/index.css` | Global styles + design tokens | Tailwind import + CSS variables (oklch colors) | tailwindcss | all components |
| `vercel.json` | Deploy config | Forces Vite preset + SPA rewrites | — | Vercel |

#### 📂 Pages (essential — one per route; each is a "screen")

| File | Route | What it does | API used |
|---|---|---|---|
| `src/pages/HomePage.tsx` | `/` | Landing page, static marketing | none |
| `src/pages/DebatesPage.tsx` | `/debates` | Lists all debates | `debateAPI.getDebates` |
| `src/pages/DebateRoomPage.tsx` | `/debate/room` | Live debate UI (mocked realtime) | `argumentAPI.createArgument` |
| `src/pages/ArgumentsPage.tsx` | `/debate/arguments` | Lists arguments, maps backend→card shape | `argumentAPI.getArgumentsByDebate` |
| `src/pages/FactCheckPage.tsx` | `/debate/fact-check` | Fact-check dashboard | `factCheckAPI.getFactChecks` |
| `src/pages/AnalyticsPage.tsx` | `/analytics` | Leaderboard + charts (parallel fetch) | `analyticsAPI` + `argumentAPI` |
| `src/pages/AIFeedbackPage.tsx` | `/ai-feedback` | AI summary/fallacies/devil's advocate | `aiAPI.getAIFeedback` |

**Pattern across all data pages:** `useState(data, loading, error)` + `useEffect(() => fetch on mount)` + tri-state render (loading spinner / error card / data or empty). This is the #1 pattern to internalize.

#### 📂 API / Service Layer (essential — the only bridge to backend)

| File | What | Why |
|---|---|---|
| `src/services/api.ts` | `apiRequest` helper + `debateAPI`/`argumentAPI`/`factCheckAPI`/`analyticsAPI`/`aiAPI` objects | One place that knows how to talk to the backend. Pages import these, never `fetch` directly. |

#### 📂 Hooks (supporting — defined but partly unused)

| File | What | Status |
|---|---|---|
| `src/hooks/use-api.ts` | `useDebates`, `useArguments`, `useFactChecks`, `useAnalytics` — encapsulated data-fetching hooks | **Defined but unused** — pages inline the same logic instead. Good teaching contrast. |
| `hooks/use-mobile.ts` | `useIsMobile()` via `matchMedia` | Used by shadcn layout components |
| `hooks/use-toast.ts` | Toast pub/sub store (not React Context) | Used by shadcn components |

#### 📂 Components (supporting — presentational, reusable)

| Folder | What | Examples |
|---|---|---|
| `src/components/debate/` | Debate-specific presentational components | `argument-card`, `argument-input`, `fact-check-panel`, `speaker-panel`, `audience-reactions`, `argument-flow`, `fact-check-badge`, `live-fact-check-indicator` |
| `src/components/ai/` | AI-feature components | `devils-advocate`, `fallacy-detector`, `debate-summary`, `bias-warning` |
| `src/components/analytics/` | Analytics components | `argument-strength-chart` (hand-rolled CSS bars), `debater-scorecard`, `leaderboard-table` |
| `src/components/ui/` + root `components/ui/` | shadcn/ui primitives | `button`, `card`, `badge`, `avatar`, `dialog`, `input`, `textarea`, `progress`, `toast`, etc. |

**Key concept:** these components are **presentational** — they take props and render. They don't fetch data, don't call the API, don't hold business logic. Pages are **container** components that fetch + orchestrate. This "container/presentational" split is a classic React pattern.

#### 📂 Utilities

| File | What |
|---|---|
| `src/lib/utils.ts` + `lib/utils.ts` | The shadcn `cn()` helper (merges Tailwind classes via `clsx` + `tailwind-merge`) |

---

### Backend — `Backend/`

#### 📂 Entry & Config (essential)

| File | What | Why |
|---|---|---|
| `server.js` | Entry point | Loads env, inits storage, mounts routes, starts HTTP + Socket.IO |
| `app.js` | Express app + global middleware | `cors()`, `express.json()`, `urlencoded()` |
| `config/Dbconfig.js` | "DB" init | Just calls `initStorage()` — creates `data/` dir |
| `config/storage.js` | **The actual database** | JSON-file CRUD with Mongoose-like API |
| `config/socket.js` | Socket.IO server | Room-based realtime (not used by frontend) |
| `package.json` | Deps + scripts | ESM, Express 5, Gemini, bcrypt, JWT, nodemailer |

#### 📂 Routes (essential — HTTP endpoints)

| File | Prefix | Endpoints |
|---|---|---|
| `routes/debate.routes.js` | `/api/debates` | `POST /`, `GET /`, `GET /:id`, `PUT /:id` |
| `routes/argument.routes.js` | `/api/arguments` | `POST /`, `GET /` (`?debateId=`), `GET /:id` |
| `routes/factcheck.routes.js` | `/api/factcheck` | `POST /`, `GET /` (`?argumentId=`) |
| `routes/analytics.routes.js` | `/api/analytics` | `GET /:id` |
| `routes/Authroute.js` | `/api/auth` | `POST /signup`, `/login`, `/verify-otp`, `/reset-otp`, `/forgetpassowrd` (typo), `/changepassword` — rate-limited |
| `routes/ai.routes.js` | `/api/ai` | `GET /feedback/:debateId`, `POST /devils-advocate` |

**Routes are thin** — they just map HTTP verbs+paths to controller functions. No auth middleware applied (except the rate limiter on auth).

#### 📂 Controllers (essential — HTTP layer)

| File | What | Calls |
|---|---|---|
| `controllers/debate.controller.js` | CRUD for debates | `Debate` model |
| `controllers/argument.controller.js` | Create/list arguments; **runs fallacy + credibility services** | `Argument` model, `fallacy.service`, `credibility.service` |
| `controllers/factcheck.controller.js` | Create/list fact checks | `FactCheck` model |
| `controllers/analytics.controller.js` | Computes analytics in-memory from arguments | `Argument` model |
| `controllers/Auth.js` | Signup, OTP, login, password reset | `UserModel`, `OTPModel`, bcrypt, JWT, nodemailer |
| `controllers/ai.controller.js` | AI feedback + devil's advocate | `Argument` model, `gemini.service`, inline Gemini call |

**Controller job:** parse request → call model/services → shape `{ message, data, status }` response → handle errors with try/catch.

#### 📂 Models (essential façade — data access)

| File | Wraps | Exposes |
|---|---|---|
| `models/debate.model.js` | `debates` storage | `findOne, findById, find, create, updateOne, findByIdAndUpdate` |
| `models/argument.model.js` | `argumentsStorage` | same set |
| `models/factcheck.model.js` | `factchecks` | `findOne, find, create` (no update) |
| `models/Usermodel.js` | `users` | adds `findOneAndUpdate` |
| `models/otpmodel.js` | `otps` | `findOne, find, create, deleteOne, findByIdAndUpdate` |

**These are façades** — they look like Mongoose models but delegate to JSON files. If you later swap `storage.js` for real Mongoose, controllers don't change. That's the point of the pattern.

#### 📂 Services (essential — domain logic)

| File | What | Sync/Async |
|---|---|---|
| `services/fallacy.service.js` | `detectFallacy(claim)` — fast regex check, falls back to Gemini | async |
| `services/credibility.service.js` | `calculateCredibility(evidence)` — keyword heuristic (0.3–0.9) | sync |
| `services/gemini.service.js` | All Gemini calls: `detectFallacyWithGemini`, `generateDebateSummary`, + 2 unused | async |

**Why services exist:** controllers should stay focused on HTTP. "Is this claim a fallacy?" and "how credible is this evidence?" are *domain* questions, not HTTP questions. Pulling them into services makes them testable and reusable.

#### 📂 Data (the "database" — runtime, gitignored)

| File | Records | Key fields |
|---|---|---|
| `data/debates.json` | 2 | `id, title, topic, status` |
| `data/arguments.json` | 4 | `id, debateId, speakerName, claim, evidence, fallacy, credibilityScore` |
| `data/factchecks.json` | 1 | `id, argumentId, verified, confidence, reason` |
| `data/users.json` | 1 | `id, _id, username, email, password (bcrypt)` |
| `data/otps.json` | created on demand | `email, otp, Isverified` |

#### 📂 Dead code (⚠️ not running — useful as contrast, not taught as working)

| File | Why it's dead |
|---|---|
| `models/ai/ai.processor.js` | CommonJS `require` in ESM project; imports missing `openai.provider`, `config/redis` |
| `models/ai/ai.queue.js` | Same; imports missing `redis`, broken `ai.processor` export name |
| `models/ai/ai.providers/gemini.provider.js` | ESM but not imported anywhere; uses different model (`2.5-flash`) |
| `models/ai/prompts/factCheck.prompt.js` | Only used by dead `ai.processor` |
| `models/arguments/argument.service.js` | CommonJS; references missing `redis`, a different `argument.model` |
| `models/debates/debate.service.js` | CommonJS; references missing `redis`, `ai.processor` |
| `sockets/debate.socket.js` | Loose snippet, not imported by `config/socket.js` |

---

### Data Model (the relationships)

```
users                 debates                 arguments                factchecks
─────                 ───────                 ─────────                ──────────
id          ──┐      id          ──┐         id          ──┐         id
username     │      title         │         debateId ────┘  │         argumentId ─┘ (FK → arguments.id)
email        │      topic         │         speakerName      │         verified
password     │      status         └──FK───  claim            │         confidence (0-100)
Isverifed    │                              evidence         │         reason
             │                              fallacy          │
             │                              credibilityScore │ (0-1)
             │
             └── otps (by email, not id)
                 email
                 otp
                 Isverified
                 (auto-deleted after 10 min)
```

**Relationships are by convention only** — string IDs, no DB enforcement, no joins. `arguments.speakerName` is free text, **not** a user reference. Users and debates are effectively disconnected in the live code.

---

## Phase 3 — Feature Trace #1: List Debates

The simplest end-to-end flow in the app. Master this, and the harder flows become pattern-matching.

### The Story

> The user opens their browser, navigates to `http://localhost:5173/debates`, and sees a list of debates. Where does that data come from?

### The Full Journey

```
1.  User visits /debates
2.  React Router renders <DebatesPage/>
3.  Component initializes state: debates=[], loading=true, error=null
4.  React renders for the first time → shows the loading spinner (loading=true)
5.  useEffect runs (after the first render)
6.  loadDebates() is called → setLoading(true) → await debateAPI.getDebates()
7.  debateAPI.getDebates() calls apiRequest("/debates")
8.  apiRequest calls fetch("GET http://localhost:5000/api/debates")
9.  Express receives the request
10. Global middleware runs: cors() → express.json() (no body to parse on GET)
11. server.js route mount matches: /api/debates → debate.routes.js router
12. debate.routes.js: GET / → getDebates controller
13. getDebates calls Debate.find()
14. Debate.find delegates to debates.find in storage.js
15. storage.js: readData("debates.json") → fs.readFileSync → JSON.parse → array of 2 debates
16. controller wraps: res.status(200).json({ message, data: [...], status: true })
17. Express sends the JSON response over HTTP
18. Frontend: await response → response.json() → the { message, data, status } object
19. setDebates(response.data || []) → React schedules a re-render
20. React re-renders with loading=false, debates=[2 items]
21. The conditional rendering kicks in: loading is false, error is null, debates.length > 0
    → the .map() runs → renders one <Card> per debate
22. User sees two debate cards on screen
```

**This journey is what "full-stack" means.** Every web app does some version of this. If you understand this, you understand 80% of web development.

---

### 🎯 Concept 1: The Single-Page Application (SPA)

**What it is:** A traditional website sends a **new HTML page** from the server every time you click a link. The browser reloads. A **SPA** sends **one HTML file** on first load; after that, JavaScript handles all navigation. Clicking a link doesn't ask the server for a new page — JS swaps content and updates the URL in the browser.

**Why it exists:**
- **Speed:** no full page reloads; navigation feels instant
- **Rich interactivity:** animate, drag, drop without losing state
- **Separation of concerns:** backend becomes a pure data API (returns JSON, not HTML)

**Where in your project:**
- `Frontend/index.html` — the single HTML shell (`<div id="root">` + script tag)
- `Frontend/src/main.tsx` — JS that runs first, mounting React into `#root`
- `Frontend/src/App.tsx` — React Router, decides what to show for each URL

**The trade-off:**
- ✅ Fast after first load, great UX
- ❌ Slow first load (must download the whole JS bundle)
- ❌ Bad for SEO (search engines see an empty `<div id="root">` until JS runs)
- ❌ Requires JavaScript to show anything

This is why Next.js exists — a hybrid that pre-renders HTML on the server but still lets you build SPA-like interactivity. Your project is a **pure SPA** (Vite, not Next.js).

**Remember:**
1. SPA = one HTML page + JS handles all navigation
2. The backend in an SPA only returns **data (JSON)**, never HTML
3. The URL changes but the page doesn't reload — that's React Router's job

---

### 🎯 Concept 2: React Components & Props

**What they are:** A **component** is a JavaScript function that returns JSX (looks like HTML, is actually JS). Components are the building blocks of a React UI — you compose small ones into big ones.

```jsx
function Button({ label, onClick }) {     // { label, onClick } = props
  return <button onClick={onClick}>{label}</button>
}
```

**Props** are the inputs a component receives from its parent. They're read-only. A component must never modify its own props — props flow **down** (parent → child).

**Why they exist:**
- **Reusability:** write a `Card` once, use it 50 times
- **Composability:** nest components inside each other
- **Predictability:** same props in → same UI out (mostly)

**Where in your project:** `DebatesPage` is a component. It uses child components: `<Button>`, `<Card>`, `<Badge>`, `<Link>`, icons like `<ArrowLeft>`, `<Users>`, `<Clock>`, `<Loader2>`.

**The `key` prop:** When you render a **list** (like `debates.map(...)`), React needs a way to track which item is which across re-renders. The `key` prop is how. Without a stable, unique `key`, React might re-render the wrong items or lose state. Using the array index as key is a common **mistake** — it breaks if the list reorders. Your code correctly uses `key={debate.id}`.

**Remember:**
1. A component is a function that returns JSX
2. Props are inputs from the parent, read-only, flow downward
3. Always use a stable unique `key` when rendering lists

---

### 🎯 Concept 3: React State (`useState`)

**What it is:** **State** is data that a component owns and can **change over time**. When state changes, React **re-renders** that component (and its children) to reflect the new data.

```jsx
const [debates, setDebates] = useState<any[]>([])
//     └─current┘  └─setter┘    └─initial value┘  └─type┘
```

- `debates` — the current value (starts as `[]`)
- `setDebates` — the function you call to change it
- Calling `setDebates(newArray)` tells React "the data changed, re-render please"

**Why it exists:** Without state, a component would always render the same thing. State is what makes a UI **dynamic** — a loading spinner that disappears, a list that fills in, a form that updates as you type.

**Where in `DebatesPage`:** Three pieces of state, the classic data-fetching triad:
```jsx
const [debates, setDebates] = useState<any[]>([])        // the data
const [loading, setLoading] = useState(true)             // are we fetching?
const [error, setError] = useState<string | null>(null)  // did it fail?
```

This **triad** (data + loading + error) is the single most common pattern in React data fetching. You'll see it in every page of this app. Memorize it.

**The rule of state (critical):** **State is asynchronous.** When you call `setDebates(newData)`, `debates` doesn't update on the next line. React batches updates and re-renders later. So this is a bug:
```js
setDebates(newData)
console.log(debates)  // ❌ still the OLD value
```
If you need the new value, use the new variable directly (`newData`), or use the functional form:
```js
setDebates(prev => [...prev, newItem])  // ✅ uses the latest state
```

**Remember:**
1. State = data the component owns and can change
2. `useState` returns `[value, setter]`
3. Calling the setter triggers a re-render
4. State updates are async — don't read the old variable right after setting

---

### 🎯 Concept 4: The `useEffect` Hook (the trickiest beginner concept)

**What it is:** `useEffect` lets you run **side effects** in a React component. A side effect is anything that reaches outside the component: fetching data, setting up a timer, subscribing to a websocket, manually changing the DOM.

```jsx
useEffect(() => {
  // this runs AFTER the component renders
}, [])
```

**Why it exists:** React components are supposed to be **pure**: same props + state in → same JSX out. But real apps need to do impure things (fetch from a server, set timers). `useEffect` is the escape hatch — it runs the impure stuff *after* React has finished rendering.

**The dependency array (the part that trips everyone up):** The second argument `[]` controls **when** the effect re-runs:

| Array | When it runs |
|---|---|
| `[]` (empty) | **Once**, after the first render (mount) |
| `[a, b]` | After mount, and again whenever `a` or `b` changes |
| (omitted) | After **every** render — usually a bug |

**Where in `DebatesPage`:**
```jsx
useEffect(() => {
  const loadDebates = async () => {
    try {
      setLoading(true)
      const response = await debateAPI.getDebates()
      setDebates(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load debates")
    } finally {
      setLoading(false)
    }
  }
  loadDebates()
}, [])  // ← empty array = run once on mount
```

**Translation:** "When this page first appears, fetch the debates. While fetching, show a spinner. If it works, store them. If it fails, store the error. Either way, stop loading."

**Why the empty array matters:** Without `[]`, this effect would run after **every** render. And since `setDebates` causes a re-render, you'd get an **infinite loop**: render → fetch → setState → re-render → fetch → setState → ... This is the #1 `useEffect` bug. Always ask: "what should trigger this to re-run?"

**The cleanup function (not used here, but you'll see it):** If your effect sets up something persistent (a timer, a subscription), you must return a cleanup function so React can tear it down when the component unmounts:
```jsx
useEffect(() => {
  const id = setInterval(() => tick(), 1000)
  return () => clearInterval(id)  // ← cleanup
}, [])
```
Your `DebateRoomPage` does exactly this for its speaker timer.

**Remember:**
1. `useEffect` runs side effects after render
2. The dependency array controls re-runs
3. `[]` = run once on mount (the most common case for data fetching)
4. Forgetting the array = infinite loop
5. If you set up something persistent, return a cleanup function

---

### 🎯 Concept 5: Async/Await & Promises (the foundation of all data fetching)

**What it is:** JavaScript is **single-threaded**. If a line of code takes a long time (like asking a server for data), it would freeze the whole page. **Promises** solve this: they're a placeholder for a value that will arrive later. **async/await** is the clean syntax for working with promises.

```js
const response = await fetch(url)   // wait here until the server replies
const data = await response.json() // wait here until JSON is parsed
```

- `fetch(url)` returns a **Promise** — an object representing a future value
- `await` **pauses the function** until the promise resolves, then gives you the value
- An `async` function always returns a promise

**Why it exists:** Without async/await, you'd write deeply nested callbacks ("callback hell") or long `.then()` chains. `async/await` makes asynchronous code **look** synchronous and be much easier to read.

**Where in `DebatesPage`:**
```jsx
const loadDebates = async () => {           // ← async function
  try {
    setLoading(true)
    const response = await debateAPI.getDebates()   // ← await the fetch
    setDebates(response.data || [])
  } catch (err: any) {
    setError(err.message || "Failed to load debates")
  } finally {
    setLoading(false)
  }
}
```

**The try/catch/finally (important):**
- `try` — run this code; if anything throws, jump to catch
- `catch (err)` — handle the error (here: store it in state so the UI can show it)
- `finally` — **always** runs, success or failure (here: stop the loading spinner)

This is the standard shape for "fetch data and don't crash the page if it fails." You'll see it in every page of this app.

**What happens if the request fails:** If the server is down or returns a non-2xx status, `fetch` doesn't throw by default — it returns a response with `ok: false`. Your `apiRequest` helper **does** throw on non-ok, so the `catch` block catches it. This is a design choice — there are different opinions on whether `fetch` should throw on 4xx/5xx.

**Remember:**
1. `async` marks a function as returning a Promise
2. `await` pauses until the promise resolves
3. Wrap awaits in try/catch to handle failures
4. `finally` runs no matter what — perfect for "stop loading"
5. Without async/await, you'd use `.then().catch()` — same thing, uglier

---

### 🎯 Concept 6: The API Service Layer (`src/services/api.ts`)

**What it is:** A single file that knows how to talk to the backend. Every page imports from here instead of calling `fetch` directly.

**Why it exists:** **Centralization.** If the backend URL changes, you change it in one place. If you need to add an auth token to every request, you add it in one place. If you want to switch from `fetch` to `axios`, you change one file. This is the **service layer pattern**.

**The structure (two parts):**

*Part 1 — the `apiRequest` helper:*
```js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest<T = any>(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}
```

*Part 2 — grouped endpoint objects:*
```js
export const debateAPI = {
  getDebates: () => apiRequest('/debates'),
  getDebateById: (id) => apiRequest(`/debates/${id}`),
  createDebate: (data) => apiRequest('/debates', { method: 'POST', body: JSON.stringify(data) }),
};
```

So a page just calls `debateAPI.getDebates()` — it doesn't know or care about URLs, headers, or `fetch`.

**The `import.meta.env.VITE_API_URL` part:** Vite exposes environment variables prefixed with `VITE_` via `import.meta.env`. So if you set `VITE_API_URL=https://myapi.com/api` in a `.env` file, the app uses that. Otherwise it falls back to `http://localhost:5000/api`. This is how the same code works in dev and production.

⚠️ **Gotcha:** Vite inlines these at **build time**, not runtime. So you must set the env var before building, not just before running.

**Remember:**
1. One file owns all HTTP communication
2. A helper function (`apiRequest`) handles the common stuff (URL, headers, errors)
3. Grouped objects (`debateAPI`, `argumentAPI`) make calls readable
4. Pages import these objects, never `fetch` directly

---

### 🎯 Concept 7: HTTP & REST (the contract between frontend and backend)

**What it is:** **HTTP** is the protocol the browser and server use to talk. A request has a **method** (GET, POST, PUT, DELETE) and a **URL**. The server returns a **status code** (200 OK, 404 Not Found, 500 Server Error) and a body.

**REST** is a convention for designing URLs: nouns as resources, methods as actions.
- `GET /debates` → "give me the list of debates"
- `GET /debates/123` → "give me debate 123"
- `POST /debates` → "create a new debate"
- `PUT /debates/123` → "update debate 123"
- `DELETE /debates/123` → "delete debate 123"

**Where in your project:** The backend exposes these REST endpoints (mounted in `server.js`):
```
GET    /api/debates          → getDebates
GET    /api/debates/:id      → getDebateById
POST   /api/debates          → createDebate
PUT    /api/debates/:id      → updateDebate
```

The frontend's `debateAPI` mirrors this exactly. The **API contract** is the agreement between frontend and backend about these URLs and the shape of the JSON.

**The response envelope (a design choice):** Your backend always returns the same shape:
```json
{ "message": "...", "data": [...], "status": true }
```
This is why `DebatesPage` reads `response.data` — it trusts the envelope. A consistent envelope simplifies the frontend. (It's a convention, not a law — many APIs don't do this.)

**Remember:**
1. HTTP methods map to actions (GET=read, POST=create, PUT=update, DELETE=delete)
2. REST = nouns as resources, methods as verbs
3. The API contract (URLs + JSON shapes) is what frontend and backend must agree on
4. A consistent response envelope simplifies the frontend

---

### 🎯 Concept 8: Express — Routes, Middleware, Controllers

**What it is:** Express is a Node.js web framework. It receives HTTP requests and runs a chain of **middleware** functions, then hands off to a **route handler** (your controller).

**The request lifecycle in Express:**
```
incoming HTTP request
  → app.use(cors())              ← global middleware (runs for every request)
  → app.use(express.json())      ← parses JSON body into req.body
  → app.use("/api/debates", router)  ← route mount: hand off to the debates router
    → router.get("/", getDebates)    ← specific route: GET /api/debates → controller
      → getDebates(req, res)         ← controller function runs
        → res.json({...})            ← response sent
```

**Middleware (the key Express concept):** A **middleware** is a function `(req, res, next) => { ... }`. It can:
- Modify `req` or `res`
- End the cycle by sending a response
- Call `next()` to pass control to the next middleware/handler

`express.json()` is middleware that reads the request body, parses it as JSON, and attaches it to `req.body`. Without it, `req.body` would be undefined. This is why `app.js` mounts it globally.

**Where in your project:**
- `app.js` mounts global middleware: `cors()`, `express.json()`, `express.urlencoded()`
- `server.js` mounts routers: `app.use("/api/debates", debateRoutes)`
- `routes/debate.routes.js` maps verbs to controllers: `router.get("/", getDebates)`
- `controllers/debate.controller.js` has the actual `getDebates` function

**The controller's job:**
```js
export const getDebates = async (req, res) => {
  try {
    const debates = Debate.find();           // ← call the model
    res.status(200).json({                   // ← send the response
      message: "Debates retrieved successfully",
      data: debates,
      status: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
```
A controller:
1. Reads from `req` (body, params, query)
2. Calls models/services to do the work
3. Sends a response with `res.json()` or `res.status().json()`
4. Handles errors with try/catch

**Remember:**
1. Express = middleware chain + route handlers
2. Middleware runs for every request (or every request on a path)
3. `express.json()` parses the body — without it, `req.body` is undefined
4. Controllers are the functions that actually handle a route
5. `req` = incoming data, `res` = outgoing response

---

### 🎯 Concept 9: The Model/Storage Layer (your "database")

**What it is:** In a normal app, the model layer talks to a database (MongoDB via Mongoose, Postgres via Prisma, etc.). In **your** app, it talks to JSON files. But the **shape** is the same — and that's the point.

**The three layers:**
```
controller  →  model  →  storage
(Debate.find())  (debates.find)  (readData("debates.json"))
```

- **Controller** calls `Debate.find()` — it doesn't know *how* data is stored
- **Model** (`debate.model.js`) is a thin object that re-exports `debates.find` from storage
- **Storage** (`storage.js`) actually reads the JSON file

**Why this layering exists:** **Swappability.** If you later replace `storage.js` with real Mongoose, the controller doesn't change — it still calls `Debate.find()`. This is the **façade pattern**: a fake interface over a different backend.

**What `storage.js` actually does:**
```js
const readData = (fileName) => {
  const filePath = path.join(DATA_DIR, fileName);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  }
  return [];
};
```
It reads the file, parses JSON, returns an array. `writeData` does the reverse. Every "model" method (`find`, `findOne`, `create`) is built on these two functions.

**The honest limitations (important to know):**
- **Synchronous** — `readFileSync` blocks the whole server. Fine for learning, fatal at scale.
- **No schema** — you can store any shape; bugs go unnoticed.
- **No indexes** — every `find` reads the whole file and scans it.
- **No relations** — `debateId` is just a string; nothing enforces it points to a real debate.
- **No concurrency safety** — two requests writing at the same time can overwrite each other.

A real database (MongoDB, Postgres) solves all of these. But the **patterns you're learning** (controller → model → storage) are identical.

**Remember:**
1. The model layer abstracts the database
2. Your project uses JSON files instead of Mongo — same patterns, simpler backend
3. The façade pattern means you can swap storage without touching controllers
4. Real databases add schemas, indexes, relations, concurrency — concepts to learn next

---

### 🎯 Concept 10: The Full Round-Trip (putting it all together)

Now read this slowly. This is the whole point of everything above.

```
1.  User visits /debates
2.  React Router renders <DebatesPage/>
3.  Component initializes state: debates=[], loading=true, error=null
4.  React renders for the first time → shows the loading spinner (loading=true)
5.  useEffect runs (after the first render)
6.  loadDebates() is called → setLoading(true) → await debateAPI.getDebates()
7.  debateAPI.getDebates() calls apiRequest("/debates")
8.  apiRequest calls fetch("GET http://localhost:5000/api/debates")
9.  Express receives the request
10. Global middleware runs: cors() → express.json() (no body to parse on GET)
11. server.js route mount matches: /api/debates → debate.routes.js router
12. debate.routes.js: GET / → getDebates controller
13. getDebates calls Debate.find()
14. Debate.find delegates to debates.find in storage.js
15. storage.js: readData("debates.json") → fs.readFileSync → JSON.parse → array of 2 debates
16. controller wraps: res.status(200).json({ message, data: [...], status: true })
17. Express sends the JSON response over HTTP
18. Frontend: await response → response.json() → the { message, data, status } object
19. setDebates(response.data || []) → React schedules a re-render
20. React re-renders with loading=false, debates=[2 items]
21. The conditional rendering kicks in: loading is false, error is null, debates.length > 0
    → the .map() runs → renders one <Card> per debate
22. User sees two debate cards on screen
```

**This journey is what "full-stack" means.** Every web app does some version of this. If you understand this, you understand 80% of web development.

---

## Exercise — Add a Delete Debate Feature

**Goal:** Add a button to each debate card that deletes the debate when clicked.

**What you'd need to do:**
1. **Backend:** Add `DELETE /api/debates/:id` → controller calls `Debate.findByIdAndDelete(id)` (you'd need to add this method to the model + storage)
2. **Frontend API:** Add `debateAPI.deleteDebate(id) = apiRequest('/debates/' + id, { method: 'DELETE' })`
3. **Frontend UI:** Add a delete `<Button>` to each card, with an `onClick` that calls `debateAPI.deleteDebate(debate.id)` then removes it from local state with `setDebates(prev => prev.filter(d => d.id !== debate.id))`

**Don't do it yet** — just sit with the question: "Could I describe how to do this, even if I can't write the code?" If yes, you understand the architecture. If no, revisit the concept that's unclear.

---

## Self-Check Questions

Before moving on, check yourself. Can you answer these without looking?

1. Why does `useEffect` have `[]` as the second argument? What would happen without it?
2. Why is there a `try/catch/finally` around the fetch?
3. Why does the frontend call `debateAPI.getDebates()` instead of `fetch()` directly?
4. What does `express.json()` do, and what happens if you remove it?
5. Why is `Debate.find()` in the controller instead of `readData("debates.json")` directly?
6. What's in `response.data` and why does the frontend trust that shape?

If any of these are fuzzy, revisit the relevant concept above before moving to the next feature trace.

---

## What's Next

Once comfortable with this flow, the next feature traces are:

1. **Create Argument** — adds POST requests, request bodies, and a controller that calls **two services** (fallacy detection + credibility scoring) before saving
2. **AI Feedback** — shows how a controller composes a service + does its own aggregation
3. **Auth flow (signup → OTP → login)** — covers bcrypt, JWT, nodemailer, and the missing-auth-middleware gap

Then Phase 4 (file deep-dives), Phase 5 (syntax), Phase 6 (revision woven in), Phase 7 (exercises), Phase 8 (AI delegation guidance).

---

*This document was generated from a thorough exploration of the actual codebase. All architecture descriptions reflect what the code actually does, not what it claims to do. Dead code is clearly marked as dead.*
