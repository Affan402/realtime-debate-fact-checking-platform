# Troubleshooting Guide

## 🔍 Diagnostics

### Check Backend Server Status
```bash
# Is the backend running?
curl http://localhost:5000

# Check if port 5000 is in use
netstat -an | find ":5000"  # Windows
lsof -i :5000              # Mac/Linux

# Check backend logs
# Look at terminal where you ran: npm run dev
```

### Check Frontend Build
```bash
# Check if all dependencies installed
npm list react
npm list axios

# Check for TypeScript errors
npm run build

# Check if env variables are loaded
console.log(import.meta.env.VITE_API_URL)  # In browser console
```

---

## ❌ Common Errors & Solutions

### 1. "Cannot GET /api/debates" (404 Error)

**Problem**: Backend route not found

**Solutions**:
```bash
# 1. Verify route exists in backend
# Check: Backend/routes/debate.routes.js
# Should have: router.get("/", getDebates)

# 2. Verify route is registered in server.js
# Check: Backend/server.js
# Should have: app.use("/api/debates", DebateRoutes)

# 3. Restart backend server
cd Backend
npm run dev
```

---

### 2. "CORS Error: Access denied"

**Problem**: Cross-Origin Resource Sharing blocked

**Solutions**:
```bash
# 1. Check CORS is enabled in Backend/app.js
# Should have: app.use(cors());

# 2. Check Frontend URL in Backend/.env
# Should have: FRONTEND_URL=http://localhost:5173

# 3. Restart backend
npm run dev

# 4. Clear browser cache
# Press: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
```

---

### 3. "Cannot find module '@/services/api'"

**Problem**: Import path alias not configured

**Solutions**:
```bash
# 1. Check Frontend/vite.config.ts
# Should have:
# resolve: {
#   alias: {
#     "@": path.resolve(__dirname, "./"),
#   },
# }

# 2. Check Frontend/tsconfig.json
# Should have:
# "compilerOptions": {
#   "baseUrl": ".",
#   "paths": {
#     "@/*": ["./*"]
#   }
# }

# 3. Restart dev server
npm run dev
```

---

### 4. "Expected token after data" (JSON parse error)

**Problem**: Backend not returning valid JSON

**Solutions**:
```bash
# 1. Check backend route returns JSON
# Should have: res.json({ ... })
# NOT: res.send("string")

# 2. Test with cURL
curl http://localhost:5000/api/debates

# 3. Check backend console for errors
# Look at terminal where npm run dev is running

# 4. Verify controller is returning data
# Check: Backend/controllers/debate.controller.js
```

---

### 5. "Cannot read property 'debates' of undefined"

**Problem**: API response doesn't match expected structure

**Solutions**:
```typescript
// Check what API actually returns
const response = await fetch('http://localhost:5000/api/debates');
const data = await response.json();
console.log(data); // See actual response structure

// Update code to match response structure
// Option 1: API returns array directly
const debates = data; // if response is: [...]

// Option 2: API returns object with debates property
const debates = data.debates; // if response is: { debates: [...] }

// Option 3: API returns with success flag
const debates = data.data; // if response is: { success: true, data: [...] }
```

---

### 6. "TypeError: Cannot read property 'map' of undefined"

**Problem**: Trying to map over undefined or null

**Solutions**:
```typescript
// ❌ WRONG:
{debates.map(...)}

// ✅ CORRECT:
{debates && debates.length > 0 && debates.map(...)}

// ✅ BETTER:
{Array.isArray(debates) && debates.map(...)}

// ✅ BEST (with hook):
const { debates = [] } = useDebates(); // Default to empty array
{debates.map(...)} // Safe!
```

---

### 7. "ReferenceError: VITE_API_URL is not defined"

**Problem**: Environment variable not loaded

