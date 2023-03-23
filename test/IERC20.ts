import { ethers } from 'hardhat';
import { expect } from 'chai';
import { WRDAO, WRDAO__factory } from '../typechain-types';
import { Contract, Signer } from 'ethers';

describe ("WRDAO Token Contract", () => {
  let owner:Signer;
  let bob:Signer;
  let alice: Signer;
  let wrdao: Contract;

  beforeEach(async () => {
    [owner, bob, alice] = await ethers.getSigners();
    const WRDAO = await ethers.getContractFactory("WRDAO");
    wrdao = await WRDAO.connect(owner).deploy();
    await wrdao.deployed();
  });

  it("Have correct name, symbol and decimal", async () => {
    expect(await wrdao.name()).to.equal("WRDAO");
    expect(await wrdao.symbol()).to.equal("WRDAO");
    expect(await wrdao.decimals()).to.equal(18);
  });

  it("return correct contract supply", async () => {
    expect(await wrdao.totalSupply()).to.equal(1000000000 * 10 ** 18);
  });

  it("should initiate transfer tokens", async () => {
    const initialBalance = await wrdao.balanceOf(await bob.getAddress());
    await wrdao.connect(owner).transfer(await alice.getAddress(), 100);
    const finalBalance = await wrdao.balanceOf(await bob.getAddress());
    expect(finalBalance).to.equal(initialBalance.add(100));
  });

  it("approve and transferFrom tokens", async () => {
    await wrdao.connect(owner).approve(await bob.getAddress(), 100);
    await wrdao.connect(alice).transferFrom(
      await owner.getAddress(),
      await bob.getAddress(),
      100
    );
    const bobBalance = await wrdao.balanceOf(await bob.getAddress());
    expect(bobBalance).to.equal(100);
  });

  it("!transfer tokens with insufficient balance", async () => {
    const initialBalance = await wrdao.balanceOf(await owner.getAddress());
    await expect(
      wrdao.connect(owner).transfer(await bob.getAddress(), initialBalance.add(1))
    ).to.be.revertedWith("Transfer balance");
    const finalBalance = await wrdao.balanceOf(await owner.getAddress());
    expect(finalBalance).to.equal(initialBalance);
  });

  it("!transfer tokens with insufficient allowance", async () => {
    const initialBalance = await wrdao.balanceOf(await owner.getAddress());
    await wrdao.connect(owner).approve(await bob.getAddress(), 100);
    await expect(
      wrdao.connect(bob).transferFrom(
        await owner.getAddress(),
        await alice.getAddress(),
        initialBalance.add(1)
      )
    ).to.be.revertedWith("no allowance");
    const finalBalance = await wrdao.balanceOf(await owner.getAddress());
    expect(finalBalance).to.equal(initialBalance);
  });
});

