'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function FraxtalMarketForge() {
  const [activeTab, setActiveTab] = useState('forge');
  const [isForging, setIsForging] = useState(false);

  // Mock data
  const deployedMarkets = [
    {
      id: 1,
      question: "Will Bitcoin reach $100k by end of 2024?",
      category: "Crypto",
      status: "active",
      volume: 15420,
      participants: 234,
      deployedAt: "2024-10-15T10:30:00Z"
    },
    {
      id: 2,
      question: "Will Tesla stock hit $300 this quarter?",
      category: "Stocks",
      status: "resolved",
      volume: 8750,
      participants: 156,
      deployedAt: "2024-10-10T14:20:00Z"
    },
    {
      id: 3,
      question: "Will AI regulation pass in the US this year?",
      category: "Politics",
      status: "active",
      volume: 12300,
      participants: 189,
      deployedAt: "2024-10-12T09:15:00Z"
    }
  ];

  const trendingTopics = [
    {
      topic: "Bitcoin ETF Approval",
      category: "Crypto",
      sentiment: 0.85,
      volume: 12500,
      marketPotential: "high"
    },
    {
      topic: "Tesla Earnings Q4",
      category: "Stocks",
      sentiment: 0.62,
      volume: 8900,
      marketPotential: "medium"
    },
    {
      topic: "AI Safety Regulation",
      category: "Tech",
      sentiment: 0.45,
      volume: 6700,
      marketPotential: "medium"
    }
  ];

  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Header */}
      <header className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-accent-400 hover:text-accent-300">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  🏭
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Market Agent - "Deployer"</h1>
                  <p className="text-sm text-gray-400">Prediction Market Creation & Deployment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Markets Deployed</p>
                <p className="text-2xl font-bold text-white">{deployedMarkets.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                🚀
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${deployedMarkets.reduce((sum, m) => sum + m.volume, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Markets</p>
                <p className="text-2xl font-bold text-white">
                  {deployedMarkets.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Participants</p>
                <p className="text-2xl font-bold text-white">
                  {deployedMarkets.reduce((sum, m) => sum + m.participants, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                👥
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-black-900 p-1 rounded-lg border border-black-800">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'deploy'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🚀 Deploy New Market
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'markets'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📈 Deployed Markets
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'trending'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎯 Trending Topics
          </button>
        </div>

        {/* Deploy New Market Tab */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div className="bg-black-900 border border-black-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🚀 Create New Prediction Market</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Market Question
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
                    className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2">
                      <option>Crypto</option>
                      <option>Stocks</option>
                      <option>Politics</option>
                      <option>Sports</option>
                      <option>Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Resolution Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Market Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional context and resolution criteria..."
                    className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2"
                  />
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Deploy Market
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deployed Markets Tab */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="bg-black-900 border border-black-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">📈 Your Deployed Markets</h2>
              
              <div className="space-y-4">
                {deployedMarkets.map((market) => (
                  <div key={market.id} className="border border-black-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{market.question}</h3>
                        <p className="text-sm text-gray-400">Category: {market.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                        market.status === 'active' ? 'bg-green-900 text-green-400' :
                        'bg-gray-900 text-gray-400'
                      }`}>
                        {market.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Volume</p>
                        <p className="text-white font-medium">${market.volume.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Participants</p>
                        <p className="text-white font-medium">{market.participants}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Deployed</p>
                        <p className="text-white font-medium">
                          {new Date(market.deployedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Topics Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="bg-black-900 border border-black-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🎯 Trending Topics for Market Creation</h2>
              
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="border border-black-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{topic.topic}</h3>
                        <p className="text-sm text-gray-400">Category: {topic.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                        topic.marketPotential === 'high' ? 'bg-green-900 text-green-400' :
                        topic.marketPotential === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                        'bg-red-900 text-red-400'
                      }`}>
                        {topic.marketPotential.toUpperCase()} POTENTIAL
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-400">Sentiment</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-black-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${topic.sentiment * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{(topic.sentiment * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Discussion Volume</p>
                        <p className="text-white font-medium">{topic.volume.toLocaleString()}</p>
                      </div>
                      <div className="md:col-span-2">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition-colors">
                          Create Market from Topic
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
