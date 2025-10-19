// Mock data provider for development without testnet tokens
import { MarketCategory } from './fraxtal-config';

export const MOCK_MODE = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Mock wallet state
export const mockWalletState = {
  isConnected: true,
  address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C' as `0x${string}`,
  isOnFraxtal: true,
  frxUSDBalance: '2847.50',
  frxETHBalance: '1.2345',
  chainId: 2522, // Fraxtal testnet
};

// Mock user portfolio
export const mockPortfolio = {
  totalValue: 6227.88,
  totalPnL: 1247.32,
  totalPnLPercent: 24.7,
  activePositions: 12,
  marketsCreated: 3,
  totalVolume: 15420.50,
  winRate: 68.4,
  positions: [
    {
      marketId: 1,
      question: "Will Bitcoin reach $100k by end of 2024?",
      yesShares: 150,
      noShares: 0,
      avgPrice: 0.67,
      currentPrice: 0.72,
      pnl: 112.50,
      pnlPercent: 11.2,
      value: 1080.00
    },
    {
      marketId: 2,
      question: "Will Fraxtal TVL exceed $1B this year?",
      yesShares: 0,
      noShares: 200,
      avgPrice: 0.55,
      currentPrice: 0.48,
      pnl: 140.00,
      pnlPercent: 12.7,
      value: 960.00
    },
    {
      marketId: 4,
      question: "Will Ethereum 2.0 staking rewards exceed 5% APY?",
      yesShares: 75,
      noShares: 25,
      avgPrice: 0.58,
      currentPrice: 0.61,
      pnl: 30.00,
      pnlPercent: 5.2,
      value: 610.00
    }
  ]
};

