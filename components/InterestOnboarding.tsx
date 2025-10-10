'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
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

interface InterestOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

interface UserProfile {
  interests: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentAmount: number;
  signedMessage: string;
  signature: string;
}

export function InterestOnboarding({ onComplete }: InterestOnboardingProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [signedData, setSignedData] = useState<{ message: string; signature: string } | null>(null);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSignMessage = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const message = `Welcome to Predicted!\n\nBy signing this message, you agree to:\n- Create your personalized prediction profile\n- Receive AI-powered market recommendations\n- Access advanced analytics and insights\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      const result = await signMessageAsync({ message });
      
      if (result) {
        setSignedData({ message, signature: result });
        setStep(2);
      }
    } catch (error) {
      console.error('Failed to sign message:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleComplete = () => {
    if (!signedData) return;
    
    const profile: UserProfile = {
      interests: selectedInterests,
      riskTolerance,
      investmentAmount,
      signedMessage: signedData.message,
      signature: signedData.signature
    };
    
    onComplete(profile);
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto bg-black-900 border border-black-800 p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-black-300 mb-6">Connect your wallet to start building your prediction profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-black-900 border border-black-800">
      {/* Progress Bar */}
      <div className="border-b border-black-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Profile Setup</span>
          <span className="text-black-400 text-sm">Step {step} of 4</span>
        </div>
        <div className="h-1 bg-black-800 overflow-hidden">
          <div 
            className="h-full bg-accent-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-8">
        {/* Step 1: Sign Message */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Predicted</h2>
            <p className="text-black-300 mb-8 max-w-2xl mx-auto">
              Sign a message to verify your wallet and create your personalized prediction profile. 
              This helps our AI agents provide better market recommendations.
            </p>
            
            <div className="bg-black-800 border border-black-700 p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-white font-medium mb-3">You'll get access to:</h3>
              <ul className="space-y-2 text-sm text-black-300">
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">•</span>
                  <span>AI-powered market predictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">•</span>
                  <span>Personalized earnings forecasts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">•</span>
                  <span>Real-time market alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-accent-500">•</span>
                  <span>Advanced analytics dashboard</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSignMessage}
              disabled={isLoading}
              className="px-8 py-3 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing...' : 'Sign Message & Continue'}
            </button>
          </div>
        )}

        {/* Step 2: Interest Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Select Your Web3 Interests</h2>
            <p className="text-black-300 mb-8">
              Choose the Web3 categories you're most interested in. Our AI will use this to recommend the best prediction markets for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    <h3 className="text-white font-medium">{interest.name}</h3>
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

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-black-700 text-white hover:border-black-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedInterests.length === 0}
                className="px-6 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
              >
                Continue ({selectedInterests.length} selected)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Risk & Investment */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Risk Tolerance & Investment</h2>
            <p className="text-black-300 mb-8">
              Set your risk tolerance and potential investment amount to get personalized earnings predictions.
            </p>

            <div className="space-y-8">
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
                <h3 className="text-white font-medium mb-4">Potential Investment Amount (USDC)</h3>
                <div className="max-w-md">
                  <input
                    type="range"
                    min="50"
                    max="10000"
                    step="50"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full h-2 bg-black-800 appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-black-400 mt-2">
                    <span>$50</span>
                    <span className="text-white font-bold">${investmentAmount}</span>
                    <span>$10,000</span>
                  </div>
                </div>
              </div>

              {/* Predicted Earnings */}
              <div className="bg-black-800 border border-black-700 p-6">
                <h3 className="text-white font-medium mb-4">🤖 AI Predicted Earnings</h3>
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
                <p className="text-xs text-black-500 mt-4">
                  *Predictions based on historical market data and AI analysis. Past performance doesn't guarantee future results.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-black-700 text-white hover:border-black-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors"
              >
                Continue to Investment
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Automated Investment */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">🤖 AI-Powered Investment</h2>
            <p className="text-black-300 mb-8">
              Our AI agents will analyze the markets and automatically invest your budget based on your interests and risk tolerance using x402 payments.
            </p>

            <AutomatedInvestment 
              totalBudget={investmentAmount}
              onInvestmentComplete={(results) => {
                console.log('Investment completed:', results);
                handleComplete();
              }}
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 border border-black-700 text-white hover:border-black-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="px-8 py-3 border border-black-700 text-white hover:border-black-600 transition-colors"
              >
                Skip Investment & Complete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
