'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TwitterMarketScout } from '../../components/TwitterMarketScout';

export default function ScoutDashboard() {
  return (
    <div className="min-h-screen bg-black-950 text-white">
      {/* Header */}
      <header className="border-b border-black-800 bg-black-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-accent-400 hover:text-accent-300">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  🐦
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Twitter Market Scout</h1>
                  <p className="text-sm text-gray-400">AI-Powered Market Discovery</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Description */}
        <div className="mb-8 bg-black-900 border border-black-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">Market Discovery Agent</h2>
              <p className="text-gray-400 text-sm mb-4">
                The Twitter Market Scout uses advanced AI to analyze trending topics on Twitter and identify 
                potential prediction market opportunities. It evaluates engagement, sentiment, and market viability 
                to recommend the most promising markets for creation.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Real Twitter API Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">AI-Powered Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Market Viability Scoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Twitter Market Scout Component */}
        <div className="space-y-6">
          <TwitterMarketScout />
        </div>

        {/* Additional Stats/Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Discovery Stats</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Markets Discovered</span>
                <span className="text-white font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-green-400 font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Viability Score</span>
                <span className="text-blue-400 font-medium">0.73</span>
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Categories</h3>
              <span className="text-2xl">🏷️</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Crypto</span>
                <span className="text-white font-medium">34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tech</span>
                <span className="text-white font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Politics</span>
                <span className="text-white font-medium">22%</span>
              </div>
            </div>
          </div>

          <div className="bg-black-900 border border-black-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Scan</span>
                <span className="text-white font-medium">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tweets Analyzed</span>
                <span className="text-white font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Markets Found</span>
                <span className="text-green-400 font-medium">12</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
