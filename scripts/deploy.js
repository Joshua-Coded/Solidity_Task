const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const TipJar = await ethers.getContractFactory("TipJar");
  const contract = await TipJar.deploy();
  await contract.waitForDeployment();

  console.log("TipJar deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
