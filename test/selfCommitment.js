const { expectThrow } = require('./expectThrow')
const { increaseTime } = require('./increaseTime')
  
const SelfCommitment = artifacts.require('./SelfCommitment.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')
  
contract('SelfCommitment', async function(accounts) {
    const sender = accounts[0]
    const challengeCreator = accounts[1];
    const arbitrator = accounts[5]
    const now = Math.floor( (+new Date()) / 1000 );
    const day = 24 * 60 * 60;

    let centralizedArbitrator;
    let selfCommitment;

    beforeEach(async function() {
        centralizedArbitrator = await CentralizedArbitrator.new(0, { from: arbitrator } );
        selfCommitment = await SelfCommitment.new(centralizedArbitrator.address, [], { from: sender } );
    })
  
    it('Should create a first challenge and craete two submissions', async () => {
        await selfCommitment.createChallenge("20 pushups", now - 4*day, now - 4*day, 20, { from: challengeCreator, value: 18**10 });
        let challengesCount = await selfCommitment.getChallengesCount();
        assert.equal(challengesCount.toNumber(), 1, 'There should be exactly one challenge');
        
        await selfCommitment.createSubmission("url", "something", 0, { from: challengeCreator });
        let submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 1, 'There should be exactly one submission');

        await selfCommitment.createSubmission("url2", "something2", 0, { from: challengeCreator });
        submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 2, 'There should be exactly two submissions');

        let submissionIDs = await selfCommitment.getChallengeSubmissionIDs.call(0); // using getter, because call() on the mapping directly requires a second parameter
        let secondSubmissionID = submissionIDs[1].toNumber();
        let submissionTwo = await selfCommitment.getSubmissionById(secondSubmissionID);
        assert.equal(submissionTwo[1], "url2", "URL of submission 2 not stored correctly");
    });

    // TODO: I really wish I had more time to write tests
    // Right now prioritising better usability, as this is something jurors will see
    // It is very unfortunate that I've wasted so much time on that: https://ethereum.stackexchange.com/a/43633/2524
    // ⚠️ This repo is deprecated ⚠️ Truffle has moved all modules to a monorepo at trufflesuite/truffle. See you over there!

  })