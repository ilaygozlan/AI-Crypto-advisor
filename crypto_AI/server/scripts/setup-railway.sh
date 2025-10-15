#!/bin/bash

# Railway deployment setup script
echo "🚀 Setting up Railway deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the server directory."
    exit 1
fi

# Install dependencies to generate package-lock.json
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Railway setup complete!"
echo ""
echo "📋 Next steps for Railway deployment:"
echo "1. Push your code to GitHub"
echo "2. Create a new Railway project"
echo "3. Add PostgreSQL plugin"
echo "4. Deploy backend service with:"
echo "   - Root Directory: /server"
echo "   - Build Command: npm ci && npm run build && npm run migrate:deploy"
echo "   - Start Command: npm start"
echo "5. Set environment variables in Railway dashboard"
echo ""
echo "🔑 Required environment variables:"
echo "- JWT_ACCESS_SECRET (64+ characters)"
echo "- JWT_REFRESH_SECRET (64+ characters)"
echo "- CORS_ORIGIN (your frontend URL)"
echo "- DATABASE_URL (auto-injected by PostgreSQL plugin)"
