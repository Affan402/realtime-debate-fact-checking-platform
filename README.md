# Realtime Debate Fact-Checking Platform

A full-stack web app for structured debates with real-time argument sharing, heuristic fallacy detection, credibility scoring, and Gemini-powered feedback. Debaters submit arguments, the backend scores them for credibility and flags logical fallacies, and everyone in the room sees new arguments appear in real time.

Built with React + TypeScript on the frontend and Node/Express on the backend, with Socket.IO for real-time updates, MongoDB/Mongoose for persistence, and Google's Gemini API for the AI features. The fact-checking is heuristic rather than a real verification engine — see Limitations for the honest details.

**Live Demo:** none deployed yet.
**Repository:** https://github.com/Affan402/realtime-debate-fact-checking-platform

---

## Features

- **Live debate room** — arguments submitted by one client are broadcast to everyone else in the room over Socket.IO.
- **Fallacy detection** — a small regex check catches obvious patterns (ad hominem, appeal to common belief, false dilemma), with Gemini as a fallback for anything it doesn't recognize.
- **Heuristic credibility scoring** — assigns a 0–1 score based on simple evidence-source rules.
- **AI feedback** — Gemini generates a debate summary, lists detected fallacies, and picks a "winner" by average credibility.
- **Devil's advocate** — a Gemini endpoint that generates a counter-argument to any claim.
- **Analytics dashboard** — leaderboard, argument-strength chart, and per-debate stats computed from stored arguments.
- **Backend authentication flow** — email OTP verification, password handling, and JWT issuance through authentication endpoints.

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix primitives) |
| Backend | Node.js 22, Express 5 |
| Database | MongoDB (Mongoose 9) |
| Real-time | Socket.IO 4 |
| Auth | bcryptjs, jsonwebtoken, nodemailer (Gmail) |
| AI | Google Gemini (`@google/generative-ai`) |
| Deployment | Docker (multi-stage), nginx, Vercel config |

---

## How It Works

The app is a standard client/server split:

```
                    ┌───────────────┐
                    │ Google Gemini │
                    └───────▲───────┘
                            │
Browser ── HTTP/WebSocket ──► Express API
                            │
                            ▼
                        MongoDB
```

The frontend talks to the backend through a thin `fetch` wrapper in `src/services/api.ts`. All data fetching and caching lives in a single React context (`DebateContext`), so pages share one source of truth instead of re-fetching on every navigation.

Real-time works like this: when a client submits an argument, the frontend emits a `new_argument` event over Socket.IO *and* POSTs the argument to the API. The server broadcasts the event to everyone in that debate's room, and each client adds it to a live feed. The submitter ignores its own echo by matching a `speakerName::claim` signature.

The "AI" features are all Gemini calls on the backend. Fallacy detection runs a fast regex check first and only calls Gemini when that doesn't match, which keeps the common cases cheap.

---

## Project Structure

```
Backend/
  server.js              # entry point — mounts routes, starts HTTP + Socket.IO
  app.js                 # Express app (cors + json middleware)
  config/
    Dbconfig.js          # MongoDB connection
    socket.js            # Socket.IO room/event handling
  routes/                # one router per resource
  controllers/           # request handlers
  models/                # Mongoose schemas
  services/              # fallacy, credibility, Gemini logic
  scripts/               # JSON → MongoDB migration
  data/                  # legacy JSON seed data
Frontend/
  src/
    pages/               # one component per route
    context/             # DebateContext (shared state + socket wiring)
    services/            # api.ts (fetch) and socket.ts (Socket.IO client)
    components/          # debate, analytics, ai, ui components
    hooks/               # use-api.ts (unused — see Limitations)
  nginx.conf             # SPA fallback + /api + socket.io proxy
  Dockerfile             # multi-stage build → nginx
  vercel.json            # Vercel build config
```

---

## API / Backend

All routes are mounted under `/api`. Responses follow a loose `{ message, data, status }` shape. The core endpoints cover debates, arguments, fact checks, analytics, AI feedback, and auth.

