# 🎨 Visual Quick Reference

## Simple Connection Diagram

```
┌──────────────────────┐
│   Your React App     │
│  (localhost:5173)    │
└──────────┬───────────┘
           │ HTTP Requests
           │ to /api/*
           ▼
┌──────────────────────┐
│   Express Backend    │
│  (localhost:5000)    │
└──────────┬───────────┘
           │ Query Database
           │ Process Logic
           ▼
┌──────────────────────┐
│   MongoDB Database   │
│    (Cloud/Local)     │
└──────────────────────┘
```

---

## How Your Code Works

```
┌─────────────────────────────────────────┐
│ React Component                         │
│                                         │
│  function MyComponent() {               │
│    const { data, loading } = useHook(); │
│    return <div>{data}</div>             │
│  }                                      │
└──────────────┬──────────────────────────┘
               │ Uses
               ▼
┌──────────────────────────────┐
│ Custom React Hook            │
│ (use-api.ts)                 │
│                              │
│ - Loading state              │
│ - Error handling             │
│ - Data management            │
│ - Fetch function             │
└──────────────┬───────────────┘
               │ Calls
               ▼
┌──────────────────────────────┐
│ API Service Layer            │
│ (services/api.ts)            │
│                              │
│ - Adds base URL              │
│ - Adds headers               │
│ - Adds auth token            │
│ - Makes fetch request        │
└──────────────┬───────────────┘
               │ HTTP Request
               ▼ (with JSON)
         NETWORK (Internet)
               │
               ▼
┌──────────────────────────────┐
│ Backend Express Server       │
│ (5000)                       │
│                              │
│ Route → Controller           │
│ → Model → Database           │
└──────────────┬───────────────┘
               │ HTTP Response
               ▼ (with JSON)
         NETWORK (Internet)
               │
               ▼
┌──────────────────────────────┐
│ API Service                  │
│ - Parse JSON                 │
│ - Check errors               │
│ - Return data                │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Hook State Updated           │
│ - setLoading(false)          │
│ - setData(response)          │
│ - setError(null)             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Component Re-renders         │
│ with new data                │
│                              │
│ User sees update! ✅         │
└──────────────────────────────┘
```

---

## API Endpoint Matrix

```
                CREATE (POST)    READ (GET)      UPDATE (PUT)    DELETE (DELETE)
────────────────────────────────────────────────────────────────────────────────
Debates         POST /debates    GET /debates    -               -
                                 GET /debates/:id

Arguments       POST /args       GET /args       -               -

Fact-Checks     POST /check      GET /check      -               -

Analytics       -                GET /analytics/:id -            -

Auth            POST /signup     -               POST /change    -
                POST /login
                POST /verify
```

---

## Component Hierarchy Tree

```
App
│
├── Pages
│   ├── HomePage
│   │   └── useDebates()
│   │       ├── DebatesList
│   │       └── DebateCard[]
│   │
│   ├── DebateDetailPage
│   │   ├── useDebates(id)
│   │   ├── useArguments(debateId)
│   │   └── useAnalytics(debateId)
│   │       ├── DebateHeader
│   │       ├── ArgumentsList
│   │       │   └── ArgumentCard[]
│   │       ├── ArgumentForm
│   │       │   └── useArguments()
│   │       └── AnalyticsPanel
│   │
│   ├── AnalyticsPage
│   │   └── useAnalytics()
│   │       ├── ArgumentChart
│   │       ├── Scorecard
│   │       └── Leaderboard
│   │
│   └── ProfilePage
│       └── useAuth()
│
└── Shared
    ├── Navigation
    ├── Sidebar
    └── ErrorBoundary
```

---

## Data Flow for Common Tasks

### Task 1: View All Debates

```
User Opens App
        │
        ▼
DebatesPage Component Mounts
        │
        ▼
useDebates() Hook Executes
        │
        ▼
useEffect calls fetchDebates()
        │
        ▼
debateAPI.getDebates() Called
        │
        ▼
HTTP GET http://localhost:5000/api/debates
        │
        ▼
Backend Returns: [{ id, topic, desc }, ...]
        │
        ▼
Hook Sets: debates = data, loading = false
        │
        ▼
Component Re-renders with Debates List
        │
        ▼
User Sees List ✅
```

### Task 2: Create New Debate

```
User Fills Form
        │
        ▼
User Clicks "Submit"
        │
        ▼
handleSubmit() Called
        │
        ▼
setLoading(true)
        │
        ▼
createDebate(formData) Hook Called
        │
        ▼
debateAPI.createDebate(data) Called
        │
        ▼
HTTP POST http://localhost:5000/api/debates
        Body: { topic, description }
        │
        ▼
Backend Creates in MongoDB
        │
        ▼
Backend Returns: { id, topic, desc, createdAt }
        │
        ▼
Hook Updates debates Array
        │
        ▼
setLoading(false), setError(null)
        │
        ▼
Component Re-renders
        │
        ▼
Form Cleared, New Debate Added to List
        │
        ▼
User Sees Success ✅
```

### Task 3: Get Debate Analytics

```
User Opens Debate Detail Page
        │
        ▼
[debateId] Passed to useAnalytics(debateId)
        │
        ▼
useEffect Watches debateId Change
        │
        ▼
fetchAnalytics() Called
        │
        ▼
analyticsAPI.getAnalytics(debateId) Called
        │
        ▼
HTTP GET http://localhost:5000/api/analytics/{debateId}
        │
        ▼
Backend Queries Database for Analytics
        │
        ▼
Backend Returns: { 
    totalArguments: 5,
    factChecks: 2,
    score: 8.5,
    participantCount: 3
}
        │
        ▼
Hook Updates: analytics = data
        │
        ▼
AnalyticsPanel Component Shows Charts
        │
        ▼
User Sees Analytics ✅
```

