import { ethers } from 'hardhat';
import { expect } from 'chai';
import { WRDAO } from '../typechain-types';

describe("WRDAO", function () {
  let dao: WRDAO;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const daoFactory = await ethers.getContractFactory("WRDAO", owner);
    dao = (await daoFactory.deploy()) as WRDAO;
    await dao.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol and decimals", async function () {
      expect(await dao.name()).to.equal("WRDAO");
      expect(await dao.symbol()).to.equal("WRDAO");
      expect(await dao.decimals()).to.equal(18);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await dao.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.utils.parseEther("1000000000"));
    });
  });

  describe("Transfer", function () {
    it("Should transfer tokens from sender to recipient", async function () {
      const amount = ethers.utils.parseEther("100");

      await dao.transfer(addr1.address, amount);
      const addr1Balance = await dao.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(amount);

      await dao.connect(addr1).transfer(addr2.address, amount);
      const addr2Balance = await dao.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(amount);
    });

    it("Should not transfer tokens if sender does not have enough balance", async function () {
      const amount = ethers.utils.parseEther("100");

      await expect(dao.transfer(addr1.address, amount)).to.be.revertedWith("Transfer balance");

      const addr1Balance = await dao.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
    });
  });

  describe("Approval", function () {
    it("Should approve spender to transfer tokens on behalf of owner", async function () {
      const amount = ethers.utils.parseEther("100");
      await dao.approve(addr1.address, amount);

      const allowance = await dao.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(amount);
    });

    it("Should not approve if the owner does not have enough balance", async function () {
      const amount = ethers.utils.parseEther("10000000000");

      await expect(dao.approve(addr1.address, amount)).to.be.revertedWith("Insuficient balance");
    });

    it("Should emit an Approval event when approval is successful", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(dao.approve(addr1.address, amount))
        .to.emit(dao, "Approval")
        .withArgs(owner.address, addr1.address, amount);
    });
  });

  describe("TransferFrom", function () {
    it("Should transfer tokens from sender to recipient on behalf of sender's approval", async function () {
      const amount = ethers.utils.parseEther("100");
      await dao.approve(addr1.address, amount);

      await dao.connect(addr1).transferFrom(owner.address, addr2.address, amount);

      const addr2Balance = await dao.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(amount);
    });

    it("Should not transfer tokens if sender's allowance is not enough", async function () {
      const
