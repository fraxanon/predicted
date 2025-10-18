// Simplified wallet manager for tracking user deposits
// This approach tracks deposits without complex CDP wallet creation

interface UserDeposit {
  userAddress: string;
  totalETH: number;
  totalUSD: number;
  originalDepositsETH: number; // Track original deposits separately
  originalDepositsUSD: number;
  earningsETH: number; // Track earnings separately
  earningsUSD: number;
  transactions: {
    amount: number;
    txHash: string;
    timestamp: number;
    currency: 'ETH' | 'USDC';
    type?: 'deposit' | 'earnings' | 'investment';
  }[];
  lastUpdated: number;
}

export class SimpleWalletManager {
  private static STORAGE_KEY = 'predicted-user-deposits';

  // Get user's deposit balance
  static getUserBalance(userAddress: string): { eth: number; usd: number } {
    try {
      const deposits = this.loadAllDeposits();
      const userDeposit = deposits[userAddress.toLowerCase()];
      
      if (!userDeposit) {
        return { eth: 0, usd: 0 };
      }

      return {
        eth: userDeposit.totalETH,
        usd: userDeposit.totalUSD
      };
    } catch (error) {
      console.error('Failed to get user balance:', error);
      return { eth: 0, usd: 0 };
    }
  }

  // Add a deposit for a user
  static addDeposit(
    userAddress: string, 
    amount: number, 
    currency: 'ETH' | 'USDC',
    txHash: string
  ): void {
    try {
      const deposits = this.loadAllDeposits();
      const userKey = userAddress.toLowerCase();
      
      // Initialize user deposit record if doesn't exist
      if (!deposits[userKey]) {
        deposits[userKey] = {
          userAddress: userAddress,
          totalETH: 0,
          totalUSD: 0,
          originalDepositsETH: 0,
          originalDepositsUSD: 0,
          earningsETH: 0,
          earningsUSD: 0,
          transactions: [],
          lastUpdated: Date.now()
        };
      }

      const userDeposit = deposits[userKey];
      
      // Add transaction record
      userDeposit.transactions.push({
        amount,
        txHash,
        timestamp: Date.now(),
        currency,
        type: 'deposit'
      });

      // Update totals and original deposits
      if (currency === 'ETH') {
        userDeposit.totalETH += amount;
        userDeposit.originalDepositsETH += amount;
        const usdAmount = amount * 2500; // ETH price approximation
        userDeposit.totalUSD += usdAmount;
        userDeposit.originalDepositsUSD += usdAmount;
      } else {
        userDeposit.totalUSD += amount;
        userDeposit.originalDepositsUSD += amount;
      }

      userDeposit.lastUpdated = Date.now();

      // Save back to storage
      this.saveAllDeposits(deposits);
      
      console.log(`✅ Added ${amount} ${currency} deposit for user ${userAddress}`);
    } catch (error) {
      console.error('Failed to add deposit:', error);
      throw error;
    }
  }

  // Add earnings to user balance
  static addEarnings(
    userAddress: string, 
    amount: number, 
    currency: 'ETH' | 'USDC',
    source: string
  ): void {
    try {
      const deposits = this.loadAllDeposits();
      const userKey = userAddress.toLowerCase();
      const userDeposit = deposits[userKey];

      if (!userDeposit) {
        console.error('User not found for earnings');
        return;
      }

      // Add transaction record
      userDeposit.transactions.push({
        amount,
        txHash: `earnings_${source}`,
        timestamp: Date.now(),
        currency,
        type: 'earnings'
      });

      // Update totals and earnings
      if (currency === 'ETH') {
        userDeposit.totalETH += amount;
        userDeposit.earningsETH += amount;
        const usdAmount = amount * 2500; // ETH price approximation
        userDeposit.totalUSD += usdAmount;
        userDeposit.earningsUSD += usdAmount;
      } else {
        userDeposit.totalUSD += amount;
        userDeposit.earningsUSD += amount;
      }

      userDeposit.lastUpdated = Date.now();
      this.saveAllDeposits(deposits);
      
      console.log(`✅ Added ${amount} ${currency} earnings for user ${userAddress} from ${source}`);
    } catch (error) {
      console.error('Failed to add earnings:', error);
      throw error;
    }
  }

  // Get detailed balance breakdown
  static getUserBalanceBreakdown(userAddress: string): {
    originalDeposits: { eth: number; usd: number };
    earnings: { eth: number; usd: number };
    total: { eth: number; usd: number };
  } {
    try {
      const deposits = this.loadAllDeposits();
      const userDeposit = deposits[userAddress.toLowerCase()];
      
      if (!userDeposit) {
        return {
          originalDeposits: { eth: 0, usd: 0 },
          earnings: { eth: 0, usd: 0 },
          total: { eth: 0, usd: 0 }
        };
      }

      return {
        originalDeposits: {
          eth: userDeposit.originalDepositsETH || 0,
          usd: userDeposit.originalDepositsUSD || 0
        },
        earnings: {
          eth: userDeposit.earningsETH || 0,
          usd: userDeposit.earningsUSD || 0
        },
        total: {
          eth: userDeposit.totalETH,
          usd: userDeposit.totalUSD
        }
      };
    } catch (error) {
      console.error('Failed to get balance breakdown:', error);
      return {
        originalDeposits: { eth: 0, usd: 0 },
        earnings: { eth: 0, usd: 0 },
        total: { eth: 0, usd: 0 }
      };
    }
  }

  // Subtract from user balance (for investments)
  static subtractBalance(userAddress: string, amount: number): boolean {
    try {
      const deposits = this.loadAllDeposits();
      const userKey = userAddress.toLowerCase();
      const userDeposit = deposits[userKey];

      if (!userDeposit || userDeposit.totalUSD < amount) {
        return false; // Insufficient balance
      }

      // Calculate ETH equivalent to subtract
      const ethToSubtract = amount / 2500; // ETH price approximation
      
      userDeposit.totalUSD -= amount;
      userDeposit.totalETH -= ethToSubtract;
      userDeposit.lastUpdated = Date.now();

      // Add transaction record
      userDeposit.transactions.push({
        amount: -amount,
        txHash: 'investment',
        timestamp: Date.now(),
        currency: 'USDC'
      });

      this.saveAllDeposits(deposits);
      
      console.log(`✅ Subtracted $${amount} from user ${userAddress} balance`);
      return true;
    } catch (error) {
      console.error('Failed to subtract balance:', error);
      return false;
    }
  }

  // Get user's transaction history
  static getUserTransactions(userAddress: string): any[] {
    try {
      const deposits = this.loadAllDeposits();
      const userDeposit = deposits[userAddress.toLowerCase()];
      
      return userDeposit ? userDeposit.transactions : [];
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }

  // Load all deposits from storage
  private static loadAllDeposits(): Record<string, UserDeposit> {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
      } else {
        // Server environment - in production, use a database
        // For now, return empty object
        return {};
      }
    } catch (error) {
      console.error('Failed to load deposits:', error);
      return {};
    }
  }

  // Save all deposits to storage
  private static saveAllDeposits(deposits: Record<string, UserDeposit>): void {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(deposits));
      } else {
        // Server environment - in production, save to database
        console.log('Server-side deposit save:', Object.keys(deposits).length, 'users');
      }
    } catch (error) {
      console.error('Failed to save deposits:', error);
    }
  }

  // Generate a deposit address for user (for now, use a single protocol address)
  static getDepositAddress(): string {
    // In production, this could be user-specific addresses
    // For now, use a single protocol address
    return '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9';
  }

  // Clear all data (for testing)
  static clearAllData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    console.log('✅ Cleared all deposit data');
  }
}
