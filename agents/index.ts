// Re-export the new ADK-based system
export { default as IQPredictADK, IQPredictADKSystem } from './index-adk';

// For backward compatibility, also export the old mock system
import { AgentSystem } from "../lib/mock-agents";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * IQ Predict Multi-Agent System (Legacy Mock Version)
 * 
 * This is kept for backward compatibility.
 * Use IQPredictADKSystem for the full ADK implementation.
 */
class IQPredictLegacySystem {
  private agentSystem: AgentSystem;

  constructor() {
    // Initialize the mock agent system (legacy)
    this.agentSystem = new AgentSystem({
      agents: [],
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
    this.agentSystem.on('newWeb3Event', (eventData: any) => {
      console.log('🔮 New Web3 event detected:', eventData.title);
      this.agentSystem.emit('createMarket', eventData);
    });

    // Prediction Market Agent → Analytics Agent
    this.agentSystem.on('marketCreated', (marketData: any) => {
      console.log('📊 New market created:', marketData.id);
      this.agentSystem.emit('analyzeMarket', marketData);
    });

    // User bet → Betting Agent
    this.agentSystem.on('userBet', (betData: any) => {
      console.log('💰 New bet placed:', betData.amount);
      this.agentSystem.emit('processBet', betData);
    });

    // Oracle resolution → Betting Agent
    this.agentSystem.on('eventResolved', (resolutionData: any) => {
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

// Initialize and start the legacy system
const iqPredictLegacy = new IQPredictLegacySystem();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await iqPredictLegacy.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await iqPredictLegacy.stop();
  process.exit(0);
});

// Start the legacy system only if this file is run directly
if (require.main === module) {
  iqPredictLegacy.start().catch(console.error);
}

export default iqPredictLegacy;
export { IQPredictLegacySystem };
