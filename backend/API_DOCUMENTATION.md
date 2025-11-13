# 🔐 Authentication API Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ANALYST",
      "createdAt": "2025-11-13T...",
      "updatedAt": "2025-11-13T..."
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "REGISTRATION_ERROR",
    "message": "User with this email already exists"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ANALYST",
      "createdAt": "2025-11-13T...",
      "updatedAt": "2025-11-13T..."
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "LOGIN_ERROR",
    "message": "Invalid email or password"
  }
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

Refresh the access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  },
  "message": "Token refreshed successfully"
}
```

---

### 4. Get Current User
**GET** `/users/me`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ANALYST",
    "createdAt": "2025-11-13T...",
    "updatedAt": "2025-11-13T..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No token provided"
  }
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Security Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable)
- Refresh tokens expire after 30 days
- Always use HTTPS in production
- Store tokens securely (httpOnly cookies recommended for production)

