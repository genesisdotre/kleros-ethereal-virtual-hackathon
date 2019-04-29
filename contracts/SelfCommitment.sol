pragma solidity ^0.4.24;

import "./Arbitrable.sol";
import "./Arbitrator.sol";

contract SelfCommitment is IArbitrable {

	event Log(string debugInfo); // I'm totally new to this business, figuring things out
    
    modifier onlyArbitrator {require(msg.sender == address(arbitrator), "Can only be called by the arbitrator."); _;}
    Arbitrator public arbitrator; // address of the arbitrator contract
    bytes public arbitratorExtraData; // potentially Court ID)

	uint8 constant AMOUNT_OF_CHOICES = 2;
	uint8 constant REFUSED = 0; // arbitrator always has 
    uint8 constant OK = 1;
    uint8 constant FAIL = 2;
    uint constant MAX_INT = (2**256-2)/2; // 0 is valid disputeID, initialising with MAX_INT
	
	modifier onlyOwner {require(msg.sender == address(owner), "Can only be called by the owner."); _;}
	address public owner;

	constructor(Arbitrator _arbitrator, bytes _arbitratorExtraData) public {
		owner = msg.sender;
		arbitrator = _arbitrator;
		arbitratorExtraData = _arbitratorExtraData;
	}

	function changeArbitrator(Arbitrator _arbitrator, bytes _arbitratorExtraData) onlyOwner public {
		arbitrator = _arbitrator;
		arbitratorExtraData = _arbitratorExtraData;
	}

	enum ChallengeState { initial, inprogress, success, failed }
	enum SubmissionState { initial, challenged, accepted, rejected }

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
		string url; // YouTube url, have IPFS integration ready: https://discuss.ipfs.io/t/is-there-any-other-methods-to-upload-a-file-files-to-ipfs-through-a-web-browser-beside-using-api-port-5001/3143/10?u=mars
		string comment;
		uint timestamp;
		uint disputeID;
		SubmissionState state;
	}	

	Challenge[] public challenges;
	Submission[] public submissions;
	string[] public MetaEvidenceHashes;
	
	function getChallengesCount() public view returns(uint) { return challenges.length; }
	function getSubmissionsCount() public view returns(uint) { return submissions.length; }
	
	mapping (address => uint[]) public userToChallengeIDs; // user can have multiple challanges
	mapping (uint => uint[]) public chalengeIDToSubmissionIDs; // challenge has multiple submissions, returning the array containing all of them
	mapping (uint => uint) public disputeIDToSubmissionID; // dispute refers to particular submission, not the whole challenge
	mapping (uint => string) public challengeIDToMetaEvidenceHash; // challenge has multiple submissions but only one MetaEvidence (that describes challenge)
    
	function getUserChallengeIDs(address user) public view returns(uint[] memory) {
	    uint[] memory IDs = userToChallengeIDs[user];
	    return IDs;
	}
	
	function getChallengeSubmissionIDs(uint challengeID) public view returns(uint[] memory) {
	    uint[] memory IDs = chalengeIDToSubmissionIDs[challengeID];
	    return IDs;
	}

	function createChallenge(string memory _description, uint _beginning, uint _end, uint _count) payable public returns (uint) {
		require(msg.value > 0, "You need to send a deposit"); // require a deposit, otherwise what's the point.
		// require(_beginning > now, "Challenge cannot start in the past");
		// require(_end > now + 1 days, "Challenge must last at least 1 day");
		require(_count > 1, "You need to commit to do the thing at least once");

		Challenge memory challenge = Challenge({user: msg.sender, deposit: msg.value, description: _description, beginning: _beginning, end: _end, count: _count, state: ChallengeState.initial});
		uint id = challenges.push(challenge) - 1; // push returns the lenghts of the array https://ethereum.stackexchange.com/questions/40312/what-is-the-return-of-array-push-in-solidity
		userToChallengeIDs[msg.sender].push(id);

		emit ChallengeAdd(msg.sender, msg.value, _description, _beginning, _end, _count, now);

		return id;
	}

	function createSubmission(string memory _url, string memory _comment, uint _challengeID) public returns (uint) {
		require(challenges[_challengeID].user == msg.sender); // only the guy who sets the challenge can add new stuff

		Submission memory submission = Submission({challengeID : _challengeID, url : _url, comment: _comment, timestamp: now, disputeID: MAX_INT, state: SubmissionState.initial });
		uint id = submissions.push(submission) - 1;
		chalengeIDToSubmissionIDs[_challengeID].push(id);

		emit SubmissionAdd(msg.sender, _challengeID, _url, _comment, now);

		return id;
	}

	function getChallengeById(uint256 challengeID) public view returns(address, uint, string memory, uint, uint, uint, ChallengeState) {
		Challenge memory c =  challenges[challengeID];
		return(c.user, c.deposit, c.description, c.beginning, c.end, c.count, c.state);
	}
	
	function getSubmissionById(uint256 submissionID) public view returns(uint, string memory, string memory, uint, SubmissionState) {
		Submission memory s =  submissions[submissionID];
		return(s.challengeID, s.url, s.comment, s.timestamp, s.state);
	}
	
	// A lot things will happen on the front-end
	// Building metaEvidence.json and evidence.json and then uploading to IPFS
	// Here we are only submitting IPFS paths to preserve on-chain storage
	// We could use any "traditional" centralized storage, that's why using ipfs:// URI qualifier
	function disputeSubmission(uint _submissionID, string _metaEvidenceURI, string _evidenceURI)  public { // public: any internet troll can dispute submission
	    emit Log("before disputeSubmission");
		uint disputeID = arbitrator.createDispute.value(0)(AMOUNT_OF_CHOICES, ""); // "" means no extraData
		Submission storage s = submissions[_submissionID];
		s.disputeID = disputeID;
		s.state = SubmissionState.challenged;
		
		emit Log("after disputeSubmission");
	}


	// @override (why Solidity do not specify @override keyword?) part of IArbitrable 
    function rule(uint _disputeID, uint _ruling) public onlyArbitrator {
        emit Ruling(Arbitrator(msg.sender), _disputeID, _ruling);

        executeRuling(_disputeID, _ruling);
    }

    function executeRuling(uint _disputeID, uint _ruling) internal {
        Submission storage s = submissions[ disputeIDToSubmissionID[_disputeID] ];
        if (_ruling == OK) {
            s.state = SubmissionState.accepted;
        } else if (_ruling == FAIL || _ruling == REFUSED) {
            s.state = SubmissionState.rejected;
        }
        
		emit Log("executeRuling");
	}

}