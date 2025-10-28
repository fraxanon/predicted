import { AgentBuilder } from '@iqai/adk';
import { X402 } from "../../lib/mock-agents";
import { ethers } from "ethers";

export interface Bet {
  id: string;
  userId: string;
  marketId: string;
  position: 'yes' | 'no';
  amount: string;
  shares: string;
  timestamp: Date;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Payout {
  id: string;
  betId: string;
  userId: string;
  amount: string;
  timestamp: Date;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Betting Agent - Powered by IQ ADK + Coinbase x402
 * 
 * Responsibilities:
 * - Handle user bet placement via x402 payments
 * - Manage bet execution on smart contracts
 * - Process payouts when markets resolve
 * - Track betting history and statistics
 */
export class BettingAgent {
  private agent: any;
  private runner: any;
  private session: any;
  private x402: X402;
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private activeBets: Map<string, Bet>;
  private pendingPayouts: Map<string, Payout>;

  constructor() {
    
    // Initialize Coinbase x402
    this.x402 = new X402({
      apiKey: process.env.COINBASE_X402_API_KEY,
      secret: process.env.COINBASE_X402_SECRET,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });

    // Initialize blockchain connection
    this.provider = new ethers.JsonRpcProvider(
      process.env.FRAXTAL_RPC_URL || 'https://rpc.frax.com'
    );
    
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY || '',
      this.provider
    );

    this.activeBets = new Map();
    this.pendingPayouts = new Map();
  }

  async initialize() {
    const { agent, runner, session } = await AgentBuilder
      .create('betting_agent')
      .withModel('gpt-4o-mini')
      .withDescription('AI agent that handles betting operations and payouts for prediction markets')
      .withInstruction(`
        You are a Betting Agent specialized in managing prediction market betting operations.
        
        Your responsibilities:
        1. Handle user bet placement via x402 payments
        2. Manage bet execution on smart contracts
        3. Process payouts when markets resolve
        4. Track betting history and statistics
        
        Focus on:
        - Secure payment processing with x402
        - Accurate bet execution on Fraxtal L2
        - Fair payout distribution
        - Comprehensive betting analytics
      `)
      .build();

    this.agent = agent;
    this.runner = runner;
    this.session = session;
    
    return { agent, runner, session };
  }

  async run() {
    console.log('💰 Betting Agent: Processing bets and payouts...');
    
    try {
      // Process pending bets
      await this.processPendingBets();
      
      // Process pending payouts
      await this.processPendingPayouts();
      
      // Update bet statuses
      await this.updateBetStatuses();
      
    } catch (error) {
      console.error('❌ Betting Agent error:', error);
    }
  }

  /**
   * Process a new bet from a user
   */
  private async processBet(betData: any): Promise<string> {
    console.log('🎯 Processing bet:', betData);

    try {
      // Create bet record
      const bet: Bet = {
        id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: betData.userId,
        marketId: betData.marketId,
        position: betData.position,
        amount: betData.amount,
        shares: '0', // Will be calculated after payment
        timestamp: new Date(),
        status: 'pending',
      };

      this.activeBets.set(bet.id, bet);

      // Create x402 payment request
      const paymentRequest = await this.createPaymentRequest(bet);
      
      console.log('💳 Payment request created:', paymentRequest.id);
      return paymentRequest.id;

    } catch (error) {
      console.error('❌ Failed to process bet:', error);
      throw error;
    }
  }

  /**
   * Create a Coinbase x402 payment request
   */
  private async createPaymentRequest(bet: Bet) {
    const paymentRequest = await this.x402.createPaymentRequest({
      amount: bet.amount,
      currency: 'USDC', // or frxUSD
      description: `Bet on prediction market: ${bet.marketId}`,
      metadata: {
        betId: bet.id,
        marketId: bet.marketId,
        position: bet.position,
      },
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payment`,
    });

    return paymentRequest;
  }

  /**
   * Handle successful payment and execute bet
   */
  private async handlePaymentSuccess(paymentData: any) {
    const betId = paymentData.metadata.betId;
    const bet = this.activeBets.get(betId);

    if (!bet) {
      console.error('❌ Bet not found for payment:', betId);
      return;
    }

    console.log('✅ Payment confirmed for bet:', betId);

    try {
      // Execute bet on smart contract
      const txHash = await this.executeBetOnChain(bet);
      
      // Update bet status
      bet.txHash = txHash;
      bet.status = 'confirmed';
      bet.shares = await this.calculateShares(bet);

      console.log('🎯 Bet executed on-chain:', txHash);

      // Log bet confirmed event
      console.log('✅ Bet confirmed event:', bet.id);

    } catch (error) {
      console.error('❌ Failed to execute bet on-chain:', error);
      bet.status = 'failed';
    }
  }

  /**
   * Execute bet on the blockchain
   */
  private async executeBetOnChain(bet: Bet): Promise<string> {
    console.log('🔗 Executing bet on-chain:', bet.id);
    
    // Mock implementation - replace with actual contract interaction
    // This would call the prediction market contract to place the bet
    
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    console.log('✅ Bet transaction:', mockTxHash);
    
    return mockTxHash;
  }

  /**
   * Calculate shares received for a bet
   */
  private async calculateShares(bet: Bet): Promise<string> {
    // Mock calculation - replace with actual market math
    // This would calculate shares based on current market odds
    
    const shares = (parseFloat(bet.amount) * 0.95).toFixed(6); // 5% fee
    return shares;
  }

  /**
   * Process market resolution and distribute payouts
   */
  private async distributePayout(resolutionData: any) {
    console.log('💸 Distributing payouts for market:', resolutionData.marketId);

    // Find all bets for this market
    const marketBets = Array.from(this.activeBets.values())
      .filter(bet => bet.marketId === resolutionData.marketId && bet.status === 'confirmed');

    for (const bet of marketBets) {
      // Check if bet won
      const won = bet.position === resolutionData.outcome;
      
      if (won) {
        await this.createPayout(bet, resolutionData);
      } else {
        console.log('❌ Bet lost:', bet.id);
      }
    }
  }

  /**
   * Create a payout for a winning bet
   */
  private async createPayout(bet: Bet, resolutionData: any) {
    const payoutAmount = await this.calculatePayout(bet, resolutionData);
    
    const payout: Payout = {
      id: `payout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      betId: bet.id,
      userId: bet.userId,
      amount: payoutAmount,
      timestamp: new Date(),
      status: 'pending',
    };

    this.pendingPayouts.set(payout.id, payout);
    
    console.log('💰 Payout created:', payout.id, 'Amount:', payoutAmount);
    
    // Execute payout
    await this.executePayout(payout);
  }

  /**
   * Calculate payout amount for a winning bet
   */
  private async calculatePayout(bet: Bet, resolutionData: any): Promise<string> {
    // Mock calculation - replace with actual payout logic
    // This would calculate winnings based on market resolution and pool distribution
    
    const multiplier = 1.8; // Mock 80% return
    const payout = (parseFloat(bet.amount) * multiplier).toFixed(6);
    
    return payout;
  }

  /**
   * Execute payout to user
   */
  private async executePayout(payout: Payout) {
    console.log('💸 Executing payout:', payout.id);

    try {
      // Send payout via x402 or direct transfer
      const txHash = await this.sendPayout(payout);
      
      payout.txHash = txHash;
      payout.status = 'completed';
      
      console.log('✅ Payout completed:', txHash);
      
      // Log payout completed event
      console.log('✅ Payout completed event:', payout.id);

    } catch (error) {
      console.error('❌ Failed to execute payout:', error);
      payout.status = 'failed';
    }
  }

  /**
   * Send payout to user's wallet
   */
  private async sendPayout(payout: Payout): Promise<string> {
    // Mock implementation - replace with actual transfer
    console.log('💳 Sending payout to user:', payout.userId);
    
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return mockTxHash;
  }

  /**
   * Process pending bets
   */
  private async processPendingBets() {
    const pendingBets = Array.from(this.activeBets.values())
      .filter(bet => bet.status === 'pending');

    console.log(`🔄 Processing ${pendingBets.length} pending bets`);
  }

  /**
   * Process pending payouts
   */
  private async processPendingPayouts() {
    const pendingPayouts = Array.from(this.pendingPayouts.values())
      .filter(payout => payout.status === 'pending');

    console.log(`💸 Processing ${pendingPayouts.length} pending payouts`);
  }

  /**
   * Update bet statuses from blockchain
   */
  private async updateBetStatuses() {
    // Check transaction statuses and update bet records
    console.log('🔄 Updating bet statuses...');
  }

  /**
   * Get user's betting history
   */
  public getUserBets(userId: string): Bet[] {
    return Array.from(this.activeBets.values())
      .filter(bet => bet.userId === userId);
  }

  /**
   * Get market betting statistics
   */
  public getMarketStats(marketId: string) {
    const marketBets = Array.from(this.activeBets.values())
      .filter(bet => bet.marketId === marketId);

    const totalVolume = marketBets.reduce((sum, bet) => sum + parseFloat(bet.amount), 0);
    const yesVolume = marketBets
      .filter(bet => bet.position === 'yes')
      .reduce((sum, bet) => sum + parseFloat(bet.amount), 0);
    const noVolume = marketBets
      .filter(bet => bet.position === 'no')
      .reduce((sum, bet) => sum + parseFloat(bet.amount), 0);

    return {
      totalVolume: totalVolume.toFixed(2),
      yesVolume: yesVolume.toFixed(2),
      noVolume: noVolume.toFixed(2),
      yesPercentage: totalVolume > 0 ? ((yesVolume / totalVolume) * 100).toFixed(1) : '0',
      noPercentage: totalVolume > 0 ? ((noVolume / totalVolume) * 100).toFixed(1) : '0',
      totalBets: marketBets.length,
    };
  }

  /**
   * Process a bet from external request
   */
  public async processBetFromEvent(betData: any): Promise<string> {
    return await this.processBet(betData);
  }

  /**
   * Handle payment success from external request
   */
  public async handlePaymentSuccessFromEvent(paymentData: any) {
    return await this.handlePaymentSuccess(paymentData);
  }

  /**
   * Distribute payout from external request
   */
  public async distributePayoutFromEvent(resolutionData: any) {
    return await this.distributePayout(resolutionData);
  }
}
