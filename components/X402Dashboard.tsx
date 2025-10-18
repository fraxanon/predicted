'use client';

import { useState } from 'react';
import { useX402Bot } from '../hooks/useX402Bot';

export function X402Dashboard() {
  const { 
    botStatus, 
    executeTrades, 
    updateConfig, 
    emergencyStop, 
    logs, 
    error,
    clearLogs,
    isReady,
    isDryRun,
    canTrade 
  } = useX402Bot();

  const [showLogs, setShowLogs] = useState(false);

  // Mock market data for testing
  const testMarkets = [
    {
      marketId: 'test-btc-100k',
      title: 'Will Bitcoin reach $100K by end of 2024?',
      contractAddress: '0x1234567890123456789012345678901234567890',
      aiPrediction: 'yes' as const,
      confidence: 0.85,
      yesPrice: 72,
      noPrice: 28,
      volume: '$45.2K',
      category: 'BTC',
      endDate: 'Dec 31'
    },
    {
      marketId: 'test-eth-pos',
      title: 'Will Ethereum upgrade to Proof of Stake 2.0?',
      contractAddress: '0x0987654321098765432109876543210987654321',
      aiPrediction: 'yes' as const,
      confidence: 0.92,
      yesPrice: 85,
      noPrice: 15,
      volume: '$32.1K',
      category: 'ETH',
      endDate: 'Nov 30'
    },
    {
      marketId: 'test-coinbase-l2',
      title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      aiPrediction: 'no' as const,
      confidence: 0.65,
      yesPrice: 43,
      noPrice: 57,
      volume: '$18.7K',
      category: 'L2',
      endDate: 'Dec 31'
    }
  ];

  const handleTestTrade = async () => {
    const result = await executeTrades(testMarkets);
    if (result) {
      console.log('Trading result:', result);
    }
  };

  const handleEnableTrading = () => {
    updateConfig({ enableAutoTrading: true });
  };

  const handleDisableTrading = () => {
    updateConfig({ enableAutoTrading: false });
  };

  return (
    <div className="bg-black-800 border border-black-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">🤖 X402 Trading Bot</h2>
        <div className="flex items-center space-x-2">
          {isDryRun && (
            <span className="px-2 py-1 bg-yellow-900 text-yellow-400 text-xs border border-yellow-700">
              DRY RUN
            </span>
          )}
          <span className={`px-2 py-1 text-xs border ${
            botStatus.isInitialized 
              ? 'bg-green-900 text-green-400 border-green-700' 
              : 'bg-red-900 text-red-400 border-red-700'
          }`}>
            {botStatus.isInitialized ? 'READY' : 'INITIALIZING'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 p-3 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Bot Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black-900 p-3 border border-black-600">
          <div className="text-black-400 text-xs">Balance</div>
          <div className="text-white font-bold">${botStatus.balance.usdc.toFixed(2)}</div>
          <div className="text-black-500 text-xs">USDC</div>
        </div>
        
        <div className="bg-black-900 p-3 border border-black-600">
          <div className="text-black-400 text-xs">Total Trades</div>
          <div className="text-white font-bold">{botStatus.performance.totalTrades}</div>
          <div className="text-black-500 text-xs">executed</div>
        </div>
        
        <div className="bg-black-900 p-3 border border-black-600">
          <div className="text-black-400 text-xs">Success Rate</div>
          <div className="text-green-400 font-bold">{(botStatus.performance.successRate * 100).toFixed(1)}%</div>
          <div className="text-black-500 text-xs">win rate</div>
        </div>
        
        <div className="bg-black-900 p-3 border border-black-600">
          <div className="text-black-400 text-xs">Auto Trading</div>
          <div className={`font-bold ${botStatus.config.enableAutoTrading ? 'text-green-400' : 'text-red-400'}`}>
            {botStatus.config.enableAutoTrading ? 'ON' : 'OFF'}
          </div>
          <div className="text-black-500 text-xs">status</div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-black-900 border border-black-600 p-3">
        <h3 className="text-white font-medium mb-2">Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-black-400">Max Bet:</span>
            <span className="text-white ml-2">${botStatus.config.maxBetSize}</span>
          </div>
          <div>
            <span className="text-black-400">Min Confidence:</span>
            <span className="text-white ml-2">{(botStatus.config.minConfidence * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-black-400">Max Risk:</span>
            <span className="text-white ml-2">{(botStatus.config.maxRiskPerBet * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Test Markets */}
      <div className="bg-black-900 border border-black-600 p-3">
        <h3 className="text-white font-medium mb-2">Test Markets ({testMarkets.length})</h3>
        <div className="space-y-2">
          {testMarkets.map((market) => (
            <div key={market.marketId} className="flex items-center justify-between p-2 bg-black-800 border border-black-700">
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{market.title}</div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-black-400">{market.category}</span>
                  <span className={`px-1 py-0.5 ${
                    market.aiPrediction === 'yes' 
                      ? 'bg-green-900 text-green-400' 
                      : 'bg-red-900 text-red-400'
                  }`}>
                    AI: {market.aiPrediction.toUpperCase()}
                  </span>
                  <span className="text-accent-500">{(market.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{market.yesPrice}¢ / {market.noPrice}¢</div>
                <div className="text-black-400 text-xs">{market.volume}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleTestTrade}
          disabled={!isReady || botStatus.isTrading}
          className="px-4 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {botStatus.isTrading ? 'Trading...' : '🎯 Test Trade'}
        </button>
        
        {!botStatus.config.enableAutoTrading ? (
          <button
            onClick={handleEnableTrading}
            disabled={!isReady}
            className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            ▶️ Enable Auto-Trading
          </button>
        ) : (
          <button
            onClick={handleDisableTrading}
            className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            ⏸️ Disable Auto-Trading
          </button>
        )}
        
        <button
          onClick={emergencyStop}
          className="px-4 py-2 bg-red-800 text-white font-medium hover:bg-red-900 transition-colors"
        >
          🛑 Emergency Stop
        </button>
        
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="px-4 py-2 bg-black-700 text-white font-medium hover:bg-black-600 transition-colors"
        >
          📋 {showLogs ? 'Hide' : 'Show'} Logs
        </button>
        
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-black-700 text-black-300 font-medium hover:bg-black-600 transition-colors"
          >
            🗑️ Clear Logs
          </button>
        )}
      </div>

      {/* Logs */}
      {showLogs && logs.length > 0 && (
        <div className="bg-black-950 border border-black-600 p-3 max-h-64 overflow-y-auto">
          <h3 className="text-white font-medium mb-2">Bot Logs</h3>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-black-300 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Trade */}
      {botStatus.lastTrade && (
        <div className="bg-green-900 bg-opacity-20 border border-green-800 p-3">
          <h3 className="text-green-400 font-medium mb-2">Last Trade</h3>
          <div className="text-sm">
            <div className="text-white">Market: {botStatus.lastTrade.marketId}</div>
            <div className="text-green-400">
              Prediction: {botStatus.lastTrade.prediction.toUpperCase()} - ${botStatus.lastTrade.amount.toFixed(2)}
            </div>
            <div className="text-black-400 text-xs">
              {botStatus.lastTrade.timestamp.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
