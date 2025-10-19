#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

// Create or update .env.local file
const envContent = `# Environment Configuration
# Mock mode for development without testnet tokens
NEXT_PUBLIC_MOCK_MODE=true

# Add other environment variables as needed
# NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Mock mode enabled! Created .env.local with NEXT_PUBLIC_MOCK_MODE=true');
  console.log('🧪 Your app will now use simulated data instead of requiring testnet tokens');
  console.log('🔄 Restart your development server to apply changes');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}
