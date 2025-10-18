'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Badge } from '../components/ui/Badge';
import { AIAnalytics } from '../components/AIAnalytics';
import { InterestOnboarding } from '../components/InterestOnboarding';
import { IndividualBetting } from '../components/IndividualBetting';
import { SimpleAgentStatus } from '../components/SimpleAgentStatus';
import { useUserProfile } from '../hooks/useUserProfile';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  'Gaming', 'NFTs', 'DAOs', 'Airdrops', 'Governance', 'Staking'
];

const FILTERS = [
  'All', 'Bitcoin', 'Ethereum', 'Solana', 'Polygon', 'Arbitrum', 
  'Optimism', 'Fraxtal', 'Uniswap', 'Aave', 'Compound', 'OpenSea'
];

export default function HomePage() {
  const { isConnected } = useAccount();
  const { hasCompletedOnboarding, saveProfile } = useUserProfile();

  const handleOnboardingComplete = (profile: any) => {
    saveProfile(profile);
  };

  return (
    <div className="min-h-screen bg-black-950">
      {!isConnected ? (
        <LandingPage />
      ) : !hasCompletedOnboarding ? (
        <OnboardingPage onComplete={handleOnboardingComplete} />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

function OnboardingPage({ onComplete }: { onComplete: (profile: any) => void }) {
  return (
    <>
      {/* Simple Header */}
      <header className="border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black-950 font-bold text-sm">[P]</span>
              </div>
              <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
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
      </header>

      {/* Onboarding Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InterestOnboarding onComplete={onComplete} />
      </main>
    </>
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

        </div>
      </main>
    </>
  );
}

function DashboardPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [investedMarkets, setInvestedMarkets] = useState<Set<string>>(new Set());
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [activeAgentDropdown, setActiveAgentDropdown] = useState<string | null>(null);
  
  // Toggle agent dropdown
  const toggleAgentDropdown = (agentId: string) => {
    setActiveAgentDropdown(activeAgentDropdown === agentId ? null : agentId);
  };
  
  // Mock recommendations for now
  const recommendations: any[] = [];

  // Track markets that the AI agent has invested in
  useEffect(() => {
    const invested = new Set(recommendations.map((rec: any) => rec.marketId));
    setInvestedMarkets(invested);
  }, [recommendations]);

  // Sidebar only closes via the "✕" button - no auto-close functionality

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
              
              {/* Navigation Links */}
              <div className="hidden lg:flex items-center space-x-6">
                <a href="/docs" className="text-black-400 hover:text-white text-sm transition-colors">
                  Docs
                </a>
                <a href="/treasury" className="text-black-400 hover:text-white text-sm transition-colors">
                  Treasury
                </a>
              </div>
              
              {/* Search */}
              <div className="hidden lg:flex relative">
                <input
                  type="text"
                  placeholder="Search predicted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-black-800 border border-black-700 text-white placeholder-black-400 px-4 py-2 text-sm focus:outline-none focus:border-accent-500 transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-black-400 text-xs">/</span>
              </div>
              
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/portfolio"
                className="text-right"
              >
                <div className="text-white text-sm font-medium">Portfolio</div>
                <div className="text-accent-500 text-xs">$0.00</div>
              </a>
              
              {/* AI Agents Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 bg-accent-500 hover:bg-accent-600 text-black-950 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">🤖 AI Agents</span>
                  <span className={`transition-transform ${showAgentDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* Dropdown Menu */}
                {showAgentDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-black-800 border border-black-700 rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-3">AI Agents</h3>
                      <div className="space-y-2">
                        {/* Fraxtal Market Forge */}
                        <button
                          onClick={() => {
                            setShowAgentDropdown(false);
                            setTimeout(() => {
                              window.location.href = '/forge-dashboard';
                            }, 100);
                          }}
                          className="w-full flex items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="text-orange-400 font-medium text-sm">⚒️ Fraxtal Market Forge</div>
                            <div className="text-gray-400 text-xs">Deploy smart contract prediction markets on Fraxtal using frxUSD</div>
                          </div>
                        </button>

                        {/* Oracle Agent */}
                        <button
                          onClick={() => {
                            setShowAgentDropdown(false);
                            setTimeout(() => {
                              window.location.href = '/oracle-dashboard';
                            }, 100);
                          }}
                          className="w-full flex items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="text-purple-400 font-medium text-sm">🔮 Oracle Agent - "Seer"</div>
                            <div className="text-gray-400 text-xs">Twitter market discovery and outcome verification</div>
                          </div>
                        </button>

                        {/* Analytics Agent */}
                        <button
                          onClick={() => {
                            setShowAgentDropdown(false);
                            window.location.href = '/prophet-dashboard';
                          }}
                          className="w-full flex items-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="text-cyan-400 font-medium text-sm">📊 Analytics Agent - "Prophet"</div>
                            <div className="text-gray-400 text-xs">AI-powered market analysis and predictions</div>
                          </div>
                        </button>

                        {/* Trading Agent */}
                        <button
                          onClick={() => {
                            setShowAgentDropdown(false);
                            window.location.href = '/dashboard';
                          }}
                          className="w-full flex items-center p-3 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors text-left"
                        >
                          <div className="flex-1">
                            <div className="text-green-400 font-medium text-sm">💰 X402 Trading Agent - "Cashier"</div>
                            <div className="text-gray-400 text-xs">Autonomous investment management using X402</div>
                          </div>
                        </button>
                      </div>
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

      {/* Navigation Bar */}
      <nav className="border-b border-black-800 bg-black-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 py-3 overflow-x-auto">
            <div className="flex items-center space-x-2 text-accent-500">
              <span className="text-sm">📈</span>
              <span className="text-sm font-medium text-white">Trending</span>
            </div>
            {CATEGORIES.slice(1).map((category) => {
              if (category === 'Staking') {
                return (
                  <a
                    key={category}
                    href="/staking"
                    className="text-sm text-black-400 hover:text-white transition-colors"
                  >
                    {category}
                  </a>
                );
              }
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm transition-colors ${
                    selectedCategory === category
                      ? 'text-white font-medium'
                      : 'text-black-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
            <button className="text-black-400 hover:text-white text-sm">More</button>
          </div>
        </div>
      </nav>

      <main className="bg-black-950 min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact AI Analytics */}
          <div className="mb-4">
            <AIAnalytics showDashboard={true} />
          </div>




          {/* Mobile Search */}
          <div className="md:hidden mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search predicted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black-800 border border-black-700 text-white placeholder-black-400 px-3 py-2 text-sm focus:outline-none focus:border-accent-500 transition-colors"
              />
              <span className="absolute right-3 top-2.5 text-black-400 text-xs">/</span>
            </div>
          </div>

          {/* Compact Filters */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {FILTERS.slice(0, 6).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2 py-1 text-xs border transition-colors ${
                    selectedFilter === filter
                      ? 'bg-accent-500 text-black-950 border-accent-500'
                      : 'bg-transparent text-black-300 border-black-700 hover:border-black-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Markets Grid - Original Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {/* Create Market Card - Same size as other cards */}
            <CreateMarketCard />
            
            {TRENDING_MARKETS.map((market) => {
              const isInvested = investedMarkets.has(market.id);
              const investedRec = recommendations.find((rec: any) => rec.marketId === market.id);
              
              return (
                <IndividualBetting 
                  key={market.id} 
                  market={{
                    ...market,
                    aiPrediction: market.chance > 50 ? 'yes' : 'no',
                    confidence: Math.min(0.95, Math.max(0.65, market.chance / 100)),
                    isInvested,
                    investedAmount: investedRec ? Math.round(investedRec.potentialReturn * 100) : undefined
                  }}
                  onBetPlaced={(result) => {
                    console.log('Individual bet placed:', result);
                    // Handle bet result (show success message, update UI, etc.)
                  }}
                />
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-black-800 border border-black-700 text-white hover:border-black-600 transition-colors text-sm">
              Load more markets
            </button>
          </div>
        </div>
      </main>

      {/* Backdrop for dropdown */}
      {showAgentDropdown && (
        <div 
          className="fixed inset-0 bg-black/20 z-30" 
          onClick={() => setShowAgentDropdown(false)}
        />
      )}

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
  // Mock AI prediction for demo (in production, this would come from the analytics agent)
  const aiPrediction = {
    prediction: market.chance > 50 ? 'yes' : 'no',
    confidence: Math.min(0.95, Math.max(0.65, (market.chance > 50 ? market.chance : 100 - market.chance) / 100))
  };

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

        {/* AI Prediction */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-black-400">AI Prediction</span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 font-bold ${
                aiPrediction.prediction === 'yes' 
                  ? 'bg-green-900 text-green-400' 
                  : 'bg-red-900 text-red-400'
              }`}>
                {aiPrediction.prediction.toUpperCase()}
              </span>
              <span className="text-xs text-accent-500">
                {(aiPrediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chance Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-black-400">Market Chance</span>
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

function CreateMarketCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="block bg-black-900 border border-black-800 hover:border-orange-500/50 transition-all duration-200 hover:-translate-y-0.5 text-left w-full"
      >
        <div className="p-4">
          {/* Header - exact same as other cards */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30">
                CREATE
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">+</div>
              <div className="text-xs text-black-400">new market</div>
            </div>
          </div>

          {/* Title - same height as other cards */}
          <h3 className="text-white font-medium mb-4 leading-tight text-sm line-clamp-2">
            Create Your Own Degen Market
          </h3>

          {/* Betting Options - same spacing as other cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 transition-colors">
              <span className="text-white text-sm font-bold">Create 0.01 ETH</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 transition-colors">
              <span className="text-white text-sm font-bold">Earn 2%</span>
            </div>
          </div>

          {/* Footer - exact same as other cards */}
          <div className="flex items-center justify-between text-xs text-black-400">
            <span>AI: <span className="text-orange-400 font-bold">CREATE</span></span>
            <span>🔥</span>
          </div>
        </div>
      </button>

      {/* Create Market Modal */}
      {showModal && <CreateMarketModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function CreateMarketModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CRYPTO',
    endDate: '',
    creationFee: '0.01'
  });

  const categories = ['CRYPTO', 'DEFI', 'LAUNCH', 'AIRDROP', 'GOVERNANCE', 'MEME', 'DEGEN'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Web3 integration later
    console.log('Creating market:', formData);
    alert('🚀 Market creation coming soon! Web3 integration in progress...');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black-900 border border-orange-500/50 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-orange-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-sm">🔥</span>
              </div>
              <h3 className="text-orange-400 font-bold">CREATE DEGEN MARKET</h3>
            </div>
            <button
              onClick={onClose}
              className="text-black-400 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Market Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Market Question *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Will Pepe reach $1 by end of 2024?"
                className="w-full px-3 py-2 bg-black-800 border border-black-600 rounded text-white placeholder-black-400 focus:border-orange-500 focus:outline-none transition-colors text-sm"
                required
              />
              <p className="text-xs text-black-400 mt-1">Make it spicy! Degen markets perform better 🌶️</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the market conditions, what counts as a win, etc..."
                rows={3}
                className="w-full px-3 py-2 bg-black-800 border border-black-600 rounded text-white placeholder-black-400 focus:border-orange-500 focus:outline-none transition-colors resize-none text-sm"
              />
            </div>

            {/* Category and End Date Row */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black-800 border border-black-600 rounded text-white focus:border-orange-500 focus:outline-none transition-colors text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  📅 End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-black-800 border border-black-600 rounded text-white focus:border-orange-500 focus:outline-none transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Creation Fee Display */}
            <div className="bg-black-800 border border-orange-500/30 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">#</span>
                  <span className="text-white font-semibold text-sm">Creation Fee</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-400">{formData.creationFee} ETH</div>
                  <div className="text-xs text-black-400">≈ $25.50 USD</div>
                </div>
              </div>
              <p className="text-xs text-black-400 mt-2">
                You'll earn 2% of all trading volume on your market! 💰
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-black-800 border border-black-600 text-white hover:border-black-500 transition-colors text-sm rounded"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm rounded transition-all"
              >
                ⚡ CREATE & PAY
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
