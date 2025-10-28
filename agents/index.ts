import { AgentSystem } from "../lib/mock-agents";
import { OracleAgent } from "./oracle/OracleAgent";
import { PredictionMarketAgent } from "./prediction/PredictionMarketAgent";
import { BettingAgent } from "./betting/BettingAgent";
import { AnalyticsAgent } from "./analytics/AnalyticsAgent";
import { IQPredictADKSystem } from "./index-adk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * IQ Predict Multi-Agent System (Legacy)
 * 
 * Orchestrates four specialized agents:
 * 1. Oracle Agent - Scrapes and validates Web3 news
 * 2. Prediction Market Agent - Creates and manages markets
 * 3. Betting Agent - Handles payments and payouts
 * 4. Analytics Agent - Provides AI predictions
 */
class IQPredictSystem {
  private agentSystem?: AgentSystem;
  private useADK: boolean;
  private adkSystem?: IQPredictADKSystem;

  constructor(useADK: boolean = true) {
    this.useADK = useADK;
    
    if (useADK) {
      // Use the new ADK system
      this.adkSystem = new IQPredictADKSystem();
    } else {
      // Legacy system is no longer supported since agents are converted to ADK
      console.warn('⚠️  Legacy system is deprecated. All agents now use ADK framework.');
      console.log('🔄 Falling back to ADK system...');
      this.useADK = true;
      this.adkSystem = new IQPredictADKSystem();
    }
  }

  /**
   * Set up inter-agent communication (legacy - no longer used)
   */
  private setupEventHandlers() {
    // This method is deprecated as all agents now use ADK
    console.log('⚠️  Legacy event handlers are deprecated');
  }

  /**
   * Start the agent system
   */
  async start() {
    if (this.adkSystem) {
      console.log('🚀 Starting IQ Predict ADK Agent System...');
      await this.adkSystem.start();
    } else {
      throw new Error('No agent system available');
    }
  }

  /**
   * Start periodic background tasks (legacy - now handled by ADK system)
   */
  private startPeriodicTasks() {
    console.log('⚠️  Legacy periodic tasks are deprecated - handled by ADK system');
  }

  /**
   * Graceful shutdown
   */
  async stop() {
    if (this.adkSystem) {
      await this.adkSystem.stop();
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    if (this.adkSystem) {
      return this.adkSystem.getSystemStatus();
    } else {
      return {
        system: 'error',
        message: 'No agent system available',
        timestamp: new Date(),
      };
    }
  }
}

// Initialize and start the system
// All agents now use ADK framework
const iqPredict = new IQPredictSystem(true);

console.log('🎆 Using ADK Agent System');

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
export { IQPredictSystem };
