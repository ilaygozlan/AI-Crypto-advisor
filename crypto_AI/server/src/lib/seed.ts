import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample assets
  const assets = await Promise.all([
    prisma.asset.upsert({
      where: { symbol: 'BTC' },
      update: {},
      create: {
        symbol: 'BTC',
        name: 'Bitcoin',
        icon: '₿',
        sortOrder: 1,
      },
    }),
    prisma.asset.upsert({
      where: { symbol: 'ETH' },
      update: {},
      create: {
        symbol: 'ETH',
        name: 'Ethereum',
        icon: 'Ξ',
        sortOrder: 2,
      },
    }),
    prisma.asset.upsert({
      where: { symbol: 'SOL' },
      update: {},
      create: {
        symbol: 'SOL',
        name: 'Solana',
        icon: '◎',
        sortOrder: 3,
      },
    }),
  ])

  // Create sample content types
  const contentTypes = await Promise.all([
    prisma.contentType.upsert({
      where: { name: 'Market News' },
      update: {},
      create: {
        name: 'Market News',
        description: 'Latest cryptocurrency news and market updates',
        icon: '📰',
        sortOrder: 1,
      },
    }),
    prisma.contentType.upsert({
      where: { name: 'Charts' },
      update: {},
      create: {
        name: 'Charts',
        description: 'Technical analysis and price charts',
        icon: '📊',
        sortOrder: 2,
      },
    }),
    prisma.contentType.upsert({
      where: { name: 'Social' },
      update: {},
      create: {
        name: 'Social',
        description: 'Social media sentiment and discussions',
        icon: '💬',
        sortOrder: 3,
      },
    }),
    prisma.contentType.upsert({
      where: { name: 'Fun' },
      update: {},
      create: {
        name: 'Fun',
        description: 'Crypto memes and entertainment',
        icon: '🎭',
        sortOrder: 4,
      },
    }),
  ])

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: hashedPassword,
      hasCompletedOnboarding: true,
    },
  })

  // Create user preferences
  await prisma.userAsset.createMany({
    data: [
      { userId: user.id, assetId: assets[0].id },
      { userId: user.id, assetId: assets[1].id },
    ],
    skipDuplicates: true,
  })

  await prisma.userContentType.createMany({
    data: [
      { userId: user.id, contentTypeId: contentTypes[0].id },
      { userId: user.id, contentTypeId: contentTypes[1].id },
    ],
    skipDuplicates: true,
  })

  await prisma.userInvestorProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      investorType: 'HODLer',
      riskTolerance: 'Medium',
      investmentHorizon: 'Long-term',
      experienceLevel: 'Intermediate',
    },
  })

  // Create sample news item
  await prisma.newsItem.upsert({
    where: { id: 'sample-news-1' },
    update: {},
    create: {
      id: 'sample-news-1',
      title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
      summary: 'Bitcoin has surged to unprecedented levels as major corporations continue to add the cryptocurrency to their balance sheets.',
      url: 'https://example.com/bitcoin-ath-news',
      source: 'CryptoNews',
      publishedAt: new Date(),
      category: 'market',
      sentiment: 'positive',
      relevanceScore: 0.95,
    },
  })

  // Create sample meme
  await prisma.meme.upsert({
    where: { id: 'sample-meme-1' },
    update: {},
    create: {
      id: 'sample-meme-1',
      title: 'When You Check Your Portfolio After a Good Day',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
      caption: 'That feeling when your crypto portfolio is in the green and you\'re feeling like a financial genius! 📈',
      source: 'CryptoMemes Daily',
      tags: ['portfolio', 'gains', 'mood'],
      featuredDate: new Date(),
    },
  })

  // Create sample AI insight
  await prisma.aIInsight.upsert({
    where: { id: 'sample-ai-1' },
    update: {},
    create: {
      id: 'sample-ai-1',
      title: 'Market Sentiment Analysis: Bullish Momentum Building',
      content: 'Based on current market data and sentiment analysis, we\'re seeing strong bullish signals across major cryptocurrencies. The recent institutional adoption and regulatory clarity have created a positive feedback loop.',
      type: 'market_analysis',
      confidence: 0.87,
      targetAssets: [assets[0].id, assets[1].id],
      sentiment: 'bullish',
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  })

  // Create sample price snapshots
  await prisma.priceSnapshot.createMany({
    data: [
      {
        assetId: assets[0].id,
        symbol: 'BTC',
        currentPrice: 45230.50,
        priceChange24h: 1250.75,
        priceChangePercentage24h: 2.85,
        volume24h: 28500000000,
        marketCap: 850000000000,
        sparkline: [44000, 44200, 44500, 44800, 45000, 45100, 45230],
        snapshotAt: new Date(),
      },
      {
        assetId: assets[1].id,
        symbol: 'ETH',
        currentPrice: 2650.25,
        priceChange24h: -45.50,
        priceChangePercentage24h: -1.69,
        volume24h: 15000000000,
        marketCap: 320000000000,
        sparkline: [2700, 2680, 2660, 2655, 2650, 2645, 2650],
        snapshotAt: new Date(),
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📧 Demo user: demo@example.com`)
  console.log(`🔑 Demo password: password123`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
