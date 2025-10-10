'use client';

import { useAgents } from '../hooks/useAgents';
import { useEffect, useState } from 'react';

interface AIAnalyticsProps {
  marketId?: string;
  showDashboard?: boolean;
}

export function AIAnalytics({ marketId, showDashboard = true }: AIAnalyticsProps) {
  const { 
    dashboardData, 
    marketAnalyses, 
    loading, 
    error, 
    fetchMarketAnalysis,
    triggerMarketAnalysis 
  } = useAgents();

  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);

  // Fetch market-specific analysis if marketId provided
  useEffect(() => {
    if (marketId) {
      fetchMarketAnalysis(marketId).then(setMarketAnalysis);
    }
  }, [marketId, fetchMarketAnalysis]);

  if (loading) {
    return (
      <div className="bg-black-900 border border-black-800 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-accent-500 animate-pulse"></div>
          <span className="text-white">AI analyzing markets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black-900 border border-red-800 p-6">
        <div className="flex items-center space-x-2">
          <span className="text-red-400">⚠️</span>
          <span className="text-red-400">AI Analysis Error: {error}</span>
        </div>
        <button 
          onClick={triggerMarketAnalysis}
          className="mt-3 px-4 py-2 bg-accent-500 text-black-950 text-sm hover:bg-accent-600 transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      {showDashboard && dashboardData && (
        <div className="bg-black-900 border border-black-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">AI Analytics Dashboard</h3>
            <button 
              onClick={triggerMarketAnalysis}
              className="px-3 py-1 bg-accent-500 text-black-950 text-xs hover:bg-accent-600 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dashboardData.accuracy}%</div>
              <div className="text-xs text-black-400">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dashboardData.totalPredictions}</div>
              <div className="text-xs text-black-400">Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dashboardData.averageConfidence}%</div>
              <div className="text-xs text-black-400">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dashboardData.activeAnalyses}</div>
              <div className="text-xs text-black-400">Active Markets</div>
            </div>
          </div>

          {/* Category Trends */}
          {dashboardData.categoryTrends.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Category Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashboardData.categoryTrends.slice(0, 6).map((trend) => (
                  <div key={trend.category} className="bg-black-800 p-3 border border-black-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium capitalize">{trend.category}</span>
                      <span className={`text-xs px-2 py-1 ${
                        trend.trend === 'bullish' ? 'bg-green-900 text-green-400' :
                        trend.trend === 'bearish' ? 'bg-red-900 text-red-400' :
                        'bg-black-700 text-black-300'
                      }`}>
                        {trend.trend}
                      </span>
                    </div>
                    <div className="text-xs text-black-400">
                      Strength: {(trend.strength * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market-Specific Analysis */}
      {marketAnalysis && (
        <div className="bg-black-900 border border-black-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">AI Market Analysis</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-black-400">Confidence:</span>
              <span className="text-accent-500 font-bold">
                {(marketAnalysis.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* AI Prediction */}
            <div className="flex items-center space-x-3">
              <span className="text-black-400">AI Prediction:</span>
              <span className={`px-3 py-1 text-sm font-bold ${
                marketAnalysis.aiPrediction === 'yes' 
                  ? 'bg-green-900 text-green-400' 
                  : 'bg-red-900 text-red-400'
              }`}>
                {marketAnalysis.aiPrediction.toUpperCase()}
              </span>
              {marketAnalysis.historicalAccuracy && (
                <span className="text-xs text-black-400">
                  (Historical: {(marketAnalysis.historicalAccuracy * 100).toFixed(0)}%)
                </span>
              )}
            </div>

            {/* Reasoning */}
            <div>
              <h4 className="text-white font-medium mb-2">Analysis Reasoning</h4>
              <p className="text-black-300 text-sm leading-relaxed">
                {marketAnalysis.reasoning}
              </p>
            </div>

            {/* Key Factors */}
            {marketAnalysis.factors && marketAnalysis.factors.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Key Factors</h4>
                <div className="space-y-1">
                  {marketAnalysis.factors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-accent-500 text-xs mt-1">•</span>
                      <span className="text-black-300 text-xs">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-xs text-black-500">
              Last updated: {new Date(marketAnalysis.lastUpdated).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
