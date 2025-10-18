'use client';

import React from 'react';

export function RevenueStreamsChart() {
  // Protocol revenue streams aligned with Frax model
  const revenueStreams = [
    {
      source: 'Prediction Market Fees',
      monthlyRevenue: 125000,
      growth: 18.5,
      color: 'bg-green-500',
      icon: '🎯',
      description: '2% fee on all market transactions'
    },
    {
      source: 'frxUSD Cashout Premium',
      monthlyRevenue: 89000,
      growth: 24.2,
      color: 'bg-purple-500',
      icon: '🟣',
      description: 'Premium fees for frxUSD conversions'
    },
    {
      source: 'Staking Protocol Fees',
      monthlyRevenue: 67000,
      growth: 15.8,
      color: 'bg-blue-500',
      icon: '🏦',
      description: 'vePRED staking and governance fees'
    },
    {
      source: 'Agent Performance Fees',
      monthlyRevenue: 43000,
      growth: 31.4,
      color: 'bg-yellow-500',
      icon: '🤖',
      description: 'AI agent success-based commissions'
    },
    {
      source: 'Fraxtal Network Rewards',
      monthlyRevenue: 28000,
      growth: 12.7,
      color: 'bg-cyan-500',
      icon: '⚡',
      description: 'Fraxtal ecosystem incentives'
    }
  ];

  const totalMonthlyRevenue = revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
  const maxRevenue = Math.max(...revenueStreams.map(s => s.monthlyRevenue));

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-xl">${totalMonthlyRevenue.toLocaleString()}</div>
          <div className="text-white text-sm">Monthly Revenue</div>
          <div className="text-black-400 text-xs">All streams combined</div>
        </div>
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
          <div className="text-blue-400 font-bold text-xl">${(totalMonthlyRevenue * 12).toLocaleString()}</div>
          <div className="text-white text-sm">Annual Run Rate</div>
          <div className="text-black-400 text-xs">Projected yearly</div>
        </div>
      </div>

      {/* Revenue Streams Breakdown */}
      <div className="space-y-3">
        {revenueStreams.map((stream, index) => {
          const percentage = (stream.monthlyRevenue / totalMonthlyRevenue) * 100;
          const barWidth = (stream.monthlyRevenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="bg-black-900 border border-black-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{stream.icon}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{stream.source}</div>
                    <div className="text-black-400 text-xs">{stream.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${stream.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-black-400 text-xs">{percentage.toFixed(1)}% of total</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-black-700 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${stream.color} transition-all duration-1000`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
              
              {/* Growth Indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-black-400">30-day growth</span>
                <div className="flex items-center space-x-1">
                  <span className={`${stream.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stream.growth > 0 ? '↗' : '↘'} {Math.abs(stream.growth)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Distribution Chart */}
      <div className="bg-black-900 border border-black-700 rounded-lg p-4">
        <h4 className="text-white font-medium text-sm mb-3">Revenue Distribution</h4>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {revenueStreams.map((stream, index) => {
            const percentage = (stream.monthlyRevenue / totalMonthlyRevenue) * 100;
            return (
              <div
                key={index}
                className={`${stream.color} flex items-center justify-center text-white text-xs font-bold`}
                style={{ width: `${percentage}%` }}
                title={`${stream.source}: ${percentage.toFixed(1)}%`}
              >
                {percentage > 15 ? `${percentage.toFixed(0)}%` : ''}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-black-400 mt-2">
          <span>Revenue Sources</span>
          <span>Total: ${totalMonthlyRevenue.toLocaleString()}/month</span>
        </div>
      </div>

      {/* Frax Alignment Metrics */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700 rounded-lg p-4">
        <h4 className="text-purple-400 font-medium text-sm mb-3">🟣 Frax Ecosystem Synergy</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">89%</div>
            <div className="text-white text-xs">frxUSD Adoption</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold text-lg">$28K</div>
            <div className="text-white text-xs">Fraxtal Rewards</div>
          </div>
        </div>
      </div>
    </div>
  );
}
