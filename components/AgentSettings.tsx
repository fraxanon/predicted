'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AgentPreferences {
  x402AgentEnabled: boolean;
  aiTradingEnabled: boolean;
  oracleAgentEnabled: boolean;
  marketAgentEnabled: boolean;
  analyticsAgentEnabled: boolean;
  interestCategories: {
    [key: string]: boolean;
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  maxDailyInvestment: number;
  autoInvestmentEnabled: boolean;
  notificationsEnabled: boolean;
  preferredCurrency?: 'USDC' | 'frxUSD';
  instantPayments?: boolean;
  investmentStrategy?: 'conservative' | 'balanced' | 'aggressive';
  minConfidence?: number;
}

interface AgentSettingsProps {
  onSettingsChange?: (settings: AgentPreferences) => void;
  showAfterOnboarding?: boolean;
  alwaysVisible?: boolean;
}

const DEFAULT_PREFERENCES: AgentPreferences = {
  x402AgentEnabled: true,
  aiTradingEnabled: false,
  oracleAgentEnabled: true,
  marketAgentEnabled: true,
  analyticsAgentEnabled: true,
  interestCategories: {
    defi: true,
    l2: true,
    btc: true,
    eth: true,
    airdrops: false,
    nft: false,
    gaming: false,
    dao: false
  },
  riskTolerance: 'moderate',
  maxDailyInvestment: 100,
  autoInvestmentEnabled: false,
  notificationsEnabled: true
};

export function AgentSettings({ onSettingsChange, showAfterOnboarding = false, alwaysVisible = false }: AgentSettingsProps) {
  const { address } = useAccount();
  const [preferences, setPreferences] = useState<AgentPreferences>(DEFAULT_PREFERENCES);
  const [isVisible, setIsVisible] = useState(showAfterOnboarding);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSavedPreferences();
  }, [address]);

  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(preferences);
    }
  }, [preferences, onSettingsChange]);

  const loadSavedPreferences = () => {
    if (!address) return;
    
    const saved = localStorage.getItem(`agent-preferences-${address}`);
    if (saved) {
      try {
        const parsedPrefs = JSON.parse(saved);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPrefs });
      } catch (error) {
        console.error('Failed to load saved preferences:', error);
      }
    }
  };

  const savePreferences = () => {
    if (!address) return;
    
    localStorage.setItem(`agent-preferences-${address}`, JSON.stringify(preferences));
    setHasChanges(false);
  };

  const updatePreference = <K extends keyof AgentPreferences>(
    key: K,
    value: AgentPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateInterestCategory = (category: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      interestCategories: {
        ...prev.interestCategories,
        [category]: enabled
      }
    }));
    setHasChanges(true);
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasChanges(true);
  };

  if (!isVisible && !showAfterOnboarding && !alwaysVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="px-4 py-2 bg-black-800 border border-black-700 text-white hover:border-black-600 transition-colors text-sm"
      >
        🤖 Agent Settings
      </button>
    );
  }

  return (
    <div className={alwaysVisible ? "space-y-6" : "bg-black-900 border border-black-800 p-6 space-y-6"}>
      {!alwaysVisible && (
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">🤖 AI Agent Settings</h3>
          {!showAfterOnboarding && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-black-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {showAfterOnboarding && (
        <div className="bg-accent-500 bg-opacity-10 border border-accent-500 p-4 mb-6">
          <h4 className="text-accent-500 font-medium mb-2">🎉 Welcome to Predicted!</h4>
          <p className="text-white text-sm mb-3">
            Your profile has been created successfully. Now you can configure your AI agents to help you trade automatically.
          </p>
          <p className="text-black-300 text-xs">
            You can always change these settings later in your profile.
          </p>
        </div>
      )}


      {/* Oracle Agent Toggle */}
      <div className="bg-black-800 border border-black-700 p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="mb-3 md:mb-0">
            <h4 className="text-white font-medium text-sm md:text-base">🔮 Oracle Agent - "Seer"</h4>
            <p className="text-black-400 text-xs md:text-sm">
              Validates news sources and provides market intelligence
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.oracleAgentEnabled}
              onChange={(e) => updatePreference('oracleAgentEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>
      </div>

      {/* Market Agent Toggle */}
      <div className="bg-black-800 border border-black-700 p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="mb-3 md:mb-0">
            <h4 className="text-white font-medium text-sm md:text-base">🏪 Market Agent - "Deployer"</h4>
            <p className="text-black-400 text-xs md:text-sm">
              Creates and deploys new prediction markets based on trending topics
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.marketAgentEnabled}
              onChange={(e) => updatePreference('marketAgentEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>

      {/* Analytics Agent Toggle */}
      <div className="bg-black-800 border border-black-700 p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="mb-3 md:mb-0">
            <h4 className="text-white font-medium text-sm md:text-base">📊 Analytics Agent - "Prophet"</h4>
            <p className="text-black-400 text-xs md:text-sm">
              Analyzes markets and identifies profitable betting opportunities
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.analyticsAgentEnabled}
              onChange={(e) => updatePreference('analyticsAgentEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      {/* X402 Agent Toggle */}
      <div className="bg-black-800 border border-black-700 p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="mb-3 md:mb-0">
            <h4 className="text-white font-medium text-sm md:text-base">💳 X402 Trading Agent - "Cashier"</h4>
            <p className="text-black-400 text-xs md:text-sm">
              Autonomously invests your budget into Prophet's AI-recommended bets
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.x402AgentEnabled}
              onChange={(e) => updatePreference('x402AgentEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
      </div>


      {/* Notifications */}
      <div className="bg-black-800 border border-black-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Notifications</h4>
            <p className="text-black-400 text-sm">
              Get notified about AI trading activities and market opportunities
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notificationsEnabled}
              onChange={(e) => updatePreference('notificationsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-black-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-black-800">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 border border-black-700 text-black-300 hover:text-white hover:border-black-600 transition-colors text-sm"
        >
          Reset to Defaults
        </button>
        
        <div className="flex space-x-3">
          {showAfterOnboarding && (
            <button
              onClick={() => setIsVisible(false)}
              className="px-6 py-2 border border-black-700 text-white hover:border-black-600 transition-colors text-sm"
            >
              Skip for Now
            </button>
          )}
          <button
            onClick={savePreferences}
            disabled={!hasChanges}
            className="px-6 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 text-sm"
          >
            {hasChanges ? 'Save Settings' : 'Saved'}
          </button>
        </div>
      </div>

    </div>
  );
}
