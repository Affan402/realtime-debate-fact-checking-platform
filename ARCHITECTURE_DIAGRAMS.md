# Architecture & Data Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT SIDE                       │
│                    (http://localhost:5173)                      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  React Components                          │ │
│  │  (DebatePage, ArgumentForm, AnalyticsPanel, etc.)         │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │ uses                                        │
│  ┌────────────────▼─────────────────────────────────────────┐ │
│  │              Custom Hooks (use-api.ts)                   │ │
│  │  • useDebates()                                          │ │
│  │  • useArguments()                                        │ │
│  │  • useFactChecks()                                       │ │
│  │  • useAnalytics()                                        │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │ calls                                       │
│  ┌────────────────▼─────────────────────────────────────────┐ │
│  │            API Service Layer (api.ts)                    │ │
│  │  • debateAPI                                             │ │
│  │  • argumentAPI                                           │ │
│  │  • factCheckAPI                                          │ │
│  │  • analyticsAPI                                          │ │
│  │  • authAPI                                               │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │ makes HTTP requests                        │
│                   │ (with base URL, headers, auth token)       │
│                   │                                             │
└───────────────────┼─────────────────────────────────────────────┘
                    │
                    │ http://localhost:5000/api
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│              BACKEND / SERVER SIDE                              │
│           (http://localhost:5000)                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            Express Routes (routes/*.js)                 │ │
│  │  POST   /debates      → createDebate                    │ │
│  │  GET    /debates      → getDebates                      │ │
│  │  GET    /debates/:id  → getDebateById                   │ │
│  │  POST   /arguments    → createArgument                  │ │
│  │  GET    /arguments    → getArguments                    │ │
│  │  POST   /factcheck    → createFactCheck                 │ │
│  │  POST   /analytics/:id→ getAnalytics                    │ │
│  │  POST   /auth/*       → auth functions                  │ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │ calls                                     │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │         Controllers (controllers/*.js)                  │ │
│  │  • debate.controller.js                                 │ │
│  │  • argument.controller.js                               │ │
│  │  • factcheck.controller.js                              │ │
│  │  • analytics.controller.js                              │ │
│  │  • Auth.js                                              │ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │ uses                                      │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │         Models / Services (models/*.js)                 │ │
│  │  • Debate.model.js                                      │ │
│  │  • argument.service.js                                  │ │
│  │  • debate.service.js                                    │ │
│  │  • AI Processing (ai/)                                  │ │
│  └──────────────────┬───────────────────────────────────────┘ │
│                     │ interacts                                 │
│  ┌──────────────────▼───────────────────────────────────────┐ │
│  │          MongoDB Database                               │ │
│  │  • Debates Collection                                   │ │
│  │  • Users Collection                                     │ │
│  │  • Arguments Collection                                 │ │
│  │  • Fact Checks Collection                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │           Socket.IO (Real-time)                        │  │
│  │  • Live debate updates                                 │  │
│  │  • Audience reactions                                  │  │
│  │  • Real-time fact checking                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Example: Creating a Debate

```
User fills form in React Component
        │
        ▼
┌─────────────────────────┐
│ Component: CreateDebate │
│ handleSubmit()          │
└────────────┬────────────┘
             │
             ▼ calls hook
┌─────────────────────────────────────┐
│ Hook: useDebates()                  │
│ createDebate(formData)              │
└────────────┬────────────────────────┘
             │
             ▼ calls API service
┌──────────────────────────────────────────────┐
│ API Service: debateAPI.createDebate()        │
│ • Adds base URL: /api/debates                │
│ • Adds headers: Content-Type, Auth token     │
│ • Serializes data to JSON                    │
│ • Makes fetch POST request                   │
└────────────┬─────────────────────────────────┘
             │
             ▼ HTTP POST request
       http://localhost:5000/api/debates
             │
        NETWORK
             │
             ▼
┌──────────────────────────────────────────────┐
│ Backend: POST /api/debates                   │
│ • Route: debate.routes.js                    │
│ • Controller: debate.controller.js           │
│ • createDebate(req, res)                     │
└────────────┬─────────────────────────────────┘
             │
             ▼ validates & processes
┌──────────────────────────────────────────────┐
│ Service: debate.service.js                   │
│ • Save to MongoDB                            │
│ • Return created debate                      │
└────────────┬─────────────────────────────────┘
             │
             ▼ HTTP Response (201 Created)
       { _id, topic, description, ... }
             │
        NETWORK
             │
             ▼
┌──────────────────────────────────────────────┐
│ Frontend: API Service                        │
│ • Parse JSON response                        │
│ • Return debate object                       │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Frontend: Hook                               │
│ • Update debates state                       │
│ • Set loading = false                        │
│ • Return updated debate                      │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│ Component: CreateDebate                      │
│ • Show success message                       │
│ • Clear form                                 │
│ • Redirect or refresh list                   │
└──────────────────────────────────────────────┘
             │
             ▼
        UI Updates (React re-render)
             │
             ▼
User sees new debate in the list! ✅
```

---

## 🔄 State Management Flow

```
Component State:
┌─────────────────────────────┐
│ debates: Debate[]           │ ◄── from hook
│ loading: boolean            │
│ error: string | null        │
│ formData: { topic, desc }   │
└────────────┬────────────────┘
             │
User Input
             │
             ▼
┌─────────────────────────────┐
│ Event Handlers:             │
│ • handleSubmit()            │
│ • handleChange()            │
│ • handleRefresh()           │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Hook Updates:               │
│ • setLoading(true)          │
│ • fetchDebates()            │
│ • createDebate(data)        │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Hook Returns New State:     │
│ • debates: [...]            │
│ • loading: false            │
│ • error: null               │
└────────────┬────────────────┘
             │
             ▼
React Re-renders with new state
             │
             ▼
User sees updated UI ✅
```

---

## 📱 Component Hierarchy Example

```
App (Router)
│
├── Layout
│   ├── Navbar
│   └── Navigation
│
├── Pages
│   ├── HomePage
│   │   └── DebatesListExample
│   │       ├── useDebates()
│   │       └── DebateCard x N
│   │
│   ├── DebateDetailPage
│   │   ├── useDebates(debateId)
│   │   ├── useArguments(debateId)
│   │   └── useAnalytics(debateId)
│   │       ├── DebateHeader
│   │       ├── ArgumentsList
│   │       └── AnalyticsPanel
│   │
│   ├── CreateDebatePage
│   │   └── CreateDebateForm
│   │       └── useDebates()
│   │
│   └── AnalyticsPage
│       └── useAnalytics()
│           ├── ArgumentStrengthChart
│           ├── DebaterScorecard
│           └── LeaderboardTable
│
└── Error Boundary
    └── APIErrorBoundary
```

---

## 🔐 Authentication Flow

```
User Input (email, password)
        │
        ▼
┌─────────────────────────────┐
│ LoginComponent              │
│ handleLogin()               │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ authAPI.login({             │
│   email,                    │
│   password                  │
│ })                          │
└────────────┬────────────────┘
             │
             ▼
POST /api/auth/login
             │
             ▼
┌──────────────────────────────────┐
│ Backend: Auth.js                 │
│ • Validate credentials           │
│ • Check password with bcrypt     │
│ • Generate JWT token             │
│ • Return { token, user }         │
└────────────┬─────────────────────┘
             │
             ▼
Response: { token, user, ... }
             │
             ▼
┌──────────────────────────────────┐
│ Frontend: LoginComponent         │
│ localStorage.setItem(            │
│   'authToken',                   │
│   response.token                 │
│ )                                │
└────────────┬─────────────────────┘
             │
             ▼
All Subsequent API Calls Include:
┌──────────────────────────────────┐
│ Headers: {                       │
│   'Authorization': 'Bearer ...'  │
│ }                                │
└──────────────────────────────────┘
             │
             ▼
Backend validates token
     and returns data ✅
```

---

## 🔄 WebSocket Real-time Flow (Optional)

```
Frontend connects to Socket.IO
        │
        ▼
┌──────────────────────────┐
│ io('http://localhost:5000')
└────────────┬─────────────┘
             │
             ▼
Server acknowledges connection
             │
             ▼
┌──────────────────────────┐
│ socket.on('debate:updated')
│ socket.on('argument:added')
│ socket.on('reaction:new')
└────────────┬─────────────┘
             │
             ▼
Database change triggers
event emission
             │
             ▼
Server broadcasts to all
connected clients
             │
             ▼
┌──────────────────────────┐
│ Frontend receives event  │
│ Updates state            │
│ Re-renders component     │
└────────────┬─────────────┘
             │
             ▼
User sees live update ✅
(without refresh!)
```

---

## 🚀 Performance Optimization

```
Good Practice:
┌────────────────────────────────┐
│ Component Mount                │
│         │                      │
│         ▼                      │
│ useEffect with dependency array│
│         │                      │
│         ▼                      │
│ Fetch once when component loads│
│         │                      │
│         ▼                      │
│ Show loading spinner           │
│         │                      │
│         ▼                      │
│ Update state when data arrives │
│         │                      │
│         ▼                      │
│ Component unmounts             │
│ (cleanup if needed)            │
└────────────────────────────────┘

Bad Practice:
┌────────────────────────────────┐
│ Component Render               │
│         │                      │
│         ▼                      │
│ fetch() in render              │
│         │                      │
│         ▼                      │
│ setState → re-render           │
│         │                      │
│         ▼                      │
│ fetch() in render (again!)     │
│         │                      │
│         ▼                      │
│ INFINITE LOOP ❌               │
└────────────────────────────────┘
```

---

## 📋 File Structure with Data Flow

```
Frontend
├── pages/
│   ├── DebatesPage.tsx
│   │   └── calls: fetchDebates()
│   │
│   ├── DebateDetailPage.tsx
│   │   ├── calls: getDebateById()
│   │   ├── calls: getArgumentsByDebate()
│   │   └── calls: getAnalytics()
│   │
│   └── CreateDebatePage.tsx
│       └── calls: createDebate()
│
├── components/
│   ├── debate/
│   │   ├── DebateCard.tsx          (displays single debate)
│   │   └── ArgumentList.tsx        (displays arguments)
│   │
│   └── forms/
│       └── CreateDebateForm.tsx    (creates debate)
│
├── hooks/
│   └── use-api.ts                  ← Contains all custom hooks
│       ├── useDebates()
│       ├── useArguments()
│       ├── useFactChecks()
│       └── useAnalytics()
│
└── services/
    └── api.ts                       ← All API calls
        ├── debateAPI
        ├── argumentAPI
        ├── factCheckAPI
        ├── analyticsAPI
        └── authAPI

Backend
├── routes/
│   ├── debate.routes.js
│   ├── argument.routes.js
│   ├── factcheck.routes.js
│   ├── analytics.routes.js
│   └── Authroute.js
│
├── controllers/
│   ├── debate.controller.js        ← Handle debate requests
│   ├── argument.controller.js      ← Handle argument requests
│   ├── analytics.controller.js     ← Handle analytics requests
│   └── Auth.js                     ← Handle auth requests
│
├── models/
│   ├── Usermodel.js                ← User schema
│   ├── debate.model.js             ← Debate schema
│   └── argument.model.js           ← Argument schema
│
└── config/
    └── socket.js                   ← Real-time connections
```

---

## ✅ Summary

1. **User interacts** with React component
2. **Component calls** custom hook
3. **Hook calls** API service function
4. **API service** adds headers/token and makes HTTP request
5. **Backend receives** request at route
6. **Controller processes** request with business logic
7. **Model interacts** with MongoDB
8. **Response returns** to frontend
9. **Hook updates** component state
10. **Component re-renders** with new data
11. **User sees** updated UI

This cycle happens for every API call!
