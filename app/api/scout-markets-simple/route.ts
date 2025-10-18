import { NextRequest, NextResponse } from 'next/server';

// Simplified Twitter search without ADK dependency
interface TwitterSearchResult {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
  relevanceScore: number;
  marketPotential: 'high' | 'medium' | 'low';
  suggestedMarketQuestion: string;
}

interface MarketAnalysis {
  marketId: string;
  question: string;
  category: string;
  timeframe: string;
  viabilityScore: number;
  reasoning: string;
  estimatedVolume: string;
  riskFactors: string[];
  opportunities: string[];
  recommendedAction: 'create' | 'monitor' | 'skip';
}

// Mock Twitter search function
async function searchTwitter(query: string, timeframe: string = '24h', minEngagement: number = 100): Promise<TwitterSearchResult[]> {
  // Enhanced mock data based on query
  const mockResults: TwitterSearchResult[] = [
    {
      id: 'tweet_1',
      text: `🚀 BREAKING: ${query.toUpperCase()} market sees massive surge! Major announcement expected within 48 hours. Industry insiders suggest this could be the biggest development of 2024. #${query} #Breaking`,
      author: '@MarketInsider',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 3450, retweets: 1290, replies: 456 },
      relevanceScore: 0.95,
      marketPotential: 'high',
      suggestedMarketQuestion: `Will the major ${query} announcement be officially confirmed within 48 hours?`
    },
    {
      id: 'tweet_2',
      text: `Exclusive: Sources close to the matter suggest ${query} regulatory approval could come as early as next week. This would be a game-changer for the entire industry. Stay tuned! 👀`,
      author: '@CryptoReporter',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 2890, retweets: 967, replies: 234 },
      relevanceScore: 0.88,
      marketPotential: 'high',
      suggestedMarketQuestion: `Will ${query} regulatory approval be granted within the next 7 days?`
    },
    {
      id: 'tweet_3',
      text: `${query} price prediction: Technical analysis suggests we could see a 50% move in either direction by month end. Key resistance at current levels. What do you think? 📈📉`,
      author: '@TechAnalyst',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      engagement: { likes: 1567, retweets: 445, replies: 189 },
      relevanceScore: 0.75,
      marketPotential: 'medium',
      suggestedMarketQuestion: `Will ${query} price increase by more than 25% by end of month?`
    }
  ];

  // Filter by engagement and query relevance
  return mockResults.filter(result => {
    const totalEngagement = result.engagement.likes + result.engagement.retweets;
    const isRelevant = result.text.toLowerCase().includes(query.toLowerCase());
    return totalEngagement >= minEngagement && isRelevant;
  });
}

// Analyze market potential
function analyzeMarketPotential(tweets: TwitterSearchResult[]): MarketAnalysis[] {
  return tweets.map((tweet, index) => {
    const category = categorizeContent(tweet.text);
    const viabilityScore = calculateViabilityScore(tweet);
    
    return {
      marketId: `market_${Date.now()}_${index}`,
      question: tweet.suggestedMarketQuestion,
      category,
      timeframe: estimateTimeframe(tweet.text),
      viabilityScore,
      reasoning: generateReasoning(tweet, viabilityScore),
      estimatedVolume: estimateVolume(tweet.engagement, viabilityScore),
      riskFactors: identifyRiskFactors(tweet.text),
      opportunities: identifyOpportunities(tweet.text),
      recommendedAction: getRecommendation(viabilityScore)
    };
  });
}

function categorizeContent(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('crypto') || lowerText.includes('bitcoin') || lowerText.includes('ethereum')) return 'crypto';
  if (lowerText.includes('ai') || lowerText.includes('tech') || lowerText.includes('startup')) return 'tech';
  if (lowerText.includes('election') || lowerText.includes('politics') || lowerText.includes('government')) return 'politics';
  if (lowerText.includes('sports') || lowerText.includes('nfl') || lowerText.includes('nba')) return 'sports';
  return 'general';
}

function calculateViabilityScore(tweet: TwitterSearchResult): number {
  let score = 0;
  const totalEngagement = tweet.engagement.likes + tweet.engagement.retweets + tweet.engagement.replies;
  
  // Engagement score (max 0.4)
  score += Math.min(totalEngagement / 5000, 0.4);
  
  // Relevance score (max 0.3)
  score += tweet.relevanceScore * 0.3;
  
  // Market potential (max 0.3)
  const potentialScores = { 'high': 0.3, 'medium': 0.2, 'low': 0.1 };
  score += potentialScores[tweet.marketPotential];
  
  return Math.min(score, 1.0);
}