// Mock market data with realistic trading activity
export const mockMarkets = [
  {
    id: 1,
    question: "Will Bitcoin reach $100k by end of 2024?",
    description: "Bitcoin must reach or exceed $100,000 USD on any major exchange (Coinbase, Binance, Kraken) by December 31, 2024, 11:59 PM UTC.",
    category: "CRYPTO" as MarketCategory,
    creator: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
    oracle: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C",
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    createdAt: Math.floor(new Date('2024-10-15').getTime() / 1000),
    creationFee: "0.01",
    resolved: false,
    outcome: 0,
    totalVolume: "15420.50",
    yesShares: "8234.25",
    noShares: "7186.25",
    yesPrice: 0.72,
    noPrice: 0.28,
    participants: 234,
    volume24h: 1250.75,
    priceHistory: [
      { timestamp: Date.now() - 86400000 * 7, price: 0.65 },
      { timestamp: Date.now() - 86400000 * 6, price: 0.68 },
      { timestamp: Date.now() - 86400000 * 5, price: 0.71 },
      { timestamp: Date.now() - 86400000 * 4, price: 0.69 },
      { timestamp: Date.now() - 86400000 * 3, price: 0.73 },
      { timestamp: Date.now() - 86400000 * 2, price: 0.70 },
      { timestamp: Date.now() - 86400000 * 1, price: 0.72 },
      { timestamp: Date.now(), price: 0.72 }
    ]
  },
  {
    id: 2,
    question: "Will Fraxtal TVL exceed $1B this year?",
    description: "Total Value Locked (TVL) on Fraxtal network must exceed $1 billion USD as reported by DefiLlama by December 31, 2024.",
    category: "DEFI" as MarketCategory,
    creator: "0x8ba1f109551bD432803012645Hac136c22C501e",
    oracle: "0x8ba1f109551bD432803012645Hac136c22C501e",
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    createdAt: Math.floor(new Date('2024-10-12').getTime() / 1000),
    creationFee: "0.01",
    resolved: false,
    outcome: 0,
    totalVolume: "8750.25",
    yesShares: "3937.61",
    noShares: "4812.64",
    yesPrice: 0.45,
    noPrice: 0.55,
    participants: 156,
    volume24h: 892.30,
    priceHistory: [
      { timestamp: Date.now() - 86400000 * 7, price: 0.52 },
      { timestamp: Date.now() - 86400000 * 6, price: 0.49 },
      { timestamp: Date.now() - 86400000 * 5, price: 0.47 },
      { timestamp: Date.now() - 86400000 * 4, price: 0.44 },
      { timestamp: Date.now() - 86400000 * 3, price: 0.46 },
      { timestamp: Date.now() - 86400000 * 2, price: 0.43 },
      { timestamp: Date.now() - 86400000 * 1, price: 0.45 },
      { timestamp: Date.now(), price: 0.45 }
    ]
  },
  {
    id: 3,
    question: "Will AI regulation pass in the US this year?",
    description: "A comprehensive AI regulation bill must be signed into law by the US President by December 31, 2024.",
    category: "POLITICS" as MarketCategory,
    creator: "0x9876543210987654321098765432109876543210",
    oracle: "0x9876543210987654321098765432109876543210",
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    createdAt: Math.floor(new Date('2024-10-10').getTime() / 1000),
    creationFee: "0.01",
    resolved: true,
    outcome: 1, // YES
    totalVolume: "12300.75",
    yesShares: "12300.75",
    noShares: "0",
    yesPrice: 1.00,
    noPrice: 0.00,
    participants: 189,
    volume24h: 0,
    priceHistory: [
      { timestamp: Date.now() - 86400000 * 7, price: 0.34 },
      { timestamp: Date.now() - 86400000 * 6, price: 0.38 },
      { timestamp: Date.now() - 86400000 * 5, price: 0.42 },
      { timestamp: Date.now() - 86400000 * 4, price: 0.55 },
      { timestamp: Date.now() - 86400000 * 3, price: 0.78 },
      { timestamp: Date.now() - 86400000 * 2, price: 0.92 },
      { timestamp: Date.now() - 86400000 * 1, price: 1.00 },
      { timestamp: Date.now(), price: 1.00 }
    ]
  },
  {
    id: 4,
    question: "Will Ethereum 2.0 staking rewards exceed 5% APY?",
    description: "Ethereum 2.0 staking rewards must exceed 5% APY for at least 30 consecutive days before December 31, 2024.",
    category: "CRYPTO" as MarketCategory,
    creator: "0x1234567890123456789012345678901234567890",
    oracle: "0x1234567890123456789012345678901234567890",
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    createdAt: Math.floor(new Date('2024-10-08').getTime() / 1000),
    creationFee: "0.01",
    resolved: false,
    outcome: 0,
    totalVolume: "6420.80",
    yesShares: "3916.09",
    noShares: "2504.71",
    yesPrice: 0.61,
    noPrice: 0.39,
    participants: 98,
    volume24h: 445.20,
    priceHistory: [
      { timestamp: Date.now() - 86400000 * 7, price: 0.58 },
      { timestamp: Date.now() - 86400000 * 6, price: 0.60 },
      { timestamp: Date.now() - 86400000 * 5, price: 0.62 },
      { timestamp: Date.now() - 86400000 * 4, price: 0.59 },
      { timestamp: Date.now() - 86400000 * 3, price: 0.61 },
      { timestamp: Date.now() - 86400000 * 2, price: 0.63 },
      { timestamp: Date.now() - 86400000 * 1, price: 0.61 },
      { timestamp: Date.now(), price: 0.61 }
    ]
  },
  {
    id: 5,
    question: "Will Tesla stock reach $300 by end of Q4 2024?",
    description: "Tesla (TSLA) stock price must reach or exceed $300 USD on NASDAQ by December 31, 2024.",
    category: "TECH" as MarketCategory,
    creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    oracle: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    endTime: Math.floor(new Date('2024-12-31').getTime() / 1000),
    createdAt: Math.floor(new Date('2024-10-05').getTime() / 1000),
    creationFee: "0.01",
    resolved: false,
    outcome: 0,
    totalVolume: "9876.40",
    yesShares: "2962.92",
    noShares: "6913.48",
    yesPrice: 0.30,
    noPrice: 0.70,
    participants: 145,
    volume24h: 678.90,
    priceHistory: [
      { timestamp: Date.now() - 86400000 * 7, price: 0.35 },
      { timestamp: Date.now() - 86400000 * 6, price: 0.32 },
      { timestamp: Date.now() - 86400000 * 5, price: 0.29 },
      { timestamp: Date.now() - 86400000 * 4, price: 0.31 },
      { timestamp: Date.now() - 86400000 * 3, price: 0.28 },
      { timestamp: Date.now() - 86400000 * 2, price: 0.30 },
      { timestamp: Date.now() - 86400000 * 1, price: 0.30 },
      { timestamp: Date.now(), price: 0.30 }
    ]
  }
];

