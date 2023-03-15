// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// proposal contract to store and manage proposals
contract Proposal {
    // State variables

    uint256 public id;
    address public proposer;
    string public title;
    string public description;
    uint256 public amount;
    bool public approved;
    uint256 public votesFor;
    uint256 public votesAgainst;

    //track new created proposals
    event ProposalCreated(
        uint256 id,
        address proposer,
        string title,
        string description,
        uint256 amount
    );

    //event to track approved/rejected proposals
    event ProposalApproved(uint256 id, bool approved);

    //constructor to initiate proposal details
    constructor(
        uint256 _id,
        address _proposer,
        string memory _title,
        string memory _description,
        uint256 _amount
    ) {
        id = _id;
        proposer = _proposer;
        title = _title;
        description = _description;
        amount = _amount;
        approved = false;
        votesFor = 0;
        votesAgainst = 0;

        // emit a ProposalCreated event
        emit ProposalCreated(id, proposer, title, description, amount);
    }

    //function to approve or reject proposal
    function vote(bool _approved) external {

        require(
            msg.sender != proposer,
            "proposer cannot vote on their own proposal"
        );


        // check proposal has not been approved or rejected
        require(!approved, "proposal has already been approved or rejected");

        if (_approved) {
            votesFor++;
        } else {
            votesAgainst++;
        }

        // check if the proposal has received enough votes to be approved
        if (votesFor > votesAgainst) {
            approved = true;
            // emit a ProposalApproved event
            emit ProposalApproved(id, true);
        } else if (votesAgainst >= votesFor) {
            approved = false;
            // emit a ProposalApproved event
            emit ProposalApproved(id, false);
        }
        }
    }
