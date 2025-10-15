'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AgentActivity {
  id: string;
  agentName: string;
  agentEmoji: string;
  action: string;
  details: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
  amount?: number;
  currency?: string;
}

export function AgentNotificationBell() {
  const { address } = useAccount();
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadActivities();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        generateMockActivity();
      }
    }, 12000); // New activity every 12 seconds

    return () => clearInterval(interval);
  }, [address, isLive]);

  const loadActivities = () => {
    if (!address) return;

    const savedActivities = localStorage.getItem(`agent-activities-${address}`);
    if (savedActivities) {
      try {
        const parsed = JSON.parse(savedActivities);
        const activityList = parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        })).slice(0, 10); // Keep only last 10
        setActivities(activityList);
        setUnreadCount(activityList.length);
      } catch (error) {
        console.error('Failed to load activities:', error);
        generateInitialActivities();
      }
    } else {
      generateInitialActivities();
    }
  };

  const generateInitialActivities = () => {
    const initialActivities: AgentActivity[] = [
      {
        id: '1',
        agentName: 'Seer',
        agentEmoji: '🔮',
        action: 'News Analysis',
        details: 'Processing 12 new Web3 news articles for market impact',
        timestamp: new Date(Date.now() - 60000),
        status: 'success'
      },
      {
        id: '2',
        agentName: 'Prophet',
        agentEmoji: '📊',
        action: 'Recommendation',
        details: 'Found high-confidence bet: AI/Tech market - 84% confidence',
        timestamp: new Date(Date.now() - 120000),
        status: 'success'
      }
    ];
    
    setActivities(initialActivities);
    setUnreadCount(initialActivities.length);
    saveActivities(initialActivities);
  };

  const generateMockActivity = () => {
    const mockActivities = [
      {
        agentName: 'Seer',
        agentEmoji: '🔮',
        action: 'News Analysis',
        details: 'Processing 12 new Web3 news articles for market impact',
        status: 'success' as const
      },
      {
        agentName: 'Prophet',
        agentEmoji: '📊',
        action: 'Recommendation',
        details: 'Found high-confidence bet: AI/Tech market - 84% confidence',
        status: 'success' as const
      },
      {
        agentName: 'Cashier',
        agentEmoji: '💳',
        action: 'Investment Executed',
        details: 'Invested $200 frxUSD in Tesla prediction market',
        status: 'success' as const,
        amount: 200,
        currency: 'frxUSD'
      },
      {
        agentName: 'Deployer',
        agentEmoji: '🏪',
        action: 'Market Created',
        details: 'Deployed new market: "Will Solana hit $200 by Q2 2025?"',
        status: 'success' as const
      }
    ];

    const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
    const newActivity: AgentActivity = {
      id: Date.now().toString(),
      ...randomActivity,
      timestamp: new Date()
    };

    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 10);
      saveActivities(updated);
      return updated;
    });
    
    setUnreadCount(prev => prev + 1);
  };

  const saveActivities = (activities: AgentActivity[]) => {
    if (address) {
      localStorage.setItem(`agent-activities-${address}`, JSON.stringify(activities));
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Mark as read when opened
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-black-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-500 text-black-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Live Indicator */}
        {isLive && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-black-900 border border-black-800 shadow-xl z-50">
          {/* Header */}
          <div className="border-b border-black-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-sm">🤖 Live Agent Activity</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-black-600'}`}></div>
                <span className="text-xs text-black-400">{isLive ? 'Live' : 'Paused'}</span>
                <button
                  onClick={() => setIsLive(!isLive)}
                  className="text-xs px-2 py-1 border border-black-700 text-black-300 hover:text-white hover:border-black-600 transition-colors"
                >
                  {isLive ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="max-h-96 overflow-y-auto">
            {activities.length > 0 ? (
              <div className="space-y-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-3 hover:bg-black-800 transition-colors border-b border-black-800 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <span className="text-sm">{activity.agentEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium text-xs">{activity.agentName}</span>
                          <span className="text-black-400 text-xs">•</span>
                          <span className="text-black-400 text-xs">{activity.action}</span>
                          <div className="ml-auto">
                            {activity.status === 'pending' && (
                              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                            )}
                            {activity.status === 'success' && (
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            )}
                            {activity.status === 'error' && (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-black-300 text-xs leading-tight mb-1">{activity.details}</p>
                        <div className="flex items-center justify-between">
                          {activity.amount && (
                            <span className="text-accent-500 font-medium text-xs">
                              ${activity.amount} {activity.currency}
                            </span>
                          )}
                          <span className="text-black-500 text-xs ml-auto">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-black-500 text-sm">No agent activity yet</div>
                <div className="text-black-600 text-xs mt-1">Your agents will appear here once they start working</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-black-800 p-3">
            <div className="flex items-center justify-between">
              <span className="text-black-500 text-xs">Last 10 activities</span>
              <button
                onClick={() => setActivities([])}
                className="text-xs text-black-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