**Solutions**:
```bash
# 1. Check Frontend/.env file exists
ls -la Frontend/.env  # Mac/Linux
dir Frontend\.env     # Windows

# 2. File should contain:
VITE_API_URL=http://localhost:5000/api

# 3. Restart dev server (must be running when .env changes)
npm run dev

# 4. Clear browser cache
# Press: Ctrl+F5 (hard refresh)

# 5. In code, use correct access method:
const url = import.meta.env.VITE_API_URL; // ✅ Correct
const url = process.env.VITE_API_URL;     // ❌ Wrong
```

---

### 8. "MongoError: Authentication failed"

**Problem**: MongoDB connection failed

**Solutions**:
```bash
# 1. Check MongoDB URI in Backend/.env
# Should be: mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0

# 2. Verify credentials are correct
# Check MongoDB Atlas website for correct URI

# 3. Verify IP whitelist in MongoDB Atlas
# Go to: Network Access → Add IP Address → 0.0.0.0 (for dev)

# 4. Test connection
mongo "your_connection_string"

# 5. Check MongoDB is accessible
ping cluster0.mongodb.net

# 6. Restart backend
npm run dev
```

---

### 9. "EADDRINUSE: address already in use :::5000"

**Problem**: Port 5000 is already in use

**Solutions**:
```bash
# Windows:
# 1. Find process using port 5000
netstat -ano | findstr :5000
# Output: PID 12345

# 2. Kill process
taskkill /PID 12345 /F

# Mac/Linux:
# 1. Find process using port 5000
lsof -i :5000
# Output: PID 12345

# 2. Kill process
kill -9 12345

# 3. Or change port in Backend/.env
PORT=5001

# 4. Update Frontend/.env
VITE_API_URL=http://localhost:5001/api
```

---

### 10. "Cannot POST to /api/debates" (405 Error)

**Problem**: Route method not allowed

**Solutions**:
```bash
# Check route is defined as POST
# Backend/routes/debate.routes.js should have:
# router.post("/", createDebate);

# Check frontend is using POST method
// Should be:
fetch('...', { method: 'POST', ... })

# Test with cURL
curl -X POST http://localhost:5000/api/debates \
  -H "Content-Type: application/json" \
  -d '{"topic":"test"}'
```

---

## 🧪 Testing Procedures

### Test 1: Backend Connectivity

```bash
# Terminal 1: Start backend
cd Backend
npm run dev

# Terminal 2: Test connection
curl http://localhost:5000/api/debates

# Expected: Empty array or debate list
# { debates: [...] } or [{...}] or error message
```

### Test 2: Frontend Connectivity

```bash
# In browser console (F12 → Console):
fetch('http://localhost:5000/api/debates')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));

# Should log response data
```

### Test 3: Authentication

```bash
# In browser console:
localStorage.setItem('authToken', 'test-token');

fetch('http://localhost:5000/api/debates', {
  headers: {
    'Authorization': 'Bearer test-token'
  }
}).then(r => r.json()).then(d => console.log(d));
```

### Test 4: Form Submission

```bash
# In browser console:
fetch('http://localhost:5000/api/debates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'Test Debate',
    description: 'Test Description'
  })
}).then(r => r.json()).then(d => console.log(d));
```

---

## 📊 Debugging Tools

### Browser DevTools (F12)

1. **Console Tab**
   - Check for JavaScript errors
   - Manual API testing

2. **Network Tab**
   - See all HTTP requests
   - Check request/response bodies
   - Check status codes

3. **Application Tab**
   - Check localStorage (authToken)
   - Check cookies
   - Check environment variables

### Backend Debugging

```bash
# Add console.log to Backend
// Backend/controllers/debate.controller.js
export const createDebate = async (req, res) => {
  console.log('Request body:', req.body); // Debug
  console.log('Headers:', req.headers);   // Debug
  // ... rest of code
};

# See output in terminal where npm run dev is running
```

### Network Monitoring

