'use client';

import React from 'react';

interface FlywheelBenefitsProps {
  userStakedPRED: number;
  userVePRED: number;
}

export function FlywheelBenefits({ userStakedPRED, userVePRED }: FlywheelBenefitsProps) {
  // Calculate flywheel multiplier based on staked $PRED
  const getFlywheelMultiplier = (stakedAmount: number) => {
    if (stakedAmount >= 10000) return 2.5; // Max multiplier
    if (stakedAmount >= 5000) return 2.2;
    if (stakedAmount >= 2500) return 2.0;
    if (stakedAmount >= 1000) return 1.8;
    if (stakedAmount >= 500) return 1.5;
    return 1.0; // Base multiplier
  };

  const currentMultiplier = getFlywheelMultiplier(userStakedPRED);
  const nextTier = userStakedPRED < 10000 ? 
    [500, 1000, 2500, 5000, 10000].find(tier => tier > userStakedPRED) : null;

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-purple-400 font-bold text-lg">🌪️ Fraxtal Flywheel</h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full">
            {currentMultiplier}x ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current Benefits */}
        <div className="bg-black-800 border border-purple-700 rounded-lg p-3">
          <h4 className="text-purple-400 font-medium text-sm mb-2">🎯 Your Benefits</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-black-400">Staked $PRED:</span>
              <span className="text-white font-bold">{userStakedPRED.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">vePRED Power:</span>
              <span className="text-purple-400 font-bold">{userVePRED.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">frxUSD Bonus:</span>
              <span className="text-green-400 font-bold">+{((currentMultiplier - 1) * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black-400">Cashout Multiplier:</span>
              <span className="text-purple-400 font-bold">{currentMultiplier}x</span>
            </div>
          </div>
        </div>

        {/* Flywheel Mechanics */}
        <div className="bg-black-800 border border-blue-700 rounded-lg p-3">
          <h4 className="text-blue-400 font-medium text-sm mb-2">⚙️ How It Works</h4>
          <div className="space-y-1 text-xs text-black-300">
            <p>• Stake more $PRED → Higher multiplier</p>
            <p>• Cash out to frxUSD → Earn 4.1% APY</p>
            <p>• frxUSD on Fraxtal → Lower fees</p>
            <p>• More usage → More rewards</p>
          </div>
        </div>
      </div>

      {/* Multiplier Tiers */}
      <div className="mb-4">
        <h4 className="text-white font-medium text-sm mb-2">📈 Multiplier Tiers</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { amount: 500, multiplier: 1.5 },
            { amount: 1000, multiplier: 1.8 },
            { amount: 2500, multiplier: 2.0 },
            { amount: 5000, multiplier: 2.2 },
            { amount: 10000, multiplier: 2.5 }
          ].map((tier) => (
            <div
              key={tier.amount}
              className={`p-2 rounded border text-center ${
                userStakedPRED >= tier.amount
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : userStakedPRED >= tier.amount * 0.8
                  ? 'bg-purple-900/50 border-purple-600 text-purple-300'
                  : 'bg-black-800 border-black-700 text-black-400'
              }`}
            >
              <div className="text-xs font-bold">{tier.multiplier}x</div>
              <div className="text-xs">{tier.amount.toLocaleString()} $PRED</div>
            </div>
          ))}
          <div className="p-2 rounded border text-center bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500 text-white">
            <div className="text-xs font-bold">MAX</div>
            <div className="text-xs">2.5x</div>
          </div>
        </div>
      </div>

      {/* Next Tier Progress */}
      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-black-400">Progress to {getFlywheelMultiplier(nextTier)}x multiplier:</span>
            <span className="text-white">{userStakedPRED.toLocaleString()} / {nextTier.toLocaleString()} $PRED</span>
          </div>
          <div className="w-full bg-black-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((userStakedPRED / nextTier) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-black-400 mt-1">
            Stake {(nextTier - userStakedPRED).toLocaleString()} more $PRED to unlock {getFlywheelMultiplier(nextTier)}x multiplier
          </p>
        </div>
      )}

      {/* frxUSD Benefits */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600 rounded-lg p-3">
        <h4 className="text-purple-400 font-medium text-sm mb-2">🟣 frxUSD Advantages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-white">4.1% APY from Treasury yields</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-white">Fully backed by US Treasury assets</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-white">Native to Fraxtal (lower fees)</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">Instant transfers on Fraxtal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">24/7/365 availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">⚡</span>
              <span className="text-white">Flywheel multiplier rewards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
