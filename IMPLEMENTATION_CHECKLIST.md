# Implementation Checklist & Best Practices

## 🎯 Before You Start

- [ ] Read `QUICK_START.md` for server setup
- [ ] Read `API_INTEGRATION_GUIDE.md` for endpoint reference
- [ ] Verify both servers are running
- [ ] Check browser console (F12) for errors
- [ ] Review example implementations in `api-implementation.example.tsx`

---

## ✅ Implementation Phases

### Phase 1: Setup & Verification (Do First)
- [ ] Start Backend: `cd Backend && npm run dev`
- [ ] Start Frontend: `cd Frontend && npm run dev`
- [ ] Access `http://localhost:5173` in browser
- [ ] Check browser console for errors
- [ ] Test: `fetch('http://localhost:5000/api/debates').then(r => r.json())`

### Phase 2: Basic Components
- [ ] Create a "Debates List" page component
  - Use `useDebates()` hook
  - Display loading state
  - Display error state
  - Map and render debates
  
- [ ] Create a "Create Debate" form component
  - Use `createDebate()` from `useDebates()`
  - Add form validation
  - Handle loading state
  - Show success/error messages

### Phase 3: Authentication
- [ ] Create Login component
  - Use `authAPI.login()`
  - Store token in localStorage
  - Redirect on success
  
- [ ] Create Signup component
  - Use `authAPI.signup()`
  - Validate inputs
  
- [ ] Create Auth Context (optional but recommended)
  - Store current user
  - Check if user is authenticated
  - Provide logout function

### Phase 4: Advanced Features
- [ ] Create Debate Detail page
  - Use `useDebates()` for debate data
  - Use `useArguments()` for arguments
  - Use `useAnalytics()` for analytics
  
- [ ] Create Argument Form component
  - Use `createArgument()` from `useArguments()`
  - List existing arguments
  
- [ ] Create Fact Check component
  - Use `useFactChecks()` hook
  - Create and display fact checks

### Phase 5: Real-time Features (Optional)
- [ ] Setup Socket.IO connection
  - Connect to `http://localhost:5000`
  - Listen for debate updates
  - Update UI in real-time

---

## 💡 Best Practices

### 1. **Error Handling**
```typescript
// ✅ DO: Handle errors gracefully
const { data, error, loading } = useDebates();
if (error) return <ErrorMessage message={error} />;

// ❌ DON'T: Ignore errors
const { data } = useDebates();
```

### 2. **Loading States**
```typescript
// ✅ DO: Show loading state
if (loading) return <LoadingSpinner />;

// ❌ DON'T: Show nothing while loading
return <DebatesList debates={debates} />;
```

### 3. **Component Structure**
```typescript
// ✅ DO: Use custom hooks
export function DebatesPage() {
  const { debates, loading, error, fetchDebates } = useDebates();
  // Use the hook data
}

// ❌ DON'T: Make API calls directly in components
export function DebatesPage() {
  fetch('...').then(...)  // Don't do this
}
```

### 4. **Data Fetching**
```typescript
// ✅ DO: Fetch data in useEffect
useEffect(() => {
  fetchDebates();
}, []);

// ❌ DON'T: Fetch in render
return <DebatesList debates={fetchDebates()} />;
```

### 5. **Authentication Token**
```typescript
// ✅ DO: Store token after login
localStorage.setItem('authToken', response.token);

// ❌ DON'T: Pass token in URL
fetch(`/api/debates?token=${token}`);
```

### 6. **Async/Await Error Handling**
```typescript
// ✅ DO: Try-catch in async functions
try {
  const result = await createDebate(data);
} catch (error) {
  console.error('Failed:', error);
}

// ❌ DON'T: Ignore promise rejection
createDebate(data).then(...);
```

### 7. **Environment Variables**
```typescript
// ✅ DO: Use env variables
const API_URL = import.meta.env.VITE_API_URL;

// ❌ DON'T: Hardcode URLs
fetch('http://localhost:5000/api/...');
```

---

## 🔄 Common Patterns

### Pattern 1: Fetch Data on Mount
```typescript
export function MyComponent() {
  const { data, loading, error, fetchData } = useDebates();

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array = run once on mount

  return <div>{/* render data */}</div>;
}
```

### Pattern 2: Refetch on Parameter Change
```typescript
export function DebateDetail({ debateId }: { debateId: string }) {
  const { analytics, fetchAnalytics } = useAnalytics(debateId);

  useEffect(() => {
    fetchAnalytics();
  }, [debateId]); // Refetch when debateId changes

  return <div>{/* render analytics */}</div>;
}
```

