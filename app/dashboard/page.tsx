'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProphetAnalysis } from '../../components/ProphetAnalysis';
import { AgentNotificationBell } from '../../components/AgentNotificationBell';

export default function Dashboard() {
  const { address } = useAccount();
  const { profile } = useUserProfile();
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [investmentBudget, setInvestmentBudget] = useState(10000);

  useEffect(() => {
    if (address) {
      loadUserPreferences();
    }
  }, [address]);

  const loadUserPreferences = () => {
    if (!address) return;
    
    const saved = localStorage.getItem(`user-profile-${address}`);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setRiskTolerance(preferences.riskTolerance || 'moderate');
        setInvestmentBudget(preferences.investmentBudget || 10000);
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
  };

  const saveUserPreferences = () => {
    if (!address) return;
    
    const preferences = {
      riskTolerance,
      investmentBudget,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`user-profile-${address}`, JSON.stringify(preferences));
  };

  useEffect(() => {
    if (address) {
      saveUserPreferences();
    }
  }, [riskTolerance, investmentBudget, address]);

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
                <div className="text-accent-500 text-xs">$0.00</div>
              </a>
              <AgentNotificationBell />
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
              <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                Cashier Dashboard
              </span>
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
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Cashier Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">AI-powered investment management</p>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            
            {/* Main Content - Prophet Analysis */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              
              {/* Compact Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div className="bg-black-800 border border-black-700 p-3">
                  <div className="text-black-400 text-xs mb-1">Capital</div>
                  <div className="text-lg md:text-xl font-bold text-white">${investmentBudget.toLocaleString()}</div>
                  <div className="text-green-400 text-xs">Ready</div>
                </div>
                <div className="bg-black-800 border border-black-700 p-3">
                  <div className="text-black-400 text-xs mb-1">Returns</div>
                  <div className="text-lg md:text-xl font-bold text-green-400">+${Math.round(investmentBudget * 0.359).toLocaleString()}</div>
                  <div className="text-green-400 text-xs">+35.9%</div>
                </div>
                <div className="bg-black-800 border border-black-700 p-3">
                  <div className="text-black-400 text-xs mb-1">Risk</div>
                  <div className="text-lg md:text-xl font-bold text-accent-500 capitalize">{riskTolerance}</div>
                  <div className="text-black-400 text-xs">Level</div>
                </div>
                <div className="bg-black-800 border border-black-700 p-3">
                  <div className="text-black-400 text-xs mb-1">Prophet</div>
                  <div className="text-lg md:text-xl font-bold text-green-400">LIVE</div>
                  <div className="text-green-400 text-xs">Active</div>
                </div>
              </div>

              {/* Prophet Analysis - Compact */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <ProphetAnalysis 
                  budget={investmentBudget}
                  onBudgetChange={setInvestmentBudget}
                  onAuthorizeInvestment={() => {
                    console.log('Investment authorized from dashboard!');
                  }}
                />
              </div>
            </div>

            {/* Control Panel - Responsive */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              
              {/* Investment Controls - Mobile First */}
              <div className="bg-black-800 border border-black-700 p-4">
                <h3 className="text-white font-medium mb-3 flex items-center text-sm md:text-base">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Controls
                </h3>
                
                {/* Compact Budget Control */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-white text-sm">Budget</label>
                    <span className="text-accent-500 font-bold text-sm">${investmentBudget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={investmentBudget}
                    onChange={(e) => setInvestmentBudget(Number(e.target.value))}
                    className="w-full h-2 bg-black-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                  />
                  <div className="flex justify-between text-xs text-black-400 mt-1">
                    <span>$100</span>
                    <span>$100K</span>
                  </div>
                </div>

                {/* Compact Quick Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[1000, 5000, 10000, 25000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setInvestmentBudget(amount)}
                      className={`px-2 py-2 text-xs font-medium border transition-all ${
                        investmentBudget === amount
                          ? 'bg-accent-500 text-black-950 border-accent-500'
                          : 'bg-black-700 text-white border-black-600 hover:border-accent-500'
                      }`}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Prominent Authorize Button */}
                <button
                  onClick={() => console.log('Investment authorized!')}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-sm md:text-base hover:from-green-500 hover:to-green-400 transition-all"
                >
                  🚀 AUTHORIZE INVESTMENT
                </button>
                <div className="text-center text-xs text-black-400 mt-1">
                  AI executes automatically
                </div>
              </div>

              {/* Compact Risk Management */}
              <div className="bg-black-800 border border-black-700 p-4">
                <h3 className="text-white font-medium mb-3 text-sm md:text-base">Risk Level</h3>
                <div className="space-y-2">
                  {[
                    { id: 'conservative', name: 'Conservative', desc: '5-15%', icon: '🛡️' },
                    { id: 'moderate', name: 'Moderate', desc: '15-35%', icon: '⚖️' },
                    { id: 'aggressive', name: 'Aggressive', desc: '35%+', icon: '🚀' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setRiskTolerance(option.id as any)}
                      className={`w-full p-3 border text-left transition-all ${
                        riskTolerance === option.id
                          ? 'border-accent-500 bg-accent-500 bg-opacity-20'
                          : 'border-black-600 hover:border-black-500 bg-black-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <div className="text-white font-medium text-sm">{option.name}</div>
                            <div className="text-black-400 text-xs">{option.desc}</div>
                          </div>
                        </div>
                        {riskTolerance === option.id && (
                          <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compact Performance - Hidden on Mobile */}
              <div className="bg-black-800 border border-black-700 p-4 hidden md:block">
                <h3 className="text-white font-medium mb-3 text-sm">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Win Rate</span>
                    <span className="text-green-400 font-bold text-xs">73.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Avg Return</span>
                    <span className="text-green-400 font-bold text-xs">+28.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Drawdown</span>
                    <span className="text-red-400 font-bold text-xs">-12.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Positions</span>
                    <span className="text-white font-bold text-xs">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
