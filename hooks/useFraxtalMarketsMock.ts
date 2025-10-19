import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead, useNetwork, useSwitchNetwork } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { FRAXTAL_CONFIG, MARKET_CREATION_FEE, MarketCategory } from '../lib/fraxtal-config';
import { 
  mockWalletState, 
  mockMarkets, 
  mockPortfolio, 
  mockTransactions,
  mockBlockchainFunctions,
  shouldUseMockData,
  MOCK_MODE 
} from '../lib/mock-data';

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
  yesPrice?: number;
  noPrice?: number;
  participants?: number;
  volume24h?: number;
  priceHistory?: Array<{ timestamp: number; price: number }>;
}

export interface CreateMarketParams {
  question: string;
  description: string;
  category: MarketCategory;
  endDate: Date;
  oracle?: string;
}

export interface UserBalance {
  frxUSD: string;
  frxETH: string;
}

export interface UserShares {
  yesShares: string;
  noShares: string;
}

export function useFraxtalMarkets() {
  const { address: realAddress, isConnected: realIsConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [mockMarketData, setMockMarketData] = useState<Market[]>(mockMarkets);
  const [userBalances, setUserBalances] = useState<UserBalance>({
    frxUSD: mockWalletState.frxUSDBalance,
    frxETH: mockWalletState.frxETHBalance
  });

  const useMock = shouldUseMockData();

  // Use mock or real data based on mode
  const isConnected = useMock ? mockWalletState.isConnected : realIsConnected;
  const address = useMock ? mockWalletState.address : realAddress;
  const isOnFraxtal = useMock ? mockWalletState.isOnFraxtal : (
    chain?.id === FRAXTAL_CONFIG.mainnet.chainId || 
    chain?.id === FRAXTAL_CONFIG.testnet.chainId
  );
  
  const config = chain?.id === FRAXTAL_CONFIG.testnet.chainId 
    ? FRAXTAL_CONFIG.testnet 
    : FRAXTAL_CONFIG.mainnet;

  // Contract write hooks (only used in real mode)
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
    if (useMock) {
      // In mock mode, simulate network switch
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }

    if (!switchNetwork) return false;
    
    try {
      await switchNetwork(FRAXTAL_CONFIG.mainnet.chainId);
      return true;
    } catch (error) {
      console.error('Failed to switch to Fraxtal:', error);
      return false;
    }
  }, [switchNetwork, useMock]);

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
      if (useMock) {
        // Use mock function
        const result = await mockBlockchainFunctions.createMarket(params);
        setMockMarketData([...mockMarkets]);
        return result;
      } else {
        // Use real blockchain interaction
        const endTime = Math.floor(params.endDate.getTime() / 1000);
        const oracle = params.oracle || address;
        
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
      }
    } catch (error) {
      console.error('Failed to create market:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [isConnected, address, isOnFraxtal, createMarketWrite, switchToFraxtal, useMock]);

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
      if (useMock) {
        // Use mock function
        const result = await mockBlockchainFunctions.buyShares(marketId, outcome, amount);
        setMockMarketData([...mockMarkets]);
        
        // Update user balance
        const currentBalance = parseFloat(userBalances.frxUSD);
        const newBalance = Math.max(0, currentBalance - parseFloat(amount));
        setUserBalances(prev => ({
          ...prev,
          frxUSD: newBalance.toFixed(2)
        }));
        
        return result;
      } else {
        // Use real blockchain interaction
        const tx = await buySharesWrite({
          args: [
            BigInt(marketId),
            BigInt(outcome),
            parseEther(amount)
          ]
        });

        return tx;
      }
    } catch (error) {
      console.error('Failed to buy shares:', error);
      throw error;
    } finally {
      setIsTrading(false);
    }
  }, [isConnected, address, isOnFraxtal, buySharesWrite, switchToFraxtal, useMock, userBalances]);

  // Get market data
  const { data: realMarketData, refetch: refetchMarket } = useContractRead({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'getMarket',
    args: [BigInt(1)], // Example market ID
    enabled: !useMock && isOnFraxtal && !!config.contracts.marketFactory
  });

  // Get user shares
  const { data: realUserShares, refetch: refetchUserShares } = useContractRead({
    address: config.contracts.marketFactory as `0x${string}`,
    abi: MARKET_FACTORY_ABI,
    functionName: 'getUserShares',
    args: [address as `0x${string}`, BigInt(1)], // Example market ID
    enabled: !useMock && isOnFraxtal && !!address && !!config.contracts.marketFactory
  });

  // Mock refetch functions
  const mockRefetchMarket = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setMockMarketData([...mockMarkets]);
    return { data: mockMarkets[0] };
  }, []);

  const mockRefetchUserShares = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { yesShares: "0", noShares: "0" } };
  }, []);

  // Get user balance
  const getUserBalance = useCallback(async (token: 'frxUSD' | 'frxETH' = 'frxUSD') => {
    if (useMock) {
      return await mockBlockchainFunctions.getBalance(token);
    }
    // In real mode, you would implement actual balance fetching
    return "0";
  }, [useMock]);

  // Get user shares for a specific market
  const getUserShares = useCallback(async (marketId: number): Promise<UserShares> => {
    if (useMock) {
      return await mockBlockchainFunctions.getUserShares(marketId);
    }
    // In real mode, you would implement actual shares fetching
    return { yesShares: "0", noShares: "0" };
  }, [useMock]);

  // Get all markets
  const getAllMarkets = useCallback((): Market[] => {
    return useMock ? mockMarketData : [];
  }, [useMock, mockMarketData]);

  // Get user portfolio
  const getUserPortfolio = useCallback(() => {
    return useMock ? mockPortfolio : null;
  }, [useMock]);

  // Get transaction history
  const getTransactionHistory = useCallback(() => {
    return useMock ? mockTransactions : [];
  }, [useMock]);

  // Update balances periodically in mock mode
  useEffect(() => {
    if (!useMock) return;

    const interval = setInterval(() => {
      // Simulate small balance changes
      setUserBalances(prev => ({
        frxUSD: (parseFloat(prev.frxUSD) + (Math.random() - 0.5) * 10).toFixed(2),
        frxETH: (parseFloat(prev.frxETH) + (Math.random() - 0.5) * 0.01).toFixed(4)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [useMock]);

  return {
    // State
    isConnected,
    isOnFraxtal,
    isCreating,
    isTrading,
    address,
    chain,
    useMockData: useMock,
    
    // Actions
    createMarket,
    buyShares,
    switchToFraxtal,
    refetchMarket: useMock ? mockRefetchMarket : refetchMarket,
    refetchUserShares: useMock ? mockRefetchUserShares : refetchUserShares,
    getUserBalance,
    getUserShares,
    
    // Data
    marketData: useMock ? mockMarketData[0] : realMarketData,
    userShares: useMock ? { yesShares: "0", noShares: "0" } : realUserShares,
    userBalances,
    
    // Mock-specific data
    allMarkets: getAllMarkets(),
    userPortfolio: getUserPortfolio(),
    transactionHistory: getTransactionHistory(),
    
    // Config
    config,
    creationFee: MARKET_CREATION_FEE
  };
}
