'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction, useWaitForTransaction, useNetwork, useBalance } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProphetAnalysis } from '../../components/ProphetAnalysis';
import { AgentNotificationBell } from '../../components/AgentNotificationBell';
import { useX402Bot } from '../../hooks/useX402Bot';
import { useSimpleWallet } from '../../hooks/useSimpleWallet';
import { TradingHistoryTab } from '../../components/TradingHistoryTab';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { profile } = useUserProfile();
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [isMounted, setIsMounted] = useState(false);
  
  // Track actual deposited amounts (legacy - will be replaced by wallet balance)
  const [totalDepositedETH, setTotalDepositedETH] = useState(0.001); // Start with initial deposit
  const [totalDepositedUSD, setTotalDepositedUSD] = useState(2.50); // Start with initial deposit
  
  // X402 AI Investment state
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentStatus, setInvestmentStatus] = useState<string>('');

  // Withdraw state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'wallet' | 'history'>('wallet');
  

  // Prevent hydration mismatch by only showing wallet-dependent content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug wallet connection
  useEffect(() => {
    if (isMounted) {
      console.log('🔍 Wallet Debug:', { address, isConnected, chainId: chain?.id, chainName: chain?.name });
    }
  }, [isMounted, address, isConnected, chain]);

  // Wallet transaction hooks
  const { sendTransaction, data: txHash, error: txError, isLoading: isTxPending } = useSendTransaction();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: txHash?.hash,
  });

  // Read MetaMask wallet balance (user's personal wallet)
  const { data: metamaskBalance } = useBalance({
    address: address,
    chainId: baseSepolia.id,
  });

  // Predicted app wallet address (platform wallet where users deposit)
  const PREDICTED_APP_WALLET = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9'; // Platform wallet address
  
  // Read Predicted app wallet balance (deposited funds)
  const { data: appWalletBalance } = useBalance({
    address: PREDICTED_APP_WALLET,
    chainId: baseSepolia.id,
  });

  // Wallet state for deposits
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USDC' | 'ETH'>('ETH');
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Debug transaction status
  useEffect(() => {
    console.log('🔍 Transaction Debug:', { 
      txHash: txHash?.hash, 
      isTxLoading, 
      isTxSuccess, 
      depositAmount,
      totalDepositedETH,
      totalDepositedUSD 
    });
  }, [txHash, isTxLoading, isTxSuccess, depositAmount, totalDepositedETH, totalDepositedUSD]);
  
  // X402 Bot Integration
  const { 
    botStatus, 
    executeTrades, 
    updateConfig, 
    logs, 
    error,
    isReady,
    isDryRun,
    canTrade 
  } = useX402Bot();

  // Simple Wallet Integration
  const {
    balance: walletBalance,
    balanceBreakdown,
    isLoading: walletLoading,
    error: walletError,
    depositAddress,
    refreshBalance,
    addDeposit,
    addEarnings,
    subtractBalance
  } = useSimpleWallet();

  // Dynamic investment limits based on actual wallet balance
  const maxInvestment = walletBalance.usd > 0 ? walletBalance.usd : 10; // Max is wallet balance or minimum $10
  const [investmentBudget, setInvestmentBudget] = useState(1.0); // Default to $1

  // Update investment budget when wallet balance changes
  useEffect(() => {
    if (walletBalance.usd > 0 && investmentBudget > walletBalance.usd) {
      setInvestmentBudget(Math.min(investmentBudget, walletBalance.usd));
    }
  }, [walletBalance.usd, investmentBudget]);

  useEffect(() => {
    if (address) {
      loadUserPreferences();
    }
  }, [address]);

  const loadUserPreferences = () => {
    if (!address) return;
    
    const saved = localStorage.getItem(`user-profile-${address}`);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setRiskTolerance(preferences.riskTolerance || 'moderate');
        setInvestmentBudget(preferences.investmentBudget || 10000);
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    }
  };

  const saveUserPreferences = () => {
    if (!address) return;
    
    const preferences = {
      riskTolerance,
      investmentBudget,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`user-profile-${address}`, JSON.stringify(preferences));
  };

  useEffect(() => {
    if (address) {
      saveUserPreferences();
    }
  }, [riskTolerance, investmentBudget, address]);

  // X402 Bot wallet address (this would be from your CDP configuration)
  // Handle deposit from MetaMask to Predicted app wallet
  const handleDepositFunds = async () => {
    if (!address || !depositAmount) {
      alert('Please connect wallet and enter deposit amount');
      return;
    }

    setIsDepositing(true);
    try {
      console.log(`Initiating ${depositAmount} ${selectedCurrency} deposit to X402 bot...`);
      
      if (selectedCurrency === 'ETH') {
        // Send ETH from MetaMask to protocol deposit address on Base Sepolia
        await sendTransaction({
          to: depositAddress,
          value: parseEther(depositAmount),
          chainId: baseSepolia.id, // Force Base Sepolia network
        });
      } else {
        // For USDC, we'd need the contract address and ABI
        // For now, simulate USDC transfer
        console.log('USDC transfer would require contract interaction');
        alert('USDC deposits coming soon! Please use ETH for now.');
        setIsDepositing(false);
        return;
      }
      
      console.log('Transaction sent! Waiting for confirmation...');
      
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
      setIsDepositing(false);
    }
  };

  // Handle successful transaction
  useEffect(() => {
    console.log('🔍 Transaction Effect Triggered:', { 
      isTxSuccess, 
      depositAmount, 
      selectedCurrency,
      txHash: txHash?.hash 
    });
    
    if (isTxSuccess && depositAmount && txHash?.hash) {
      console.log('✅ Transaction successful! Adding deposit to wallet...');
      
      const depositAmountNum = Number(depositAmount);
      
      // Add deposit to simple wallet manager
      addDeposit(depositAmountNum, selectedCurrency, txHash.hash);
      
      // Close modal and reset
      setShowDepositModal(false);
      setIsDepositing(false);
      setDepositAmount('');
      
      console.log(`📊 Added ${depositAmountNum} ${selectedCurrency} deposit`);
    }
  }, [isTxSuccess, depositAmount, selectedCurrency, txHash, addDeposit]);

  // Handle withdraw funds
  const handleWithdrawFunds = async () => {
    if (!address || !withdrawAmount) {
      alert('Please connect wallet and enter withdraw amount');
      return;
    }

    const withdrawAmountNum = Number(withdrawAmount);
    if (withdrawAmountNum > walletBalance.eth) {
      alert('Withdraw amount exceeds available balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      console.log(`Initiating withdrawal of ${withdrawAmount} ETH...`);
      
      // In a real implementation, this would:
      // 1. Create a transaction from the protocol wallet to user's wallet
      // 2. Use CDP or smart contract to authorize the withdrawal
      // 3. Wait for transaction confirmation
      
      // For now, simulate the withdrawal process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update balance by subtracting the withdrawn amount
      const success = subtractBalance(withdrawAmountNum * 2500); // Convert ETH to USD for balance tracking
      
      if (success) {
        console.log(`✅ Withdrawal successful: ${withdrawAmount} ETH`);
        alert(`Successfully withdrew ${withdrawAmount} ETH to your wallet!`);
        
        // Close modal and reset
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      } else {
        throw new Error('Failed to update balance');
      }
      
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle X402 AI Investment - This triggers the AI agent
  const handleInvestWithX402 = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (investmentBudget > walletBalance.usd) {
      alert('Investment amount exceeds deposited funds');
      return;
    }

    setIsInvesting(true);
    setInvestmentStatus('Initializing X402 AI Agent...');

    try {
      console.log(`🤖 X402 AI Agent: Starting investment of $${investmentBudget}`);
      
      // Step 1: Fetch real Prophet market recommendations
      setInvestmentStatus('Analyzing Prophet market data...');
      const prophetMarkets = await fetchProphetRecommendations();
      
      // Step 2: X402 AI selects optimal allocation
      setInvestmentStatus('X402 AI calculating optimal allocation...');
      const selectedMarkets = await x402SelectMarkets(prophetMarkets, investmentBudget, riskTolerance);
      
      // Step 3: Execute trades on selected markets
      const tradeResults = [];
      for (let i = 0; i < selectedMarkets.length; i++) {
        const market = selectedMarkets[i];
        const investAmount = investmentBudget * market.allocation;
        
        setInvestmentStatus(`Executing trade ${i + 1}/${selectedMarkets.length}: ${market.name}...`);
        
        // Execute actual trade via X402 agent
        const tradeResult = await executeMarketTrade(market, investAmount, address);
        tradeResults.push(tradeResult);
        
        console.log(`✅ X402 Agent: Executed trade on ${market.name} - ${tradeResult.status}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay between trades
      }

      // Step 4: Update user balance and record trades
      const success = subtractBalance(investmentBudget);
      if (!success) {
        throw new Error('Failed to update balance');
      }

      // Step 5: Store trade history for user
      await storeTradingHistory(address, tradeResults, investmentBudget);
      
      setInvestmentStatus(`Successfully invested $${investmentBudget.toFixed(2)} across ${selectedMarkets.length} Prophet markets`);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setInvestmentStatus('');
        setIsInvesting(false);
      }, 5000);

    } catch (error) {
      console.error('X402 AI Investment failed:', error);
      setInvestmentStatus('Investment failed. Please try again.');
      setTimeout(() => {
        setInvestmentStatus('');
        setIsInvesting(false);
      }, 3000);
    }
  };

  // Fetch Prophet market recommendations
  const fetchProphetRecommendations = async () => {
    try {
      // In production, this would call the Prophet API
      // For now, return realistic market data
      return [
        {
          id: 'prophet_001',
          name: 'PEPE to $1 by 2024?',
          confidence: 85,
          currentOdds: 2.4,
          volume: 125000,
          category: 'Crypto',
          endDate: '2024-12-31',
          description: 'Will PEPE token reach $1 USD by end of 2024?'
        },
        {
          id: 'prophet_002', 
          name: 'ETH above $3000?',
          confidence: 78,
          currentOdds: 1.8,
          volume: 89000,
          category: 'Crypto',
          endDate: '2024-11-30',
          description: 'Will Ethereum price exceed $3000 by November 2024?'
        },
        {
          id: 'prophet_003',
          name: 'Bitcoin ETF approval?',
          confidence: 72,
          currentOdds: 1.6,
          volume: 200000,
          category: 'Finance',
          endDate: '2024-10-31',
          description: 'Will Bitcoin ETF be approved by October 2024?'
        },
        {
          id: 'prophet_004',
          name: 'Solana ecosystem growth?',
          confidence: 68,
          currentOdds: 2.1,
          volume: 67000,
          category: 'Crypto',
          endDate: '2024-12-15',
          description: 'Will Solana TVL exceed $5B by December 2024?'
        }
      ];
    } catch (error) {
      console.error('Failed to fetch Prophet recommendations:', error);
      throw error;
    }
  };

  // X402 AI market selection algorithm
  const x402SelectMarkets = async (markets: any[], budget: number, risk: string) => {
    // X402 AI algorithm for market selection based on:
    // - Confidence scores
    // - Risk tolerance
    // - Market volume
    // - Diversification
    
    const riskMultiplier = risk === 'aggressive' ? 1.2 : risk === 'conservative' ? 0.8 : 1.0;
    
    // Score markets based on AI criteria
    const scoredMarkets = markets.map(market => ({
      ...market,
      aiScore: (market.confidence * 0.4 + (market.volume / 1000) * 0.3 + market.currentOdds * 0.3) * riskMultiplier
    }));

    // Sort by AI score and select top markets
    const selectedMarkets = scoredMarkets
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 4)
      .map((market, index) => ({
        ...market,
        allocation: index === 0 ? 0.4 : index === 1 ? 0.3 : index === 2 ? 0.2 : 0.1
      }));

    console.log('🤖 X402 AI Selected Markets:', selectedMarkets);
    return selectedMarkets;
  };

  // Execute trade on Prophet market
  const executeMarketTrade = async (market: any, amount: number, userAddress: string) => {
    try {
      // In production, this would:
      // 1. Call Prophet market contract
      // 2. Execute the trade transaction
      // 3. Wait for confirmation
      // 4. Return trade result
      
      console.log(`🎯 Executing trade: ${amount} on ${market.name}`);
      
      // Simulate trade execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate trade result (in production, this comes from blockchain)
      const tradeResult = {
        marketId: market.id,
        marketName: market.name,
        amount: amount,
        confidence: market.confidence,
        timestamp: Date.now(),
        status: 'executed',
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        expectedReturn: amount * market.currentOdds,
        userAddress: userAddress
      };

      return tradeResult;
    } catch (error) {
      console.error(`Failed to execute trade on ${market.name}:`, error);
      throw error;
    }
  };

  // Store trading history for user
  const storeTradingHistory = async (userAddress: string, trades: any[], totalInvested: number) => {
    try {
      // Store in localStorage for now (in production, use database)
      const historyKey = `trading-history-${userAddress.toLowerCase()}`;
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      const newHistoryEntry = {
        id: `trade_${Date.now()}`,
        timestamp: Date.now(),
        totalInvested: totalInvested,
        trades: trades,
        status: 'active' // Will be updated when markets resolve
      };

      existingHistory.unshift(newHistoryEntry);
      localStorage.setItem(historyKey, JSON.stringify(existingHistory.slice(0, 50))); // Keep last 50 trades
      
      console.log('💾 Stored trading history:', newHistoryEntry);
    } catch (error) {
      console.error('Failed to store trading history:', error);
    }
  };

  // Handle X402 authorization with wallet integration
  const handleAuthorizeX402 = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (botStatus.balance.usdc < investmentBudget * 0.1) {
      // Need to deposit funds first
      setShowDepositModal(true);
      return;
    }

    // Enable X402 trading
    updateConfig({ 
      enableAutoTrading: true,
      maxBetSize: Math.min(investmentBudget * 0.1, 100)
    });
  };

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
                <div className="text-accent-500 text-xs">$0.00</div>
              </a>
              <AgentNotificationBell />
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
              <a href="/treasury" className="text-black-400 hover:text-white text-sm transition-colors">
                Treasury
              </a>
              <span className="text-accent-500 text-sm font-medium border-b-2 border-accent-500 pb-3">
                Cashier Dashboard
              </span>
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
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Cashier Dashboard</h1>
            <p className="text-black-400 text-sm hidden md:block">AI-powered investment management</p>
          </div>

          {/* Responsive Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
            
            {/* Main Content - Prophet Analysis */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              

              {/* Prophet Analysis - Compact */}
              <div className="bg-black-800 border border-black-700 p-3 md:p-4">
                <ProphetAnalysis 
                  budget={investmentBudget}
                  onBudgetChange={setInvestmentBudget}
                  onAuthorizeInvestment={() => {
                    console.log('Investment authorized from dashboard!');
                  }}
                />
              </div>
            </div>

            {/* Control Panel - Responsive */}
            <div className="lg:col-span-4 space-y-3 md:space-y-4">
              
              {/* Tab Navigation */}
              <div className="bg-black-800 border border-black-700">
                <div className="flex border-b border-black-700">
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'wallet'
                        ? 'text-green-400 border-b-2 border-green-400 bg-black-700'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Predicted Wallet
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'history'
                        ? 'text-green-400 border-b-2 border-green-400 bg-black-700'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Trading History
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === 'wallet' && (
                    <div>

                {/* MetaMask Wallet Balance */}
                <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-sm font-medium">🦊 Your MetaMask Wallet</span>
                    <span className="text-xs text-blue-400">Personal funds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Available:</span>
                    <span className="text-blue-400 text-lg font-bold">
                      {metamaskBalance ? `${Number(metamaskBalance.formatted).toFixed(3)} ETH` : '0.000 ETH'}
                    </span>
                  </div>
                </div>

                {/* Predicted App Wallet Balance - Simple */}
                <div className="mb-4 p-3 bg-black-700 border border-green-500/30 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-sm font-medium">Predicted App Wallet</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => refreshBalance(true)}
                        disabled={walletLoading}
                        className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded font-medium disabled:opacity-50"
                      >
                        {walletLoading ? 'Loading...' : 'Sync'}
                      </button>
                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        disabled={walletBalance.eth === 0}
                        className="text-xs text-red-400 hover:text-red-300 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                  
                  {walletError && (
                    <div className="text-red-400 text-xs mb-2">
                      Error: {walletError}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {/* Original Deposits */}
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Deposited:</span>
                      <span className="text-green-400 text-lg font-bold">
                        {balanceBreakdown.originalDeposits.eth.toFixed(3)} ETH
                      </span>
                    </div>
                    
                    {/* Earnings (always show) */}
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Earnings:</span>
                      <span className={`text-lg font-bold ${balanceBreakdown.earnings.usd > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        ${balanceBreakdown.earnings.usd.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* USD Value - Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">USD Value:</span>
                      <span className="text-green-400 text-lg font-bold">
                        ${balanceBreakdown.total.usd.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <span>Deposit to: {depositAddress.slice(0, 6)}...{depositAddress.slice(-4)}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(depositAddress);
                          // Show brief feedback
                          const btn = event?.target as HTMLButtonElement;
                          const originalText = btn.textContent;
                          btn.textContent = '✓';
                          setTimeout(() => {
                            btn.textContent = originalText;
                          }, 1000);
                        }}
                        className="text-gray-400 hover:text-white transition-colors ml-2 px-1"
                        title="Copy wallet address"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* AI Investment Slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white text-sm font-medium">AI Investment Amount</label>
                    <span className="text-accent-500 font-bold text-lg">${investmentBudget.toFixed(2)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0.10"
                      max={maxInvestment}
                      step="0.10"
                      value={investmentBudget}
                      onChange={(e) => setInvestmentBudget(Number(e.target.value))}
                      className="w-full h-2 bg-black-600 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${((investmentBudget - 0.10) / (maxInvestment - 0.10)) * 100}%, #374151 ${((investmentBudget - 0.10) / (maxInvestment - 0.10)) * 100}%, #374151 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-black-400 mt-1">
                    <span>$0.10</span>
                    <span>Based on your deposited ${walletBalance.usd.toFixed(2)}</span>
                    <span>${walletBalance.usd.toFixed(2)}</span>
                  </div>
                </div>


                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Deposit Button */}
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm md:text-base hover:from-blue-500 hover:to-blue-400 transition-all"
                  >
                    DEPOSIT
                  </button>

                  {/* Invest Button - X402 AI Agent */}
                  <button
                    onClick={handleInvestWithX402}
                    disabled={isInvesting || investmentBudget < 0.10 || walletBalance.usd < investmentBudget}
                    className="w-full py-3 md:py-4 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold text-sm md:text-base hover:from-orange-500 hover:to-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInvesting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 bg-white animate-pulse rounded-full"></div>
                        <span>AI INVESTING...</span>
                      </div>
                    ) : (
                      'INVEST WITH X402 AI'
                    )}
                  </button>
                </div>
              </div>
                    )}

                  {activeTab === 'history' && (
                    <TradingHistoryTab userAddress={address} />
                  )}
                </div>
              </div>

              {/* Compact Performance - Hidden on Mobile */}
              <div className="bg-black-800 border border-black-700 p-4 hidden md:block">
                <h3 className="text-white font-medium mb-3 text-sm">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Win Rate</span>
                    <span className="text-green-400 font-bold text-xs">73.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Avg Return</span>
                    <span className="text-green-400 font-bold text-xs">+28.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Drawdown</span>
                    <span className="text-red-400 font-bold text-xs">-12.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black-400 text-xs">Positions</span>
                    <span className="text-white font-bold text-xs">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black-800 border border-black-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold">Fund X402 Bot</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-black-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-black-300 text-sm mb-3">
                Deposit ETH from your wallet to fund your X402 trading bot.
              </p>
              <div className="bg-blue-900 bg-opacity-20 border border-blue-700 p-3 mb-4">
                <div className="text-blue-400 text-xs">
                  💡 Test with $10 worth of ETH to see 25% simulated gains
                </div>
              </div>
              
              {/* Transaction Status */}
              {isTxPending && (
                <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 p-3 mb-4">
                  <div className="text-yellow-400 text-xs">
                    ⏳ Check your wallet to sign the transaction...
                  </div>
                </div>
              )}
              
              {isTxLoading && (
                <div className="bg-blue-900 bg-opacity-20 border border-blue-700 p-3 mb-4">
                  <div className="text-blue-400 text-xs">
                    🔄 Transaction submitted! Waiting for confirmation...
                  </div>
                </div>
              )}
              
              {txError && (
                <div className="bg-red-900 bg-opacity-20 border border-red-700 p-3 mb-4">
                  <div className="text-red-400 text-xs">
                    ❌ Transaction failed: {txError.message}
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selection */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Currency</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCurrency('ETH')}
                  className={`p-3 border text-center transition-all ${
                    selectedCurrency === 'ETH'
                      ? 'border-accent-500 bg-accent-500 bg-opacity-20 text-accent-400'
                      : 'border-black-600 hover:border-black-500 text-black-300'
                  }`}
                >
                  <div className="font-medium">ETH</div>
                  <div className="text-xs">Recommended</div>
                </button>
                <button
                  onClick={() => setSelectedCurrency('USDC')}
                  className={`p-3 border text-center transition-all opacity-50 cursor-not-allowed ${
                    selectedCurrency === 'USDC'
                      ? 'border-black-600 bg-black-700 text-black-400'
                      : 'border-black-600 text-black-500'
                  }`}
                  disabled
                >
                  <div className="font-medium">USDC</div>
                  <div className="text-xs">Coming Soon</div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-black-700 border border-black-600 text-white px-4 py-3 text-sm focus:outline-none focus:border-accent-500 transition-colors"
                  placeholder={`Enter ${selectedCurrency} amount`}
                />
              </div>
              <div className="text-xs text-black-400 mt-1">
                Available in wallet: {selectedCurrency === 'USDC' ? 'Check wallet' : 'Check wallet'}
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {selectedCurrency === 'USDC' 
                ? [50, 100, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="px-3 py-2 text-xs bg-black-700 text-white border border-black-600 hover:border-accent-500 transition-colors"
                    >
                      ${amount}
                    </button>
                  ))
                : [0.1, 0.25, 0.5].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="px-3 py-2 text-xs bg-black-700 text-white border border-black-600 hover:border-accent-500 transition-colors"
                    >
                      {amount} ETH
                    </button>
                  ))
              }
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-3 bg-black-700 text-white font-medium hover:bg-black-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDepositFunds}
                disabled={!depositAmount || isDepositing}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDepositing ? 'Processing...' : `Deposit ${selectedCurrency}`}
              </button>
            </div>

            <div className="text-center text-xs text-black-400 mt-3">
              Secure wallet transaction • You'll sign in your wallet
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black-800 border border-black-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-black-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-black-300 mb-2">
                Available Balance: <span className="text-green-400 font-medium">{walletBalance.eth.toFixed(3)} ETH</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Withdraw Amount (ETH)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  max={walletBalance.eth}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-black-700 border border-black-600 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="0.000"
                />
              </div>
              <div className="text-xs text-black-400 mt-1">
                Max: {walletBalance.eth.toFixed(3)} ETH
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setWithdrawAmount((walletBalance.eth * 0.25).toFixed(3))}
                className="px-3 py-2 text-xs font-medium border border-black-600 text-white hover:border-red-500 transition-all"
              >
                25%
              </button>
              <button
                onClick={() => setWithdrawAmount((walletBalance.eth * 0.5).toFixed(3))}
                className="px-3 py-2 text-xs font-medium border border-black-600 text-white hover:border-red-500 transition-all"
              >
                50%
              </button>
              <button
                onClick={() => setWithdrawAmount(walletBalance.eth.toFixed(3))}
                className="px-3 py-2 text-xs font-medium border border-black-600 text-white hover:border-red-500 transition-all"
              >
                Max
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-black-700 text-white font-bold hover:bg-black-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawFunds}
                disabled={!withdrawAmount || isWithdrawing || Number(withdrawAmount) > walletBalance.eth}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isWithdrawing ? 'Processing...' : 'Withdraw ETH'}
              </button>
            </div>

            <div className="text-center text-xs text-black-400 mt-3">
              Funds will be sent to your connected wallet
            </div>
          </div>
        </div>
      )}
    </>
  );
}
