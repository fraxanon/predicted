'use client';

import React, { useState } from 'react';

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function CashoutModal({ isOpen, onClose, availableBalance }: CashoutModalProps) {
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [selectedStablecoin, setSelectedStablecoin] = useState<'frxUSD' | 'USDC' | 'USDT' | 'DAI'>('frxUSD');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isCashingOut, setIsCashingOut] = useState(false);

  if (!isOpen) return null;

  const cashoutAmountNum = Number(cashoutAmount) || 0;
  
  // Mock exchange rates and fees
  const exchangeRates = {
    frxUSD: 1.02, // 2% bonus for frxUSD
    USDC: 0.9995, // Slight discount for conversion
    USDT: 0.9992,
    DAI: 0.9988
  };

  const networkFees = {
    frxUSD: 0.25, // Lower fees on Fraxtal
    USDC: 2.50, // Base network fee
    USDT: 3.20,
    DAI: 4.10
  };

  const protocolFee = cashoutAmountNum * 0.005; // 0.5% protocol fee
  const networkFee = networkFees[selectedStablecoin];
  const exchangeRate = exchangeRates[selectedStablecoin];
  const receivedAmount = (cashoutAmountNum * exchangeRate) - protocolFee - networkFee;

  const stablecoinOptions = [
    { 
      symbol: 'frxUSD', 
      name: 'Frax USD', 
      icon: '🟣',
      network: 'Fraxtal',
      rate: 1.02, // 2% bonus for frxUSD
      fee: 0.25, // Lower fees on Fraxtal
      apy: 4.1,
      multiplier: '2x',
      featured: true
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      icon: '🔵',
      network: 'Base',
      rate: exchangeRates.USDC,
      fee: networkFees.USDC,
      apy: 0,
      multiplier: '1x',
      featured: false
    },
    { 
      symbol: 'USDT', 
      name: 'Tether', 
      icon: '🟢',
      network: 'Base',
      rate: exchangeRates.USDT,
      fee: networkFees.USDT,
      apy: 0,
      multiplier: '1x',
      featured: false
    },
    { 
      symbol: 'DAI', 
      name: 'Dai Stablecoin', 
      icon: '🟡',
      network: 'Base',
      rate: exchangeRates.DAI,
      fee: networkFees.DAI,
      apy: 0,
      multiplier: '1x',
      featured: false
    }
  ];

  const handleCashout = async () => {
    if (!cashoutAmount || cashoutAmountNum <= 0 || cashoutAmountNum > availableBalance) return;
    if (!recipientAddress) {
      alert('Please enter a recipient address');
      return;
    }

    setIsCashingOut(true);
    try {
      // Simulate cashout transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log(`Cashed out $${cashoutAmount} to ${receivedAmount.toFixed(2)} ${selectedStablecoin}`);
      console.log(`Recipient: ${recipientAddress}`);
      
      setCashoutAmount('');
      setRecipientAddress('');
      onClose();
    } catch (error) {
      console.error('Cashout failed:', error);
    } finally {
      setIsCashingOut(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black-900 border border-black-700 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">💸 Cash Out to Stablecoin</h2>
          <button onClick={onClose} className="text-black-400 hover:text-white text-xl">×</button>
        </div>

        {/* Available Balance */}
        <div className="mb-6 p-3 bg-black-800 border border-black-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-black-400 text-sm">Available Balance</span>
            <span className="text-white font-bold">${availableBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Cashout Amount */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Cashout Amount</label>
          <div className="relative">
            <input
              type="number"
              value={cashoutAmount}
              onChange={(e) => setCashoutAmount(e.target.value)}
              placeholder="Enter amount to cash out"
              className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-green-500"
              max={availableBalance}
            />
            <button
              onClick={() => setCashoutAmount(availableBalance.toString())}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 text-sm hover:text-green-300"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Stablecoin Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">Select Stablecoin</label>
          
          {/* frxUSD Featured Option */}
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">FEATURED</span>
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded">2x FLYWHEEL</span>
              </div>
              <div className="text-purple-400 font-bold text-sm">+2% BONUS</div>
            </div>
            <button
              onClick={() => setSelectedStablecoin('frxUSD')}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                selectedStablecoin === 'frxUSD'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-black-800 border-purple-700 text-black-300 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🟣</span>
                  <div>
                    <div className="font-medium text-sm flex items-center space-x-2">
                      <span>frxUSD</span>
                      <span className="px-1 py-0.5 bg-purple-500 text-white text-xs rounded">2x</span>
                    </div>
                    <div className="text-xs opacity-75">Frax USD • Fraxtal • 4.1% APY</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-400">1.02</div>
                  <div className="text-xs opacity-75">$0.25 fee</div>
                </div>
              </div>
            </button>
          </div>

          {/* Other Stablecoins */}
          <div className="space-y-2">
            <p className="text-xs text-black-400 mb-2">Other Options:</p>
            {stablecoinOptions.filter(coin => !coin.featured).map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => setSelectedStablecoin(coin.symbol as any)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedStablecoin === coin.symbol
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-black-800 border-black-700 text-black-300 hover:border-green-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{coin.icon}</span>
                    <div>
                      <div className="font-medium text-sm flex items-center space-x-2">
                        <span>{coin.symbol}</span>
                        <span className="px-1 py-0.5 bg-black-600 text-black-300 text-xs rounded">{coin.multiplier}</span>
                      </div>
                      <div className="text-xs opacity-75">{coin.name} • {coin.network}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{coin.rate}</div>
                    <div className="text-xs opacity-75">${coin.fee} fee</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Address */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x... or ENS name"
            className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-green-500"
          />
          <p className="text-xs text-black-400 mt-1">Enter Base network address or ENS name</p>
        </div>

        {/* Transaction Summary */}
        {cashoutAmountNum > 0 && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <h3 className="text-green-400 font-medium text-sm mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black-400">Cashout Amount:</span>
                <span className="text-white">${cashoutAmountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Exchange Rate:</span>
                <span className="text-white">{exchangeRate} {selectedStablecoin}/USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Protocol Fee (0.5%):</span>
                <span className="text-red-400">-${protocolFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Network Fee:</span>
                <span className="text-red-400">-${networkFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-700">
                <span className="text-black-400">You Receive:</span>
                <span className="text-green-400 font-bold">{receivedAmount.toFixed(2)} {selectedStablecoin}</span>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="mb-6 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400 text-sm">⚠️</span>
            <div className="text-yellow-300 text-xs">
              <p className="font-medium mb-1">Important:</p>
              <p>• Transactions are irreversible once confirmed</p>
              <p>• Verify recipient address carefully</p>
              <p>• Base network fees apply for stablecoin transfers</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-black-800 hover:bg-black-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCashout}
            disabled={isCashingOut || !cashoutAmount || cashoutAmountNum <= 0 || cashoutAmountNum > availableBalance || !recipientAddress}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {isCashingOut ? 'Processing...' : `Cash Out ${receivedAmount.toFixed(2)} ${selectedStablecoin}`}
          </button>
        </div>
      </div>
    </div>
  );
}
