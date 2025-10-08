import { AgentSystem } from "../lib/mock-agents";
import { OracleAgent } from "./oracle/OracleAgent";
import { PredictionMarketAgent } from "./prediction/PredictionMarketAgent";
import { BettingAgent } from "./betting/BettingAgent";
import { AnalyticsAgent } from "./analytics/AnalyticsAgent";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * IQ Predict Multi-Agent System
 * 
 * Orchestrates four specialized agents:
 * 1. Oracle Agent - Scrapes and validates Web3 news
 * 2. Prediction Market Agent - Creates and manages markets
 * 3. Betting Agent - Handles payments and payouts
 * 4. Analytics Agent - Provides AI predictions
 */
class IQPredictSystem {
  private agentSystem: AgentSystem;

  constructor() {
    // Initialize the multi-agent system
    this.agentSystem = new AgentSystem({
      agents: [
        new OracleAgent(),
        new PredictionMarketAgent(),
        new BettingAgent(),
        new AnalyticsAgent(),
      ],
      config: {
        apiKey: process.env.IQ_ADK_API_KEY,
        environment: process.env.NODE_ENV || 'development',
      }
    });

    this.setupEventHandlers();
  }

  /**
   * Set up inter-agent communication
   */
  private setupEventHandlers() {
    // Oracle Agent → Prediction Market Agent
    this.agentSystem.on('newWeb3Event', (eventData) => {
      console.log('🔮 New Web3 event detected:', eventData.title);
      this.agentSystem.emit('createMarket', eventData);
    });

    // Prediction Market Agent → Analytics Agent
    this.agentSystem.on('marketCreated', (marketData) => {
      console.log('📊 New market created:', marketData.id);
      this.agentSystem.emit('analyzeMarket', marketData);
    });

    // User bet → Betting Agent
    this.agentSystem.on('userBet', (betData) => {
      console.log('💰 New bet placed:', betData.amount);
      this.agentSystem.emit('processBet', betData);
    });

    // Oracle resolution → Betting Agent
    this.agentSystem.on('eventResolved', (resolutionData) => {
      console.log('✅ Event resolved:', resolutionData.outcome);
      this.agentSystem.emit('distributePayout', resolutionData);
    });
  }

  /**
   * Start the agent system
   */
  async start() {
    console.log('🚀 Starting IQ Predict Agent System...');
    
    try {
      await this.agentSystem.start();
      console.log('✅ All agents initialized successfully');
      
      // Start periodic tasks
      this.startPeriodicTasks();
      
    } catch (error) {
      console.error('❌ Failed to start agent system:', error);
      process.exit(1);
    }
  }

  /**
   * Start periodic background tasks
   */
  private startPeriodicTasks() {
    // Oracle checks for new events every 5 minutes
    setInterval(() => {
      this.agentSystem.emit('checkForEvents');
    }, 5 * 60 * 1000);

    // Analytics updates predictions every 10 minutes
    setInterval(() => {
      this.agentSystem.emit('updatePredictions');
    }, 10 * 60 * 1000);

    console.log('⏰ Periodic tasks started');
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    console.log('🛑 Stopping IQ Predict Agent System...');
    await this.agentSystem.stop();
    console.log('✅ Agent system stopped');
  }
}

// Initialize and start the system
const iqPredict = new IQPredictSystem();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await iqPredict.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await iqPredict.stop();
  process.exit(0);
});

// Start the system
iqPredict.start().catch(console.error);

export default iqPredict;
