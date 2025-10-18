# Troubleshooting Guide

## ESM Import Issues with @iqai/adk

### Problem
```
Module not found: ESM packages (chalk) need to be imported. Use 'import' to reference the package instead.
```

### Current Solution
The app currently uses a **simplified Twitter Market Scout** that doesn't depend on the ADK package to avoid ESM compatibility issues.

### Files Affected
- `/api/scout-markets/route.ts` - Full ADK version (currently disabled)
- `/api/scout-markets-simple/route.ts` - Simplified version (currently active)
- `components/TwitterMarketScout.tsx` - Uses simplified endpoint

### Attempted Fixes
1. ✅ Added `transpilePackages: ['@iqai/adk', 'chalk']` to next.config.js
2. ✅ Added `experimental.esmExternals: true` to next.config.js
3. ✅ Used dynamic imports for ADK packages
4. ✅ Created fallback simplified version

### Future Solutions
To re-enable the full ADK version:

1. **Update Next.js** to latest version:
   ```bash
   npm update next
   ```

2. **Try alternative ADK import**:
   ```typescript
   // Instead of:
   import { AgentBuilder } from '@iqai/adk';
   
   // Try:
   const { AgentBuilder } = await import('@iqai/adk');
   ```

3. **Use separate server** for ADK agents:
   - Run ADK agents in a separate Node.js process
   - Communicate via HTTP API or message queue
   - Avoids Next.js ESM compatibility issues

4. **Wait for ADK update** that fixes ESM compatibility

### Current Functionality
The simplified version provides:
- ✅ Query-specific mock data generation
- ✅ Smart market analysis algorithms  
- ✅ Viability scoring and recommendations
- ✅ Risk assessment and opportunity identification
- ✅ Full UI integration

### Performance
- **Simplified version**: ~100ms response time
- **Full ADK version**: ~2-5s response time (when working)
- **Twitter API**: Real-time data (when configured)

### Monitoring
Check console for:
- `"Using simplified Twitter Market Scout..."` - Simplified mode active
- `"Falling back to simplified scout..."` - ADK version failed
- ESM import errors - ADK compatibility issues
