'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AIAnalytics } from '../../../components/AIAnalytics';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Logo } from '../../../components/ui/Logo';
// Mock market data - in real app this would come from API/blockchain
const MOCK_MARKETS = {
  'market-1': {
    id: 'market-1',
    title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
    description: 'Coinbase has announced plans to develop their own Layer 2 scaling solution. This market resolves to YES if Coinbase officially launches a Layer 2 network before December 31, 2024, 11:59 PM UTC.',
    category: 'LAUNCH',
    endDate: '2024-12-31T23:59:59Z',
    totalVolume: '12,450',
    yesPrice: '0.72',
    noPrice: '0.28',
    yesVolume: '8,964',
    noVolume: '3,486',
    aiPrediction: {
      outcome: 'YES',
      confidence: 0.72,
      reasoning: 'Coinbase has strong technical capabilities and regulatory compliance. Recent hiring patterns suggest active L2 development. Market demand for enterprise-grade L2 solutions is high.',
      factors: [
        'Strong technical team with L2 experience',
        'Regulatory clarity improving for L2 solutions',
        'Competitive pressure from other exchanges',
        'Revenue potential from L2 transaction fees'
      ],
      lastUpdated: '2024-10-08T01:30:00Z'
    },
    resolutionCriteria: 'This market will resolve to YES if Coinbase officially announces and launches a Layer 2 network before the end date. The launch must include public access to deposit, trade, and withdraw functionality.',
    source: 'https://blog.coinbase.com/layer-2-announcement',
    createdAt: '2024-10-01T12:00:00Z'
  }
};

