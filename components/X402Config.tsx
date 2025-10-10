'use client';

import { useState, useEffect } from 'react';
import { X402Client, MockX402Client } from '../lib/x402-client';

interface X402ConfigProps {
  onConfigUpdate?: (isConfigured: boolean) => void;
}

export function X402Config({ onConfigUpdate }: X402ConfigProps) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [usingMockClient, setUsingMockClient] = useState(true);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    const hasApiKey = !!process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY;
    const hasSecret = !!process.env.COINBASE_X402_SECRET;
    const configured = hasApiKey && hasSecret;
    
    setIsConfigured(configured);
    setUsingMockClient(!configured || process.env.NODE_ENV !== 'production');
    
    if (onConfigUpdate) {
      onConfigUpdate(configured);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage('');

    try {
      const client = usingMockClient 
        ? new MockX402Client()
        : new X402Client({
            apiKey: process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY || '',
            apiSecret: process.env.COINBASE_X402_SECRET || '',
            environment: 'sandbox'
          });

      // Test with a small mock payment
      const testPayment = await client.createPayment({
        amount: '1000000', // $1 USDC
        currency: 'USDC',
        recipient: '0x0000000000000000000000000000000000000001',
        metadata: {
          marketId: 'test-market',
          prediction: 'yes',
          userId: 'test-user',
          confidence: 1.0
        }
      });

      if (testPayment.id) {
        setConnectionStatus('success');
      } else {
        throw new Error('Invalid response from x402 API');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="bg-black-900 border border-black-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">x402 Payment Configuration</h3>
        <div className={`px-2 py-1 text-xs ${
          isConfigured 
            ? 'bg-green-900 text-green-400' 
            : 'bg-yellow-900 text-yellow-400'
        }`}>
          {isConfigured ? 'Configured' : 'Not Configured'}
        </div>
      </div>

      <div className="space-y-4">
        {/* Configuration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-black-400">Environment:</span>
            <div className="text-white">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </div>
          </div>
          <div>
            <span className="text-black-400">Client Type:</span>
            <div className="text-white">
              {usingMockClient ? 'Mock Client (Testing)' : 'Real x402 Client'}
            </div>
          </div>
          <div>
            <span className="text-black-400">API Key:</span>
            <div className="text-white">
              {process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY 
                ? `${process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY.substring(0, 8)}...` 
                : 'Not Set'
              }
            </div>
          </div>
          <div>
            <span className="text-black-400">Secret:</span>
            <div className="text-white">
              {process.env.COINBASE_X402_SECRET ? '••••••••' : 'Not Set'}
            </div>
          </div>
        </div>

        {/* Connection Test */}
        <div className="border-t border-black-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Connection Test</span>
            <button
              onClick={testConnection}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 text-sm"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {connectionStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <span>✓</span>
              <span>Connection successful! x402 is ready for payments.</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <span>✗</span>
                <span>Connection failed</span>
              </div>
              {errorMessage && (
                <div className="text-red-400 text-xs bg-red-900 bg-opacity-20 p-2 border border-red-800">
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        {!isConfigured && (
          <div className="border-t border-black-800 pt-4">
            <h4 className="text-white font-medium mb-2">Setup Instructions</h4>
            <div className="text-sm text-black-300 space-y-2">
              <p>1. Sign up for Coinbase Developer Platform at developers.coinbase.com</p>
              <p>2. Create x402 API credentials in your CDP dashboard</p>
              <p>3. Add the following to your .env.local file:</p>
              <div className="bg-black-800 border border-black-700 p-3 mt-2 font-mono text-xs">
                <div>NEXT_PUBLIC_COINBASE_X402_API_KEY=your_api_key</div>
                <div>COINBASE_X402_SECRET=your_secret_key</div>
              </div>
              <p>4. Restart your development server</p>
              <p>5. Test the connection using the button above</p>
            </div>
          </div>
        )}

        {/* Current Mode Info */}
        <div className="border-t border-black-800 pt-4">
          <div className="bg-black-800 border border-black-700 p-3">
            <h4 className="text-white font-medium mb-2">Current Mode</h4>
            <div className="text-sm text-black-300">
              {usingMockClient ? (
                <div>
                  <p className="text-yellow-400 mb-2">🧪 Using Mock Client</p>
                  <p>All payments are simulated. No real transactions will be processed.</p>
                  <p>Perfect for development and testing the user interface.</p>
                </div>
              ) : (
                <div>
                  <p className="text-green-400 mb-2">🚀 Using Real x402 Client</p>
                  <p>Connected to Coinbase x402 API. Real payments will be processed.</p>
                  <p>Ensure you're using the correct environment (sandbox/production).</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
