import { ethers } from 'hardhat';
import { expect } from 'chai';
import { WRDAO } from '../typechain-types';
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
})

