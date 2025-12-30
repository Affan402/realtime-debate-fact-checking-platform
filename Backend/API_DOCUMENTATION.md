# API Documentation

## Base URL
```
http://localhost:5000
```

---

## Authentication Routes

### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201):**
```json
{
  "message": "User Signup Successfully. Please check your email for OTP.",
  "status": true,
  "Data": {
    "_id": "1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### POST `/api/auth/login`
Login to an existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "message": "User Login Successfully",
  "status": true,
  "Data": {
    "user": {
      "_id": "1234567890",
      "username": "john_doe",
      "email": "john@example.com",
      "Isverifed": true
    },
    "token": "jwt_token_here"
  }
}
```

---

### POST `/api/auth/verify-otp`
Verify OTP sent to email.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "OTP verified successfully",
  "status": true,
  "Data": null
}
```

---

### POST `/api/auth/reset-otp`
Request a new OTP.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP Reset Successfully",
  "status": true,
  "Data": null
}
```

---

### POST `/api/auth/forgetpassowrd`
Request password reset (note: typo in endpoint).

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Please check your email",
  "status": true
}
```

---

### POST `/api/auth/changepassword`
Change password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newpassword": "new_secure_password"
}
```

**Response (200):**
```json
{
  "message": "Your password has successfully changed",
  "status": true,
  "Data": null
}
```

---

## Debate Routes

### POST `/api/debates`
Create a new debate.

**Request Body:**
```json
{
  "title": "AI Ethics",
  "topic": "Should AI be regulated?",
  "status": "active"
}
```

**Response (201):**
```json
{
  "message": "Debate created successfully",
  "status": true,
  "data": {
    "id": "1234567890",
    "_id": "1234567890",
    "title": "AI Ethics",
    "topic": "Should AI be regulated?",
    "status": "active",
    "createdAt": "2025-12-30T10:00:00.000Z",
    "updatedAt": "2025-12-30T10:00:00.000Z"
  }
}
```

---

### GET `/api/debates`
Get all debates.

**Response (200):**
```json
{
  "message": "Debates retrieved successfully",
  "status": true,
  "data": [
    {
      "id": "1234567890",
      "_id": "1234567890",
      "title": "AI Ethics",
      "topic": "Should AI be regulated?",
      "status": "active",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/debates/:id`
Get a specific debate by ID.

**Response (200):**
```json
{
  "message": "Debate retrieved successfully",
  "status": true,
  "data": {
    "id": "1234567890",
    "_id": "1234567890",
    "title": "AI Ethics",
    "topic": "Should AI be regulated?",
    "status": "active",
    "createdAt": "2025-12-30T10:00:00.000Z",
    "updatedAt": "2025-12-30T10:00:00.000Z"
  }
}
```

---

