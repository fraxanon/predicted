'use client';

import React from 'react';

export function LiveSearchActivity() {
  return (
    <div className="bg-black-800 border border-black-700 p-3 md:p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🔍 Live Search Activity</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-black-300">🐦 Scanning Twitter for: <span className="text-blue-400">Bitcoin ETF, Ethereum, DeFi</span></span>
          <span className="text-black-400 text-xs">2.3k tweets/min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black-300">📊 Analyzing sentiment: <span className="text-green-400">Bullish (73%)</span></span>
          <span className="text-black-400 text-xs">Live</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black-300">🎯 Trending topics: <span className="text-yellow-400">Solana, AI tokens, Meme coins</span></span>
          <span className="text-black-400 text-xs">Updated 30s ago</span>
        </div>
      </div>
    </div>
  );
}