---

## State Management Flow

```
Component State:
┌────────────────────────────┐
│ const { data, loading,     │ ◄─ Returns from Hook
│         error, fetch } =   │
│ useDebates();              │
└────────────┬───────────────┘
             │
             │ Initially:
             │ data = []
             │ loading = false
             │ error = null
             │
User Action │
(click)     │
   │        │
   ▼        │
setLoading(true)
             │
   │        │
   ▼        │
fetch Data
   │        │
   ▼        │
setLoading(false)
   │        │
   ▼        │
setData(response)
   │        │
   ▼        │
Re-render with New Data
   │        │
   ▼        │
User sees update ✅
```

---

## Authentication Flow

```
Login Form
    │
    ▼
User Submits Email & Password
    │
    ▼
authAPI.login({ email, password })
    │
    ▼
HTTP POST /api/auth/login
    │
    ▼
Backend Validates Credentials
    │
    ▼
Backend Generates JWT Token
    │
    ▼
Response: { token, user, ... }
    │
    ▼
localStorage.setItem('authToken', token)
    │
    ▼
All Subsequent Requests Include:
Headers: { 'Authorization': 'Bearer [token]' }
    │
    ▼
Backend Validates Token
    │
    ▼
Request Allowed/Denied
    │
    ▼
On Logout:
localStorage.removeItem('authToken')
```

---

## Component to Database Journey

```
React Component
    │ User Input
    ▼
Hook Function
    │ Manages State
    ▼
API Service
    │ HTTP Request
    ▼
Browser Fetch
    │ Network
    ▼
Express Server
    │ Route Matching
    ▼
Controller Function
    │ Business Logic
    ▼
Model/Service
    │ Database Query
    ▼
MongoDB
    │ Data Retrieval
    ▼
Service
    │ Data Processing
    ▼
Controller
    │ Format Response
    ▼
Express Server
    │ HTTP Response
    ▼
Browser Fetch
    │ Network
    ▼
API Service
    │ Parse JSON
    ▼
Hook Function
    │ Update State
    ▼
React Component
    │ Re-render
    ▼
User sees Result ✅
```

---

## File Organization

```
Frontend (React + TypeScript)
│
├── pages/             ← Page components
│   ├── DebatesPage.tsx
│   ├── DebateDetailPage.tsx
│   └── ...
│
├── components/        ← Reusable components
│   ├── DebateCard.tsx
│   ├── ArgumentList.tsx
│   └── ...
│
├── hooks/            ← Custom React hooks
│   └── use-api.ts    ◄─ MAIN: All data fetching
│
├── services/         ← API layer
│   └── api.ts        ◄─ MAIN: All API calls
│
└── examples/         ← Code examples
    └── api-implementation.example.tsx

Backend (Express + Node.js)
│
├── routes/           ← API endpoints
│   ├── debate.routes.js
│   ├── argument.routes.js
│   └── ...
│
├── controllers/      ← Business logic
│   ├── debate.controller.js
│   ├── argument.controller.js
│   └── ...
│
├── models/          ← Database schemas
│   ├── Usermodel.js
│   ├── debate.model.js
│   └── ...
│
├── services/        ← Business services
│   ├── debate.service.js
│   └── ...
│
└── config/          ← Configuration
    ├── Dbconfig.js
    └── socket.js
```

---

## Request/Response Format

```
REQUEST:
┌──────────────────────────────────┐
│ POST http://localhost:5000/api/debates
│                                  │
│ Headers:                         │
│ - Content-Type: application/json │
│ - Authorization: Bearer [token]  │
│                                  │
│ Body:                            │
│ {                                │
│   "topic": "AI Ethics",          │
│   "description": "Should..."     │
│ }                                │
└──────────────────────────────────┘

RESPONSE:
┌──────────────────────────────────┐
│ Status: 201 Created              │
│                                  │
│ Headers:                         │
│ - Content-Type: application/json │
│                                  │
│ Body:                            │
│ {                                │
│   "_id": "507f1f77...",          │
│   "topic": "AI Ethics",          │
│   "description": "Should...",    │
│   "createdAt": "2024-01-15"      │
│ }                                │
└──────────────────────────────────┘
```

---

## Error Handling Flow

```
Fetch Request
    │
    ▼
Network Error? ──Yes──> Catch block
                            │
                            ▼
                        setError(message)
                            │
                            ▼
                        Component shows: <Error />
                            │
                            ▼
                        User sees error ⚠️

    │
    └──No──▼
         Response.ok? 
             │
       No   │   Yes
      ╱     └─────╲
     ▼             ▼
  404/500        200/201
    │              │
    ▼              ▼
 throw         Parse JSON
    │              │
    ▼              ▼
 Error        setData(json)
    │              │
    ▼              ▼
setError()    Component renders
    │              │
    ▼              ▼
Show Error     User sees data ✅
   ⚠️
```

---

## One-Minute Setup Summary

```
Step 1: Open 2 Terminals
┌─────────────────────┐    ┌─────────────────────┐
│ Terminal 1          │    │ Terminal 2          │
│ cd Backend          │    │ cd Frontend         │
│ npm install         │    │ npm install         │
│ npm run dev         │    │ npm run dev         │
│ (port 5000)         │    │ (port 5173)         │
└─────────────────────┘    └─────────────────────┘

Step 2: Verify Connection
Browser: http://localhost:5173
Console: F12
Network: See /api/* requests

Step 3: Start Coding
Use hooks from Frontend/src/hooks/use-api.ts
Copy examples from Frontend/src/examples/
```

---

**Save this page for quick visual reference!** 📌
