#!/usr/bin/env node

/**
 * Network Configuration Verification Script
 * Checks which network your CDP client is configured to use
 */

require('dotenv').config({ path: '.env.local' });

function verifyNetworkConfig() {
  console.log('🔍 Verifying Network Configuration...\n');
  
  const networkId = process.env.COINBASE_CDP_NETWORK_ID;
  
  console.log('📋 Environment Variables:');
  console.log(`   COINBASE_CDP_NETWORK_ID: ${networkId || '❌ NOT SET'}`);
  
  if (!networkId) {
    console.log('\n⚠️  WARNING: COINBASE_CDP_NETWORK_ID not set!');
    console.log('   This will default to base-sepolia (testnet) in the updated code.');
    console.log('   But it\'s better to set it explicitly in .env.local');
    console.log('\n💡 Add this to your .env.local file:');
    console.log('   COINBASE_CDP_NETWORK_ID=base-sepolia');
    return;
  }
  
  console.log('\n🌐 Network Analysis:');
  
  switch (networkId) {
    case 'base-sepolia':
      console.log('   ✅ Using Base Sepolia TESTNET');
      console.log('   💰 Use testnet USDC (free from faucets)');
      console.log('   🔗 Explorer: https://sepolia-explorer.base.org');
      console.log('   🎯 Status: SAFE FOR TESTING');
      break;
      
    case 'base-mainnet':
      console.log('   ⚠️  Using Base MAINNET');
      console.log('   💰 Uses REAL USDC (costs real money)');
      console.log('   🔗 Explorer: https://basescan.org');
      console.log('   🎯 Status: PRODUCTION - BE CAREFUL!');
      break;
      
    case 'ethereum-mainnet':
      console.log('   ⚠️  Using Ethereum MAINNET');
      console.log('   💰 Uses REAL ETH/USDC (costs real money)');
      console.log('   🔗 Explorer: https://etherscan.io');
      console.log('   🎯 Status: PRODUCTION - BE CAREFUL!');
      break;
      
    case 'ethereum-sepolia':
      console.log('   ✅ Using Ethereum Sepolia TESTNET');
      console.log('   💰 Use testnet ETH/USDC (free from faucets)');
      console.log('   🔗 Explorer: https://sepolia.etherscan.io');
      console.log('   🎯 Status: SAFE FOR TESTING');
      break;
      
    default:
      console.log(`   ❌ Unknown network: ${networkId}`);
      console.log('   🎯 Valid options: base-sepolia, base-mainnet, ethereum-mainnet');
  }
  
  console.log('\n🔧 Recommendations:');
  if (networkId.includes('mainnet')) {
    console.log('   🚨 You are on MAINNET - this uses real money!');
    console.log('   💡 For testing, change to: COINBASE_CDP_NETWORK_ID=base-sepolia');
  } else {
    console.log('   ✅ Good! You are on testnet - safe for development');
    console.log('   💡 Get free testnet USDC from Base Sepolia faucet');
  }
}

verifyNetworkConfig();
