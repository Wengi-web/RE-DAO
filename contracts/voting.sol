// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./proposal.sol";
import "./IERC20.sol";

//voting contract on proposals
contract Voting {
    //state variables
    proposal public proposal;
    addresspublic daoAddress;
    IERC20 public daoToken;

    // Mappinfg to track which voters have already voted
    mapping(address => bool) public hasVoted;

    //track votes casted
    event voteCast(address voter, bool approved, uint256 amount);

    //constructoer to initialize proposal details
    constructor(address _proposalAddress, address _daoAddress) {
        //initiate proposal contract
        proposal = proposal(_proposalAddress);

        //init dao address and dao contract
        daoAddress = _daoAddress;
        daoToken = IERC20(daoAddress);
    }

    //function to cast vote on proposal
    function vote(bool _approved, uint256 _amount) external {
        address voter = msg.sender;

        require(!hasVoted[voter], "Voter has already cast their vote");

        require(daoToken.transferFrom(voter, address(this), _amount), "WRDAO transfer failed");

        proposal.vote(_approved);

        hasVoted[voter] = true;

        emit VoteCast(voter, _approved, _amount);
    }
}