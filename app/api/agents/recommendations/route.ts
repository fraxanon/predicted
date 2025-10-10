import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAgent } from '../../../../agents/analytics/AnalyticsAgent';

// Initialize analytics agent
const analyticsAgent = new AnalyticsAgent();

export async function POST(request: NextRequest) {
  try {
    const { userProfile, address } = await request.json();

    if (!userProfile || !address) {
      return NextResponse.json({ error: 'User profile and address required' }, { status: 400 });
    }

    // Generate personalized recommendations using the analytics agent
    const recommendations = await generatePersonalizedRecommendations(userProfile);
    const earningsProjection = calculateEarningsProjection(userProfile, recommendations);

    // Log user profile creation for analytics
    console.log(`📊 Generated recommendations for ${address}:`, {
      interests: userProfile.interests,
      riskTolerance: userProfile.riskTolerance,
      investmentAmount: userProfile.investmentAmount,
      recommendationsCount: recommendations.length
    });

    return NextResponse.json({
      recommendations,
      earningsProjection,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Recommendation generation error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

async function generatePersonalizedRecommendations(userProfile: any) {
  // Mock market data - in production, this would come from the prediction market agent
  const availableMarkets = [
    {
      marketId: 'market-1',
      title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
      category: 'l2',
      aiPrediction: 'yes',
      confidence: 0.78,
      currentOdds: { yes: 0.72, no: 0.28 },
      volume: 12500,
      endDate: '2024-12-31',
      riskLevel: 'low'
    },
    {
      marketId: 'market-2',
      title: 'Major DeFi protocol announces $1B+ airdrop?',
      category: 'defi',
      aiPrediction: 'yes',
      confidence: 0.65,
      currentOdds: { yes: 0.45, no: 0.55 },
      volume: 8300,
      endDate: '2024-11-30',
      riskLevel: 'high'
    },
    {
      marketId: 'market-3',
      title: 'Bitcoin reaches $100K by end of 2024?',
      category: 'btc',
      aiPrediction: 'no',
      confidence: 0.72,
      currentOdds: { yes: 0.43, no: 0.57 },
      volume: 89700,
      endDate: '2024-12-31',
      riskLevel: 'medium'
    },
    {
      marketId: 'market-4',
      title: 'Ethereum gas fees drop below 10 gwei average?',
      category: 'eth',
      aiPrediction: 'yes',
      confidence: 0.83,
      currentOdds: { yes: 0.63, no: 0.37 },
      volume: 15800,
      endDate: '2024-11-15',
      riskLevel: 'low'
    },
    {
      marketId: 'market-5',
      title: 'New Web3 gaming token launches on Fraxtal?',
      category: 'gaming',
      aiPrediction: 'yes',
      confidence: 0.58,
      currentOdds: { yes: 0.58, no: 0.42 },
      volume: 7200,
      endDate: '2024-12-15',
      riskLevel: 'medium'
    },
    {
      marketId: 'market-6',
      title: 'Major NFT marketplace integrates with new chain?',
      category: 'nft',
      aiPrediction: 'yes',
      confidence: 0.69,
      currentOdds: { yes: 0.51, no: 0.49 },
      volume: 4500,
      endDate: '2024-11-20',
      riskLevel: 'medium'
    },
    {
      marketId: 'market-7',
      title: 'DAO governance proposal passes with 80%+ support?',
      category: 'dao',
      aiPrediction: 'no',
      confidence: 0.74,
      currentOdds: { yes: 0.35, no: 0.65 },
      volume: 6800,
      endDate: '2024-10-30',
      riskLevel: 'low'
    },
    {
      marketId: 'market-8',
      title: 'Solana network experiences major outage?',
      category: 'defi',
      aiPrediction: 'no',
      confidence: 0.81,
      currentOdds: { yes: 0.34, no: 0.66 },
      volume: 23100,
      endDate: '2024-11-30',
      riskLevel: 'low'
    }
  ];

  // Filter markets based on user interests
  const relevantMarkets = availableMarkets.filter(market => 
    userProfile.interests.includes(market.category)
  );

  // Score and rank markets based on user profile
  const scoredMarkets = relevantMarkets.map(market => {
    let score = 0;

    // Base score from AI confidence
    score += market.confidence * 0.4;

    // Risk tolerance alignment
    const riskAlignment = getRiskAlignment(market.riskLevel, userProfile.riskTolerance);
    score += riskAlignment * 0.3;

    // Potential return calculation
    const potentialReturn = calculatePotentialReturn(market, userProfile.riskTolerance);
    score += (potentialReturn * 2) * 0.2; // Scale potential return to 0-1 range

    // Volume bonus (higher volume = more liquid market)
    const volumeScore = Math.min(1, market.volume / 50000);
    score += volumeScore * 0.1;

    return {
      marketId: market.marketId,
      title: market.title,
      category: market.category,
      aiPrediction: market.aiPrediction,
      confidence: market.confidence,
      potentialReturn,
      riskLevel: market.riskLevel,
      reasoning: generateReasoning(market, userProfile),
      matchScore: Math.min(1, score),
      currentOdds: market.currentOdds,
      volume: market.volume,
      endDate: market.endDate
    };
  });

  // Sort by match score and return top recommendations
  return scoredMarkets
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8); // Top 8 recommendations
}

function getRiskAlignment(marketRisk: string, userRiskTolerance: string): number {
  const riskMatrix = {
    conservative: { low: 1.0, medium: 0.5, high: 0.1 },
    moderate: { low: 0.7, medium: 1.0, high: 0.6 },
    aggressive: { low: 0.3, medium: 0.7, high: 1.0 }
  };

  return riskMatrix[userRiskTolerance as keyof typeof riskMatrix]?.[marketRisk as keyof typeof riskMatrix.conservative] || 0.5;
}

function calculatePotentialReturn(market: any, riskTolerance: string): number {
  // Calculate potential return based on current odds and AI prediction
  const aiPredictionOdds = market.currentOdds[market.aiPrediction];
  const oppositeOdds = market.currentOdds[market.aiPrediction === 'yes' ? 'no' : 'yes'];
  
  // If AI predicts 'yes' and current odds are low, there's potential upside
  let baseReturn = 0;
  if (market.aiPrediction === 'yes' && aiPredictionOdds < 0.7) {
    baseReturn = (1 - aiPredictionOdds) * market.confidence;
  } else if (market.aiPrediction === 'no' && oppositeOdds < 0.7) {
    baseReturn = (1 - oppositeOdds) * market.confidence;
  } else {
    baseReturn = 0.1; // Minimal return for aligned predictions
  }

  // Adjust for risk tolerance
  const riskMultiplier = riskTolerance === 'conservative' ? 0.8 : 
                        riskTolerance === 'aggressive' ? 1.2 : 1.0;

  return Math.min(0.5, baseReturn * riskMultiplier); // Cap at 50% return
}

function generateReasoning(market: any, userProfile: any): string {
  const reasons = [];

  // AI confidence reasoning
  if (market.confidence > 0.8) {
    reasons.push('High AI confidence based on technical analysis');
  } else if (market.confidence > 0.6) {
    reasons.push('Moderate AI confidence with supporting indicators');
  }

  // Risk alignment reasoning
  const riskAlignment = getRiskAlignment(market.riskLevel, userProfile.riskTolerance);
  if (riskAlignment > 0.8) {
    reasons.push(`Excellent fit for your ${userProfile.riskTolerance} risk profile`);
  } else if (riskAlignment > 0.5) {
    reasons.push(`Good alignment with your risk tolerance`);
  }

  // Market-specific reasoning
  if (market.volume > 20000) {
    reasons.push('High liquidity market with active trading');
  }

  // Category-specific reasoning
  const categoryReasons = {
    defi: 'Strong DeFi fundamentals and protocol development',
    l2: 'Growing Layer 2 adoption and infrastructure investment',
    btc: 'Bitcoin market dynamics and institutional interest',
    eth: 'Ethereum ecosystem growth and network upgrades',
    gaming: 'Expanding Web3 gaming sector with new launches',
    nft: 'NFT market evolution and cross-chain integration',
    dao: 'DAO governance trends and community participation'
  };

  if (categoryReasons[market.category as keyof typeof categoryReasons]) {
    reasons.push(categoryReasons[market.category as keyof typeof categoryReasons]);
  }

  return reasons.slice(0, 3).join('. ') + '.';
}

function calculateEarningsProjection(userProfile: any, recommendations: any[]) {
  if (recommendations.length === 0) {
    return { daily: 0, weekly: 0, monthly: 0, yearly: 0, confidence: 0, basedOnMarkets: 0 };
  }

  // Calculate weighted average return
  const totalWeight = recommendations.reduce((sum, rec) => sum + rec.matchScore, 0);
  const weightedReturn = recommendations.reduce((sum, rec) => {
    return sum + (rec.potentialReturn * rec.matchScore);
  }, 0) / totalWeight;

  // Apply conservative estimation (reduce by 20% for realistic projections)
  const conservativeReturn = weightedReturn * 0.8;
  
  const yearlyEarnings = userProfile.investmentAmount * conservativeReturn;
  const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;

  return {
    daily: yearlyEarnings / 365,
    weekly: yearlyEarnings / 52,
    monthly: yearlyEarnings / 12,
    yearly: yearlyEarnings,
    confidence: avgConfidence,
    basedOnMarkets: recommendations.length
  };
}
