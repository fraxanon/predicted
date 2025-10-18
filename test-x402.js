#!/usr/bin/env node

/**
 * X402 Bot Test Script
 * Tests the X402 payment integration for automated betting
 */

const { MockX402Client, X402Utils } = require('./lib/x402-client');

// Mock market data
const MOCK_MARKETS = [
  {
    id: 'market-1',
    title: 'Will Bitcoin reach $100K by end of 2024?',
    category: 'BTC',
    yesPrice: 72,
    noPrice: 28,
    aiPrediction: 'yes',
    confidence: 0.78
  },
  {
    id: 'market-2', 
    title: 'Will Ethereum upgrade to Proof of Stake 2.0?',
    category: 'ETH',
    yesPrice: 85,
    noPrice: 15,
    aiPrediction: 'yes',
    confidence: 0.92
  },
  {
    id: 'market-3',
    title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
    category: 'L2',
    yesPrice: 43,
    noPrice: 57,
    aiPrediction: 'no',
    confidence: 0.65
  }
];

async function testSinglePayment() {
  console.log('🧪 Testing Single X402 Payment...\n');
  
  const client = new MockX402Client();
  const market = MOCK_MARKETS[0];
  
  const paymentRequest = {
    amount: X402Utils.formatUSDCAmount(50), // $50 bet
    currency: 'USDC',
    recipient: X402Utils.generateMarketAddress(market.id),
    metadata: {
      marketId: market.id,
      prediction: market.aiPrediction,
      userId: 'test_user_123',
      confidence: market.confidence
    }
  };
  
  try {
    console.log('📊 Market:', market.title);
    console.log('🤖 AI Prediction:', market.aiPrediction.toUpperCase());
    console.log('🎯 Confidence:', (market.confidence * 100).toFixed(1) + '%');
    console.log('💰 Bet Amount: $50 USDC');
    console.log('⏳ Processing payment...\n');
    
    const result = await client.createPayment(paymentRequest);
    
    console.log('✅ Payment Successful!');
    console.log('📄 Payment ID:', result.id);
    console.log('🔗 Transaction Hash:', result.transactionHash);
    console.log('⏰ Completed At:', new Date(result.completedAt).toLocaleString());
    console.log('💵 Amount:', X402Utils.parseUSDCAmount(result.amount), 'USDC\n');
    
    return result;
  } catch (error) {
    console.error('❌ Payment Failed:', error.message);
    return null;
  }
}

async function testBatchPayments() {
  console.log('🧪 Testing Batch X402 Payments...\n');
  
  const client = new MockX402Client();
  
  const batchRequests = MOCK_MARKETS.map(market => ({
    amount: X402Utils.formatUSDCAmount(25), // $25 each
    currency: 'USDC',
    recipient: X402Utils.generateMarketAddress(market.id),
    metadata: {
      marketId: market.id,
      prediction: market.aiPrediction,
      userId: 'test_user_123',
      confidence: market.confidence
    }
  }));
  
  try {
    console.log('📊 Processing', MOCK_MARKETS.length, 'markets simultaneously...');
    console.log('💰 Total Investment: $' + (25 * MOCK_MARKETS.length));
    console.log('⏳ Executing batch payments...\n');
    
    const results = await client.createBatchPayments(batchRequests);
    
    let successCount = 0;
    let failCount = 0;
    let totalAmount = 0;
    
    results.forEach((result, index) => {
      const market = MOCK_MARKETS[index];
      console.log(`📈 ${market.title}`);
      console.log(`   🤖 AI: ${market.aiPrediction.toUpperCase()} (${(market.confidence * 100).toFixed(1)}%)`);
      
      if (result.status === 'completed') {
        successCount++;
        totalAmount += X402Utils.parseUSDCAmount(result.amount);
        console.log(`   ✅ SUCCESS - ${result.id}`);
        console.log(`   🔗 TX: ${result.transactionHash?.substring(0, 20)}...`);
      } else {
        failCount++;
        console.log(`   ❌ FAILED - ${result.error}`);
      }
      console.log('');
    });
    
    console.log('📊 Batch Results:');
    console.log(`   ✅ Successful: ${successCount}/${results.length}`);
    console.log(`   ❌ Failed: ${failCount}/${results.length}`);
    console.log(`   💰 Total Invested: $${totalAmount} USDC`);
    console.log(`   📈 Success Rate: ${((successCount / results.length) * 100).toFixed(1)}%\n`);
    
    return results;
  } catch (error) {
    console.error('❌ Batch Payment Failed:', error.message);
    return null;
  }
}

async function testPaymentStatus() {
  console.log('🧪 Testing Payment Status Check...\n');
  
  const client = new MockX402Client();
  
  // First create a payment
  const payment = await testSinglePayment();
  if (!payment) return;
  
  console.log('🔍 Checking payment status...\n');
  
  try {
    const status = await client.getPaymentStatus(payment.id);
    
    console.log('📄 Payment Status Check:');
    console.log('   ID:', status.id);
    console.log('   Status:', status.status.toUpperCase());
    console.log('   Amount:', X402Utils.parseUSDCAmount(status.amount), 'USDC');
    console.log('   Created:', new Date(status.createdAt).toLocaleString());
    if (status.completedAt) {
      console.log('   Completed:', new Date(status.completedAt).toLocaleString());
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Status Check Failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 X402 Bot Testing Suite\n');
  console.log('=' .repeat(50));
  
  // Test 1: Single Payment
  await testSinglePayment();
  
  console.log('=' .repeat(50));
  
  // Test 2: Batch Payments  
  await testBatchPayments();
  
  console.log('=' .repeat(50));
  
  // Test 3: Payment Status
  await testPaymentStatus();
  
  console.log('🎉 All tests completed!\n');
  console.log('💡 Next Steps:');
  console.log('   1. Connect to real Coinbase CDP API');
  console.log('   2. Configure production API keys');
  console.log('   3. Test with real USDC on testnet');
  console.log('   4. Deploy to production environment');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSinglePayment,
  testBatchPayments, 
  testPaymentStatus,
  runAllTests
};