<details>
<summary>View all API endpoints</summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/debates` | List all debates |
| POST | `/api/debates` | Create a debate |
| GET | `/api/debates/:id` | Get one debate |
| PUT | `/api/debates/:id` | Update a debate |
| GET | `/api/arguments?debateId=` | List arguments (optionally filtered) |
| POST | `/api/arguments` | Create an argument (runs fallacy + credibility) |
| GET | `/api/arguments/:id` | Get one argument |
| GET | `/api/factcheck?argumentId=` | List fact checks |
| POST | `/api/factcheck` | Create a fact check |
| GET | `/api/analytics/:id` | Per-debate stats (counts, avg credibility) |
| GET | `/api/ai/feedback/:debateId` | Gemini summary + fallacies + winner |
| POST | `/api/ai/devils-advocate` | Gemini counter-argument for a claim |
| POST | `/api/auth/signup` | Create user, email OTP |
| POST | `/api/auth/login` | Verify credentials, return JWT |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/reset-otp` | Resend OTP |
| POST | `/api/auth/forgot-password` | Email a password-reset link |
| POST | `/api/auth/changepassword` | Change password with reset token |

</details>

Auth routes are rate-limited (100 requests per 10 minutes per IP).

---

## Data Model

Five Mongoose models, all using string `_id`s so legacy IDs from the JSON-file era still work:

- **Debate** — `title`, `topic`, `status` (`active`/`live`/`scheduled`/`closed`)
- **Argument** — `debateId`, `speakerName`, `claim`, `evidence`, `fallacy` (string or object), `credibilityScore` (0–1)
- **FactCheck** — `argumentId`, `verified`, `confidence`, `reason`
- **User** — `username`, `email`, `password` (bcrypt-hashed), `isVerified`
- **OTP** — `email`, `otp`, `isVerified`, with a 10-minute TTL index

---

## Running Locally

Prerequisites: Node 22+, a MongoDB instance (local or Atlas).

1. Clone and install:

```bash
git clone https://github.com/Affan402/realtime-debate-fact-checking-platform.git
cd realtime-debate-fact-checking-platform

cd Backend
npm install

cd ../Frontend
npm install
```

2. Create `Backend/.env`:

```
URI=mongodb+srv://<your-connection-string>
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=<your-key>
EMAIL=<gmail-address>
APP_PASS=<gmail-app-password>
PRIVATE_KEY=<any-string-for-jwt-signing>
```

3. Run the backend:

```bash
cd Backend
npm run dev
```

4. Run the frontend (separate terminal):

```bash
cd Frontend
npm run dev
```

Open http://localhost:5173. The frontend defaults to `http://localhost:5000/api` for the API and `http://localhost:5000` for Socket.IO, so no frontend env vars are needed for local dev.

Production build:

```bash
cd Frontend
npm run build   # runs tsc && vite build, outputs to dist/
```

---

## Important Notes / Limitations

- **Auth is not enforced.** The backend issues JWTs on login, but no route verifies them. Every `/api/debates`, `/api/arguments`, etc. endpoint is public. There's also no login/signup UI in the frontend — the auth API exists but nothing calls it.
- **"Fact-checking" is a heuristic, not real verification.** Credibility is a hardcoded lookup (`who.int` → 0.9, `wikipedia` → 0.6, anything else → 0.4, no evidence → 0.3). Fact-check records are created manually via the API, not generated automatically.
- **The debate room is partly mocked.** Speaker names, the countdown timer, audience reaction counts, and the "247 watching" figure are hardcoded/local state. Only argument submission is genuinely real-time.
- **The active debate ID is hardcoded** to `"1786435967997"` in `DebateContext.tsx`. Selecting a debate from the list doesn't actually change which debate you're in.
- **No automated tests.** The backend `test` script is the default "no test specified" stub.
- **Some leftover code.** A few unused dependencies and an unused hook remain from earlier iterations and should be removed before production.
- **No `docker-compose.yml`.** The Dockerfiles and `nginx.conf` reference a `backend` service name, but the compose file that would define it isn't in the repo, so the containers don't run together out of the box.

---

## Production Improvements

- Add JWT verification middleware and protect the data routes; add a real login/signup flow in the frontend.
- Replace the hardcoded credibility heuristic with something that actually evaluates sources (or at least wire up the Gemini credibility function that already exists but isn't called).
- Make the debate ID come from the route (`/debate/:id`) instead of a constant.
- Add automated tests (at minimum for the controllers and the fallacy/credibility services).
- Remove the dead dependencies and the unused `use-api.ts` hooks to reduce confusion.
- Add a `docker-compose.yml` so the frontend/backend/MongoDB containers actually run together.
- Add input validation (zod is already installed) and rate limiting beyond just the auth routes.

---

## Deployment

There's a multi-stage frontend Dockerfile (Node build → nginx serve) with an `nginx.conf` that handles SPA fallback, `/api` proxying, and Socket.IO upgrade headers. The backend has a simple Node Dockerfile. There's also a `vercel.json` for the frontend. None of this is wired to a live deployment, and the missing compose file means the Docker setup isn't runnable as-is.

---

