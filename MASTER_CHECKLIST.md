# ✅ Master Setup & Implementation Checklist

Use this checklist to ensure everything is properly set up and working!

---

## 🔧 SETUP PHASE (Do this first!)

### Prerequisites
- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] MongoDB is accessible (check .env URI)
- [ ] Text editor/IDE is open

### Clone/Download Check
- [ ] Backend folder exists with all files
- [ ] Frontend folder exists with all files
- [ ] All .env files present
- [ ] package.json files present

### Installation
- [ ] Run `npm install` in Backend folder
- [ ] Run `npm install` in Frontend folder
- [ ] No installation errors
- [ ] node_modules folders created

### Configuration Verification
- [ ] Backend/.env has PORT=5000
- [ ] Backend/.env has valid MongoDB URI
- [ ] Backend/.env has FRONTEND_URL=http://localhost:5173
- [ ] Frontend/.env has VITE_API_URL=http://localhost:5000/api
- [ ] Frontend/.env.local exists (optional but recommended)

### New Files Verification
- [ ] Frontend/src/services/api.ts exists
- [ ] Frontend/src/hooks/use-api.ts exists
- [ ] Frontend/src/examples/api-implementation.example.tsx exists
- [ ] vite.config.ts has proxy configuration

---

## 🚀 STARTUP PHASE

### Terminal 1: Backend Setup
- [ ] Open a new terminal/PowerShell
- [ ] Navigate to Backend folder: `cd Backend`
- [ ] Run: `npm run dev`
- [ ] See message: "Server running on http://localhost:5000"
- [ ] See message: "Database Successfully Connected"
- [ ] No errors in terminal

### Terminal 2: Frontend Setup
- [ ] Open a new terminal/PowerShell
- [ ] Navigate to Frontend folder: `cd Frontend`
- [ ] Run: `npm run dev`
- [ ] See message: "Local: http://localhost:5173/"
- [ ] No errors in terminal

### Browser Connection
- [ ] Open browser (Chrome, Firefox, Edge, etc.)
- [ ] Navigate to: http://localhost:5173
- [ ] Page loads (should see your app)
- [ ] No white/blank page

### Browser Console Check (Press F12)
- [ ] Console tab opens
- [ ] No red error messages
- [ ] Check for warnings (can be ignored)

### API Connection Test
- [ ] In browser console, paste:
  ```javascript
  fetch('http://localhost:5000/api/debates')
    .then(r => r.json())
    .then(d => console.log(d))
  ```
- [ ] See response in console (array or object)
- [ ] Not 404 or connection error

---

## 📁 FILE LOCATION VERIFICATION

### Frontend Structure
- [ ] Frontend/src/services/api.ts exists and contains:
  - [ ] `apiRequest()` function
  - [ ] `debateAPI` object
  - [ ] `argumentAPI` object
  - [ ] `factCheckAPI` object
  - [ ] `analyticsAPI` object
  - [ ] `authAPI` object

- [ ] Frontend/src/hooks/use-api.ts exists and contains:
  - [ ] `useDebates()` hook
  - [ ] `useArguments()` hook
  - [ ] `useFactChecks()` hook
  - [ ] `useAnalytics()` hook

- [ ] Frontend/src/examples/api-implementation.example.tsx exists and contains:
  - [ ] `DebatesListExample` component
  - [ ] `CreateDebateExample` component
  - [ ] `DebateDetailExample` component
  - [ ] `APIErrorBoundary` component

### Configuration Files
- [ ] Frontend/.env contains VITE_API_URL
- [ ] Frontend/vite.config.ts has proxy config
- [ ] Backend/.env properly configured

---

## 🔌 CONNECTION TESTS

### Test 1: Basic Connectivity
- [ ] Can reach http://localhost:5000 in browser
- [ ] Can reach http://localhost:5173 in browser
- [ ] Can reach http://localhost:5000/api/debates in browser
- [ ] No CORS errors in console

### Test 2: GET Request (Fetch)
```javascript
// Paste in browser console:
fetch('http://localhost:5000/api/debates')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```
- [ ] Request succeeds
- [ ] Sees response data
- [ ] No network errors

