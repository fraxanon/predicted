# Mock Mode for Development

This application includes a comprehensive mock mode that allows you to develop and test the prediction market interface without needing testnet tokens or a live blockchain connection.

## 🧪 What is Mock Mode?

Mock mode simulates all blockchain interactions with realistic data, including:
- **Wallet connection** - Simulates a connected wallet with test address
- **Token balances** - Mock frxUSD and frxETH balances that update over time
- **Market creation** - Create markets instantly without gas fees
- **Trading** - Buy/sell shares with simulated price movements
- **Portfolio tracking** - View positions, P&L, and transaction history
- **Real-time updates** - Prices and balances change to simulate market activity

## 🚀 Quick Start

### Enable Mock Mode
```bash
# Run the setup script
node scripts/enable-mock-mode.js

# Or manually create .env.local with:
echo "NEXT_PUBLIC_MOCK_MODE=true" > .env.local
```

### Start Development
```bash
npm run dev
# or
yarn dev
```

The app will automatically detect mock mode and show a blue banner indicating simulated data is being used.

## 📊 Mock Data Features

### Wallet & Balances
- **frxUSD Balance**: ~$2,847.50 (updates periodically)
- **frxETH Balance**: ~1.2345 frxETH (updates periodically)
- **Address**: `0x742d35Cc6634C0532925a3b8D4C9db96590c6C8C`

### Sample Markets
The mock data includes 5 realistic prediction markets:
1. **Bitcoin $100k** - Crypto market with high activity
2. **Fraxtal TVL $1B** - DeFi market with moderate activity  
3. **AI Regulation** - Politics market (resolved as YES)
4. **Ethereum Staking** - Crypto market with steady growth
5. **Tesla $300** - Tech market with bearish sentiment

### Portfolio Simulation
- **Total Value**: $6,227.88
- **P&L**: +$1,247.32 (+24.7%)
- **Active Positions**: 12 markets
- **Win Rate**: 68.4%

### Transaction History
- Market creation transactions
- Buy/sell transactions with realistic gas costs
- Market resolution events
- All with proper timestamps and status

## 🛠 Development Benefits

### No Blockchain Dependencies
- **No testnet tokens required** - Start developing immediately
- **No network switching** - Works offline
- **No gas fees** - Test unlimited transactions
- **Instant confirmations** - No waiting for block confirmations

### Realistic Testing
- **Price movements** - Markets show realistic price changes
- **Trading mechanics** - Full buy/sell functionality
- **Portfolio updates** - Real-time balance and position tracking
- **Error simulation** - Test error handling without real failures

### UI/UX Development
- **Complete data set** - All components have realistic data
- **Edge cases** - Test with resolved markets, zero balances, etc.
- **Performance testing** - Large datasets for optimization
- **Visual polish** - Perfect data for screenshots and demos

## 🔄 Switching Modes

### Enable Mock Mode
```bash
# Set environment variable
echo "NEXT_PUBLIC_MOCK_MODE=true" > .env.local

# Restart dev server
npm run dev
```

### Disable Mock Mode
```bash
# Remove or comment out the variable
echo "# NEXT_PUBLIC_MOCK_MODE=true" > .env.local

# Or delete the file entirely
rm .env.local

# Restart dev server
npm run dev
```

## 🎯 Mock vs Real Mode

| Feature | Mock Mode | Real Mode |
|---------|-----------|-----------|
| Wallet Connection | ✅ Simulated | 🔗 RainbowKit |
| Token Balances | 📊 Dynamic mock data | 💰 Real blockchain |
| Market Creation | ⚡ Instant | ⛽ Gas + confirmation |
| Trading | 🎮 Simulated | 💎 Real transactions |
| Price Updates | 🤖 Algorithmic | 📈 Market-driven |
| Network Required | ❌ Works offline | ✅ Fraxtal testnet |

## 🧩 Technical Implementation

The mock system is built with:
- **`lib/mock-data.ts`** - Core mock data and functions
- **`hooks/useFraxtalMarketsMock.ts`** - Enhanced hook with mock support
- **Environment detection** - Automatic mode switching
- **State management** - Persistent mock state during session
- **Realistic delays** - Simulated network latency

## 🔧 Customization

You can customize the mock data by editing `lib/mock-data.ts`:

```typescript
// Add new markets
export const mockMarkets = [
  // ... existing markets
  {
    id: 6,
    question: "Your custom market question?",
    category: "CUSTOM",
    // ... other properties
  }
];

// Modify balances
export const mockWalletState = {
  // ... existing state
  frxUSDBalance: "5000.00", // Custom balance
};
```

## 🚨 Important Notes

- **Development Only** - Mock mode is for development/testing only
- **No Real Transactions** - All transactions are simulated
- **Data Persistence** - Mock data resets on page refresh
- **Environment Variable** - Controlled by `NEXT_PUBLIC_MOCK_MODE`

## 🆘 Troubleshooting

### Mock Mode Not Working?
1. Check `.env.local` exists with `NEXT_PUBLIC_MOCK_MODE=true`
2. Restart your development server
3. Clear browser cache/localStorage
4. Check console for any errors

### Want Real Blockchain?
1. Remove/comment `NEXT_PUBLIC_MOCK_MODE=true` from `.env.local`
2. Ensure you have testnet tokens
3. Connect to Fraxtal testnet
4. Restart development server

---

**Happy developing! 🚀** Mock mode lets you build and test your prediction market features without waiting for testnet tokens.
