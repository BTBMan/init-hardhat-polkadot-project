import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const SimpleStorageModule = buildModule('SimpleStorageModule', (m) => {
  const contract = m.contract('SimpleStorage');

  return { contract };
});

export default SimpleStorageModule;
