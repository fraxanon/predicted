# 🚀 Fraxtal Testnet Deployment Guide

## 📋 Prerequisites

### 1. **Set up Environment Variables**
Create a `.env` file with your wallet private key:

```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and add your private key
PRIVATE_KEY=your_wallet_private_key_here
```

### 2. **Get Fraxtal Testnet ETH**
- **Network**: Fraxtal Testnet (Chain ID: 2522)
- **RPC**: https://rpc.testnet.frax.com
- **Explorer**: https://holesky.fraxscan.com
- **Faucet**: You'll need testnet ETH for deployment fees

### 3. **Add Fraxtal Testnet to MetaMask**
```
Network Name: Fraxtal Testnet
RPC URL: https://rpc.testnet.frax.com
Chain ID: 2522
Currency Symbol: frxETH
Block Explorer: https://holesky.fraxscan.com
```

## 🔧 Deployment Commands

### **Deploy to Testnet:**
```bash
npm run contracts:compile
npm run contracts:deploy:fraxtal-testnet
```

### **Deploy to Mainnet (when ready):**
```bash
npm run contracts:deploy:fraxtal
```

## 📊 After Deployment

1. **Check deployment info** in `./deployments/fraxtal-testnet.json`
2. **Update contract addresses** in `lib/fraxtal-config.ts`
3. **Test market creation** through the UI

## 🧪 Testing Checklist

- [ ] Contract deploys successfully
- [ ] Can connect wallet to Fraxtal testnet
- [ ] Can create a test market
- [ ] Market appears in dashboard
- [ ] Can buy shares (if you have test frxUSD)

## 🔍 Verification

After deployment, verify on Fraxscan:
- Contract address will be shown in deployment output
- Visit: https://holesky.fraxscan.com/address/YOUR_CONTRACT_ADDRESS

## 🚨 Important Notes

- **Testnet uses mock frxUSD** address for testing
- **Real mainnet** will use actual frxUSD contract
- **Keep your private key secure** - never commit to git
- **Test thoroughly** before mainnet deployment
