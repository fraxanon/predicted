import { AgentBuilder } from '@iqai/adk';
import { TwitterSearchTool, TwitterSearchResult } from './tools/TwitterSearchTool';
import { MarketAnalysisTool, MarketAnalysis } from './tools/MarketAnalysisTool';

export interface ScoutReport {
  timestamp: string;
  searchQuery: string;
  totalTweetsAnalyzed: number;
  viableMarkets: MarketAnalysis[];
  topRecommendations: MarketAnalysis[];
  summary: string;
}

export class TwitterMarketScout {
  private agent: any;
  private twitterTool: TwitterSearchTool;
  private analysisTool: MarketAnalysisTool;

  constructor() {
    // Initialize tools with proper config - BaseTool requires name and description
    this.twitterTool = new TwitterSearchTool({
      name: 'twitter_search',
      description: 'Search Twitter for trending topics and news that could become prediction markets'
    });
    this.analysisTool = new MarketAnalysisTool({
      name: 'analyze_market_potential', 
      description: 'Analyze Twitter content to determine prediction market viability and generate market questions'
    });
  }

  async initialize(apiKey?: string) {
    // Initialize the ADK agent with tools
    const { agent, runner, session } = await AgentBuilder
      .create('twitter_market_scout')
      .withModel('gpt-4o-mini') // Using OpenAI GPT-4o-mini with provided API key
      .withDescription('An AI agent that scouts Twitter for potential prediction market opportunities')
      .withInstruction(`
        You are a Twitter Market Scout agent specialized in identifying trending topics and news that could become successful prediction markets.
        
        Your responsibilities:
        1. Search Twitter for trending topics and breaking news
        2. Analyze content for prediction market viability
        3. Generate well-formed market questions
        4. Assess risk factors and opportunities
        5. Provide actionable recommendations
        
        Focus on:
        - Clear, verifiable outcomes
        - Reasonable timeframes (1 week to 1 year)
        - High public interest topics
        - Avoid overly speculative or manipulable events
        
        Categories to prioritize:
        - Cryptocurrency and DeFi
        - Technology announcements
        - Sports events and championships
        - Political decisions and elections
        - Corporate earnings and IPOs
        - Climate and environmental policies
      `)
      .withTools(this.twitterTool, this.analysisTool)
      .build();

    this.agent = agent;
    return { agent, runner, session };
  }

  async scoutMarkets(
    searchQueries: string[] = ['crypto', 'tech', 'AI', 'bitcoin', 'election'],
    options: {
      timeframe?: string;
      minEngagement?: number;
      maxResults?: number;
    } = {}
  ): Promise<ScoutReport> {
    const { timeframe = '24h', minEngagement = 100, maxResults = 20 } = options;
    
    console.log('🔍 Starting Twitter market scouting...');
    
    let allTweets: TwitterSearchResult[] = [];
    let allAnalyses: MarketAnalysis[] = [];

    // Search for each query
    for (const query of searchQueries) {
      console.log(`🐦 Searching Twitter for: "${query}"`);
      
      try {
        const tweets = await this.twitterTool.execute({
          query,
          timeframe,
          minEngagement
        });
        
        console.log(`📊 Found ${tweets.length} relevant tweets for "${query}"`);
        allTweets.push(...tweets);

        if (tweets.length > 0) {
          const analyses = await this.analysisTool.execute({
            twitterResults: tweets,
            focusArea: query
          });
          
          console.log(`💡 Generated ${analyses.length} market analyses for "${query}"`);
          allAnalyses.push(...analyses);
        }
      } catch (error) {
        console.error(`❌ Error processing query "${query}":`, error);
      }
    }

    // Remove duplicates and sort by viability
    const uniqueAnalyses = this.deduplicateAnalyses(allAnalyses);
    const viableMarkets = uniqueAnalyses.filter(analysis => analysis.recommendedAction !== 'skip');
    const topRecommendations = viableMarkets
      .filter(analysis => analysis.recommendedAction === 'create')
      .slice(0, 5);

    const report: ScoutReport = {
      timestamp: new Date().toISOString(),
      searchQuery: searchQueries.join(', '),
      totalTweetsAnalyzed: allTweets.length,
      viableMarkets: viableMarkets.slice(0, maxResults),
      topRecommendations,
      summary: this.generateSummary(viableMarkets, topRecommendations)
    };

    console.log('✅ Market scouting complete!');
    console.log(`📈 Found ${viableMarkets.length} viable markets, ${topRecommendations.length} top recommendations`);
    
    return report;
  }

  async analyzeSpecificTopic(topic: string): Promise<MarketAnalysis[]> {
    console.log(`🎯 Deep analysis for topic: "${topic}"`);
    
    const tweets = await this.twitterTool.execute({
      query: topic,
      timeframe: '24h',
      minEngagement: 50
    });

    if (tweets.length === 0) {
      console.log('📭 No relevant tweets found for this topic');
      return [];
    }

    const analyses = await this.analysisTool.execute({
      twitterResults: tweets,
      focusArea: topic
    });

    console.log(`💡 Generated ${analyses.length} market opportunities for "${topic}"`);
    return analyses;
  }

  private deduplicateAnalyses(analyses: MarketAnalysis[]): MarketAnalysis[] {
    const seen = new Set<string>();
    return analyses.filter(analysis => {
      const key = analysis.question.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private generateSummary(viableMarkets: MarketAnalysis[], topRecommendations: MarketAnalysis[]): string {
    const categories = viableMarkets.reduce((acc, market) => {
      acc[market.category] = (acc[market.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat, count]) => `${cat} (${count})`)
      .join(', ');

    const avgViability = viableMarkets.length > 0 
      ? (viableMarkets.reduce((sum, m) => sum + m.viabilityScore, 0) / viableMarkets.length).toFixed(2)
      : '0';

    return `Analyzed ${viableMarkets.length} viable prediction markets across categories: ${topCategories}. ` +
           `Average viability score: ${avgViability}. ` +
           `${topRecommendations.length} markets recommended for immediate creation. ` +
           `Key opportunities in ${topCategories.split(',')[0] || 'various sectors'}.`;
  }

  // Utility method to get a formatted report
  getFormattedReport(report: ScoutReport): string {
    let output = `
🤖 TWITTER MARKET SCOUT REPORT
Generated: ${new Date(report.timestamp).toLocaleString()}
Query: ${report.searchQuery}

📊 SUMMARY
${report.summary}

🎯 TOP RECOMMENDATIONS (${report.topRecommendations.length})
`;

    report.topRecommendations.forEach((rec, index) => {
      output += `
${index + 1}. ${rec.question}
   Category: ${rec.category} | Viability: ${(rec.viabilityScore * 100).toFixed(0)}%
   Timeframe: ${rec.timeframe} | Est. Volume: ${rec.estimatedVolume}
   Reasoning: ${rec.reasoning}
`;
    });

    if (report.viableMarkets.length > report.topRecommendations.length) {
      output += `
📈 OTHER VIABLE MARKETS (${report.viableMarkets.length - report.topRecommendations.length})
`;
      
      report.viableMarkets
        .filter(m => m.recommendedAction !== 'create')
        .slice(0, 5)
        .forEach((market, index) => {
          output += `${index + 1}. ${market.question} (${market.category}, ${(market.viabilityScore * 100).toFixed(0)}%)\n`;
        });
    }

    return output;
  }
}
