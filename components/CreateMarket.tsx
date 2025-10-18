'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Plus, Zap, DollarSign, Calendar, Hash, Flame } from 'lucide-react';

export function CreateMarket() {
  // Simple test first
  return (
    <div className="bg-green-500 p-4 text-white rounded-lg">
      <h3>🔥 CREATE DEGEN MARKET - TEST</h3>
      <p>If you can see this, the component is working!</p>
    </div>
  );
}

export function CreateMarketFull() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CRYPTO',
    endDate: '',
    creationFee: '0.01'
  });

  const categories = ['CRYPTO', 'DEFI', 'LAUNCH', 'AIRDROP', 'GOVERNANCE', 'MEME', 'DEGEN'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Web3 integration later
    console.log('Creating market:', formData);
    alert('🚀 Market creation coming soon! Web3 integration in progress...');
  };

  if (!isExpanded) {
    return (
      <Card className="border-2 border-dashed border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <CardContent className="p-8 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="group flex flex-col items-center gap-4 w-full"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Flame className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                CREATE DEGEN MARKET
              </h3>
              <p className="text-black-400 text-sm max-w-md">
                Launch your own prediction market and earn fees from every bet. 
                <span className="text-orange-400 font-semibold"> Pay 0.01 ETH to create.</span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Badge variant="accent" className="bg-red-500/20 text-red-400 border-red-500/30">
                <Zap className="w-3 h-3 mr-1" />
                HOT
              </Badge>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <DollarSign className="w-3 h-3 mr-1" />
                EARN FEES
              </Badge>
            </div>
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-red-500/10">
      <CardHeader className="border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-orange-400">CREATE DEGEN MARKET</CardTitle>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-black-400 hover:text-white transition-colors text-sm"
          >
            ✕ Close
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Market Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Market Question *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Will Pepe reach $1 by end of 2024?"
              className="w-full px-4 py-3 bg-black-800 border border-black-600 rounded-lg text-white placeholder-black-400 focus:border-orange-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-black-400 mt-1">Make it spicy! Degen markets perform better 🌶️</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the market conditions, what counts as a win, etc..."
              rows={3}
              className="w-full px-4 py-3 bg-black-800 border border-black-600 rounded-lg text-white placeholder-black-400 focus:border-orange-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Category and End Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-black-800 border border-black-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-black-800 border border-black-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Creation Fee Display */}
          <div className="bg-black-800 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-orange-400" />
                <span className="text-white font-semibold">Creation Fee</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-orange-400">{formData.creationFee} ETH</div>
                <div className="text-xs text-black-400">≈ $25.50 USD</div>
              </div>
            </div>
            <p className="text-xs text-black-400 mt-2">
              You'll earn 2% of all trading volume on your market! 💰
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsExpanded(false)}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
            >
              <Zap className="w-4 h-4 mr-2" />
              CREATE & PAY
            </Button>
          </div>

          {/* Degen Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-black-700">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">47</div>
              <div className="text-xs text-black-400">Markets Created</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">$12.3K</div>
              <div className="text-xs text-black-400">Creator Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">89%</div>
              <div className="text-xs text-black-400">Success Rate</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
