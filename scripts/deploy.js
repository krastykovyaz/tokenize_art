import hre from "hardhat";

/**
 * Deployment script for TokenizeArt42 NFT contract
 * This script deploys the contract to Ethereum Sepolia Testnet
 */

async function main() {
  console.log("🚀 Starting TokenizeArt42 NFT deployment...\n");

  // Get the deployer's account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contract with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.log("⚠️  Warning: Account balance is 0. You need Sepolia ETH to deploy.");
    console.log("   Get testnet ETH from one of these faucets:");
    console.log("   - https://sepoliafaucet.com/");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    return;
  }

  // Deploy the contract
  console.log("📦 Deploying TokenizeArt42 contract...");
  const TokenizeArt42 = await hre.ethers.getContractFactory("TokenizeArt42");
  const contract = await TokenizeArt42.deploy(deployer.address);
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ TokenizeArt42 deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 Network:", hre.network.name);
  console.log("⛓️  Chain ID:", hre.network.config.chainId);
  
  // Display contract details
  const name = await contract.name();
  const symbol = await contract.symbol();
  const maxSupply = await contract.MAX_SUPPLY();
  const owner = await contract.owner();
  
  console.log("\n📊 Contract Details:");
  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Max Supply:", maxSupply.toString());
  console.log("   Owner:", owner);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    contractName: name,
    contractSymbol: symbol,
    maxSupply: maxSupply.toString()
  };
  
  console.log("\n💾 Deployment info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Explorer link
  if (hre.network.name === "sepolia") {
    console.log("\n🔍 View on Etherscan Sepolia:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (hre.network.name === "mainnet") {
    console.log("\n🔍 View on Etherscan:");
    console.log(`   https://etherscan.io/address/${contractAddress}`);
  }
  
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);
  
  console.log("\n✨ Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Save the contract address");
  console.log("   2. Update your .env file: CONTRACT_ADDRESS_SEPOLIA=" + contractAddress);
  console.log("   3. Upload metadata to IPFS");
  console.log("   4. Run the mint script: npm run mint");
  console.log("\n💡 To verify on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress} ${deployer.address}`);
  
  return deploymentInfo;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
