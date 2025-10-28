import { OracleAgent } from "./oracle/OracleAgent";
import { PredictionMarketAgent } from "./prediction/PredictionMarketAgent";
import { BettingAgent } from "./betting/BettingAgent";
import { AnalyticsAgent } from "./analytics/AnalyticsAgent";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * IQ Predict ADK Multi-Agent System
 * 
 * Orchestrates four specialized agents using the IQ ADK framework:
 * 1. Oracle Agent - Scrapes and validates Web3 news
 * 2. Prediction Market Agent - Creates and manages markets
 * 3. Betting Agent - Handles payments and payouts
 * 4. Analytics Agent - Provides AI predictions and insights
 */
class IQPredictADKSystem {
  private oracleAgent: OracleAgent;
  private predictionMarketAgent: PredictionMarketAgent;
  private bettingAgent: BettingAgent;
  private analyticsAgent: AnalyticsAgent;

  constructor() {
    // Initialize all ADK agents
    this.oracleAgent = new OracleAgent();
    this.predictionMarketAgent = new PredictionMarketAgent();
    this.bettingAgent = new BettingAgent();
    this.analyticsAgent = new AnalyticsAgent();
  }

  /**
   * Initialize all agents with ADK
   */
  async initialize() {
    console.log('🚀 Initializing IQ Predict ADK System...');
    
    try {
      // Initialize all agents
      await this.oracleAgent.initialize();
      await this.predictionMarketAgent.initialize();
      await this.bettingAgent.initialize();
      await this.analyticsAgent.initialize();
      
      console.log('✅ All ADK agents initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize ADK agents:', error);
      throw error;
    }
  }

  /**
   * Start the agent system
   */
  async start() {
    console.log('🚀 Starting IQ Predict ADK Agent System...');
    
    try {
      // Initialize all agents first
      await this.initialize();
      
      // Start periodic tasks
      this.startPeriodicTasks();
      
      console.log('✅ ADK Agent system started successfully');
      
    } catch (error) {
      console.error('❌ Failed to start ADK agent system:', error);
      process.exit(1);
    }
  }

  /**
   * Start periodic background tasks
   */
  private startPeriodicTasks() {
    // Oracle checks for new events every 5 minutes
    setInterval(async () => {
      try {
        await this.oracleAgent.checkForEventsExternal();
      } catch (error) {
        console.error('❌ Oracle periodic task error:', error);
      }
    }, 5 * 60 * 1000);

    // Analytics updates predictions every 10 minutes
    setInterval(async () => {
      try {
        await this.analyticsAgent.updateMarketPredictionsExternal();
      } catch (error) {
        console.error('❌ Analytics periodic task error:', error);
      }
    }, 10 * 60 * 1000);

    // Betting agent processes pending operations every 2 minutes
    setInterval(async () => {
      try {
        await this.bettingAgent.run();
      } catch (error) {
        console.error('❌ Betting periodic task error:', error);
      }
    }, 2 * 60 * 1000);

    // Prediction market agent updates market states every 3 minutes
    setInterval(async () => {
      try {
        await this.predictionMarketAgent.run();
      } catch (error) {
        console.error('❌ Prediction market periodic task error:', error);
      }
    }, 3 * 60 * 1000);

    console.log('⏰ ADK periodic tasks started');
  }

  /**
   * Process a new Web3 event discovered by Oracle
   */
  async processNewEvent(eventData: any) {
    console.log('🔮 Processing new Web3 event:', eventData.title);
    
    try {
      // Create market from event
      const market = await this.predictionMarketAgent.createMarketExternal(eventData);
      
      // Analyze the new market
      await this.analyticsAgent.analyzeMarketExternal(market);
      
      console.log('✅ New event processed successfully');
      
    } catch (error) {
      console.error('❌ Failed to process new event:', error);
    }
  }

  /**
   * Process a user bet
   */
  async processBet(betData: any) {
    console.log('💰 Processing user bet:', betData.amount);
    
    try {
      const paymentId = await this.bettingAgent.processBetExternal(betData);
      console.log('✅ Bet processed, payment ID:', paymentId);
      return paymentId;
      
    } catch (error) {
      console.error('❌ Failed to process bet:', error);
      throw error;
    }
  }

  /**
   * Resolve an event and distribute payouts
   */
  async resolveEvent(resolutionData: any) {
    console.log('✅ Resolving event:', resolutionData.eventId);
    
    try {
      // Resolve the market
      await this.predictionMarketAgent.resolveMarketExternal(resolutionData);
      
      // Distribute payouts
      await this.bettingAgent.distributePayoutExternal(resolutionData);
      
      // Update analytics accuracy
      await this.analyticsAgent.handleMarketResolutionExternal(resolutionData);
      
      console.log('✅ Event resolved and payouts distributed');
      
    } catch (error) {
      console.error('❌ Failed to resolve event:', error);
    }
  }

  /**
   * Get system status and statistics
   */
  getSystemStatus() {
    const analyticsData = this.analyticsAgent.getDashboardData();
    const allMarkets = this.predictionMarketAgent.getAllMarkets();
    
    return {
      totalMarkets: allMarkets.length,
      activeMarkets: allMarkets.filter(m => !m.resolved).length,
      resolvedMarkets: allMarkets.filter(m => m.resolved).length,
      analytics: analyticsData,
      timestamp: new Date(),
    };
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    console.log('🛑 Stopping IQ Predict ADK Agent System...');
    // Add any cleanup logic here
    console.log('✅ ADK Agent system stopped');
  }
}

// Initialize and start the ADK system
const iqPredictADK = new IQPredictADKSystem();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await iqPredictADK.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await iqPredictADK.stop();
  process.exit(0);
});

// Start the ADK system
if (require.main === module) {
  iqPredictADK.start().catch(console.error);
}

export default iqPredictADK;
export { IQPredictADKSystem };
