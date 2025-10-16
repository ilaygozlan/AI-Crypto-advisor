# Authentication API Documentation

## Overview

This API provides JWT-based authentication with refresh token rotation for enhanced security. The system supports user signup, login, token refresh, and logout functionality.

## Endpoints

### POST /auth/signup

Creates a new user account with onboarding data.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "onboarding": {
    "riskTolerance": "moderate",
    "investmentGoals": ["retirement", "growth"],
    "experience": "intermediate"
  }
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `409` - User with this email already exists
- `400` - Validation error or signup failed

### POST /auth/login

Authenticates an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `400` - Validation error

### POST /auth/refresh

Refreshes the access token using the refresh token from cookies.

**Request:** No body required (uses `refresh_token` cookie)

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Invalid or expired refresh token

### POST /auth/logout

Logs out the user and revokes the refresh token.

**Request:** No body required (uses `refresh_token` cookie)

**Response (200):**
```json
{
  "ok": true
}
```

### GET /me

Returns the current authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `401` - Missing or invalid access token
- `404` - User not found

## Cookie Behavior

### Refresh Token Cookie

- **Name:** `refresh_token`
- **HttpOnly:** `true` (prevents XSS attacks)
- **Secure:** `true` in production (HTTPS only)
- **SameSite:** `lax` (CSRF protection)
- **Path:** `/auth` (only sent to auth endpoints)
- **MaxAge:** 7 days

### Cookie Management

The refresh token is automatically:
- Set during signup and login
- Rotated on every refresh
- Cleared on logout
- Revoked when expired or invalid

## Security Features

1. **Password Hashing:** bcrypt with configurable salt rounds
2. **JWT Access Tokens:** Short-lived (15 minutes default)
3. **Refresh Token Rotation:** New token issued on every refresh
4. **Token Revocation:** Refresh tokens can be revoked
5. **CORS Protection:** Configured for specific frontend URL
6. **Input Validation:** Zod schemas for all inputs
7. **Error Handling:** Proper HTTP status codes and error messages

## Environment Variables

```env
JWT_ACCESS_SECRET=your-super-secret-access-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
BCRYPT_SALT_ROUNDS=12
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique)
- `password_hash` (TEXT)
- `first_name` (TEXT, Optional)
- `last_name` (TEXT, Optional)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Onboarding Answers Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `answers` (JSONB)
- `created_at` (TIMESTAMPTZ)

### Refresh Tokens Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token_hash` (TEXT)
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `revoked_at` (TIMESTAMPTZ, Optional)

## Usage Examples

### Frontend Integration

```javascript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({ email, password })
});

// Use access token for API calls
const userResponse = await fetch('/me', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
  credentials: 'include'
});

// Refresh token automatically
const refreshResponse = await fetch('/auth/refresh', {
  method: 'POST',
  credentials: 'include'
});
```

### Error Handling

```javascript
if (response.status === 401 && response.data.code === 'token_expired') {
  // Try to refresh token
  await refreshToken();
  // Retry original request
}
```
