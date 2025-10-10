'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';

// Web3-focused market data
const TRENDING_MARKETS = [
  {
    id: 'market-1',
    title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
    category: 'L2',
    endDate: 'December 31',
    yesPrice: 72,
    noPrice: 28,
    volume: '$12.5k',
    change: '+5%',
    trending: true,
    chance: 72
  },
  {
    id: 'market-2', 
    title: 'Will Ethereum upgrade to Proof of Stake 2.0?',
    category: 'ETH',
    endDate: 'November 15',
    yesPrice: 85,
    noPrice: 15,
    volume: '$45.3k',
    change: '+12%',
    trending: true,
    chance: 85
  },
  {
    id: 'market-3',
    title: 'Bitcoin reaches $100K by end of 2024?',
    category: 'BTC',
    endDate: 'December 31',
    yesPrice: 43,
    noPrice: 57,
    volume: '$89.7k',
    change: '+8%',
    trending: true,
    chance: 43
  },
  {
    id: 'market-4',
    title: 'Major DeFi protocol announces $1B+ airdrop?',
    category: 'DeFi',
    endDate: 'October 30',
    yesPrice: 67,
    noPrice: 33,
    volume: '$23.1k',
    change: '-3%',
    trending: false,
    chance: 67
  },
  {
    id: 'market-5',
    title: 'Solana network experiences major outage?',
    category: 'SOL',
    endDate: 'November 30',
    yesPrice: 34,
    noPrice: 66,
    volume: '$15.8k',
    change: '+15%',
    trending: false,
    chance: 34
  },
  {
    id: 'market-6',
    title: 'New Web3 gaming token launches on Fraxtal?',
    category: 'Gaming',
    endDate: 'December 15',
    yesPrice: 58,
    noPrice: 42,
    volume: '$7.2k',
    change: '+22%',
    trending: false,
    chance: 58
  }
];

const CATEGORIES = [
  'Trending', 'Breaking', 'New', 'DeFi', 'L2', 'BTC', 'ETH', 
  'Gaming', 'NFTs', 'DAOs', 'Airdrops', 'Governance'
];

