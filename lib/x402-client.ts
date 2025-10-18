/**
 * x402 Integration for Coinbase CDP
 * Handles automated payments for prediction market investments
 */

export interface X402Config {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
}

export interface PaymentRequest {
  amount: string; // Amount in USDC
  currency: string; // 'USDC'
  recipient: string; // Market contract address
  metadata?: {
    marketId: string;
    prediction: 'yes' | 'no';
    userId: string;
    confidence: number;
  };
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
  amount: string;
  currency: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export class X402Client {
  private config: X402Config;
  private baseUrl: string;

  constructor(config: X402Config) {
    this.config = config;
    this.baseUrl = config.baseUrl || 
      (config.environment === 'production' 
        ? 'https://api.coinbase.com/x402' 
        : 'https://api.sandbox.coinbase.com/x402');
  }

  /**
   * Create a payment for a prediction market bet
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.makeRequest('POST', '/payments', {
        amount: request.amount,
        currency: request.currency,
        recipient: request.recipient,
        metadata: request.metadata
      });

      return response as PaymentResponse;
    } catch (error) {
      console.error('x402 payment creation failed:', error);
      throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await this.makeRequest('GET', `/payments/${paymentId}`);
      return response as PaymentResponse;
    } catch (error) {
      console.error('x402 payment status check failed:', error);
      throw new Error(`Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create multiple payments (batch processing)
   */
  async createBatchPayments(requests: PaymentRequest[]): Promise<PaymentResponse[]> {
    try {
      const response = await this.makeRequest('POST', '/payments/batch', {
        payments: requests
      });

      return response.payments as PaymentResponse[];
    } catch (error) {
      console.error('x402 batch payments failed:', error);
      throw new Error(`Batch payments failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await this.makeRequest('DELETE', `/payments/${paymentId}`);
      return true;
    } catch (error) {
      console.error('x402 payment cancellation failed:', error);
      return false;
    }
  }

  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: string, limit: number = 50): Promise<PaymentResponse[]> {
    try {
      const response = await this.makeRequest('GET', `/payments?userId=${userId}&limit=${limit}`);
      return response.payments as PaymentResponse[];
    } catch (error) {
      console.error('x402 payment history failed:', error);
      throw new Error(`Payment history failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Make authenticated request to x402 API
   */
  protected async makeRequest(method: string, endpoint: string, body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Create signature for authentication
    const message = timestamp + method + endpoint + (body ? JSON.stringify(body) : '');
    const signature = await this.createSignature(message);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'CB-ACCESS-KEY': this.config.apiKey,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-VERSION': '2024-01-01'
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create HMAC signature for authentication
   */
  private async createSignature(message: string): Promise<string> {
    // In a real implementation, you'd use crypto.subtle or a crypto library
    // For now, we'll use a placeholder that works with the Web Crypto API
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Browser environment
      const encoder = new TextEncoder();
      const keyData = encoder.encode(this.config.apiSecret);
      const messageData = encoder.encode(message);
      
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      // Node.js environment - would use crypto module
      // For demo purposes, return a mock signature
      console.warn('Using mock signature - implement proper HMAC-SHA256 for production');
      return 'mock_signature_' + Date.now();
    }
  }
}

/**
 * Utility functions for x402 integration
 */
export class X402Utils {
  /**
   * Convert investment amount to USDC format
   */
  static formatUSDCAmount(amount: number): string {
    return (amount * 1000000).toString(); // USDC has 6 decimals
  }

  /**
   * Convert USDC amount back to display format
   */
  static parseUSDCAmount(amount: string): number {
    return parseInt(amount) / 1000000;
  }

  /**
   * Generate market contract address (mock for demo)
   */
  static generateMarketAddress(marketId: string): string {
    // In production, this would be the actual smart contract address
    return `0x${marketId.padEnd(40, '0')}`;
  }

  /**
   * Validate payment request
   */
  static validatePaymentRequest(request: PaymentRequest): boolean {
    if (!request.amount || parseFloat(request.amount) <= 0) return false;
    if (!request.currency || request.currency !== 'USDC') return false;
    if (!request.recipient || !request.recipient.startsWith('0x')) return false;
    return true;
  }
}

/**
 * Mock x402 client for development/testing
 */
export class MockX402Client extends X402Client {
  constructor() {
    super({
      apiKey: 'mock_key',
      apiSecret: 'mock_secret',
      environment: 'sandbox'
    });
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock 95% success rate
    const success = Math.random() > 0.05;
    
    if (!success) {
      throw new Error('Mock payment failed - insufficient funds');
    }

    return {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      amount: request.amount,
      currency: request.currency,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    return {
      id: paymentId,
      status: 'completed',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      amount: '100000000', // 100 USDC
      currency: 'USDC',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
  }

  async createBatchPayments(requests: PaymentRequest[]): Promise<PaymentResponse[]> {
    const results = [];
    
    for (const request of requests) {
      try {
        const payment = await this.createPayment(request);
        results.push(payment);
      } catch (error) {
        results.push({
          id: `pay_failed_${Date.now()}`,
          status: 'failed' as const,
          amount: request.amount,
          currency: request.currency,
          createdAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }
}
