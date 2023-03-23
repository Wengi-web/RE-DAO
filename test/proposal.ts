import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

describe("Proposal Contract", () => {
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    let proposal: Contract;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Proposal = await ethers.getContractFactory("Proposal");
        proposal = await Proposal.connect(owner).deploy(
            1,
            await owner.getAddress(),
            "Test Proposal",
            "This is a test proposal",
            ethers.utils.parseEther("1")
        );
        await proposal.deployed();
    });

    it("have correct initial values", async () => {
        expect(await proposal.id()).to.equal(1);
        expect(await proposal.proposer()).to.equal(await owner.getAddress());
        expect(await proposal.title()).to.equal("Test proposal");
        expect(await proposal.description()).to.equal("This is a test proposal");
        expect(await proposal.amount()).to.equal(ethers.utils.parseEther("1"));
        expect(await proposal.approved()).to.equal(false);
        expect(await proposal.votesFor()).to.equal(0);
        expect(await proposal.votesAgainst()).to.equal(0);
    });

    it("prevent proposer from voting", async () => {
        await expect(proposal.connect(owner).vote(true)).to.be.revertedWith(
            "proposer cannot vote on their own proposal"
        );
    });

    it("barn voting after proposal is rejected or approved", async () => {
        await proposal.connect(addr1).vote(true);
        await proposal.connect(addr2).vote(true);
        await expect(proposal.connect(addr1).vote(true)).to.be.revertedWith(
            "proposal approved or rejected"
        );
    });

    it("approve proposals with more votes than against", async () => {
        await proposal.connect(addr1).vote(true);
        await proposal.connect(addr2).vote(true);
        expect(await proposal.approved()).to.equal(true);
        expect(await proposal.votesFor()).to.equal(2);
        expect(await proposal.votesAgainst()).to.equal(0);
    });

    it("reject proposals with more votes against than for", async () => {
     await proposal.connect(addr1).vote(false);
     await proposal.connect(addr2).vote(false);
     expect(await proposal.approved()).to.equal(false);
     expect(await proposal.votesFor()).to.equal(0);
     expect(await proposal.votesAgainst()).to.equal(2);   
    });

    it("should prevent users to vote mutiple times", async () => {
        await proposal.connect(addr1).vote(true);
        await expect(proposal.connect(addr1).vote(false)).to.be.revertedWith(
            "proposal has been approved or rejected"
        );
        expect(await proposal.votesFor()).to.equal(1);
        expect(await proposal.votesAgainst()).to.equal(0);
    });

});