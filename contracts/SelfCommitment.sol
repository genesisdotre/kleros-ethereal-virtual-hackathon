pragma solidity ^0.5.2;

import "./Ownable.sol";

contract SelfCommitment is Ownable {

	enum ChallengeState { beforestart, inprogress, success, failed }

	enum SubmissionState { initial, voting, accepted, rejected }

	struct Challenge {
		address user;
		string description;
		uint deposit;
		
		uint beginning;
		uint end;
		uint count; // how many 
		
		ChallengeState state;
		Submission[] submissions;
	}

	struct Submission {
		string url; // YouTube url or later IPFS integration (done on the front-end)
		string comment;
		uint timestamp;
		SubmissionState state; // KLEROS ARBITRATORS HERE KICK IN
	}	

	constructor() public {

	}

	address payable beneficiary; // multisig with all the gathered ether

	mapping (address => uint256[]) userChallenges;

	Challenge[] challenges;

	function createChallenge(string memory _description, uint _beginning, uint _end, uint _count) public {

	}

	function getChallengeById(uint256 challengeId) public view returns(address user, string memory description, uint deposit) {
		Challenge memory c = challenges[challengeId];
		return (c.user, c.description, c.deposit);
	}


}
