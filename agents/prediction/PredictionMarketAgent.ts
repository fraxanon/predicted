import { AgentBuilder } from '@iqai/adk';
import { ethers } from "ethers";
import { Web3Event } from "../oracle/OracleAgent";

export interface PredictionMarket {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  contractAddress: string;
  totalPool: string;
  yesShares: string;
  noShares: string;
  createdAt: Date;
  endDate: Date;
  resolved: boolean;
  outcome?: 'yes' | 'no';
}

/**
 * Prediction Market Agent - Powered by IQ ADK
 * 
 * Responsibilities:
 * - Create new prediction markets from Oracle events
 * - Deploy smart contracts on Fraxtal L2
 * - Manage market state and liquidity
 * - Handle market resolution
 */
export class PredictionMarketAgent {
  private agent: any;
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private activeMarkets: Map<string, PredictionMarket>;

  constructor() {
    // Initialize Fraxtal L2 connection
    this.provider = new ethers.JsonRpcProvider(
      process.env.FRAXTAL_RPC_URL || 'https://rpc.frax.com'
    );
    
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY || '',
      this.provider
    );

    this.activeMarkets = new Map();
  }

  async initialize() {
    const { agent } = await AgentBuilder
      .create('prediction_market_agent')
      .withModel('gpt-4o-mini')
      .withDescription('Prediction market agent for Web3 events')
      .withInstruction(`
        You are a prediction market agent for Web3 events.
        
        Your responsibilities:
        - Create new prediction markets from validated Web3 events
        - Deploy smart contracts on Fraxtal L2 blockchain
        - Manage market state, liquidity, and trading
        - Handle market resolution based on oracle outcomes
        - Track market performance and statistics
        
        Always ensure:
        - Proper smart contract deployment and validation
        - Accurate market state tracking
        - Secure resolution process
        - Comprehensive market data management
      `)
      .build();
    
    this.agent = agent;
    console.log('📊 Prediction Market Agent initialized with ADK');
  }

  async run() {
    console.log('📊 Prediction Market Agent: Managing markets...');
    
    try {
      // Check market states
      await this.updateMarketStates();
      
      // Process any pending market creations
      await this.processPendingMarkets();
      
    } catch (error) {
      console.error('❌ Prediction Market Agent error:', error);
    }
  }

  /**
   * Create a new prediction market from a Web3 event
   */
  private async createMarket(eventData: Web3Event): Promise<PredictionMarket> {
    console.log('🏗️ Creating market for:', eventData.title);

    try {
      // Deploy prediction market contract
      const contractAddress = await this.deployMarketContract(eventData);
      
      const market: PredictionMarket = {
        id: `market-${eventData.id}`,
        eventId: eventData.id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        contractAddress,
        totalPool: '0',
        yesShares: '0',
        noShares: '0',
        createdAt: new Date(),
        endDate: eventData.endDate,
        resolved: false,
      };

      this.activeMarkets.set(market.id, market);
      
      // Log market creation
      console.log('🏗️ Market created successfully:', market.id);
      
      console.log('✅ Market created:', market.id);
      return market;

    } catch (error) {
      console.error('❌ Failed to create market:', error);
      throw error;
    }
  }

  /**
   * Deploy a prediction market smart contract
   */
  private async deployMarketContract(eventData: Web3Event): Promise<string> {
    // Mock contract deployment - replace with actual contract deployment
    console.log('🚀 Deploying contract for:', eventData.title);
    
    // This would deploy the actual smart contract
    // For now, return a mock address
    const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    console.log('📄 Contract deployed at:', mockAddress);
    return mockAddress;
  }

  /**
   * Update states of all active markets
   */
  private async updateMarketStates() {
    for (const [marketId, market] of this.activeMarkets) {
      try {
        // Check if market has ended
        if (new Date() > market.endDate && !market.resolved) {
          console.log('⏰ Market ended, awaiting resolution:', marketId);
        }

        // Update market data from blockchain
        await this.updateMarketData(market);
        
      } catch (error) {
        console.error(`❌ Failed to update market ${marketId}:`, error);
      }
    }
  }

  /**
   * Update market data from the blockchain
   */
  private async updateMarketData(market: PredictionMarket) {
    // Mock implementation - replace with actual contract calls
    // This would read from the deployed contract to get current state
    
    // For now, simulate some activity
    const randomPool = (Math.random() * 1000).toFixed(2);
    market.totalPool = randomPool;
    market.yesShares = (parseFloat(randomPool) * 0.6).toFixed(2);
    market.noShares = (parseFloat(randomPool) * 0.4).toFixed(2);
  }

  /**
   * Process any pending market operations
   */
  private async processPendingMarkets() {
    // Handle any queued market operations
    console.log('🔄 Processing pending market operations...');
  }

  /**
   * Resolve a market based on Oracle outcome
   */
  private async resolveMarket(resolutionData: any) {
    const market = this.activeMarkets.get(resolutionData.eventId);
    
    if (!market) {
      console.error('❌ Market not found for resolution:', resolutionData.eventId);
      return;
    }

    console.log('✅ Resolving market:', market.id, 'Outcome:', resolutionData.outcome);

    try {
      // Call smart contract to resolve market
      await this.executeMarketResolution(market, resolutionData.outcome);
      
      // Update local state
      market.resolved = true;
      market.outcome = resolutionData.outcome;
      
      // Log market resolution
      console.log('✅ Market resolved:', {
        marketId: market.id,
        outcome: resolutionData.outcome,
        totalPool: market.totalPool,
      });

    } catch (error) {
      console.error('❌ Failed to resolve market:', error);
    }
  }

  /**
   * Execute market resolution on the blockchain
   */
  private async executeMarketResolution(market: PredictionMarket, outcome: string) {
    console.log('🔗 Executing on-chain resolution for:', market.id);
    
    // Mock implementation - replace with actual contract call
    // This would call the smart contract's resolve function
    
    console.log('✅ Market resolved on-chain');
  }

  /**
   * Get market information
   */
  public getMarket(marketId: string): PredictionMarket | undefined {
    return this.activeMarkets.get(marketId);
  }

  /**
   * Get all active markets
   */
  public getAllMarkets(): PredictionMarket[] {
    return Array.from(this.activeMarkets.values());
  }

  /**
   * Create a market (public method for external calls)
   */
  public async createMarketExternal(eventData: Web3Event): Promise<PredictionMarket> {
    return await this.createMarket(eventData);
  }

  /**
   * Resolve a market (public method)
   */
  public async resolveMarketExternal(resolutionData: any) {
    await this.resolveMarket(resolutionData);
  }
}
