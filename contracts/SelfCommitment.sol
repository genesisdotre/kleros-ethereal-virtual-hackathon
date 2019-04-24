pragma solidity ^0.4.24;

import "./Arbitrable.sol";
import "./Arbitrator.sol";

contract SelfCommitment is IArbitrable {

	event Log(string debugInfo); // I'm a totally new to this business, figuring things out
    
    modifier onlyArbitrator {require(msg.sender == address(arbitrator), "Can only be called by the arbitrator."); _;}
    Arbitrator public arbitrator; // address of the arbitrator contract

	uint8 constant AMOUNT_OF_CHOICES = 2;
    uint8 constant OK = 1;
    uint8 constant FAIL = 2;
	
	modifier onlyOwner {require(msg.sender == address(owner), "Can only be called by the owner."); _;}
	address public owner;

	constructor(Arbitrator _arbitrator) public {
		owner = msg.sender;
		arbitrator = _arbitrator;
	}

	function changeArbitrator(Arbitrator _arbitrator) onlyOwner public {
		arbitrator = _arbitrator;
	}

	enum ChallengeState { initial, inprogress, success, failed }
	enum SubmissionState { initial, voting, accepted, rejected }

	event ChallengeAdd(address creator, uint deposit, string description, uint beginning, uint end, uint count, uint timestamp);
	event SubmissionAdd(address creator, uint challengeID, string url, string comment, uint timestamp);

	struct Challenge {
		address user;
		uint deposit;
		string description;
		
		uint beginning;
		uint end;
		uint count; // how many 
		
		ChallengeState state;
	}

	struct Submission {
		uint challengeID;
		string url; // YouTube url or later IPFS integration (done on the front-end)
		string comment;
		uint timestamp;
		SubmissionState state; // KLEROS ARBITRATORS HERE KICK IN
	}	

	Challenge[] public challenges;
	Submission[] public submissions;
	
	function getChallengesCount() public view returns(uint) { return challenges.length; }
	function getSubmissionsCount() public view returns(uint) { return submissions.length; }
	
	mapping (address => uint[]) public userChallengeIDs;
	mapping (uint => uint[]) public chalengeSubmissionIDs;
	
	function getUserChallengeIDs(address user) public view returns(uint[] memory) {
	    uint[] memory IDs = userChallengeIDs[user];
	    return IDs;
	}
	
	function getChallengeSubmissionIDs(uint challengeID) public view returns(uint[] memory) {
	    uint[] memory IDs = chalengeSubmissionIDs[challengeID];
	    return IDs;
	}

	function createChallenge(string memory _description, uint _beginning, uint _end, uint _count) payable public returns (uint) {
		require(msg.value > 0, "You need to send a deposit"); // require a deposit, otherwise what's the point.
		// require(_beginning > now, "Challenge cannot start in the past");
		// require(_end > now + 1 days, "Challenge must last at least 1 day");
		require(_count > 1, "You need to commit to do the thing at least once");

		Challenge memory challenge = Challenge({user: msg.sender, deposit: msg.value, description: _description, beginning: _beginning, end: _end, count: _count, state: ChallengeState.initial});
		uint id = challenges.push(challenge) - 1; // push returns the lenghts of the array https://ethereum.stackexchange.com/questions/40312/what-is-the-return-of-array-push-in-solidity
		userChallengeIDs[msg.sender].push(id);

		emit ChallengeAdd(msg.sender, msg.value, _description, _beginning, _end, _count, now);

		return id;
	}

	function createSubmission(string memory _url, string memory _comment, uint _challengeID) public returns (uint) {
		require(challenges[_challengeID].user == msg.sender); // only the guy who sets the challenge can add new stuff

		Submission memory submission = Submission({challengeID : _challengeID, url : _url, comment: _comment, timestamp: now, state: SubmissionState.initial });
		uint id = submissions.push(submission) - 1;
		chalengeSubmissionIDs[_challengeID].push(id);

		emit SubmissionAdd(msg.sender, _challengeID, _url, _comment, now);

		return id;
	}

	function disputeSubmission(uint _submissionID) public { // any internet troll can dispute submission
		arbitrator.createDispute

	}




	function getChallengeById(uint256 challengeID) public view returns(address, uint, string memory, uint, uint, uint, ChallengeState) {
		Challenge memory c =  challenges[challengeID];
		return(c.user, c.deposit, c.description, c.beginning, c.end, c.count, c.state);
	}
	
	function getSubmissionById(uint256 submissionID) public view returns(string memory, string memory, uint, SubmissionState) {
		Submission memory s =  submissions[submissionID];
		return(s.url, s.comment, s.timestamp, s.state);
	}


	// part of IArbitrable 
    function rule(uint _disputeID, uint _ruling) public onlyArbitrator {
        emit Ruling(Arbitrator(msg.sender),_disputeID,_ruling);

        executeRuling(_disputeID,_ruling);
    }


    /** @dev Execute a ruling of a dispute.
     *  @param _disputeID ID of the dispute in the Arbitrator contract.
     *  @param _ruling Ruling given by the arbitrator. Note that 0 is reserved for "Not able/wanting to make a decision".
     */
    function executeRuling(uint _disputeID, uint _ruling) internal {
		emit Log("executeRuling");
	}

}