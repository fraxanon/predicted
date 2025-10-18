#!/usr/bin/env node

/**
 * Test Real Coinbase CDP Integration
 * Validates your API credentials and tests wallet creation
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// For testing, we'll use a simpler approach
const https = require('https');
const crypto = require('crypto');

async function testCDPConnection() {
  console.log('🔐 Testing Coinbase CDP Connection...\n');
  
  // Check environment variables
  const requiredVars = [
    'COINBASE_CDP_API_KEY',
    'COINBASE_CDP_API_SECRET', 
    'COINBASE_CDP_PROJECT_ID'
  ];
  
  console.log('📋 Checking Environment Variables:');
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 8)}...`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  if (!allPresent) {
    console.log('\n❌ Missing required environment variables!');
    console.log('Please check your .env.local file');
    return;
  }
  
  console.log('\n🚀 Testing API Connection...');
  
  try {
    // Import your CDP client
    const { CoinbaseCDPClient } = require('./lib/coinbase-cdp-config.ts');
    
    const client = new CoinbaseCDPClient({
      apiKey: process.env.COINBASE_CDP_API_KEY,
      apiSecret: process.env.COINBASE_CDP_API_SECRET,
      projectId: process.env.COINBASE_CDP_PROJECT_ID,
      networkId: process.env.COINBASE_CDP_NETWORK_ID || 'base-sepolia'
    });
    
    console.log('   ⏳ Initializing wallet...');
    const walletId = await client.initializeWallet();
    console.log(`   ✅ Wallet created: ${walletId}`);
    
    console.log('   ⏳ Checking balance...');
    const balance = await client.getWalletBalance();
    console.log(`   💰 USDC Balance: $${balance.usdc}`);
    console.log(`   💰 ETH Balance: ${balance.eth} ETH`);
    
    if (balance.usdc === 0) {
      console.log('\n💡 Next Steps:');
      console.log('   1. Your wallet is ready but has no USDC');
      console.log('   2. For testnet: Get free USDC from Base Sepolia faucet');
      console.log('   3. For mainnet: Send real USDC to your wallet');
      console.log(`   4. Wallet Address: Check CDP dashboard for address`);
    }
    
    console.log('\n🎉 CDP Integration Test Successful!');
    console.log('Your X402 bot is ready to trade!');
    
  } catch (error) {
    console.error('\n❌ CDP Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check your API key and secret are correct');
      console.log('   - Verify your project ID is accurate');
      console.log('   - Ensure API key has wallet permissions');
    }
  }
}

async function testX402Bot() {
  console.log('\n🤖 Testing X402 Bot Integration...\n');
  
  try {
    const { createX402Bot } = require('./lib/x402-bot.ts');
    
    console.log('   ⏳ Creating bot instance...');
    const bot = createX402Bot();
    
    console.log('   ⏳ Initializing bot...');
    const success = await bot.initialize();
    
    if (success) {
      console.log('   ✅ Bot initialized successfully!');
      
      const status = bot.getWalletStatus();
      console.log(`   💰 Balance: $${status.balance.usdc} USDC`);
      console.log(`   ⚙️  Auto-trading: ${status.config.enableAutoTrading ? 'Enabled' : 'Disabled'}`);
      console.log(`   🎯 Min confidence: ${(status.config.minConfidence * 100).toFixed(0)}%`);
      console.log(`   💵 Max bet size: $${status.config.maxBetSize}`);
      
      console.log('\n🎉 X402 Bot Test Successful!');
      
      if (!status.config.enableAutoTrading) {
        console.log('\n💡 To enable trading:');
        console.log('   1. Set ENABLE_AUTO_TRADING=true in .env.local');
        console.log('   2. Fund your wallet with USDC');
        console.log('   3. Test with small amounts first');
      }
      
    } else {
      console.log('   ❌ Bot initialization failed');
    }
    
  } catch (error) {
    console.error('\n❌ Bot Test Failed:');
    console.error('Error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Coinbase CDP & X402 Bot Test Suite');
  console.log('=' .repeat(50));
  
  await testCDPConnection();
  await testX402Bot();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ All tests completed!');
  console.log('\nReady to start trading? Update your .env.local:');
  console.log('   ENABLE_AUTO_TRADING=true');
}

// Run tests
runTests().catch(console.error);
