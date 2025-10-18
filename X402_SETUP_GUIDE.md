# 🚀 X402 Bot Setup Guide

Complete guide to set up real Coinbase CDP integration for automated prediction market trading.

## 📋 Prerequisites

1. **Coinbase Developer Account**
2. **Base Network Access** (Testnet & Mainnet)
3. **USDC Balance** for trading
4. **Smart Contract Addresses** for prediction markets

## 🔧 Step 1: Get Coinbase CDP API Keys

### 1.1 Create Coinbase Developer Account
1. Go to [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Sign up or log in with your Coinbase account
3. Complete identity verification if required

### 1.2 Create a New Project
1. Click "Create Project"
2. Name: "Predicted AI Trading Bot"
3. Description: "Automated prediction market trading"
4. Select "Base" as primary network

### 1.3 Generate API Keys
1. Go to Project Settings → API Keys
2. Click "Create API Key"
3. Name: "X402 Trading Bot"
4. Permissions: 
   - ✅ Wallet Management
   - ✅ Transaction Signing
   - ✅ Contract Interactions
5. **Save API Key & Secret** (you won't see them again!)

## 🌐 Step 2: Environment Configuration

### 2.1 Copy Environment Template
```bash
cp .env.example .env.local
```

### 2.2 Fill in Your Credentials
```bash
# .env.local
COINBASE_CDP_API_KEY=your_actual_api_key_here
COINBASE_CDP_API_SECRET=your_actual_api_secret_here  
COINBASE_CDP_PROJECT_ID=your_project_id_here
COINBASE_CDP_NETWORK_ID=base-sepolia  # Start with testnet

# Trading Configuration
MAX_BET_SIZE=50                    # Start small!
MIN_CONFIDENCE_THRESHOLD=0.75      # Only high-confidence bets
MAX_RISK_PER_BET=0.02             # 2% max risk per bet
ENABLE_AUTO_TRADING=false         # Keep disabled until tested
```

## 🧪 Step 3: Test with Mock Data

### 3.1 Run Test Script
```bash
# Test the X402 integration
node test-x402.js
```

Expected output:
```
🧪 Testing Single X402 Payment...
📊 Market: Will Bitcoin reach $100K by end of 2024?
🤖 AI Prediction: YES
🎯 Confidence: 78.0%
💰 Bet Amount: $50 USDC
✅ Payment Successful!
```

### 3.2 Test in React App
```typescript
// In your React component
import { useX402Bot } from '../hooks/useX402Bot';

function TradingDashboard() {
  const { botStatus, executeTrades, logs, error } = useX402Bot();
  
  const handleTestTrade = async () => {
    const mockMarkets = [
      {
        marketId: 'test-market-1',
        title: 'Test Market',
        contractAddress: '0x1234...5678',
        aiPrediction: 'yes' as const,
        confidence: 0.85,
        yesPrice: 72,
        noPrice: 28,
        volume: '$45.2K',
        category: 'Test',
        endDate: 'Dec 31'
      }
    ];
    
    await executeTrades(mockMarkets);
  };
  
  return (
    <div>
      <h2>X402 Trading Bot</h2>
      <p>Status: {botStatus.isInitialized ? '✅ Ready' : '⏳ Initializing'}</p>
      <p>Balance: ${botStatus.balance.usdc} USDC</p>
      <button onClick={handleTestTrade}>Test Trade</button>
    </div>
  );
}
```

## 🔗 Step 4: Testnet Integration

### 4.1 Get Testnet USDC
1. Go to [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)
2. Enter your wallet address
3. Request testnet ETH and USDC

### 4.2 Deploy Test Contracts
```bash
# If you need to deploy prediction market contracts
# This is optional - you can use existing contracts
npx hardhat deploy --network base-sepolia
```

### 4.3 Update Contract Addresses
```bash
# .env.local
PREDICTION_MARKET_CONTRACT_BASE=0xYourActualContractAddress
```

### 4.4 Enable Testnet Trading
```bash
# .env.local
COINBASE_CDP_NETWORK_ID=base-sepolia
ENABLE_AUTO_TRADING=true  # Now safe to enable on testnet
```

## 🚀 Step 5: Production Deployment

### 5.1 Switch to Mainnet
```bash
# .env.local
COINBASE_CDP_NETWORK_ID=base-mainnet
```

### 5.2 Fund Production Wallet
1. Bot will create a wallet automatically
2. Send USDC to the generated wallet address
3. Start with small amounts ($100-500)

### 5.3 Production Safety Settings
```bash
# .env.local
MAX_BET_SIZE=25                    # Conservative bet size
MIN_CONFIDENCE_THRESHOLD=0.80      # High confidence only
MAX_RISK_PER_BET=0.01             # 1% max risk
ENABLE_AUTO_TRADING=true          # Enable for production
```

## 📊 Step 6: Monitoring & Management

### 6.1 Real-time Monitoring
```typescript
// Add to your dashboard
const { botStatus, logs } = useX402Bot();

// Display key metrics
console.log('Total Trades:', botStatus.performance.totalTrades);
console.log('Success Rate:', botStatus.performance.successRate);
console.log('Total Invested:', botStatus.performance.totalInvested);
```

### 6.2 Emergency Controls
```typescript
const { emergencyStop, updateConfig } = useX402Bot();

// Emergency stop button
<button onClick={emergencyStop}>🛑 EMERGENCY STOP</button>

// Adjust risk settings
updateConfig({ 
  maxBetSize: 10,           // Reduce bet size
  minConfidence: 0.90,      // Increase confidence threshold
  enableAutoTrading: false  // Disable trading
});
```

## 🔒 Security Best Practices

### 6.1 API Key Security
- ✅ Never commit API keys to git
- ✅ Use environment variables only
- ✅ Rotate keys regularly
- ✅ Monitor API usage

### 6.2 Trading Limits
- ✅ Start with small bet sizes
- ✅ Set conservative risk limits
- ✅ Monitor performance closely
- ✅ Have emergency stop procedures

### 6.3 Wallet Security
- ✅ Use server-side signing only
- ✅ Monitor wallet balance
- ✅ Set up balance alerts
- ✅ Regular security audits

## 🐛 Troubleshooting

### Common Issues

**"Bot not initialized"**
- Check API credentials in .env.local
- Verify network connectivity
- Check Coinbase CDP service status

**"Insufficient balance"**
- Fund your CDP wallet with USDC
- Check network (testnet vs mainnet)
- Verify wallet address

**"Transaction failed"**
- Check contract addresses
- Verify network gas fees
- Ensure sufficient ETH for gas

**"High confidence but no trades"**
- Check `enableAutoTrading` setting
- Verify `minConfidence` threshold
- Check `maxBetSize` limits

### Debug Mode
```bash
# Enable detailed logging
NODE_ENV=development
DEBUG=x402:*
```

## 📈 Performance Optimization

### 6.1 Bet Sizing Strategy
The bot uses Kelly Criterion for optimal bet sizing:
```
Optimal Bet = (Edge × Odds - 1) / Odds
Where Edge = (Confidence - 0.5) × 2
```

### 6.2 Risk Management
- **Max Risk Per Bet**: 1-5% of bankroll
- **Confidence Threshold**: 70-85% minimum
- **Diversification**: Spread across multiple markets

### 6.3 Performance Tracking
```typescript
// Track key metrics
const metrics = await bot.getPerformanceMetrics();
console.log('ROI:', (metrics.estimatedReturns / metrics.totalInvested - 1) * 100);
console.log('Sharpe Ratio:', calculateSharpeRatio(metrics));
```

## 🎯 Next Steps

1. **✅ Complete Setup**: Follow all steps above
2. **🧪 Test Thoroughly**: Use testnet extensively  
3. **📊 Monitor Performance**: Track all trades and outcomes
4. **🔄 Iterate**: Adjust parameters based on results
5. **📈 Scale Up**: Gradually increase bet sizes and markets

## 🆘 Support

If you need help:
1. Check the logs in your React app
2. Review Coinbase CDP documentation
3. Test with mock data first
4. Start with small amounts

---

**⚠️ Important**: This is experimental software. Never risk more than you can afford to lose. Always test thoroughly before production use.
