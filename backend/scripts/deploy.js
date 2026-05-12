const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\n🚀 Deploying DonationApp to: ${network}`);
  console.log(`   Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`   Balance:  ${hre.ethers.formatEther(balance)} POL\n`);

  if (balance === 0n) {
    throw new Error(
      "❌ Deployer has no funds. Get Amoy POL at: https://faucet.polygon.technology/"
    );
  }

  const DonationApp = await hre.ethers.getContractFactory("DonationApp");
  const contract = await DonationApp.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ Contract deployed at: ${address}`);
  console.log(`   Explorer: https://amoy.polygonscan.com/address/${address}\n`);

  await saveFrontendFiles(address);
}

async function saveFrontendFiles(contractAddress) {
  const configDir = path.join(__dirname, "..", "..", "frontend", "src", "config");
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(
    path.join(configDir, "contract-address.json"),
    JSON.stringify({ DonationApp: contractAddress }, null, 2)
  );

  const artifact = await hre.artifacts.readArtifact("DonationApp");
  fs.writeFileSync(
    path.join(configDir, "abi.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  // Also update the frontend .env
  const envPath = path.join(__dirname, "..", "..", "frontend", ".env");
  fs.writeFileSync(envPath, `VITE_CONTRACT_ADDRESS="${contractAddress}"\n`);

  console.log("📁 Frontend config updated:");
  console.log(`   contract-address.json → ${contractAddress}`);
  console.log(`   abi.json              → DonationApp v2 ABI (donate + donorCount + messages)`);
  console.log(`   frontend/.env         → VITE_CONTRACT_ADDRESS="${contractAddress}"`);
  console.log("\n📋 Next steps:");
  console.log("   1. Add VITE_CONTRACT_ADDRESS to your Vercel environment variables");
  console.log(`      Value: ${contractAddress}`);
  console.log("   2. git add -A && git commit -m 'deploy: DonationApp v2 on Amoy' && git push");
  console.log("\n✨ New features in v2:");
  console.log("   • donate(string message) — on-chain donation messages");
  console.log("   • donorCount()           — unique donor tracking");
  console.log("   • totalDonatedBy(addr)   — per-address total");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
