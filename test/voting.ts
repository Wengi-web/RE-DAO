import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
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
        const proposal = await ethers.getContractFactory("Proposal");
        proposal = await proposal.connect(owner).deploy(
            1,
            await owner.getAddress(),
            "Test Proposal",
            "This is a test proposal",
            ethers.utils.parseEther("1")
        );
    })
})