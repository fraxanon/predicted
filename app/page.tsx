'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black-950">
      {/* Header */}
      <header className="border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="logo text-xl sm:text-2xl font-bold">
                <span className="text-white">[</span>
                <span className="text-white">Predicted</span>
                <span className="text-white">]</span>
              </h1>
            </div>

            {/* Connect Wallet */}
            <div className="flex items-center space-x-4">
              <ConnectButton 
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <WelcomeSection />
        ) : (
          <DashboardSection />
        )}
      </main>
    </div>
  );
}

function WelcomeSection() {
  return (
    <div className="text-center py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          AI-Powered Web3 
          <br />
          <span className="text-white">Prediction Markets</span>
        </h2>
        
        <p className="text-lg sm:text-xl text-black-300 mb-8 max-w-2xl mx-auto">
          Bet on Web3 news and events with AI-powered insights. 
          Our multi-agent system analyzes markets in real-time.
        </p>

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

        {/* CTA */}
        <div className="mt-16">
          <p className="text-black-400 mb-4">Connect your wallet to start predicting</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSection() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Markets" value="12" />
        <StatCard title="Total Volume" value="$45.2K" />
        <StatCard title="AI Accuracy" value="78.5%" />
        <StatCard title="Your Bets" value="3" />
      </div>

      {/* Markets Preview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Latest Markets</h3>
          <button className="btn-ghost text-sm">View All</button>
        </div>
        
        <div className="space-y-4">
          <MarketPreview
            title="Will Coinbase launch a new Layer 2 by Q4 2024?"
            category="Launch"
            aiPrediction="Yes - 72%"
            volume="$12.5K"
            endDate="Dec 31, 2024"
          />
          <MarketPreview
            title="Major DeFi protocol announces token airdrop?"
            category="Airdrop"
            aiPrediction="No - 45%"
            volume="$8.3K"
            endDate="Nov 15, 2024"
          />
          <MarketPreview
            title="Ethereum gas fees drop below 10 gwei average?"
            category="DeFi"
            aiPrediction="Yes - 63%"
            volume="$5.7K"
            endDate="Oct 30, 2024"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, label }: {
  title: string;
  description: string;
  label: string;
}) {
  return (
    <div className="card-hover text-left p-6 border-l-2 border-accent-500">
      <div className="flex items-center justify-between mb-4">
        <span className="badge-accent text-xs font-mono">{label}</span>
        <div className="w-2 h-2 bg-accent-500"></div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-mono tracking-wide">{title}</h3>
      <p className="text-sm text-black-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-black-400">{title}</div>
    </div>
  );
}

function MarketPreview({ 
  title, 
  category, 
  aiPrediction, 
  volume, 
  endDate 
}: {
  title: string;
  category: string;
  aiPrediction: string;
  volume: string;
  endDate: string;
}) {
  return (
    <div className="border border-black-800 p-4 hover:border-black-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-secondary text-xs">{category}</span>
            <span className="text-xs text-black-500">Ends {endDate}</span>
          </div>
          <h4 className="text-white font-medium mb-2">{title}</h4>
          <div className="flex items-center gap-4 text-sm text-black-400">
            <span>AI: {aiPrediction}</span>
            <span>Volume: {volume}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs px-3 py-1">View</button>
          <button className="btn-primary text-xs px-3 py-1">Bet</button>
        </div>
      </div>
    </div>
  );
}
