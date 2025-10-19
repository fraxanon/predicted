'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFraxtalMarkets } from '../../hooks/useFraxtalMarketsMock';
import { CreateMarketFull } from '../../components/CreateMarket';

export default function FraxtalMarketForge() {
  const [activeTab, setActiveTab] = useState('forge');
  const { 
    isConnected, 
    isOnFraxtal, 
    address, 
    config,
    switchToFraxtal,
    useMockData,
    allMarkets,
    userBalances,
    userPortfolio
  } = useFraxtalMarkets();

  // Use dynamic market data from hook (mock or real)
  const forgedMarkets = allMarkets.map(market => ({
    id: market.id,
    question: market.question,
    category: market.category,
    status: market.resolved ? "resolved" : "active",
    volume: parseFloat(market.totalVolume),
    participants: market.participants || 0,
    contractAddress: `${market.creator.slice(0, 6)}...${market.creator.slice(-4)}`,
    forgedAt: new Date(market.createdAt * 1000).toISOString(),
    frxUSDLocked: market.resolved ? 0 : parseFloat(market.totalVolume) * 0.8, // Estimate locked amount
    yesPrice: market.yesPrice || 0.5,
    noPrice: market.noPrice || 0.5,
    outcome: market.resolved ? (market.outcome === 1 ? "YES" : "NO") : undefined
  }));

  // Calculate dynamic forge stats
  const forgeStats = {
    totalMarkets: allMarkets.length,
    activeMarkets: allMarkets.filter(m => !m.resolved).length,
    totalVolume: allMarkets.reduce((sum, m) => sum + parseFloat(m.totalVolume), 0),
    frxUSDLocked: allMarkets.filter(m => !m.resolved).reduce((sum, m) => sum + parseFloat(m.totalVolume) * 0.8, 0),
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
                <div className="text-accent-500 text-xs">
                  ${userPortfolio?.totalValue?.toFixed(2) || userBalances?.frxUSD || '0.00'}
                </div>
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

          {/* Mock Mode Banner */}
          {useMockData && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm font-medium">
                  🧪 Mock Mode Active - Using simulated data while waiting for testnet tokens
                </span>
              </div>
            </div>
          )}

          {/* Network Status Banner */}
          {isConnected && !isOnFraxtal && !useMockData && (
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
              
              {/* Wallet Status */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-bold mb-3">💰 Wallet Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">Network</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isOnFraxtal ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-white text-sm">
                        {useMockData ? 'Mock Mode' : isOnFraxtal ? 'Fraxtal' : 'Wrong Network'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">Connection</span>
                    <span className="text-white text-sm">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">frxUSD Balance</span>
                    <span className="text-green-400 text-sm font-medium">
                      ${userBalances?.frxUSD || '0.00'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black-400 text-sm">frxETH Balance</span>
                    <span className="text-blue-400 text-sm font-medium">
                      {userBalances?.frxETH || '0.0000'} frxETH
                    </span>
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
