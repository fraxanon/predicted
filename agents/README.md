# Twitter Market Scout Agent

An AI agent built with IQ ADK-TS that searches Twitter for trending topics and analyzes their potential as prediction markets.

## ✅ ADK Integration Status: ACTIVE

The TwitterMarketScout is now fully integrated with the @iqai/adk framework and ready for hackathon use!

## Overview

The Twitter Market Scout Agent uses the IQ Agent Development Kit (ADK-TS) to:

1. **Search Twitter** for trending topics and breaking news
2. **Analyze content** for prediction market viability 
3. **Generate market questions** with clear, verifiable outcomes
4. **Assess risk factors** and opportunities
5. **Provide recommendations** on market creation

## Architecture

### Components

- **TwitterSearchTool**: Searches Twitter for relevant content (real Twitter API v2 integration with mock fallback)
- **MarketAnalysisTool**: Analyzes tweets for prediction market potential
- **TwitterMarketScout**: Main agent orchestrator using ADK-TS AgentBuilder

### Features

- **Multi-category analysis**: Crypto, Tech, Sports, Politics, Finance, Entertainment
- **Viability scoring**: 0-1 score based on engagement, clarity, and timeline
- **Risk assessment**: Identifies potential manipulation or unclear outcomes
- **Opportunity identification**: Highlights high-potential markets
- **Automated recommendations**: Create, Monitor, or Skip suggestions

## Usage

### Basic Market Scouting

```typescript
const scout = new TwitterMarketScout();
await scout.initialize();

const report = await scout.scoutMarkets([
  'crypto', 'AI', 'bitcoin', 'tech', 'election'
]);

console.log(scout.getFormattedReport(report));
```

### Specific Topic Analysis

```typescript
const analyses = await scout.analyzeSpecificTopic('Tesla earnings');
```

### API Endpoints

- `POST /api/scout-markets` - Run full market scouting
- `GET /api/scout-markets?topic=<topic>` - Analyze specific topic

## Configuration

### Environment Variables

```bash
# Required for production LLM usage
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Other providers
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# For real Twitter integration (future)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```

### Default Settings

- **Model**: OpenAI GPT-4o-mini (configurable)
- **Timeframe**: 24 hours
- **Min Engagement**: 100 interactions
- **Max Results**: 10 markets per search
- **Twitter API**: v2 with real-time data

## Market Categories

The agent analyzes content across these categories:

- **Crypto**: Bitcoin, Ethereum, DeFi, NFTs
- **Tech**: AI, startups, IPOs, product launches  
- **Sports**: NFL, NBA, championships, playoffs
- **Politics**: Elections, policy decisions, government
- **Finance**: Fed decisions, earnings, market events
- **Entertainment**: Movies, awards, streaming
- **Climate**: Environmental policies, carbon markets

## Scoring Algorithm

Markets are scored based on:

- **Engagement** (40%): Likes, retweets, replies
- **Relevance** (30%): Content relevance to query
- **Market Potential** (30%): High/Medium/Low classification
- **Bonuses**: Clear announcements, specific dates
- **Penalties**: Rumors, speculation without sources

## Example Output

```
🤖 TWITTER MARKET SCOUT REPORT
Generated: 10/17/2025, 11:26:00 AM
Query: crypto, AI, bitcoin, tech, election

📊 SUMMARY
Analyzed 12 viable prediction markets across categories: crypto (5), tech (4), politics (3). 
Average viability score: 0.78. 3 markets recommended for immediate creation.

🎯 TOP RECOMMENDATIONS (3)

1. Will a Bitcoin ETF be approved by the SEC before end of 2024?
   Category: crypto | Viability: 88%
   Timeframe: 3 months | Est. Volume: $50k+
   Reasoning: High engagement (2,457 interactions) indicates strong public interest...
```

## Future Enhancements

- **Real Twitter API integration** with proper authentication
- **Sentiment analysis** for market direction prediction
- **Historical performance tracking** of generated markets
- **Integration with prediction market protocols** for automatic deployment
- **Multi-language support** for global market discovery
- **Image/video content analysis** for richer context

## Dependencies

- `@iqai/adk`: IQ Agent Development Kit for TypeScript
- `next`: Next.js framework for API endpoints
- `react`: React components for UI integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details
