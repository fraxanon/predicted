import { useState, useEffect } from 'react';

interface Trade {
  marketId: string;
  marketName: string;
  amount: number;
  confidence: number;
  timestamp: number;
  status: string;
  txHash: string;
  expectedReturn: number;
  userAddress: string;
}

interface TradingHistoryEntry {
  id: string;
  timestamp: number;
  totalInvested: number;
  trades: Trade[];
  status: 'active' | 'won' | 'lost';
}

interface TradingHistoryTabProps {
  userAddress: string | undefined;
}

export function TradingHistoryTab({ userAddress }: TradingHistoryTabProps) {
  const [tradingHistory, setTradingHistory] = useState<TradingHistoryEntry[]>([]);
  const [stats, setStats] = useState({ total: 0, won: 0, lost: 0, pending: 0 });

  useEffect(() => {
    if (userAddress) {
      loadTradingHistory();
    }
  }, [userAddress]);

  const loadTradingHistory = () => {
    if (!userAddress) return;

    try {
      const historyKey = `trading-history-${userAddress.toLowerCase()}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setTradingHistory(history);

      // Calculate stats
      const total = history.length;
      const won = history.filter((entry: TradingHistoryEntry) => entry.status === 'won').length;
      const lost = history.filter((entry: TradingHistoryEntry) => entry.status === 'lost').length;
      const pending = history.filter((entry: TradingHistoryEntry) => entry.status === 'active').length;

      setStats({ total, won, lost, pending });
    } catch (error) {
      console.error('Failed to load trading history:', error);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'text-green-400';
      case 'lost': return 'text-red-400';
      case 'active': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-900/20 border-green-700/50';
      case 'lost': return 'bg-red-900/20 border-red-700/50';
      case 'active': return 'bg-yellow-900/20 border-yellow-700/50';
      default: return 'bg-gray-900/20 border-gray-700/50';
    }
  };

  if (!userAddress) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-sm">Connect wallet to view trading history</div>
      </div>
    );
  }

  return (
    <div>
      {/* Trading History Content */}
      <div className="space-y-3">
        <h3 className="text-white font-medium text-sm">Recent Trades</h3>
        
        {/* Trading History List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tradingHistory.length > 0 ? (
            tradingHistory.map((entry) => (
              <div key={entry.id} className="space-y-2">
                {entry.trades.map((trade, index) => (
                  <div key={`${entry.id}-${index}`} className={`p-3 border rounded ${getStatusBg(entry.status)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status.toUpperCase()}
                      </span>
                      <span className={`text-sm font-bold ${getStatusColor(entry.status)}`}>
                        {entry.status === 'won' ? '+' : entry.status === 'lost' ? '-' : ''}${trade.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-white text-sm">{trade.marketName}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      Invested: ${trade.amount.toFixed(2)} • Confidence: {trade.confidence}% • {formatTimeAgo(entry.timestamp)}
                    </div>
                    {trade.txHash && (
                      <div className="text-gray-500 text-xs mt-1">
                        Tx: {trade.txHash}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No trades yet</div>
              <div className="text-gray-500 text-xs mt-1">
                Start investing to see your trading history
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 p-3 bg-black-700 border border-black-600 rounded">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white text-lg font-bold">{stats.total}</div>
              <div className="text-gray-400 text-xs">Total</div>
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">{stats.won}</div>
              <div className="text-gray-400 text-xs">Won</div>
            </div>
            <div>
              <div className="text-red-400 text-lg font-bold">{stats.lost}</div>
              <div className="text-gray-400 text-xs">Lost</div>
            </div>
            <div>
              <div className="text-yellow-400 text-lg font-bold">{stats.pending}</div>
              <div className="text-gray-400 text-xs">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