function estimateTimeframe(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('48 hours') || lowerText.includes('2 days')) return '2 days';
  if (lowerText.includes('next week') || lowerText.includes('7 days')) return '1 week';
  if (lowerText.includes('month end') || lowerText.includes('30 days')) return '1 month';
  return '3 months';
}

function generateReasoning(tweet: TwitterSearchResult, viabilityScore: number): string {
  const engagement = tweet.engagement.likes + tweet.engagement.retweets;
  return `High engagement (${engagement.toLocaleString()} interactions) indicates strong public interest. ${
    viabilityScore > 0.8 ? 'Excellent market potential with clear timeline and verifiable outcome.' :
    viabilityScore > 0.6 ? 'Good market potential with moderate risk factors.' :
    'Limited market potential due to unclear criteria.'
  }`;
}

function estimateVolume(engagement: TwitterSearchResult['engagement'], viabilityScore: number): string {
  const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
  const baseVolume = totalEngagement * viabilityScore * 0.01;
  
  if (baseVolume > 50) return '$50k+';
  if (baseVolume > 20) return '$20k-50k';
  if (baseVolume > 5) return '$5k-20k';
  return '$1k-5k';
}

function identifyRiskFactors(text: string): string[] {
  const risks: string[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('rumor') || lowerText.includes('speculation')) {
    risks.push('Based on unconfirmed information');
  }
  if (lowerText.includes('sources suggest') || lowerText.includes('insiders')) {
    risks.push('Relies on anonymous sources');
  }
  if (!lowerText.includes('official') && !lowerText.includes('confirmed')) {
    risks.push('Lacks official confirmation');
  }
  
  return risks;
}

function identifyOpportunities(text: string): string[] {
  const opportunities: string[] = ['Strong social media engagement'];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('breaking') || lowerText.includes('exclusive')) {
    opportunities.push('High media attention');
  }
  if (lowerText.includes('announcement') || lowerText.includes('official')) {
    opportunities.push('Clear resolution criteria');
  }
  
  return opportunities;
}

function getRecommendation(viabilityScore: number): 'create' | 'monitor' | 'skip' {
  if (viabilityScore >= 0.8) return 'create';
  if (viabilityScore >= 0.6) return 'monitor';
  return 'skip';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      queries = ['crypto', 'AI', 'bitcoin', 'tech', 'election'],
      timeframe = '24h',
      minEngagement = 100,
      maxResults = 10
    } = body;

    console.log('🚀 Starting simplified Twitter Market Scout...');
    
    let allAnalyses: MarketAnalysis[] = [];

    // Search for each query
    for (const query of queries) {
      console.log(`🐦 Searching Twitter for: "${query}"`);
      
      const tweets = await searchTwitter(query, timeframe, minEngagement);
      const analyses = analyzeMarketPotential(tweets);
      
      allAnalyses.push(...analyses);
    }

    // Remove duplicates and sort by viability
    const uniqueAnalyses = allAnalyses.filter((analysis, index, self) => 
      index === self.findIndex(a => a.question === analysis.question)
    );
    
    const viableMarkets = uniqueAnalyses
      .filter(analysis => analysis.recommendedAction !== 'skip')
      .sort((a, b) => b.viabilityScore - a.viabilityScore)
      .slice(0, maxResults);
    
    const topRecommendations = viableMarkets
      .filter(analysis => analysis.recommendedAction === 'create')
      .slice(0, 5);

    const report = {
      timestamp: new Date().toISOString(),
      searchQuery: queries.join(', '),
      totalTweetsAnalyzed: allAnalyses.length,
      viableMarkets,
      topRecommendations,
      summary: `Analyzed ${allAnalyses.length} potential markets. Found ${viableMarkets.length} viable opportunities with ${topRecommendations.length} top recommendations.`
    };

    console.log('✅ Market scouting completed successfully');

    return NextResponse.json({
      success: true,
      data: report,
      message: 'Using simplified scout (ADK integration in progress)'
    });

  } catch (error) {
    console.error('❌ Error in market scouting:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to scout markets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json({
        success: false,
        error: 'Topic parameter is required'
      }, { status: 400 });
    }

    console.log(`🎯 Analyzing specific topic: "${topic}"`);
    
    const tweets = await searchTwitter(topic);
    const analyses = analyzeMarketPotential(tweets);

    return NextResponse.json({
      success: true,
      data: {
        topic,
        analyses,
        count: analyses.length
      }
    });

  } catch (error) {
    console.error('❌ Error in topic analysis:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze topic',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
