'use client';

import React, { useState } from 'react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function TransferModal({ isOpen, onClose, availableBalance }: TransferModalProps) {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
  const [selectedNetwork, setSelectedNetwork] = useState<'base' | 'ethereum' | 'arbitrum'>('base');
  const [isTransferring, setIsTransferring] = useState(false);

  if (!isOpen) return null;

  const transferAmountNum = Number(transferAmount) || 0;
  
  // Network fees for external transfers
  const networkFees = {
    base: 0.50,
    ethereum: 15.20,
    arbitrum: 2.80
  };

  const networkFee = transferType === 'external' ? networkFees[selectedNetwork] : 0;
  const receivedAmount = transferAmountNum - networkFee;

  const networks = [
    { id: 'base', name: 'Base', icon: '🔵', fee: networkFees.base },
    { id: 'ethereum', name: 'Ethereum', icon: '⚪', fee: networkFees.ethereum },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷', fee: networkFees.arbitrum }
  ];

  // Mock saved addresses for internal transfers
  const savedAddresses = [
    { name: 'Personal Wallet', address: '0x742d35Cc6634C0532925a3b8D0b6c0532925a3b8', type: 'personal' },
    { name: 'Cold Storage', address: '0x8ba1f109551bD432803012645Hac189451b934', type: 'storage' },
    { name: 'DeFi Vault', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', type: 'defi' }
  ];

  const handleTransfer = async () => {
    if (!transferAmount || transferAmountNum <= 0 || transferAmountNum > availableBalance) return;
    if (!recipientAddress) {
      alert('Please enter a recipient address');
      return;
    }

    setIsTransferring(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log(`Transferred $${transferAmount} to ${recipientAddress}`);
      console.log(`Type: ${transferType}, Network: ${selectedNetwork}`);
      
      setTransferAmount('');
      setRecipientAddress('');
      onClose();
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black-900 border border-black-700 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">📤 Transfer Funds</h2>
          <button onClick={onClose} className="text-black-400 hover:text-white text-xl">×</button>
        </div>

        {/* Transfer Type Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">Transfer Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTransferType('internal')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                transferType === 'internal'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-blue-600'
              }`}
            >
              <div className="font-medium">🏦 Internal</div>
              <div className="text-xs opacity-75">No fees</div>
            </button>
            
            <button
              onClick={() => setTransferType('external')}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                transferType === 'external'
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-black-800 border-black-700 text-black-300 hover:border-purple-600'
              }`}
            >
              <div className="font-medium">🌐 External</div>
              <div className="text-xs opacity-75">Network fees</div>
            </button>
          </div>
        </div>

        {/* Network Selection (for external transfers) */}
        {transferType === 'external' && (
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">Select Network</label>
            <div className="space-y-2">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => setSelectedNetwork(network.id as any)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedNetwork === network.id
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-black-800 border-black-700 text-black-300 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{network.icon}</span>
                      <div className="font-medium text-sm">{network.name}</div>
                    </div>
                    <div className="text-sm">${network.fee} fee</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Balance */}
        <div className="mb-6 p-3 bg-black-800 border border-black-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-black-400 text-sm">Available Balance</span>
            <span className="text-white font-bold">${availableBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Transfer Amount */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Transfer Amount</label>
          <div className="relative">
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-purple-500"
              max={availableBalance}
            />
            <button
              onClick={() => setTransferAmount(availableBalance.toString())}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-sm hover:text-purple-300"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Recipient Address</label>
          
          {/* Saved Addresses (for internal transfers) */}
          {transferType === 'internal' && (
            <div className="mb-3">
              <p className="text-xs text-black-400 mb-2">Quick Select:</p>
              <div className="space-y-1">
                {savedAddresses.map((addr, index) => (
                  <button
                    key={index}
                    onClick={() => setRecipientAddress(addr.address)}
                    className="w-full p-2 bg-black-800 hover:bg-black-700 border border-black-700 rounded text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{addr.name}</span>
                      <span className="text-black-400 text-xs">{addr.address.slice(0, 6)}...{addr.address.slice(-4)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x... or ENS name"
            className="w-full px-3 py-3 bg-black-800 border border-black-700 text-white placeholder-black-400 rounded focus:outline-none focus:border-purple-500"
          />
          <p className="text-xs text-black-400 mt-1">
            {transferType === 'internal' ? 'Platform address or ENS name' : `${selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} network address`}
          </p>
        </div>

        {/* Transaction Summary */}
        {transferAmountNum > 0 && (
          <div className="mb-6 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h3 className="text-purple-400 font-medium text-sm mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black-400">Transfer Amount:</span>
                <span className="text-white">${transferAmountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black-400">Transfer Type:</span>
                <span className="text-white">{transferType === 'internal' ? 'Internal' : `External (${selectedNetwork})`}</span>
              </div>
              {transferType === 'external' && (
                <div className="flex justify-between">
                  <span className="text-black-400">Network Fee:</span>
                  <span className="text-red-400">-${networkFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-purple-700">
                <span className="text-black-400">Recipient Receives:</span>
                <span className="text-purple-400 font-bold">${receivedAmount.toFixed(2)}</span>
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
              <p>• Double-check recipient address before confirming</p>
              <p>• {transferType === 'internal' ? 'Internal transfers are instant and free' : 'External transfers may take several minutes'}</p>
              <p>• Transactions cannot be reversed once confirmed</p>
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
            onClick={handleTransfer}
            disabled={isTransferring || !transferAmount || transferAmountNum <= 0 || transferAmountNum > availableBalance || !recipientAddress}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {isTransferring ? 'Transferring...' : `Transfer $${transferAmountNum.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
