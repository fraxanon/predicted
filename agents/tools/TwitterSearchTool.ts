// Custom tool interface to avoid ADK ESM issues
interface ToolConfig {
  name: string;
  description: string;
}

abstract class CustomTool {
  name: string;
  description: string;
  
  constructor(config: ToolConfig) {
    this.name = config.name;
    this.description = config.description;
  }
  
  abstract execute(params: any): Promise<any>;
}

export interface TwitterSearchResult {
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

export class TwitterSearchTool extends CustomTool {
  name = 'twitter_search';
  description = 'Search Twitter for trending topics and news that could become prediction markets';

  schema = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query for Twitter content (e.g., "crypto", "AI", "politics", "sports")'
      },
      timeframe: {
        type: 'string',
        enum: ['1h', '24h', '7d'],
        description: 'Time frame for search results',
        default: '24h'
      },
      minEngagement: {
        type: 'number',
        description: 'Minimum engagement threshold (likes + retweets)',
        default: 100
      }
    },
    required: ['query']
  } as const;

  async execute(params: {
    query: string;
    timeframe?: string;
    minEngagement?: number;
  }): Promise<TwitterSearchResult[]> {
    const { query, timeframe = '24h', minEngagement = 100 } = params;

    // Try to use real Twitter API if bearer token is available
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (bearerToken) {
      try {
        return await this.searchTwitterAPI(query, timeframe, minEngagement, bearerToken);
      } catch (error) {
        console.warn('Twitter API failed, falling back to mock data:', error);
      }
    }

    // Fallback to mock Twitter search results
    const mockResults: TwitterSearchResult[] = [
      {
        id: 'tweet_1',
        text: `🚀 BREAKING: Major tech company announces new AI breakthrough that could revolutionize autonomous vehicles. Stock up 15% in pre-market trading. #AI #Tech #Innovation`,
        author: '@TechReporter',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 2450, retweets: 890, replies: 234 },
        relevanceScore: 0.92,
        marketPotential: 'high',
        suggestedMarketQuestion: 'Will this AI breakthrough lead to commercial autonomous vehicles by Q2 2025?'
      },
      {
        id: 'tweet_2',
        text: `Bitcoin ETF approval rumors circulating again. Multiple sources suggest SEC decision coming within 30 days. Could this be the catalyst we've been waiting for? $BTC #Bitcoin #ETF`,
        author: '@CryptoAnalyst',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 1890, retweets: 567, replies: 123 },
        relevanceScore: 0.88,
        marketPotential: 'high',
        suggestedMarketQuestion: 'Will a Bitcoin ETF be approved by the SEC before end of 2024?'
      },
      {
        id: 'tweet_3',
        text: `🏈 NFL playoffs heating up! Chiefs looking unstoppable this season. Could they go undefeated? Last undefeated season was 1972 Dolphins. #NFL #Chiefs #Playoffs`,
        author: '@SportsInsider',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 1234, retweets: 445, replies: 89 },
        relevanceScore: 0.75,
        marketPotential: 'medium',
        suggestedMarketQuestion: 'Will the Kansas City Chiefs finish the regular season undefeated?'
      },
      {
        id: 'tweet_4',
        text: `Climate summit next week - leaked documents suggest major carbon tax announcement. Oil companies already adjusting strategies. Could see massive market shifts. #Climate #COP29`,
        author: '@ClimateNews',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 987, retweets: 234, replies: 56 },
        relevanceScore: 0.82,
        marketPotential: 'high',
        suggestedMarketQuestion: 'Will a global carbon tax be announced at COP29 climate summit?'
      },
      {
        id: 'tweet_5',
        text: `Elon Musk teasing "major announcement" for next week. Tesla stock already moving on speculation. History shows his announcements can be game-changers. #Tesla #ElonMusk`,
        author: '@MarketWatch',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        engagement: { likes: 3456, retweets: 1234, replies: 567 },
        relevanceScore: 0.95,
        marketPotential: 'high',
        suggestedMarketQuestion: 'Will Elon Musk announce a new Tesla product line next week?'
      }
    ];

    // Filter results based on query relevance and engagement
    const filteredResults = mockResults.filter(result => {
      const queryRelevant = result.text.toLowerCase().includes(query.toLowerCase()) ||
                           result.suggestedMarketQuestion.toLowerCase().includes(query.toLowerCase());
      const engagementMet = (result.engagement.likes + result.engagement.retweets) >= minEngagement;
      
      return queryRelevant && engagementMet;
    });

    // Sort by relevance score and engagement
    return filteredResults
      .sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.retweets;
        const bEngagement = b.engagement.likes + b.engagement.retweets;
        return (b.relevanceScore * bEngagement) - (a.relevanceScore * aEngagement);
      })
      .slice(0, 10); // Return top 10 results
  }

  private async searchTwitterAPI(
    query: string, 
    timeframe: string, 
    minEngagement: number, 
    bearerToken: string
  ): Promise<TwitterSearchResult[]> {
    const timeMap = {
      '1h': new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      '24h': new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const startTime = timeMap[timeframe as keyof typeof timeMap] || timeMap['24h'];
    
    // Twitter API v2 search endpoint
    const searchUrl = new URL('https://api.twitter.com/2/tweets/search/recent');
    searchUrl.searchParams.append('query', `${query} -is:retweet lang:en`);
    searchUrl.searchParams.append('start_time', startTime);
    searchUrl.searchParams.append('max_results', '100');
    searchUrl.searchParams.append('tweet.fields', 'created_at,author_id,public_metrics,context_annotations');
    searchUrl.searchParams.append('user.fields', 'username,name,verified');
    searchUrl.searchParams.append('expansions', 'author_id');

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Create user lookup map
    const users = data.includes?.users || [];
    const userMap = users.reduce((acc: any, user: any) => {
      acc[user.id] = user;
      return acc;
    }, {});

    // Transform Twitter API response to our format
    const results: TwitterSearchResult[] = data.data
      .filter((tweet: any) => {
        const engagement = (tweet.public_metrics?.like_count || 0) + 
                          (tweet.public_metrics?.retweet_count || 0);
        return engagement >= minEngagement;
      })
      .map((tweet: any) => {
        const user = userMap[tweet.author_id];
        const engagement = {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0
        };

        const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
        
        return {
          id: tweet.id,
          text: tweet.text,
          author: user ? `@${user.username}` : '@unknown',
          timestamp: tweet.created_at,
          engagement,
          relevanceScore: this.calculateRelevanceScore(tweet.text, query, totalEngagement),
          marketPotential: this.assessMarketPotential(tweet.text, totalEngagement),
          suggestedMarketQuestion: this.generateMarketQuestion(tweet.text)
        };
      })
      .sort((a: TwitterSearchResult, b: TwitterSearchResult) => {
        const aScore = a.relevanceScore * (a.engagement.likes + a.engagement.retweets);
        const bScore = b.relevanceScore * (b.engagement.likes + b.engagement.retweets);
        return bScore - aScore;
      })
      .slice(0, 10);

    return results;
  }

  private calculateRelevanceScore(text: string, query: string, engagement: number): number {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    let score = 0;
    
    // Direct query match
    if (lowerText.includes(lowerQuery)) score += 0.5;
    
    // Keyword relevance
    const queryWords = lowerQuery.split(' ');
    const matchedWords = queryWords.filter(word => lowerText.includes(word));
    score += (matchedWords.length / queryWords.length) * 0.3;
    
    // Engagement boost
    score += Math.min(engagement / 10000, 0.2);
    
    return Math.min(score, 1.0);
  }

  private assessMarketPotential(text: string, engagement: number): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase();
    
    // High potential indicators
    const highIndicators = ['announcement', 'decision', 'launch', 'release', 'approval', 'breaking'];
    const mediumIndicators = ['rumor', 'speculation', 'expected', 'likely', 'possible'];
    
    if (engagement > 5000 && highIndicators.some(indicator => lowerText.includes(indicator))) {
      return 'high';
    }
    
    if (engagement > 1000 || mediumIndicators.some(indicator => lowerText.includes(indicator))) {
      return 'medium';
    }
    
    return 'low';
  }

  private generateMarketQuestion(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Extract key elements for market question
    if (lowerText.includes('will') && lowerText.includes('?')) {
      // Already a question, clean it up
      const match = text.match(/will[^?]*\?/i);
      if (match) return match[0];
    }
    
    // Generate question based on content patterns
    if (lowerText.includes('announcement') || lowerText.includes('announce')) {
      return `Will the mentioned announcement be officially confirmed within 30 days?`;
    }
    
    if (lowerText.includes('launch') || lowerText.includes('release')) {
      return `Will the mentioned product/service launch successfully by end of 2024?`;
    }
    
    if (lowerText.includes('approval') || lowerText.includes('decision')) {
      return `Will the mentioned approval/decision be granted within 90 days?`;
    }
    
    // Generic fallback
    return `Will the event mentioned in this tweet occur within the next 6 months?`;
  }
}
