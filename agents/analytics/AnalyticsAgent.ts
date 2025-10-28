import { AgentBuilder } from '@iqai/adk';
import { ATP } from "../../lib/mock-agents";
import { PredictionMarket } from "../prediction/PredictionMarketAgent";

export interface MarketAnalysis {
  marketId: string;
  aiPrediction: 'yes' | 'no';
  confidence: number;
  reasoning: string;
  factors: string[];
  lastUpdated: Date;
  historicalAccuracy?: number;
}

export interface TrendAnalysis {
  category: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  timeframe: string;
  keyEvents: string[];
}

/**
 * Analytics Agent - Powered by IQ ADK + ATP
 * 
 * Responsibilities:
 * - Analyze prediction markets using AI
 * - Provide outcome predictions and confidence scores
 * - Track market trends and patterns
 * - Generate insights for users
 */
export class AnalyticsAgent {
  private agent: any;
  private runner: any;
  private session: any;
  private atp: ATP;
  private marketAnalyses: Map<string, MarketAnalysis>;
  private trendAnalyses: Map<string, TrendAnalysis>;
  private predictionHistory: Array<{
    marketId: string;
    prediction: string;
    confidence: number;
    actualOutcome?: string;
    timestamp: Date;
  }>;

  constructor() {
    
    this.atp = new ATP({
      apiKey: process.env.IQ_ATP_API_KEY,
    });

    this.marketAnalyses = new Map();
    this.trendAnalyses = new Map();
    this.predictionHistory = [];
  }

  async initialize() {
    const { agent, runner, session } = await AgentBuilder
      .create('analytics_agent')
      .withModel('gpt-4o-mini')
      .withDescription('AI agent that analyzes prediction markets and provides insights using ATP')
      .withInstruction(`
        You are an Analytics Agent specialized in prediction market analysis and insights.
        
        Your responsibilities:
        1. Analyze prediction markets using AI
        2. Provide outcome predictions and confidence scores
        3. Track market trends and patterns
        4. Generate insights for users
        
        Focus on:
        - Accurate market analysis using ATP
        - Data-driven predictions and insights
        - Trend identification across categories
        - User-friendly analytics dashboards
      `)
      .build();

    this.agent = agent;
    this.runner = runner;
    this.session = session;
    
    return { agent, runner, session };
  }

  async run() {
    console.log('📈 Analytics Agent: Analyzing markets and trends...');
    
    try {
      // Update market predictions
      await this.updateMarketPredictions();
      
      // Analyze category trends
      await this.analyzeCategoryTrends();
      
      // Update accuracy metrics
      await this.updateAccuracyMetrics();
      
    } catch (error) {
      console.error('❌ Analytics Agent error:', error);
    }
  }

  /**
   * Analyze a specific market and provide AI prediction
   */
  private async analyzeMarket(market: PredictionMarket): Promise<MarketAnalysis> {
    console.log('🔍 Analyzing market:', market.title);

    const prompt = `
    Analyze this Web3 prediction market and provide your assessment:
    
    Market: ${market.title}
    Description: ${market.description}
    Category: ${market.category}
    End Date: ${market.endDate}
    Current Pool: ${market.totalPool} USDC
    Yes Shares: ${market.yesShares}
    No Shares: ${market.noShares}
    
    Consider:
    1. Historical precedents for similar events
    2. Current market conditions in Web3
    3. Technical feasibility and timeline
    4. Regulatory environment
    5. Market sentiment and adoption trends
    
    Provide analysis in JSON format:
    {
      "prediction": "yes|no",
      "confidence": 0.75,
      "reasoning": "Detailed explanation of your analysis",
      "factors": ["factor1", "factor2", "factor3"],
      "riskFactors": ["risk1", "risk2"],
      "marketSentiment": "bullish|bearish|neutral"
    }
    `;

    try {
      const response = await this.atp.analyze({
        prompt,
        model: 'gpt-4',
        temperature: 0.2,
      });

      const analysis = JSON.parse(response.content);
      
      const marketAnalysis: MarketAnalysis = {
        marketId: market.id,
        aiPrediction: analysis.prediction,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        factors: analysis.factors,
        lastUpdated: new Date(),
      };

      // Store analysis
      this.marketAnalyses.set(market.id, marketAnalysis);
      
      // Add to prediction history
      this.predictionHistory.push({
        marketId: market.id,
        prediction: analysis.prediction,
        confidence: analysis.confidence,
        timestamp: new Date(),
      });

      console.log('✅ Market analysis completed:', market.id, 'Prediction:', analysis.prediction);
      
      // Log analysis update
      console.log('📊 Analysis updated event:', marketAnalysis.marketId);
      
      return marketAnalysis;

    } catch (error) {
      console.error('❌ Failed to analyze market:', error);
      throw error;
    }
  }

