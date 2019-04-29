/* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
const { expectThrow } = require('./expectThrow')
const { increaseTime } = require('./increaseTime')
  
const SelfCommitment = artifacts.require('./SelfCommitment.sol')
const CentralizedArbitrator = artifacts.require('./CentralizedArbitrator.sol')
  
contract('SelfCommitment', async function(accounts) {
    const sender = accounts[0]
    const challengeCreator = accounts[1];
    const arbitrator = accounts[5]
    // const other = accounts[3]
    const amount = 1000
    const feeTimeout = 100
    const timeoutPayment = 100
    const timeout = 100 // TODO must remove it
    const arbitrationFee = 20
    const gasPrice = 5000000000
    const metaEvidenceUri = 'https://kleros.io'
    const now = Math.floor( (+new Date()) / 1000 );

    let centralizedArbitrator;
    let selfCommitment;

    beforeEach(async function() {
        centralizedArbitrator = await CentralizedArbitrator.new(0, { from: arbitrator } );
        selfCommitment = await(new SelfCommitment(centralizedArbitrator.address), { from: sender } );
    })
  
    it('Should create a first challenge', async () => {

        await selfCommitment.createChallenge("20 pushups", now, now, 20, { from: challengeCreator, value: 18**10 });

        let challengesCount = await selfCommitment.getChallengesCount();

        assert.equal(challengesCount.toNumber(), 1, 'There should be exactly one challenge')


    //   const multipleContract = await MultipleArbitrableTransaction.new(
    //     0x0,
    //     0x0,
    //     feeTimeout,
    //     { from: sender }
    //   )
    //   const lastTransaction = await getLastTransaction(
    //     multipleContract,
    //     async () => {
    //       await multipleContract.createTransaction(
    //         timeoutPayment,
    //         receiver,
    //         metaEvidenceUri,
    //         { from: sender, value: amount }
    //       )
    //     }
    //   )
  
    //   const arbitrableTransactionId = lastTransaction.args._metaEvidenceID.toNumber()
    //   const senderBalanceBeforeReimbursment = web3.eth.getBalance(sender)
    //   await multipleContract.reimburse(arbitrableTransactionId, 1000, {
    //     from: receiver
    //   })
    //   const newSenderBalance = web3.eth.getBalance(sender)
    //   const newContractBalance = web3.eth.getBalance(multipleContract.address)
    //   const newAmount = (await multipleContract.transactions(
    //     arbitrableTransactionId
    //   ))[2]
  
    //   assert.equal(
    //     newSenderBalance.toString(),
    //     senderBalanceBeforeReimbursment.plus(1000).toString(),
    //     'The sender has not been reimbursed correctly'
    //   )
    //   assert.equal(newContractBalance.toNumber(), 0, 'Bad amount in the contract')
    //   assert.equal(newAmount.toNumber(), 0, 'Amount not updated correctly')
    })

    // it('Should handle 1 transaction', async () => {
    //   const multipleContract = await MultipleArbitrableTransaction.new(
    //     0x0,
    //     0x0,
    //     feeTimeout,
    //     { from: sender }
    //   )
    //   const lastTransaction = await getLastTransaction(
    //     multipleContract,
    //     async () => {
    //       await multipleContract.createTransaction(
    //         timeoutPayment,
    //         receiver,
    //         metaEvidenceUri,
    //         { from: sender, value: amount }
    //       )
    //     }
    //   )
  
    //   const arbitrableTransactionId = lastTransaction.args._metaEvidenceID.toNumber()
    //   const senderBalanceBeforeReimbursment = web3.eth.getBalance(sender)
    //   await multipleContract.reimburse(arbitrableTransactionId, 1000, {
    //     from: receiver
    //   })
    //   const newSenderBalance = web3.eth.getBalance(sender)
    //   const newContractBalance = web3.eth.getBalance(multipleContract.address)
    //   const newAmount = (await multipleContract.transactions(
    //     arbitrableTransactionId
    //   ))[2]
  
    //   assert.equal(
    //     newSenderBalance.toString(),
    //     senderBalanceBeforeReimbursment.plus(1000).toString(),
    //     'The sender has not been reimbursed correctly'
    //   )
    //   assert.equal(newContractBalance.toNumber(), 0, 'Bad amount in the contract')
    //   assert.equal(newAmount.toNumber(), 0, 'Amount not updated correctly')
    // })
  
    // it('Should handle 3 transaction', async () => {
    //   const multipleContract = await MultipleArbitrableTransaction.new(
    //     0x0,
    //     0x0,
    //     feeTimeout,
    //     { from: sender }
    //   )
    //   for (var cnt = 0; cnt < 3; cnt += 1) {
    //     const lastTransaction = await getLastTransaction(
    //       multipleContract,
    //       async () => {
    //         await multipleContract.createTransaction(
    //           timeoutPayment,
    //           receiver,
    //           metaEvidenceUri,
    //           { from: sender, value: amount }
    //         )
    //       }
    //     )
  
    //     const arbitrableTransactionId = lastTransaction.args._metaEvidenceID.toNumber()
  
    //     const senderBalanceBeforeReimbursment = web3.eth.getBalance(sender)
    //     await multipleContract.reimburse(arbitrableTransactionId, 1000, {
    //       from: receiver
    //     })
    //     const newSenderBalance = web3.eth.getBalance(sender)
    //     const newContractBalance = web3.eth.getBalance(multipleContract.address)
    //     const newAmount = (await multipleContract.transactions(
    //       arbitrableTransactionId
    //     ))[2]
  
    //     assert.equal(
    //       newSenderBalance.toString(),
    //       senderBalanceBeforeReimbursment.plus(1000).toString(),
    //       'The sender has not been reimbursed correctly'
    //     )
    //     assert.equal(
    //       newContractBalance.toNumber(),
    //       0,
    //       'Bad amount in the contract'
    //     )
    //     assert.equal(newAmount.toNumber(), 0, 'Amount not updated correctly')
    //   }
    // })
  
  })