// Import the ethers library from Hardhat to interact with the blockchain.
const hre = require("hardhat");

async function main() {
  // Get the ContractFactory for our DonationApp contract.
  const DonationApp = await hre.ethers.getContractFactory("DonationApp");

  // Deploy the contract.
  // This sends the contract creation transaction to the network.
  console.log("Deploying the DonationApp contract...");
  const donationAppContract = await DonationApp.deploy();

  // Wait for the contract to be deployed and mined on the blockchain.
  await donationAppContract.waitForDeployment();

  // Get the deployed contract's address and log it to the console.
  const contractAddress = await donationAppContract.getAddress();
  console.log(`DonationApp contract deployed to: ${contractAddress}`);
}

// Pattern to handle async functions and errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
