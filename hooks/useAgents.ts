import { useState, useEffect, useCallback } from 'react';

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

export interface DashboardData {
  totalPredictions: number;
  resolvedPredictions: number;
  accuracy: string;
  averageConfidence: string;
  activeAnalyses: number;
  categoryTrends: TrendAnalysis[];
}

export function useAgents() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [marketAnalyses, setMarketAnalyses] = useState<Map<string, MarketAnalysis>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/agents?action=dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch market analysis
  const fetchMarketAnalysis = useCallback(async (marketId: string) => {
    try {
      const response = await fetch(`/api/agents?action=market-analysis&marketId=${marketId}`);
      if (!response.ok) throw new Error('Failed to fetch market analysis');
      
      const analysis = await response.json();
      if (!analysis.error) {
        setMarketAnalyses(prev => new Map(prev.set(marketId, analysis)));
      }
      return analysis;
    } catch (err) {
      console.error('Failed to fetch market analysis:', err);
      return null;
    }
  }, []);

  // Fetch category trend
  const fetchCategoryTrend = useCallback(async (category: string) => {
    try {
      const response = await fetch(`/api/agents?action=category-trends&category=${category}`);
      if (!response.ok) throw new Error('Failed to fetch category trend');
      
      const trend = await response.json();
      return trend.error ? null : trend;
    } catch (err) {
      console.error('Failed to fetch category trend:', err);
      return null;
    }
  }, []);

  // Trigger market analysis
  const triggerMarketAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze-market' }),
      });
      
      if (!response.ok) throw new Error('Failed to trigger analysis');
      
      // Refresh dashboard data after analysis
      setTimeout(fetchDashboardData, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardData]);

  // Trigger event check
  const triggerEventCheck = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-events' }),
      });
      
      if (!response.ok) throw new Error('Failed to trigger event check');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    marketAnalyses,
    loading,
    error,
    fetchDashboardData,
    fetchMarketAnalysis,
    fetchCategoryTrend,
    triggerMarketAnalysis,
    triggerEventCheck,
  };
}
