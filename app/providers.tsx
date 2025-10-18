'use client';

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, baseSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

// Define Fraxtal chain manually
const fraxtal = {
  id: 252,
  name: 'Fraxtal',
  network: 'fraxtal',
  nativeCurrency: {
    decimals: 18,
    name: 'Frax Ether',
    symbol: 'frxETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.frax.com'] },
    default: { http: ['https://rpc.frax.com'] },
  },
  blockExplorers: {
    default: { name: 'FraxScan', url: 'https://fraxscan.com' },
  },
  testnet: false,
};

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia, base, mainnet, polygon, arbitrum, optimism, fraxtal],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || 'demo' }),
    publicProvider(),
  ]
);

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: '[Predicted] - Web3 Prediction Markets',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2f5a2b1c8d3e4f5a6b7c8d9e0f1a2b3c',
  chains,
});

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={{
            blurs: {
              modalOverlay: 'small',
            },
            colors: {
              accentColor: '#f97316',
              accentColorForeground: '#09090b',
              actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
              actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
              actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
              closeButton: 'rgba(255, 255, 255, 0.6)',
              closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
              connectButtonBackground: '#f97316',
              connectButtonBackgroundError: '#ef4444',
              connectButtonInnerBackground: 'linear-gradient(0deg, rgba(249, 115, 22, 0.075), rgba(249, 115, 22, 0.15))',
              connectButtonText: '#09090b',
              connectButtonTextError: 'white',
              connectionIndicator: '#f97316',
              downloadBottomCardBackground: 'linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #18181b',
              downloadTopCardBackground: 'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #18181b',
              error: '#ef4444',
              generalBorder: 'rgba(255, 255, 255, 0.08)',
              generalBorderDim: 'rgba(255, 255, 255, 0.04)',
              menuItemBackground: 'rgba(255, 255, 255, 0.1)',
              modalBackdrop: 'rgba(0, 0, 0, 0.8)',
              modalBackground: '#18181b',
              modalBorder: 'rgba(255, 255, 255, 0.08)',
              modalText: '#ffffff',
              modalTextDim: '#a1a1aa',
              modalTextSecondary: '#71717a',
              profileAction: 'rgba(255, 255, 255, 0.1)',
              profileActionHover: 'rgba(255, 255, 255, 0.2)',
              profileForeground: 'rgba(255, 255, 255, 0.05)',
              selectedOptionBorder: 'rgba(249, 115, 22, 0.3)',
              standby: '#fbbf24',
            },
            fonts: {
              body: 'Inter, system-ui, sans-serif',
            },
            radii: {
              actionButton: '0px',
              connectButton: '0px',
              menuButton: '0px',
              modal: '0px',
              modalMobile: '0px',
            },
            shadows: {
              connectButton: '0px 4px 12px rgba(0, 0, 0, 0.3)',
              dialog: '0px 8px 32px rgba(0, 0, 0, 0.5)',
              profileDetailsAction: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.3)',
              selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
          modalSize="compact"
          initialChain={baseSepolia}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
