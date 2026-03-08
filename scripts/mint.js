import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

/**
 * Minting script for TokenizeArt42 NFT on Ethereum Sepolia
 * This script mints a new NFT to the specified address
 */

async function main() {
  console.log("🎨 Starting NFT minting process...\n");

  // Get contract address from environment
  const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA;
  
  if (!contractAddress) {
    console.error("❌ Error: CONTRACT_ADDRESS_SEPOLIA not set in .env file");
    console.log("   Please deploy the contract first and add the address to .env");
    return;
  }

  // Get the signer
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Minting with account:", signer.address);
  
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Connect to the deployed contract
  console.log("📡 Connecting to contract:", contractAddress);
  const TokenizeArt42 = await hre.ethers.getContractFactory("TokenizeArt42");
  const contract = TokenizeArt42.attach(contractAddress);

  // Check contract info
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalMinted = await contract.totalMinted();
  const maxSupply = await contract.MAX_SUPPLY();
  const mintPrice = await contract.mintPrice();
  
  console.log("📊 Contract Info:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Total Minted:", totalMinted.toString());
  console.log("   Max Supply:", maxSupply.toString());
  console.log("   Mint Price:", hre.ethers.formatEther(mintPrice), "ETH\n");

  if (totalMinted >= maxSupply) {
    console.log("❌ Error: Maximum supply reached!");
    return;
  }

  // Metadata URI (replace with your IPFS hash)
  const metadataURI = "ipfs://bafkreicxrloyplpleahzvze6j67pv7vzyoiu2x43u3j6pb3dlmtca42bzy";
  
  console.log("🎯 Minting NFT...");
  console.log("   To:", signer.address);
  console.log("   Metadata URI:", metadataURI);

  try {
    // Mint as owner (free) or regular mint (with payment)
    const owner = await contract.owner();
    let tx;
    
    if (signer.address.toLowerCase() === owner.toLowerCase()) {
      console.log("   Minting as owner (free)...");
      tx = await contract.ownerMint(signer.address, metadataURI);
    } else {
      console.log("   Minting with payment:", hre.ethers.formatEther(mintPrice), "ETH");
      tx = await contract.safeMint(signer.address, metadataURI, {
        value: mintPrice
      });
    }

    console.log("⏳ Transaction sent:", tx.hash);
    console.log("   Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Get the token ID from the event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === "NFTMinted";
      } catch (e) {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      const tokenId = parsed.args.tokenId;
      console.log("\n🎉 NFT Minted Successfully!");
      console.log("   Token ID:", tokenId.toString());
      console.log("   Owner:", signer.address);
      
      // Verify ownership
      const tokenOwner = await contract.ownerOf(tokenId);
      console.log("   Verified Owner:", tokenOwner);
      
      const tokenURI = await contract.tokenURI(tokenId);
      console.log("   Token URI:", tokenURI);
      
      // Explorer link
      if (hre.network.name === "sepolia") {
        console.log("\n🔍 View on Etherscan Sepolia:");
        console.log(`   Transaction: https://sepolia.etherscan.io/tx/${tx.hash}`);
        console.log(`   NFT: https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`);
      }
    }

  } catch (error) {
    console.error("\n❌ Minting failed:");
    if (error.message.includes("Max supply reached")) {
      console.error("   The maximum supply of NFTs has been reached");
    } else if (error.message.includes("Insufficient payment")) {
      console.error("   Insufficient payment sent");
    } else {
      console.error("   Error:", error.message);
    }
    throw error;
  }

  console.log("\n✨ Minting process complete!");
}

// Execute minting
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
