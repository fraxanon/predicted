'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ProphetMarketConnector, ProphetRecommendation, MarketRecommendation } from '../lib/prophet-market-connector';

interface ProphetAnalysisProps {
  onAuthorizeInvestment?: () => void;
  budget?: number;
  onBudgetChange?: (budget: number) => void;
}

export function ProphetAnalysis({ onAuthorizeInvestment, budget: externalBudget, onBudgetChange }: ProphetAnalysisProps) {
  const { address } = useAccount();
  const [budget, setBudget] = useState(externalBudget || 1000);
  const [currency, setCurrency] = useState<'USDC' | 'frxUSD'>('USDC');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [recommendations, setRecommendations] = useState<ProphetRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>({});

  // Sync external budget changes
  useEffect(() => {
    if (externalBudget !== undefined) {
      setBudget(externalBudget);
    }
  }, [externalBudget]);

  // Load user preferences and generate recommendations
  useEffect(() => {
    loadUserPreferences();
    generateRecommendations();
  }, [address, budget]);

  const loadUserPreferences = () => {
    if (address) {
      const saved = localStorage.getItem(`agent-preferences-${address}`);
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          setBudget(preferences.maxDailyInvestment || 1000);
          setCurrency(preferences.preferredCurrency || 'USDC');
          setIsAuthorized(preferences.x402Authorized || false);
          setUserPreferences(preferences);
        } catch (error) {
          console.error('Failed to load preferences:', error);
        }
      }
    }
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const connector = ProphetMarketConnector.getInstance();
      
      // Mock market data - in production this would come from API
      const mockMarkets = [
        {
          id: '1',
          title: "Will Bitcoin reach $100k by end of 2024?",
          category: "Crypto",
          endDate: "Dec 31, 2024",
          yesPrice: 72,
          noPrice: 28,
          volume: "$45.2k",
          chance: 72
        },
        {
          id: '2',
          title: "Will Tesla stock hit $300 by Q1 2025?",
          category: "Stocks",
          endDate: "Mar 31, 2025",
          yesPrice: 68,
          noPrice: 32,
          volume: "$32.1k",
          chance: 68
        },
        {
          id: '3',
          title: "Will OpenAI release GPT-5 in 2024?",
          category: "AI/Tech",
          endDate: "Dec 31, 2024",
          yesPrice: 65,
          noPrice: 35,
          volume: "$28.7k",
          chance: 65
        },
        {
          id: '4',
          title: "Will Ethereum ETF get approved by March?",
          category: "Crypto",
          endDate: "Mar 31, 2025",
          yesPrice: 62,
          noPrice: 38,
          volume: "$41.3k",
          chance: 62
        },
        {
          id: '5',
          title: "Will Apple announce VR headset v2 in 2024?",
          category: "Tech",
          endDate: "Dec 31, 2024",
          yesPrice: 58,
          noPrice: 42,
          volume: "$19.8k",
          chance: 58
        }
      ];

      const prophetRecommendations = await connector.analyzeMarkets(mockMarkets, budget, userPreferences);
      setRecommendations(prophetRecommendations);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate investment allocation (equal distribution)
  const investmentPerMarket = Math.floor(budget / Math.max(1, recommendations.length));
  const totalProjectedReturns = recommendations.reduce((total, rec) => {
    return total + rec.projectedProfit;
  }, 0);

  // Apply frxUSD bonus
  const frxUSDBonus = currency === 'frxUSD' ? totalProjectedReturns * 0.1 : 0;
  const finalProjectedReturns = totalProjectedReturns + budget + frxUSDBonus;
  const totalProfit = finalProjectedReturns - budget;
  const profitPercentage = budget > 0 ? ((totalProfit / budget) * 100) : 0;

  const handleAuthorizeInvestment = () => {
    if (address) {
      // Save authorization status
      const saved = localStorage.getItem(`agent-preferences-${address}`);
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          preferences.x402Authorized = true;
          localStorage.setItem(`agent-preferences-${address}`, JSON.stringify(preferences));
          setIsAuthorized(true);
          onAuthorizeInvestment?.();
        } catch (error) {
          console.error('Failed to save authorization:', error);
        }
      }
    }
  };

  const handleAddBudget = () => {
    const additionalBudget = prompt('Enter additional budget amount:');
    if (additionalBudget && !isNaN(Number(additionalBudget))) {
      const newBudget = budget + Number(additionalBudget);
      setBudget(newBudget);
      
      // Sync with external budget handler
      if (onBudgetChange) {
        onBudgetChange(newBudget);
      }
      
      // Save to preferences
      if (address) {
        const saved = localStorage.getItem(`agent-preferences-${address}`);
        if (saved) {
          try {
            const preferences = JSON.parse(saved);
            preferences.maxDailyInvestment = newBudget;
            localStorage.setItem(`agent-preferences-${address}`, JSON.stringify(preferences));
          } catch (error) {
            console.error('Failed to save budget:', error);
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black-800 border border-black-700 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-accent-500 animate-pulse rounded-full"></div>
          <span className="text-white">Prophet analyzing markets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black-800 border border-black-700 p-3 md:p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
        <h3 className="text-white font-medium text-sm md:text-base mb-2 md:mb-0">📊 Prophet's Market Analysis</h3>
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs">Updated 2 min ago</span>
          {isAuthorized && (
            <span className="text-green-400 text-xs px-2 py-1 bg-green-900 bg-opacity-20 border border-green-800">
              ✓ Authorized
            </span>
          )}
        </div>
      </div>
      
      {/* Current Budget & Projected Returns */}
      <div className="bg-black-900 border border-black-700 p-3 md:p-4 mb-3 md:mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
          <div>
            <div className="text-white font-bold text-lg">${budget.toLocaleString()}</div>
            <div className="text-black-400 text-sm">Available Budget</div>
            <div className="text-black-500 text-xs">{currency}</div>
          </div>
          <div>
            <div className="text-green-400 font-bold text-lg">${Math.round(finalProjectedReturns).toLocaleString()}</div>
            <div className="text-black-400 text-sm">Projected Returns</div>
            {frxUSDBonus > 0 && (
              <div className="text-green-400 text-xs">+${Math.round(frxUSDBonus)} bonus</div>
            )}
          </div>
          <div>
            <div className="text-accent-500 font-bold text-lg">+{profitPercentage.toFixed(1)}%</div>
            <div className="text-black-400 text-sm">Expected Profit</div>
            <div className="text-accent-400 text-xs">${Math.round(totalProfit).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Prophet's Recommendations */}
      <div className="space-y-3">
        <h4 className="text-white text-sm font-medium">Top {recommendations.length} Recommended Markets</h4>
        
        {recommendations.map((rec, index) => (
          <div key={rec.id} className="bg-black-700 border border-black-600 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs px-2 py-1 bg-black-600 text-black-300 border border-black-500">
                    {rec.category}
                  </span>
                  <span className="text-green-400 text-xs font-medium">
                    {rec.confidence}% confidence
                  </span>
                  <span className="text-black-400 text-xs">
                    Ends {rec.endDate}
                  </span>
                </div>
                <p className="text-white text-sm leading-tight">{rec.title}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-black-400">Investment: ${rec.investmentAmount}</span>
              <span className="text-green-400">Projected: ${Math.round(rec.investmentAmount + rec.projectedProfit)}</span>
              <span className="text-accent-500">+{((rec.projectedProfit / rec.investmentAmount) * 100).toFixed(1)}%</span>
              <span className="text-black-500">Risk: {rec.riskScore}/10</span>
            </div>
          </div>
        ))}
      </div>

      {currency === 'frxUSD' && (
        <div className="mt-3 p-2 bg-green-900 bg-opacity-20 border border-green-800 text-green-400 text-xs">
          🎉 You're using frxUSD! All projected returns include a 10% bonus (+${Math.round(frxUSDBonus)})
        </div>
      )}
    </div>
  );
}
