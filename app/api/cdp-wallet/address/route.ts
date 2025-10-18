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

    // Get or create CDP wallet for user
    const walletAddress = await cdpWalletManager.getUserWalletAddress(userAddress);

    return NextResponse.json({
      success: true,
      address: walletAddress,
    });

  } catch (error) {
    console.error('CDP wallet address API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