### PUT `/api/debates/:id`
Update a debate.

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "closed"
}
```

**Response (200):**
```json
{
  "message": "Debate updated successfully",
  "status": true,
  "data": {
    "id": "1234567890",
    "title": "Updated Title",
    "topic": "Should AI be regulated?",
    "status": "closed",
    "updatedAt": "2025-12-30T10:05:00.000Z"
  }
}
```

---

## Argument Routes

### POST `/api/arguments`
Create a new argument in a debate.

**Request Body:**
```json
{
  "debateId": "1234567890",
  "speakerName": "Alice",
  "claim": "AI should be regulated",
  "evidence": "Studies show risks of unregulated AI"
}
```

**Response (201):**
```json
{
  "message": "Argument created successfully",
  "status": true,
  "data": {
    "id": "9876543210",
    "debateId": "1234567890",
    "speakerName": "Alice",
    "claim": "AI should be regulated",
    "evidence": "Studies show risks of unregulated AI",
    "fallacy": "None",
    "credibilityScore": 85,
    "createdAt": "2025-12-30T10:10:00.000Z",
    "updatedAt": "2025-12-30T10:10:00.000Z"
  }
}
```

---

### GET `/api/arguments`
Get all arguments or filter by debate.

**Query Parameters:**
- `debateId` (optional): Filter by debate ID

**Response (200):**
```json
{
  "message": "Arguments retrieved successfully",
  "status": true,
  "data": [
    {
      "id": "9876543210",
      "debateId": "1234567890",
      "speakerName": "Alice",
      "claim": "AI should be regulated",
      "evidence": "Studies show risks",
      "fallacy": "None",
      "credibilityScore": 85,
      "createdAt": "2025-12-30T10:10:00.000Z"
    }
  ]
}
```

**Example Request:**
```
GET http://localhost:5000/api/arguments?debateId=1234567890
```

---

### GET `/api/arguments/:id`
Get a specific argument by ID.

**Response (200):**
```json
{
  "message": "Argument retrieved successfully",
  "status": true,
  "data": {
    "id": "9876543210",
    "debateId": "1234567890",
    "speakerName": "Alice",
    "claim": "AI should be regulated",
    "evidence": "Studies show risks",
    "fallacy": "None",
    "credibilityScore": 85
  }
}
```

---

## Fact Check Routes

### POST `/api/factcheck`
Create a fact check for an argument.

**Request Body:**
```json
{
  "argumentId": "9876543210",
  "verified": true,
  "confidence": 95,
  "reason": "Verified through official sources"
}
```

**Response (201):**
```json
{
  "message": "Fact check created successfully",
  "status": true,
  "data": {
    "id": "5555555555",
    "argumentId": "9876543210",
    "verified": true,
    "confidence": 95,
    "reason": "Verified through official sources",
    "createdAt": "2025-12-30T10:15:00.000Z"
  }
}
```

---

### GET `/api/factcheck`
Get all fact checks or filter by argument.

**Query Parameters:**
- `argumentId` (optional): Filter by argument ID

**Response (200):**
```json
{
  "message": "Fact checks retrieved successfully",
  "status": true,
  "data": [
    {
      "id": "5555555555",
      "argumentId": "9876543210",
      "verified": true,
      "confidence": 95,
      "reason": "Verified through official sources",
      "createdAt": "2025-12-30T10:15:00.000Z"
    }
  ]
}
```

**Example Request:**
```
GET http://localhost:5000/api/factcheck?argumentId=9876543210
```

---

## Analytics Routes

### GET `/api/analytics/:id`
Get analytics for a specific debate.

**Response (200):**
```json
{
  "message": "Analytics retrieved successfully",
  "status": true,
  "data": {
    "debateId": "1234567890",
    "totalArguments": 5,
    "fallaciesDetected": 2,
    "averageCredibility": "82.50",
    "arguments": [
      {
        "id": "9876543210",
        "speakerName": "Alice",
        "claim": "AI should be regulated",
        "credibilityScore": 85,
        "fallacy": "None"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Title and topic are required",
  "status": false
}
```

### 404 Not Found
```json
{
  "message": "Debate not found",
  "status": false
}
```

### 500 Internal Server Error
```json
{
  "message": "Error creating debate",
  "status": false
}
```

---

## Testing the APIs

### Using cURL

**Create Debate:**
```bash
curl -X POST http://localhost:5000/api/debates \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Debate","topic":"Test Topic"}'
```

**Get All Debates:**
```bash
curl http://localhost:5000/api/debates
```

**Create Argument:**
```bash
curl -X POST http://localhost:5000/api/arguments \
  -H "Content-Type: application/json" \
  -d '{"debateId":"1234567890","speakerName":"John","claim":"Test claim","evidence":"Test evidence"}'
```

---

## Local Storage

All data is stored in JSON files in the `Backend/data/` directory:
- `debates.json` - All debates
- `arguments.json` - All arguments
- `factchecks.json` - All fact checks
- `users.json` - All user accounts
- `otps.json` - OTP verification codes

No external database required!
