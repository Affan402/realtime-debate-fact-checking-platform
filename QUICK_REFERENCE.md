# 🚀 Quick Reference Card

Print this page or save as PDF for quick reference while coding!

---

## 🎯 Server Commands

```bash
# Terminal 1: Backend
cd Backend
npm install          # First time only
npm run dev         # Start backend

# Terminal 2: Frontend
cd Frontend
npm install          # First time only
npm run dev         # Start frontend
```

**URLs:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- API Base: `http://localhost:5000/api`

---

## 🔧 API Hooks

```typescript
// Import any hook
import { useDebates, useArguments, useFactChecks, useAnalytics } from '@/hooks/use-api';

// Use in component
const { data, loading, error, fetchData, createData } = useDebates();

// Fetch on mount
useEffect(() => {
  fetchData();
}, []);

// Handle states
if (loading) return <Loading />;
if (error) return <Error message={error} />;

// Render data
return data.map(item => <Item key={item._id} item={item} />);
```

---

## 📡 Direct API Calls

```typescript
import { debateAPI, argumentAPI, factCheckAPI, analyticsAPI } from '@/services/api';

// Debates
debateAPI.getDebates()
debateAPI.createDebate({ topic, description })
debateAPI.getDebateById(id)

// Arguments
argumentAPI.createArgument({ debateId, content })
argumentAPI.getArgumentsByDebate(debateId)

// Fact Checks
factCheckAPI.createFactCheck(data)
factCheckAPI.getFactChecks(debateId)

// Analytics
analyticsAPI.getAnalytics(debateId)
```

---

## 🔐 Authentication

```typescript
// Login
const { token, user } = await authAPI.login({ email, password });

// Save token
localStorage.setItem('authToken', token);

// Token auto-attached to all requests
// No need to do it manually!

// Logout
localStorage.removeItem('authToken');
```

---

## 📝 Common Patterns

### Pattern 1: Fetch List
```typescript
const { debates, loading, error, fetchDebates } = useDebates();

useEffect(() => {
  fetchDebates();
}, []);

return loading ? <Loading /> : debates.map(d => <Card key={d._id} debate={d} />);
```

### Pattern 2: Create Item
```typescript
const { createDebate, loading } = useDebates();

const handleSubmit = async (formData) => {
  try {
    const newDebate = await createDebate(formData);
    alert('Created!');
  } catch (error) {
    alert('Failed: ' + error.message);
  }
};

return <form onSubmit={handleSubmit}>...</form>;
```

### Pattern 3: Fetch Detail
```typescript
const { analytics, fetchAnalytics } = useAnalytics(debateId);

useEffect(() => {
  fetchAnalytics();
}, [debateId]);

return analytics ? <AnalyticsView data={analytics} /> : <Loading />;
```

---

## 🧪 Testing in Browser Console

```javascript
// Test API connection
fetch('http://localhost:5000/api/debates')
  .then(r => r.json())
  .then(d => console.log(d))

// Test with token
fetch('http://localhost:5000/api/debates', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}).then(r => r.json()).then(d => console.log(d))

// Test POST
fetch('http://localhost:5000/api/debates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'Test', description: 'Test' })
}).then(r => r.json()).then(d => console.log(d))
```

---

## 🐛 Debugging Tips

```javascript
// In browser console (F12)

// Check if API URL is correct
console.log(import.meta.env.VITE_API_URL)
// Should show: http://localhost:5000/api

// Check if token exists
console.log(localStorage.getItem('authToken'))

// Check response structure
const response = await fetch('http://localhost:5000/api/debates');
const data = await response.json();
console.log(data);
// See what structure is returned
```

---

## ⚡ Quick Debugging

| Issue | Check |
|-------|-------|
| "Cannot connect to backend" | Is `npm run dev` running in Backend? |
| "CORS error" | Restart backend server |
| "Module not found" | Run `npm install` in Frontend |
| "Cannot find @/..." | Restart frontend dev server |
| "API returns 404" | Check endpoint name in route |
| "TypeError in API" | Check response structure in console |
| "Token not working" | Check localStorage has token |

---

## 📂 Important Files

```
Frontend/
├── src/services/api.ts        ← All API calls here
├── src/hooks/use-api.ts       ← All hooks here
└── src/examples/...           ← Code examples

Backend/
├── routes/                    ← API endpoints
├── controllers/               ← Business logic
└── models/                    ← Database schemas
```

