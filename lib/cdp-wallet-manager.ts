// CDP Wallet Manager for user-specific wallets
// Note: This runs server-side only to avoid exposing CDP credentials
export class CDPWalletManager {
  private userWallets: Map<string, any> = new Map();

  constructor() {
    // CDP SDK will be imported dynamically in server-side methods
  }

  // Get or create a wallet for a specific user
  async getUserWallet(userAddress: string): Promise<any> {
    const { Coinbase, Wallet } = await import('@coinbase/coinbase-sdk');
    const walletKey = userAddress.toLowerCase();
    
    // Check if wallet already exists in memory
    if (this.userWallets.has(walletKey)) {
      return this.userWallets.get(walletKey)!;
    }

    try {
      // Initialize Coinbase SDK
      const coinbase = new Coinbase({
        apiKeyName: process.env.COINBASE_CDP_API_KEY!,
        privateKey: process.env.COINBASE_CDP_API_SECRET!,
      });

      // Try to load existing wallet from storage
      const existingWallet = await this.loadUserWallet(userAddress);
      if (existingWallet) {
        this.userWallets.set(walletKey, existingWallet);
        return existingWallet;
      }

      // Create new wallet for user
      const newWallet = await Wallet.create({
        networkId: 'base-sepolia',
      });

      // Save wallet data for persistence
      await this.saveUserWallet(userAddress, newWallet);
      
      this.userWallets.set(walletKey, newWallet);
      console.log(`✅ Created new CDP wallet for user: ${userAddress}`);
      
      return newWallet;
    } catch (error) {
      console.error('Failed to get/create user wallet:', error);
      throw error;
    }
  }

  // Get user's wallet balance
  async getUserBalance(userAddress: string): Promise<{ eth: number; usd: number }> {
    try {
      const wallet = await this.getUserWallet(userAddress);
      const balance = await wallet.getBalance('eth');
      
      const ethAmount = parseFloat(balance.toString());
      const usdAmount = ethAmount * 2500; // ETH price approximation
      
      return { eth: ethAmount, usd: usdAmount };
    } catch (error) {
      console.error('Failed to get user balance:', error);
      return { eth: 0, usd: 0 };
    }
  }

  // Get user's wallet address for deposits
  async getUserWalletAddress(userAddress: string): Promise<string> {
    const wallet = await this.getUserWallet(userAddress);
    const defaultAddress = await wallet.getDefaultAddress();
    return defaultAddress.getId();
  }

  // Transfer funds from user wallet (for investments)
  async transferFromUserWallet(
    userAddress: string, 
    toAddress: string, 
    amount: number
  ): Promise<string> {
    try {
      const wallet = await this.getUserWallet(userAddress);
      const transfer = await wallet.createTransfer({
        amount: amount,
        assetId: 'eth',
        destination: toAddress,
      });

      await transfer.wait();
      console.log(`✅ Transferred ${amount} ETH from user ${userAddress} to ${toAddress}`);
      
      return transfer.getTransactionHash()!;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }

  // Save wallet data to persistent storage (you might want to use a database)
  private async saveUserWallet(userAddress: string, wallet: any): Promise<void> {
    try {
      // For now, we'll use localStorage in the browser or file system on server
      // In production, use a secure database
      const walletData = {
        walletId: wallet.getId(),
        seed: wallet.export(), // This contains the private key data
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage (browser) or implement database storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cdp-wallet-${userAddress.toLowerCase()}`, JSON.stringify(walletData));
      }
    } catch (error) {
      console.error('Failed to save wallet:', error);
    }
  }

  // Load wallet data from persistent storage
  private async loadUserWallet(userAddress: string): Promise<any | null> {
    try {
      const { Wallet } = await import('@coinbase/coinbase-sdk');
      
      // Load from localStorage (browser) or implement database loading
      if (typeof window !== 'undefined') {
        const walletDataStr = localStorage.getItem(`cdp-wallet-${userAddress.toLowerCase()}`);
        if (!walletDataStr) return null;

        const walletData = JSON.parse(walletDataStr);
        
        // Import the wallet from saved seed
        const wallet = await Wallet.import(walletData.seed);
        return wallet;
      }
      return null;
    } catch (error) {
      console.error('Failed to load wallet:', error);
      return null;
    }
  }

  // Get all user transactions
  async getUserTransactions(userAddress: string): Promise<any[]> {
    try {
      const wallet = await this.getUserWallet(userAddress);
      const transactions = await wallet.listTransactions();
      return transactions;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  }
}

// Singleton instance
export const cdpWalletManager = new CDPWalletManager();
