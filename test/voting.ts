import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { Voting, Voting__factory } from '../typechain-types';
import { Proposal, Proposal__factory} from '../typechain-types';

import { expect } from "chai";

describe("Voting Contract", () => {
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let voting: Contract;
    let proposal: Contract;
    let WRDAO: Contract;


    //new proposal
    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        let proposalInstance = await ethers.getContractFactory("Proposal");
        proposal = await proposalInstance.connect(owner).deploy(
            1,
            await owner.getAddress(),
            "Test Proposal",
            "This is a test proposal",
            ethers.utils.parseEther("1")
        );
        await proposal.deployed();
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.connect(owner).deploy(
            proposal.address,
            await owner.getAddress()
        );
        await voting.deployed();
        WRDAO = await ethers.getContractAt("WRDAO", await owner.getAddress());
        await WRDAO.connect(owner).approve(voting.address, ethers.utils.parseEther("1"));
    });

    it("should initialize with correct proposal and daoToken values", async () => {
        expect(await voting.proposal()).to.equal(proposal.address);
        expect(await voting.daoAddress()).to.equal(await owner.getAddress());
        expect(await voting.WRDAO()).to.equal(WRDAO.address);
    });

    it("should !allow users to vote more than once", async () => {
        await voting.connect(addr1).vote(true, ethers.utils.parseEther("0.5"));
        await expect(
            voting.connect(addr1).vote(false, ethers.utils.parseEther("0.5"))
        ).to.be.revertedWith("Voter has already cast their vote");
    });

    it("should transfer tokens from voter to voting contract", async () => {
        const initialBalance = await WRDAO.balanceOf(await addr1.getAddress());
        await voting.connect(addr1).vote(true, ethers.utils.parseEther("0.5"));
        const finalBalance = await WRDAO.balanceOf(await addr1.getAddress());
        expect(finalBalance).to.equal(initialBalance.sub(ethers.utils.parseEther("0.5")));
        expect(await WRDAO.balanceOf(voting.address)).to.equal(
            ethers.utils.parseEther("0.5")
        );       
    });

    it("should not allow voting without sufficient WRDAO token balance", async () => {
        await WRDAO.connect(addr1).approve(voting.address, ethers.utils.parseEther("0.5"));
        await expect(
            voting.connect(addr1).vote(true, ethers.utils.parseEther("1"))
        ).to.be.revertedWith("WRDAO transfer failed");
    });

    it("should vote on the proposal", async () => {
        await voting.connect(addr1).vote(true, ethers.utils.parseEther("0.5"));
        expect(await proposal.votesFor()).to.equal(1);
    });
});