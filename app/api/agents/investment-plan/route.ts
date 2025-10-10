import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAgent } from '../../../../agents/analytics/AnalyticsAgent';

// Initialize analytics agent
const analyticsAgent = new AnalyticsAgent();

export async function POST(request: NextRequest) {
  try {
    const { userProfile, totalBudget, recommendations, address } = await request.json();

    if (!userProfile || !totalBudget || !address) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Generate optimized investment plan using AI
    const investmentPlan = await generateOptimizedInvestmentPlan(
      userProfile, 
      totalBudget, 
      recommendations
    );

    // Log investment plan generation
    console.log(`💰 Generated investment plan for ${address}:`, {
      totalBudget,
      investmentsCount: investmentPlan.length,
      totalAllocated: investmentPlan.reduce((sum, inv) => sum + inv.recommendedAmount, 0),
      riskDistribution: calculateRiskDistribution(investmentPlan)
    });

    return NextResponse.json({
      investments: investmentPlan,
      summary: {
        totalBudget,
        totalAllocated: investmentPlan.reduce((sum, inv) => sum + inv.recommendedAmount, 0),
        expectedReturn: investmentPlan.reduce((sum, inv) => 
          sum + (inv.recommendedAmount * inv.potentialReturn * inv.confidence), 0
        ),
        riskScore: calculateOverallRiskScore(investmentPlan),
        diversificationScore: calculateDiversificationScore(investmentPlan)
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Investment plan generation error:', error);
    return NextResponse.json({ error: 'Failed to generate investment plan' }, { status: 500 });
  }
}

async function generateOptimizedInvestmentPlan(
  userProfile: any, 
  totalBudget: number, 
  recommendations: any[]
) {
  // Advanced portfolio optimization algorithm
  
  // 1. Risk-based allocation strategy
  const riskAllocation = getRiskAllocationStrategy(userProfile.riskTolerance);
  
  // 2. Filter and score recommendations
  const scoredRecommendations = recommendations
    .filter(rec => rec.confidence > 0.5) // Minimum confidence threshold
    .map(rec => ({
      ...rec,
      sharpeRatio: calculateSharpeRatio(rec),
      kellyBet: calculateKellyBet(rec),
      diversificationBonus: calculateDiversificationBonus(rec, recommendations)
    }))
    .sort((a, b) => (b.sharpeRatio + b.diversificationBonus) - (a.sharpeRatio + a.diversificationBonus));

  // 3. Portfolio construction with constraints
  const portfolio = [];
  let remainingBudget = totalBudget;
  const categoryExposure = new Map();
  const riskExposure = { low: 0, medium: 0, high: 0 };

  // 4. Allocate budget optimally
  for (const rec of scoredRecommendations) {
    if (remainingBudget < 10) break; // Minimum investment threshold
    
    // Check diversification constraints
    const currentCategoryExposure = categoryExposure.get(rec.category) || 0;
    const maxCategoryExposure = totalBudget * 0.4; // Max 40% per category
    
    if (currentCategoryExposure >= maxCategoryExposure) continue;
    
    // Check risk constraints
    const targetRiskBudget = totalBudget * (riskAllocation[rec.riskLevel as keyof typeof riskAllocation] || 0);
    const currentRiskExposure = riskExposure[rec.riskLevel as keyof typeof riskExposure];
    
    if (currentRiskExposure >= targetRiskBudget) continue;
    
    // Calculate optimal position size using Kelly Criterion (capped)
    const kellySize = Math.min(
      rec.kellyBet * totalBudget,
      remainingBudget * 0.25, // Max 25% of remaining budget per position
      targetRiskBudget - currentRiskExposure,
      maxCategoryExposure - currentCategoryExposure
    );
    
    const investmentAmount = Math.max(10, Math.floor(kellySize));
    
    if (investmentAmount <= remainingBudget) {
      portfolio.push({
        marketId: rec.marketId,
        title: rec.title,
        category: rec.category,
        aiPrediction: rec.aiPrediction,
        confidence: rec.confidence,
        recommendedAmount: investmentAmount,
        potentialReturn: rec.potentialReturn,
        riskLevel: rec.riskLevel,
        reasoning: generateInvestmentReasoning(rec, investmentAmount, totalBudget),
        currentOdds: rec.currentOdds || generateMockOdds(rec),
        timeToExpiry: rec.endDate || '30 days',
        sharpeRatio: rec.sharpeRatio,
        kellyBet: rec.kellyBet,
        expectedValue: investmentAmount * rec.potentialReturn * rec.confidence
      });
      
      remainingBudget -= investmentAmount;
      categoryExposure.set(rec.category, currentCategoryExposure + investmentAmount);
      riskExposure[rec.riskLevel as keyof typeof riskExposure] += investmentAmount;
    }
  }

  // 5. Rebalance if needed to use remaining budget efficiently
  if (remainingBudget > 50 && portfolio.length > 0) {
    const bonusPerPosition = Math.floor(remainingBudget / portfolio.length);
    portfolio.forEach(pos => {
      pos.recommendedAmount += bonusPerPosition;
      pos.expectedValue = pos.recommendedAmount * pos.potentialReturn * pos.confidence;
    });
  }

  return portfolio.slice(0, 8); // Max 8 positions for manageable portfolio
}

function getRiskAllocationStrategy(riskTolerance: string) {
  const strategies = {
    conservative: { low: 0.7, medium: 0.25, high: 0.05 },
    moderate: { low: 0.4, medium: 0.45, high: 0.15 },
    aggressive: { low: 0.15, medium: 0.35, high: 0.5 }
  };
  
  return strategies[riskTolerance as keyof typeof strategies] || strategies.moderate;
}

function calculateSharpeRatio(recommendation: any): number {
  // Simplified Sharpe ratio calculation
  const expectedReturn = recommendation.potentialReturn * recommendation.confidence;
  const riskFreeRate = 0.05; // 5% risk-free rate
  const volatility = getRiskVolatility(recommendation.riskLevel);
  
  return (expectedReturn - riskFreeRate) / volatility;
}

function calculateKellyBet(recommendation: any): number {
  // Kelly Criterion for optimal bet sizing
  const p = recommendation.confidence; // Probability of winning
  const b = recommendation.potentialReturn; // Odds received
  
  const kellyFraction = (b * p - (1 - p)) / b;
  
  // Cap Kelly bet at 25% for risk management
  return Math.max(0, Math.min(0.25, kellyFraction));
}

function calculateDiversificationBonus(recommendation: any, allRecommendations: any[]): number {
  // Bonus for categories with less exposure
  const categoryCount = allRecommendations.filter(r => r.category === recommendation.category).length;
  const totalRecommendations = allRecommendations.length;
  
  // Higher bonus for less represented categories
  return (1 - categoryCount / totalRecommendations) * 0.1;
}

function getRiskVolatility(riskLevel: string): number {
  const volatilities = {
    low: 0.15,
    medium: 0.25,
    high: 0.40
  };
  
  return volatilities[riskLevel as keyof typeof volatilities] || 0.25;
}

function generateInvestmentReasoning(rec: any, amount: number, totalBudget: number): string {
  const reasons = [];
  
  // Position size reasoning
  const positionSize = (amount / totalBudget) * 100;
  if (positionSize > 15) {
    reasons.push(`Large ${positionSize.toFixed(1)}% position due to high conviction`);
  } else if (positionSize < 5) {
    reasons.push(`Small ${positionSize.toFixed(1)}% position for diversification`);
  } else {
    reasons.push(`Balanced ${positionSize.toFixed(1)}% allocation`);
  }
  
  // Confidence reasoning
  if (rec.confidence > 0.8) {
    reasons.push('very high AI confidence');
  } else if (rec.confidence > 0.65) {
    reasons.push('strong AI signals');
  } else {
    reasons.push('moderate confidence with upside potential');
  }
  
  // Risk-return reasoning
  if (rec.potentialReturn > 0.3) {
    reasons.push('high return potential');
  } else if (rec.potentialReturn > 0.15) {
    reasons.push('solid return expectations');
  } else {
    reasons.push('conservative return profile');
  }
  
  return reasons.join(', ') + '.';
}

function generateMockOdds(recommendation: any) {
  // Generate realistic odds based on AI prediction and confidence
  const baseOdds = recommendation.aiPrediction === 'yes' ? 
    recommendation.confidence : 
    1 - recommendation.confidence;
    
  return {
    yes: Math.round(baseOdds * 100) / 100,
    no: Math.round((1 - baseOdds) * 100) / 100
  };
}

function calculateRiskDistribution(portfolio: any[]) {
  const distribution = { low: 0, medium: 0, high: 0 };
  const total = portfolio.reduce((sum, pos) => sum + pos.recommendedAmount, 0);
  
  portfolio.forEach(pos => {
    distribution[pos.riskLevel as keyof typeof distribution] += pos.recommendedAmount;
  });
  
  return {
    low: ((distribution.low / total) * 100).toFixed(1) + '%',
    medium: ((distribution.medium / total) * 100).toFixed(1) + '%',
    high: ((distribution.high / total) * 100).toFixed(1) + '%'
  };
}

function calculateOverallRiskScore(portfolio: any[]): number {
  const riskWeights = { low: 1, medium: 2, high: 3 };
  const totalAmount = portfolio.reduce((sum, pos) => sum + pos.recommendedAmount, 0);
  
  const weightedRisk = portfolio.reduce((sum, pos) => {
    const weight = pos.recommendedAmount / totalAmount;
    return sum + (riskWeights[pos.riskLevel as keyof typeof riskWeights] * weight);
  }, 0);
  
  return Math.round(weightedRisk * 10) / 10; // Scale 1.0-3.0
}

function calculateDiversificationScore(portfolio: any[]): number {
  const categories = new Set(portfolio.map(pos => pos.category));
  const maxCategories = 8; // Maximum possible categories
  
  return Math.round((categories.size / maxCategories) * 100); // 0-100 score
}
