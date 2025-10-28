import { NextRequest, NextResponse } from 'next/server';
import { TwitterMarketScout } from '../../../agents/TwitterMarketScout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      queries = ['crypto', 'AI', 'bitcoin', 'tech', 'election'],
      timeframe = '24h',
      minEngagement = 100,
      maxResults = 10
    } = body;

    console.log('🚀 Initializing Twitter Market Scout...');
    
    // Initialize the scout agent
    const scout = new TwitterMarketScout();
    await scout.initialize();

    console.log('🔍 Starting market scouting process...');
    
    // Scout for markets
    const report = await scout.scoutMarkets(queries, {
      timeframe,
      minEngagement,
      maxResults
    });

    console.log('✅ Market scouting completed successfully');

    return NextResponse.json({
      success: true,
      data: report,
      formattedReport: scout.getFormattedReport(report)
    });

  } catch (error) {
    console.error('❌ Error in market scouting:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to scout markets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json({
        success: false,
        error: 'Topic parameter is required'
      }, { status: 400 });
    }

    console.log(`🎯 Analyzing specific topic: "${topic}"`);
    
    // Initialize the scout agent
    const scout = new TwitterMarketScout();
    await scout.initialize();

    // Analyze specific topic
    const analyses = await scout.analyzeSpecificTopic(topic);

    return NextResponse.json({
      success: true,
      data: {
        topic,
        analyses,
        count: analyses.length
      }
    });

  } catch (error) {
    console.error('❌ Error in topic analysis:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze topic',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
