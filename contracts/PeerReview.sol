//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PeerReview is ERC721{

    constructor() ERC721("Dao Token", "DT") {}

    // state variable declarations

    uint joinStake = 1 ether;
    uint proposalFee = 0.1 ether;
    uint viewFee = 1 ether;
    uint voteTime = 2 days;
    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemsSold;

    struct DaoMember {
        address _address;
        bool isMember;
        uint nftId;
        uint returnAmount;
    }

    mapping (address => DaoMember) public addressToDaoMember;

    struct PenaltyProposal {
        address user;
        string reason;
        uint penaltyUpvote;
        uint penaltyDownvote;
        uint deadline;
        bool executed;
        mapping(address => bool) voted;
    }
    
    uint public numPenaltyProposal;

    mapping (uint => PenaltyProposal) public idToPenalty;


    struct Proposal {
        string cid;
        uint size;
        string name;
        address author;
        uint storagePrice;
        uint upvote;
        uint downvote;
        uint deadline;
        bool executed;
        bool canWeStoreThis; // frontend keeps tapping here
        mapping(address => bool) voted;
    }

    uint public numProposal;

    mapping (uint => Proposal) public idToProposal;


    struct Reviewed {
        string cid;
        uint size;
        string name;
        address author;
    }

    uint public numReviewed;

    mapping (uint => Reviewed) public idToReviewed;

    // dao functions
    
    function joinDao() public payable {
        require(msg.value == joinStake, "incorrect stake amount");
        _tokenId.increment();
        uint newTokenId = _tokenId.current();
        _mint(msg.sender, newTokenId);
        addressToDaoMember[msg.sender] = DaoMember(msg.sender, true, newTokenId, joinStake);
    }

    modifier onlyDaoMember {
        require(addressToDaoMember[msg.sender].isMember, "not a dao member");
        _;
    }

    function leaveDao() public onlyDaoMember {
        uint nftId = addressToDaoMember[msg.sender].nftId;
        payable(msg.sender).transfer(addressToDaoMember[msg.sender].returnAmount);
        _burn(nftId);
        delete addressToDaoMember[msg.sender];
    }

    // proposal functions

    function createProposal(string memory _cid, uint _size, string memory _name) public payable returns (uint){
        uint storagePrice = 0; // storage price to be specified;
        require(msg.value == proposalFee, "incorrect storage amount");
        numProposal++;
        Proposal storage proposal = idToProposal[numProposal];
        proposal.cid = _cid;
        proposal.size = _size;
        proposal.name = _name;
        proposal.author = msg.sender;
        proposal.storagePrice;
        proposal.deadline = block.timestamp + voteTime;
        return numProposal;
    }

    function upvote(uint proposalId) public onlyDaoMember {
        Proposal storage proposal = idToProposal[proposalId];
        require(proposal.deadline > block.timestamp, "deadline exceeded");
        require(!proposal.voted[msg.sender], "user already voted");
        proposal.upvote++;
    }

    function downvote(uint proposalId) public onlyDaoMember {
        Proposal storage proposal = idToProposal[proposalId];
        require(proposal.deadline > block.timestamp, "deadline exceeded");
        require(!proposal.voted[msg.sender], "user already voted");
        proposal.downvote++;
    }

    function execute(uint proposalId) public onlyDaoMember returns (bool) {
        Proposal storage proposal = idToProposal[proposalId];
        require(proposal.deadline <= block.timestamp, "deadline exceeded");
        require(!proposal.executed, "proposal already executed");
        if (proposal.upvote > proposal.downvote) {
            numReviewed++;
            Reviewed storage reviewed = idToReviewed[numReviewed];
            reviewed.cid = proposal.cid;
            reviewed.size = proposal.size;
            reviewed.name = proposal.name;
            reviewed.author = proposal.author;
            proposal.canWeStoreThis = true;
            proposal.executed = true;
            delete idToProposal[proposalId];
            return true;
        }
        else {
            proposal.canWeStoreThis = false;
            proposal.executed = true;
            delete idToProposal[proposalId];
            return false;
        }
    }

    // penalty proposal functions

    function createPenalty(address _user, string memory _reason) public onlyDaoMember returns(uint) {
        numPenaltyProposal++;
        PenaltyProposal storage penaltyProposal = idToPenalty[numProposal];
        penaltyProposal.user = _user;
        penaltyProposal.reason = _reason;
        penaltyProposal.deadline = block.timestamp + voteTime;
        return numPenaltyProposal;
    }

    function upvotePenalty(uint penaltyProposalId) public onlyDaoMember {
        PenaltyProposal storage penaltyProposal = idToPenalty[penaltyProposalId];
        require(penaltyProposal.deadline > block.timestamp, "deadline exceeded");
        require(!penaltyProposal.voted[msg.sender], "user already voted");
        penaltyProposal.penaltyUpvote++;
    }

    function downvotePenalty(uint penaltyProposalId) public onlyDaoMember {
        PenaltyProposal storage penaltyProposal = idToPenalty[penaltyProposalId];
        require(penaltyProposal.deadline > block.timestamp, "deadline exceeded");
        require(!penaltyProposal.voted[msg.sender], "user already voted");
        penaltyProposal.penaltyDownvote++;
    }

    function executePenalty(uint penaltyProposalId) public onlyDaoMember {
        PenaltyProposal storage penaltyProposal = idToPenalty[penaltyProposalId];
        DaoMember storage daoMember = addressToDaoMember[penaltyProposal.user];
        require(penaltyProposal.deadline <= block.timestamp, "deadline exceeded");
        require(!penaltyProposal.executed, "proposal already executed");

        if (penaltyProposal.penaltyUpvote > penaltyProposal.penaltyDownvote) {
            uint amt = daoMember.returnAmount;
            daoMember.returnAmount = amt - (10*amt/100);
            penaltyProposal.penaltyUpvote = 0;
            penaltyProposal.penaltyDownvote = 0;
        }
        penaltyProposal.executed = true;
        delete idToPenalty[penaltyProposalId];
    }

    function removeFromDao(address user) public onlyDaoMember {
        uint nftId = addressToDaoMember[user].nftId;
        _burn(nftId);
    }

    // view files for non dao members

    function obtainViewship() public payable {
        require(msg.value == viewFee, "incorrect stake amount");
        _tokenId.increment();
        uint newTokenId = _tokenId.current();
        _mint(msg.sender, newTokenId);
    }

}