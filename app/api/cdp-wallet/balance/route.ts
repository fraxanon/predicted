import { NextRequest, NextResponse } from 'next/server';
import { cdpWalletManager } from '../../../../lib/cdp-wallet-manager';

export async function POST(request: NextRequest) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: 'User address is required' },
        { status: 400 }
      );
    }

    // Get user's CDP wallet balance
    const balance = await cdpWalletManager.getUserBalance(userAddress);

    return NextResponse.json({
      success: true,
      balance: {
        eth: balance.eth,
        usd: balance.usd,
      },
    });

  } catch (error) {
    console.error('CDP wallet balance API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
