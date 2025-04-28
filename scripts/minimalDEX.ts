import hre from 'hardhat';
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

async function main() {
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
  const publicClient = createPublicClient({
    chain: ahChain,
    transport: http(),
  });
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.LOCAL_PRIV_KEY! as `0x${string}`),
    chain: ahChain,
    transport: http(),
  });

  const MinimalDEX = await hre.viem.deployContract(
    'MinimalDEX',
    [
      '0xF376c7E77595E6AEeb34B96b68e02fb6cc4b930E',
      '0x1Ba42521B619Eeaa62CAC5d2948708c3cD3e50c0',
    ],
    {
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    },
  );

  // console.log(`MinimalDEX deployed to ${MinimalDEX.address}`);
  console.log(MinimalDEX);

  console.log(`tokenA: ${await MinimalDEX.read.tokenA()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
