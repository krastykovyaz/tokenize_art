import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script to verify NFT ownership on Ethereum Sepolia
 * This demonstrates the ownerOf function as required by the project
 */

async function main() {
  console.log("🔍 NFT Ownership Verification\n");

  const contractAddress = process.env.CONTRACT_ADDRESS_SEPOLIA;
  
  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS_SEPOLIA not set in .env");
    return;
  }

  // Connect to contract
  const TokenizeArt42 = await hre.ethers.getContractFactory("TokenizeArt42");
  const contract = TokenizeArt42.attach(contractAddress);

  console.log("📡 Contract:", contractAddress);
  console.log("🌐 Network:", hre.network.name);

  // Get contract info
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalMinted = await contract.totalMinted();
  
  console.log("\n📊 Collection Info:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Total Minted:", totalMinted.toString());

  if (totalMinted.toString() === "0") {
    console.log("\n⚠️  No NFTs have been minted yet.");
    return;
  }

  console.log("\n👥 NFT Owners:");
  console.log("━".repeat(80));

  // Check ownership of all minted tokens
  for (let i = 0; i < totalMinted; i++) {
    try {
      const owner = await contract.ownerOf(i);
      const tokenURI = await contract.tokenURI(i);
      
      console.log(`\n🎨 Token ID: ${i}`);
      console.log(`   Owner: ${owner}`);
      console.log(`   Metadata: ${tokenURI}`);
      
      // Check if connected wallet is the owner
      const [signer] = await hre.ethers.getSigners();
      if (owner.toLowerCase() === signer.address.toLowerCase()) {
        console.log("   ✅ You own this NFT!");
      }
      
      // Link to view on Etherscan
      if (hre.network.name === "sepolia") {
        console.log(`   🔗 View: https://sepolia.etherscan.io/token/${contractAddress}?a=${i}`);
      }
    } catch (error) {
      console.log(`\n❌ Token ID ${i}: Error - ${error.message}`);
    }
  }

  console.log("\n" + "━".repeat(80));
  console.log("✨ Verification complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
