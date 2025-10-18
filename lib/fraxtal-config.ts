// Fraxtal Network Configuration
export const FRAXTAL_CONFIG = {
  // Fraxtal Mainnet
  mainnet: {
    chainId: 252,
    name: 'Fraxtal',
    currency: 'frxETH',
    explorerUrl: 'https://fraxscan.com',
    rpcUrl: 'https://rpc.frax.com',
    contracts: {
      frxUSD: '0xfc00000000000000000000000000000000000001', // Native frxUSD on Fraxtal
      marketFactory: '0x0000000000000000000000000000000000000000', // To be deployed
      conditionalTokens: '0x0000000000000000000000000000000000000000', // To be deployed
    }
  },
  // Fraxtal Testnet (Holesky)
  testnet: {
    chainId: 2522,
    name: 'Fraxtal Testnet',
    currency: 'frxETH',
    explorerUrl: 'https://holesky.fraxscan.com',
    rpcUrl: 'https://rpc.testnet.frax.com',
    contracts: {
      frxUSD: '0xfc00000000000000000000000000000000000002', // Test frxUSD
      marketFactory: '0x0000000000000000000000000000000000000000',
      conditionalTokens: '0x0000000000000000000000000000000000000000',
    }
  }
};

export const MARKET_CREATION_FEE = '0.01'; // 0.01 frxETH
export const TRADING_FEE_BPS = 200; // 2%
export const MIN_MARKET_DURATION = 24 * 60 * 60; // 24 hours
export const MAX_MARKET_DURATION = 365 * 24 * 60 * 60; // 1 year

export const MARKET_CATEGORIES = [
  'CRYPTO',
  'DEFI', 
  'TECH',
  'POLITICS',
  'SPORTS',
  'ENTERTAINMENT',
  'SCIENCE',
  'ECONOMICS'
] as const;

export type MarketCategory = typeof MARKET_CATEGORIES[number];