const FILTERS = [
  'All', 'Bitcoin', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 
  'Optimism', 'Fraxtal', 'Uniswap', 'Aave', 'Compound', 'OpenSea'
];

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black-950">
      {!isConnected ? (
        <LandingPage />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-white font-bold text-lg font-typewriter">[Predicted]</span>
            </div>

            {/* Connect Wallet */}
            <div className="flex items-center space-x-4">
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            AI-Powered Web3 Prediction Markets
          </h1>
        
          <p className="text-lg sm:text-xl text-black-300 mb-12 max-w-2xl mx-auto">
            Bet on Web3 news and events with AI-powered insights. 
            Our multi-agent system analyzes markets in real-time.
          </p>

          {/* CTA */}
          <div className="mb-16">
            <p className="text-black-400 mb-6">Connect your wallet to start predicting</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <FeatureCard
              title="ORACLE"
              description="Real-time Web3 news validation and analysis"
              label="INTEL"
            />
            <FeatureCard
              title="MARKET"
              description="Autonomous prediction market deployment"
              label="DEPLOY"
            />
            <FeatureCard
              title="BETTING"
              description="Instant payment processing and settlement"
              label="TRADE"
            />
            <FeatureCard
              title="ANALYTICS"
              description="AI-powered outcome prediction engine"
              label="PREDICT"
            />
          </div>

          {/* Sample Markets Preview */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-white mb-8">Featured Markets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRENDING_MARKETS.slice(0, 3).map((market) => (
                <div key={market.id} className="bg-black-900 border border-black-800 p-4 opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-black-800 text-black-300 border border-black-700">
                      {market.category}
                    </span>
                    <span className="text-xs text-black-500">{market.endDate}</span>
                  </div>
                  <h4 className="text-white font-medium mb-3 text-sm">{market.title}</h4>
                  <div className="text-center">
                    <span className="text-accent-500 font-bold">{market.chance}%</span>
                    <p className="text-xs text-black-400 mt-1">AI Prediction</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-black-400 text-sm mt-6">Connect wallet to place bets and view all markets</p>
          </div>
        </div>
      </main>
    </>
  );
}

function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Header */}
      <header className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </div>
              
              {/* Search */}
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search predicted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 bg-black-800 border border-black-700 text-white placeholder-black-400 px-4 py-2 text-sm focus:outline-none focus:border-accent-500 transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-black-400 text-xs">/</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-1 text-accent-500 cursor-pointer">
                <span className="text-sm">💡</span>
                <span className="text-white text-sm font-medium">How it works</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-accent-500 transition-colors text-sm font-medium">
                Log in
              </button>
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

      {/* Navigation Bar */}
      <nav className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 py-3 overflow-x-auto">
            <div className="flex items-center space-x-2 text-accent-500">
              <span className="text-sm">📈</span>
              <span className="text-sm font-medium text-white">Trending</span>
            </div>
            {CATEGORIES.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category 
                    ? 'text-white font-medium' 
                    : 'text-black-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
            <button className="text-black-400 hover:text-white text-sm">More</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search predicted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black-800 border border-black-700 text-white placeholder-black-400 px-4 py-2 text-sm focus:outline-none focus:border-accent-500 transition-colors"
            />
            <span className="absolute right-3 top-2.5 text-black-400 text-xs">/</span>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-black-800 border border-black-700 text-white hover:border-black-600 transition-colors text-sm">
                <span>⚙️</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 bg-black-800 border border-black-700 text-white hover:border-black-600 transition-colors text-sm">
                <span>📌</span>
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  selectedFilter === filter
                    ? 'bg-white text-black-950 border-white'
                    : 'bg-transparent text-black-300 border-black-700 hover:border-black-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TRENDING_MARKETS.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-2 bg-black-800 border border-black-700 text-white hover:border-black-600 transition-colors text-sm">
            Load more markets
          </button>
        </div>
      </main>
    </>
  );
}

function FeatureCard({ title, description, label }: {
  title: string;
  description: string;
  label: string;
}) {
  return (
    <div className="text-left p-6 border-l-2 border-accent-500 bg-black-900 border border-black-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono px-2 py-1 bg-accent-500 text-black-950">{label}</span>
        <div className="w-2 h-2 bg-accent-500"></div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-mono tracking-wide">{title}</h3>
      <p className="text-sm text-black-400 leading-relaxed">{description}</p>
    </div>
  );
}

function MarketCard({ market }: { market: any }) {
  return (
    <a 
      href={`/market/${market.id}`}
      className="block bg-black-900 border border-black-800 hover:border-black-700 transition-all duration-200 hover:-translate-y-0.5 no-underline"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {market.trending && (
              <span className="text-accent-500 text-xs">🔥</span>
            )}
            <span className="text-xs px-2 py-1 bg-black-800 text-black-300 border border-black-700">
              {market.category}
            </span>
          </div>
          <span className="text-xs text-black-500">{market.endDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-white font-medium mb-4 leading-tight text-sm line-clamp-3">
          {market.title}
        </h3>

        {/* Chance Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-black-400">Chance</span>
            <span className="text-sm font-bold text-white">{market.chance}%</span>
          </div>
          <div className="h-1 bg-black-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white to-accent-500 transition-all duration-300"
              style={{ width: `${market.chance}%` }}
            ></div>
          </div>
        </div>

        {/* Betting Options */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-2 bg-black-800 hover:bg-black-700 transition-colors">
            <span className="text-white text-sm">Yes</span>
            <span className="text-white text-sm font-bold">{market.yesPrice}¢</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-black-800 hover:bg-black-700 transition-colors">
            <span className="text-white text-sm">No</span>
            <span className="text-white text-sm font-bold">{market.noPrice}¢</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-black-400">
          <span>{market.volume} Vol.</span>
          <div className="flex items-center space-x-2">
            <span className={market.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
              {market.change}
            </span>
            <span>📊</span>
            <span>📌</span>
          </div>
        </div>
      </div>
    </a>
  );
}