---

## 🎯 File Locations Quick Map

```
Need to make API call?
└─> Go to: Frontend/src/services/api.ts

Need to add new hook?
└─> Go to: Frontend/src/hooks/use-api.ts

Need examples?
└─> Go to: Frontend/src/examples/api-implementation.example.tsx

Need help?
└─> Go to: TROUBLESHOOTING.md or QUICK_START.md

Need full docs?
└─> Go to: INDEX.md

Need to add backend endpoint?
└─> Go to: Backend/routes/
    └─> Backend/controllers/
```

---

## 🔄 Request Flow (One-liner)

Component → Hook → API Service → fetch() → Backend Route → Controller → Database → Response → Hook State → Component Update

---

## ✨ Environment Variables

**Frontend** (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`.env`)
```env
PORT=5000
URI=mongodb+srv://...
```

---

## 🎁 What Each Hook Returns

```typescript
useDebates()
├─ debates: Debate[]
├─ loading: boolean
├─ error: string | null
├─ fetchDebates: () => Promise<void>
└─ createDebate: (data) => Promise<Debate>

useArguments()
├─ arguments: Argument[]
├─ loading: boolean
├─ error: string | null
├─ fetchArguments: () => Promise<void>
└─ createArgument: (data) => Promise<Argument>

useFactChecks()
├─ factChecks: FactCheck[]
├─ loading: boolean
├─ error: string | null
├─ fetchFactChecks: () => Promise<void>
└─ createFactCheck: (data) => Promise<FactCheck>

useAnalytics()
├─ analytics: Analytics
├─ loading: boolean
├─ error: string | null
└─ fetchAnalytics: () => Promise<void>
```

---

## 📊 API Endpoints at a Glance

```
[GET]  /api/debates              Get all debates
[POST] /api/debates              Create debate
[GET]  /api/debates/:id          Get debate by ID

[POST] /api/arguments            Create argument
[GET]  /api/arguments            Get arguments

[POST] /api/factcheck            Create fact check
[GET]  /api/factcheck            Get fact checks

[GET]  /api/analytics/:id        Get analytics

[POST] /api/auth/signup          Register
[POST] /api/auth/login           Login
[POST] /api/auth/verify-otp      Verify OTP
[POST] /api/auth/forgetpassowrd  Forgot password
[POST] /api/auth/changepassword  Change password
```

---

## 🚨 Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| Cannot GET /api/debates | Route not found | Check Backend routes/ |
| CORS error | Backend not allowing request | Restart backend |
| Cannot find module | Module not installed | npm install |
| VITE_API_URL undefined | Env var not loaded | Restart npm run dev |
| Cannot read property 'map' | Data is undefined/null | Check hook returns data |
| MongoDB connection error | Connection string wrong | Check .env URI |

---

## ✅ Pre-Flight Checklist

Before starting development:

- [ ] `npm install` run in both folders
- [ ] `.env` files exist and configured
- [ ] Backend `npm run dev` running (no errors)
- [ ] Frontend `npm run dev` running (no errors)
- [ ] Can open `http://localhost:5173` in browser
- [ ] Browser console has no errors
- [ ] Can fetch `http://localhost:5000/api/debates`

---

## 💾 Save These URLs

```
Backend:   http://localhost:5000
Frontend:  http://localhost:5173
API:       http://localhost:5000/api
Docs:      See INDEX.md or README.md
```

---

## 🎓 Learn More

| Topic | File |
|-------|------|
| Setup | QUICK_START.md |
| Architecture | ARCHITECTURE_DIAGRAMS.md |
| All Endpoints | API_INTEGRATION_GUIDE.md |
| Implementation | IMPLEMENTATION_CHECKLIST.md |
| Errors | TROUBLESHOOTING.md |
| Examples | Frontend/src/examples/api-implementation.example.tsx |

---

## 🚀 One-Command Start

```bash
# Terminal 1
cd Backend && npm run dev

# Terminal 2
cd Frontend && npm run dev

# Browser
http://localhost:5173
```

---

**Print this, bookmark it, keep it handy!** 📌

For complete docs: Open **INDEX.md** or **README.md**
