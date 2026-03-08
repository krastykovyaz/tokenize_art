import dotenv from "dotenv";
dotenv.config();
import "@nomicfoundation/hardhat-toolbox";

/**
 * Hardhat configuration for TokenizeArt42 NFT project
 * Configured for Ethereum Sepolia Testnet
 */

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  
  networks: {
    // Local development network
    hardhat: {
      chainId: 31337
    },
    
    // Ethereum Sepolia Testnet (recommended for testing)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000, // 60 seconds timeout
    },
    
    // Ethereum Mainnet (use with EXTREME caution - real ETH!)
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
      chainId: 1,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      timeout: 60000,
    }
  },
  
  // Etherscan API for contract verification
    etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: []
  },
  
  paths: {
    sources: "./code",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
