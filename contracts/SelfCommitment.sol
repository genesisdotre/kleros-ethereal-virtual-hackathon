pragma solidity ^0.4.24;

import "./Arbitrable.sol";
import "./Arbitrator.sol";

contract SelfCommitment is IArbitrable {

	event Log(string debugInfo); // I'm totally new to this business, figuring things out
	event Log(uint debugInfo); // I'm totally new to this business, figuring things out

    modifier onlyArbitrator {require(msg.sender == address(arbitrator), "Can only be called by the arbitrator."); _;}
    Arbitrator public arbitrator; // address of the arbitrator contract
    bytes public arbitratorExtraData; // potentially Court ID)

	uint8 constant AMOUNT_OF_CHOICES = 2;
	uint8 constant REFUSED = 0; // arbitrator always has option to refuse ruling
    uint8 constant OK = 1;
    uint8 constant FAIL = 2;
    uint constant MAX_INT = (2**256-2)/2; // 0 is valid disputeID, initialising with MAX_INT

	modifier onlyOwner {require(msg.sender == address(owner), "Can only be called by the owner."); _;}
	address public owner; // for simplicity, owner is also a beneficiary of the funds from failed challenges (Effective Altruism, Exponential Technologies)

	constructor(Arbitrator _arbitrator, bytes _arbitratorExtraData) public {
		owner = msg.sender;
		arbitrator = _arbitrator;
		arbitratorExtraData = _arbitratorExtraData;
	}

	function changeArbitrator(Arbitrator _arbitrator, bytes _arbitratorExtraData) onlyOwner public {
		arbitrator = _arbitrator;
		arbitratorExtraData = _arbitratorExtraData;
	}

	enum ChallengeState { initial, inprogress, success, failed, successWithdraw, failedWithdraw }
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
	mapping (uint => uint[]) public chalengeIDToSubmissionIDs; // challenge has multiple submissions, returning the array containing all of them _(OMFG: can you believe I don't even know how to properly initialize struct with the dynamic array? YES... This is my expert level here.)_
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
		require(msg.value > 0, "You need to send a deposit"); // require a deposit, otherwise what's the point?
		require(_beginning >= now, "Challenge cannot start in the past");
		require(_end >= now + 1 days, "Challenge must last at least 1 day"); // arbitrary, we are building habits (common sense)
		require(_count < 1000, "1000 is max, this is actually to prevent gas issues");
		require(_count > 1, "You need to commit to do the thing at least once");

		Challenge memory challenge = Challenge({user: msg.sender, deposit: msg.value, description: _description, beginning: _beginning, end: _end, count: _count, state: ChallengeState.initial});
		uint id = challenges.push(challenge) - 1; // push returns the lenghts of the array https://ethereum.stackexchange.com/questions/40312/what-is-the-return-of-array-push-in-solidity
		userToChallengeIDs[msg.sender].push(id);

		emit ChallengeAdd(msg.sender, msg.value, _description, _beginning, _end, _count, now);

		return id;
	}

	function createSubmission(string memory _url, string memory _comment, uint _challengeID) public returns (uint) {
		require(challenges[_challengeID].user == msg.sender, "only the guy who sets the challenge can add new stuff");
		require(challenges[_challengeID].beginning <= now, "can submit only after beginning");
		require(challenges[_challengeID].end >= now, "can submit only before end");

		Submission memory submission = Submission({challengeID : _challengeID, url : _url, comment: _comment, timestamp: now, disputeID: MAX_INT, state: SubmissionState.initial });
		uint id = submissions.push(submission) - 1;
		chalengeIDToSubmissionIDs[_challengeID].push(id);

		emit SubmissionAdd(msg.sender, _challengeID, _url, _comment, now);

		return id;
	}

	function getChallengeById(uint256 challengeID) public view returns(address, uint, string memory, uint, uint, uint, ChallengeState) {
		Challenge memory c = challenges[challengeID];
		return(c.user, c.deposit, c.description, c.beginning, c.end, c.count, c.state);
	}

	function getSubmissionById(uint256 submissionID) public view returns(uint, string memory, string memory, uint, SubmissionState) {
		Submission memory s = submissions[submissionID];
		return(s.challengeID, s.url, s.comment, s.timestamp, s.state);
	}

	// A lot things will happen on the front-end
	// Building metaEvidence.json and evidence.json and then uploading to IPFS
	// Here we are only submitting IPFS paths to preserve on-chain storage
	// We could use any "traditional" centralized storage, that's why using ipfs:// URI qualifier
	function disputeSubmission(uint _submissionID, string _metaEvidenceURI, string _evidenceURI) public payable { // public: any internet troll can dispute submission
		Submission storage s = submissions[_submissionID];
		uint arbitrationCost = arbitrator.arbitrationCost(arbitratorExtraData);
		require(msg.value >= arbitrationCost, "you need to send more than the arbitration cost");
		require(s.state == SubmissionState.initial, "can dispute only a submission in a initial state");
		msg.sender.transfer(msg.value - arbitrationCost);

		uint disputeID = arbitrator.createDispute.value(arbitrationCost)(AMOUNT_OF_CHOICES, ""); // "" means no extraData

		disputeIDToSubmissionID[disputeID] = _submissionID;
		s.disputeID = disputeID; // in case we want to look into dispute knowing the submission
		s.state = SubmissionState.challenged;
		uint challengeID = submissions[_submissionID].challengeID;

		// TODO THINK FIXME
		// "MetaEvidence has to be created before a dispute can arise."
		// HolyCow! 10 days into the project and 23:20 on the final day I'm laerning that.
		// One MetaEvidence per challenge (1:1 relationship) so using challengeID
		// Still confused: https://github.com/ethereum/EIPs/issues/1497#issuecomment-488121150
		// No amount of reading will change it, the way how standard is presented has to be simplified
		emit MetaEvidence(challengeID, _evidenceURI);
		emit Evidence(arbitrator, challengeID, msg.sender, _evidenceURI);
		emit Dispute(arbitrator, disputeID, challengeID, challengeID);
	}

	// @override (why Solidity does not specify @override keyword?) part of IArbitrable
    function rule(uint _disputeID, uint _ruling) public onlyArbitrator {
        emit Ruling(Arbitrator(msg.sender), _disputeID, _ruling);

        executeRuling(_disputeID, _ruling);
    }

    function executeRuling(uint _disputeID, uint _ruling) internal {
        Submission storage s = submissions[disputeIDToSubmissionID[_disputeID]];
        if (_ruling == OK) {
            s.state = SubmissionState.accepted;
        } else if (_ruling == FAIL || _ruling == REFUSED) {
            s.state = SubmissionState.rejected;
        }
	}

	// Liza Minnelli: https://www.youtube.com/watch?v=PIAXG_QcQNU
	// Change the money, change the world: https://www.youtube.com/watch?v=laE0OzKRE-A
	// Have you ever wondered why `InTheCurrentState` name? Because someone can still callenge an individual submission
	function isChallengeSuccessfulInTheCurrentState(uint _challengeID) public view returns (bool) {
		uint[] memory submissionsIDs = getChallengeSubmissionIDs(_challengeID);
		uint count = challenges[_challengeID].count;
		uint potentiallyValidSubmissions = 0;

		for (uint i = 0; i<submissionsIDs.length; i++) { // ANTI-PATTERN: loop that can be too big, but in the ctor we limit to 1000 items
			Submission memory s = submissions[submissionsIDs[i]];
			if (s.state == SubmissionState.initial || s.state != SubmissionState.accepted) {
				potentiallyValidSubmissions++;
			}
		}
		return potentiallyValidSubmissions >= count;
	}

	function withdrawFunds(uint _challengeID) public {
		Challenge storage c = challenges[_challengeID];
		require (now > c.end + (3 days), "Withdrawals are only possible 3 days after the end of the challenge");

		if(isChallengeSuccessfulInTheCurrentState(_challengeID)) {
			c.user.transfer(c.deposit);
			c.state = ChallengeState.successWithdraw;
		} else {
			owner.transfer(c.deposit);
			c.state = ChallengeState.failedWithdraw;
		}
	}

}