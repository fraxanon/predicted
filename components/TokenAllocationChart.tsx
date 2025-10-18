'use client';

import React from 'react';

export function TokenAllocationChart() {
  // Frax-aligned $PRED token allocation data
  const allocationData = [
    { category: 'vePRED Staking', amount: 35, color: 'bg-purple-500', description: 'Vote-escrowed governance tokens' },
    { category: 'Treasury Reserves', amount: 25, color: 'bg-blue-500', description: 'Protocol stability & growth' },
    { category: 'Agent Rewards', amount: 20, color: 'bg-green-500', description: 'AI agent performance incentives' },
    { category: 'Liquidity Mining', amount: 10, color: 'bg-yellow-500', description: 'DEX liquidity incentives' },
    { category: 'Team & Advisors', amount: 6, color: 'bg-red-500', description: 'Core team allocation' },
    { category: 'Community Fund', amount: 4, color: 'bg-cyan-500', description: 'Grants & ecosystem development' }
  ];

  const totalSupply = 1000000000; // 1B tokens
  
  // Calculate pie chart segments
  const createPieSegments = () => {
    let cumulativePercentage = 0;
    return allocationData.map((item, index) => {
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      const endAngle = (cumulativePercentage + item.amount) * 3.6;
      cumulativePercentage += item.amount;
      
      return {
        ...item,
        startAngle,
        endAngle,
        tokens: Math.floor((item.amount / 100) * totalSupply)
      };
    });
  };

  const segments = createPieSegments();

  return (
    <div className="space-y-6">
      {/* Visual Pie Chart using CSS */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Pie Chart Background */}
          <div className="w-full h-full rounded-full bg-black-700 relative overflow-hidden">
            {segments.map((segment, index) => {
              const angle = segment.endAngle - segment.startAngle;
              const rotation = segment.startAngle - 90; // Start from top
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 ${segment.color.replace('bg-', 'border-')} border-8`}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((segment.startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segment.startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((segment.endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((segment.endAngle - 90) * Math.PI / 180)}%)`,
                    borderRadius: '50%'
                  }}
                />
              );
            })}
          </div>
          
          {/* Center Circle with Total */}
          <div className="absolute inset-6 bg-black-900 rounded-full flex items-center justify-center border-2 border-black-600">
            <div className="text-center">
              <div className="text-white font-bold text-lg">1B</div>
              <div className="text-black-400 text-xs">$PRED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-black-900 rounded-lg border border-black-700">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${segment.color}`}></div>
              <div>
                <div className="text-white font-medium text-sm">{segment.category}</div>
                <div className="text-black-400 text-xs">{segment.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{segment.amount}%</div>
              <div className="text-black-400 text-xs">{segment.tokens.toLocaleString()} tokens</div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-3 text-center">
          <div className="text-purple-400 font-bold text-lg">350M</div>
          <div className="text-white text-sm">vePRED Staked</div>
          <div className="text-black-400 text-xs">35% of supply</div>
        </div>
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 text-center">
          <div className="text-blue-400 font-bold text-lg">250M</div>
          <div className="text-white text-sm">Treasury</div>
          <div className="text-black-400 text-xs">25% of supply</div>
        </div>
      </div>
    </div>
  );
}
