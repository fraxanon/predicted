import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAgent } from '../../../agents/analytics/AnalyticsAgent';
import { OracleAgent } from '../../../agents/oracle/OracleAgent';

// Initialize agents (in production, these would be singleton instances)
const analyticsAgent = new AnalyticsAgent();
const oracleAgent = new OracleAgent();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const marketId = searchParams.get('marketId');

  try {
    switch (action) {
      case 'dashboard':
        const dashboardData = analyticsAgent.getDashboardData();
        return NextResponse.json(dashboardData);

      case 'market-analysis':
        if (!marketId) {
          return NextResponse.json({ error: 'Market ID required' }, { status: 400 });
        }
        const analysis = analyticsAgent.getMarketAnalysis(marketId);
        return NextResponse.json(analysis || { error: 'Analysis not found' });

      case 'category-trends':
        const category = searchParams.get('category');
        if (!category) {
          return NextResponse.json({ error: 'Category required' }, { status: 400 });
        }
        const trend = analyticsAgent.getCategoryTrend(category);
        return NextResponse.json(trend || { error: 'Trend not found' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'analyze-market':
        // Trigger market analysis
        await analyticsAgent.run();
        return NextResponse.json({ success: true, message: 'Analysis started' });

      case 'check-events':
        // Trigger oracle to check for new events
        await oracleAgent.run();
        return NextResponse.json({ success: true, message: 'Event check started' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
