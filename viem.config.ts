import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import hre from 'hardhat';

const networkName = hre.network.name;

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

const config = {
  chain: networkName === 'ah' ? ahChain : localChain,
  PRIVATE_KEY: privateKeyToAccount(
    (networkName === 'ah'
      ? process.env.AH_PRIV_KEY!
      : process.env.LOCAL_PRIV_KEY!) as Address,
  ),
};

export const publicClient = createPublicClient({
  chain: config.chain,
  transport: http(),
});

export const walletClient = createWalletClient({
  account: config.PRIVATE_KEY,
  chain: config.chain,
  transport: http(),
});
