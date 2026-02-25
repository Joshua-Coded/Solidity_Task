const { ethers } = require("hardhat");

async function main() {
  const [owner, addr1] = await ethers.getSigners();

  // Deploy fresh
  const TipJar = await ethers.getContractFactory("TipJar");
  const contract = await TipJar.deploy();
  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());

  // Deposit from owner
  console.log("\n--- Deposit 0.01 ETH ---");
  await contract.deposit({ value: ethers.parseEther("0.01") });
  console.log("Balance after deposit:", ethers.formatEther(await contract.getBalance()), "ETH");

  // Deposit from addr1
  console.log("\n--- addr1 deposits 0.02 ETH ---");
  await contract.connect(addr1).deposit({ value: ethers.parseEther("0.02") });
  console.log("Balance after addr1 deposit:", ethers.formatEther(await contract.getBalance()), "ETH");
  console.log("Total deposits tracked:", ethers.formatEther(await contract.totalDeposits()), "ETH");

  // Try withdraw as addr1 — should fail
  console.log("\n--- addr1 tries to withdraw (should fail) ---");
  try {
    await contract.connect(addr1).withdraw();
  } catch (e) {
    console.log("Blocked:", e.reason);
  }

  // Owner withdraws
  console.log("\n--- Owner withdraws ---");
  await contract.withdraw();
  console.log("Balance after withdrawal:", ethers.formatEther(await contract.getBalance()), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
