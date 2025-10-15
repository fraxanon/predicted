export interface MarketRecommendation {
  id: string;
  title: string;
  category: string;
  confidence: number;
  expectedReturn: number;
  currentOdds: number;
  endDate: string;
}

export interface MarketData {
  id: string;
  title: string;
  category: string;
  endDate: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  trending?: boolean;
  chance: number;
}

export interface ProphetRecommendation extends MarketRecommendation {
  marketData: MarketData;
  investmentAmount: number;
  projectedProfit: number;
  riskScore: number;
}

export class ProphetMarketConnector {
  private static instance: ProphetMarketConnector;
  
  static getInstance(): ProphetMarketConnector {
    if (!ProphetMarketConnector.instance) {
      ProphetMarketConnector.instance = new ProphetMarketConnector();
    }
    return ProphetMarketConnector.instance;
  }

  /**
   * Analyzes available markets and returns Prophet's top recommendations
   */
  async analyzeMarkets(markets: MarketData[], budget: number, userPreferences: any): Promise<ProphetRecommendation[]> {
    // Simulate Prophet AI analysis
    const analysisResults = markets.map(market => this.analyzeMarket(market, userPreferences));
    
    // Sort by confidence and expected return
    const sortedResults = analysisResults
      .filter(result => result.confidence >= (userPreferences.minConfidence || 70))
      .sort((a, b) => {
        const aScore = (a.confidence / 100) * a.expectedReturn;
        const bScore = (b.confidence / 100) * b.expectedReturn;
        return bScore - aScore;
      });

    // Take top 5 recommendations
    const topRecommendations = sortedResults.slice(0, 5);
    
    // Calculate investment amounts (equal distribution)
    const investmentPerMarket = Math.floor(budget / topRecommendations.length);
    
    return topRecommendations.map(rec => ({
      ...rec,
      marketData: markets.find(m => m.id === rec.id)!,
      investmentAmount: investmentPerMarket,
      projectedProfit: Math.round(investmentPerMarket * (rec.expectedReturn - 1)),
      riskScore: this.calculateRiskScore(rec, markets.find(m => m.id === rec.id)!)
    }));
  }

  /**
   * Analyzes a single market and returns Prophet's assessment
   */
  private analyzeMarket(market: MarketData, userPreferences: any): MarketRecommendation {
    // Mock AI analysis - in production this would use real ML models
    const baseConfidence = this.calculateBaseConfidence(market);
    const categoryBonus = this.getCategoryBonus(market.category, userPreferences);
    const volumeBonus = this.getVolumeBonus(market.volume);
    const timeBonus = this.getTimeBonus(market.endDate);
    
    const confidence = Math.min(95, Math.max(50, 
      baseConfidence + categoryBonus + volumeBonus + timeBonus
    ));

    const expectedReturn = this.calculateExpectedReturn(market, confidence);

    return {
      id: market.id,
      title: market.title,
      category: market.category,
      confidence,
      expectedReturn,
      currentOdds: market.yesPrice / 100,
      endDate: market.endDate
    };
  }

  private calculateBaseConfidence(market: MarketData): number {
    // Analyze market fundamentals
    const priceConfidence = Math.abs(market.yesPrice - 50) / 50 * 20; // Higher confidence for extreme prices
    const categoryConfidence = this.getCategoryBaseConfidence(market.category);
    
    return Math.round(60 + priceConfidence + categoryConfidence);
  }

  private getCategoryBaseConfidence(category: string): number {
    const categoryConfidenceMap: { [key: string]: number } = {
      'Crypto': 15,
      'AI/Tech': 12,
      'Tech': 10,
      'Stocks': 8,
      'Politics': 5,
      'Sports': 3,
      'Entertainment': 2
    };
    
    return categoryConfidenceMap[category] || 5;
  }

  private getCategoryBonus(category: string, userPreferences: any): number {
    if (!userPreferences.interestCategories) return 0;
    
    const categoryMap: { [key: string]: string } = {
      'Crypto': 'defi',
      'AI/Tech': 'ai',
      'Tech': 'tech',
      'Stocks': 'stocks'
    };
    
    const prefKey = categoryMap[category];
    return (prefKey && userPreferences.interestCategories[prefKey]) ? 5 : 0;
  }

