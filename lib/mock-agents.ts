// Mock implementations for IQ ADK/ATP until actual packages are available

export class BaseAgent {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }

  protected emit(event: string, data?: any) {
    console.log(`[${this.name}] Emitting event: ${event}`, data);
  }

  protected async handleEvent(eventType: string, data: any) {
    console.log(`[${this.name}] Handling event: ${eventType}`, data);
  }

  async run() {
    console.log(`[${this.name}] Running...`);
  }
}

export class AgentSystem {
  private agents: BaseAgent[];
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(config: { agents: BaseAgent[]; config?: any }) {
    this.agents = config.agents;
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  emit(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  async start() {
    console.log('🚀 Starting mock agent system...');
    for (const agent of this.agents) {
      await agent.run();
    }
  }

  async stop() {
    console.log('🛑 Stopping mock agent system...');
  }
}

export class ATP {
  private config: any;

  constructor(config: { apiKey?: string }) {
    this.config = config;
  }

  async analyze(params: { prompt: string; model?: string; temperature?: number }) {
    // Mock AI response
    console.log('🧠 ATP Mock Analysis:', params.prompt.substring(0, 100) + '...');
    
    // Return mock responses based on prompt content
    if (params.prompt.includes('prediction-worthy')) {
      return {
        content: JSON.stringify({
          isPredictionWorthy: true,
          title: "Mock Web3 Event Prediction",
          description: "A mock prediction market event for testing",
          category: "launch",
          confidence: 0.8,
          resolutionCriteria: "Event completion by specified date",
          endDate: "2024-12-31T23:59:59Z"
        })
      };
    }

    if (params.prompt.includes('outcome')) {
      return {
        content: JSON.stringify({
          outcome: "yes",
          confidence: 0.75,
          evidence: "Mock evidence for testing"
        })
      };
    }

    return {
      content: JSON.stringify({
        prediction: "yes",
        confidence: 0.72,
        reasoning: "Mock AI reasoning for testing purposes",
        factors: ["Factor 1", "Factor 2", "Factor 3"],
        riskFactors: ["Risk 1", "Risk 2"],
        marketSentiment: "bullish"
      })
    };
  }
}

// Mock X402 for payments
export class X402 {
  private config: any;

  constructor(config: { apiKey?: string; secret?: string; environment?: string }) {
    this.config = config;
  }

  async createPaymentRequest(params: any) {
    console.log('💳 X402 Mock Payment Request:', params);
    return {
      id: `payment-${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      status: 'pending'
    };
  }
}
