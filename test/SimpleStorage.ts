import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import hre, { ignition } from 'hardhat';
import SimpleStorageModule from '../ignition/modules/SimpleStorage';

describe('SimpleStorage', function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();
    const { contract } = await ignition.deploy(SimpleStorageModule);

    return {
      owner,
      otherAccount,
      publicClient,
      contract,
    };
  }

  describe('Deployment', function () {
    it('Should deploy the contract', async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(contract).to.exist;
    });
  });

  describe('Store favorite number', function () {
    it('Should store successfully', async () => {
      const { contract, owner, publicClient } = await loadFixture(
        deployFixture,
      );
      const hash = await contract.write.store([10n]);
      await publicClient.waitForTransactionReceipt({ hash });

      expect(await contract.read.favoriteNumber()).to.equal(10n);
    });
  });
});
