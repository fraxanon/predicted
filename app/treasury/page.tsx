'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function TreasuryDashboard() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-black-800 bg-black-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <span className="text-black-950 font-bold text-sm">[P]</span>
                </div>
                <span className="text-xs bg-accent-500 text-black-950 px-1 py-0.5 font-bold">🇺🇸</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/portfolio"
                className="text-right"
              >
                <div className="text-white text-sm font-medium">Portfolio</div>
                <div className="text-accent-500 text-xs">$6,227.88</div>
              </a>
              <ConnectButton 
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-black-800 bg-black-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex space-x-6">
              <a href="/" className="text-black-400 hover:text-white text-sm transition-colors">
                Markets
              </a>
              <a href="/docs" className="text-black-400 hover:text-white text-sm transition-colors">
                Docs
              </a>
              <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                Treasury
              </span>
              <a href="/dashboard" className="text-black-400 hover:text-white text-sm transition-colors">
                Cashier Dashboard
              </a>
              <a href="/portfolio" className="text-black-400 hover:text-white text-sm transition-colors">
                Portfolio
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-black-950 min-h-screen p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Treasury Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">Manage agent winnings, staking, and transfers</p>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            {/* Treasury Stats */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">🏦 Treasury Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-green-400">$6.23M</div>
                    <div className="text-white text-sm">Total Value Locked</div>
                    <div className="text-black-400 text-xs">Protocol treasury</div>
                  </div>
                  
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-purple-400">1B</div>
                    <div className="text-white text-sm">Total PRED Supply</div>
                    <div className="text-black-400 text-xs">Fixed token supply</div>
                  </div>
                  
                  <div className="bg-black-900 border border-black-700 rounded p-4 text-center">
                    <div className="text-xl font-bold text-blue-400">4.1%</div>
                    <div className="text-white text-sm">frxUSD APY</div>
                    <div className="text-black-400 text-xs">Treasury-backed yield</div>
                  </div>
                </div>
              </div>

              {/* PRED Token Allocation */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">🪙 PRED Token Allocation</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">vePRED Staking</div>
                        <div className="text-black-400 text-xs">Vote-escrowed governance tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold">35%</div>
                      <div className="text-black-400 text-xs">350M PRED</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">Treasury Reserves</div>
                        <div className="text-black-400 text-xs">Protocol stability & growth</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 font-bold">25%</div>
                      <div className="text-black-400 text-xs">250M PRED</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">Agent Rewards</div>
                        <div className="text-black-400 text-xs">AI agent performance incentives</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">20%</div>
                      <div className="text-black-400 text-xs">200M PRED</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">Community Fund</div>
                        <div className="text-black-400 text-xs">Grants & ecosystem development</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">10%</div>
                      <div className="text-black-400 text-xs">100M PRED</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">Team & Advisors</div>
                        <div className="text-black-400 text-xs">Core team allocation</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">6%</div>
                      <div className="text-black-400 text-xs">60M PRED</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <div>
                        <div className="text-white font-medium text-sm">Liquidity Mining</div>
                        <div className="text-black-400 text-xs">DEX liquidity incentives</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">4%</div>
                      <div className="text-black-400 text-xs">40M PRED</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent Earnings */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h2 className="text-lg font-bold text-white mb-4">🤖 Agent Earnings</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📊</span>
                      <div>
                        <div className="text-white font-medium text-sm">Prophet Analytics</div>
                        <div className="text-black-400 text-xs">73% success rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">$2,847</div>
                      <div className="text-black-400 text-xs">Total winnings</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💰</span>
                      <div>
                        <div className="text-white font-medium text-sm">Cashier Trading</div>
                        <div className="text-black-400 text-xs">68% success rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">$1,923</div>
                      <div className="text-black-400 text-xs">Total winnings</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black-900 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🔮</span>
                      <div>
                        <div className="text-white font-medium text-sm">Seer Markets</div>
                        <div className="text-black-400 text-xs">81% success rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">$1,456</div>
                      <div className="text-black-400 text-xs">Total winnings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              {/* Treasury Metrics */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-medium mb-3 text-sm">📊 Treasury Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Circulating Supply</span>
                    <span className="text-green-400 font-bold text-xs">650M PRED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Market Cap</span>
                    <span className="text-blue-400 font-bold text-xs">$8.45M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Treasury Holdings</span>
                    <span className="text-purple-400 font-bold text-xs">$6.23M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Backing Ratio</span>
                    <span className="text-yellow-400 font-bold text-xs">73.7%</span>
                  </div>
                </div>
              </div>

              {/* frxUSD Integration */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-medium mb-3 text-sm">🟣 frxUSD Integration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Treasury APY</span>
                    <span className="text-green-400 font-bold text-xs">4.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Backing Asset</span>
                    <span className="text-white font-bold text-xs">US Treasury</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Network</span>
                    <span className="text-purple-400 font-bold text-xs">Fraxtal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Protocol Fees</span>
                    <span className="text-cyan-400 font-bold text-xs">2%</span>
                  </div>
                </div>
              </div>

              {/* Community Governance */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <h3 className="text-white font-medium mb-3 text-sm">🗳️ Community Governance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Active Proposals</span>
                    <span className="text-green-400 font-bold text-xs">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Voting Power</span>
                    <span className="text-purple-400 font-bold text-xs">vePRED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Participation</span>
                    <span className="text-blue-400 font-bold text-xs">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Next Vote</span>
                    <span className="text-white font-bold text-xs">Nov 15</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
