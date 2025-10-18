'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFraxtalMarkets } from '../../hooks/useFraxtalMarkets';
import { CreateMarketFull } from '../../components/CreateMarket';

export default function FraxtalMarketForge() {
  const [activeTab, setActiveTab] = useState('forge');
  const { 
    isConnected, 
    isOnFraxtal, 
    address, 
    config,
    switchToFraxtal 
  } = useFraxtalMarkets();

  // Mock data for forged markets
  const forgedMarkets = [
    {
      id: 1,
      question: "Will Bitcoin reach $100k by end of 2024?",
      category: "CRYPTO",
      status: "active",
      volume: 15420,
      participants: 234,
      contractAddress: "0x1234...5678",
      forgedAt: "2024-10-15T10:30:00Z",
      frxUSDLocked: 12500,
      yesPrice: 0.67,
      noPrice: 0.33
    },
    {
      id: 2,
      question: "Will Fraxtal TVL exceed $1B this year?",
      category: "DEFI",
      status: "active",
      volume: 8750,
      participants: 156,
      contractAddress: "0xabcd...efgh",
      forgedAt: "2024-10-12T14:20:00Z",
      frxUSDLocked: 7800,
      yesPrice: 0.45,
      noPrice: 0.55
    },
    {
      id: 3,
      question: "Will AI regulation pass in the US this year?",
      category: "POLITICS",
      status: "resolved",
      volume: 12300,
      participants: 189,
      contractAddress: "0x9876...5432",
      forgedAt: "2024-10-10T09:15:00Z",
      frxUSDLocked: 0,
      outcome: "YES"
    }
  ];

  const forgeStats = {
    totalMarkets: 47,
    activeMarkets: 23,
    totalVolume: 2847392,
    frxUSDLocked: 1234567,
    successRate: 94.7,
    avgCreationTime: "2.3s",
    gasOptimization: "87%"
  };

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
              <a href="/treasury" className="text-black-400 hover:text-white text-sm transition-colors">
                Treasury
              </a>
              <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                Fraxtal Market Forge
              </span>
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
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">⚒️ Fraxtal Market Forge</h1>
            <p className="text-black-400 text-sm hidden md:block">Deploy smart contract prediction markets on Fraxtal using frxUSD</p>
          </div>

          {/* Network Status Banner */}
          {isConnected && !isOnFraxtal && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-sm font-medium">Switch to Fraxtal Network</span>
                </div>
                <button
                  onClick={switchToFraxtal}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black-950 text-xs font-bold rounded transition-colors"
                >
                  Switch Network
                </button>
              </div>
            </div>
          )}

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              
              {/* Tab Navigation */}
              <div className="bg-black-800 border border-black-700 rounded-lg">
                <div className="flex border-b border-black-700">
                  <button
                    onClick={() => setActiveTab('forge')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'forge' 
                        ? 'text-accent-500 border-b-2 border-accent-500' 
                        : 'text-black-400 hover:text-white'
                    }`}
                  >
                    🔥 Forge Market
                  </button>
                  <button
                    onClick={() => setActiveTab('markets')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'markets' 
                        ? 'text-accent-500 border-b-2 border-accent-500' 
                        : 'text-black-400 hover:text-white'
                    }`}
                  >
                    📋 My Markets
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'analytics' 
                        ? 'text-accent-500 border-b-2 border-accent-500' 
                        : 'text-black-400 hover:text-white'
                    }`}
                  >
                    📊 Analytics
                  </button>
                </div>

                <div className="p-4">
                  {/* Forge Market Tab */}
                  {activeTab === 'forge' && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">⚒️</div>
                        <h2 className="text-xl font-bold text-white mb-2">Smart Contract Market Creation</h2>
                        <p className="text-black-400 mb-6">
                          Deploy prediction markets directly to Fraxtal blockchain using our optimized smart contracts
                        </p>
                        
                        <CreateMarketFull />
                      </div>
                    </div>
                  )}

                  {/* My Markets Tab */}
                  {activeTab === 'markets' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Forged Markets</h3>
                        <div className="text-sm text-black-400">
                          {forgedMarkets.length} markets created
                        </div>
                      </div>

                      {forgedMarkets.map((market) => (
                        <div key={market.id} className="bg-black-900 border border-black-700 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-white font-medium mb-1">{market.question}</h4>
                              <div className="flex items-center gap-3 text-xs text-black-400">
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                  {market.category}
                                </span>
                                <span>Contract: {market.contractAddress}</span>
                                <span>{new Date(market.forgedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              market.status === 'active' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {market.status.toUpperCase()}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-black-400">Volume</div>
                              <div className="text-white font-medium">${market.volume.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-black-400">Participants</div>
                              <div className="text-white font-medium">{market.participants}</div>
                            </div>
                            <div>
                              <div className="text-black-400">frxUSD Locked</div>
                              <div className="text-white font-medium">
                                {market.status === 'resolved' ? '0' : market.frxUSDLocked.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-black-400">
                                {market.status === 'resolved' ? 'Outcome' : 'YES Price'}
                              </div>
                              <div className="text-white font-medium">
                                {market.status === 'resolved' 
                                  ? market.outcome 
                                  : `$${market.yesPrice?.toFixed(2) || '0.00'}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-white">Forge Performance</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">{forgeStats.totalMarkets}</div>
                          <div className="text-xs text-black-400">Total Markets</div>
                        </div>
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">{forgeStats.activeMarkets}</div>
                          <div className="text-xs text-black-400">Active Markets</div>
                        </div>
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">${(forgeStats.totalVolume / 1000).toFixed(1)}K</div>
                          <div className="text-xs text-black-400">Total Volume</div>
                        </div>
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">{forgeStats.successRate}%</div>
                          <div className="text-xs text-black-400">Success Rate</div>
                        </div>
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-orange-400">{forgeStats.avgCreationTime}</div>
                          <div className="text-xs text-black-400">Avg Creation Time</div>
                        </div>
                        <div className="bg-black-900 border border-black-700 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-red-400">{forgeStats.gasOptimization}%</div>
                          <div className="text-xs text-black-400">Gas Optimized</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              
              {/* Forge Status */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-bold mb-3">⚒️ Forge Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">Network</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnFraxtal ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-white text-sm">
                        {isOnFraxtal ? 'Fraxtal' : 'Wrong Network'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">Wallet</span>
                    <span className="text-white text-sm">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">Factory Contract</span>
                    <span className="text-green-400 text-sm">Deployed</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-bold mb-3">📊 Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-black-400 text-sm">Markets Forged</span>
                    <span className="text-white text-sm font-medium">{forgeStats.totalMarkets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-400 text-sm">Total Volume</span>
                    <span className="text-white text-sm font-medium">${(forgeStats.totalVolume / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-400 text-sm">frxUSD Locked</span>
                    <span className="text-white text-sm font-medium">${(forgeStats.frxUSDLocked / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-400 text-sm">Success Rate</span>
                    <span className="text-green-400 text-sm font-medium">{forgeStats.successRate}%</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-bold mb-3">🔥 Recent Forging</h3>
                <div className="space-y-3">
                  {forgedMarkets.slice(0, 3).map((market) => (
                    <div key={market.id} className="text-sm">
                      <div className="text-white font-medium truncate">
                        {market.question.substring(0, 40)}...
                      </div>
                      <div className="text-black-400 text-xs">
                        {new Date(market.forgedAt).toLocaleDateString()} • {market.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
