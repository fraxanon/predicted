# x402 Integration Guide

## Overview
This guide explains how to integrate Coinbase's x402 payment system for automated prediction market investments.

## Setup Steps

### 1. Get x402 API Credentials

1. **Sign up for Coinbase Developer Platform**
   - Visit: https://developers.coinbase.com/
   - Create an account and verify your identity

2. **Create x402 API Keys**
   - Navigate to CDP Dashboard
   - Go to "x402 Payments" section
   - Generate API Key and Secret
   - **Important**: Keep your secret secure and never expose it in client-side code

3. **Configure Environment Variables**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_COINBASE_X402_API_KEY=your_api_key_here
   COINBASE_X402_SECRET=your_secret_here
   ```

### 2. Environment Configuration

```typescript
// For Production
const x402Client = new X402Client({
  apiKey: process.env.NEXT_PUBLIC_COINBASE_X402_API_KEY!,
  apiSecret: process.env.COINBASE_X402_SECRET!,
  environment: 'production'
});

// For Development/Testing
const x402Client = new MockX402Client();
```

### 3. Payment Flow

#### Automated Investment Process:
1. **User Profile Setup** → User selects interests and budget
2. **AI Analysis** → Generate optimal investment recommendations
3. **Payment Creation** → Create x402 payments for each investment
4. **Execution** → Process payments to prediction market contracts
5. **Tracking** → Monitor payment status and confirmations

#### Code Example:
```typescript
// Create payment for prediction market bet
const paymentRequest: PaymentRequest = {
  amount: X402Utils.formatUSDCAmount(100), // $100 USDC
  currency: 'USDC',
  recipient: '0x1234...5678', // Market contract address
  metadata: {
    marketId: 'market-1',
    prediction: 'yes',
    userId: userAddress,
    confidence: 0.85
  }
};

const payment = await x402Client.createPayment(paymentRequest);
```

## API Reference

### X402Client Methods

#### `createPayment(request: PaymentRequest)`
Creates a new payment for a prediction market bet.

**Parameters:**
- `amount`: Amount in USDC (formatted with 6 decimals)
- `currency`: Always 'USDC' for prediction markets
- `recipient`: Smart contract address of the prediction market
- `metadata`: Additional data about the bet

**Returns:** `PaymentResponse` with payment ID and status

#### `getPaymentStatus(paymentId: string)`
Checks the current status of a payment.

**Returns:** Updated `PaymentResponse` with current status

#### `createBatchPayments(requests: PaymentRequest[])`
Creates multiple payments in a single API call for portfolio investments.

**Returns:** Array of `PaymentResponse` objects

### Utility Functions

#### `X402Utils.formatUSDCAmount(amount: number)`
Converts dollar amount to USDC format (6 decimals).

#### `X402Utils.parseUSDCAmount(amount: string)`
Converts USDC amount back to dollar format.

#### `X402Utils.validatePaymentRequest(request: PaymentRequest)`
Validates payment request before submission.

## Security Best Practices

### 1. API Key Management
- **Never expose API secrets** in client-side code
- Use environment variables for all credentials
- Rotate API keys regularly
- Use different keys for development and production

### 2. Payment Validation
- Always validate payment amounts and recipients
- Implement maximum investment limits
- Add user confirmation for large transactions
- Log all payment attempts for audit trails

### 3. Error Handling
```typescript
try {
  const payment = await x402Client.createPayment(request);
  // Handle success
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    // Handle insufficient balance
  } else if (error.message.includes('invalid recipient')) {
    // Handle invalid contract address
  } else {
    // Handle other errors
  }
}
```

## Testing

### Development Mode
The system automatically uses `MockX402Client` in development:
- Simulates real API responses
- 95% success rate for testing
- No actual payments processed
- Instant feedback for UI testing

### Sandbox Mode
For staging/testing with real API:
```typescript
const x402Client = new X402Client({
  apiKey: process.env.COINBASE_X402_API_KEY!,
  apiSecret: process.env.COINBASE_X402_SECRET!,
  environment: 'sandbox' // Use sandbox environment
});
```

## Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_COINBASE_X402_API_KEY=prod_api_key
COINBASE_X402_SECRET=prod_secret_key
```

### 2. Smart Contract Integration
- Deploy prediction market contracts to mainnet
- Update `X402Utils.generateMarketAddress()` with real contract addresses
- Ensure contracts can receive USDC payments
- Implement proper market resolution mechanisms

### 3. Monitoring
- Set up payment status monitoring
- Implement webhook handlers for payment confirmations
- Add alerting for failed payments
- Track payment success rates and performance

## Troubleshooting

### Common Issues

#### "Invalid API Key"
- Check environment variables are set correctly
- Verify API key is active in CDP dashboard
- Ensure using correct environment (sandbox vs production)

#### "Insufficient Funds"
- User needs to fund their Coinbase account with USDC
- Implement balance checking before payment creation
- Provide clear error messages to users

#### "Invalid Recipient"
- Verify smart contract addresses are correct
- Ensure contracts are deployed to correct network
- Check contract can receive USDC transfers

### Support
- Coinbase Developer Support: https://developers.coinbase.com/support
- x402 Documentation: https://docs.cdp.coinbase.com/x402/
- Community Discord: [Coinbase Developers Discord]

## Next Steps

1. **Get API Credentials** from Coinbase Developer Platform
2. **Test Integration** using MockX402Client
3. **Deploy Contracts** to your target blockchain
4. **Configure Production** environment variables
5. **Monitor and Optimize** payment success rates

The x402 integration is now ready for automated prediction market investments! 🚀
