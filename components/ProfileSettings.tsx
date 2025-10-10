'use client';

import { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { AutomatedInvestment } from './AutomatedInvestment';

interface InterestCategory {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  avgReturn: number;
  marketCount: number;
}

const WEB3_INTERESTS: InterestCategory[] = [
  {
    id: 'defi',
    name: 'DeFi Protocols',
    description: 'Decentralized finance, yield farming, lending protocols',
    riskLevel: 'medium',
    avgReturn: 0.15,
    marketCount: 24
  },
  {
    id: 'l2',
    name: 'Layer 2 Solutions',
    description: 'Scaling solutions, rollups, sidechains',
    riskLevel: 'low',
    avgReturn: 0.12,
    marketCount: 18
  },
  {
    id: 'btc',
    name: 'Bitcoin Markets',
    description: 'Bitcoin price predictions, adoption, regulations',
    riskLevel: 'low',
    avgReturn: 0.08,
    marketCount: 32
  },
  {
    id: 'eth',
    name: 'Ethereum Ecosystem',
    description: 'ETH upgrades, EIPs, network developments',
    riskLevel: 'low',
    avgReturn: 0.10,
    marketCount: 28
  },
  {
    id: 'airdrops',
    name: 'Token Airdrops',
    description: 'New token launches, airdrop announcements',
    riskLevel: 'high',
    avgReturn: 0.35,
    marketCount: 16
  },
  {
    id: 'nft',
    name: 'NFT Markets',
    description: 'NFT collections, marketplace developments',
    riskLevel: 'high',
    avgReturn: 0.28,
    marketCount: 12
  },
  {
    id: 'gaming',
    name: 'Web3 Gaming',
    description: 'GameFi, play-to-earn, gaming tokens',
    riskLevel: 'medium',
    avgReturn: 0.22,
    marketCount: 14
  },
  {
    id: 'dao',
    name: 'DAO Governance',
    description: 'Governance proposals, DAO decisions',
    riskLevel: 'medium',
    avgReturn: 0.18,
    marketCount: 20
  }
];

interface ProfileSettingsProps {
  onClose: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { profile, saveProfile, refreshRecommendations, loading } = useUserProfile();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || []);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>(profile?.riskTolerance || 'moderate');
  const [investmentAmount, setInvestmentAmount] = useState(profile?.investmentAmount || 100);
  const [showInvestmentPlan, setShowInvestmentPlan] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSelectedInterests(profile.interests);
      setRiskTolerance(profile.riskTolerance);
      setInvestmentAmount(profile.investmentAmount);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const interestsChanged = JSON.stringify(selectedInterests.sort()) !== JSON.stringify(profile.interests.sort());
      const riskChanged = riskTolerance !== profile.riskTolerance;
      const amountChanged = investmentAmount !== profile.investmentAmount;
      
      setHasChanges(interestsChanged || riskChanged || amountChanged);
    }
  }, [selectedInterests, riskTolerance, investmentAmount, profile]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const calculatePredictedEarnings = () => {
    const selectedCategories = WEB3_INTERESTS.filter(cat => selectedInterests.includes(cat.id));
    
    if (selectedCategories.length === 0) return { monthly: 0, yearly: 0, riskScore: 0 };

    const avgReturn = selectedCategories.reduce((sum, cat) => sum + cat.avgReturn, 0) / selectedCategories.length;
    const riskMultiplier = riskTolerance === 'conservative' ? 0.7 : riskTolerance === 'aggressive' ? 1.3 : 1.0;
    
    const adjustedReturn = avgReturn * riskMultiplier;
    const monthly = (investmentAmount * adjustedReturn) / 12;
    const yearly = investmentAmount * adjustedReturn;
    
    const riskScore = selectedCategories.reduce((sum, cat) => {
      const risk = cat.riskLevel === 'low' ? 1 : cat.riskLevel === 'medium' ? 2 : 3;
      return sum + risk;
    }, 0) / selectedCategories.length;

    return { monthly, yearly, riskScore };
  };

  const handleSaveProfile = async () => {
    if (!profile || !hasChanges) return;

    setIsSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        interests: selectedInterests,
        riskTolerance,
        investmentAmount
      };

      await saveProfile(updatedProfile);
      await refreshRecommendations();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateNewPlan = () => {
    if (hasChanges) {
      handleSaveProfile();
    }
    setShowInvestmentPlan(true);
  };

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-black-900 border border-black-800 p-8 max-w-md">
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-black-900 border border-black-800 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-black-800 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-black-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          {!showInvestmentPlan ? (
            <>
              {/* Current Profile Summary */}
              <div className="bg-black-800 border border-black-700 p-4">
                <h3 className="text-white font-medium mb-3">Current Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-black-400">Interests:</span>
                    <div className="text-white">{profile.interests.length} categories</div>
                  </div>
                  <div>
                    <span className="text-black-400">Risk Tolerance:</span>
                    <div className="text-white capitalize">{profile.riskTolerance}</div>
                  </div>
                  <div>
                    <span className="text-black-400">Investment Budget:</span>
                    <div className="text-white">${profile.investmentAmount}</div>
                  </div>
                </div>
              </div>

              {/* Interest Selection */}
              <div>
                <h3 className="text-white font-medium mb-4">Update Your Interests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {WEB3_INTERESTS.map((interest) => (
                    <div
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 border cursor-pointer transition-all ${
                        selectedInterests.includes(interest.id)
                          ? 'border-accent-500 bg-accent-500 bg-opacity-10'
                          : 'border-black-700 hover:border-black-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">{interest.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 ${
                            interest.riskLevel === 'low' ? 'bg-green-900 text-green-400' :
                            interest.riskLevel === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                            'bg-red-900 text-red-400'
                          }`}>
                            {interest.riskLevel} risk
                          </span>
                          {selectedInterests.includes(interest.id) && (
                            <span className="text-accent-500">✓</span>
                          )}
                        </div>
                      </div>
                      <p className="text-black-400 text-sm mb-3">{interest.description}</p>
                      <div className="flex items-center justify-between text-xs text-black-500">
                        <span>{interest.marketCount} active markets</span>
                        <span>{(interest.avgReturn * 100).toFixed(1)}% avg return</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Tolerance */}
              <div>
                <h3 className="text-white font-medium mb-4">Risk Tolerance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'conservative', name: 'Conservative', desc: 'Lower risk, steady returns' },
                    { id: 'moderate', name: 'Moderate', desc: 'Balanced risk and reward' },
                    { id: 'aggressive', name: 'Aggressive', desc: 'Higher risk, higher potential' }
                  ].map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setRiskTolerance(option.id as any)}
                      className={`p-4 border cursor-pointer transition-all text-center ${
                        riskTolerance === option.id
                          ? 'border-accent-500 bg-accent-500 bg-opacity-10'
                          : 'border-black-700 hover:border-black-600'
                      }`}
                    >
                      <h4 className="text-white font-medium mb-1">{option.name}</h4>
                      <p className="text-black-400 text-sm">{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <h3 className="text-white font-medium mb-4">Investment Budget (USDC)</h3>
                <div className="max-w-md space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-black-400 text-sm">$</span>
                    <input
                      type="number"
                      min="100"
                      max="100000"
                      step="100"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Math.max(100, Math.min(100000, Number(e.target.value))))}
                      className="flex-1 bg-black-800 border border-black-700 text-white px-4 py-3 text-lg font-bold focus:outline-none focus:border-accent-500 transition-colors"
                      placeholder="5000"
                    />
                    <span className="text-black-400 text-sm">USDC</span>
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2500, 5000, 10000, 25000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setInvestmentAmount(amount)}
                        className={`px-3 py-1 text-sm border transition-colors ${
                          investmentAmount === amount
                            ? 'bg-accent-500 text-black-950 border-accent-500'
                            : 'bg-transparent text-black-300 border-black-700 hover:border-black-600'
                        }`}
                      >
                        ${amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-xs text-black-500">
                    Range: $100 - $100,000 USDC
                  </div>
                </div>
              </div>

              {/* Updated Predictions */}
              {selectedInterests.length > 0 && (
                <div className="bg-black-800 border border-black-700 p-6">
                  <h3 className="text-white font-medium mb-4">🤖 Updated AI Predictions</h3>
                  {(() => {
                    const earnings = calculatePredictedEarnings();
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-500">${earnings.monthly.toFixed(0)}</div>
                          <div className="text-xs text-black-400">Monthly Potential</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent-500">${earnings.yearly.toFixed(0)}</div>
                          <div className="text-xs text-black-400">Yearly Potential</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{earnings.riskScore.toFixed(1)}/3</div>
                          <div className="text-xs text-black-400">Risk Score</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-black-800">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-black-700 text-white hover:border-black-600 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  {hasChanges && (
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving || selectedInterests.length === 0}
                      className="px-6 py-2 border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-black-950 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                  <button
                    onClick={handleGenerateNewPlan}
                    disabled={selectedInterests.length === 0}
                    className="px-6 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
                  >
                    Generate New Investment Plan
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Investment Plan View */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">New Investment Plan</h3>
                <button
                  onClick={() => setShowInvestmentPlan(false)}
                  className="px-4 py-2 border border-black-700 text-white hover:border-black-600 transition-colors"
                >
                  Back to Settings
                </button>
              </div>
              
              <AutomatedInvestment 
                totalBudget={investmentAmount}
                onInvestmentComplete={(results) => {
                  console.log('Investment completed:', results);
                  setShowInvestmentPlan(false);
                  onClose();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
