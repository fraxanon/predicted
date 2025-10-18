'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StakeWinningsModal } from '../../components/StakeWinningsModal';
import { CashoutModal } from '../../components/CashoutModal';
import { TransferModal } from '../../components/TransferModal';
import { FlywheelBenefits } from '../../components/FlywheelBenefits';
import { TokenAllocationChart } from '../../components/TokenAllocationChart';
import { RevenueStreamsChart } from '../../components/RevenueStreamsChart';
import { FraxAlignmentMetrics } from '../../components/FraxAlignmentMetrics';
import { TreasuryPerformanceChart } from '../../components/TreasuryPerformanceChart';

export default function TreasuryDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stake' | 'cashout' | 'transfer'>('overview');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Mock agent earnings data
  const agentEarnings = {
    prophet: {
      totalWinnings: 2847.32,
      weeklyPnL: 423.18,
      successRate: 73,
      activePositions: 12
    },
    cashier: {
      totalWinnings: 1923.67,
      weeklyPnL: 287.45,
      successRate: 68,
      activePositions: 8
    },
    seer: {
      totalWinnings: 1456.89,
      weeklyPnL: 198.23,
      successRate: 81,
      activePositions: 15
    }
  };

  const totalBalance = Object.values(agentEarnings).reduce((sum, agent) => sum + agent.totalWinnings, 0);
  
  // Mock user staking data for flywheel
  const userStakedPRED = 2450;
  const userVePRED = 1.18; // Based on staking period

  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Navigation Header */}
      <nav className="bg-black-900 border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </Link>
              <div className="flex space-x-6">
                <Link href="/" className="text-black-400 hover:text-white text-sm transition-colors">
                  Markets
                </Link>
                <Link href="/dashboard" className="text-black-400 hover:text-white text-sm transition-colors">
                  Cashier Dashboard
                </Link>
                <Link href="/oracle-dashboard" className="text-black-400 hover:text-white text-sm transition-colors">
                  Oracle Dashboard
                </Link>
                <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                  Treasury
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-bold">${totalBalance.toLocaleString()}</div>
                <div className="text-accent-500 text-xs">Total Balance</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-black-950 min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Treasury Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">Manage agent winnings, staking, and transfers</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-black-800">
            <div className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'stake', label: 'Stake Winnings', icon: '🏦' },
                { id: 'cashout', label: 'Cash Out', icon: '💸' },
                { id: 'transfer', label: 'Transfer', icon: '📤' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-accent-500 text-accent-500'
                      : 'border-transparent text-black-400 hover:text-white hover:border-black-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Treasury Allocation Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* $PRED Token Allocation Pie Chart */}
                <div className="bg-black-800 border border-black-700 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4">💰 $PRED Token Allocation</h3>
                  <TokenAllocationChart />
                </div>

                {/* Protocol Revenue Streams */}
                <div className="bg-black-800 border border-black-700 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4">📊 Revenue Streams</h3>
                  <RevenueStreamsChart />
                </div>
              </div>

              {/* Frax Finance Alignment */}
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700 rounded-lg p-6">
                <h3 className="text-purple-400 font-bold text-lg mb-4">🟣 Frax Finance Alignment</h3>
                <FraxAlignmentMetrics />
              </div>

              {/* Treasury Performance Timeline */}
              <div className="bg-black-800 border border-black-700 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4">📈 Treasury Performance</h3>
                <TreasuryPerformanceChart />
              </div>

              {/* Flywheel Benefits */}
              <FlywheelBenefits 
                userStakedPRED={userStakedPRED}
                userVePRED={userVePRED}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
                {/* Agent Performance Cards */}
                <div className="lg:col-span-8 space-y-3 md:space-y-4">
                <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                  <h2 className="text-lg font-bold text-white mb-4">🤖 Agent Performance</h2>
                  
                  <div className="space-y-4">
                    {/* Prophet */}
                    <div className="bg-black-900 border border-green-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h3 className="text-green-400 font-medium">📊 Prophet Analytics</h3>
                        </div>
                        <span className="text-green-400 font-bold">${agentEarnings.prophet.totalWinnings.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-black-400">Weekly P&L:</span>
                          <span className="text-green-400 ml-2 font-bold">+${agentEarnings.prophet.weeklyPnL}</span>
                        </div>
                        <div>
                          <span className="text-black-400">Success Rate:</span>
                          <span className="text-white ml-2">{agentEarnings.prophet.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-black-400">Active:</span>
                          <span className="text-white ml-2">{agentEarnings.prophet.activePositions} positions</span>
                        </div>
                      </div>
                    </div>

                    {/* Cashier */}
                    <div className="bg-black-900 border border-yellow-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <h3 className="text-yellow-400 font-medium">💰 Cashier Trading</h3>
                        </div>
                        <span className="text-yellow-400 font-bold">${agentEarnings.cashier.totalWinnings.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-black-400">Weekly P&L:</span>
                          <span className="text-green-400 ml-2 font-bold">+${agentEarnings.cashier.weeklyPnL}</span>
                        </div>
                        <div>
                          <span className="text-black-400">Success Rate:</span>
                          <span className="text-white ml-2">{agentEarnings.cashier.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-black-400">Active:</span>
                          <span className="text-white ml-2">{agentEarnings.cashier.activePositions} positions</span>
                        </div>
                      </div>
                    </div>

                    {/* Seer */}
                    <div className="bg-black-900 border border-purple-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <h3 className="text-purple-400 font-medium">🔮 Seer Oracle</h3>
                        </div>
                        <span className="text-purple-400 font-bold">${agentEarnings.seer.totalWinnings.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-black-400">Weekly P&L:</span>
                          <span className="text-green-400 ml-2 font-bold">+${agentEarnings.seer.weeklyPnL}</span>
                        </div>
                        <div>
                          <span className="text-black-400">Success Rate:</span>
                          <span className="text-white ml-2">{agentEarnings.seer.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-black-400">Active:</span>
                          <span className="text-white ml-2">{agentEarnings.seer.activePositions} positions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-4 space-y-3 md:space-y-4">
                <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                  <h3 className="text-lg font-bold text-white mb-4">💼 Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowStakeModal(true)}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      🏦 Stake Winnings
                    </button>
                    
                    <button
                      onClick={() => setShowCashoutModal(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded transition-colors relative"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>🟣 Cash Out to frxUSD</span>
                        <span className="px-1 py-0.5 bg-white text-purple-600 text-xs font-bold rounded">2x</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                    >
                      📤 Transfer to Wallet
                    </button>
                  </div>
                </div>

                {/* Balance Summary */}
                <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                  <h3 className="text-lg font-bold text-white mb-4">💰 Balance Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-black-400">Total Winnings:</span>
                      <span className="text-white font-bold">${totalBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black-400">Staked Amount:</span>
                      <span className="text-blue-400 font-bold">$2,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black-400">Available:</span>
                      <span className="text-green-400 font-bold">${(totalBalance - 2450).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-black-700">
                      <span className="text-black-400">Weekly Growth:</span>
                      <span className="text-green-400 font-bold">+$908.86</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Other tabs would be implemented here */}
          {activeTab !== 'overview' && (
            <div className="bg-black-800 border border-black-700 p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feature</h2>
              <p className="text-black-400">This feature is under development</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <StakeWinningsModal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        agentEarnings={agentEarnings}
      />
      
      <CashoutModal
        isOpen={showCashoutModal}
        onClose={() => setShowCashoutModal(false)}
        availableBalance={totalBalance - 2450} // Subtract already staked amount
      />
      
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        availableBalance={totalBalance - 2450} // Subtract already staked amount
      />
    </div>
  );
}
