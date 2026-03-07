# TokenizeArt42

![Status](https://img.shields.io/badge/status-deployed-brightgreen)
![Network](https://img.shields.io/badge/network-Ethereum%20Sepolia-blue)
![Standard](https://img.shields.io/badge/standard-ERC--721-orange)
![Solidity](https://img.shields.io/badge/solidity-0.8.20-lightgrey)

> NFT collection built on Ethereum Sepolia Testnet — 42 School Web3 Curriculum

---

## Deployed Contract

| Property | Value |
|---|---|
| **Contract Address** | `0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25` |
| **Network** | Ethereum Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Token Name** | TokenizeArt42 |
| **Symbol (Ticker)** | TA42 |
| **Standard** | ERC-721 |
| **Max Supply** | 42 NFTs |
| **Owner** | `0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483` |

### Links

- **Contract on Etherscan:** https://sepolia.etherscan.io/address/0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25#code
- **Token #0:** https://sepolia.etherscan.io/token/0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25?a=0
- **Mint transaction:** https://sepolia.etherscan.io/tx/0xa33d0bfae2179247d5290950bd89dab919c814be627f9697779675823d8d8d0e
- **Metadata (IPFS):** https://ipfs.io/ipfs/bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy
- **Image (IPFS):** https://ipfs.io/ipfs/bafkreibipf6lqfem4ct2qbawruf57blpsw5cez3p54apdjgd3u22gwr7ca

---

## Why These Choices

**Blockchain — Ethereum Sepolia instead of BNB Chain**
Ethereum is the original and most widely supported EVM-compatible network. Sepolia is the official Ethereum testnet recommended by the Ethereum Foundation. All major tools (Hardhat, Etherscan, OpenZeppelin) have first-class support for it.

**Standard — ERC-721**
ERC-721 is the original NFT standard defined in Ethereum Improvement Proposal 721. It ensures each token is unique and non-fungible. The contract uses `ERC721URIStorage` from OpenZeppelin which stores a separate metadata URI per token.

**Framework — Hardhat v2.22**
Mature toolchain with built-in Etherscan verification, gas reports, and test coverage. Widely used in production. Straightforward integration with ethers.js v6 via `hardhat-toolbox`.

**Libraries — OpenZeppelin Contracts v5.0**
Industry-standard audited implementations. `ERC721URIStorage` stores per-token metadata URI — each token's metadata is set at mint time and cannot be changed, which is the correct security model for NFTs.

**Storage — IPFS via Pinata**
Decentralized content-addressed storage. IPFS CIDs are hash-based: the file content determines the address, making metadata tamper-proof and permanent as long as it is pinned.

---

## Project Structure

```
tokenize-art-sepolia/
├── code/
│   └── TokenizeArt42.sol       # ERC-721 smart contract (Solidity 0.8.20)
├── deployment/
│   └── deploy.js               # Contract deployment script
├── documentation/
│   └── DOCUMENTATION.md        # Full technical documentation
├── scripts/
│   ├── mint.js                 # NFT minting script
│   └── verify-ownership.js     # Ownership verification script
├── mint-files/
│   ├── metadata.json           # NFT metadata (uploaded to IPFS)
│   └── index.html              # Web minting interface
├── images/
│   └── nft-image.svg           # NFT artwork (uploaded to IPFS)
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Node.js dependencies
├── .env                        # Environment variables template
├── .gitignore                  # Excludes .env, node_modules, artifacts
└── README.md                   # This file
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in `.env`:
```
PRIVATE_KEY=0x_your_private_key_from_metamask
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_api_key
CONTRACT_ADDRESS_SEPOLIA=0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25
```

### 3. Compile
```bash
npm run compile
```

### 4. Deploy
```bash
npm run deploy
```

### 5. Mint
```bash
npm run mint
```

### 6. Verify ownership
```bash
npm run verify-ownership
```

---

## Available Commands

```bash
npm run compile           # Compile smart contracts
npm run deploy            # Deploy to Sepolia testnet
npm run mint              # Mint an NFT
npm run verify-ownership  # Check NFT ownership (for demo)
```

---

## Security

- `.env` is in `.gitignore` — private key is never committed
- Using testnet only — no real funds at risk
- Contract verified on Etherscan — source code is public and auditable
- `onlyOwner` modifier protects `ownerMint`, `setMintPrice`, `withdraw`
- Token URI is immutable after minting — metadata cannot be tampered with

---

## Resources

- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [Pinata IPFS](https://pinata.cloud)
- [Alchemy](https://www.alchemy.com/)
- [Sepolia Faucet](https://sepoliafaucet.com)

---

*Built for 42 School Web3 Curriculum — Author: lnoisome*
