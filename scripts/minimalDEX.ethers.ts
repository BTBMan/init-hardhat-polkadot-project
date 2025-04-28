import hre from 'hardhat';

async function main() {
  const contractFactory = await hre.ethers.getContractFactory('MinimalDEX');
  const MinimalDEX = await contractFactory.deploy(
    '0xF376c7E77595E6AEeb34B96b68e02fb6cc4b930E',
    '0x1Ba42521B619Eeaa62CAC5d2948708c3cD3e50c0',
  );
  await MinimalDEX.waitForDeployment();

  console.log(`MinimalDEX deployed to ${await MinimalDEX.getAddress()}`);

  console.log(`tokenA: ${await MinimalDEX.tokenA()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
