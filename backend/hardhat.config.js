require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    // Config Polygon Amoy Testnet Network
    amoy: {
      url: process.env.ALCHEMY_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/", // Amoy RPC URL
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002, // Amoy Chain ID
    },
  },
};
