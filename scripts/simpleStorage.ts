import hre from 'hardhat';
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  formatEther,
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
  const publicClient = createPublicClient({
    chain: localChain,
    transport: http(),
  });
  const walletClient = createWalletClient({
    account: privateKeyToAccount(process.env.LOCAL_PRIV_KEY! as `0x${string}`),
    chain: localChain,
    transport: http(),
  });

  const SimpleStorage = await hre.viem.deployContract('SimpleStorage', [], {
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  console.log(`SimpleStorage deployed to ${SimpleStorage.address}`);
  console.log(`Current account is ${walletClient.account.address}`);
  console.log(
    `Current balance is ${formatEther(
      await publicClient.getBalance({
        address: walletClient.account.address,
      }),
    )} ETH`,
  );
  console.log(
    `Initial favorite number is ${await SimpleStorage.read.favoriteNumber()}`,
  );

  const hash = await SimpleStorage.write.store([2n]);
  await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    `Updated favorite number to ${await SimpleStorage.read.favoriteNumber()}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
