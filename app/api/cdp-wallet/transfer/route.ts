import { NextRequest, NextResponse } from 'next/server';
import { cdpWalletManager } from '../../../../lib/cdp-wallet-manager';

export async function POST(request: NextRequest) {
  try {
    const { userAddress, toAddress, amount } = await request.json();

    if (!userAddress || !toAddress || !amount) {
      return NextResponse.json(
        { success: false, error: 'User address, destination address, and amount are required' },
        { status: 400 }
      );
    }

    // Transfer funds from user's CDP wallet
    const transactionHash = await cdpWalletManager.transferFromUserWallet(
      userAddress,
      toAddress,
      amount
    );

    return NextResponse.json({
      success: true,
      transactionHash,
    });

  } catch (error) {
    console.error('CDP wallet transfer API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
