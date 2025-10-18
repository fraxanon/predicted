'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function TreasuryDashboard() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-black-800 bg-black-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/portfolio"
                className="text-right"
              >
                <div className="text-white text-sm font-medium">Portfolio</div>
                <div className="text-accent-500 text-xs">$6,227.88</div>
              </a>
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

      {/* Navigation */}
      <nav className="border-b border-black-800 bg-black-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex space-x-6">
              <a href="/" className="text-black-400 hover:text-white text-sm transition-colors">
                Markets
              </a>
              <a href="/docs" className="text-black-400 hover:text-white text-sm transition-colors">
                Docs
              </a>
              <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                Treasury
              </span>
              <a href="/dashboard" className="text-black-400 hover:text-white text-sm transition-colors">
                Cashier Dashboard
              </a>
              <a href="/portfolio" className="text-black-400 hover:text-white text-sm transition-colors">
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-black-950 min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Treasury Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">Manage agent winnings, staking, and transfers</p>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* Treasury Stats */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">🏦 Treasury Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-green-400">$6.23M</div>
                    <div className="text-white text-sm">Total Value Locked</div>
                    <div className="text-black-400 text-xs">Protocol treasury</div>
                  </div>
                  
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-purple-400">2,450</div>
                    <div className="text-white text-sm">Your Staked PRED</div>
                    <div className="text-black-400 text-xs">vePRED governance power</div>
                  </div>
                  
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-blue-400">4.1%</div>
                    <div className="text-white text-sm">frxUSD APY</div>
                    <div className="text-black-400 text-xs">Treasury-backed yield</div>
                  </div>
                </div>
              </div>

          {/* Quick Actions */}
          <div className="bg-black-800 border border-black-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">💰 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                🏦 Stake PRED Tokens
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-colors">
                🟣 Cash Out to frxUSD
              </button>
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                📤 Transfer Funds
              </button>
            </div>
          </div>

          {/* Agent Earnings */}
          <div className="bg-black-800 border border-black-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">🤖 Agent Earnings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📊</span>
                  <div>
                    <div className="text-white font-medium">Prophet Analytics</div>
                    <div className="text-black-400 text-sm">73% success rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">$2,847</div>
                  <div className="text-black-400 text-sm">Total winnings</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">💰</span>
                  <div>
                    <div className="text-white font-medium">Cashier Trading</div>
                    <div className="text-black-400 text-sm">68% success rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">$1,923</div>
                  <div className="text-black-400 text-sm">Total winnings</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🔮</span>
                  <div>
                    <div className="text-white font-medium">Seer Markets</div>
                    <div className="text-black-400 text-sm">81% success rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">$1,456</div>
                  <div className="text-black-400 text-sm">Total winnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Message */}
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
            <div className="text-green-400 font-bold">✅ Treasury Page Working!</div>
            <div className="text-white text-sm mt-1">Navigation is functioning correctly</div>
          </div>
        </div>
      </main>
    </div>
  );
}
