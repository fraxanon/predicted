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
    <div className="space-y-3 md:space-y-4">
      {/* Compact Dashboard Overview */}
      {showDashboard && dashboardData && (
        <div className="bg-black-800 border border-black-700 p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium text-sm md:text-base">AI Analytics</h3>
            <button 
              onClick={triggerMarketAnalysis}
              className="px-2 py-1 bg-accent-500 text-black-950 text-xs hover:bg-accent-600 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div className="bg-black-700 border border-black-600 p-3 text-center">
              <div className="text-lg md:text-xl font-bold text-white">24</div>
              <div className="text-black-400 text-xs">Markets</div>
            </div>
            <div className="bg-black-700 border border-black-600 p-3 text-center">
              <div className="text-lg md:text-xl font-bold text-green-400">$2.1M</div>
              <div className="text-black-400 text-xs">Volume</div>
            </div>
            <div className="bg-black-700 border border-black-600 p-3 text-center">
              <div className="text-lg md:text-xl font-bold text-accent-500">74%</div>
              <div className="text-black-400 text-xs">Confidence</div>
            </div>
            <div className="bg-black-700 border border-black-600 p-3 text-center">
              <div className="text-lg md:text-xl font-bold text-white">12</div>
              <div className="text-black-400 text-xs">Bets</div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
