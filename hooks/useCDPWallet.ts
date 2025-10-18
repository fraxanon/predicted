import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

// Types for CDP wallet data
interface CDPWalletBalance {
  eth: number;
  usd: number;
}

interface CDPWalletData {
  address: string;
  balance: CDPWalletBalance;
  isLoading: boolean;
  error: string | null;
}

export function useCDPWallet() {
  const { address: userAddress } = useAccount();
  const [walletData, setWalletData] = useState<CDPWalletData>({
    address: '',
    balance: { eth: 0, usd: 0 },
    isLoading: false,
    error: null,
  });

  // Get user's CDP wallet address
  const getCDPWalletAddress = async (): Promise<string | null> => {
    if (!userAddress) return null;

    try {
      setWalletData(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/cdp-wallet/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress }),
      });

      const data = await response.json();
      
      if (data.success) {
        setWalletData(prev => ({ 
          ...prev, 
          address: data.address,
          isLoading: false 
        }));
        return data.address;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to get CDP wallet address:', error);
      setWalletData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      }));
      return null;
    }
  };

  // Get user's CDP wallet balance
  const getCDPWalletBalance = async (): Promise<CDPWalletBalance | null> => {
    if (!userAddress) return null;

    try {
      setWalletData(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/cdp-wallet/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress }),
      });

      const data = await response.json();
      
      if (data.success) {
        const balance = { eth: data.balance.eth, usd: data.balance.usd };
        setWalletData(prev => ({ 
          ...prev, 
          balance,
          isLoading: false 
        }));
        return balance;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to get CDP wallet balance:', error);
      setWalletData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      }));
      return null;
    }
  };

  // Transfer funds from user's CDP wallet (for investments)
  const transferFromCDPWallet = async (
    toAddress: string, 
    amount: number
  ): Promise<string | null> => {
    if (!userAddress) return null;

    try {
      setWalletData(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/cdp-wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress, 
          toAddress, 
          amount 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setWalletData(prev => ({ ...prev, isLoading: false }));
        // Refresh balance after transfer
        await getCDPWalletBalance();
        return data.transactionHash;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to transfer from CDP wallet:', error);
      setWalletData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      }));
      return null;
    }
  };

  // Initialize wallet data when user connects
  useEffect(() => {
    if (userAddress) {
      getCDPWalletAddress();
      getCDPWalletBalance();
    } else {
      setWalletData({
        address: '',
        balance: { eth: 0, usd: 0 },
        isLoading: false,
        error: null,
      });
    }
  }, [userAddress]);

  return {
    ...walletData,
    getCDPWalletAddress,
    getCDPWalletBalance,
    transferFromCDPWallet,
    refreshBalance: getCDPWalletBalance,
  };
}
