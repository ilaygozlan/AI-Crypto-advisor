#!/bin/bash
set -e

echo "Building Moveo Crypto AI Advisor API..."

# Navigate to server directory
cd server

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Generate Prisma client (use npx to avoid permission issues)
echo "Generating Prisma client..."
npx prisma generate

# Build the application
echo "Building application..."
npm run build

# Run migrations (use npx to avoid permission issues)
echo "Running database migrations..."
npx prisma migrate deploy

echo "Build completed successfully!"
