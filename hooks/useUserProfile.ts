import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface UserProfile {
  interests: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentAmount: number;
  signedMessage: string;
  signature: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface PersonalizedRecommendation {
  marketId: string;
  title: string;
  category: string;
  aiPrediction: 'yes' | 'no';
  confidence: number;
  potentialReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasoning: string;
  matchScore: number; // How well it matches user interests (0-1)
  currentOdds?: { yes: number; no: number };
  endDate?: string;
}

export interface EarningsProjection {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  confidence: number;
  basedOnMarkets: number;
}

export function useUserProfile() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [earningsProjection, setEarningsProjection] = useState<EarningsProjection | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    if (address && isConnected) {
      const savedProfile = localStorage.getItem(`predicted_profile_${address}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            lastUpdated: new Date(parsed.lastUpdated)
          });
          setHasCompletedOnboarding(true);
        } catch (error) {
          console.error('Failed to parse saved profile:', error);
        }
      }
    }
  }, [address, isConnected]);

  // Save profile to localStorage and generate recommendations
  const saveProfile = useCallback(async (newProfile: Omit<UserProfile, 'createdAt' | 'lastUpdated'>) => {
    if (!address) return;

    const fullProfile: UserProfile = {
      ...newProfile,
      createdAt: profile?.createdAt || new Date(),
      lastUpdated: new Date()
    };

    setProfile(fullProfile);
    setHasCompletedOnboarding(true);
    
    // Save to localStorage
    localStorage.setItem(`predicted_profile_${address}`, JSON.stringify(fullProfile));
    
    // Generate personalized recommendations
    await generateRecommendations(fullProfile);
  }, [address, profile?.createdAt]);

  // Generate personalized recommendations based on user profile
  const generateRecommendations = useCallback(async (userProfile: UserProfile) => {
    setLoading(true);
    
    try {
      // Call our agent API to get personalized recommendations
      const response = await fetch('/api/agents/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          address
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setEarningsProjection(data.earningsProjection || null);
      } else {
        // Fallback to mock recommendations if API fails
        const mockRecommendations = generateMockRecommendations(userProfile);
        setRecommendations(mockRecommendations);
        setEarningsProjection(calculateMockEarnings(userProfile, mockRecommendations));
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      
      // Fallback to mock data
      const mockRecommendations = generateMockRecommendations(userProfile);
      setRecommendations(mockRecommendations);
      setEarningsProjection(calculateMockEarnings(userProfile, mockRecommendations));
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Generate mock recommendations based on user interests
  const generateMockRecommendations = (userProfile: UserProfile): PersonalizedRecommendation[] => {
    const allMarkets = [
      {
        marketId: 'market-1',
        title: 'Will Coinbase launch a new Layer 2 by Q4 2024?',
        category: 'l2',
        aiPrediction: 'yes' as const,
        confidence: 0.78,
        potentialReturn: 0.15,
        riskLevel: 'low' as const,
        reasoning: 'Strong technical indicators and recent Coinbase statements suggest high likelihood of L2 launch.'
      },
      {
        marketId: 'market-2',
        title: 'Major DeFi protocol announces $1B+ airdrop?',
        category: 'defi',
        aiPrediction: 'yes' as const,
        confidence: 0.65,
        potentialReturn: 0.35,
        riskLevel: 'high' as const,
        reasoning: 'Several protocols have hinted at large airdrops, but timing remains uncertain.'
      },
      {
        marketId: 'market-3',
        title: 'Bitcoin reaches $100K by end of 2024?',
        category: 'btc',
        aiPrediction: 'no' as const,
        confidence: 0.72,
        potentialReturn: 0.28,
        riskLevel: 'medium' as const,
        reasoning: 'Current market conditions and technical analysis suggest $100K is unlikely by year-end.'
      },
      {
        marketId: 'market-4',
        title: 'New Web3 gaming token launches on Fraxtal?',
        category: 'gaming',
        aiPrediction: 'yes' as const,
        confidence: 0.58,
        potentialReturn: 0.22,
        riskLevel: 'medium' as const,
        reasoning: 'Growing gaming ecosystem on Fraxtal makes new token launches probable.'
      },
      {
        marketId: 'market-5',
        title: 'Ethereum gas fees drop below 10 gwei average?',
        category: 'eth',
        aiPrediction: 'yes' as const,
        confidence: 0.83,
        potentialReturn: 0.12,
        riskLevel: 'low' as const,
        reasoning: 'Layer 2 adoption and network upgrades are reducing mainnet congestion.'
      },
      {
        marketId: 'market-6',
        title: 'Major NFT marketplace integrates with new chain?',
        category: 'nft',
        aiPrediction: 'yes' as const,
        confidence: 0.69,
        potentialReturn: 0.18,
        riskLevel: 'medium' as const,
        reasoning: 'Cross-chain expansion is a key trend for NFT marketplaces.'
      }
    ];

    // Filter and score markets based on user interests
    const scoredMarkets = allMarkets
      .filter(market => userProfile.interests.includes(market.category))
      .map(market => {
        // Calculate match score based on risk tolerance and interests
        let matchScore = 0.5; // Base score
        
        // Adjust for risk tolerance
        if (userProfile.riskTolerance === 'conservative' && market.riskLevel === 'low') matchScore += 0.3;
        if (userProfile.riskTolerance === 'moderate' && market.riskLevel === 'medium') matchScore += 0.3;
        if (userProfile.riskTolerance === 'aggressive' && market.riskLevel === 'high') matchScore += 0.3;
        
        // Boost score for high confidence predictions
        if (market.confidence > 0.75) matchScore += 0.2;
        
        return { ...market, matchScore: Math.min(1, matchScore) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6); // Top 6 recommendations

    return scoredMarkets;
  };

  // Calculate mock earnings projection
  const calculateMockEarnings = (userProfile: UserProfile, recommendations: PersonalizedRecommendation[]): EarningsProjection => {
    if (recommendations.length === 0) {
      return { daily: 0, weekly: 0, monthly: 0, yearly: 0, confidence: 0, basedOnMarkets: 0 };
    }

    // Calculate weighted average return based on match scores and confidence
    const weightedReturn = recommendations.reduce((sum, rec) => {
      return sum + (rec.potentialReturn * rec.matchScore * rec.confidence);
    }, 0) / recommendations.length;

    // Apply risk tolerance multiplier
    const riskMultiplier = userProfile.riskTolerance === 'conservative' ? 0.7 : 
                          userProfile.riskTolerance === 'aggressive' ? 1.3 : 1.0;

    const adjustedReturn = weightedReturn * riskMultiplier;
    const yearlyEarnings = userProfile.investmentAmount * adjustedReturn;

    return {
      daily: yearlyEarnings / 365,
      weekly: yearlyEarnings / 52,
      monthly: yearlyEarnings / 12,
      yearly: yearlyEarnings,
      confidence: recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length,
      basedOnMarkets: recommendations.length
    };
  };

  // Refresh recommendations
  const refreshRecommendations = useCallback(async () => {
    if (profile) {
      await generateRecommendations(profile);
    }
  }, [profile, generateRecommendations]);

  // Clear profile (logout)
  const clearProfile = useCallback(() => {
    if (address) {
      localStorage.removeItem(`predicted_profile_${address}`);
    }
    setProfile(null);
    setRecommendations([]);
    setEarningsProjection(null);
    setHasCompletedOnboarding(false);
  }, [address]);

  return {
    profile,
    recommendations,
    earningsProjection,
    loading,
    hasCompletedOnboarding,
    saveProfile,
    refreshRecommendations,
    clearProfile
  };
}