### Test 3: POST Request (Create)
```javascript
// Paste in browser console:
fetch('http://localhost:5000/api/debates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'Test Debate',
    description: 'Test Description'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```
- [ ] Request succeeds
- [ ] Sees created object with ID
- [ ] No validation errors

### Test 4: Environment Variables
```javascript
// Paste in browser console:
console.log(import.meta.env.VITE_API_URL)
```
- [ ] Shows: http://localhost:5000/api
- [ ] Not: undefined

---

## 💻 IMPLEMENTATION READINESS

### Component Setup
- [ ] Created a simple test component
- [ ] Component can import from src/ folder
- [ ] No TypeScript errors

### Hook Usage
- [ ] Can import hooks: `import { useDebates } from '@/hooks/use-api'`
- [ ] No module not found errors
- [ ] IDE shows autocomplete for hooks

### API Calls
- [ ] Can call `debateAPI.getDebates()`
- [ ] Can call `debateAPI.createDebate(data)`
- [ ] IDE shows function signatures
- [ ] No TypeScript type errors

### State Management
- [ ] Created component with useState
- [ ] Component renders without errors
- [ ] Can update state
- [ ] Re-renders work properly

---

## 📚 DOCUMENTATION REVIEW

### Quick Start
- [ ] Read QUICK_START.md
- [ ] Understood the startup process
- [ ] Know where to look for errors

### API Reference
- [ ] Read API_INTEGRATION_GUIDE.md
- [ ] Know all available endpoints
- [ ] Understand response format

### Architecture
- [ ] Read ARCHITECTURE_DIAGRAMS.md
- [ ] Understand request flow
- [ ] Know component hierarchy

### Examples
- [ ] Reviewed api-implementation.example.tsx
- [ ] Understand how to use hooks
- [ ] Can copy code patterns

### Troubleshooting
- [ ] Know where TROUBLESHOOTING.md is
- [ ] Know how to check browser console
- [ ] Know how to check backend logs

---

## 🏗️ BUILD YOUR FIRST FEATURE

### Feature: Debates List Page

#### Step 1: Create Component
- [ ] Create Frontend/src/pages/DebatesPage.tsx
- [ ] Component returns JSX
- [ ] No TypeScript errors

#### Step 2: Import Hook
- [ ] Import useDebates from hooks
- [ ] TypeScript recognizes import
- [ ] No red squiggles

#### Step 3: Use Hook
- [ ] Call: `const { debates, loading, error, fetchDebates } = useDebates();`
- [ ] No TypeScript errors
- [ ] Understand what each return value means

#### Step 4: Add useEffect
- [ ] Call fetchDebates() in useEffect
- [ ] Dependency array includes fetchDebates
- [ ] No infinite loops

#### Step 5: Render Data
- [ ] Show loading state
- [ ] Show error state
- [ ] Show debates list
- [ ] Each item has key prop

#### Step 6: Test
- [ ] Navigate to page in browser
- [ ] See loading state
- [ ] See debates load
- [ ] No console errors
- [ ] Check Network tab (F12) for API call

---

## 🔐 SECURITY CHECK

### Authentication
- [ ] Know where authToken is stored (localStorage)
- [ ] Understand token lifecycle
- [ ] Know how to implement logout

### API Security
- [ ] Token auto-added to requests
- [ ] No sensitive data in localStorage
- [ ] CORS properly configured
- [ ] Rate limiting understood

### Code Security
- [ ] No API keys in code
- [ ] No hardcoded URLs (uses .env)
- [ ] Input validation considered
- [ ] Error messages don't leak info

---

## ✨ PRODUCTION READINESS (When deployed)

### Environment Setup
- [ ] .env.production prepared (for production)
- [ ] VITE_API_URL points to production backend
- [ ] All sensitive values in env files

### Build Process
- [ ] `npm run build` succeeds
- [ ] No build errors
- [ ] `npm run preview` shows built app
- [ ] Production build size acceptable

