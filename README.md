# IQ Predict - Web3 News Prediction Market

A decentralized prediction market powered by IQ AI agents that focuses on Web3 news and events.

## 🎯 Project Overview

IQ Predict is a multi-agent Web3 prediction market that:
- Uses IQ ADK for agent orchestration
- Leverages IQ ATP for AI-powered predictions
- Integrates Coinbase x402 for seamless payments
- Deploys on Fraxtal L2 for scalability
- Focuses exclusively on Web3 news and events

## 🏗️ Architecture

### Multi-Agent System
- **Oracle Agent (ATP)**: Scrapes and validates Web3 news from trusted sources
- **Prediction Market Agent (ADK)**: Creates and manages prediction markets
- **Betting Agent (ADK)**: Handles user bets and payouts via x402
- **Analytics Agent (ATP)**: Provides AI-powered outcome predictions

### Tech Stack
- **Frontend**: Next.js + TypeScript + TailwindCSS + Wagmi
- **Agents**: IQ ADK-TS + IQ ATP
- **Blockchain**: Fraxtal L2
- **Payments**: Coinbase x402
- **Currency**: $frxUSD / USDC

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm
- MetaMask or compatible wallet

### Installation
```bash
# Clone the repository
git clone https://github.com/fraxanon/predicted.git
cd predicted

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

## 📁 Project Structure

```
predicted/
├── agents/                 # IQ ADK agents
│   ├── oracle/            # Oracle Agent (ATP)
│   ├── prediction/        # Prediction Market Agent
│   ├── betting/           # Betting Agent
│   └── analytics/         # Analytics Agent
├── contracts/             # Smart contracts
├── frontend/              # Next.js web app
├── lib/                   # Shared utilities
└── docs/                  # Documentation
```

## 🏆 Hackathon Tracks

This project qualifies for multiple bonus prizes:
- **Web3/Blockchain Track** ($1,000): ADK orchestration + Fraxtal L2
- **Best Collaboration/Team Agent** ($200): Multi-agent system
- **Best Technical Implementation** ($200): Advanced ADK + x402 integration
- **Most Practical Use Case** ($200): Real-world prediction market

## 🛠️ Development Roadmap

### Week 1: Foundation
- [x] Project setup and structure
- [ ] ADK-TS boilerplate
- [ ] Oracle Agent MVP

### Week 2: Core Agents
- [ ] Prediction Market Agent
- [ ] Smart contract deployment
- [ ] Basic UI for viewing markets

### Week 3: Integration
- [ ] x402 payment flow
- [ ] ATP analytics integration
- [ ] End-to-end demo

### Week 4: Polish
- [ ] UX improvements
- [ ] Demo video
- [ ] Documentation

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

---

Built with ❤️ for the IQ AI Hackathon
