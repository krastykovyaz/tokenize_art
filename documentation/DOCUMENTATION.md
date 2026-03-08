# TokenizeArt42 — Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Smart Contract](#smart-contract)
3. [IPFS & Metadata](#ipfs--metadata)
4. [Installation](#installation)
5. [Deployment](#deployment)
6. [Minting NFTs](#minting-nfts)
7. [Verifying Ownership](#verifying-ownership)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

---

## Overview

**TokenizeArt42** is an NFT (Non-Fungible Token) collection deployed on the Ethereum Sepolia Testnet. Each token in the collection is unique and represents a digital artwork stored on IPFS.

### Deployed Contract

| Property | Value |
|---|---|
| Contract Address | `0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25` |
| Network | Ethereum Sepolia Testnet |
| Chain ID | 11155111 |
| Token Standard | ERC-721 |
| Symbol | TA42 |
| Max Supply | 42 NFTs |
| Mint Price | 0.001 ETH (free for owner) |
| Verified on Etherscan | Yes |

### Technology Stack

| Component | Technology | Version |
|---|---|---|
| Smart Contract | Solidity | 0.8.20 |
| Development Framework | Hardhat | 2.22.x |
| Contract Libraries | OpenZeppelin Contracts | 5.0.x |
| JavaScript Runtime | Node.js | 22.x LTS |
| Blockchain Interaction | ethers.js | 6.x (via hardhat-toolbox) |
| Decentralized Storage | IPFS via Pinata | — |
| Testnet | Ethereum Sepolia | chainId 11155111 |

---

## Smart Contract

### Source file: `code/TokenizeArt42.sol`

### Inheritance

```solidity
contract TokenizeArt42 is ERC721, ERC721URIStorage, Ownable
```

The contract inherits three OpenZeppelin components:

- **ERC721** — base NFT implementation: `ownerOf`, `transferFrom`, `approve`, `balanceOf`
- **ERC721URIStorage** — per-token metadata URI storage: `tokenURI`, `_setTokenURI`
- **Ownable** — access control: `onlyOwner` modifier, `owner()`, `transferOwnership`

### State Variables

```solidity
uint256 private _nextTokenId;              // Counter for next token ID (starts at 0)
uint256 public constant MAX_SUPPLY = 42;   // Hard cap — cannot be changed
uint256 public mintPrice = 0.001 ether;    // Price for public minting
string private _baseTokenURI;              // Base URI (optional, for batch metadata)
```

### Events

```solidity
event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
event MintPriceUpdated(uint256 newPrice);
event BaseURIUpdated(string newBaseURI);
```

Events are emitted on every significant state change and can be monitored on Etherscan.

### Functions

#### `safeMint(address to, string memory uri)` — public payable

Mints a new NFT for any caller who sends at least `mintPrice` ETH.

```solidity
function safeMint(address to, string memory uri) public payable {
    require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
    require(msg.value >= mintPrice, "Insufficient payment");
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    emit NFTMinted(to, tokenId, uri);
}
```

#### `ownerMint(address to, string memory uri)` — public onlyOwner

Free minting for the contract owner. Used for the initial collection setup.

```solidity
function ownerMint(address to, string memory uri) public onlyOwner {
    require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    emit NFTMinted(to, tokenId, uri);
}
```

#### `totalMinted()` — public view

Returns the number of tokens minted so far.

#### `setMintPrice(uint256 newPrice)` — public onlyOwner

Updates the public mint price. Emits `MintPriceUpdated`.

#### `withdraw()` — public onlyOwner

Transfers all ETH held by the contract to the owner.

#### `tokenURI(uint256 tokenId)` — public view override

Returns the full metadata URI for a token. Overrides both ERC721 and ERC721URIStorage as required by Solidity multiple inheritance rules.

#### `ownerOf(uint256 tokenId)` — inherited from ERC721

Returns the owner address of a given token. Used to verify ownership.

#### `supportsInterface(bytes4 interfaceId)` — public view override

Returns true for ERC721 (0x80ac58cd) and ERC165 (0x01ffc9a7) interface IDs.

### Security Design

- **Supply cap**: `require(_nextTokenId < MAX_SUPPLY)` enforced in every mint function — cannot be bypassed
- **Payment check**: `require(msg.value >= mintPrice)` prevents underpayment
- **Access control**: `onlyOwner` on `withdraw`, `ownerMint`, `setMintPrice`
- **Immutable token URI**: `_setTokenURI` is called once at mint — no update function exists
- **Overflow protection**: Solidity 0.8.x has built-in arithmetic overflow checks
- **No reentrancy risk**: No external calls to unknown contracts

---

## IPFS & Metadata

### What is IPFS

IPFS (InterPlanetary File System) is a decentralized file system that addresses content by its hash rather than its location. A CID (Content Identifier) is the hash of the file content — if the content changes, the CID changes. This makes IPFS storage tamper-proof.

### Uploaded Files

| File | IPFS CID |
|---|---|
| `nft-image.svg` | `bafkreibipf6lqfem4ct2qbawruf57blpsw5cez3p54apdjgd3u22gwr7ca` |
| `metadata.json` | `bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy` |

Files are pinned on Pinata.cloud and accessible via any IPFS gateway:

```
https://ipfs.io/ipfs/<CID>
https://gateway.pinata.cloud/ipfs/<CID>
```

### Metadata Format

NFT metadata follows the ERC-721 Metadata JSON Schema:

```json
{
  "name": "TokenizeArt42 #1",
  "description": "The legendary TokenizeArt42 NFT - A unique digital collectible from the 42 collection.",
  "image": "ipfs://bafkreibipf6lqfem4ct2qbawruf57blpsw5cez3p54apdjgd3u22gwr7ca",
  "external_url": "http://intra.42.fr",
  "attributes": [
    { "trait_type": "Artist", "value": "lnoisome" },
    { "trait_type": "Collection", "value": "TokenizeArt42" },
    { "trait_type": "Number", "value": "42" },
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Blockchain", "value": "Ethereum Sepolia" },
    { "trait_type": "Standard", "value": "ERC-721" },
    { "display_type": "number", "trait_type": "Edition", "value": 1, "max_value": 42 }
  ]
}
```

---

## Installation

### Requirements

- Node.js 22.x LTS (required — Hardhat does not support Node 23.x)
- npm
- A MetaMask wallet with Sepolia ETH

### Install Node.js with nvm (recommended)

```bash
# Install nvm
brew install nvm

# Add to shell config (~/.zshrc or ~/.bashrc)
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh"

# Reload shell
source ~/.zshrc

# Install Node.js 22 LTS
nvm install 22
nvm use 22

# Verify
node -v   # should show v22.x.x
```

### Install project dependencies

```bash
npm install
```

This installs:
- `hardhat@^2.22.0` — development framework
- `@nomicfoundation/hardhat-toolbox` — ethers.js, chai, coverage, Etherscan verification
- `@openzeppelin/contracts@^5.0.0` — ERC-721, Ownable implementations
- `dotenv` — environment variable loading

### Configure `.env`

```bash
cp .env.example .env
```

Edit `.env`:

```
PRIVATE_KEY=0x_your_wallet_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_key
CONTRACT_ADDRESS_SEPOLIA=0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25
```

**Getting an Alchemy API key:**
1. Sign up at https://www.alchemy.com/
2. Create App → Ethereum → Sepolia
3. Copy the HTTPS endpoint

**Getting an Etherscan API key:**
1. Sign up at https://etherscan.io/
2. Account → API Keys → Add
3. Copy the key

**Getting Sepolia ETH:**
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

---

## Deployment

### Compile contracts

```bash
npm run compile
```

Creates `artifacts/` with ABI and bytecode, and `cache/` for the compiler.

### Deploy to Sepolia

```bash
npm run deploy
```

The deploy script (`deployment/deploy.js`) performs the following steps:
1. Gets the deployer signer from `PRIVATE_KEY` in `.env`
2. Checks account balance
3. Deploys `TokenizeArt42` with `deployer.address` as `initialOwner`
4. Waits for deployment confirmation
5. Prints contract address, name, symbol, owner
6. Waits 5 block confirmations for Etherscan indexing

After deployment, update `.env`:

```
CONTRACT_ADDRESS_SEPOLIA=<new_address>
```

### Verify on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <DEPLOYER_ADDRESS>
```

After verification, the contract source code is visible on Etherscan under the **Contract** tab, and functions can be called directly from the browser using **Read Contract** and **Write Contract**.

---

## Minting NFTs

### Upload to IPFS first

1. Upload `images/nft-image.svg` to Pinata → copy CID
2. Update `mint-files/metadata.json` with the image CID
3. Upload `metadata.json` to Pinata → copy CID
4. Update `metadataURI` in `scripts/mint.js` with the metadata CID

### Run the mint script

```bash
npm run mint
```

The script (`scripts/mint.js`) performs:
1. Connects to contract at `CONTRACT_ADDRESS_SEPOLIA`
2. Checks `totalMinted() < MAX_SUPPLY`
3. Detects if signer is the owner → calls `ownerMint` (free) or `safeMint` (with payment)
4. Waits for transaction confirmation
5. Parses the `NFTMinted` event to get token ID
6. Calls `ownerOf(tokenId)` to verify ownership
7. Prints Etherscan links for the transaction and token

### Example output

```
🎨 Starting NFT minting process...
👤 Minting with account: 0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483
💰 Account balance: 0.389808490520246436 ETH
📡 Connecting to contract: 0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25
📊 Contract Info:
   Name: TokenizeArt42 | Symbol: TA42 | Total Minted: 0 | Max Supply: 42

🎯 Minting NFT...
   To: 0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483
   Metadata URI: ipfs://bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy
   Minting as owner (free)...
⏳ Transaction sent: 0xa33d0bfae217...
✅ Transaction confirmed in block: 10363912

🎉 NFT Minted Successfully!
   Token ID: 0
   Owner: 0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483
   Verified Owner: 0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483
   Token URI: ipfs://bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy
```

---

## Verifying Ownership

The `scripts/verify-ownership.js` script demonstrates the `ownerOf` function — a core requirement of the ERC-721 standard.

```bash
npm run verify-ownership
```

### Example output

```
🔍 NFT Ownership Verification

📡 Contract: 0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25
🌐 Network: sepolia

📊 Collection Info:
   Name: TokenizeArt42 | Symbol: TA42 | Total Minted: 1

👥 NFT Owners:
────────────────────────────────────────────────────────────────────────────────

🎨 Token ID: 0
   Owner: 0xF57aD9534cf65887a79f29A4B3Ca8Abe8C9d5483
   Metadata: ipfs://bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy
   ✅ You own this NFT!

────────────────────────────────────────────────────────────────────────────────
✨ Verification complete!
```

You can also verify directly on Etherscan:

1. Go to: https://sepolia.etherscan.io/address/0x8526237A78Dc5A3FFD89414BAd43b6aadc5e7f25#readContract
2. Click **Read Contract**
3. Find `ownerOf` → enter token ID `0` → click **Query**

---

## Security

### Private Key

- Never commit your `.env` file (`.gitignore` excludes it)
- Never share your private key
- The project only uses the Sepolia testnet — no real funds

### Smart Contract Security Model

| Threat | Protection |
|---|---|
| Minting beyond supply cap | `require(_nextTokenId < MAX_SUPPLY)` |
| Underpayment on public mint | `require(msg.value >= mintPrice)` |
| Unauthorized fund withdrawal | `onlyOwner` on `withdraw()` |
| Unauthorized free minting | `onlyOwner` on `ownerMint()` |
| Metadata tampering after mint | No `setTokenURI` function — URI is immutable |
| Arithmetic overflow | Solidity 0.8.x built-in protection |

---

## Troubleshooting

**"Insufficient funds for gas"**
Get Sepolia ETH from a faucet: https://sepoliafaucet.com/

**"ENOTFOUND" or connection timeout when running Hardhat commands (macOS)**
This is an IPv6 DNS resolution issue in Node.js. Fix:
1. System Settings → Network → Wi-Fi → Details → TCP/IP
2. Configure IPv6 → Link-local only
3. Flush DNS cache: `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`

**"Nonce too high"**
Reset MetaMask account: Settings → Advanced → Reset Account

**"Contract not found" or "call revert exception"**
Verify `CONTRACT_ADDRESS_SEPOLIA` in `.env` matches the deployed contract.

**"HardhatError: No Hardhat config file found"**
Run all commands from the project root (where `hardhat.config.js` is located).

**Node.js version warning**
Hardhat requires Node 20.x or 22.x LTS. Use `nvm use 22` to switch.

---

*TokenizeArt42 — 42 School Web3 Curriculum — Author: lnoisome*
