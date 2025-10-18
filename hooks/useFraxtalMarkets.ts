import { useState, useCallback } from 'react';
import { useAccount, useContractWrite, useContractRead, useNetwork, useSwitchNetwork } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { FRAXTAL_CONFIG, MARKET_CREATION_FEE, MarketCategory } from '../lib/fraxtal-config';

// Market Factory ABI (simplified)
const MARKET_FACTORY_ABI = [
  {
    name: 'createMarket',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'oracle', type: 'address' },
      { name: 'endTime', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'buyShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketId', type: 'uint256' },
      { name: 'outcome', type: 'uint256' },
      { name: 'amount', type: 'uint256' }
    ]
  },
  {
    name: 'getMarket',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'question', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'creator', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'endTime', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'creationFee', type: 'uint256' },
          { name: 'resolved', type: 'bool' },
          { name: 'outcome', type: 'uint256' },
          { name: 'totalVolume', type: 'uint256' },
          { name: 'yesShares', type: 'uint256' },
          { name: 'noShares', type: 'uint256' }
        ]
      }
    ]
  },
  {
    name: 'getUserShares',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'marketId', type: 'uint256' }
    ],
    outputs: [
      { name: 'noShares', type: 'uint256' },
      { name: 'yesShares', type: 'uint256' }
    ]
  }
] as const;

export interface Market {
  id: number;
  question: string;
  description: string;
  category: MarketCategory;
  creator: string;
  oracle: string;
  endTime: number;
  createdAt: number;
  creationFee: string;
  resolved: boolean;
  outcome: number;
  totalVolume: string;
  yesShares: string;
  noShares: string;
}

export interface CreateMarketParams {
  question: string;
  description: string;
  category: MarketCategory;
  endDate: Date;
  oracle?: string;
}

export function useFraxtalMarkets() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isTrading, setIsTrading] = useState(false);

  // Check if we're on Fraxtal
  const isOnFraxtal = chain?.id === FRAXTAL_CONFIG.mainnet.chainId || 
                     chain?.id === FRAXTAL_CONFIG.testnet.chainId;
  
  const config = chain?.id === FRAXTAL_CONFIG.testnet.chainId 
    ? FRAXTAL_CONFIG.testnet 
    : FRAXTAL_CONFIG.mainnet;

  // Contract write hooks
  const { writeAsync: createMarketWrite } = useContractWrite({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'createMarket',
  });

  const { writeAsync: buySharesWrite } = useContractWrite({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'buyShares',
  });

  // Switch to Fraxtal network
  const switchToFraxtal = useCallback(async () => {
    if (!switchNetwork) return false;
    
    try {
      await switchNetwork(FRAXTAL_CONFIG.mainnet.chainId);
      return true;
    } catch (error) {
      console.error('Failed to switch to Fraxtal:', error);
      return false;
    }
  }, [switchNetwork]);

  // Create a new market
  const createMarket = useCallback(async (params: CreateMarketParams) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!isOnFraxtal) {
      const switched = await switchToFraxtal();
      if (!switched) {
        throw new Error('Failed to switch to Fraxtal network');
      }
    }

    setIsCreating(true);

    try {
      const endTime = Math.floor(params.endDate.getTime() / 1000);
      const oracle = params.oracle || address; // Use user as oracle if not specified
      
      const tx = await createMarketWrite({
        args: [
          params.question,
          params.description,
          params.category,
          oracle as `0x${string}`,
          BigInt(endTime)
        ],
        value: parseEther(MARKET_CREATION_FEE)
      });

      return tx;
    } catch (error) {
      console.error('Failed to create market:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [isConnected, address, isOnFraxtal, createMarketWrite, switchToFraxtal]);

  // Buy shares in a market
  const buyShares = useCallback(async (
    marketId: number,
    outcome: 0 | 1, // 0 = NO, 1 = YES
    amount: string
  ) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!isOnFraxtal) {
      const switched = await switchToFraxtal();
      if (!switched) {
        throw new Error('Failed to switch to Fraxtal network');
      }
    }

    setIsTrading(true);

    try {
      const tx = await buySharesWrite({
        args: [
          BigInt(marketId),
          BigInt(outcome),
          parseEther(amount)
        ]
      });

      return tx;
    } catch (error) {
      console.error('Failed to buy shares:', error);
      throw error;
    } finally {
      setIsTrading(false);
    }
  }, [isConnected, address, isOnFraxtal, buySharesWrite, switchToFraxtal]);

  // Get market data
  const { data: marketData, refetch: refetchMarket } = useContractRead({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'getMarket',
    args: [BigInt(1)], // Example market ID
    enabled: isOnFraxtal && !!config.contracts.marketFactory
  });

  // Get user shares
  const { data: userShares, refetch: refetchUserShares } = useContractRead({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'getUserShares',
    args: [address as `0x${string}`, BigInt(1)], // Example market ID
    enabled: isOnFraxtal && !!address && !!config.contracts.marketFactory
  });

  return {
    // State
    isConnected,
    isOnFraxtal,
    isCreating,
    isTrading,
    address,
    chain,
    
    // Actions
    createMarket,
    buyShares,
    switchToFraxtal,
    refetchMarket,
    refetchUserShares,
    
    // Data
    marketData,
    userShares,
    
    // Config
    config,
    creationFee: MARKET_CREATION_FEE
  };
}
