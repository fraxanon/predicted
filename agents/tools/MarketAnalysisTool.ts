import { TwitterSearchResult } from './TwitterSearchTool';

// BaseTool interface compatible with ADK
interface ToolConfig {
  name: string;
  description: string;
}

abstract class BaseTool {
  name: string;
  description: string;
  isLongRunning: boolean = false;
  shouldRetryOnFailure: boolean = true;
  maxRetryAttempts: number = 3;
  baseRetryDelay: number = 1000;
  maxRetryDelay: number = 10000;
  retryBackoffFactor: number = 2;
  timeout: number = 30000;
  requiresConfirmation: boolean = false;
  confirmationMessage?: string;
  
  constructor(config: ToolConfig) {
    this.name = config.name;
    this.description = config.description;
  }
  
  abstract execute(params: any): Promise<any>;
}

export interface MarketAnalysis {
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

export class MarketAnalysisTool extends BaseTool {
  constructor(config?: ToolConfig) {
    super(config || {
      name: 'analyze_market_potential',
      description: 'Analyze Twitter content to determine prediction market viability and generate market questions'
    });
  }

  schema = {
    type: 'object',
    properties: {
      twitterResults: {
        type: 'array',
        description: 'Array of Twitter search results to analyze',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            engagement: { type: 'object' },
            marketPotential: { type: 'string' },
            suggestedMarketQuestion: { type: 'string' }
          }
        }
      },
      focusArea: {
        type: 'string',
        description: 'Specific area to focus analysis on (e.g., "crypto", "sports", "politics")',
        default: 'general'
      }
    },
    required: ['twitterResults']
  } as const;

  async execute(params: {
    twitterResults: TwitterSearchResult[];
    focusArea?: string;
  }): Promise<MarketAnalysis[]> {
    const { twitterResults, focusArea = 'general' } = params;

    const analyses: MarketAnalysis[] = [];

    for (const tweet of twitterResults) {
      const analysis = await this.analyzeTweet(tweet, focusArea);
      if (analysis.viabilityScore >= 0.6) { // Only include viable markets
        analyses.push(analysis);
      }
    }

    // Sort by viability score
    return analyses.sort((a, b) => b.viabilityScore - a.viabilityScore);
  }

  private async analyzeTweet(tweet: TwitterSearchResult, focusArea: string): Promise<MarketAnalysis> {
    // Analyze the tweet content for market potential
    const category = this.categorizeContent(tweet.text);
    const timeframe = this.estimateTimeframe(tweet.text);
    const viabilityScore = this.calculateViabilityScore(tweet);
    
    return {
      marketId: `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: this.refineMarketQuestion(tweet.suggestedMarketQuestion),
      category,
      timeframe,
      viabilityScore,
      reasoning: this.generateReasoning(tweet, viabilityScore),
      estimatedVolume: this.estimateVolume(tweet.engagement, viabilityScore),
      riskFactors: this.identifyRiskFactors(tweet.text, category),
      opportunities: this.identifyOpportunities(tweet.text, category),
      recommendedAction: this.getRecommendation(viabilityScore)
    };
  }

  private categorizeContent(text: string): string {
    const categories = {
      'crypto': ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'defi', 'nft', 'blockchain'],
      'tech': ['ai', 'artificial intelligence', 'tech', 'startup', 'ipo', 'tesla', 'apple', 'google'],
      'sports': ['nfl', 'nba', 'mlb', 'fifa', 'olympics', 'championship', 'playoffs', 'season'],
      'politics': ['election', 'president', 'congress', 'senate', 'vote', 'policy', 'government'],
      'finance': ['stock', 'market', 'fed', 'interest rate', 'inflation', 'gdp', 'earnings'],
      'entertainment': ['movie', 'box office', 'oscar', 'netflix', 'streaming', 'celebrity'],
      'climate': ['climate', 'carbon', 'renewable', 'solar', 'wind', 'emissions', 'cop29']
    };

    const lowerText = text.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  private estimateTimeframe(text: string): string {
    const timeIndicators = {
      'next week': '1 week',
      'next month': '1 month',
      'end of year': '3 months',
      '2024': '2 months',
      '2025': '1 year',
      'q1': '3 months',
      'q2': '6 months',
      'q3': '9 months',
      'q4': '12 months'
    };

    const lowerText = text.toLowerCase();
    
    for (const [indicator, timeframe] of Object.entries(timeIndicators)) {
      if (lowerText.includes(indicator)) {
        return timeframe;
      }
    }
    
    return '3 months'; // Default timeframe
  }

  private calculateViabilityScore(tweet: TwitterSearchResult): number {
    let score = 0;

    // Base score from engagement
    const totalEngagement = tweet.engagement.likes + tweet.engagement.retweets + tweet.engagement.replies;
    const engagementScore = Math.min(totalEngagement / 5000, 0.4); // Max 0.4 from engagement
    score += engagementScore;

    // Relevance score
    score += tweet.relevanceScore * 0.3; // Max 0.3 from relevance

    // Market potential
    const potentialScores = { 'high': 0.3, 'medium': 0.2, 'low': 0.1 };
    score += potentialScores[tweet.marketPotential] || 0.1;

    // Bonus for specific indicators
    const text = tweet.text.toLowerCase();
    if (text.includes('announcement') || text.includes('decision') || text.includes('launch')) {
      score += 0.1;
    }
    if (text.includes('rumor') || text.includes('speculation')) {
      score -= 0.05; // Slightly reduce for rumors
    }

    return Math.min(score, 1.0); // Cap at 1.0
  }

  private refineMarketQuestion(originalQuestion: string): string {
    // Ensure the question is well-formed for a prediction market
    if (!originalQuestion.endsWith('?')) {
      originalQuestion += '?';
    }
    
    // Add "Will" if not present
    if (!originalQuestion.toLowerCase().startsWith('will')) {
      originalQuestion = 'Will ' + originalQuestion.charAt(0).toLowerCase() + originalQuestion.slice(1);
    }
    
    return originalQuestion;
  }

  private generateReasoning(tweet: TwitterSearchResult, viabilityScore: number): string {
    const engagement = tweet.engagement.likes + tweet.engagement.retweets;
    
    let reasoning = `High engagement (${engagement.toLocaleString()} interactions) indicates strong public interest. `;
    
    if (viabilityScore > 0.8) {
      reasoning += 'Excellent market potential due to clear timeline, verifiable outcome, and significant public attention.';
    } else if (viabilityScore > 0.6) {
      reasoning += 'Good market potential with moderate risk factors to consider.';
    } else {
      reasoning += 'Limited market potential due to unclear timeline or outcome criteria.';
    }
    
    return reasoning;
  }

  private estimateVolume(engagement: TwitterSearchResult['engagement'], viabilityScore: number): string {
    const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
    const baseVolume = totalEngagement * viabilityScore * 0.01; // Rough estimate
    
    if (baseVolume > 50) return '$50k+';
    if (baseVolume > 20) return '$20k-50k';
    if (baseVolume > 5) return '$5k-20k';
    return '$1k-5k';
  }

  private identifyRiskFactors(text: string, category: string): string[] {
    const risks: string[] = [];
    
    if (text.toLowerCase().includes('rumor') || text.toLowerCase().includes('speculation')) {
      risks.push('Based on unconfirmed information');
    }
    
    if (category === 'crypto') {
      risks.push('High volatility market');
      risks.push('Regulatory uncertainty');
    }
    
    if (category === 'politics') {
      risks.push('Subject to political changes');
      risks.push('Potential for manipulation');
    }
    
    if (!text.includes('date') && !text.includes('deadline')) {
      risks.push('Unclear timeline for resolution');
    }
    
    return risks;
  }

  private identifyOpportunities(text: string, category: string): string[] {
    const opportunities: string[] = [];
    
    if (text.toLowerCase().includes('announcement') || text.toLowerCase().includes('decision')) {
      opportunities.push('Clear resolution criteria');
    }
    
    if (category === 'crypto' || category === 'tech') {
      opportunities.push('High interest from crypto/tech community');
    }
    
    if (text.toLowerCase().includes('breaking') || text.toLowerCase().includes('major')) {
      opportunities.push('High media attention');
    }
    
    opportunities.push('Strong social media engagement');
    
    return opportunities;
  }

  private getRecommendation(viabilityScore: number): 'create' | 'monitor' | 'skip' {
    if (viabilityScore >= 0.8) return 'create';
    if (viabilityScore >= 0.6) return 'monitor';
    return 'skip';
  }
}
