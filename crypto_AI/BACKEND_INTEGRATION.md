# Backend Integration Guide

This document describes the backend integration changes made to connect the frontend to the Node.js + Express + Postgres backend.

## Overview

The frontend has been updated to use a new API client that connects to the backend endpoints:

- `POST /auth/signup` - User registration with onboarding data
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh using httpOnly cookies
- `POST /auth/logout` - User logout
- `GET /me` - Get current user info
- `GET /me/data` - Get user onboarding data

## Key Changes

### 1. Configuration (`src/config.ts`)
- Single `SERVER_URL` constant for easy environment switching
- Supports both Vite (`VITE_SERVER_URL`) and Node.js (`SERVER_URL`) environment variables

### 2. API Client (`src/lib/api.ts`)
- Fetch-based API client with automatic token refresh
- Manages access tokens in localStorage and memory
- Handles httpOnly refresh token cookies automatically
- Auto-retries requests on 401 with token refresh

### 3. Auth System (`src/state/useAuth.ts` + `src/contexts/AuthContext.tsx`)
- New auth hook and context for state management
- Bootstrap function to check existing tokens on app load
- Integrated with React Query for better state management

### 4. Enhanced Signup Form (`src/features/auth/components/EnhancedSignupForm.tsx`)
- Multi-step signup form that includes onboarding data
- Collects investor type, selected assets, and content preferences
- Sends all data to backend during signup

### 5. Updated Components
- Login/Signup pages use new auth system
- Protected routes use new auth context
- Navbar logout uses new API

## Environment Setup

### Development
Create a `.env.local` file in the project root:
```env
VITE_SERVER_URL=http://localhost:3000
```

### Production
Set the environment variable in your deployment platform:
```env
VITE_SERVER_URL=https://your-backend-url.com
```

## Backend Requirements

Ensure your backend is configured with:

1. **CORS** with credentials enabled:
```javascript
cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
})
```

2. **Cookie parser** middleware:
```javascript
app.use(cookieParser())
```

3. **Endpoints** that match the expected format:
- Signup should accept `{ email, password, firstName, lastName, data: { investorType, selectedAssets, selectedContentTypes, completedAt } }`
- Login should return `{ accessToken, user }`
- Refresh should return `{ accessToken }`

## Usage

### Signup Flow
1. User fills out multi-step signup form
2. Form collects basic info + onboarding preferences
3. All data sent to `/auth/signup` endpoint
4. Backend creates user and saves onboarding data
5. Frontend receives access token and redirects to dashboard

### Login Flow
1. User enters email/password
2. Frontend calls `/auth/login`
3. Backend returns access token and user info
4. Frontend stores token and redirects to dashboard

### Token Refresh
- Automatic on 401 responses
- Uses httpOnly refresh cookie
- Seamless user experience

### Logout
- Calls `/auth/logout` to clear refresh cookie
- Removes access token from storage
- Redirects to login page

## Testing

1. Start your backend server on port 3000
2. Set `VITE_SERVER_URL=http://localhost:3000` in `.env.local`
3. Start the frontend: `npm run dev`
4. Test signup/login flows

## Production Deployment

1. Update `VITE_SERVER_URL` to your production backend URL
2. Ensure backend CORS allows your frontend domain
3. Deploy both frontend and backend
4. Test authentication flows in production
