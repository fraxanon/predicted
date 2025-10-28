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

export class TwitterMarketScoutSimple {
  private twitterTool: TwitterSearchTool;
  private analysisTool: MarketAnalysisTool;
  private openaiApiKey: string | undefined;

  constructor() {
    // Initialize tools 
    this.twitterTool = new TwitterSearchTool();
    this.analysisTool = new MarketAnalysisTool();
    
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async initialize() {
    console.log('🤖 TwitterMarketScout initialized (Simple mode - no ADK dependency)');
    return { success: true };
  }

  async scoutMarkets(
    searchQueries: string[] = ['crypto', 'AI', 'bitcoin', 'tech', 'election'],
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

  // Enhanced analysis with OpenAI (if API key available)
  async enhanceAnalysisWithAI(analyses: MarketAnalysis[]): Promise<MarketAnalysis[]> {
    if (!this.openaiApiKey || analyses.length === 0) {
      return analyses;
    }

    console.log('🧠 Enhancing analysis with OpenAI...');

    try {
      // Use OpenAI to enhance the market questions and reasoning
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert at creating prediction market questions. Your job is to refine market questions to be:
1. Clear and unambiguous
2. Verifiable with objective outcomes
3. Time-bound with specific deadlines
4. Engaging for traders

Respond with JSON array of enhanced analyses.`
            },
            {
              role: 'user',
              content: `Please enhance these prediction market analyses:\n${JSON.stringify(analyses.slice(0, 3), null, 2)}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (response.ok) {
        const result = await response.json();
        const enhancedAnalyses = JSON.parse(result.choices[0].message.content);
        
        // Merge enhanced analyses with original ones
        return analyses.map((original, index) => {
          const enhanced = enhancedAnalyses[index];
          return enhanced ? { ...original, ...enhanced } : original;
        });
      }
    } catch (error) {
      console.warn('⚠️ OpenAI enhancement failed, using original analysis:', error);
    }

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
🤖 TWITTER MARKET SCOUT REPORT (Simple Mode)
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
