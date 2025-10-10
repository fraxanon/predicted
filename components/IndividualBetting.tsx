'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserProfile } from '../hooks/useUserProfile';
import { X402Client, MockX402Client, X402Utils, PaymentRequest } from '../lib/x402-client';

interface Market {
  id: string;
  title: string;
  category: string;
  endDate: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  aiPrediction: 'yes' | 'no';
  confidence: number;
  isInvested?: boolean;
  investedAmount?: number;
}

interface IndividualBettingProps {
  market: Market;
  onBetPlaced?: (result: any) => void;
}

export function IndividualBetting({ market, onBetPlaced }: IndividualBettingProps) {
  const { address } = useAccount();
  const { profile } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [betAmount, setBetAmount] = useState(95);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no'>('yes');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate potential winnings based on current odds
  const calculateWinnings = (amount: number, side: 'yes' | 'no') => {
    const odds = side === 'yes' ? market.yesPrice / 100 : market.noPrice / 100;
    // Simplified calculation: if odds are 0.72 (72%), potential return is amount / odds
    return Math.round((amount / odds) - amount);
  };

  const potentialWinnings = calculateWinnings(betAmount, selectedSide);
  const totalReturn = betAmount + potentialWinnings;

  const handleBetSubmit = async () => {
    if (!address || isProcessing) return;

    setIsProcessing(true);
    try {
      // Initialize x402 client
      const x402Client = process.env.NODE_ENV === 'production' 
        ? new X402Client({
            apiKey: process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY || '',
            apiSecret: process.env.COINBASE_X402_SECRET || '',
            environment: 'production'
          })
        : new MockX402Client();

      // Create payment request
      const paymentRequest: PaymentRequest = {
        amount: X402Utils.formatUSDCAmount(betAmount),
        currency: 'USDC',
        recipient: X402Utils.generateMarketAddress(market.id),
        metadata: {
          marketId: market.id,
          prediction: selectedSide,
          userId: address,
          confidence: market.confidence
        }
      };

      const payment = await x402Client.createPayment(paymentRequest);
      
      if (onBetPlaced) {
        onBetPlaced({
          marketId: market.id,
          amount: betAmount,
          side: selectedSide,
          paymentId: payment.id,
          potentialWinnings,
          success: payment.status === 'completed'
        });
      }

      setIsOpen(false);
      setBetAmount(95);
    } catch (error) {
      console.error('Bet placement failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  if (market.isInvested) {
    // Grayed out card for already invested markets
    return (
      <div className="bg-black-900 border border-black-800 opacity-50 p-4 relative">
        <div className="absolute inset-0 bg-black-900 bg-opacity-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white font-medium mb-1">Already Invested</div>
            <div className="text-accent-500 text-sm">${market.investedAmount} via AI Agent</div>
          </div>
        </div>
        
        {/* Market Info (blurred) */}
        <div className="blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs px-2 py-1 bg-black-800 text-black-300 border border-black-700">
              {market.category}
            </span>
            <span className="text-xs text-black-500">{market.endDate}</span>
          </div>
          <h3 className="text-white font-medium mb-3 text-sm">{market.title}</h3>
          <div className="flex space-x-2">
            <div className="flex-1 p-2 bg-green-900 text-center">
              <div className="text-white text-sm">Yes {market.yesPrice}¢</div>
            </div>
            <div className="flex-1 p-2 bg-red-900 text-center">
              <div className="text-white text-sm">No {market.noPrice}¢</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Market Card */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-black-900 border border-black-800 hover:border-black-700 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs px-2 py-1 bg-black-800 text-black-300 border border-black-700">
            {market.category}
          </span>
          <span className="text-xs text-black-500">{market.endDate}</span>
        </div>

        <h3 className="text-white font-medium mb-3 text-sm leading-tight">
          {market.title}
        </h3>

        {/* AI Prediction */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-black-400">AI Prediction</span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 font-bold ${
                market.aiPrediction === 'yes' 
                  ? 'bg-green-900 text-green-400' 
                  : 'bg-red-900 text-red-400'
              }`}>
                {market.aiPrediction.toUpperCase()}
              </span>
              <span className="text-xs text-accent-500">
                {(market.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Betting Options */}
        <div className="flex space-x-2">
          <div className="flex-1 p-2 bg-green-900 hover:bg-green-800 transition-colors text-center">
            <div className="text-white text-sm font-medium">Yes {market.yesPrice}¢</div>
          </div>
          <div className="flex-1 p-2 bg-red-900 hover:bg-red-800 transition-colors text-center">
            <div className="text-white text-sm font-medium">No {market.noPrice}¢</div>
          </div>
        </div>

        <div className="mt-2 text-xs text-black-500 text-center">
          Click to bet • {market.volume} volume
        </div>
      </div>

      {/* Betting Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black-900 border border-black-800 max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Place Bet</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Market Title */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-2 leading-tight">{market.title}</h4>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-black-400">{market.category}</span>
                <span className="text-black-500">•</span>
                <span className="text-black-400">Ends {market.endDate}</span>
              </div>
            </div>

            {/* Bet Amount Input */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-black-400 text-lg">$</span>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Math.min(50000, Number(e.target.value))))}
                  className="flex-1 bg-black-800 border border-black-700 text-white px-4 py-3 text-2xl font-bold focus:outline-none focus:border-accent-500 transition-colors text-center"
                />
                <span className="text-black-400 text-lg">USDC</span>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[25, 50, 100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-3 py-1 text-sm border transition-colors ${
                      betAmount === amount
                        ? 'bg-accent-500 text-black-950 border-accent-500'
                        : 'bg-transparent text-black-300 border-black-700 hover:border-black-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Side Selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedSide('yes')}
                  className={`p-4 border transition-all ${
                    selectedSide === 'yes'
                      ? 'bg-green-900 border-green-700 text-white'
                      : 'border-black-700 text-black-300 hover:border-black-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold mb-1">Yes</div>
                    <div className="text-sm">{market.yesPrice}¢</div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedSide('no')}
                  className={`p-4 border transition-all ${
                    selectedSide === 'no'
                      ? 'bg-red-900 border-red-700 text-white'
                      : 'border-black-700 text-black-300 hover:border-black-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold mb-1">No</div>
                    <div className="text-sm">{market.noPrice}¢</div>
                  </div>
                </button>
              </div>

              {/* Winnings Calculation */}
              <div className="bg-black-800 border border-black-700 p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black-400">Potential Winnings:</span>
                  <span className="text-white font-bold">${potentialWinnings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black-400">Total Return:</span>
                  <span className="text-accent-500 font-bold text-lg">${totalReturn}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleBetSubmit}
              disabled={isProcessing || betAmount < 1}
              className={`w-full py-4 font-bold text-lg transition-colors ${
                selectedSide === 'yes'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:opacity-50`}
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                `Buy ${selectedSide === 'yes' ? 'Yes' : 'No'} - To win $${potentialWinnings}`
              )}
            </button>

            <div className="mt-3 text-xs text-black-500 text-center">
              Powered by x402 • Instant USDC settlement
            </div>
          </div>
        </div>
      )}
    </>
  );
}
