'use client';

import { useState } from 'react';
// MarketAnalysis interface (copied from disabled agents folder)
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

interface ScoutReport {
  timestamp: string;
  searchQuery: string;
  totalTweetsAnalyzed: number;
  viableMarkets: MarketAnalysis[];
  topRecommendations: MarketAnalysis[];
  summary: string;
}

export function TwitterMarketScout() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ScoutReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');

  const defaultQueries = ['crypto', 'AI', 'bitcoin', 'tech', 'election', 'sports'];

  const scoutMarkets = async (queries: string[] = defaultQueries) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the main scout endpoint with proper agent implementation
      console.log('Using Twitter Market Scout with agent tools...');
      const response = await fetch('/api/scout-markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queries,
          timeframe: '24h',
          minEngagement: 100,
          maxResults: 10
        }),
      });

      const result = await response.json();

      if (result.success) {
        setReport(result.data);
      } else {
        setError(result.error || 'Failed to scout markets');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Scout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCustomTopic = async () => {
    if (!customQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the main scout endpoint with proper agent implementation
      console.log('Using Twitter Market Scout for topic analysis...');
      const response = await fetch(`/api/scout-markets?topic=${encodeURIComponent(customQuery)}`);
      
      const result = await response.json();

      if (result.success) {
        // Convert single topic analysis to report format
        const mockReport: ScoutReport = {
          timestamp: new Date().toISOString(),
          searchQuery: customQuery,
          totalTweetsAnalyzed: result.data.analyses.length,
          viableMarkets: result.data.analyses,
          topRecommendations: result.data.analyses.filter((a: MarketAnalysis) => a.recommendedAction === 'create'),
          summary: `Analyzed ${result.data.analyses.length} potential markets for "${customQuery}"`
        };
        setReport(mockReport);
      } else {
        setError(result.error || 'Failed to analyze topic');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getViabilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getActionBadge = (action: string) => {
    const colors = {
      create: 'bg-green-900 text-green-400 border-green-700',
      monitor: 'bg-yellow-900 text-yellow-400 border-yellow-700',
      skip: 'bg-red-900 text-red-400 border-red-700'
    };
    return colors[action as keyof typeof colors] || colors.skip;
  };

  return (
    <div className="bg-black-900 border border-black-800 rounded-lg p-6" data-component="twitter-scout">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">🐦 Twitter Market Scout</h2>
          <p className="text-black-400 text-sm">
            AI agent that discovers trending topics and analyzes their potential as prediction markets
          </p>
          <p className="text-blue-400 text-xs mt-1">
            🤖 Agent Mode - Custom tools with Twitter API integration
          </p>
        </div>
      </div>


      {/* Enhanced Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => scoutMarkets()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
          >
            {isLoading ? '🔍 Scouting...' : '🚀 Scout Markets'}
          </button>
          
          <button
            onClick={() => scoutMarkets(['crypto', 'bitcoin', 'ethereum', 'defi'])}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
          >
            🪙 Crypto Focus
          </button>
          
          <button
            onClick={() => scoutMarkets(['AI', 'tech', 'startup', 'ipo'])}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
          >
            🤖 Tech Focus
          </button>
        </div>

        {/* Crypto-Specific Search Options */}
        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-3">
          <h4 className="text-orange-400 font-medium text-xs mb-2">🪙 Crypto Search Options</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => scoutMarkets(['bitcoin', 'btc', '$100k'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              Bitcoin $100k
            </button>
            <button
              onClick={() => scoutMarkets(['ethereum', 'eth', 'eth2', 'staking'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              Ethereum 2.0
            </button>
            <button
              onClick={() => scoutMarkets(['solana', 'sol', 'defi', 'nft'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              Solana Ecosystem
            </button>
            <button
              onClick={() => scoutMarkets(['altcoin', 'altseason', 'pump'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              Alt Season
            </button>
            <button
              onClick={() => scoutMarkets(['meme', 'dogecoin', 'shiba', 'pepe'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              Meme Coins
            </button>
            <button
              onClick={() => scoutMarkets(['defi', 'yield', 'farming', 'liquidity'])}
              disabled={isLoading}
              className="px-3 py-1 bg-orange-800 hover:bg-orange-700 text-orange-200 text-xs rounded transition-colors"
            >
              DeFi Yields
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter custom topic (e.g., 'Tesla', 'World Cup', 'Fed rates')"
            className="flex-1 px-3 py-2 bg-black-800 border border-black-700 text-white placeholder-black-400 text-sm rounded focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && analyzeCustomTopic()}
          />
          <button
            onClick={analyzeCustomTopic}
            disabled={isLoading || !customQuery.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
          >
            🎯 Analyze
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400">Analyzing Twitter trends...</span>
          </div>
        </div>
      )}

      {/* Report Display */}
      {report && !isLoading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-black-800 border border-black-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">📊 Scout Summary</h3>
            <p className="text-black-300 text-sm mb-3">{report.summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{report.totalTweetsAnalyzed}</div>
                <div className="text-xs text-black-400">Tweets Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{report.viableMarkets.length}</div>
                <div className="text-xs text-black-400">Viable Markets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{report.topRecommendations.length}</div>
                <div className="text-xs text-black-400">Top Recommendations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {new Date(report.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-xs text-black-400">Last Updated</div>
              </div>
            </div>
          </div>

          {/* Top Recommendations */}
          {report.topRecommendations.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4">🎯 Top Recommendations</h3>
              <div className="space-y-3">
                {report.topRecommendations.map((market, index) => (
                  <div key={market.marketId} className="bg-black-800 border border-green-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm flex-1">{market.question}</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${getActionBadge(market.recommendedAction)}`}>
                        {market.recommendedAction.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                      <div>
                        <span className="text-black-400">Category:</span>
                        <span className="text-white ml-1">{market.category}</span>
                      </div>
                      <div>
                        <span className="text-black-400">Viability:</span>
                        <span className={`ml-1 font-bold ${getViabilityColor(market.viabilityScore)}`}>
                          {(market.viabilityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-black-400">Timeframe:</span>
                        <span className="text-white ml-1">{market.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-black-400">Est. Volume:</span>
                        <span className="text-white ml-1">{market.estimatedVolume}</span>
                      </div>
                    </div>
                    <p className="text-black-300 text-xs">{market.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Viable Markets */}
          {report.viableMarkets.length > report.topRecommendations.length && (
            <div>
              <h3 className="text-white font-semibold mb-4">📈 Other Viable Markets</h3>
              <div className="grid gap-3">
                {report.viableMarkets
                  .filter(m => m.recommendedAction !== 'create')
                  .slice(0, 5)
                  .map((market) => (
                    <div key={market.marketId} className="bg-black-800 border border-black-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white text-sm flex-1">{market.question}</h4>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-black-400">{market.category}</span>
                          <span className={`font-bold ${getViabilityColor(market.viabilityScore)}`}>
                            {(market.viabilityScore * 100).toFixed(0)}%
                          </span>
                          <span className={`px-2 py-1 rounded border ${getActionBadge(market.recommendedAction)}`}>
                            {market.recommendedAction}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {report && report.viableMarkets.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-black-400">No viable markets found. Try different search terms or check back later.</p>
        </div>
      )}
    </div>
  );
}
