'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

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
  market?: Market;
  onBetPlaced?: (result: any) => void;
}

export function IndividualBetting({ market, onBetPlaced }: IndividualBettingProps) {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBet = async (side: 'yes' | 'no') => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    try {
      onBetPlaced?.({
        success: true,
        side: side,
        market: market
      });
      
      alert('Bet placed successfully!');
    } catch (error) {
      console.error('Betting failed:', error);
      alert('Failed to place bet. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show compact view if no market provided (for sidebar)
  if (!market) {
    return (
      <div className="bg-black-800 border border-black-700 p-3 md:p-4">
        <h3 className="text-white font-medium mb-3 text-sm md:text-base">Quick Bet</h3>
        <div className="text-center py-4">
          <div className="text-black-400 text-sm mb-2">Select a market to place a bet</div>
          <div className="text-black-500 text-xs">Choose from the markets on the left</div>
        </div>
      </div>
    );
  }

  // Show invested state
  if (market.isInvested) {
    return (
      <div className="bg-black-800 border border-green-700 p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-xs font-medium">AI INVESTED</span>
          </div>
          <span className="text-green-400 text-xs">${market.investedAmount}</span>
        </div>
        <h4 className="text-white text-sm font-medium mb-2 leading-tight">{market.title}</h4>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-green-400 text-sm font-bold">{market.yesPrice}¢</div>
              <div className="text-black-400 text-xs">YES</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-sm font-bold">{market.noPrice}¢</div>
              <div className="text-black-400 text-xs">NO</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-sm font-bold">{(market.confidence * 100).toFixed(0)}%</div>
            <div className="text-black-400 text-xs">confidence</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black-800 border border-black-700 p-3 hover:border-accent-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs px-1.5 py-0.5 bg-black-700 text-black-300 border border-black-600">
              {market.category}
            </span>
            <span className="text-xs text-black-500">{market.endDate}</span>
          </div>
          <h3 className="text-white font-medium mb-2 text-sm leading-tight">
            {market.title}
          </h3>
        </div>
        
        <div className="text-right ml-3">
          <div className="text-lg font-bold text-white">{(market.confidence * 100).toFixed(0)}%</div>
          <div className="text-black-400 text-xs">confidence</div>
        </div>
      </div>

      {/* Betting Options */}
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => handleBet('yes')}
          disabled={isProcessing}
          className="flex-1 p-2 bg-green-900 hover:bg-green-800 transition-colors text-center disabled:opacity-50"
        >
          <div className="text-white text-xs font-medium">Yes {market.yesPrice}¢</div>
        </button>
        <button
          onClick={() => handleBet('no')}
          disabled={isProcessing}
          className="flex-1 p-2 bg-red-900 hover:bg-red-800 transition-colors text-center disabled:opacity-50"
        >
          <div className="text-white text-xs font-medium">No {market.noPrice}¢</div>
        </button>
      </div>

      {/* AI Prediction */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-black-400 text-xs">AI:</span>
          <span className={`px-1.5 py-0.5 text-xs font-bold ${
            market.aiPrediction === 'yes' 
              ? 'bg-green-900 text-green-400' 
              : 'bg-red-900 text-red-400'
          }`}>
            {market.aiPrediction.toUpperCase()}
          </span>
        </div>
        
        <div className="text-xs text-black-500">
          {market.volume}
        </div>
      </div>
    </div>
  );
}
