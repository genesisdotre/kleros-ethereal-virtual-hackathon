pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2; // returning structs: https://ethereum.stackexchange.com/questions/7317/how-can-i-return-struct-when-function-is-called

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

	mapping (address => uint[]) public userChallengeIDs;
	mapping (uint => uint[]) public chalengeSubmissionIDs;
	
	function getUserChallengeIDs(address user) public view returns(uint[] memory) {
	    uint[] memory IDs = userChallengeIDs[user];
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

	function addSubmission(string memory _url, string memory _comment, uint challengeID) public returns (uint) {
		require(challenges[challengeID].user == msg.sender); // only the guy who sets the challenge can add new stuff

		Submission memory submission = Submission({url : _url, comment: _comment, timestamp: now, state: SubmissionState.initial });
		uint id = submissions.push(submission) - 1;
		chalengeSubmissionIDs[challengeID].push(id);

		emit SubmissionAdd(msg.sender, challengeID, _url, _comment, now);

		return id;

	}

	// function getChallengeById(uint256 challengeId) public view returns(address user, string memory description, uint deposit) {
	// 	Challenge memory c = challenges[challengeId];
	// 	return (c.user, c.description, c.deposit);
	// }

	function getChallengeById(uint256 challengeId) public view returns(Challenge memory) {
		return challenges[challengeId];
	}


}