  private getVolumeBonus(volume: string): number {
    const volumeNum = parseFloat(volume.replace(/[^0-9.]/g, ''));
    if (volumeNum > 100) return 8;
    if (volumeNum > 50) return 5;
    if (volumeNum > 20) return 3;
    return 0;
  }

  private getTimeBonus(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEnd < 7) return -5; // Too soon, risky
    if (daysUntilEnd < 30) return 5; // Good timeframe
    if (daysUntilEnd < 90) return 3; // Decent timeframe
    return 0; // Too far out
  }

  private calculateExpectedReturn(market: MarketData, confidence: number): number {
    // Calculate expected return based on odds and confidence
    const impliedProbability = market.yesPrice / 100;
    const aiProbability = confidence / 100;
    
    // If AI is more confident than market, higher expected return
    if (aiProbability > impliedProbability + 0.1) {
      return 1 + ((1 / impliedProbability) - 1) * 0.8; // 80% of theoretical max return
    }
    
    return 1 + ((1 / impliedProbability) - 1) * 0.6; // 60% of theoretical max return
  }

  private calculateRiskScore(recommendation: MarketRecommendation, market: MarketData): number {
    // Risk score from 1-10 (1 = low risk, 10 = high risk)
    let riskScore = 5; // Base risk
    
    // Confidence adjustment
    if (recommendation.confidence > 85) riskScore -= 2;
    else if (recommendation.confidence < 65) riskScore += 2;
    
    // Category risk adjustment
    const categoryRisk: { [key: string]: number } = {
      'Crypto': 3,
      'AI/Tech': 2,
      'Tech': 1,
      'Stocks': 0,
      'Politics': 4,
      'Sports': 2
    };
    
    riskScore += categoryRisk[market.category] || 1;
    
    // Volume adjustment (higher volume = lower risk)
    const volumeNum = parseFloat(market.volume.replace(/[^0-9.]/g, ''));
    if (volumeNum > 100) riskScore -= 1;
    else if (volumeNum < 20) riskScore += 1;
    
    return Math.max(1, Math.min(10, riskScore));
  }

  /**
   * Simulates real-time market monitoring and updates
   */
  async monitorMarkets(recommendations: ProphetRecommendation[]): Promise<ProphetRecommendation[]> {
    // Simulate market changes and update recommendations
    return recommendations.map(rec => {
      const priceChange = (Math.random() - 0.5) * 0.1; // ±5% price change
      const newYesPrice = Math.max(5, Math.min(95, rec.marketData.yesPrice + (priceChange * 100)));
      
      return {
        ...rec,
        marketData: {
          ...rec.marketData,
          yesPrice: Math.round(newYesPrice),
          noPrice: Math.round(100 - newYesPrice)
        },
        confidence: Math.max(50, Math.min(95, rec.confidence + (Math.random() - 0.5) * 5))
      };
    });
  }

  /**
   * Executes autonomous investment based on Prophet recommendations
   */
  async executeAutonomousInvestment(
    recommendations: ProphetRecommendation[], 
    userAddress: string,
    preferences: any
  ): Promise<{ success: boolean; investments: any[]; totalInvested: number }> {
    if (!preferences.x402Authorized || !preferences.autoInvestmentEnabled) {
      return { success: false, investments: [], totalInvested: 0 };
    }

    const investments = [];
    let totalInvested = 0;

    for (const rec of recommendations) {
      if (rec.confidence >= (preferences.minConfidence || 70)) {
        // Simulate X402 investment
        const investment = {
          marketId: rec.id,
          amount: rec.investmentAmount,
          currency: preferences.preferredCurrency || 'USDC',
          prediction: rec.confidence > 75 ? 'yes' : 'no',
          timestamp: new Date(),
          expectedReturn: rec.projectedProfit,
          confidence: rec.confidence
        };

        investments.push(investment);
        totalInvested += rec.investmentAmount;

        // Save to localStorage (in production, this would be API calls)
        this.saveInvestmentRecord(userAddress, investment);
      }
    }

    return { success: true, investments, totalInvested };
  }

  private saveInvestmentRecord(userAddress: string, investment: any): void {
    const key = `agent-investments-${userAddress}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(investment);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}
