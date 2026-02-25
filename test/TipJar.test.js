const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipJar", function () {

  let contract;
  let owner;
  let addr1;

  // Runs before every single test — fresh contract each time
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const TipJar = await ethers.getContractFactory("TipJar");
    contract = await TipJar.deploy();
  });

  // Test 1 — happy path deposit
  it("should accept a deposit and update balance", async function () {
    await contract.deposit({ value: ethers.parseEther("0.01") });
    const balance = await contract.getBalance();
    expect(balance).to.equal(ethers.parseEther("0.01"));
  });

  // Test 2 — reject zero deposit
  it("should reject a deposit of zero ETH", async function () {
    await expect(
      contract.deposit({ value: 0 })
    ).to.be.revertedWith("Send some ETH.");
  });

  // Test 3 — owner can withdraw
  it("should allow owner to withdraw all funds", async function () {
    await contract.deposit({ value: ethers.parseEther("0.05") });
    await contract.withdraw();
    const balance = await contract.getBalance();
    expect(balance).to.equal(0);
  });

  // Test 4 — non-owner cannot withdraw
  it("should block a non-owner from withdrawing", async function () {
    await contract.deposit({ value: ethers.parseEther("0.01") });
    await expect(
      contract.connect(addr1).withdraw()
    ).to.be.revertedWith("Only owner can withdraw.");
  });

  // Test 5 — cannot withdraw empty contract
  it("should reject withdrawal when balance is zero", async function () {
    await expect(
      contract.withdraw()
    ).to.be.revertedWith("Nothing to withdraw.");
  });

  // Test 6 — totalDeposits tracks correctly
  it("should track total deposits across multiple deposits", async function () {
    await contract.deposit({ value: ethers.parseEther("0.01") });
    await contract.deposit({ value: ethers.parseEther("0.02") });
    const total = await contract.totalDeposits();
    expect(total).to.equal(ethers.parseEther("0.03"));
  });

  // Test 7 — event fires on deposit
  it("should emit TipReceived event on deposit", async function () {
    await expect(
      contract.deposit({ value: ethers.parseEther("0.01") })
    ).to.emit(contract, "TipReceived")
     .withArgs(owner.address, ethers.parseEther("0.01"));
  });

  // Test 8 — event fires on withdrawal
  it("should emit Withdrawal event when owner withdraws", async function () {
    await contract.deposit({ value: ethers.parseEther("0.01") });
    await expect(
      contract.withdraw()
    ).to.emit(contract, "Withdrawal")
     .withArgs(owner.address, ethers.parseEther("0.01"));
  });

});
