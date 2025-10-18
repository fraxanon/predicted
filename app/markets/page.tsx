'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';

// Mock markets data
const MOCK_MARKETS = [
  {
    id: 'market-1',
    title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
    description: 'Coinbase has announced plans for a Layer 2 solution...',
    category: 'LAUNCH',
    endDate: 'Dec 31, 2024',
    aiPrediction: 'YES - 72%',
    volume: '$12.5K',
    yesPrice: '72¢',
    noPrice: '28¢',
    status: 'ACTIVE'
  },
  {
    id: 'market-2',
    title: 'Major DeFi protocol announces token airdrop?',
    description: 'A leading DeFi protocol has hinted at an upcoming token airdrop...',
    category: 'AIRDROP',
    endDate: 'Nov 15, 2024',
    aiPrediction: 'NO - 45%',
    volume: '$8.3K',
    yesPrice: '45¢',
    noPrice: '55¢',
    status: 'ACTIVE'
  },
  {
    id: 'market-3',
    title: 'Ethereum gas fees drop below 10 gwei average?',
    description: 'Will Ethereum mainnet gas fees average below 10 gwei for 7 consecutive days?',
    category: 'DEFI',
    endDate: 'Oct 30, 2024',
    aiPrediction: 'YES - 63%',
    volume: '$5.7K',
    yesPrice: '63¢',
    noPrice: '37¢',
    status: 'ACTIVE'
  },
  {
    id: 'market-4',
    title: 'Bitcoin reaches new all-time high by year end?',
    description: 'Will Bitcoin (BTC) reach a new all-time high above $69,000 before 2025?',
    category: 'CRYPTO',
    endDate: 'Dec 31, 2024',
    aiPrediction: 'YES - 58%',
    volume: '$23.1K',
    yesPrice: '58¢',
    noPrice: '42¢',
    status: 'ACTIVE'
  }
];

const CATEGORIES = ['ALL', 'LAUNCH', 'AIRDROP', 'DEFI', 'CRYPTO', 'GOVERNANCE'];

export default function MarketsPage() {
  const { isConnected } = useAccount();
  
  // Agent dropdown state
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showAgentDropdown && !target.closest('.agent-dropdown')) {
        setShowAgentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAgentDropdown]);

  return (
    <div className="min-h-screen bg-black-950">
      {/* Header */}
      <header className="border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-black-400 hover:text-white transition-colors">
                ← Home
              </a>
              <Logo size="md" />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Agent Dropdown */}
              <div className="relative agent-dropdown">
                <button
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                  className="flex items-center space-x-2 text-white hover:text-accent-400 text-sm font-medium transition-colors"
                >
                  <span>Agents</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showAgentDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showAgentDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-black-800 border border-black-700 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      {/* Active Agents */}
                      <a
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-black-700 transition-colors"
                      >
                        <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Cashier Agent</div>
                          <div className="text-xs text-gray-400">Investment Management</div>
                        </div>
                      </a>

                      <a
                        href="/prophet-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-black-700 transition-colors"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Prophet Agent</div>
                          <div className="text-xs text-gray-400">Market Analysis</div>
                        </div>
                      </a>

                      {/* Divider */}
                      <div className="border-t border-black-700 my-2"></div>

                      {/* Other Agents - Coming Soon */}
                      <div className="px-4 py-1">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Coming Soon</div>
                      </div>

                      <a
                        href="/oracle-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-black-700 transition-colors cursor-not-allowed"
                      >
                        <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Oracle Agent</div>
                          <div className="text-xs text-gray-500">Data Intelligence</div>
                        </div>
                      </a>

                      <a
                        href="/sentinel-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-black-700 transition-colors cursor-not-allowed"
                      >
                        <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Sentinel Agent</div>
                          <div className="text-xs text-gray-500">Risk Monitoring</div>
                        </div>
                      </a>

                      <a
                        href="/arbitrage-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-black-700 transition-colors cursor-not-allowed"
                      >
                        <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Arbitrage Agent</div>
                          <div className="text-xs text-gray-500">Price Optimization</div>
                        </div>
                      </a>

                      <a
                        href="/liquidator-dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-black-700 transition-colors cursor-not-allowed"
                      >
                        <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="font-medium">Liquidator Agent</div>
                          <div className="text-xs text-gray-500">Position Management</div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <ConnectButton 
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            PREDICTION MARKETS
          </h1>
          <p className="text-black-300 max-w-2xl">
            AI-powered prediction markets for Web3 events. Place bets with confidence using our multi-agent analysis system.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-white mb-1">{MOCK_MARKETS.length}</div>
            <div className="text-sm text-black-400">Active Markets</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-white mb-1">$49.6K</div>
            <div className="text-sm text-black-400">Total Volume</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-white mb-1">78.5%</div>
            <div className="text-sm text-black-400">AI Accuracy</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-white mb-1">1,247</div>
            <div className="text-sm text-black-400">Total Bets</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`btn-ghost text-sm px-4 py-2 ${
                category === 'ALL' ? 'bg-white text-black-950' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_MARKETS.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="secondary">
            LOAD MORE MARKETS
          </Button>
        </div>
      </main>
    </div>
  );
}

function MarketCard({ market }: { market: any }) {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{market.category}</Badge>
          <Badge variant="accent">{market.status}</Badge>
        </div>
        <div className="text-xs text-black-500 font-mono">
          {market.endDate}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
        {market.title}
      </h3>

      <p className="text-sm text-black-400 mb-4 line-clamp-2">
        {market.description}
      </p>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-black-800 border border-black-700">
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{market.aiPrediction}</div>
          <div className="text-xs text-black-400">AI Prediction</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{market.volume}</div>
          <div className="text-xs text-black-400">Volume</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">
            {market.yesPrice}/{market.noPrice}
          </div>
          <div className="text-xs text-black-400">Yes/No</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a 
          href={`/market/${market.id}`}
          className="btn-secondary flex-1 text-center no-underline"
        >
          VIEW DETAILS
        </a>
        <a 
          href={`/market/${market.id}`}
          className="btn-primary flex-1 text-center no-underline"
        >
          PLACE BET
        </a>
      </div>
    </Card>
  );
}