### Deployment
- [ ] Backend deployed to server
- [ ] Frontend deployed to CDN/server
- [ ] CORS configured for production domains
- [ ] HTTPS enabled

---

## 🎯 FINAL VERIFICATION

### Before You Start Coding
Check all these boxes:

**Setup (5 boxes)**
- [ ] npm install successful in both folders
- [ ] Both servers running without errors
- [ ] Frontend loads in browser
- [ ] API connection test passes
- [ ] Browser console clean

**Imports (3 boxes)**
- [ ] Can import useHooks
- [ ] Can import API functions
- [ ] IDE provides autocomplete

**Functionality (3 boxes)**
- [ ] Can fetch data (GET request)
- [ ] Can create data (POST request)
- [ ] No TypeScript errors

**Documentation (2 boxes)**
- [ ] Know where to find help
- [ ] Know how to debug issues

---

## 📊 PROGRESS TRACKING

### Setup Progress
```
Installation:      ████████████████ 100%
Configuration:     ████████████████ 100%
Files Created:     ████████████████ 100%
Servers Running:   ⏳ In Progress
API Connected:     ⏳ Waiting
```

### Implementation Progress
```
First Component:   ⏳ To Do
API Integration:   ⏳ To Do
Full Feature:      ⏳ To Do
Production Build:  ⏳ To Do
Deployment:        ⏳ To Do
```

---

## 🆘 HELP MATRIX

| Problem | Solution | File |
|---------|----------|------|
| Can't start backend | Check port 5000 not in use | TROUBLESHOOTING.md |
| CORS error | Restart backend server | TROUBLESHOOTING.md |
| Module not found | Run npm install | QUICK_START.md |
| No data showing | Check API request in Network tab | TROUBLESHOOTING.md |
| TypeScript errors | Check import paths | ARCHITECTURE_DIAGRAMS.md |
| Don't understand flow | Read diagrams | ARCHITECTURE_DIAGRAMS.md |
| Need code example | Copy from api-implementation.example.tsx | - |
| Forgot endpoint | Check QUICK_REFERENCE.md | QUICK_REFERENCE.md |

---

## 📋 DAILY CHECKLIST (Before Coding)

Every time you start coding:

- [ ] Terminal 1: Backend running (`npm run dev`)
- [ ] Terminal 2: Frontend running (`npm run dev`)
- [ ] Browser open: http://localhost:5173
- [ ] DevTools open: F12
- [ ] Console clean: No red errors
- [ ] Ready to code!

---

## 🎓 LEARNING OBJECTIVES (What You Should Know)

After completing setup:

- [ ] Understand how frontend connects to backend
- [ ] Know where API endpoints are defined
- [ ] Can import and use custom hooks
- [ ] Understand loading/error states
- [ ] Can debug API calls using browser
- [ ] Know where to find code examples
- [ ] Understand folder structure
- [ ] Can identify common errors

---

## 💚 You're Ready When...

✅ Both servers run without errors  
✅ Frontend loads in browser  
✅ Browser console is clean  
✅ API connection test passes  
✅ Can import hooks without errors  
✅ Can use IDE autocomplete  
✅ Know where to find help  
✅ Read documentation  

---

## 🚀 NEXT STEPS

Once this checklist is complete:

1. **Build first component** (Debate List)
   - Follow: IMPLEMENTATION_CHECKLIST.md Phase 2

2. **Add more features** (Arguments, Analytics)
   - Reference: api-implementation.example.tsx

3. **Implement authentication**
   - Use: authAPI functions

4. **Add error boundaries**
   - Copy: APIErrorBoundary component

5. **Test everything**
   - Use: Browser DevTools
   - Reference: TROUBLESHOOTING.md

---

## ✨ Congratulations!

When you check all boxes above, you are ready to build your debate platform!

**Start here:**
1. Complete setup checklist
2. Read QUICK_START.md
3. Read IMPLEMENTATION_CHECKLIST.md Phase 2
4. Build your first component
5. Test with browser DevTools

**Happy coding! 🎉**

---

**Print or bookmark this checklist! Use it every session!**
