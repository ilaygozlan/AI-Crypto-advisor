#!/bin/bash

# Railway build script with error handling
set -e

echo "🚀 Starting Railway build process..."

# Clean up any existing node_modules to avoid cache conflicts
echo "🧹 Cleaning up existing node_modules..."
rm -rf node_modules/.cache 2>/dev/null || true

# Install dependencies with retry logic
echo "📦 Installing dependencies..."
for i in {1..3}; do
  if npm ci --no-audit --no-fund --prefer-offline; then
    echo "✅ Dependencies installed successfully"
    break
  else
    echo "❌ Attempt $i failed, retrying..."
    if [ $i -eq 3 ]; then
      echo "💥 All attempts failed, exiting"
      exit 1
    fi
    sleep 2
  fi
done

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "✅ Build completed successfully!"
