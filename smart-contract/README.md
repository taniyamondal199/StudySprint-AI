# StudySprint CosmWasm Smart Contract on Injective

This folder contains the Rust source code for the StudySprint smart contract, which records completed study sprints and registers achievement NFT mints on the Injective blockchain.

---

## Prerequisites
- Rust compiler and Cargo toolchain
- `wasm32-unknown-unknown` target
- Docker (for rust-optimizer builds)

---

## Commands

### 1. Compile Contract
Compile the Rust contract into a WASM binary:
```bash
cargo wasm
```

### 2. Run Tests
Execute the unit tests built with `cosmwasm-multi-test`:
```bash
cargo test
```

### 3. Production Build (rust-optimizer)
Optimize the compiled WASM file using CosmWasm optimizer for deployment on Injective:
```bash
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.13
```
This produces `artifacts/studysprint_contract.wasm` which is ready to upload.

### 4. Deploy on Injective Testnet
You can upload the optimized WASM binary using the Injective developer tools or the CLI:
```bash
injectived tx wasm store artifacts/studysprint_contract.wasm \
  --from <your-key-name> \
  --chain-id injective-888 \
  --node https://testnet.rpc.injective.network \
  --gas-prices 500000000uinj \
  --gas-adjustment 1.3 \
  --gas auto
```
Instantiate the contract:
```bash
injectived tx wasm instantiate <code-id> '{"owner":"inj1..."}' \
  --label "studysprint-contract" \
  --no-admin \
  --from <your-key-name> \
  --chain-id injective-888
```
