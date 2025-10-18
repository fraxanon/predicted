'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FlywheelBenefits } from '../../components/FlywheelBenefits';
import { StakeWinningsModal } from '../../components/StakeWinningsModal';

export default function StakingPage() {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<'pred' | 'frxusd' | 'lp'>('pred');

  // Mock staking data
  const userStakedPRED = 2450;
  const userVePRED = 1.18;
  
  const agentEarnings = {
    prophet: { totalWinnings: 2847.32 },
    cashier: { totalWinnings: 1923.67 },
    seer: { totalWinnings: 1456.89 }
  };

  const stakingPools = [
    {
      id: 'pred',
      name: '$PRED Staking',
      icon: '🟣',
      description: 'Stake PRED tokens for vePRED governance power',
      apy: '3-15%',
      tvl: '$2.85M',
      userStaked: '$12,450',
      rewards: '$1,247',
      color: 'purple',
      featured: true
    },
    {
      id: 'frxusd',
      name: 'frxUSD Yield',
      icon: '🟡',
      description: 'Earn yield on frxUSD Treasury backing',
      apy: '4.1%',
      tvl: '$1.92M',
      userStaked: '$5,680',
      rewards: '$234',
      color: 'yellow',
      featured: false
    },
    {
      id: 'lp',
      name: 'PRED/frxUSD LP',
      icon: '💧',
      description: 'Provide liquidity for trading rewards',
      apy: '8.5%',
      tvl: '$890K',
      userStaked: '$2,340',
      rewards: '$198',
      color: 'blue',
      featured: false
    }
  ];

  const selectedPoolData = stakingPools.find(pool => pool.id === selectedPool);

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
                Staking
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
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Staking Hub</h1>
            <p className="text-black-400 text-sm hidden md:block">Stake your tokens, earn rewards, and participate in governance</p>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              {/* Flywheel Benefits */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">🌪️ Flywheel Benefits</h2>
                <FlywheelBenefits 
                  userStakedPRED={userStakedPRED}
                  userVePRED={userVePRED}
                />
              </div>

              {/* Staking Pools */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">💰 Staking Pools</h2>
                
                {/* Pool Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {stakingPools.map((pool) => (
                    <button
                      key={pool.id}
                      onClick={() => setSelectedPool(pool.id as any)}
                      className={`p-4 rounded border text-left transition-all ${
                        selectedPool === pool.id
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-black-900 border-black-700 text-black-300 hover:border-purple-600'
                      } ${pool.featured ? 'ring-1 ring-purple-500' : ''}`}
                    >
                      {pool.featured && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">FEATURED</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg">{pool.icon}</span>
                        <div>
                          <div className="font-bold text-sm">{pool.name}</div>
                          <div className="text-xs opacity-75">{pool.description}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="opacity-75">APY</div>
                          <div className="font-bold text-green-400">{pool.apy}</div>
                        </div>
                        <div>
                          <div className="opacity-75">TVL</div>
                          <div className="font-bold">{pool.tvl}</div>
                        </div>
                        <div>
                          <div className="opacity-75">Your Stake</div>
                          <div className="font-bold">{pool.userStaked}</div>
                        </div>
                        <div>
                          <div className="opacity-75">Rewards</div>
                          <div className="font-bold text-yellow-400">{pool.rewards}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Pool Details */}
                {selectedPoolData && (
                  <div className="bg-black-900 border border-black-700 rounded p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{selectedPoolData.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{selectedPoolData.name}</h3>
                          <p className="text-black-400 text-sm">{selectedPoolData.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">{selectedPoolData.apy}</div>
                        <div className="text-black-400 text-sm">Current APY</div>
                      </div>
                    </div>

                    {/* Pool Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-black-800 border border-black-700 rounded p-3 text-center">
                        <div className="text-sm font-bold text-white">{selectedPoolData.tvl}</div>
                        <div className="text-black-400 text-xs">Total Value Locked</div>
                      </div>
                      <div className="bg-black-800 border border-black-700 rounded p-3 text-center">
                        <div className="text-sm font-bold text-white">{selectedPoolData.userStaked}</div>
                        <div className="text-black-400 text-xs">Your Stake</div>
                      </div>
                      <div className="bg-black-800 border border-black-700 rounded p-3 text-center">
                        <div className="text-sm font-bold text-yellow-400">{selectedPoolData.rewards}</div>
                        <div className="text-black-400 text-xs">Pending Rewards</div>
                      </div>
                      <div className="bg-black-800 border border-black-700 rounded p-3 text-center">
                        <div className="text-sm font-bold text-purple-400">{userVePRED.toFixed(2)}</div>
                        <div className="text-black-400 text-xs">vePRED Power</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => setShowStakeModal(true)}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors text-sm"
                      >
                        🏦 Stake More
                      </button>
                      <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors text-sm">
                        💰 Claim Rewards
                      </button>
                      <button className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors text-sm">
                        📤 Unstake
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              {/* Staking Benefits */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-medium mb-3 text-sm">🎯 Staking Benefits</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Earn up to 15% APY on $PRED staking</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Gain vePRED governance voting power</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Unlock flywheel multipliers up to 2.5x</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-purple-400">⚡</span>
                    <span className="text-white">frxUSD yields backed by US Treasury</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-purple-400">⚡</span>
                    <span className="text-white">LP rewards from trading fees</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-purple-400">⚡</span>
                    <span className="text-white">Fraxtal ecosystem incentives</span>
                  </div>
                </div>
              </div>

              {/* Your Staking Stats */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-medium mb-3 text-sm">📊 Your Staking Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Total Staked</span>
                    <span className="text-purple-400 font-bold text-xs">{userStakedPRED.toLocaleString()} PRED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">vePRED Power</span>
                    <span className="text-green-400 font-bold text-xs">{userVePRED.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Current Multiplier</span>
                    <span className="text-yellow-400 font-bold text-xs">2.0x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Next Tier</span>
                    <span className="text-white font-bold text-xs">2.2x at 5K PRED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Staking Modal */}
      <StakeWinningsModal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        agentEarnings={agentEarnings}
      />
    </>
  );
}
