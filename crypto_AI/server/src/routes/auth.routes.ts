import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { generateTokenPair, verifyToken } from '../lib/jwt.js'
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookies.js'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js'
import { createError } from '../middleware/errorHandler.js'
import { logger } from '../lib/logger.js'

const router = Router()
const prisma = new PrismaClient()
const isProduction = process.env.NODE_ENV === 'production'

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

/**
 * POST /auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        hasCompletedOnboarding: false
      },
      select: {
        id: true,
        email: true,
        name: true,
        hasCompletedOnboarding: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.email)
    
    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken, isProduction)
    
    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 12),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    })
    
    logger.info('User created', { userId: user.id, email: user.email })
    
    res.status(201).json({
      data: {
        user,
        accessToken
      },
      message: 'User created successfully',
      success: true
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    next(error)
  }
})

/**
 * POST /auth/login
 * Authenticate user and return tokens
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email, isActive: true }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user.id, user.email)
    
    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken, isProduction)
    
    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 12),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    })
    
    logger.info('User logged in', { userId: user.id, email: user.email })
    
    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        },
        accessToken
      },
      message: 'Login successful',
      success: true
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    next(error)
  }
})

/**
 * POST /auth/refresh
 * Refresh access token using refresh token cookie
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' })
    }
    
    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh')
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, isActive: true }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user.id, user.email)
    
    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken, isProduction)
    
    // Update session
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: {
        tokenHash: await bcrypt.hash(newRefreshToken, 12),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastUsedAt: new Date()
      }
    })
    
    res.json({
      data: {
        accessToken
      },
      message: 'Token refreshed successfully',
      success: true
    })
  } catch (error) {
    // Clear invalid refresh token cookie
    clearRefreshTokenCookie(res, isProduction)
    next(error)
  }
})

/**
 * POST /auth/logout
 * Logout user and clear refresh token
 */
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.user) {
      // Deactivate all user sessions
      await prisma.session.updateMany({
        where: { userId: req.user.userId },
        data: { isActive: false }
      })
      
      logger.info('User logged out', { userId: req.user.userId })
    }
    
    // Clear refresh token cookie
    clearRefreshTokenCookie(res, isProduction)
    
    res.json({
      message: 'Logout successful',
      success: true
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        hasCompletedOnboarding: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({
      data: user,
      message: 'User profile retrieved successfully',
      success: true
    })
  } catch (error) {
    next(error)
  }
})

export { router as authRoutes }
