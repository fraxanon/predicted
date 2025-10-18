#!/bin/bash

# X402 Bot Setup Script
# Automates the setup process for Coinbase CDP integration

echo "🚀 X402 Bot Setup Script"
echo "========================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
else
    echo "📋 .env.local already exists"
fi

echo ""
echo "🔐 Please update .env.local with your credentials:"
echo "   COINBASE_CDP_API_KEY=97ec8687-0d98-4193-98be-d98b5c6a2314"
echo "   COINBASE_CDP_API_SECRET=jDk+/Fb2nYlEdpTT32I+18pqzMPKn/8TxfFR5d9mhloOsPOIs7vnvtsQC9caXjW1pmiwXfM3r+rpSbymcHdD+A=="
echo "   COINBASE_CDP_PROJECT_ID=your_project_id_here"
echo ""

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

echo "🧪 Testing setup..."
echo "Run these commands to test:"
echo "   1. Update .env.local with your project ID"
echo "   2. node test-real-cdp.js"
echo "   3. npm run dev"
echo ""
echo "📖 For detailed instructions, see: X402_SETUP_GUIDE.md"

# Make the test script executable
chmod +x test-real-cdp.js

echo "✅ Setup complete!"
