# API Integration Guide - Debate Platform

## Overview
This guide explains how the frontend and backend are connected through REST API endpoints.

## Backend Server Information

### Server Details
- **Host**: localhost
- **Port**: 5000 (from `.env` - PORT=5000)
- **Base URL**: `http://localhost:5000`
- **API Base Path**: `http://localhost:5000/api`

### Key Configurations
- **Database**: MongoDB (URI in `.env`)
- **CORS**: Enabled on backend (see `app.js`)
- **Frontend URL**: http://localhost:5173 (configured in `.env`)

---

## API Endpoints Structure

### 1. Authentication Routes
**Base Path**: `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | User login |
| POST | `/verify-otp` | Verify OTP |
| POST | `/reset-otp` | Reset OTP |
| POST | `/forgetpassowrd` | Forgot password |
| POST | `/changepassword` | Change password |

**Rate Limiting**: 100 requests per 15 minutes per IP

### 2. Debates Routes
**Base Path**: `/api/debates`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new debate |
| GET | `/` | Get all debates |
| GET | `/:id` | Get specific debate |

### 3. Arguments Routes
**Base Path**: `/api/arguments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create argument |
| GET | `/` | Get arguments |

### 4. Fact Check Routes
**Base Path**: `/api/factcheck`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create fact check |
| GET | `/` | Get fact checks |

### 5. Analytics Routes
**Base Path**: `/api/analytics`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:id` | Get analytics for debate |

---

## Frontend Integration

### Environment Configuration

**File**: `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### API Service Layer

**File**: `Frontend/src/services/api.ts`

This service provides centralized API communication:

```typescript
// Automatically handles:
// - Base URL construction
// - Headers (Content-Type, Authorization)
// - Auth token from localStorage
// - Error handling and logging
// - JSON serialization/deserialization
```

#### Usage Examples:

```typescript
import { debateAPI, argumentAPI } from '@/services/api';

// Create a debate
const debate = await debateAPI.createDebate({
  topic: "Should AI be regulated?",
  description: "...",
});

// Get all debates
const debates = await debateAPI.getDebates();

// Create an argument
const arg = await argumentAPI.createArgument({
  debateId: "...",
  content: "My argument is...",
});
```

### Custom Hooks

**File**: `Frontend/src/hooks/use-api.ts`

Provides React hooks for API operations with built-in loading and error handling:

```typescript
// In a React component:
import { useDebates, useArguments } from '@/hooks/use-api';

function MyComponent() {
  const { debates, loading, error, fetchDebates } = useDebates();
  
  useEffect(() => {
    fetchDebates();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* render debates */}</div>;
}
```

---

## How to Run

### 1. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port)

### 3. API Communication
The frontend will automatically:
- Connect to `http://localhost:5000/api`
- Include authentication tokens if available
- Handle CORS requests (enabled on backend)
- Manage errors gracefully

---

## Real-time Features

### WebSocket Configuration
**File**: `Backend/config/socket.js`

Socket.IO is configured for:
- Live debate updates
- Real-time fact-checking
- Audience reactions
- Live chat/comments

**Usage in Frontend**: 
```typescript
// Connect to WebSocket
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
socket.on('debate:updated', (data) => {
  // Handle live updates
});
```

---

## Testing the API Connection

### Manual Testing with cURL:

```bash
# Get all debates
curl http://localhost:5000/api/debates

# Create a debate
curl -X POST http://localhost:5000/api/debates \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","description":"Test debate"}'

# Get analytics
curl http://localhost:5000/api/analytics/debate-id-here
```

### Using Frontend Hooks:

See the examples in `Frontend/src/hooks/use-api.ts` for practical React component usage.

---

## Important Notes

1. **Authentication Token**: 
   - Token is stored in `localStorage` with key `authToken`
   - Automatically attached to all API requests
   - Set token after login: `localStorage.setItem('authToken', token)`

2. **CORS**: Enabled on backend for frontend domain
   - Configured in `Backend/app.js`
   - Set `FRONTEND_URL` in `.env` for production

3. **Error Handling**: 
   - All API calls should handle errors
   - Check the `error` state in hooks
   - Errors are logged to console

4. **Rate Limiting**: 
   - Auth endpoints limited to 100 requests per 15 minutes
   - If exceeded, server returns 429 status

---

## File Structure

```
Frontend/
├── .env                          # Environment configuration
├── src/
│   ├── services/
│   │   └── api.ts               # API service layer
│   ├── hooks/
│   │   ├── use-api.ts           # Custom API hooks
│   │   └── ...
│   └── ...
└── ...

Backend/
├── .env                          # Backend configuration
├── server.js                     # Server setup
├── app.js                        # Express app
├── routes/                       # API endpoints
│   ├── Authroute.js
│   ├── debate.routes.js
│   ├── argument.routes.js
│   ├── factcheck.routes.js
│   └── analytics.routes.js
└── ...
```

---

## Next Steps

1. Verify both servers are running
2. Check browser console for any API errors
3. Use React Developer Tools to verify state updates
4. Test endpoints individually with cURL first
5. Implement proper error boundaries in React components
