/**
 * X402 Automated Trading Bot
 * Integrates with Coinbase CDP for real prediction market trading
 */

import CoinbaseCDPClient, { CDPEnvironment, CDPUtils } from './coinbase-cdp-config';
import { MockX402Client } from './x402-client';

export interface MarketPrediction {
  marketId: string;
  title: string;
  contractAddress: string;
  aiPrediction: 'yes' | 'no';
  confidence: number;
  yesPrice: number;
  noPrice: number;
  volume: string;
  category: string;
  endDate: string;
}

export interface TradingConfig {
  maxBetSize: number;
  minConfidence: number;
  maxRiskPerBet: number;
  enableAutoTrading: boolean;
  dryRun: boolean;
}

export class X402TradingBot {
  private cdpClient: CoinbaseCDPClient | MockX402Client;
  private config: TradingConfig;
  private isInitialized: boolean = false;
  private walletBalance: { usdc: number; eth: number } = { usdc: 0, eth: 0 };

  constructor(
    cdpConfig: CDPEnvironment | null,
    tradingConfig: TradingConfig
  ) {
    // Use mock client if no real config provided or in dry run mode
    if (!cdpConfig || tradingConfig.dryRun) {
      console.log('🧪 Using Mock X402 Client (Dry Run Mode)');
      this.cdpClient = new MockX402Client();
    } else {
      console.log('🚀 Using Real Coinbase CDP Client');
      this.cdpClient = new CoinbaseCDPClient(cdpConfig);
    }
    
    this.config = tradingConfig;
  }

  /**
   * Initialize the trading bot
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🤖 Initializing X402 Trading Bot...');
      
      if (this.cdpClient instanceof CoinbaseCDPClient) {
        // Initialize real CDP wallet
        await this.cdpClient.initializeWallet();
        this.walletBalance = await this.cdpClient.getWalletBalance();
        
        console.log('💰 Wallet Balance:');
        console.log(`   USDC: $${this.walletBalance.usdc}`);
        console.log(`   ETH: ${this.walletBalance.eth}`);
        
        if (this.walletBalance.usdc < 10) {
          console.warn('⚠️  Low USDC balance. Consider funding your wallet.');
        }
      } else {
        // Mock initialization
        this.walletBalance = { usdc: 1000, eth: 0.5 };
        console.log('💰 Mock Wallet Balance: $1000 USDC, 0.5 ETH');
      }
      
      this.isInitialized = true;
      console.log('✅ X402 Trading Bot initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Bot initialization failed:', error);
      return false;
    }
  }

  /**
   * Analyze markets and execute trades based on AI predictions
   */
  async analyzeBets(markets: MarketPrediction[]): Promise<{
    executed: number;
    skipped: number;
    failed: number;
    totalInvested: number;
    transactions: string[];
  }> {
    if (!this.isInitialized) {
      throw new Error('Bot not initialized. Call initialize() first.');
    }

    if (!this.config.enableAutoTrading) {
      console.log('🚫 Auto-trading disabled. Set enableAutoTrading to true.');
      return { executed: 0, skipped: markets.length, failed: 0, totalInvested: 0, transactions: [] };
    }

    console.log(`🔍 Analyzing ${markets.length} markets...`);
    
    const results = {
      executed: 0,
      skipped: 0,
      failed: 0,
      totalInvested: 0,
      transactions: [] as string[]
    };

    for (const market of markets) {
      try {
        // Check if market meets confidence threshold
        if (market.confidence < this.config.minConfidence) {
          console.log(`⏭️  Skipping ${market.marketId} - Low confidence (${(market.confidence * 100).toFixed(1)}%)`);
          results.skipped++;
          continue;
        }

        // Calculate optimal bet size
        const betSize = CDPUtils.calculateBetSize(
          this.walletBalance.usdc,
          market.confidence,
          this.config.maxRiskPerBet
        );

        // Cap at max bet size
        const finalBetSize = Math.min(betSize, this.config.maxBetSize);

        if (finalBetSize < 1) {
          console.log(`⏭️  Skipping ${market.marketId} - Bet size too small ($${finalBetSize.toFixed(2)})`);
          results.skipped++;
          continue;
        }

        // Check if we have enough balance
        if (finalBetSize > this.walletBalance.usdc) {
          console.log(`⏭️  Skipping ${market.marketId} - Insufficient balance`);
          results.skipped++;
          continue;
        }

        console.log(`🎯 Placing bet on ${market.marketId}:`);
        console.log(`   📊 ${market.title}`);
        console.log(`   🤖 AI Prediction: ${market.aiPrediction.toUpperCase()}`);
        console.log(`   🎯 Confidence: ${(market.confidence * 100).toFixed(1)}%`);
        console.log(`   💰 Bet Size: $${finalBetSize.toFixed(2)}`);

        let txHash: string;

        if (this.cdpClient instanceof CoinbaseCDPClient) {
          // Real CDP transaction
          txHash = await this.cdpClient.createMarketBet(
            market.contractAddress,
            finalBetSize,
            market.aiPrediction,
            market.marketId
          );
        } else {
          // Mock transaction
          const mockResult = await this.cdpClient.createPayment({
            amount: (finalBetSize * 1000000).toString(),
            currency: 'USDC',
            recipient: market.contractAddress,
            metadata: {
              marketId: market.marketId,
              prediction: market.aiPrediction,
              userId: 'x402_bot',
              confidence: market.confidence
            }
          });
          txHash = mockResult.transactionHash || 'mock_tx_' + Date.now();
        }

        results.executed++;
        results.totalInvested += finalBetSize;
        results.transactions.push(txHash);
        
        // Update balance
        this.walletBalance.usdc -= finalBetSize;

        console.log(`   ✅ Success! TX: ${txHash}`);
        
        // Rate limiting between bets
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`❌ Failed to bet on ${market.marketId}:`, error);
        results.failed++;
      }
    }

