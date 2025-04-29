import hre from 'hardhat';
import { publicClient, walletClient } from '../viem.config';
import { Address, formatEther, parseEther } from 'viem';

const balanceOfToken = async (contract: any, token: string) => {
  const balanceOfToken = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'balanceOf',
    args: [walletClient.account.address],
  });
  console.log(`Balance of ${token}: ${formatEther(balanceOfToken as bigint)}`);
};

const approveToken = async (
  contract: any,
  address: Address,
  amount: bigint,
  token: string,
) => {
  console.log(`Approving ${formatEther(amount)} ${token} for MinimalDEX...`);
  const approveTokenTx = await walletClient.writeContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'approve',
    args: [address, amount],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveTokenTx });
  console.log('Approved');
};

const allowanceOfToken = async (
  contract: any,
  address: Address,
  token: string,
) => {
  const allowanceOfToken = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: 'allowance',
    args: [walletClient.account.address, address],
  });
  console.log(
    `Allowance of ${token} for MinimalDEX: ${formatEther(
      allowanceOfToken as bigint,
    )}`,
  );
};

const reserveOfToken = async (contract: any, reserveToken: string) => {
  const reserve = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: reserveToken,
    args: [],
  });
  console.log(`${reserveToken}: `, formatEther(reserve as bigint));
};

const main = async () => {
  // 1. Deploy TokenA and TokenB
  console.log('Deploying TokenA...');
  const tokenA = await hre.viem.deployContract(
    'SimpleERC20',
    ['TokenA', 'TKA', 18, 500n],
    {
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    },
  );
  console.log(`TokenA deployed to ${tokenA.address}`);

  console.log('----------');

  console.log('Deploying TokenB...');
  const tokenB = await hre.viem.deployContract(
    'SimpleERC20',
    ['TokenB', 'TKB', 18, 500n],
    {
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    },
  );

  console.log(`TokenB deployed to ${tokenB.address}`);

  console.log('----------');

  // 2. Deploy DEX
  console.log('Deploying MinimalDEX...');
  const minimalDEX = await hre.viem.deployContract(
    'MinimalDEX',
    [tokenA.address, tokenB.address],
    {
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    },
  );
  console.log(`MinimalDEX deployed to ${minimalDEX.address}`);

  console.log('----------');

  console.log('Print some info...');

  await balanceOfToken(tokenA, 'TokenA');
  await balanceOfToken(tokenB, 'TokenB');

  console.log('----------');

  await approveToken(tokenA, minimalDEX.address, parseEther('100'), 'TokenA');
  await allowanceOfToken(tokenA, minimalDEX.address, 'TokenA');

  console.log('----------');

  await approveToken(tokenB, minimalDEX.address, parseEther('100'), 'TokenB');
  await allowanceOfToken(tokenB, minimalDEX.address, 'TokenB');

  console.log('----------');

  // 3. Add liquidity
  console.log('Adding liquidity...');
  const addLiquidityTx = await walletClient.writeContract({
    address: minimalDEX.address,
    abi: minimalDEX.abi,
    functionName: 'addLiquidity',
    args: [parseEther('100'), parseEther('100')],
  });
  await publicClient.waitForTransactionReceipt({ hash: addLiquidityTx });

  console.log('----------');

  await reserveOfToken(minimalDEX, 'reserveA');
  await reserveOfToken(minimalDEX, 'reserveB');

  console.log('----------');

  await balanceOfToken(tokenA, 'TokenA');
  await balanceOfToken(tokenB, 'TokenB');

  console.log('----------');

  // 4. Swap TokenA to TokenB
  console.log('Preparing for Swap...');

  await approveToken(tokenA, minimalDEX.address, parseEther('10'), 'TokenA');
  await allowanceOfToken(tokenA, minimalDEX.address, 'TokenA');

  console.log('----------');

  console.log('Swapping 10 TokenA for TokenB...');
  const swapTokenAToBTx = await walletClient.writeContract({
    address: minimalDEX.address,
    abi: minimalDEX.abi,
    functionName: 'swap',
    args: [tokenA.address, parseEther('10')],
  });
  await publicClient.waitForTransactionReceipt({ hash: swapTokenAToBTx });

  console.log('----------');

  await reserveOfToken(minimalDEX, 'reserveA');
  await reserveOfToken(minimalDEX, 'reserveB');

  console.log('----------');

  await balanceOfToken(tokenA, 'TokenA');
  await balanceOfToken(tokenB, 'TokenB');

  console.log('---------');

  // 5. Remove liquidity
  console.log('Removing 30 liquidity...');
  const removeLiquidityTx = await walletClient.writeContract({
    address: minimalDEX.address,
    abi: minimalDEX.abi,
    functionName: 'removeLiquidity',
    args: [parseEther('30')],
  });
  await publicClient.waitForTransactionReceipt({ hash: removeLiquidityTx });

  console.log('----------');

  await reserveOfToken(minimalDEX, 'reserveA');
  await reserveOfToken(minimalDEX, 'reserveB');
};

main();
