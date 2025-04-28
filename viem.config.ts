import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const localChain = defineChain({
  id: 420420420,
  name: 'polkavm',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  testnet: true,
});

const ahChain = defineChain({
  id: 420420421,
  name: 'ah',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  testnet: true,
});

const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.LOCAL_PRIV_KEY! as `0x${string}`),
  chain: ahChain,
  transport: http(),
});
