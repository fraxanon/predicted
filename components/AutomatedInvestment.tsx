'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserProfile } from '../hooks/useUserProfile';
import { X402Client, MockX402Client, X402Utils, PaymentRequest } from '../lib/x402-client';

interface InvestmentRecommendation {
  marketId: string;
  title: string;
  category: string;
  aiPrediction: 'yes' | 'no';
  confidence: number;
  recommendedAmount: number;
  potentialReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string;
  currentOdds: { yes: number; no: number };
  timeToExpiry: string;
}

interface AutomatedInvestmentProps {
  totalBudget: number;
  onInvestmentComplete: (results: any) => void;
}

export function AutomatedInvestment({ totalBudget, onInvestmentComplete }: AutomatedInvestmentProps) {
  const { address } = useAccount();
  const { profile, recommendations } = useUserProfile();
  const [investmentPlan, setInvestmentPlan] = useState<InvestmentRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentResults, setInvestmentResults] = useState<any[]>([]);

  useEffect(() => {
    if (profile && recommendations.length > 0) {
      generateInvestmentPlan();
    }
  }, [profile, recommendations, totalBudget]);

  const generateInvestmentPlan = async () => {
    setIsAnalyzing(true);
    
    try {
      // Call agent API to generate optimized investment plan
      const response = await fetch('/api/agents/investment-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          totalBudget,
          recommendations,
          address
        })
      });

      if (response.ok) {
        const plan = await response.json();
        setInvestmentPlan(plan.investments || []);
      } else {
        // Fallback to local calculation
        const plan = calculateOptimalInvestmentPlan();
        setInvestmentPlan(plan);
      }
    } catch (error) {
      console.error('Failed to generate investment plan:', error);
      const plan = calculateOptimalInvestmentPlan();
      setInvestmentPlan(plan);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateOptimalInvestmentPlan = (): InvestmentRecommendation[] => {
    if (!profile || recommendations.length === 0) return [];

    // Sort recommendations by match score and confidence
    const sortedRecs = [...recommendations]
      .sort((a, b) => (b.matchScore * b.confidence) - (a.matchScore * a.confidence))
      .slice(0, 6); // Top 6 investments

    let remainingBudget = totalBudget;
    const plan: InvestmentRecommendation[] = [];

    // Risk-based allocation
    const riskAllocation = {
      conservative: { low: 0.6, medium: 0.3, high: 0.1 },
      moderate: { low: 0.4, medium: 0.4, high: 0.2 },
      aggressive: { low: 0.2, medium: 0.3, high: 0.5 }
    };

    const allocation = riskAllocation[profile.riskTolerance];

    // Group by risk level
    const byRisk = {
      low: sortedRecs.filter(r => r.riskLevel === 'low'),
      medium: sortedRecs.filter(r => r.riskLevel === 'medium'),
      high: sortedRecs.filter(r => r.riskLevel === 'high')
    };

    // Allocate budget based on risk tolerance
    ['low', 'medium', 'high'].forEach(risk => {
      const riskBudget = totalBudget * allocation[risk as keyof typeof allocation];
      const riskMarkets = byRisk[risk as keyof typeof byRisk];
      
      if (riskMarkets.length > 0 && riskBudget > 0) {
        const amountPerMarket = riskBudget / Math.min(riskMarkets.length, 3); // Max 3 per risk level
        
        riskMarkets.slice(0, 3).forEach(rec => {
          if (remainingBudget >= 10) { // Minimum $10 investment
            const amount = Math.min(amountPerMarket, remainingBudget);
            
            plan.push({
              marketId: rec.marketId,
              title: rec.title,
              category: rec.category,
              aiPrediction: rec.aiPrediction,
              confidence: rec.confidence,
              recommendedAmount: Math.floor(amount),
              potentialReturn: rec.potentialReturn,
              riskLevel: rec.riskLevel,
              reasoning: rec.reasoning,
              currentOdds: rec.currentOdds || { yes: 0.5, no: 0.5 },
              timeToExpiry: rec.endDate || '30 days'
            });
            
            remainingBudget -= amount;
          }
        });
      }
    });

    return plan;
  };

  const executeInvestments = async () => {
    if (!address || investmentPlan.length === 0) return;

    setIsInvesting(true);
    const results = [];

    try {
      for (const investment of investmentPlan) {
        try {
          // Simulate x402 payment processing
          const result = await processX402Payment(investment);
          results.push(result);
          
          // Add delay between investments for better UX
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to invest in ${investment.marketId}:`, error);
          results.push({
            marketId: investment.marketId,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            amount: investment.recommendedAmount
          });
        }
      }

      setInvestmentResults(results);
      onInvestmentComplete(results);
    } catch (error) {
      console.error('Investment execution failed:', error);
    } finally {
      setIsInvesting(false);
    }
  };

  const processX402Payment = async (investment: InvestmentRecommendation) => {
    // Initialize x402 client (use mock for development, real for production)
    const x402Client = process.env.NODE_ENV === 'production' 
      ? new X402Client({
          apiKey: process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY || '',
          apiSecret: process.env.COINBASE_X402_SECRET || '',
          environment: 'production'
        })
      : new MockX402Client();

    // Create payment request
    const paymentRequest: PaymentRequest = {
      amount: X402Utils.formatUSDCAmount(investment.recommendedAmount),
      currency: 'USDC',
      recipient: X402Utils.generateMarketAddress(investment.marketId),
      metadata: {
        marketId: investment.marketId,
        prediction: investment.aiPrediction,
        userId: address || 'unknown',
        confidence: investment.confidence
      }
    };

    // Validate payment request
    if (!X402Utils.validatePaymentRequest(paymentRequest)) {
      throw new Error('Invalid payment request');
    }

    try {
      // Create payment via x402
      const paymentResponse = await x402Client.createPayment(paymentRequest);
      
      // Wait for payment completion if pending
      if (paymentResponse.status === 'pending') {
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max wait
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await x402Client.getPaymentStatus(paymentResponse.id);
          
          if (status.status === 'completed') {
            return {
              marketId: investment.marketId,
              amount: investment.recommendedAmount,
              prediction: investment.aiPrediction,
              txHash: status.transactionHash || paymentResponse.id,
              timestamp: status.completedAt || new Date().toISOString(),
              success: true,
              paymentId: paymentResponse.id
            };
          } else if (status.status === 'failed') {
            throw new Error(status.error || 'Payment failed');
          }
          
          attempts++;
        }
        
        throw new Error('Payment timeout - please check status manually');
      } else if (paymentResponse.status === 'completed') {
        return {
          marketId: investment.marketId,
          amount: investment.recommendedAmount,
          prediction: investment.aiPrediction,
          txHash: paymentResponse.transactionHash || paymentResponse.id,
          timestamp: paymentResponse.completedAt || new Date().toISOString(),
          success: true,
          paymentId: paymentResponse.id
        };
      } else {
        throw new Error(paymentResponse.error || 'Payment failed');
      }
    } catch (error) {
      console.error('x402 payment failed:', error);
      throw error;
    }
  };

  const totalInvestmentAmount = investmentPlan.reduce((sum, inv) => sum + inv.recommendedAmount, 0);
  const expectedReturn = investmentPlan.reduce((sum, inv) => 
    sum + (inv.recommendedAmount * inv.potentialReturn * inv.confidence), 0
  );

  if (isAnalyzing) {
    return (
      <div className="bg-black-900 border border-black-800 p-8">
        <div className="text-center">
          <div className="w-8 h-8 bg-accent-500 animate-pulse mx-auto mb-4"></div>
          <h3 className="text-white font-semibold mb-2">🤖 AI Analyzing Markets</h3>
          <p className="text-black-300">
            Our agents are calculating the optimal investment strategy based on your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Investment Summary */}
      <div className="bg-black-900 border border-black-800 p-6">
        <h3 className="text-white font-semibold mb-4">🎯 AI Investment Plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">${totalInvestmentAmount}</div>
            <div className="text-xs text-black-400">Total Investment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-500">${expectedReturn.toFixed(0)}</div>
            <div className="text-xs text-black-400">Expected Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{investmentPlan.length}</div>
            <div className="text-xs text-black-400">Markets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {((expectedReturn / totalInvestmentAmount) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-black-400">ROI Potential</div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div className="space-y-3">
          {investmentPlan.map((investment, index) => (
            <div key={investment.marketId} className="bg-black-800 border border-black-700 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1">{investment.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-black-400">
                    <span className="capitalize">{investment.category}</span>
                    <span className={`px-2 py-1 ${
                      investment.riskLevel === 'low' ? 'bg-green-900 text-green-400' :
                      investment.riskLevel === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                      'bg-red-900 text-red-400'
                    }`}>
                      {investment.riskLevel} risk
                    </span>
                    <span className={`px-2 py-1 font-bold ${
                      investment.aiPrediction === 'yes' 
                        ? 'bg-green-900 text-green-400' 
                        : 'bg-red-900 text-red-400'
                    }`}>
                      AI: {investment.aiPrediction.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${investment.recommendedAmount}</div>
                  <div className="text-xs text-accent-500">
                    {(investment.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
              <p className="text-xs text-black-400 leading-relaxed">{investment.reasoning}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-black-800">
          <div className="text-xs text-black-500">
            Investments will be executed automatically using x402 payments
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generateInvestmentPlan}
              className="px-4 py-2 border border-black-700 text-white hover:border-black-600 transition-colors text-sm"
            >
              Regenerate Plan
            </button>
            <button
              onClick={executeInvestments}
              disabled={isInvesting || investmentPlan.length === 0}
              className="px-6 py-2 bg-accent-500 text-black-950 font-medium hover:bg-accent-600 transition-colors disabled:opacity-50 text-sm"
            >
              {isInvesting ? 'Investing...' : 'Execute Investments'}
            </button>
          </div>
        </div>
      </div>

      {/* Investment Progress */}
      {isInvesting && (
        <div className="bg-black-900 border border-black-800 p-6">
          <h3 className="text-white font-semibold mb-4">💳 Processing Investments</h3>
          <div className="space-y-3">
            {investmentPlan.map((investment, index) => (
              <div key={investment.marketId} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-accent-500 animate-pulse"></div>
                <span className="text-white text-sm">{investment.title}</span>
                <span className="text-accent-500 text-sm">${investment.recommendedAmount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Results */}
      {investmentResults.length > 0 && (
        <div className="bg-black-900 border border-black-800 p-6">
          <h3 className="text-white font-semibold mb-4">✅ Investment Results</h3>
          <div className="space-y-3">
            {investmentResults.map((result, index) => (
              <div key={result.marketId} className="flex items-center justify-between p-3 bg-black-800 border border-black-700">
                <span className="text-white text-sm">Market {result.marketId}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white">${result.amount}</span>
                  {result.success ? (
                    <span className="text-green-400">✓ Success</span>
                  ) : (
                    <span className="text-red-400">✗ Failed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
