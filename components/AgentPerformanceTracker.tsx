'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AgentPerformance {
  agentName: string;
  agentEmoji: string;
  totalActions: number;
  successRate: number;
  totalProfit: number;
  avgConfidence: number;
  lastActive: Date;
  status: 'active' | 'idle' | 'error';
  recentActions: {
    action: string;
    result: 'success' | 'failure';
    profit?: number;
    timestamp: Date;
  }[];
}

interface PerformanceMetrics {
  totalProfit: number;
  totalInvested: number;
  roi: number;
  winRate: number;
  bestPerformingAgent: string;
  totalTrades: number;
}

export function AgentPerformanceTracker() {
  const { address } = useAccount();
  const [agentPerformances, setAgentPerformances] = useState<AgentPerformance[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalProfit: 0,
    totalInvested: 0,
    roi: 0,
    winRate: 0,
    bestPerformingAgent: '',
    totalTrades: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    loadPerformanceData();
  }, [address, selectedTimeframe]);

  const loadPerformanceData = () => {
    if (!address) return;

    // Mock performance data - in production this would come from API
    const mockPerformances: AgentPerformance[] = [
      {
        agentName: 'Prophet',
        agentEmoji: '📊',
        totalActions: 47,
        successRate: 87,
        totalProfit: 340,
        avgConfidence: 82,
        lastActive: new Date(Date.now() - 120000), // 2 minutes ago
        status: 'active',
        recentActions: [
          { action: 'Market Analysis', result: 'success', timestamp: new Date(Date.now() - 120000) },
          { action: 'Prediction Made', result: 'success', profit: 45, timestamp: new Date(Date.now() - 300000) },
          { action: 'Risk Assessment', result: 'success', timestamp: new Date(Date.now() - 600000) }
        ]
      },
      {
        agentName: 'Cashier',
        agentEmoji: '💳',
        totalActions: 23,
        successRate: 73,
        totalProfit: 280,
        avgConfidence: 0,
        lastActive: new Date(Date.now() - 300000), // 5 minutes ago
        status: 'active',
        recentActions: [
          { action: 'Investment Made', result: 'success', profit: 67, timestamp: new Date(Date.now() - 300000) },
          { action: 'Payment Processed', result: 'success', timestamp: new Date(Date.now() - 450000) },
          { action: 'Investment Made', result: 'failure', profit: -25, timestamp: new Date(Date.now() - 900000) }
        ]
      },
      {
        agentName: 'Seer',
        agentEmoji: '🔮',
        totalActions: 156,
        successRate: 94,
        totalProfit: 0, // Seer doesn't directly generate profit
        avgConfidence: 89,
        lastActive: new Date(Date.now() - 180000), // 3 minutes ago
        status: 'active',
        recentActions: [
          { action: 'News Validated', result: 'success', timestamp: new Date(Date.now() - 180000) },
          { action: 'Data Verified', result: 'success', timestamp: new Date(Date.now() - 360000) },
          { action: 'Source Checked', result: 'success', timestamp: new Date(Date.now() - 540000) }
        ]
      },
      {
        agentName: 'Deployer',
        agentEmoji: '🏪',
        totalActions: 8,
        successRate: 100,
        totalProfit: 120,
        avgConfidence: 0,
        lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
        status: 'idle',
        recentActions: [
          { action: 'Market Created', result: 'success', profit: 15, timestamp: new Date(Date.now() - 1800000) },
          { action: 'Liquidity Added', result: 'success', timestamp: new Date(Date.now() - 3600000) }
        ]
      }
    ];

    setAgentPerformances(mockPerformances);

    // Calculate overall metrics
    const totalProfit = mockPerformances.reduce((sum, agent) => sum + agent.totalProfit, 0);
    const totalActions = mockPerformances.reduce((sum, agent) => sum + agent.totalActions, 0);
    const avgSuccessRate = mockPerformances.reduce((sum, agent) => sum + agent.successRate, 0) / mockPerformances.length;
    const bestAgent = mockPerformances.reduce((best, agent) => 
      agent.totalProfit > best.totalProfit ? agent : best
    );

    setMetrics({
      totalProfit,
      totalInvested: 1450,
      roi: ((totalProfit / 1450) * 100),
      winRate: avgSuccessRate,
      bestPerformingAgent: bestAgent.agentName,
      totalTrades: totalActions
    });
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-black-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'idle': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Metrics */}
      <div className="bg-black-900 border border-black-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">📈 Performance Overview</h3>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-black-800 border border-black-700 text-white px-3 py-1 text-sm focus:outline-none focus:border-accent-500 transition-colors"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">+${metrics.totalProfit}</div>
            <div className="text-black-400 text-xs">Total Profit</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">${metrics.totalInvested}</div>
            <div className="text-black-400 text-xs">Invested</div>
          </div>
          <div className="text-center">
            <div className="text-accent-500 font-bold text-lg">+{metrics.roi.toFixed(1)}%</div>
            <div className="text-black-400 text-xs">ROI</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">{metrics.winRate.toFixed(0)}%</div>
            <div className="text-black-400 text-xs">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-lg">{metrics.totalTrades}</div>
            <div className="text-black-400 text-xs">Total Actions</div>
          </div>
          <div className="text-center">
            <div className="text-accent-500 font-bold text-sm">{metrics.bestPerformingAgent}</div>
            <div className="text-black-400 text-xs">Top Performer</div>
          </div>
        </div>
      </div>

      {/* Individual Agent Performance */}
      <div className="bg-black-900 border border-black-800 p-6">
        <h3 className="text-white font-semibold mb-4">🤖 Agent Performance Breakdown</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agentPerformances.map((agent) => (
            <div key={agent.agentName} className="bg-black-800 border border-black-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{agent.agentEmoji}</span>
                  <span className="text-white font-medium">{agent.agentName}</span>
                  <span className="text-xs">{getStatusIcon(agent.status)}</span>
                </div>
                <span className={`text-xs ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div>
                  <div className="text-white font-bold text-sm">{agent.totalActions}</div>
                  <div className="text-black-400 text-xs">Actions</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold text-sm">{agent.successRate}%</div>
                  <div className="text-black-400 text-xs">Success</div>
                </div>
                <div>
                  <div className={`font-bold text-sm ${agent.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {agent.totalProfit >= 0 ? '+' : ''}${agent.totalProfit}
                  </div>
                  <div className="text-black-400 text-xs">Profit</div>
                </div>
              </div>

              {agent.avgConfidence > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-black-400">Avg Confidence</span>
                    <span className="text-white">{agent.avgConfidence}%</span>
                  </div>
                  <div className="w-full bg-black-700 h-1">
                    <div 
                      className="bg-accent-500 h-1" 
                      style={{ width: `${agent.avgConfidence}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-xs text-black-400 mb-1">Recent Activity:</div>
                {agent.recentActions.slice(0, 3).map((action, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-black-300">{action.action}</span>
                    <div className="flex items-center space-x-2">
                      {action.profit && (
                        <span className={action.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {action.profit >= 0 ? '+' : ''}${action.profit}
                        </span>
                      )}
                      <span className={action.result === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {action.result === 'success' ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-black-600">
                <span className="text-black-500 text-xs">
                  Last active: {formatTimeAgo(agent.lastActive)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
