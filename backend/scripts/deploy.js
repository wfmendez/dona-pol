const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DonationApp = await hre.ethers.getContractFactory("DonationApp");
  console.log("Deploying the DonationApp contract...");
  
  const donationAppContract = await DonationApp.deploy();
  await donationAppContract.waitForDeployment();
  
  const contractAddress = await donationAppContract.getAddress();
  console.log(`DonationApp contract deployed to: ${contractAddress}`);

  await saveFrontendFiles(contractAddress);
}

async function saveFrontendFiles(contractAddress) {
  const contractsDir = path.join(__dirname, "..", "..", "frontend", "src", "config");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Guardar la dirección del contrato
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ DonationApp: contractAddress }, undefined, 2)
  );

  // Extraer y guardar el ABI
  const DonationAppArtifact = await hre.artifacts.readArtifact("DonationApp");
  fs.writeFileSync(
    path.join(contractsDir, "abi.json"),
    JSON.stringify(DonationAppArtifact.abi, null, 2)
  );
  
  console.log("-> Configuración del frontend (abi.json y contract-address.json) actualizada automáticamente.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