// Mock transaction history
export const mockTransactions = [
  {
    id: "0x1234567890abcdef1234567890abcdef12345678",
    type: "BUY_YES",
    marketId: 1,
    marketQuestion: "Will Bitcoin reach $100k by end of 2024?",
    amount: "100.00",
    shares: "150",
    price: 0.67,
    timestamp: Date.now() - 86400000 * 2,
    status: "confirmed",
    gasUsed: "0.0023"
  },
  {
    id: "0xabcdef1234567890abcdef1234567890abcdef12",
    type: "BUY_NO",
    marketId: 2,
    marketQuestion: "Will Fraxtal TVL exceed $1B this year?",
    amount: "110.00",
    shares: "200",
    price: 0.55,
    timestamp: Date.now() - 86400000 * 5,
    status: "confirmed",
    gasUsed: "0.0019"
  },
  {
    id: "0x567890abcdef1234567890abcdef1234567890ab",
    type: "CREATE_MARKET",
    marketId: 3,
    marketQuestion: "Will AI regulation pass in the US this year?",
    amount: "0.01",
    shares: "0",
    price: 0,
    timestamp: Date.now() - 86400000 * 9,
    status: "confirmed",
    gasUsed: "0.0156"
  },
  {
    id: "0x890abcdef1234567890abcdef1234567890abcdef",
    type: "RESOLVE_MARKET",
    marketId: 3,
    marketQuestion: "Will AI regulation pass in the US this year?",
    amount: "0.00",
    shares: "0",
    price: 0,
    timestamp: Date.now() - 86400000 * 1,
    status: "confirmed",
    gasUsed: "0.0089"
  }
];

// Mock functions to simulate blockchain interactions
export const mockBlockchainFunctions = {
  // Simulate market creation with delay
  createMarket: async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
    const newMarket = {
      id: mockMarkets.length + 1,
      question: params.question,
      description: params.description,
      category: params.category,
      creator: mockWalletState.address,
      oracle: params.oracle || mockWalletState.address,
      endTime: Math.floor(params.endDate.getTime() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
      creationFee: "0.01",
      resolved: false,
      outcome: 0,
      totalVolume: "0",
      yesShares: "0",
      noShares: "0",
      yesPrice: 0.50,
      noPrice: 0.50,
      participants: 0,
      volume24h: 0,
      priceHistory: [{ timestamp: Date.now(), price: 0.50 }]
    };
    
    mockMarkets.push(newMarket);
    
    return {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      marketId: newMarket.id
    };
  },

  // Simulate buying shares
  buyShares: async (marketId: number, outcome: 0 | 1, amount: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
    
    const market = mockMarkets.find(m => m.id === marketId);
    if (!market) throw new Error('Market not found');
    
    const amountNum = parseFloat(amount);
    const price = outcome === 1 ? market.yesPrice : market.noPrice;
    const shares = amountNum / price;
    
    // Update market data
    market.totalVolume = (parseFloat(market.totalVolume) + amountNum).toString();
    market.volume24h += amountNum;
    market.participants += 1;
    
    if (outcome === 1) {
      market.yesShares = (parseFloat(market.yesShares) + shares).toString();
      market.yesPrice = Math.min(0.99, market.yesPrice + 0.01);
      market.noPrice = 1 - market.yesPrice;
    } else {
      market.noShares = (parseFloat(market.noShares) + shares).toString();
      market.noPrice = Math.min(0.99, market.noPrice + 0.01);
      market.yesPrice = 1 - market.noPrice;
    }
    
    // Add to price history
    market.priceHistory.push({
      timestamp: Date.now(),
      price: market.yesPrice
    });
    
    return {
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      shares: shares.toString()
    };
  },

  // Simulate getting user balance
  getBalance: async (token: 'frxUSD' | 'frxETH') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return token === 'frxUSD' ? mockWalletState.frxUSDBalance : mockWalletState.frxETHBalance;
  },

  // Simulate getting user shares in a market
  getUserShares: async (marketId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const position = mockPortfolio.positions.find(p => p.marketId === marketId);
    return position ? {
      yesShares: position.yesShares.toString(),
      noShares: position.noShares.toString()
    } : { yesShares: "0", noShares: "0" };
  }
};

// Helper to check if we should use mock data
export const shouldUseMockData = () => {
  return MOCK_MODE || !mockWalletState.isConnected;
};