### Pattern 3: Form Submission
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await createDebate(formData);
    // Success: update UI, clear form, show message
    setFormData({ ...initialState });
    showSuccessMessage('Created!');
  } catch (error) {
    // Error: show error message
    showErrorMessage(error.message);
  }
};
```

### Pattern 4: Conditional Rendering
```typescript
return (
  <>
    {loading && <LoadingSpinner />}
    {error && <ErrorAlert message={error} />}
    {!loading && !error && debates.length > 0 && (
      <DebatesList debates={debates} />
    )}
    {!loading && !error && debates.length === 0 && (
      <EmptyState message="No debates found" />
    )}
  </>
);
```

---

## 🧪 Testing Your Implementation

### Unit Test Example
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useDebates } from '@/hooks/use-api';

test('useDebates fetches data', async () => {
  const { result } = renderHook(() => useDebates());
  
  result.current.fetchDebates();
  
  await waitFor(() => {
    expect(result.current.debates.length).toBeGreaterThan(0);
  });
});
```

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import DebatesPage from './page';

test('renders debates list', async () => {
  render(<DebatesPage />);
  
  // Wait for data to load
  const debates = await screen.findByText(/debates/i);
  expect(debates).toBeInTheDocument();
});
```

---

## 📊 API Call Flow Diagram

```
Component
   ↓
   └─→ Hook (useDebates, useArguments, etc.)
       ↓
       └─→ API Service (api.ts)
           ├─→ Add Base URL
           ├─→ Add Headers
           ├─→ Add Auth Token
           └─→ fetch()
               ↓
               └─→ Backend Server
                   ↓
                   └─→ Route Handler
                       ↓
                       └─→ Controller
                           ↓
                           └─→ Database / AI Service
                               ↓
                               └─→ Response
                                   ↓
                                   └─→ Hook State Update
                                       ↓
                                       └─→ Component Re-render
```

---

## 🔐 Security Checklist

- [ ] Never store sensitive data in localStorage except auth token
- [ ] Always validate input before sending to API
- [ ] Check user authentication before sensitive operations
- [ ] Use HTTPS in production (not HTTP)
- [ ] Validate API responses before using
- [ ] Implement rate limiting on frontend (don't spam requests)
- [ ] Clear token on logout
- [ ] Implement CSRF protection if needed
- [ ] Sanitize user input to prevent XSS

---

## 🚨 Common Mistakes to Avoid

1. **Infinite Loops**
   ```typescript
   // ❌ BAD: fetchData has no dependency array
   useEffect(() => {
     fetchDebates(); // Calls infinitely!
   });
   
   // ✅ GOOD: Empty dependency array
   useEffect(() => {
     fetchDebates();
   }, []);
   ```

2. **Missing Error Handling**
   ```typescript
   // ❌ BAD: No error handling
   const debates = await debateAPI.getDebates();
   
   // ✅ GOOD: Handle errors
   try {
     const debates = await debateAPI.getDebates();
   } catch (error) {
     setError(error.message);
   }
   ```

3. **Race Conditions**
   ```typescript
   // ❌ BAD: User ID might change during fetch
   useEffect(() => {
     fetch(`/api/user/${userId}`).then(setUser);
   }, []); // Missing userId dependency!
   
   // ✅ GOOD: Include dependencies
   useEffect(() => {
     fetch(`/api/user/${userId}`).then(setUser);
   }, [userId]); // Re-fetch when userId changes
   ```

4. **Direct State Mutations**
   ```typescript
   // ❌ BAD: Mutating state directly
   debates[0].title = "New Title";
   setDebates(debates);
   
   // ✅ GOOD: Create new state
   setDebates(debates.map((d, i) => 
     i === 0 ? { ...d, title: "New Title" } : d
   ));
   ```

---

## 📚 Resources

- **API Documentation**: See `API_INTEGRATION_GUIDE.md`
- **Quick Start**: See `QUICK_START.md`
- **Examples**: See `Frontend/src/examples/api-implementation.example.tsx`
- **API Service**: See `Frontend/src/services/api.ts`
- **Custom Hooks**: See `Frontend/src/hooks/use-api.ts`

---

## ✨ You're Ready!

Follow this checklist step by step, and your application will be fully functional with proper API integration, error handling, and best practices.

**Good luck! 🚀**
