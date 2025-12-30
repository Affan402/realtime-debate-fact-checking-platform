# Backend & Frontend Connection - Setup Summary

## ✅ What Has Been Done

### 1. **API Service Layer Created** ✓
**File**: `Frontend/src/services/api.ts`
- Centralized API communication service
- Automatic handling of:
  - Base URL construction (`http://localhost:5000/api`)
  - Headers (Content-Type, Authorization)
  - Authentication tokens from localStorage
  - Error handling and logging
  - JSON serialization/deserialization

**Available API Functions:**
- `debateAPI.createDebate()` - POST /api/debates
- `debateAPI.getDebates()` - GET /api/debates
- `debateAPI.getDebateById()` - GET /api/debates/:id
- `argumentAPI.createArgument()` - POST /api/arguments
- `argumentAPI.getArgumentsByDebate()` - GET /api/arguments
- `factCheckAPI.createFactCheck()` - POST /api/factcheck
- `factCheckAPI.getFactChecks()` - GET /api/factcheck
- `analyticsAPI.getAnalytics()` - GET /api/analytics/:id
- `authAPI.signup/login/verifyOTP/etc()` - POST /api/auth/*

---

### 2. **Custom React Hooks Created** ✓
**File**: `Frontend/src/hooks/use-api.ts`
- `useDebates()` - Manage debates with loading/error states
- `useArguments()` - Manage arguments with loading/error states
- `useFactChecks()` - Manage fact checks with loading/error states
- `useAnalytics()` - Fetch and manage analytics data

Each hook includes:
- Loading state management
- Error state management
- Fetch functions
- Create functions

---

### 3. **Environment Configuration Updated** ✓
**Frontend**: `Frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

**Backend**: `Backend/.env`
```env
PORT=5000
URI=mongodb+srv://... (already configured)
FRONTEND_URL=http://localhost:5173
```

---

### 4. **Vite Proxy Configuration Added** ✓
**File**: `Frontend/vite.config.ts`
- Added development proxy for `/api` routes
- Automatically forwards API requests to `http://localhost:5000`
- Prevents CORS issues during development

---

### 5. **Example Implementation Created** ✓
**File**: `Frontend/src/examples/api-implementation.example.tsx`
- Example: DebatesListExample - Fetch and display debates
- Example: CreateDebateExample - Form submission
- Example: DebateDetailExample - Complex data fetching
- Example: AddArgumentExample - Nested API calls
- Example: APIErrorBoundary - Error handling wrapper
- Copy-paste ready code for your components

---

### 6. **Comprehensive Documentation Created** ✓
**File**: `API_INTEGRATION_GUIDE.md`
- Complete API endpoint reference
- Backend configuration details
- Frontend integration instructions
- WebSocket/Socket.IO information
- Testing methods
- File structure overview

**File**: `QUICK_START.md`
- Step-by-step server startup
- Connection verification
- API testing methods
- Common issues and solutions
- Example code snippets
- Authentication setup

---

## 🚀 How to Use

### Running the Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm install  # Only needed first time
npm run dev
```
Expected output: `Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install  # Only needed first time
npm run dev
```
Expected output: `Local: http://localhost:5173`

---

### Using the API in Components

#### Method 1: Using Custom Hooks (Recommended)
```typescript
import { useDebates } from '@/hooks/use-api';

export function MyComponent() {
  const { debates, loading, error, fetchDebates } = useDebates();

  useEffect(() => {
    fetchDebates(); // Calls GET /api/debates
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{debates.length} debates</div>;
}
```

#### Method 2: Using API Service Directly
```typescript
import { debateAPI } from '@/services/api';

async function handleCreateDebate() {
  const debate = await debateAPI.createDebate({
    topic: "AI Ethics",
    description: "..."
  });
  console.log(debate);
}
```

---

## 📋 API Endpoints Reference

### Base URL: `http://localhost:5000/api`

| Feature | Method | Endpoint | Function |
|---------|--------|----------|----------|
| **Debates** | GET | `/debates` | `debateAPI.getDebates()` |
| | POST | `/debates` | `debateAPI.createDebate()` |
| | GET | `/debates/:id` | `debateAPI.getDebateById()` |
| **Arguments** | POST | `/arguments` | `argumentAPI.createArgument()` |
| | GET | `/arguments` | `argumentAPI.getArgumentsByDebate()` |
| **Fact Check** | POST | `/factcheck` | `factCheckAPI.createFactCheck()` |
| | GET | `/factcheck` | `factCheckAPI.getFactChecks()` |
| **Analytics** | GET | `/analytics/:id` | `analyticsAPI.getAnalytics()` |
| **Auth** | POST | `/auth/signup` | `authAPI.signup()` |
| | POST | `/auth/login` | `authAPI.login()` |
| | POST | `/auth/verify-otp` | `authAPI.verifyOTP()` |

---

## 🔐 Authentication

Store token after login:
```typescript
localStorage.setItem('authToken', response.token);
```

Token is automatically included in all API requests. Remove on logout:
```typescript
localStorage.removeItem('authToken');
```

---

## ✅ Verification Checklist

- [ ] Backend `.env` has correct PORT and URI
- [ ] Frontend `.env` has correct VITE_API_URL
- [ ] Both `npm install` completed without errors
- [ ] Backend server started with `npm run dev`
- [ ] Frontend server started with `npm run dev`
- [ ] Can access `http://localhost:5173` in browser
- [ ] Browser console shows no CORS errors
- [ ] API calls return data successfully

---

## 📁 New Files Created

```
Frontend/
├── src/
│   ├── services/
│   │   └── api.ts                          ← API service layer
│   ├── hooks/
│   │   └── use-api.ts                      ← Custom React hooks
│   └── examples/
│       └── api-implementation.example.tsx  ← Implementation examples
├── .env.local                               ← Updated env config
└── vite.config.ts                           ← Updated with proxy

Root/
├── API_INTEGRATION_GUIDE.md                ← Full documentation
└── QUICK_START.md                           ← Quick reference
```

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
1. Check if backend is running: `npm run dev` in Backend folder
2. Check if port 5000 is available
3. Verify MongoDB URI in Backend `.env`

### "CORS error"
1. Backend CORS is enabled in `app.js`
2. Check FRONTEND_URL in Backend `.env` (should be http://localhost:5173)
3. Restart backend server

### "API returns 404"
1. Verify endpoint path is correct (see API Endpoints table above)
2. Check that the route file exists in `Backend/routes/`
3. Verify controller exists in `Backend/controllers/`

### "Module not found errors"
1. Run `npm install` in both Backend and Frontend
2. Check if import paths use correct aliases (`@` in Frontend)
3. Verify file extensions are `.ts` or `.tsx` in Frontend

---

## 🎯 Next Steps

1. **Test the Connection**: Follow the QUICK_START guide
2. **Implement Components**: Use the example implementations in `api-implementation.example.tsx`
3. **Add Error Handling**: Wrap components with `APIErrorBoundary`
4. **Implement Authentication**: Use `authAPI` functions
5. **Connect Pages**: Update your page components to use the hooks
6. **Add WebSocket**: For real-time features, see `Backend/config/socket.js`

---

## 📞 Support

- Check `API_INTEGRATION_GUIDE.md` for detailed documentation
- Check `QUICK_START.md` for common issues
- Review example implementations in `api-implementation.example.tsx`
- Check browser console (F12) for error messages
- Check terminal output for backend logs

---

## ✨ Summary

Your Backend and Frontend are now fully connected and ready to use!

**Backend URL**: `http://localhost:5000`  
**Frontend URL**: `http://localhost:5173`  
**API Base**: `http://localhost:5000/api`

Both services are configured, documented, and include example implementations. Happy coding! 🚀
