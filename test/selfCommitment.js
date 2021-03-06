const { expectThrow } = require('./expectThrow')
const { increaseTime } = require('./increaseTime')
const { latestTime } = require('./latestTime');
  
const SelfCommitment = artifacts.require('./SelfCommitment.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')
  
contract('SelfCommitment', async function(accounts) {
    const sender = accounts[0]
    const creator1 = accounts[1];
    const creator2 = accounts[2];
    const troll = accounts[3]; // internet troll who is disputing a submission
    const arbitratorOwner = accounts[5]
    const day = 24 * 60 * 60;
    const minute = 60;
    const ETH = 10**18;

    let now;
    let arbitrator;
    let selfCommitment;

    beforeEach(async function() {
        arbitrator = await CentralizedArbitrator.new(0.1 * ETH, { from: arbitratorOwner } );
        selfCommitment = await SelfCommitment.new(arbitrator.address, [], { from: sender } );
        now = await latestTime();
    })
  
    it('Should create a first challenge and craete two submissions', async () => {
        await selfCommitment.createChallenge("20 pushups", now + minute, now + 4*day, 20, { from: creator1, value: ETH });
        let challengesCount = await selfCommitment.getChallengesCount();
        assert.equal(challengesCount.toNumber(), 1, 'There should be exactly one challenge');

        let c = await selfCommitment.getChallengeById(0); // using short letters to avoid typing

        assert.equal(c[0], creator1, "creator")
        assert.equal(c[1].toNumber(), ETH, "deposit");
        assert.equal(c[2], "20 pushups", "description");
        assert.equal(c[3].toNumber(), now + minute, "start");
        assert.equal(c[4].toNumber(), now + 4*day, "end");
        assert.equal(c[5].toNumber(), 20, "count");
        assert.equal(c[6].toNumber(), 0, "state");

        await increaseTime(minute); 

        await selfCommitment.createSubmission("url", "something", 0, { from: creator1 });
        let submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 1, 'There should be exactly one submission');

        await selfCommitment.createSubmission("url2", "something2", 0, { from: creator1 });
        submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 2, 'There should be exactly two submissions');

        let submissionIDs = await selfCommitment.getChallengeSubmissionIDs.call(0); // using getter, because call() on the mapping directly requires a second parameter
        let secondSubmissionID = submissionIDs[1].toNumber();
        let submissionTwo = await selfCommitment.getSubmissionById(secondSubmissionID);

        assert.equal(submissionTwo[0].toNumber(), 0, "Challenge ID is 0");
        assert.equal(submissionTwo[1], "url2", "URL of submission 2 not stored correctly");
        assert.equal(submissionTwo[2], "something2", "Description of submission 2 not stored correctly");
        assert.closeTo(submissionTwo[3].toNumber(), now + minute, minute, "Timestamp should be equal (very close up to a minute) to the current time");
        assert.equal(submissionTwo[4].toNumber(), 0, "state should be initial");
    });

    // Creating more than just a single challenge to avoid situation 1 challenge, 1 submission, 1 dispute (everything index 0)
    it('Should create a three challenges and create two submissions to the second one and challenge then', async () => {
        await selfCommitment.createChallenge("21 pushups", now + 2*minute, now + 4*day, 20, { from: creator1, value: ETH });
        await selfCommitment.createChallenge("22 pushups", now + 2*minute, now + 4*day, 20, { from: creator2, value: ETH });
        await selfCommitment.createChallenge("23 pushups", now + 2*minute, now + 4*day, 20, { from: creator1, value: ETH });
        await increaseTime(2*minute); 
        await selfCommitment.createSubmission("url",  "something",  1, { from: creator2 });
        await selfCommitment.createSubmission("url2", "something2", 1, { from: creator2 });
        await selfCommitment.createSubmission("url3", "something3", 1, { from: creator2 });

        // Only creator of the challenge can create submission, expecting throw
        await expectThrow( selfCommitment.createSubmission("url2", "something2", 1, { from: creator1 }) );

        // TODO: Currently on the front-end only 0 is supported
        let arbitrationCost = (await arbitrator.arbitrationCost([])).toNumber();

        let disputedSubmissionID = 1;
        await selfCommitment.disputeSubmission(disputedSubmissionID, "url", "url", { from: troll, value: arbitrationCost })
        let s = await selfCommitment.getSubmissionById(disputedSubmissionID);
        assert.equal(s[4].toNumber(), 1, "state should be challenged");
        
        await arbitrator.giveRuling(0, 1, { from: arbitratorOwner });
        s = await selfCommitment.getSubmissionById(disputedSubmissionID);
        assert.equal(s[4].toNumber(), 2, "state should be accepted");

        // Now we are disputing third (id = 2) submission
        // Excess of the fee is returned (we send 10x the arbitration cost)
        disputedSubmissionID = 2;

        let balanceBefore = web3.eth.getBalance(troll).toNumber()
        await selfCommitment.disputeSubmission(disputedSubmissionID, "url", "url", { from: troll, value: arbitrationCost * 10 })
        let balanceAfter = web3.eth.getBalance(troll).toNumber()
        assert.closeTo(balanceBefore, balanceAfter + arbitrationCost, 0.05 * ETH, "sending too much ETH for arbitration fees should be refunded");


        balanceBefore = web3.eth.getBalance(arbitratorOwner).toNumber()

        await arbitrator.giveRuling(1, 2, { from: arbitratorOwner });
        s = await selfCommitment.getSubmissionById(disputedSubmissionID);
        assert.equal(s[4].toNumber(), 3, "state should be rejected");

        balanceAfter = web3.eth.getBalance(arbitratorOwner).toNumber()
        assert.closeTo(balanceBefore + arbitrationCost, balanceAfter, 0.01 * ETH, "Arbitrator should earn the abitration fee");

    });

    it('Should allow withdrawing money to original challenge creator if successful', async () => {
        await selfCommitment.createChallenge("something", now + 5*minute, now + 4*day, 3, { from: creator1, value: 1 });
        await selfCommitment.createChallenge("something", now + 5*minute, now + 4*day, 3, { from: creator1, value: ETH });
        
        await increaseTime(10*minute); 

        let challengeID = 1;

        await selfCommitment.createSubmission("url",  "something",  challengeID, { from: creator1 });
        await selfCommitment.createSubmission("url2", "something2", challengeID, { from: creator1 });
        await selfCommitment.createSubmission("url3", "something3", challengeID, { from: creator1 });

        await increaseTime(4*day + 3*day + 1*minute); // 4 days duration, 3 days timeout, 1 minute just in case

        let balanceBefore = web3.eth.getBalance(creator1).toNumber()
        await selfCommitment.withdrawFunds(challengeID, { from: sender });
        let balanceAfter = web3.eth.getBalance(creator1).toNumber()

        assert.closeTo(balanceBefore + ETH, balanceAfter, 0.05 * ETH, "upon successfull completion of challenge, the balance should increase by ETH (the initial deposit)");

        let c = await selfCommitment.getChallengeById(challengeID);
        assert.equal(c[6].toNumber(), 4, "state should be successWithdraw");
    });

    it('Should allow withdrawing money to the owner creator if challenge failed', async () => {
        await selfCommitment.createChallenge("something", now + 5*minute, now + 4*day, 3, { from: creator1, value: 1 });
        await selfCommitment.createChallenge("something", now + 5*minute, now + 4*day, 3, { from: creator1, value: ETH });
        
        await increaseTime(5*minute); 

        let challengeID = 1;

        await selfCommitment.createSubmission("url",  "something",  challengeID, { from: creator1 });
        await selfCommitment.createSubmission("url2", "something2", challengeID, { from: creator1 });

        await increaseTime(4*day + 3*day + 1*minute); // 4 days duration, 3 days timeout, 1 minute just in case

        let balanceBefore = web3.eth.getBalance(sender).toNumber()
        await selfCommitment.withdrawFunds(challengeID, { from: sender });
        let balanceAfter = web3.eth.getBalance(sender).toNumber()

        assert.closeTo(balanceBefore + ETH, balanceAfter, 0.05 * ETH, "sender should become richer by ETH (the initial deposit)");

        let c = await selfCommitment.getChallengeById(challengeID);
        assert.equal(c[6].toNumber(), 5, "state should be failedWithdraw");
    });





  })