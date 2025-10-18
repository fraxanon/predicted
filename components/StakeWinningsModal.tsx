'use client';

import React, { useState } from 'react';

interface StakeWinningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentEarnings: {
    prophet: { totalWinnings: number };
    cashier: { totalWinnings: number };
    seer: { totalWinnings: number };
  };
}

export function StakeWinningsModal({ isOpen, onClose, agentEarnings }: StakeWinningsModalProps) {
  const [selectedAgent, setSelectedAgent] = useState<'all' | 'prophet' | 'cashier' | 'seer'>('all');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState(12); // months
  const [isStaking, setIsStaking] = useState(false);

  if (!isOpen) return null;

  const totalWinnings = Object.values(agentEarnings).reduce((sum, agent) => sum + agent.totalWinnings, 0);
  
  const getAvailableAmount = () => {
    if (selectedAgent === 'all') return totalWinnings;
    return agentEarnings[selectedAgent as keyof typeof agentEarnings].totalWinnings;
  };

  const availableAmount = getAvailableAmount();
  const stakeAmountNum = Number(stakeAmount) || 0;

  // vePRED calculation (same as before)
  const stakingOptions = [
    { weeks: 4, label: '1 month', months: 1 },
    { weeks: 12, label: '3 months', months: 3 },
    { weeks: 26, label: '6 months', months: 6 },
    { weeks: 52, label: '1 year', months: 12 },
    { weeks: 104, label: '2 years', months: 24 },
    { weeks: 156, label: '3 years', months: 36 },
    { weeks: 208, label: '4 years', months: 48 },
  ];

  const currentWeeks = stakingOptions.find(o => o.months === stakingPeriod)?.weeks || 52;
  const getVotingPower = (amount: number, weeks: number) => (amount * weeks) / 208;
  const getAPY = (weeks: number) => 3 + (12 * weeks / 208);
  
  const votingPower = getVotingPower(stakeAmountNum, currentWeeks);
  const currentAPY = getAPY(currentWeeks);

  const handleStake = async () => {
    if (!stakeAmount || stakeAmountNum <= 0 || stakeAmountNum > availableAmount) return;

    setIsStaking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Staked ${stakeAmount} from ${selectedAgent} agent(s) for ${stakingPeriod} months`);
      setStakeAmount('');
      onClose();
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black-900 border border-black-700 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">🏦 Stake Agent Winnings</h2>
          <button onClick={onClose} className="text-black-400 hover:text-white text-xl">×</button>
        </div>

        {/* Agent Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">Select Agent Winnings</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedAgent('all')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                selectedAgent === 'all'
                  ? 'bg-accent-600 border-accent-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-accent-600'
              }`}
            >
              <div className="font-medium">All Agents</div>
              <div className="text-xs opacity-75">${totalWinnings.toLocaleString()}</div>
            </button>
            
            <button
              onClick={() => setSelectedAgent('prophet')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                selectedAgent === 'prophet'
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-green-600'
              }`}
            >
              <div className="font-medium">📊 Prophet</div>
              <div className="text-xs opacity-75">${agentEarnings.prophet.totalWinnings.toLocaleString()}</div>
            </button>
            
            <button
              onClick={() => setSelectedAgent('cashier')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                selectedAgent === 'cashier'
                  ? 'bg-yellow-600 border-yellow-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-yellow-600'
              }`}
            >
              <div className="font-medium">💰 Cashier</div>
              <div className="text-xs opacity-75">${agentEarnings.cashier.totalWinnings.toLocaleString()}</div>
            </button>
            
            <button
              onClick={() => setSelectedAgent('seer')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                selectedAgent === 'seer'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-purple-600'
              }`}
            >
              <div className="font-medium">🔮 Seer</div>
              <div className="text-xs opacity-75">${agentEarnings.seer.totalWinnings.toLocaleString()}</div>
            </button>
          </div>
        </div>

        {/* Available Balance */}
        <div className="mb-6 p-3 bg-black-800 border border-black-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-black-400 text-sm">Available to Stake</span>
            <span className="text-white font-bold">${availableAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Stake Amount */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Stake Amount</label>
          <div className="relative">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount to stake"
              className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-purple-500"
              max={availableAmount}
            />
            <button
              onClick={() => setStakeAmount(availableAmount.toString())}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-sm hover:text-purple-300"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Staking Period */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">Staking Period</label>
          <div className="grid grid-cols-2 gap-3">
            {stakingOptions.map((option) => {
              const optionAPY = getAPY(option.weeks);
              const optionVotingPower = getVotingPower(1, option.weeks);
              return (
                <button
                  key={option.months}
                  onClick={() => setStakingPeriod(option.months)}
                  className={`p-3 rounded-lg border text-sm transition-colors ${
                    stakingPeriod === option.months
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-black-800 border-black-700 text-black-300 hover:border-purple-600'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs opacity-75 mt-1">{optionAPY.toFixed(1)}% APY</div>
                  <div className="text-xs opacity-60">{optionVotingPower.toFixed(2)}x vePRED</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Staking Summary */}
        {stakeAmountNum > 0 && (
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h3 className="text-purple-400 font-medium text-sm mb-3">Staking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black-400">Source:</span>
                <span className="text-white">{selectedAgent === 'all' ? 'All Agents' : selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Stake Amount:</span>
                <span className="text-white font-bold">${stakeAmountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">vePRED Power:</span>
                <span className="text-purple-400 font-bold">{votingPower.toFixed(2)} vePRED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">APY Rate:</span>
                <span className="text-green-400 font-bold">{currentAPY.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-black-800 hover:bg-black-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStake}
            disabled={isStaking || !stakeAmount || stakeAmountNum <= 0 || stakeAmountNum > availableAmount}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {isStaking ? 'Staking...' : `Stake $${stakeAmountNum.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
