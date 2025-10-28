import { OracleAgent } from "./oracle/OracleAgent";
import { PredictionMarketAgent } from "./prediction/PredictionMarketAgent";
import { BettingAgent } from "./betting/BettingAgent";
import { AnalyticsAgent } from "./analytics/AnalyticsAgent";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * IQ Predict Multi-Agent System - ADK Powered
 * 
 * Orchestrates four specialized ADK agents:
 * 1. Oracle Agent - Scrapes and validates Web3 news
 * 2. Prediction Market Agent - Creates and manages markets
 * 3. Betting Agent - Handles payments and payouts
 * 4. Analytics Agent - Provides AI predictions
 */
class IQPredictADKSystem {
  private oracleAgent: OracleAgent;
  private predictionAgent: PredictionMarketAgent;
  private bettingAgent: BettingAgent;
  private analyticsAgent: AnalyticsAgent;

  constructor() {
    // Initialize ADK-based agents
    this.oracleAgent = new OracleAgent();
    this.predictionAgent = new PredictionMarketAgent();
    this.bettingAgent = new BettingAgent();
    this.analyticsAgent = new AnalyticsAgent();
  }

  /**
   * Initialize all ADK agents
   */
  async initializeAgents() {
    console.log('🤖 Initializing ADK agents...');
    
    try {
      const oracleResult = await this.oracleAgent.initialize();
      console.log('✅ Oracle Agent initialized:', oracleResult.agent.name);
      
      const predictionResult = await this.predictionAgent.initialize();
      console.log('✅ Prediction Market Agent initialized:', predictionResult.agent.name);
      
      const bettingResult = await this.bettingAgent.initialize();
      console.log('✅ Betting Agent initialized:', bettingResult.agent.name);
      
      const analyticsResult = await this.analyticsAgent.initialize();
      console.log('✅ Analytics Agent initialized:', analyticsResult.agent.name);
      
      return {
        oracle: oracleResult,
        prediction: predictionResult,
        betting: bettingResult,
        analytics: analyticsResult
      };
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
      // Initialize all agents
      const agents = await this.initializeAgents();
      console.log('✅ All ADK agents initialized successfully');
      
      // Start periodic tasks
      this.startPeriodicTasks();
      
      return agents;
      
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
        console.log('🔍 Running periodic Oracle check...');
        await this.oracleAgent.run();
      } catch (error) {
        console.error('❌ Oracle periodic task failed:', error);
      }
    }, 5 * 60 * 1000);

    // Prediction Market Agent updates every 10 minutes
    setInterval(async () => {
      try {
        console.log('📊 Running periodic Prediction Market update...');
        await this.predictionAgent.run();
      } catch (error) {
        console.error('❌ Prediction Market periodic task failed:', error);
      }
    }, 10 * 60 * 1000);

    // Betting Agent processes every 2 minutes
    setInterval(async () => {
      try {
        console.log('💰 Running periodic Betting Agent update...');
        await this.bettingAgent.run();
      } catch (error) {
        console.error('❌ Betting Agent periodic task failed:', error);
      }
    }, 2 * 60 * 1000);

    // Analytics Agent updates every 15 minutes
    setInterval(async () => {
      try {
        console.log('📈 Running periodic Analytics update...');
        await this.analyticsAgent.run();
      } catch (error) {
        console.error('❌ Analytics periodic task failed:', error);
      }
    }, 15 * 60 * 1000);

    console.log('⏰ Periodic tasks started');
  }

  /**
   * Simulate inter-agent communication
   */
  async simulateWorkflow() {
    console.log('🎭 Running agent workflow simulation...');
    
    try {
      // 1. Oracle discovers events
      console.log('1️⃣ Oracle checking for events...');
      await this.oracleAgent.checkForEventsFromRequest();
      
      // 2. Create a mock market
      console.log('2️⃣ Creating prediction market...');
      const mockEvent = {
        id: 'event-demo',
        title: 'Will Ethereum reach $5000 by end of 2024?',
        description: 'Prediction market for ETH price target',
        source: 'demo-source',
        url: 'https://example.com/demo-event',
        timestamp: new Date(),
        category: 'defi' as const,
        confidence: 0.85,
        resolutionCriteria: 'ETH price on major exchanges',
        endDate: new Date('2024-12-31')
      };
      
      const market = await this.predictionAgent.createMarketFromEvent(mockEvent);
      console.log('✅ Market created:', market.id);
      
      // 3. Analytics analyzes the market
      console.log('3️⃣ Analytics analyzing market...');
      await this.analyticsAgent.analyzeMarketFromEvent(market);
      
      // 4. Simulate a bet
      console.log('4️⃣ Processing demo bet...');
      const mockBet = {
        userId: 'user-demo',
        marketId: market.id,
        position: 'yes' as const,
        amount: '100'
      };
      
      await this.bettingAgent.processBetFromEvent(mockBet);
      
      console.log('✅ Workflow simulation completed');
      
    } catch (error) {
      console.error('❌ Workflow simulation failed:', error);
    }
  }

  /**
   * Get agent instances for external use
   */
  getAgents() {
    return {
      oracle: this.oracleAgent,
      prediction: this.predictionAgent,
      betting: this.bettingAgent,
      analytics: this.analyticsAgent
    };
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    console.log('🛑 Stopping IQ Predict ADK Agent System...');
    // ADK agents don't need explicit cleanup in this implementation
    console.log('✅ ADK Agent system stopped');
  }
}

// Initialize and start the system
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

// Start the system if this file is run directly
if (require.main === module) {
  iqPredictADK.start()
    .then(async () => {
      // Run a demo workflow after 5 seconds
      setTimeout(async () => {
        await iqPredictADK.simulateWorkflow();
      }, 5000);
    })
    .catch(console.error);
}

export default iqPredictADK;
export { IQPredictADKSystem };
