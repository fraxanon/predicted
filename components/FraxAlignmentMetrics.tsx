'use client';

import React from 'react';

export function FraxAlignmentMetrics() {
  // Frax Finance alignment metrics
  const alignmentMetrics = [
    {
      metric: 'frxUSD Integration',
      current: 89,
      target: 95,
      color: 'bg-purple-500',
      icon: '🟣',
      description: 'Percentage of cashouts using frxUSD',
      trend: '+12%'
    },
    {
      metric: 'Fraxtal Network Usage',
      current: 76,
      target: 90,
      color: 'bg-blue-500',
      icon: '⚡',
      description: 'Transactions on Fraxtal vs other chains',
      trend: '+8%'
    },
    {
      metric: 'vePRED Governance',
      current: 68,
      target: 80,
      color: 'bg-green-500',
      icon: '🗳️',
      description: 'Active governance participation rate',
      trend: '+15%'
    },
    {
      metric: 'Treasury Yield',
      current: 4.1,
      target: 5.0,
      color: 'bg-yellow-500',
      icon: '📈',
      description: 'APY from Treasury-backed assets',
      trend: '+0.3%'
    }
  ];

  const fraxEcosystemStats = {
    totalTVL: 2847000,
    frxUSDVolume: 1923000,
    vePREDHolders: 1247,
    fraxtalTxs: 89234
  };

  return (
    <div className="space-y-6">
      {/* Frax Ecosystem Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 text-center">
          <div className="text-purple-400 font-bold text-lg">${(fraxEcosystemStats.totalTVL / 1000).toFixed(0)}K</div>
          <div className="text-white text-sm">Total TVL</div>
          <div className="text-black-400 text-xs">Protocol locked value</div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
          <div className="text-blue-400 font-bold text-lg">${(fraxEcosystemStats.frxUSDVolume / 1000).toFixed(0)}K</div>
          <div className="text-white text-sm">frxUSD Volume</div>
          <div className="text-black-400 text-xs">Monthly cashouts</div>
        </div>
        
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-lg">{fraxEcosystemStats.vePREDHolders.toLocaleString()}</div>
          <div className="text-white text-sm">vePRED Holders</div>
          <div className="text-black-400 text-xs">Governance participants</div>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-center">
          <div className="text-yellow-400 font-bold text-lg">{(fraxEcosystemStats.fraxtalTxs / 1000).toFixed(0)}K</div>
          <div className="text-white text-sm">Fraxtal TXs</div>
          <div className="text-black-400 text-xs">Monthly transactions</div>
        </div>
      </div>

      {/* Alignment Progress */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">🎯 Frax Alignment Progress</h4>
        {alignmentMetrics.map((metric, index) => (
          <div key={index} className="bg-black-900 border border-black-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{metric.icon}</span>
                <div>
                  <div className="text-white font-medium text-sm">{metric.metric}</div>
                  <div className="text-black-400 text-xs">{metric.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{metric.current}%</div>
                <div className="text-green-400 text-xs">{metric.trend}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-black-700 rounded-full h-3 mb-2">
              <div className="relative h-3 rounded-full bg-black-600">
                <div 
                  className={`h-3 rounded-full ${metric.color} transition-all duration-1000`}
                  style={{ width: `${metric.current}%` }}
                ></div>
                {/* Target indicator */}
                <div 
                  className="absolute top-0 w-0.5 h-3 bg-white opacity-50"
                  style={{ left: `${metric.target}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-black-400">
              <span>Current: {metric.current}%</span>
              <span>Target: {metric.target}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Frax Protocol Benefits */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600 rounded-lg p-4">
        <h4 className="text-purple-400 font-medium text-sm mb-3">🟣 Frax Protocol Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-white">frxUSD 4.1% APY from Treasury yields</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-white">Fraxtal network fee optimization</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-white">vePRED governance alignment</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">Cross-protocol liquidity sharing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">Flywheel multiplier rewards</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">Ecosystem growth incentives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tokenomics Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black-900 border border-purple-700 rounded-lg p-4">
          <h5 className="text-purple-400 font-medium text-sm mb-3">🔒 Vote Escrow Model</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-black-400">Max Lock Period:</span>
              <span className="text-white">4 years (208 weeks)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Max Multiplier:</span>
              <span className="text-purple-400">4x vePRED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Decay Model:</span>
              <span className="text-white">Linear time decay</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Governance Weight:</span>
              <span className="text-green-400">1 vePRED = 1 vote</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black-900 border border-blue-700 rounded-lg p-4">
          <h5 className="text-blue-400 font-medium text-sm mb-3">💰 Revenue Sharing</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-black-400">Protocol Fees:</span>
              <span className="text-white">2% on predictions</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">frxUSD Premium:</span>
              <span className="text-purple-400">+2% bonus rate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Staking Rewards:</span>
              <span className="text-white">3-15% APY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Treasury Yield:</span>
              <span className="text-green-400">4.1% from USTB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
