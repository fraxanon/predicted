'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface X402BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: {
    id: string;
    title: string;
    category: string;
    endDate: string;
    yesPrice: number;
    noPrice: number;
    volume: string;
  };
  prediction: 'yes' | 'no';
  onBetPlaced: (result: any) => void;
}

export function X402BettingModal({ isOpen, onClose, market, prediction, onBetPlaced }: X402BettingModalProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState(95);
  const [currency, setCurrency] = useState<'USDC' | 'frxUSD'>('USDC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [x402Enabled, setX402Enabled] = useState(true);

  useEffect(() => {
    // Load user's X402 preferences
    if (address) {
      const saved = localStorage.getItem(`agent-preferences-${address}`);
      if (saved) {
        try {
          const preferences = JSON.parse(saved);
          setX402Enabled(preferences.x402AgentEnabled !== false);
          setCurrency(preferences.preferredCurrency || 'USDC');
        } catch (error) {
          console.error('Failed to load preferences:', error);
        }
      }
    }
  }, [address]);

  const price = prediction === 'yes' ? market.yesPrice : market.noPrice;
  const potentialWinnings = Math.round((amount / price) * 100);
  const totalReturn = potentialWinnings;
  
  // frxUSD bonus calculation
  const frxUSDBonus = currency === 'frxUSD' ? Math.round(potentialWinnings * 0.1) : 0;
  const finalReturn = totalReturn + frxUSDBonus;

  const handleX402Payment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate X402 payment flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        success: true,
        transactionId: `x402_${Date.now()}`,
        amount,
        currency,
        prediction,
        marketId: market.id,
        potentialWinnings: finalReturn,
        frxUSDBonus,
        timestamp: new Date().toISOString()
      };
      
      onBetPlaced(result);
      onClose();
    } catch (error) {
      console.error('X402 payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-black-900 border border-black-800 max-w-md w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-black-800 p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-white">Place X402 Bet</h2>
          <button
            onClick={onClose}
            className="text-black-400 hover:text-white transition-colors text-lg md:text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Market Info */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs px-2 py-1 bg-black-800 text-black-300 border border-black-700">
                {market.category}
              </span>
              <span className="text-xs text-black-500">{market.endDate}</span>
            </div>
            <h4 className="text-white font-medium text-sm leading-tight">{market.title}</h4>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Bet Amount
            </label>
            <div className="flex space-x-2 mb-3">
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-black-400 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 bg-black-800 border border-black-700 text-white px-3 py-3 text-lg font-bold focus:outline-none focus:border-accent-500 transition-colors text-center"
                />
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USDC' | 'frxUSD')}
                className="bg-black-800 border border-black-700 text-white px-3 py-3 focus:outline-none focus:border-accent-500 transition-colors"
              >
                <option value="USDC">USDC</option>
                <option value="frxUSD">frxUSD</option>
              </select>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2">
              {[25, 50, 100, 250, 500, 1000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    amount === quickAmount
                      ? 'bg-accent-500 text-black-950 border-accent-500'
                      : 'bg-transparent text-black-300 border-black-700 hover:border-black-600'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`p-4 border text-center transition-all ${
                prediction === 'yes'
                  ? 'bg-green-600 text-white border-green-500'
                  : 'bg-black-800 text-black-400 border-black-700'
              }`}
            >
              <div className="font-bold">Yes</div>
              <div className="text-sm">{market.yesPrice}¢</div>
            </button>
            <button
              className={`p-4 border text-center transition-all ${
                prediction === 'no'
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-black-800 text-black-400 border-black-700'
              }`}
            >
              <div className="font-bold">No</div>
              <div className="text-sm">{market.noPrice}¢</div>
            </button>
          </div>

          {/* Potential Returns */}
          <div className="bg-black-800 border border-black-700 p-4">
            <h4 className="text-white font-medium mb-3">Potential Returns</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black-400">Base Winnings:</span>
                <span className="text-white">${potentialWinnings}</span>
              </div>
              {frxUSDBonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-400">frxUSD Bonus (10%):</span>
                  <span className="text-green-400">+${frxUSDBonus}</span>
                </div>
              )}
              <div className="border-t border-black-600 pt-2 flex justify-between font-bold">
                <span className="text-white">Total Return:</span>
                <span className="text-accent-500">${finalReturn}</span>
              </div>
            </div>
          </div>

          {/* frxUSD Bonus Info */}
          {currency === 'frxUSD' && (
            <div className="bg-green-900 bg-opacity-20 border border-green-800 p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-400">🎉</span>
                <span className="text-green-400 font-medium text-sm">frxUSD Bonus Active!</span>
              </div>
              <p className="text-green-300 text-xs">
                You'll earn an extra 10% bonus on your winnings for using frxUSD!
              </p>
            </div>
          )}

          {/* X402 Payment Method */}
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-yellow-400">⚡</span>
              <span className="text-yellow-400 font-medium text-sm">X402 Instant Payment</span>
            </div>
            <p className="text-yellow-300 text-xs">
              Your bet will be processed instantly using X402 protocol - no wallet confirmations needed!
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleX402Payment}
            disabled={isProcessing || amount < 1}
            className="w-full py-4 bg-accent-500 text-black-950 font-bold text-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-black-950 animate-pulse rounded-full"></div>
                <span>Processing X402 Payment...</span>
              </div>
            ) : (
              `Buy ${prediction.toUpperCase()} - To win $${finalReturn}`
            )}
          </button>

          <div className="text-center text-xs text-black-500">
            Powered by x402 • Instant {currency} settlement
          </div>
        </div>
      </div>
    </div>
  );
}
