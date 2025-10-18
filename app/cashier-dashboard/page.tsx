'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CashierDashboard() {
  const [budget, setBudget] = useState(1000);
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(true);
  const [riskLevel, setRiskLevel] = useState('medium');

  // Mock trading data
  const tradingHistory = [
    {
      id: 1,
      market: "Will Bitcoin reach $100k by end of 2024?",
      amount: 50,
      position: "YES",
      status: "active",
      timestamp: "2024-10-17T10:30:00Z",
      currentValue: 52.5
    },
    {
      id: 2,
      market: "Will Tesla stock hit $300 this quarter?",
      amount: 75,
      position: "NO",
      status: "won",
      timestamp: "2024-10-16T14:20:00Z",
      payout: 142.5
    },
    {
      id: 3,
      market: "Will AI regulation pass in the US this year?",
      amount: 30,
      position: "YES",
      status: "lost",
      timestamp: "2024-10-15T09:15:00Z",
      payout: 0
    }
  ];

  const totalInvested = tradingHistory.reduce((sum, trade) => sum + trade.amount, 0);
  const totalReturns = tradingHistory.reduce((sum, trade) => {
    if (trade.status === 'won') return sum + trade.payout;
    if (trade.status === 'active') return sum + trade.currentValue;
    return sum;
  }, 0);
  const profitLoss = totalReturns - totalInvested;

  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Header */}
      <header className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-accent-400 hover:text-accent-300">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  💰
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">X402 Trading Agent - "Cashier"</h1>
                  <p className="text-sm text-gray-400">Autonomous Investment Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Budget</p>
                <p className="text-2xl font-bold text-white">${budget}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                💳
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-white">${totalInvested}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Value</p>
                <p className="text-2xl font-bold text-white">${totalReturns.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                💰
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Profit/Loss</p>
                <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                </p>
              </div>
              <div className={`w-12 h-12 ${profitLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg flex items-center justify-center`}>
                {profitLoss >= 0 ? '📈' : '📉'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Settings */}
          <div className="lg:col-span-1">
            <div className="bg-black-900 border border-black-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">⚙️ Agent Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto-Investment
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setAutoInvestEnabled(!autoInvestEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoInvestEnabled ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoInvestEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-400">
                      {autoInvestEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Allocation
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-black-800 border border-black-700 text-white rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>

              <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors">
                Update Settings
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-black-900 border border-black-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">🚀 Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors">
                  💡 Get Prophet Recommendations
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors">
                  📊 View Performance Analytics
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors">
                  ⏸️ Pause Auto-Trading
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded transition-colors">
                  💳 Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Trading History */}
          <div className="lg:col-span-2">
            <div className="bg-black-900 border border-black-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">📈 Trading History</h2>
              
              <div className="space-y-4">
                {tradingHistory.map((trade) => (
                  <div key={trade.id} className="border border-black-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{trade.market}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.status === 'active' ? 'bg-blue-900 text-blue-400' :
                        trade.status === 'won' ? 'bg-green-900 text-green-400' :
                        'bg-red-900 text-red-400'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Position</p>
                        <p className="text-white font-medium">{trade.position}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p className="text-white font-medium">${trade.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Current/Final Value</p>
                        <p className="text-white font-medium">
                          ${trade.status === 'active' ? trade.currentValue : trade.payout || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Date</p>
                        <p className="text-white font-medium">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
