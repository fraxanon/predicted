'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AgentStatus {
  aiTradingEnabled: boolean;
  x402AgentEnabled: boolean;
  oracleAgentEnabled: boolean;
  marketAgentEnabled: boolean;
  analyticsAgentEnabled: boolean;
  lastActivity?: string;
  totalTrades?: number;
  dailyProfit?: number;
  activeAgentsCount?: number;
}

interface AgentStatusIndicatorProps {
  onOpenSettings?: () => void;
}

export function AgentStatusIndicator({ onOpenSettings }: AgentStatusIndicatorProps) {
  const { address } = useAccount();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    aiTradingEnabled: false,
    x402AgentEnabled: true,
    oracleAgentEnabled: true,
    marketAgentEnabled: true,
    analyticsAgentEnabled: true,
    lastActivity: undefined,
    totalTrades: 0,
    dailyProfit: 0,
    activeAgentsCount: 0
  });

  useEffect(() => {
    loadAgentStatus();
  }, [address]);

  const loadAgentStatus = () => {
    if (!address) return;
    
    const saved = localStorage.getItem(`agent-preferences-${address}`);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        const activeCount = [
          preferences.aiTradingEnabled,
          preferences.x402AgentEnabled,
          preferences.oracleAgentEnabled,
          preferences.marketAgentEnabled,
          preferences.analyticsAgentEnabled
        ].filter(Boolean).length;

        setAgentStatus(prev => ({
          ...prev,
          aiTradingEnabled: preferences.aiTradingEnabled || false,
          x402AgentEnabled: preferences.x402AgentEnabled !== false,
          oracleAgentEnabled: preferences.oracleAgentEnabled !== false,
          marketAgentEnabled: preferences.marketAgentEnabled !== false,
          analyticsAgentEnabled: preferences.analyticsAgentEnabled !== false,
          activeAgentsCount: activeCount,
          // Mock data for demo - in production this would come from API
          lastActivity: activeCount > 0 ? 'Active now' : undefined,
          totalTrades: preferences.aiTradingEnabled ? Math.floor(Math.random() * 20) + 5 : 0,
          dailyProfit: preferences.aiTradingEnabled ? Math.floor(Math.random() * 50) + 10 : 0
        }));
      } catch (error) {
        console.error('Failed to load agent status:', error);
      }
    }
  };

  if ((agentStatus.activeAgentsCount || 0) === 0) {
    return (
      <div className="bg-black-900 border border-black-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-black-600 rounded-full"></div>
            <div>
              <h4 className="text-white font-medium text-sm">AI Agents Inactive</h4>
              <p className="text-black-400 text-xs">Configure your agents to start working</p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-accent-500 text-black-950 text-xs font-medium hover:bg-accent-600 transition-colors"
          >
            Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black-900 border border-black-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            agentStatus.aiTradingEnabled ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
          }`}></div>
          <div>
            <h4 className="text-white font-medium text-sm">
              {agentStatus.activeAgentsCount} Agent{agentStatus.activeAgentsCount === 1 ? '' : 's'} Active
            </h4>
            <p className="text-black-400 text-xs">
              {agentStatus.lastActivity || 'Ready to work'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="px-3 py-1 border border-black-700 text-black-300 hover:text-white hover:border-black-600 text-xs transition-colors"
        >
          Settings
        </button>
      </div>

      {(agentStatus.activeAgentsCount || 0) > 0 && (
        <div className="pt-3 border-t border-black-800">
          {/* Active Agents Display */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {agentStatus.oracleAgentEnabled && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-purple-400">🔮</span>
                <span className="text-white">Seer</span>
              </div>
            )}
            {agentStatus.marketAgentEnabled && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-400">🏪</span>
                <span className="text-white">Deployer</span>
              </div>
            )}
            {agentStatus.analyticsAgentEnabled && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-400">📊</span>
                <span className="text-white">Prophet</span>
              </div>
            )}
            {agentStatus.x402AgentEnabled && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-yellow-400">💳</span>
                <span className="text-white">Cashier</span>
              </div>
            )}
            {agentStatus.aiTradingEnabled && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-accent-500">🤖</span>
                <span className="text-white">Trader</span>
              </div>
            )}
          </div>
          
          {/* Stats (only show if trading is enabled) */}
          {agentStatus.aiTradingEnabled && (
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-black-800">
              <div className="text-center">
                <div className="text-white font-bold text-sm">{agentStatus.totalTrades}</div>
                <div className="text-black-400 text-xs">Trades Today</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-sm">+${agentStatus.dailyProfit}</div>
                <div className="text-black-400 text-xs">Daily P&L</div>
              </div>
              <div className="text-center">
                <div className="text-accent-500 font-bold text-sm">{agentStatus.activeAgentsCount}</div>
                <div className="text-black-400 text-xs">Active Agents</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
