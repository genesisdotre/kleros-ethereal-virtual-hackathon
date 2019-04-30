const { expectThrow } = require('./expectThrow')
const { increaseTime } = require('./increaseTime')
  
const SelfCommitment = artifacts.require('./SelfCommitment.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')
  
contract('SelfCommitment', async function(accounts) {
    const sender = accounts[0]
    const challengeCreator = accounts[1];
    const arbitrator = accounts[5]
    const now = Math.floor( (+new Date()) / 1000 );

    let centralizedArbitrator;
    let selfCommitment;

    beforeEach(async function() {
        centralizedArbitrator = await CentralizedArbitrator.new(0, { from: arbitrator } );
        selfCommitment = await SelfCommitment.new(centralizedArbitrator.address, [], { from: sender } );
    })
  
    it('Should create a first challenge and craete two submissions', async () => {
        await selfCommitment.createChallenge("20 pushups", now, now, 20, { from: challengeCreator, value: 18**10 });
        let challengesCount = await selfCommitment.getChallengesCount();
        assert.equal(challengesCount.toNumber(), 1, 'There should be exactly one challenge');
        
        await selfCommitment.createSubmission("url", "something", 0, { from: challengeCreator });
        let submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 1, 'There should be exactly one submission');

        await selfCommitment.createSubmission("url2", "something2", 0, { from: challengeCreator });
        submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 2, 'There should be exactly two submissions');

        let submissionTwoID = await selfCommitment.chalengeIDToSubmissionIDs.call(0, 1);
        let submissionTwo = await selfCommitment.getSubmissionById(submissionTwoID);
        assert.equal(submissionTwo[1], "url2", "URL of submission 2 not stored correctly");
    });
  
  })