import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
// import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-resolc';
import 'dotenv/config';
import './tasks';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: {
    hardhat: {
      // @ts-ignore
      polkavm: true,
      nodeConfig: {
        nodeBinaryPath:
          '../../Github/polkadot-sdk/target/release/substrate-node',
        rpcPort: 8000,
        dev: true,
      },
      adapterConfig: {
        adapterBinaryPath: '../../Github/polkadot-sdk/target/release/eth-rpc',
        dev: true,
      },
    },
    // polkavm local network
    polkavm: {
      // @ts-ignore
      polkavm: true,
      url: 'http://127.0.0.1:8545',
      accounts: [process.env.LOCAL_PRIV_KEY!],
    },
    // asset hub testnet
    ah: {
      // @ts-ignore
      polkavm: true,
      url: 'https://westend-asset-hub-eth-rpc.polkadot.io',
      accounts: [process.env.AH_PRIV_KEY!],
    },
  },
  resolc: {
    compilerSource: 'binary',
    settings: {
      optimizer: {
        enabled: true,
        runs: 400,
      },
      evmVersion: 'istanbul',
      compilerPath: '~/.cargo/bin/resolc',
      standardJson: true,
    },
  },
};

export default config;
