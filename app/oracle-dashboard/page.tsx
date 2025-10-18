'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TwitterMarketScout } from '../../components/TwitterMarketScout';
import { LiveSearchActivity } from '../../components/LiveSearchActivity';
import { StakingModal } from '../../components/StakingModal';

export default function OracleDashboard() {
  const [showStakingModal, setShowStakingModal] = useState(false);
  const availableBalance = 1450; // Available $PRED tokens

  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Navigation Header - Match Cashier Dashboard */}
      <nav className="bg-black-900 border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-accent-500 font-bold text-lg">🔮</span>
              </Link>
              
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
                  Oracle Dashboard
                </span>
                <a href="/portfolio" className="text-black-400 hover:text-white text-sm transition-colors">
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-black-950 min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Oracle Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">AI-powered market discovery and community governance platform</p>
          </div>

          {/* Oracle Seer - Full Width at Top */}
          <div className="mb-3 md:mb-4">
            <div className="bg-black-800 border border-black-700 p-3 md:p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">🔮 Oracle Seer</h2>
              </div>
              <TwitterMarketScout />
            </div>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            
            {/* Main Content - Community Voting */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              
              {/* Live Search Activity */}
              <LiveSearchActivity />

              {/* Community Voting Panel */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-white">🗳️ Community Votes</h2>
                </div>

                {/* Active Proposals */}
                <div className="space-y-3">
                  {/* Vote 1 */}
                  <div className="bg-black-900 border border-green-600 p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">Will Ethereum reach $5,000 by March 2025?</h4>
                      <span className="text-green-400 font-bold text-sm">67% ✅</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-black-400">Seer: <span className="text-green-400 font-bold">94%</span></span>
                      <span className="text-black-400">Volume: <span className="text-white">$25k-50k</span></span>
                      <span className="text-black-400">Ends: <span className="text-yellow-400">2h 15m</span></span>
                    </div>

                    <div className="w-full bg-black-700 rounded-full h-2 mb-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                        ✅ YES (500 $PRED)
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                        ❌ NO (500 $PRED)
                      </button>
                    </div>
                  </div>

                  {/* Vote 2 */}
                  <div className="bg-black-900 border border-red-600 p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">Will Apple announce VR headset v2 at WWDC 2025?</h4>
                      <span className="text-red-400 font-bold text-sm">45% ❌</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-black-400">Seer: <span className="text-yellow-400 font-bold">78%</span></span>
                      <span className="text-black-400">Volume: <span className="text-white">$15k-30k</span></span>
                      <span className="text-black-400">Ends: <span className="text-yellow-400">5h 42m</span></span>
                    </div>

                    <div className="w-full bg-black-700 rounded-full h-2 mb-3">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: '55%'}}></div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                        ✅ YES (500 $PRED)
                      </button>
                      <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                        ❌ NO (500 $PRED)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Control Panel - Responsive */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">

              {/* Governance Stats */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-lg font-bold text-white mb-4">📊 Governance Stats</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Markets Today</span>
                    <span className="text-white font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Active Votes</span>
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Approval Rate</span>
                    <span className="text-green-400 font-bold">73%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Volume (24h)</span>
                    <span className="text-white font-bold">$189k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Active Voters</span>
                    <span className="text-purple-400 font-bold">1,247</span>
                  </div>
                </div>
              </div>

              {/* Token Management */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">💰 $PRED Tokens</h3>
                  <div className="text-right">
                    <div className="text-white font-bold">2,450</div>
                    <div className="text-purple-400 text-xs">Balance</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-purple-900/20 border border-purple-700 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-purple-400 text-sm">Staked for Voting</span>
                      <span className="text-white font-bold">1,000</span>
                    </div>
                    <div className="text-purple-300 text-xs">Earning 5% APY</div>
                  </div>

                  <div className="bg-green-900/20 border border-green-700 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-green-400 text-sm">Available</span>
                      <span className="text-white font-bold">1,450</span>
                    </div>
                    <div className="text-green-300 text-xs">Ready to stake</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => setShowStakingModal(true)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                  >
                    Stake More $PRED
                  </button>
                  <button className="w-full px-4 py-2 bg-black-900 hover:bg-black-800 text-white text-sm rounded transition-colors">
                    View Rewards
                  </button>
                </div>
              </div>

              {/* Governance Rules */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-lg font-bold text-white mb-4">⚙️ Governance Rules</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Min. Voting Power</span>
                    <span className="text-white text-sm">1,000 $PRED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Approval Threshold</span>
                    <span className="text-white text-sm">50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Voting Period</span>
                    <span className="text-white text-sm">24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-sm">Vote Cost</span>
                    <span className="text-white text-sm">500 $PRED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Staking Modal */}
      <StakingModal
        isOpen={showStakingModal}
        onClose={() => setShowStakingModal(false)}
        availableBalance={availableBalance}
      />
    </div>
  );
}
