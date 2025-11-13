# 🧪 Testing API Endpoints

## Quick Test Guide

### 1. Health Check
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "InsightIQ API is running"
}
```

---

### 2. Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User registered successfully"
}
```

---

### 3. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

---

### 4. Get Current User (Protected)
```bash
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Common Issues

### "Route not found" Error
- ✅ Make sure you're using the correct URL format
- ✅ Check that the route starts with `/api/` (except `/health`)
- ✅ Verify the HTTP method (GET, POST, etc.)
- ✅ Ensure server is running on port 3001

### Server Not Running
```bash
cd backend
npm run start:dev
```

### Wrong Port
- Default port is `3001`
- Check `.env` file for `PORT` variable
- Or check server console output

---

## Using Postman/Thunder Client

1. **Base URL:** `http://localhost:3001`
2. **Health Check:** `GET /health`
3. **Register:** `POST /api/auth/register`
4. **Login:** `POST /api/auth/login`
5. **Get User:** `GET /api/users/me` (add Bearer token in Headers)

---

## Using Browser

Only the health check works in browser:
```
http://localhost:3001/health
```

For other endpoints, use Postman, curl, or a REST client.

