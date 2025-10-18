/**
 * React Hook for X402 Trading Bot Integration
 * Provides easy access to automated trading functionality in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { X402TradingBot, MarketPrediction, TradingConfig, createX402Bot } from '../lib/x402-bot';

export interface BotStatus {
  isInitialized: boolean;
  isTrading: boolean;
  balance: { usdc: number; eth: number };
  config: TradingConfig;
  lastTrade?: {
    timestamp: Date;
    marketId: string;
    amount: number;
    prediction: 'yes' | 'no';
    txHash: string;
  };
  performance: {
    totalTrades: number;
    successRate: number;
    totalInvested: number;
    estimatedReturns: number;
  };
}

export interface TradingResult {
  executed: number;
  skipped: number;
  failed: number;
  totalInvested: number;
  transactions: string[];
}

export function useX402Bot() {
  const [botStatus, setBotStatus] = useState<BotStatus>({
    isInitialized: false,
    isTrading: false,
    balance: { usdc: 0, eth: 0 },
    config: {
      maxBetSize: 100,
      minConfidence: 0.70,
      maxRiskPerBet: 0.05,
      enableAutoTrading: false,
      dryRun: true
    },
    performance: {
      totalTrades: 0,
      successRate: 0,
      totalInvested: 0,
      estimatedReturns: 0
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const botRef = useRef<X402TradingBot | null>(null);

  // Initialize bot on mount
  useEffect(() => {
    const initBot = async () => {
      try {
        console.log('🤖 Initializing X402 Bot...');
        addLog('Initializing X402 Trading Bot...');
        
        botRef.current = createX402Bot();
        const success = await botRef.current.initialize();
        
        if (success) {
          const status = botRef.current.getWalletStatus();
          const performance = await botRef.current.getPerformanceMetrics();
          
          setBotStatus(prev => ({
            ...prev,
            isInitialized: true,
            balance: status.balance,
            config: status.config,
            performance
          }));
          
          addLog('✅ Bot initialized successfully');
          setError(null);
        } else {
          throw new Error('Bot initialization failed');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        addLog(`❌ Initialization failed: ${errorMsg}`);
      }
    };

    initBot();
  }, []);

  // Add log entry
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    setLogs(prev => {
      const newLogs = [...prev, logEntry];
      // Keep only last 50 logs
      return newLogs.slice(-50);
    });
    
    console.log(logEntry);
  }, []);

  // Execute trades on markets
  const executeTrades = useCallback(async (markets: MarketPrediction[]): Promise<TradingResult | null> => {
    if (!botRef.current || !botStatus.isInitialized) {
      setError('Bot not initialized');
      return null;
    }

    if (botStatus.isTrading) {
      setError('Bot is already trading');
      return null;
    }

    try {
      setBotStatus(prev => ({ ...prev, isTrading: true }));
      setError(null);
      addLog(`🎯 Starting analysis of ${markets.length} markets...`);

      const result = await botRef.current.analyzeBets(markets);
      
      // Update bot status
      const status = botRef.current.getWalletStatus();
      const performance = await botRef.current.getPerformanceMetrics();
      
      setBotStatus(prev => ({
        ...prev,
        isTrading: false,
        balance: status.balance,
        performance,
        lastTrade: result.executed > 0 ? {
          timestamp: new Date(),
          marketId: markets[0]?.marketId || 'unknown',
          amount: result.totalInvested / result.executed,
          prediction: markets[0]?.aiPrediction || 'yes',
          txHash: result.transactions[0] || 'unknown'
        } : prev.lastTrade
      }));

      addLog(`📊 Trading complete: ${result.executed} executed, ${result.skipped} skipped, ${result.failed} failed`);
      addLog(`💰 Total invested: $${result.totalInvested.toFixed(2)}`);

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Trading failed';
      setError(errorMsg);
      addLog(`❌ Trading error: ${errorMsg}`);
      
      setBotStatus(prev => ({ ...prev, isTrading: false }));
      return null;
    }
  }, [botStatus.isInitialized, botStatus.isTrading, addLog]);

  // Update bot configuration
  const updateConfig = useCallback((newConfig: Partial<TradingConfig>) => {
    if (!botRef.current) {
      setError('Bot not initialized');
      return;
    }

    try {
      botRef.current.updateConfig(newConfig);
      const status = botRef.current.getWalletStatus();
      
      setBotStatus(prev => ({
        ...prev,
        config: status.config
      }));
      
      addLog('⚙️ Configuration updated');
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Config update failed';
      setError(errorMsg);
      addLog(`❌ Config update error: ${errorMsg}`);
    }
  }, [addLog]);

  // Emergency stop
  const emergencyStop = useCallback(() => {
    if (!botRef.current) {
      setError('Bot not initialized');
      return;
    }

    try {
      botRef.current.emergencyStop();
      const status = botRef.current.getWalletStatus();
      
      setBotStatus(prev => ({
        ...prev,
        config: status.config,
        isTrading: false
      }));
      
      addLog('🛑 EMERGENCY STOP - Auto-trading disabled');
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Emergency stop failed';
      setError(errorMsg);
      addLog(`❌ Emergency stop error: ${errorMsg}`);
    }
  }, [addLog]);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Status
    botStatus,
    error,
    logs,
    
    // Actions
    executeTrades,
    updateConfig,
    emergencyStop,
    
    // Utilities
    clearLogs,
    clearError,
    
    // Computed values
    isReady: botStatus.isInitialized && !botStatus.isTrading,
    isDryRun: botStatus.config.dryRun,
    canTrade: botStatus.isInitialized && botStatus.config.enableAutoTrading && !botStatus.isTrading
  };
}

export default useX402Bot;
