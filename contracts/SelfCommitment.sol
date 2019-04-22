pragma solidity ^0.5.2;

import "./Ownable.sol";

contract SelfCommitment is Ownable {

	constructor() public {
		beneficiary = msg.sender;
	}

	address payable beneficiary;

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

	function createSubmission(string memory _url, string memory _comment, uint challengeID) public returns (uint) {
		require(challenges[challengeID].user == msg.sender); // only the guy who sets the challenge can add new stuff

		Submission memory submission = Submission({url : _url, comment: _comment, timestamp: now, state: SubmissionState.initial });
		uint id = submissions.push(submission) - 1;
		chalengeSubmissionIDs[challengeID].push(id);

		emit SubmissionAdd(msg.sender, challengeID, _url, _comment, now);

		return id;

	}


	function getChallengeById(uint256 challengeID) public view returns(address, uint, string memory, uint, uint, uint, ChallengeState) {
		Challenge memory c =  challenges[challengeID];
		return(c.user, c.deposit, c.description, c.beginning, c.end, c.count, c.state);
	}
	
	function getSubmissionById(uint256 submissionID) public view returns(string memory, string memory, uint, SubmissionState) {
		Submission memory s =  submissions[submissionID];
		return(s.url, s.comment, s.timestamp, s.state);
	}

}
