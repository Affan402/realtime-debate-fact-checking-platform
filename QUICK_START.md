# Quick Start Guide - Backend & Frontend Connection

## 📋 Prerequisites
- Node.js installed (v14 or higher)
- MongoDB setup (already configured in `.env`)
- Two terminal windows ready

---

## 🚀 Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:5000
Database Successfully Connected
```

**Backend is now ready at:** `http://localhost:5000`

---

## 🚀 Step 2: Start the Frontend Development Server

```bash
# In a NEW terminal, navigate to frontend directory
cd Frontend

# Install dependencies  
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Frontend is now running at:** `http://localhost:5173`

---

## ✅ Verify Connection

### Check Backend Status
Open browser and visit: `http://localhost:5000/api/debates`
- Should show JSON response or empty array

### Check Frontend Status
Open browser and visit: `http://localhost:5173`
- Frontend loads successfully
- Check browser console (F12 → Console) for any errors

---

## 📝 API Configuration

**Frontend uses these endpoints automatically:**

```
http://localhost:5000/api/debates        → Get/Create debates
http://localhost:5000/api/arguments      → Get/Create arguments
http://localhost:5000/api/factcheck      → Get/Create fact checks
http://localhost:5000/api/analytics/:id  → Get analytics
http://localhost:5000/api/auth/*         → Authentication
```

**Configuration files:**
- Frontend: `.env` (VITE_API_URL=http://localhost:5000/api)
- Backend: `.env` (PORT=5000)

---

## 🔧 Testing API Connection

### Option 1: Browser Console
```javascript
// In browser console (F12 → Console):
fetch('http://localhost:5000/api/debates')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Option 2: Using cURL (Terminal)
```bash
curl http://localhost:5000/api/debates
```

### Option 3: Using the Frontend
Navigate to any page that calls the API and check console for responses.

---

## 🎯 Common Issues & Solutions

### ❌ "Cannot reach http://localhost:5000"
- ✓ Ensure Backend server is running (`npm run dev` in Backend folder)
- ✓ Check if port 5000 is in use: `netstat -an | find "5000"` (Windows)

### ❌ "CORS error"
- ✓ Backend CORS is enabled in `app.js`
- ✓ Make sure FRONTEND_URL is set in Backend `.env`

### ❌ "Database connection failed"
- ✓ Check MongoDB URI in Backend `.env`
- ✓ Ensure MongoDB is running and accessible

### ❌ "Cannot find modules"
- ✓ Run `npm install` in both Backend and Frontend directories

---

## 📱 Using the API in Components

### Example: Fetch Debates

```typescript
// Frontend/src/pages/DebatesPage.tsx
import { useDebates } from '@/hooks/use-api';
import { useEffect } from 'react';

export default function DebatesPage() {
  const { debates, loading, error, fetchDebates } = useDebates();

  useEffect(() => {
    fetchDebates(); // Calls: GET /api/debates
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {debates.map(debate => (
        <div key={debate._id}>{debate.topic}</div>
      ))}
    </div>
  );
}
```

### Example: Create Debate

```typescript
const { createDebate } = useDebates();

const handleCreate = async () => {
  try {
    const newDebate = await createDebate({
      topic: "AI Ethics",
      description: "Should AI be regulated?"
    }); // Calls: POST /api/debates
    console.log("Created:", newDebate);
  } catch (error) {
    console.error("Failed:", error);
  }
};
```

---

## 🔐 Authentication

To add authentication to API calls:

```typescript
// After login, store token:
localStorage.setItem('authToken', loginResponse.token);

// Token is automatically added to all API requests
// Remove token on logout:
localStorage.removeItem('authToken');
```

---

## 📦 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🛠️ Useful Commands

```bash
# Terminal 1: Backend
cd Backend && npm run dev

# Terminal 2: Frontend  
cd Frontend && npm run dev

# Build frontend for production
cd Frontend && npm run build

# View build output
npm run preview
```

---

## 📚 More Information

- **Full API Documentation:** See `API_INTEGRATION_GUIDE.md`
- **API Service:** `Frontend/src/services/api.ts`
- **Custom Hooks:** `Frontend/src/hooks/use-api.ts`
- **Backend Routes:** `Backend/routes/*.js`

---

## ✨ You're All Set!

Both backend and frontend are now connected. Navigate to `http://localhost:5173` and start using the application!

**Need help?** Check the browser console (F12) for any API errors or check the terminal output.
