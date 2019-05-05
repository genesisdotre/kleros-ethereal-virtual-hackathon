const { expectThrow } = require('./expectThrow')
const { increaseTime } = require('./increaseTime')
  
const SelfCommitment = artifacts.require('./SelfCommitment.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')
  
contract('SelfCommitment', async function(accounts) {
    const sender = accounts[0]
    const creator1 = accounts[1];
    const creator2 = accounts[1];
    const arbitratorOwner = accounts[5]
    const now = Math.floor( (+new Date()) / 1000 );
    const day = 24 * 60 * 60;
    const ETH = 10**18;

    let centralizedArbitrator;
    let selfCommitment;

    beforeEach(async function() {
        centralizedArbitrator = await CentralizedArbitrator.new(0.1 * ETH, { from: arbitratorOwner } );
        selfCommitment = await SelfCommitment.new(centralizedArbitrator.address, [], { from: sender } );
    })
  
    it('Should create a first challenge and craete two submissions', async () => {
        await selfCommitment.createChallenge("20 pushups", now - 4*day, now - 4*day, 20, { from: creator1, value: 18**10 });
        let challengesCount = await selfCommitment.getChallengesCount();
        assert.equal(challengesCount.toNumber(), 1, 'There should be exactly one challenge');
        
        await selfCommitment.createSubmission("url", "something", 0, { from: creator1 });
        let submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 1, 'There should be exactly one submission');

        await selfCommitment.createSubmission("url2", "something2", 0, { from: creator1 });
        submissionsCount = await selfCommitment.getSubmissionsCount();
        assert.equal(submissionsCount.toNumber(), 2, 'There should be exactly two submissions');

        let submissionIDs = await selfCommitment.getChallengeSubmissionIDs.call(0); // using getter, because call() on the mapping directly requires a second parameter
        let secondSubmissionID = submissionIDs[1].toNumber();
        let submissionTwo = await selfCommitment.getSubmissionById(secondSubmissionID);

        // console.log(submissionTwo);

        assert.equal(submissionTwo[0].toNumber(), 0, "Challenge ID is 0");
        assert.equal(submissionTwo[1], "url2", "URL of submission 2 not stored correctly");
        assert.equal(submissionTwo[2], "something2", "Description of submission 2 not stored correctly");
        // assert.equal(submissionTwo[3], "url2", "URL of submission 2 not stored correctly");

        // console.log(submissionTwo[3]);
        // console.log(submissionTwo[3].toNumber());
        var time = submissionTwo[3].toNumber();
        console.log("_______")
        console.log(now - time);
        console.log("_______")

        assert.equal(submissionTwo[4].toNumber(), 0, "state should be initial");
    });

    it('Should create a three challenges and craete two submissions to the second one and challenge then', async () => {
        await selfCommitment.createChallenge("21 pushups", now - 4*day, now - 4*day, 20, { from: creator1, value: 18**10 });
        await selfCommitment.createChallenge("22 pushups", now - 4*day, now - 4*day, 20, { from: creator2, value: 18**10 });
        await selfCommitment.createChallenge("23 pushups", now - 4*day, now - 4*day, 20, { from: creator1, value: 18**10 });
        await selfCommitment.createSubmission("url",  "something",  2, { from: creator2 });
        await selfCommitment.createSubmission("url2", "something2", 2, { from: creator2 });


        // Only creator of the challenge can create submission
        console.log("before create")
        await expectThrow( selfCommitment.createSubmission("url2", "something2", 2, { from: creator1 }) );
        console.log("after create")


        // TODO: Currently on the front-end only 0 is supported
        // Fee is transferred





        // Excess of the fee is returned




        // submissionsCount = await selfCommitment.getSubmissionsCount();
        // assert.equal(submissionsCount.toNumber(), 2, 'There should be exactly two submissions');

        // let submissionIDs = await selfCommitment.getChallengeSubmissionIDs.call(0); // using getter, because call() on the mapping directly requires a second parameter
        // let secondSubmissionID = submissionIDs[1].toNumber();
        // let submissionTwo = await selfCommitment.getSubmissionById(secondSubmissionID);

        // console.log(submissionTwo);

        // assert.equal(submissionTwo[0].toNumber(), 0, "Challenge ID is 0");
        // assert.equal(submissionTwo[1], "url2", "URL of submission 2 not stored correctly");
        // assert.equal(submissionTwo[2], "something2", "Description of submission 2 not stored correctly");
        // assert.equal(submissionTwo[3], "url2", "URL of submission 2 not stored correctly");

        // console.log(submissionTwo[3]);
        // console.log(submissionTwo[3].toNumber());
        // var time = submissionTwo[3].toNumber();
        // var date = new Date(time);
        // console.log(date);


        // assert.equal(submissionTwo[4].toNumber(), 0, "state should be initial");
    });




    // TODO: I really wish I had more time to write tests
    // Right now prioritising better usability, as this is something jurors will see
    // It is very unfortunate that I've wasted so much time on that: https://ethereum.stackexchange.com/a/43633/2524
    // ⚠️ This repo is deprecated ⚠️ Truffle has moved all modules to a monorepo at trufflesuite/truffle. See you over there!

  })