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
        let proposal = await ethers.getContractFactory("Proposal");
        proposal = await proposal.connect(owner).deploy(
            1,
            await owner.getAddress(),
            "Test Proposal",
            "This is a test proposal",
            ethers.utils.parseEther("1")
        );
        await proposal.deployed();
        const Voting = await ethers.getContractFactory("Voting");
        voting = await voting.connect(owner).deploy(
            proposal.address,
            await owner.getAddress()
        );
        await voting.deployed();
        daotoken = await ethers.getContractAt("WRDAO", await owner.getAddress());
        await daoToken.connect(owner).approve(voting.address, ethers.utils.parseEther("1"));
    });

    it("should !allow users to vote more than once", async () => {
        await voting.connect(addr1).vote(true, ethers.utils.parseEther("0.5"));
        await expect(
            voting.connect(addr1).vote(false, ethers.utils.parseEther("0.5"))
        ).to.be.revertedWith("")
    })
})