# Init hardhat polkadot project

## Running polkadot node and rpc

- Go to your polkadot-sdk folder that already has compiled
- Run `RUST_LOG="error,evm=debug,sc_rpc_server=info,runtime::revive=debug" target/release/substrate-node --dev --unsafe-rpc-external`
- Create a new terminal and run `RUST_LOG="info,eth-rpc=debug" target/release/eth-rpc`
