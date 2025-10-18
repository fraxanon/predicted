'use client';

import React, { useState } from 'react';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function StakingModal({ isOpen, onClose, availableBalance }: StakingModalProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState(12); // months
  const [isStaking, setIsStaking] = useState(false);

  if (!isOpen) return null;

  // vePRED calculation based on Frax's veFRAX model
  // 1 PRED staked for 4 years (208 weeks) = 4 vePRED
  // Linear correlation: vePRED = PRED * (lock_weeks / 208)
  const getVotingPower = (amount: number, weeks: number) => {
    const maxWeeks = 208; // 4 years
    return (amount * weeks) / maxWeeks;
  };

  // APY rates based on vePRED multiplier (higher voting power = higher rewards)
  const getAPY = (weeks: number) => {
    const votingMultiplier = weeks / 208; // 0 to 1
    const baseAPY = 3;
    const maxBonusAPY = 12; // Additional 12% for max lock
    return baseAPY + (maxBonusAPY * votingMultiplier);
  };

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
  const currentAPY = getAPY(currentWeeks);
  const stakeAmountNum = Number(stakeAmount) || 0;
  const votingPower = getVotingPower(stakeAmountNum, currentWeeks);
  const estimatedRewards = (stakeAmountNum * currentAPY / 100) * (stakingPeriod / 12);

  const handleStake = async () => {
    if (!stakeAmount || stakeAmountNum <= 0 || stakeAmountNum > availableBalance) {
      return;
    }

    setIsStaking(true);
    
    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would:
      // 1. Create staking transaction
      // 2. Lock tokens in smart contract
      // 3. Set unlock date
      // 4. Start earning rewards
      
      console.log(`Staked ${stakeAmount} $PRED for ${stakingPeriod} months at ${currentAPY}% APY`);
      
      // Reset form and close modal
      setStakeAmount('');
      setStakingPeriod(12);
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
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-black-900 border border-black-700 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Stake $PRED Tokens</h2>
          <button
            onClick={onClose}
            className="text-black-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Available Balance */}
        <div className="mb-6 p-3 bg-black-800 border border-black-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-black-400 text-sm">Available Balance</span>
            <span className="text-white font-bold">{availableBalance.toLocaleString()} $PRED</span>
          </div>
        </div>

        {/* Stake Amount Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Stake Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount to stake"
              className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-purple-500"
              max={availableBalance}
            />
            <button
              onClick={() => setStakeAmount(availableBalance.toString())}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-sm hover:text-purple-300"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Staking Period Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            Staking Period
          </label>
          <div className="grid grid-cols-2 gap-3">
            {stakingOptions.map((option) => {
              const optionAPY = getAPY(option.weeks);
              const optionVotingPower = getVotingPower(1, option.weeks); // 1 PRED example
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
                <span className="text-black-400">Stake Amount:</span>
                <span className="text-white font-bold">{stakeAmountNum.toLocaleString()} $PRED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Lock Period:</span>
                <span className="text-white">{stakingOptions.find(o => o.months === stakingPeriod)?.label} ({currentWeeks} weeks)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">vePRED Voting Power:</span>
                <span className="text-purple-400 font-bold">{votingPower.toFixed(2)} vePRED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">APY Rate:</span>
                <span className="text-green-400 font-bold">{currentAPY.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Est. Rewards:</span>
                <span className="text-yellow-400 font-bold">{estimatedRewards.toFixed(0)} $PRED</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-700">
                <span className="text-black-400">Total After Period:</span>
                <span className="text-white font-bold">{(stakeAmountNum + estimatedRewards).toFixed(0)} $PRED</span>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400 text-sm">⚠️</span>
            <div className="text-yellow-300 text-xs leading-relaxed">
              <p className="font-medium mb-1">Vote-Escrowed Tokens (vePRED):</p>
              <p className="mb-1">• Non-transferable voting power that decays over time</p>
              <p className="mb-1">• Longer locks = exponentially more voting power</p>
              <p>• Max 4x multiplier for 4-year lock (208 weeks)</p>
            </div>
          </div>
        </div>

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
            disabled={isStaking || !stakeAmount || stakeAmountNum <= 0 || stakeAmountNum > availableBalance}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {isStaking ? 'Staking...' : `Stake ${stakeAmountNum.toLocaleString()} $PRED`}
          </button>
        </div>
      </div>
    </div>
  );
}
