import { PrismaClient } from '@prisma/client'
import { logger } from './logger.js'

declare global {
  var __prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  logger.info('Disconnecting from database...')
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, disconnecting from database...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, disconnecting from database...')
  await prisma.$disconnect()
  process.exit(0)
})