  /**
   * Update predictions for all active markets
   */
  private async updateMarketPredictions() {
    console.log('🔄 Updating market predictions...');
    
    // This would get active markets from the Prediction Market Agent
    // For now, we'll simulate some markets
    const mockMarkets: PredictionMarket[] = [
      {
        id: 'market-1',
        eventId: 'event-1',
        title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
        description: 'Coinbase has announced plans for a Layer 2 solution...',
        category: 'launch',
        contractAddress: '0x123...',
        totalPool: '5000',
        yesShares: '3000',
        noShares: '2000',
        createdAt: new Date(),
        endDate: new Date('2024-12-31'),
        resolved: false,
      }
    ];

    for (const market of mockMarkets) {
      try {
        await this.analyzeMarket(market);
      } catch (error) {
        console.error(`❌ Failed to analyze market ${market.id}:`, error);
      }
    }
  }

  /**
   * Analyze trends across different Web3 categories
   */
  private async analyzeCategoryTrends() {
    console.log('📊 Analyzing category trends...');

    const categories = ['airdrop', 'launch', 'listing', 'governance', 'defi', 'nft'];
    
    for (const category of categories) {
      try {
        const trendAnalysis = await this.analyzeCategoryTrend(category);
        this.trendAnalyses.set(category, trendAnalysis);
      } catch (error) {
        console.error(`❌ Failed to analyze ${category} trends:`, error);
      }
    }
  }

