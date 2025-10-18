/**
 * Coinbase CDP (Customer Data Platform) Configuration
 * Real X402 integration setup for production use
 */

import { X402Client, X402Config } from './x402-client';

// Environment configuration
export interface CDPEnvironment {
  apiKey: string;
  apiSecret: string;
  projectId: string;
  walletId?: string;
  networkId: string; // 'base-mainnet', 'base-sepolia', 'ethereum-mainnet', etc.
}

// Production CDP configuration
export class CoinbaseCDPClient extends X402Client {
  private projectId: string;
  private walletId?: string;
  private networkId: string;

  constructor(config: CDPEnvironment) {
    super({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      baseUrl: 'https://api.coinbase.com/platform',
      environment: 'production'
    });
    
    this.projectId = config.projectId;
    this.walletId = config.walletId;
    this.networkId = config.networkId;
  }

  /**
   * Initialize CDP wallet for automated trading
   */
  async initializeWallet(): Promise<string> {
    try {
      const response = await this.makeRequest('POST', '/wallets', {
        network_id: this.networkId,
        use_server_signer: true // Enable server-side signing for automation
      });

      this.walletId = response.id;
      console.log('✅ CDP Wallet initialized:', this.walletId);
      
      return this.walletId!;
    } catch (error) {
      console.error('❌ Wallet initialization failed:', error);
      throw new Error(`Failed to initialize CDP wallet: ${error}`);
    }
  }

  /**
   * Get wallet balance for USDC
   */
  async getWalletBalance(): Promise<{ usdc: number; eth: number }> {
    if (!this.walletId) {
      throw new Error('Wallet not initialized. Call initializeWallet() first.');
    }

    try {
      const response = await this.makeRequest('GET', `/wallets/${this.walletId}/balances`);
      
      const usdcBalance = response.data.find((balance: any) => 
        balance.asset.asset_id === 'usdc'
      )?.amount || '0';
      
      const ethBalance = response.data.find((balance: any) => 
        balance.asset.asset_id === 'eth'
      )?.amount || '0';

      return {
        usdc: parseFloat(usdcBalance),
        eth: parseFloat(ethBalance)
      };
    } catch (error) {
      console.error('❌ Balance check failed:', error);
      throw new Error(`Failed to get wallet balance: ${error}`);
    }
  }

  /**
   * Create a smart contract interaction for prediction market betting
   */
  async createMarketBet(
    contractAddress: string,
    betAmount: number,
    prediction: 'yes' | 'no',
    marketId: string
  ): Promise<string> {
    if (!this.walletId) {
      throw new Error('Wallet not initialized. Call initializeWallet() first.');
    }

    try {
      // Smart contract interaction for prediction market
      const contractInvocation = {
        network_id: this.networkId,
        contract_address: contractAddress,
        method: 'placeBet',
        args: [
          marketId,
          prediction === 'yes' ? '1' : '0', // Convert to contract format
          (betAmount * 1000000).toString() // Convert to USDC wei (6 decimals)
        ],
        amount: (betAmount * 1000000).toString(),
        asset_id: 'usdc'
      };

      const response = await this.makeRequest('POST', `/wallets/${this.walletId}/contract_invocations`, contractInvocation);
      
      console.log('✅ Market bet created:', response.transaction_hash);
      return response.transaction_hash;
    } catch (error) {
      console.error('❌ Market bet failed:', error);
      throw new Error(`Failed to place market bet: ${error}`);
    }
  }

  /**
   * Batch process multiple market bets (AI agent automation)
   */
  async executeBatchBets(bets: Array<{
    contractAddress: string;
    amount: number;
    prediction: 'yes' | 'no';
    marketId: string;
    confidence: number;
  }>): Promise<string[]> {
    const results: string[] = [];
    
    console.log(`🤖 Executing ${bets.length} automated bets...`);
    
    for (const bet of bets) {
      try {
        // Only bet if confidence is above threshold
        if (bet.confidence < 0.7) {
          console.log(`⏭️  Skipping ${bet.marketId} - confidence too low (${bet.confidence})`);
          continue;
        }

        const txHash = await this.createMarketBet(
          bet.contractAddress,
          bet.amount,
          bet.prediction,
          bet.marketId
        );
        
        results.push(txHash);
        console.log(`✅ Bet placed: ${bet.marketId} - ${bet.prediction.toUpperCase()} - $${bet.amount}`);
        
        // Rate limiting - wait between bets
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Bet failed for ${bet.marketId}:`, error);
        // Continue with other bets even if one fails
      }
    }
    
    console.log(`🎉 Batch complete: ${results.length}/${bets.length} successful bets`);
    return results;
  }

  /**
   * Monitor transaction status
   */
  async waitForTransaction(txHash: string, maxWaitTime: number = 300000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await this.makeRequest('GET', `/transactions/${txHash}`);
        
        if (response.status === 'complete') {
          console.log('✅ Transaction confirmed:', txHash);
          return true;
        } else if (response.status === 'failed') {
          console.log('❌ Transaction failed:', txHash);
          return false;
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000));
        
      } catch (error) {
        console.error('Error checking transaction status:', error);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    console.log('⏰ Transaction timeout:', txHash);
    return false;
  }
}

/**
 * Environment-specific configurations
 */
export const CDP_CONFIGS = {
  // Testnet configuration (Base Sepolia)
  testnet: {
    networkId: 'base-sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia-explorer.base.org'
  },
  
  // Mainnet configuration (Base)
  mainnet: {
    networkId: 'base-mainnet', 
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org'
  },
  
  // Ethereum mainnet (if needed)
  ethereum: {
    networkId: 'ethereum-mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    explorerUrl: 'https://etherscan.io'
  }
};

/**
 * Utility functions for CDP integration
 */
export class CDPUtils {
  /**
   * Validate CDP API credentials
   */
  static validateCredentials(config: CDPEnvironment): boolean {
    return !!(config.apiKey && config.apiSecret && config.projectId && config.networkId);
  }

  /**
   * Format transaction URL for explorer
   */
  static getTransactionUrl(txHash: string, network: 'testnet' | 'mainnet' | 'ethereum'): string {
    const config = CDP_CONFIGS[network];
    return `${config.explorerUrl}/tx/${txHash}`;
  }

  /**
   * Calculate optimal bet sizing based on confidence and bankroll
   */
  static calculateBetSize(
    bankroll: number,
    confidence: number,
    maxRiskPerBet: number = 0.05 // 5% max risk per bet
  ): number {
    // Kelly Criterion for optimal bet sizing
    const edge = (confidence - 0.5) * 2; // Convert confidence to edge
    const odds = confidence / (1 - confidence);
    
    // Kelly formula: f = (bp - q) / b
    // Where b = odds, p = probability, q = 1-p
    const kellyFraction = (odds * confidence - (1 - confidence)) / odds;
    
    // Cap at max risk per bet
    const safeFraction = Math.min(kellyFraction, maxRiskPerBet);
    
    return Math.max(0, bankroll * safeFraction);
  }
}

export default CoinbaseCDPClient;
