import { task } from 'hardhat/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Address } from 'viem';

task('deploy-revive', 'Deploys a contract')
  .addParam('contract', 'The contract name')
  .addOptionalParam('args', 'Constructor arguments (comma-separated)')
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.viem.getWalletClients();
    console.log('Deploying with:', deployer.account.address);

    const contractName = taskArgs.contract;

    try {
      const abi = JSON.parse(
        readFileSync(
          join('artifacts', 'contracts', contractName, `${contractName}.json`),
          'utf8',
        ),
      );
      const bytecode: Address = `0x${readFileSync(
        join('artifacts', 'contracts', contractName, `${contractName}.polkavm`),
      ).toString('hex')}`;

      // Log constructor args to verify
      const constructorArgs = taskArgs.args.split(',');
      console.log('Constructor Arguments:', constructorArgs);

      const hash = await deployer.deployContract({
        abi,
        bytecode,
        args: constructorArgs,
      });
      const contract = await (
        await hre.viem.getPublicClient()
      ).waitForTransactionReceipt({
        hash: hash,
      });

      console.log(`${contractName} deployed to:`, contract.contractAddress);
    } catch (error) {
      console.error('Deployment failed:', error);
      process.exit(1);
    }
  });
