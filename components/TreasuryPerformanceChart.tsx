'use client';

import React, { useState } from 'react';

export function TreasuryPerformanceChart() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock treasury performance data
  const performanceData = {
    '7d': [
      { date: 'Oct 11', tvl: 2650000, apy: 4.05, volume: 89000 },
      { date: 'Oct 12', tvl: 2680000, apy: 4.08, volume: 92000 },
      { date: 'Oct 13', tvl: 2720000, apy: 4.12, volume: 87000 },
      { date: 'Oct 14', tvl: 2750000, apy: 4.15, volume: 95000 },
      { date: 'Oct 15', tvl: 2780000, apy: 4.18, volume: 98000 },
      { date: 'Oct 16', tvl: 2820000, apy: 4.12, volume: 103000 },
      { date: 'Oct 17', tvl: 2847000, apy: 4.10, volume: 108000 }
    ],
    '30d': [
      { date: 'Sep 18', tvl: 2200000, apy: 3.85, volume: 65000 },
      { date: 'Sep 25', tvl: 2350000, apy: 3.92, volume: 71000 },
      { date: 'Oct 2', tvl: 2480000, apy: 3.98, volume: 78000 },
      { date: 'Oct 9', tvl: 2620000, apy: 4.05, volume: 85000 },
      { date: 'Oct 16', tvl: 2780000, apy: 4.12, volume: 95000 },
      { date: 'Oct 17', tvl: 2847000, apy: 4.10, volume: 108000 }
    ],
    '90d': [
      { date: 'Jul 20', tvl: 1850000, apy: 3.45, volume: 42000 },
      { date: 'Aug 10', tvl: 1980000, apy: 3.62, volume: 48000 },
      { date: 'Aug 30', tvl: 2120000, apy: 3.78, volume: 55000 },
      { date: 'Sep 20', tvl: 2280000, apy: 3.89, volume: 67000 },
      { date: 'Oct 10', tvl: 2650000, apy: 4.08, volume: 89000 },
      { date: 'Oct 17', tvl: 2847000, apy: 4.10, volume: 108000 }
    ],
    '1y': [
      { date: 'Nov 2023', tvl: 850000, apy: 2.85, volume: 18000 },
      { date: 'Jan 2024', tvl: 1200000, apy: 3.12, volume: 25000 },
      { date: 'Mar 2024', tvl: 1450000, apy: 3.35, volume: 32000 },
      { date: 'May 2024', tvl: 1680000, apy: 3.58, volume: 38000 },
      { date: 'Jul 2024', tvl: 1920000, apy: 3.72, volume: 45000 },
      { date: 'Sep 2024', tvl: 2380000, apy: 3.95, volume: 72000 },
      { date: 'Oct 2024', tvl: 2847000, apy: 4.10, volume: 108000 }
    ]
  };

  const currentData = performanceData[timeframe];
  const maxTVL = Math.max(...currentData.map(d => d.tvl));
  const maxVolume = Math.max(...currentData.map(d => d.volume));
  const maxAPY = Math.max(...currentData.map(d => d.apy));

  const latestData = currentData[currentData.length - 1];
  const previousData = currentData[currentData.length - 2];
  
  const tvlChange = ((latestData.tvl - previousData.tvl) / previousData.tvl) * 100;
  const apyChange = latestData.apy - previousData.apy;
  const volumeChange = ((latestData.volume - previousData.volume) / previousData.volume) * 100;

  return (
    <div className="space-y-6">
      {/* Time Frame Selector */}
      <div className="flex space-x-2">
        {(['7d', '30d', '90d', '1y'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              timeframe === period
                ? 'bg-purple-600 text-white'
                : 'bg-black-700 text-black-300 hover:bg-black-600'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
          <div className="text-green-400 font-bold text-lg">${(latestData.tvl / 1000000).toFixed(2)}M</div>
          <div className="text-white text-sm">Total Value Locked</div>
          <div className={`text-xs ${tvlChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {tvlChange >= 0 ? '↗' : '↘'} {Math.abs(tvlChange).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
          <div className="text-blue-400 font-bold text-lg">{latestData.apy.toFixed(2)}%</div>
          <div className="text-white text-sm">Current APY</div>
          <div className={`text-xs ${apyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {apyChange >= 0 ? '↗' : '↘'} {Math.abs(apyChange).toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 text-center">
          <div className="text-purple-400 font-bold text-lg">${(latestData.volume / 1000).toFixed(0)}K</div>
          <div className="text-white text-sm">Daily Volume</div>
          <div className={`text-xs ${volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {volumeChange >= 0 ? '↗' : '↘'} {Math.abs(volumeChange).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* TVL Chart */}
      <div className="bg-black-900 border border-black-700 rounded-lg p-4">
        <h4 className="text-white font-medium text-sm mb-4">📈 Total Value Locked (TVL)</h4>
        <div className="relative h-32">
          <div className="absolute inset-0 flex items-end justify-between space-x-1">
            {currentData.map((point, index) => {
              const height = (point.tvl / maxTVL) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-1000 hover:from-green-500 hover:to-green-300"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: $${(point.tvl / 1000000).toFixed(2)}M`}
                  ></div>
                  <div className="text-xs text-black-400 mt-1 transform -rotate-45 origin-left">
                    {point.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* APY & Volume Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* APY Chart */}
        <div className="bg-black-900 border border-black-700 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium text-sm mb-4">📊 APY Trend</h4>
          <div className="relative h-24">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {currentData.map((point, index) => {
                const height = (point.apy / maxAPY) * 100;
                return (
                  <div 
                    key={index}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-1000"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: ${point.apy.toFixed(2)}%`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="bg-black-900 border border-black-700 rounded-lg p-4">
          <h4 className="text-purple-400 font-medium text-sm mb-4">💰 Volume Trend</h4>
          <div className="relative h-24">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {currentData.map((point, index) => {
                const height = (point.volume / maxVolume) * 100;
                return (
                  <div 
                    key={index}
                    className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-1000"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: $${(point.volume / 1000).toFixed(0)}K`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-4">
        <h4 className="text-green-400 font-medium text-sm mb-3">📈 Performance Summary ({timeframe})</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="text-white font-bold">
              ${((latestData.tvl - currentData[0].tvl) / 1000000).toFixed(2)}M
            </div>
            <div className="text-black-400">TVL Growth</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">
              +{(latestData.apy - currentData[0].apy).toFixed(2)}%
            </div>
            <div className="text-black-400">APY Increase</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">
              ${((latestData.volume - currentData[0].volume) / 1000).toFixed(0)}K
            </div>
            <div className="text-black-400">Volume Growth</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">
              {(((latestData.tvl / currentData[0].tvl) - 1) * 100).toFixed(1)}%
            </div>
            <div className="text-black-400">Total Return</div>
          </div>
        </div>
      </div>
    </div>
  );
}