  /**
   * Analyze trends for a specific category
   */
  private async analyzeCategoryTrend(category: string): Promise<TrendAnalysis> {
    const prompt = `
    Analyze current trends in the Web3 ${category} space:
    
    Category: ${category}
    Timeframe: Last 30 days
    
    Consider:
    1. Recent events and announcements
    2. Market sentiment and adoption
    3. Regulatory developments
    4. Technical innovations
    5. Community engagement
    
    Provide trend analysis in JSON format:
    {
      "trend": "bullish|bearish|neutral",
      "strength": 0.8,
      "keyEvents": ["event1", "event2", "event3"],
      "outlook": "Short summary of outlook",
      "riskFactors": ["risk1", "risk2"]
    }
    `;

    try {
      const response = await this.atp.analyze({
        prompt,
        model: 'gpt-4',
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.content);
      
      return {
        category,
        trend: analysis.trend,
        strength: analysis.strength,
        timeframe: '30d',
        keyEvents: analysis.keyEvents,
      };

    } catch (error) {
      console.error(`❌ Failed to analyze ${category} trend:`, error);
      throw error;
    }
  }

  /**
   * Update accuracy metrics based on resolved markets
   */
  private async updateAccuracyMetrics() {
    console.log('📊 Updating accuracy metrics...');

    // Calculate accuracy for resolved predictions
    const resolvedPredictions = this.predictionHistory.filter(p => p.actualOutcome);
    
    if (resolvedPredictions.length === 0) {
      return;
    }

    const correctPredictions = resolvedPredictions.filter(
      p => p.prediction === p.actualOutcome
    );

    const overallAccuracy = correctPredictions.length / resolvedPredictions.length;
    
    console.log(`📈 Overall prediction accuracy: ${(overallAccuracy * 100).toFixed(1)}%`);

    // Update individual market analyses with historical accuracy
    for (const [marketId, analysis] of this.marketAnalyses) {
      const historicalPredictions = this.predictionHistory.filter(
        p => p.marketId === marketId && p.actualOutcome
      );

      if (historicalPredictions.length > 0) {
        const correct = historicalPredictions.filter(
          p => p.prediction === p.actualOutcome
        ).length;
        
        analysis.historicalAccuracy = correct / historicalPredictions.length;
      }
    }
  }

  /**
   * Get AI prediction for a specific market
   */
  public getMarketAnalysis(marketId: string): MarketAnalysis | undefined {
    return this.marketAnalyses.get(marketId);
  }

  /**
   * Get trend analysis for a category
   */
  public getCategoryTrend(category: string): TrendAnalysis | undefined {
    return this.trendAnalyses.get(category);
  }

  /**
   * Get overall analytics dashboard data
   */
  public getDashboardData() {
    const totalPredictions = this.predictionHistory.length;
    const resolvedPredictions = this.predictionHistory.filter(p => p.actualOutcome).length;
    const correctPredictions = this.predictionHistory.filter(
      p => p.actualOutcome && p.prediction === p.actualOutcome
    ).length;

    const accuracy = resolvedPredictions > 0 ? correctPredictions / resolvedPredictions : 0;
    
    const averageConfidence = this.predictionHistory.length > 0 
      ? this.predictionHistory.reduce((sum, p) => sum + p.confidence, 0) / this.predictionHistory.length
      : 0;

    return {
      totalPredictions,
      resolvedPredictions,
      accuracy: (accuracy * 100).toFixed(1),
      averageConfidence: (averageConfidence * 100).toFixed(1),
      activeAnalyses: this.marketAnalyses.size,
      categoryTrends: Array.from(this.trendAnalyses.values()),
    };
  }

  /**
   * Generate market insights
   */
  private async generateMarketInsights() {
    const prompt = `
    Based on current Web3 prediction markets and trends, provide key insights:
    
    Active Markets: ${this.marketAnalyses.size}
    Categories: ${Array.from(this.trendAnalyses.keys()).join(', ')}
    
    Generate 3-5 key insights about:
    1. Most promising opportunities
    2. Emerging trends to watch
    3. Risk factors in the market
    4. Recommended strategies for users
    
    Format as JSON array: [{"title": "Insight Title", "description": "Detailed insight"}]
    `;

    try {
      const response = await this.atp.analyze({
        prompt,
        model: 'gpt-4',
        temperature: 0.4,
      });

      const insights = JSON.parse(response.content);
      
      console.log('💡 Insights generated event:', insights.length, 'insights');
      return insights;

    } catch (error) {
      console.error('❌ Failed to generate insights:', error);
      return [];
    }
  }

  /**
   * Handle market resolution to update prediction accuracy
   */
  private async handleMarketResolution(resolutionData: any) {
    console.log('✅ Updating prediction accuracy for resolved market:', resolutionData.marketId);

    // Find predictions for this market
    const marketPredictions = this.predictionHistory.filter(
      p => p.marketId === resolutionData.marketId
    );

    // Update with actual outcome
    marketPredictions.forEach(prediction => {
      prediction.actualOutcome = resolutionData.outcome;
    });

    // Recalculate accuracy metrics
    await this.updateAccuracyMetrics();
  }

  /**
   * Analyze market from external request
   */
  public async analyzeMarketFromEvent(market: PredictionMarket): Promise<MarketAnalysis> {
    return await this.analyzeMarket(market);
  }

  /**
   * Update predictions from external request
   */
  public async updatePredictionsFromEvent() {
    return await this.updateMarketPredictions();
  }

  /**
   * Handle market resolution from external request
   */
  public async handleMarketResolutionFromEvent(resolutionData: any) {
    return await this.handleMarketResolution(resolutionData);
  }

  /**
   * Generate insights from external request
   */
  public async generateInsightsFromEvent() {
    return await this.generateMarketInsights();
  }
}