export default function MarketDetailPage() {
  const params = useParams();
  const { isConnected } = useAccount();
  const [betAmount, setBetAmount] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'yes' | 'no' | null>(null);
  
  const marketId = params.id as string;
  const market = MOCK_MARKETS[marketId as keyof typeof MOCK_MARKETS];

  if (!market) {
    return (
      <div className="min-h-screen bg-black-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Market Not Found</h1>
          <p className="text-black-400 mb-8">The requested market could not be found.</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const endDate = new Date(market.endDate);
  const isExpired = endDate < new Date();
  const yesPercentage = (parseFloat(market.yesPrice) * 100).toFixed(0);
  const noPercentage = (parseFloat(market.noPrice) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-black-950">
      {/* Header */}
      <header className="border-b border-black-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="text-black-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <Logo size="md" />
            </div>
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{market.category}</Badge>
                <span className="text-xs text-black-500 font-mono">
                  ID: {market.id.toUpperCase()}
                </span>
                {isExpired && (
                  <Badge variant="accent">EXPIRED</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {market.title}
              </h1>
              <p className="text-black-300 leading-relaxed">
                {market.description}
              </p>
            </div>

            {/* AI Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-500"></div>
                  AI PREDICTION ENGINE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-white">
                        {market.aiPrediction.outcome}
                      </span>
                      <span className="text-lg text-accent-500">
                        {(market.aiPrediction.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="confidence-bar mb-4">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${market.aiPrediction.confidence * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-black-400">
                      Confidence Level
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">KEY FACTORS</h4>
                    <ul className="space-y-1">
                      {market.aiPrediction.factors.map((factor, index) => (
                        <li key={index} className="text-xs text-black-400 flex items-start gap-2">
                          <span className="text-accent-500 mt-1">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-black-800">
                  <p className="text-sm text-black-400 italic">
                    "{market.aiPrediction.reasoning}"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Advanced AI Analytics */}
            <AIAnalytics marketId={market.id} showDashboard={false} />

            {/* Resolution Criteria */}
            <Card>
              <CardHeader>
                <CardTitle>RESOLUTION CRITERIA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-black-300 leading-relaxed">
                  {market.resolutionCriteria}
                </p>
                <div className="mt-4 pt-4 border-t border-black-800 flex items-center justify-between text-xs text-black-500">
                  <span>Source: {market.source}</span>
                  <span>Ends: {endDate.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Betting Interface */}
          <div className="space-y-6">
            {/* Market Stats */}
            <Card>
              <CardHeader>
                <CardTitle>MARKET STATS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-white">${market.totalVolume}</div>
                    <div className="text-xs text-black-400">Total Volume</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
                    </div>
                    <div className="text-xs text-black-400">Time Left</div>
                  </div>
                </div>
                
                {/* Price Distribution */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">YES</span>
                    <span className="text-sm text-white">{yesPercentage}¢</span>
                  </div>
                  <div className="h-2 bg-black-800 flex">
                    <div 
                      className="bg-white" 
                      style={{ width: `${yesPercentage}%` }}
                    ></div>
                    <div 
                      className="bg-black-600" 
                      style={{ width: `${noPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">NO</span>
                    <span className="text-sm text-white">{noPercentage}¢</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Betting Interface */}
            {isConnected ? (
              <BettingInterface 
                market={market}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                selectedPosition={selectedPosition}
                setSelectedPosition={setSelectedPosition}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Connect Wallet to Bet
                  </h3>
                  <p className="text-sm text-black-400 mb-6">
                    Connect your wallet to place bets on this market
                  </p>
                  <ConnectButton />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BettingInterface({ 
  market, 
  betAmount, 
  setBetAmount, 
  selectedPosition, 
  setSelectedPosition 
}: {
  market: any;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  selectedPosition: 'yes' | 'no' | null;
  setSelectedPosition: (position: 'yes' | 'no' | null) => void;
}) {
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const handlePlaceBet = async () => {
    if (!selectedPosition || !betAmount) return;
    
    setIsPlacingBet(true);
    
    // Mock betting process
    try {
      console.log('Placing bet:', { position: selectedPosition, amount: betAmount });
      // Here we would integrate with x402 and smart contracts
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay
      
      // Reset form
      setBetAmount('');
      setSelectedPosition(null);
      
      alert(`Bet placed successfully! ${selectedPosition.toUpperCase()} for $${betAmount}`);
    } catch (error) {
      console.error('Betting error:', error);
      alert('Failed to place bet. Please try again.');
    } finally {
      setIsPlacingBet(false);
    }
  };

  const potentialPayout = betAmount ? 
    (parseFloat(betAmount) / (selectedPosition === 'yes' ? parseFloat(market.yesPrice) : parseFloat(market.noPrice))).toFixed(2) 
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>PLACE BET</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedPosition('yes')}
            className={`p-4 border transition-all ${
              selectedPosition === 'yes' 
                ? 'border-white bg-white text-black-950' 
                : 'border-black-700 hover:border-black-600'
            }`}
          >
            <div className="text-lg font-bold">YES</div>
            <div className="text-sm opacity-75">{(parseFloat(market.yesPrice) * 100).toFixed(0)}¢</div>
          </button>
          <button
            onClick={() => setSelectedPosition('no')}
            className={`p-4 border transition-all ${
              selectedPosition === 'no' 
                ? 'border-white bg-black-700 text-white border-2' 
                : 'border-black-700 hover:border-black-600'
            }`}
          >
            <div className="text-lg font-bold">NO</div>
            <div className="text-sm opacity-75">{(parseFloat(market.noPrice) * 100).toFixed(0)}¢</div>
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            BET AMOUNT (USDC)
          </label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.00"
            className="input w-full"
            min="0"
            step="0.01"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['10', '25', '50', '100'].map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className="btn-ghost text-xs py-2"
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Potential Payout */}
        {betAmount && selectedPosition && (
          <div className="p-3 bg-black-800 border border-black-700">
            <div className="flex justify-between text-sm">
              <span className="text-black-400">Potential Payout:</span>
              <span className="text-white font-semibold">${potentialPayout}</span>
            </div>
            <div className="flex justify-between text-xs text-black-500 mt-1">
              <span>Potential Profit:</span>
              <span>${(parseFloat(potentialPayout) - parseFloat(betAmount)).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Place Bet Button */}
        <Button
          variant="primary"
          onClick={handlePlaceBet}
          disabled={!selectedPosition || !betAmount || isPlacingBet}
          className="w-full"
        >
          {isPlacingBet ? 'PLACING BET...' : `BET ${selectedPosition?.toUpperCase() || ''}`}
        </Button>

        <p className="text-xs text-black-500 text-center">
          Powered by Coinbase x402 • Fraxtal L2
        </p>
      </CardContent>
    </Card>
  );
}
