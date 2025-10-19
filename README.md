# Fraxtal Prediction Market 🚀

A decentralized prediction market platform built for Fraxtal L2, featuring smart contract deployment, mock mode for development, and comprehensive trading functionality.

## 🎯 What This App Does

**Fraxtal Prediction Market** is a full-featured prediction market platform that allows users to:

### Core Features ✨
- **🔥 Market Creation (Forge)** - Deploy prediction markets directly to Fraxtal blockchain
- **💰 Trading Interface** - Buy/sell YES/NO shares with real-time pricing
- **📊 Portfolio Management** - Track positions, P&L, and transaction history  
- **🏛️ Treasury Dashboard** - Platform governance and fee management
- **📈 Market Analytics** - Volume, participants, and price history
- **🧪 Mock Mode** - Full functionality without testnet tokens (current state)

### Technical Architecture 🏗️
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Blockchain**: Fraxtal L2 (Testnet & Mainnet ready)
- **Wallet Integration**: RainbowKit + Wagmi
- **Smart Contracts**: Solidity contracts for market creation and trading
- **Currency**: frxUSD (native Fraxtal stablecoin)
- **Styling**: Custom dark theme with orange accents

### Live Demo 🌐
- **Full App**: https://predicted-glq2hpplo-eros-6531s-projects.vercel.app
- **Static Demo**: https://fraxtal-market-demo-26115735.surge.sh

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- MetaMask or compatible wallet

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd predicted

# Install dependencies
npm install

# Enable mock mode (recommended for development)
node scripts/enable-mock-mode.js

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app running with mock data!

## 🚧 Current Status & Blockers

### ✅ **What's Working**
- **Complete UI/UX** - All pages and components functional
- **Mock Mode** - Full app simulation with realistic data
- **Market Creation Interface** - Forge dashboard with form validation
- **Trading Simulation** - Buy/sell functionality with price updates
- **Portfolio Tracking** - Positions, P&L, transaction history
- **Responsive Design** - Mobile and desktop optimized
- **Deployment Ready** - Live on Vercel with mock data

### 🚫 **Current Blockers**

#### 1. **Testnet Tokens** (Primary Blocker)
- **Issue**: Waiting for Fraxtal testnet frxETH and frxUSD tokens
- **Impact**: Cannot test real blockchain interactions
- **Workaround**: Mock mode provides full functionality simulation
- **Timeline**: Dependent on testnet faucet availability

#### 2. **Smart Contract Deployment**
- **Issue**: Contracts not deployed to Fraxtal testnet yet
- **Dependency**: Requires testnet tokens for deployment
- **Status**: Contracts written and compiled, ready for deployment
- **Files**: `contracts/PredictionMarket.sol`, `contracts/MarketFactory.sol`

#### 3. **AI Agent Integration** (Optional Enhancement)
- **Issue**: ADK compatibility issues with current build system
- **Status**: Temporarily disabled (see `agents/TwitterMarketScout.ts`)
- **Impact**: Manual market creation only (automated scouting disabled)
- **Priority**: Low - core functionality works without agents

### 🎯 **Ready for Production**
- **Mock Mode**: Fully functional for demos and testing
- **UI Complete**: All user flows implemented
- **Smart Contracts**: Written and ready for deployment
- **Deployment**: Live and accessible via URL

## 📁 Project Structure

```
predicted/
├── app/                    # Next.js 14 app directory
│   ├── dashboard/         # Main dashboard
│   ├── forge-dashboard/   # Market creation interface
│   ├── markets/          # Market browsing
│   ├── portfolio/        # User portfolio
│   └── treasury/         # Platform treasury
├── components/           # Reusable React components
├── contracts/           # Solidity smart contracts
├── hooks/              # Custom React hooks
│   └── useFraxtalMarketsMock.ts  # Mock-enabled blockchain hook
├── lib/                # Utilities and configuration
│   ├── mock-data.ts    # Comprehensive mock data system
│   └── fraxtal-config.ts  # Fraxtal network configuration
├── agents/             # AI agents (temporarily disabled)
└── public/             # Static assets and demo files
```

## 🛠️ Development Roadmap

### ✅ **Phase 1: Foundation (Completed)**
- [x] Next.js app setup with TypeScript
- [x] TailwindCSS styling system
- [x] RainbowKit wallet integration
- [x] Fraxtal network configuration
- [x] Mock data system for development

### ✅ **Phase 2: Core UI (Completed)**
- [x] Dashboard with market overview
- [x] Market creation (Forge) interface
- [x] Trading interface with YES/NO buttons
- [x] Portfolio management dashboard
- [x] Treasury and governance pages
- [x] Responsive mobile design

### 🚧 **Phase 3: Blockchain Integration (Blocked)**
- [x] Smart contracts written (PredictionMarket.sol)
- [x] Deployment scripts prepared
- [ ] **BLOCKED**: Deploy contracts to Fraxtal testnet (needs tokens)
- [ ] **BLOCKED**: Test real trading functionality (needs tokens)
- [ ] **BLOCKED**: Validate market creation flow (needs tokens)

### 🔮 **Phase 4: Advanced Features (Future)**
- [ ] AI-powered market recommendations
- [ ] Advanced analytics and charts
- [ ] Social features and market comments
- [ ] Mobile app development
- [ ] Mainnet deployment

## 🧪 Mock Mode Guide

Since testnet tokens are not yet available, the app runs in **Mock Mode** by default:

### Features Available in Mock Mode:
- ✅ **Full UI Navigation** - All pages and components work
- ✅ **Market Creation** - Test the forge interface
- ✅ **Trading Simulation** - Buy/sell with price updates
- ✅ **Portfolio Tracking** - View positions and P&L
- ✅ **Realistic Data** - 5 sample markets with activity
- ✅ **Balance Simulation** - frxUSD ($2,847.50) and frxETH (1.2345)

### Switching to Real Mode:
```bash
# When testnet tokens become available:
# 1. Remove mock mode
rm .env.local

# 2. Deploy contracts
npm run contracts:deploy:fraxtal-testnet

# 3. Update contract addresses in lib/fraxtal-config.ts
# 4. Restart the app
npm run dev
```

## 🎯 Next Steps

### Immediate (When Testnet Tokens Available):
1. **Deploy Smart Contracts** to Fraxtal testnet
2. **Test Real Trading** with actual frxUSD/frxETH
3. **Validate Market Creation** end-to-end flow
4. **Gas Optimization** and contract improvements

### Short Term:
1. **Enhanced Analytics** - Charts and market insights
2. **Social Features** - Comments and market discussions
3. **Mobile Optimization** - PWA capabilities
4. **Performance** - Caching and optimization

### Long Term:
1. **AI Integration** - Automated market creation
2. **Advanced Trading** - Limit orders, stop losses
3. **Governance** - DAO features for platform decisions
4. **Mainnet Launch** - Production deployment

## 🏆 Project Highlights

- **🚀 Live Demo**: Fully functional app deployed and accessible
- **🧪 Mock Mode**: Complete simulation without blockchain dependencies
- **⚒️ Smart Contracts**: Production-ready Solidity contracts
- **🎨 Professional UI**: Dark theme with responsive design
- **📱 Mobile Ready**: Optimized for all screen sizes
- **🔧 Developer Friendly**: Comprehensive mock data system

## 📞 Support

For questions or issues:
- Check the [Mock Mode Guide](MOCK_MODE.md) for detailed documentation
- Review the live demo at the URLs above
- Examine the mock data in `lib/mock-data.ts`

---

**Status**: ✅ Ready for demo | 🚧 Waiting for testnet tokens | 🚀 Deployed and live
