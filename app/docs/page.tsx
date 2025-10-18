'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Navigation Header */}
      <nav className="bg-black-900 border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="text-black-400 hover:text-white text-sm transition-colors">
                  Markets
                </Link>
                <span className="text-white text-sm font-medium">Docs</span>
                <Link href="/treasury" className="text-black-400 hover:text-white text-sm transition-colors">
                  Treasury
                </Link>
                <Link href="/staking" className="text-black-400 hover:text-white text-sm transition-colors">
                  Staking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">📚 Documentation</h1>
            <p className="text-black-400">Learn how to use the prediction market platform</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/treasury" className="bg-black-800 border border-black-700 rounded-lg p-6 hover:border-purple-600 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🏦</span>
                <h3 className="text-lg font-bold text-white">Treasury</h3>
              </div>
              <p className="text-black-400 text-sm">Manage your agent winnings, stake tokens, and cash out to frxUSD</p>
            </Link>

            <Link href="/staking" className="bg-black-800 border border-black-700 rounded-lg p-6 hover:border-purple-600 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🏦</span>
                <h3 className="text-lg font-bold text-white">Staking</h3>
              </div>
              <p className="text-black-400 text-sm">Stake PRED tokens for governance power and earn rewards</p>
            </Link>

            <div className="bg-black-800 border border-black-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-bold text-white">AI Agents</h3>
              </div>
              <p className="text-black-400 text-sm">Learn about Prophet, Cashier, and Seer AI agents</p>
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="space-y-6">
            <div className="bg-black-800 border border-black-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🟣 Frax Finance Integration</h2>
              <div className="space-y-4 text-black-300">
                <p>Our platform is built on Fraxtal and integrates deeply with the Frax ecosystem:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>frxUSD:</strong> Earn 4.1% APY from US Treasury-backed yields</li>
                  <li><strong>vePRED:</strong> Vote-escrowed governance tokens with up to 4x multiplier</li>
                  <li><strong>Flywheel:</strong> Stake more PRED to unlock higher cashout multipliers</li>
                  <li><strong>Fraxtal Network:</strong> Lower fees and faster transactions</li>
                </ul>
              </div>
            </div>

            <div className="bg-black-800 border border-black-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">💰 Token Economics</h2>
              <div className="space-y-4 text-black-300">
                <p>PRED token allocation and utility:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>35% vePRED Staking:</strong> Governance and voting power</li>
                  <li><strong>25% Treasury Reserves:</strong> Protocol stability and growth</li>
                  <li><strong>20% Agent Rewards:</strong> AI performance incentives</li>
                  <li><strong>10% Liquidity Mining:</strong> DEX rewards</li>
                  <li><strong>6% Team & Advisors:</strong> Core development</li>
                  <li><strong>4% Community Fund:</strong> Ecosystem grants</li>
                </ul>
              </div>
            </div>

            <div className="bg-black-800 border border-black-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎯 How It Works</h2>
              <div className="space-y-4 text-black-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-white mb-2">1. Prediction Markets</h3>
                    <p>Create and trade on decentralized prediction markets with AI agent assistance.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">2. AI Agents</h3>
                    <p>Prophet analyzes markets, Cashier manages trades, Seer creates new markets.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">3. Stake & Earn</h3>
                    <p>Stake PRED tokens for vePRED governance power and earn protocol rewards.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">4. Cash Out</h3>
                    <p>Convert winnings to frxUSD with bonus rates and Treasury-backed yields.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