    console.log(`\n📊 Trading Session Complete:`);
    console.log(`   ✅ Executed: ${results.executed}`);
    console.log(`   ⏭️  Skipped: ${results.skipped}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   💰 Total Invested: $${results.totalInvested.toFixed(2)}`);
    console.log(`   💳 Remaining Balance: $${this.walletBalance.usdc.toFixed(2)}`);

    return results;
  }

  /**
   * Get current wallet status
   */
  getWalletStatus() {
    return {
      balance: this.walletBalance,
      isInitialized: this.isInitialized,
      config: this.config
    };
  }

  /**
   * Update trading configuration
   */
  updateConfig(newConfig: Partial<TradingConfig>) {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️  Trading config updated:', this.config);
  }

  /**
   * Emergency stop - disable all trading
   */
  emergencyStop() {
    this.config.enableAutoTrading = false;
    console.log('🛑 EMERGENCY STOP - Auto-trading disabled');
  }

  /**
   * Get trading performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    totalTrades: number;
    successRate: number;
    totalInvested: number;
    estimatedReturns: number;
  }> {
    // This would integrate with your database to track historical performance
    // For now, return mock data
    return {
      totalTrades: 47,
      successRate: 0.732, // 73.2%
      totalInvested: 2350,
      estimatedReturns: 3180
    };
  }
}

/**
 * Factory function to create bot instance from environment variables
 */
export function createX402Bot(): X402TradingBot {
  // Check if we're in development mode or using mock payments
  const useMock = process.env.NODE_ENV === 'development' || 
                  process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS === 'true';

  let cdpConfig: CDPEnvironment | null = null;

  if (!useMock) {
    // Validate required environment variables
    const requiredVars = [
      'COINBASE_CDP_API_KEY',
      'COINBASE_CDP_API_SECRET', 
      'COINBASE_CDP_PROJECT_ID',
      'COINBASE_CDP_NETWORK_ID'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
      console.warn('🧪 Falling back to mock mode');
    } else {
      cdpConfig = {
        apiKey: process.env.COINBASE_CDP_API_KEY!,
        apiSecret: process.env.COINBASE_CDP_API_SECRET!,
        projectId: process.env.COINBASE_CDP_PROJECT_ID!,
        networkId: process.env.COINBASE_CDP_NETWORK_ID || 'base-sepolia', // Default to testnet
        walletId: process.env.COINBASE_CDP_WALLET_ID
      };
    }
  }

  const tradingConfig: TradingConfig = {
    maxBetSize: parseInt(process.env.MAX_BET_SIZE || '100'),
    minConfidence: parseFloat(process.env.MIN_CONFIDENCE_THRESHOLD || '0.70'),
    maxRiskPerBet: parseFloat(process.env.MAX_RISK_PER_BET || '0.05'),
    enableAutoTrading: process.env.ENABLE_AUTO_TRADING === 'true',
    dryRun: useMock || cdpConfig === null
  };

  return new X402TradingBot(cdpConfig, tradingConfig);
}

export default X402TradingBot;
