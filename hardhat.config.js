require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    fraxtal: {
      url: 'https://rpc.frax.com',
      chainId: 252,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
    },
    fraxtalTestnet: {
      url: 'https://rpc.testnet.frax.com',
      chainId: 2522,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org',
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      fraxtal: process.env.FRAXSCAN_API_KEY || 'abc',
      fraxtalTestnet: process.env.FRAXSCAN_API_KEY || 'abc',
    },
    customChains: [
      {
        network: 'fraxtal',
        chainId: 252,
        urls: {
          apiURL: 'https://api.fraxscan.com/api',
          browserURL: 'https://fraxscan.com',
        },
      },
      {
        network: 'fraxtalTestnet',
        chainId: 2522,
        urls: {
          apiURL: 'https://api-holesky.fraxscan.com/api',
          browserURL: 'https://holesky.fraxscan.com',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