```bash
# Check all network activity
curl -v http://localhost:5000/api/debates
# Shows: headers, response code, response body

# Pretty print JSON
curl http://localhost:5000/api/debates | python -m json.tool
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Backend `.env` has PORT=5000
- [ ] Backend `.env` has valid MongoDB URI
- [ ] Frontend `.env` has VITE_API_URL=http://localhost:5000/api
- [ ] All npm packages installed (`npm install` in both folders)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Can reach http://localhost:5173 in browser
- [ ] Can reach http://localhost:5000/api/debates in browser
- [ ] Browser console has no errors
- [ ] API service file exists: `Frontend/src/services/api.ts`
- [ ] Custom hooks file exists: `Frontend/src/hooks/use-api.ts`
- [ ] Backend routes defined in `Backend/routes/*.js`
- [ ] Controllers implemented in `Backend/controllers/*.js`

---

## 🆘 Advanced Debugging

### Enable Verbose Logging

**Backend**:
```javascript
// Add to Backend/server.js
import morgan from 'morgan';
app.use(morgan('dev')); // HTTP request logging
```

**Frontend**:
```typescript
// Add to Frontend/src/services/api.ts
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  console.log('API Request:', endpoint, options); // Add this
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  console.log('API Response:', response.status, response); // Add this
  return await response.json();
}
```

### Monitor Network Activity

```bash
# On Mac/Linux: Monitor all connections
netstat -tlnp | grep -E ':5000|:5173'

# On Windows: Monitor all connections
netstat -ano | findstr -E ":5000|:5173"
```

### Check Database Directly

```bash
# Connect to MongoDB
mongo "your_connection_string"

# List databases
show dbs

# Use your database
use your_database_name

# Check collections
show collections

# Find debates
db.debates.find()

# Check documents
db.debates.findOne()
```

---

## 🚨 When All Else Fails

1. **Hard Reset Frontend**
   ```bash
   cd Frontend
   rm -rf node_modules pnpm-lock.yaml  # Mac/Linux
   rmdir /s node_modules & del pnpm-lock.yaml  # Windows
   npm install
   npm run dev
   ```

2. **Hard Reset Backend**
   ```bash
   cd Backend
   rm -rf node_modules package-lock.json  # Mac/Linux
   rmdir /s node_modules & del package-lock.json  # Windows
   npm install
   npm run dev
   ```

3. **Clear Cache**
   - Browser cache: Ctrl+F5
   - npm cache: `npm cache clean --force`
   - MongoDB: Drop and recreate database

4. **Port Issues**
   - Change PORT in `.env`
   - Update VITE_API_URL in Frontend `.env`
   - Restart all servers

5. **MongoDB Issues**
   - Verify connection string
   - Check IP whitelist
   - Create new user in MongoDB Atlas
   - Drop existing database and recreate

---

## 📞 Getting Help

When asking for help, provide:

1. **Error message** (screenshot if possible)
2. **Terminal output** (from npm run dev)
3. **Browser console errors** (F12 → Console)
4. **Network request details** (F12 → Network tab)
5. **Steps to reproduce** (what were you doing when error happened)
6. **Environment** (Windows/Mac/Linux, Node version, npm version)

---

## 💡 Pro Tips

1. **Use VSCode REST Client extension**
   - Create `.http` file for API testing
   - No need to use cURL

2. **Use Postman**
   - Professional API testing tool
   - Create requests and save them

3. **Enable Hot Reload**
   - Changes in code auto-reload
   - Both frontend and backend support this

4. **Use React DevTools**
   - Chrome extension for React debugging
   - View component state and props

5. **Use Redux DevTools**
   - If using Redux for state management
   - Time-travel debugging

---

**Still stuck? Check the documentation files:**
- `QUICK_START.md` - Quick setup
- `API_INTEGRATION_GUIDE.md` - Full API reference
- `ARCHITECTURE_DIAGRAMS.md` - Data flow diagrams
- `IMPLEMENTATION_CHECKLIST.md` - Implementation guide

Good luck! 🚀
