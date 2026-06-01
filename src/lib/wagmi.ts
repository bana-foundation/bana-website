import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [
    injected(),
    walletConnect({ projectId: '4082a4e4ce60a1b6ce99eee9ab050b53' }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
});
