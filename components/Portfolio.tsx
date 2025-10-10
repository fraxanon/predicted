'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserProfile } from '../hooks/useUserProfile';

interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: 'yes' | 'no';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  invested: number;
  currentValue: number;
  potentialWin: number;
  pnl: number;
  pnlPercentage: number;
  status: 'active' | 'resolved' | 'expired';
  createdAt: Date;
  resolvedAt?: Date;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercentage: number;
  activePositions: number;
  resolvedPositions: number;
  winRate: number;
  todayChange: number;
  weekChange: number;
  monthChange: number;
}

export function Portfolio() {
  const { address } = useAccount();
  const { profile, recommendations } = useUserProfile();
  const [selectedTab, setSelectedTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const [timeFilter, setTimeFilter] = useState<'1D' | '1W' | '1M' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'market'>('value');
  
  // Mock portfolio data - in production this would come from API/blockchain
  const [positions, setPositions] = useState<Position[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalInvested: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    activePositions: 0,
    resolvedPositions: 0,
    winRate: 0,
    todayChange: 0,
    weekChange: 0,
    monthChange: 0
  });

  useEffect(() => {
    generateMockPortfolioData();
  }, [recommendations, profile]);

  const generateMockPortfolioData = () => {
    if (!recommendations.length) return;

    // Generate positions based on AI recommendations
    const mockPositions: Position[] = recommendations.map((rec, index) => {
      const invested = Math.round(rec.potentialReturn * 100); // Mock invested amount
      const shares = Math.round(invested / 0.65); // Mock shares calculation
      const avgPrice = invested / shares;
      const currentPrice = avgPrice * (0.9 + Math.random() * 0.2); // ±10% price movement
      const currentValue = shares * currentPrice;
      const potentialWin = shares * (rec.aiPrediction === 'yes' ? 1.0 : 1.0);
      const pnl = currentValue - invested;
      const pnlPercentage = (pnl / invested) * 100;

      return {
        id: `pos-${index + 1}`,
        marketId: rec.marketId,
        marketTitle: rec.title,
        side: rec.aiPrediction,
        shares,
        avgPrice,
        currentPrice,
        invested,
        currentValue,
        potentialWin,
        pnl,
        pnlPercentage,
        status: 'active' as const,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      };
    });

    // Add some resolved positions for demo
    const resolvedPositions: Position[] = [
      {
        id: 'pos-resolved-1',
        marketId: 'resolved-1',
        marketTitle: 'Bitcoin reaches $70K by September 2024?',
        side: 'yes',
        shares: 150,
        avgPrice: 0.68,
        currentPrice: 1.0,
        invested: 102,
        currentValue: 150,
        potentialWin: 150,
        pnl: 48,
        pnlPercentage: 47.1,
        status: 'resolved',
        createdAt: new Date('2024-08-15'),
        resolvedAt: new Date('2024-09-20')
      }
    ];

    const allPositions = [...mockPositions, ...resolvedPositions];
    setPositions(allPositions);

    // Calculate portfolio stats
    const totalInvested = allPositions.reduce((sum, pos) => sum + pos.invested, 0);
    const totalValue = allPositions.filter(p => p.status === 'active').reduce((sum, pos) => sum + pos.currentValue, 0);
    const totalPnL = allPositions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const activePositionsCount = allPositions.filter(p => p.status === 'active').length;
    const resolvedPositionsCount = allPositions.filter(p => p.status === 'resolved').length;
    const winningPositions = allPositions.filter(p => p.status === 'resolved' && p.pnl > 0).length;
    const winRate = resolvedPositionsCount > 0 ? (winningPositions / resolvedPositionsCount) * 100 : 0;

    setPortfolioStats({
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercentage,
      activePositions: activePositionsCount,
      resolvedPositions: resolvedPositionsCount,
      winRate,
      todayChange: totalPnL * 0.1, // Mock daily change
      weekChange: totalPnL * 0.6,
      monthChange: totalPnL * 0.9
    });
  };

  const filteredPositions = positions.filter(position => {
    if (searchQuery && !position.marketTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedTab === 'positions' && position.status !== 'active') {
      return false;
    }
    
    if (selectedTab === 'history' && position.status === 'active') {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'pnl':
        return b.pnl - a.pnl;
      case 'market':
        return a.marketTitle.localeCompare(b.marketTitle);
      default:
        return 0;
    }
  });

  const getTimeFilteredChange = () => {
    switch (timeFilter) {
      case '1D': return portfolioStats.todayChange;
      case '1W': return portfolioStats.weekChange;
      case '1M': return portfolioStats.monthChange;
      case 'ALL': return portfolioStats.totalPnL;
      default: return portfolioStats.totalPnL;
    }
  };

  return (
    <div className="min-h-screen bg-black-950">
      {/* Header */}
      <header className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </div>
              <nav className="flex space-x-6">
                <a href="/" className="text-black-400 hover:text-white transition-colors text-sm">Markets</a>
                <span className="text-white text-sm font-medium">Portfolio</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-bold">Portfolio</div>
                <div className="text-accent-500 text-sm">${portfolioStats.totalValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Value */}
          <div className="bg-black-900 border border-black-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-black-400 text-sm">PORTFOLIO</h2>
              <div className="flex items-center space-x-1">
                <span className="text-green-400 text-sm">●</span>
                <span className="text-green-400 text-sm">${portfolioStats.todayChange.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              ${portfolioStats.totalValue.toFixed(2)}
            </div>
            <div className="text-black-400 text-sm mb-6">Today</div>
            
            <button className="w-full flex items-center justify-center space-x-2 py-3 border border-black-700 text-white hover:border-black-600 transition-colors">
              <span>↑</span>
              <span>Withdraw</span>
            </button>
          </div>

          {/* Profit/Loss */}
          <div className="bg-black-900 border border-black-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-black-400 text-sm">PROFIT/LOSS</h2>
              <div className="flex space-x-1">
                {(['1D', '1W', '1M', 'ALL'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-2 py-1 text-xs transition-colors ${
                      timeFilter === period
                        ? 'text-accent-500 border-b border-accent-500'
                        : 'text-black-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              ${getTimeFilteredChange().toFixed(2)}
            </div>
            <div className="text-black-400 text-sm mb-6">All-Time</div>
            
            {/* Performance Chart Placeholder */}
            <div className="h-16 bg-black-800 border border-black-700 flex items-center justify-center">
              <span className="text-black-500 text-sm">Performance Chart</span>
            </div>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black-900 border border-black-800 p-4 text-center">
            <div className="text-2xl font-bold text-white">{portfolioStats.activePositions}</div>
            <div className="text-xs text-black-400">Active Positions</div>
          </div>
          <div className="bg-black-900 border border-black-800 p-4 text-center">
            <div className="text-2xl font-bold text-white">{portfolioStats.winRate.toFixed(1)}%</div>
            <div className="text-xs text-black-400">Win Rate</div>
          </div>
          <div className="bg-black-900 border border-black-800 p-4 text-center">
            <div className="text-2xl font-bold text-white">${portfolioStats.totalInvested.toFixed(0)}</div>
            <div className="text-xs text-black-400">Total Invested</div>
          </div>
          <div className="bg-black-900 border border-black-800 p-4 text-center">
            <div className={`text-2xl font-bold ${portfolioStats.totalPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioStats.totalPnLPercentage >= 0 ? '+' : ''}{portfolioStats.totalPnLPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-black-400">Total Return</div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="bg-black-900 border border-black-800">
          {/* Tabs */}
          <div className="border-b border-black-800 px-6 py-4">
            <div className="flex space-x-6">
              {(['positions', 'orders', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`text-sm font-medium transition-colors capitalize ${
                    selectedTab === tab
                      ? 'text-white border-b-2 border-accent-500 pb-1'
                      : 'text-black-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="px-6 py-4 border-b border-black-800">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black-800 border border-black-700 text-white placeholder-black-400 px-4 py-2 text-sm focus:outline-none focus:border-accent-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-black-800 border border-black-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-accent-500"
                >
                  <option value="value">Current value</option>
                  <option value="pnl">P&L</option>
                  <option value="market">Market</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-3 border-b border-black-800 grid grid-cols-12 gap-4 text-xs text-black-400 font-medium">
            <div className="col-span-4">MARKET</div>
            <div className="col-span-2 text-center">AVG • NOW</div>
            <div className="col-span-2 text-center">BET</div>
            <div className="col-span-2 text-center">TO WIN</div>
            <div className="col-span-2 text-right">VALUE</div>
          </div>

          {/* Positions List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredPositions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-black-400">No positions found.</div>
              </div>
            ) : (
              filteredPositions.map((position) => (
                <div key={position.id} className="px-6 py-4 border-b border-black-800 hover:bg-black-800 transition-colors grid grid-cols-12 gap-4 items-center">
                  {/* Market */}
                  <div className="col-span-4">
                    <div className="text-white font-medium text-sm mb-1">{position.marketTitle}</div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 ${
                        position.side === 'yes' 
                          ? 'bg-green-900 text-green-400' 
                          : 'bg-red-900 text-red-400'
                      }`}>
                        {position.side.toUpperCase()}
                      </span>
                      <span className="text-xs text-black-500">{position.shares} shares</span>
                    </div>
                  </div>

                  {/* Avg • Now */}
                  <div className="col-span-2 text-center">
                    <div className="text-white text-sm">${position.avgPrice.toFixed(2)} • ${position.currentPrice.toFixed(2)}</div>
                  </div>

                  {/* Bet */}
                  <div className="col-span-2 text-center">
                    <div className="text-white text-sm">${position.invested}</div>
                  </div>

                  {/* To Win */}
                  <div className="col-span-2 text-center">
                    <div className="text-white text-sm">${position.potentialWin}</div>
                  </div>

                  {/* Value */}
                  <div className="col-span-2 text-right">
                    <div className="text-white font-medium">${position.currentValue.toFixed(2)}</div>
                    <div className={`text-xs ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercentage >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
