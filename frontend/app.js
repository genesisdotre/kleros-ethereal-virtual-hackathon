var app = angular.module('app', ['angularMoment'])

class Challenge {
  constructor(user, deposit, description, beginning, end, count, state) {
    this.user = user;
    this.deposit = deposit;
    this.description = description;
    this.beginning = beginning;
    this.end = end;
    this.count = count; 
    this.state = state;
  }
}

app.run(async function($rootScope) {
  $rootScope.address = "0xee532dc8ad07daae711048d8cffb7deb58be9e09";
  
  $rootScope.ABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_description",
          "type": "string"
        },
        {
          "name": "_beginning",
          "type": "uint256"
        },
        {
          "name": "_end",
          "type": "uint256"
        },
        {
          "name": "_count",
          "type": "uint256"
        }
      ],
      "name": "createChallenge",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_url",
          "type": "string"
        },
        {
          "name": "_comment",
          "type": "string"
        },
        {
          "name": "challengeID",
          "type": "uint256"
        }
      ],
      "name": "createSubmission",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "deposit",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "beginning",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "end",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "count",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ChallengeAdd",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "challengeID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "url",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "comment",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "SubmissionAdd",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "chalengeSubmissionIDs",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "challenges",
      "outputs": [
        {
          "name": "user",
          "type": "address"
        },
        {
          "name": "deposit",
          "type": "uint256"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "beginning",
          "type": "uint256"
        },
        {
          "name": "end",
          "type": "uint256"
        },
        {
          "name": "count",
          "type": "uint256"
        },
        {
          "name": "state",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "challengeID",
          "type": "uint256"
        }
      ],
      "name": "getChallengeById",
      "outputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getChallengesCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "submissionID",
          "type": "uint256"
        }
      ],
      "name": "getSubmissionById",
      "outputs": [
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getSubmissionsCount",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserChallengeIDs",
      "outputs": [
        {
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "submissions",
      "outputs": [
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "comment",
          "type": "string"
        },
        {
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "name": "state",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userChallengeIDs",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
  
  try {
    accounts = await ethereum.enable();
  } catch (error) {
    console.log(error);
  }

  provider = new ethers.providers.Web3Provider(web3.currentProvider);

  console.log(await provider.getNetwork());

  signer = provider.getSigner();

  contract = new ethers.Contract($rootScope.address, $rootScope.ABI, signer);

});

app.controller('ctrl', async function($scope, $q) {
  $scope.message = "WORK STARTED";
  $scope.challenges = [];

  setTimeout(async function() {

    let temp = await contract.getChallengesCount();

    let challengesCount = temp.toNumber()
  
    let arrayOfPromises = [];
  
    for (let i=0; i<challengesCount; i++) {
      arrayOfPromises.push(contract.getChallengeById(i));
    }
  
    $q.all(arrayOfPromises).then(function(results) {
      console.log(results);
      results.forEach((r) => {

        // console.log( r[0], r[1].toNumber(), r[2], r[3].toNumber(), r[4].toNumber(), r[5].toNumber(), r[6] );

        $scope.challenges.push(new Challenge(r[0], ethers.utils.formatEther(r[1]), r[2], r[3].toNumber(), r[4].toNumber(), r[5].toNumber(), r[6] ))
      })
      // $scope.$apply();
    })

  }, 1000); // HACK HACK HACK









  // $scope.warningShown = true;
	// $scope.accounts = [];
  // $scope.bids = [];
  // $scope.guranteedBids = [];
	// $scope.refunds = [];

  // $scope.contract.description.call(function(err, res) {
  //   $scope.description = res;
  //   $scope.$apply();
  // });  

  // $scope.contract.timestampEnd.call(function(err, res) {
  //   $scope.timestampEnd = res.toNumber();
  //   $scope.$apply();
  // });  

  // $scope.contract.howManyGuaranteed.call(function(err, res) {
  //   $scope.howManyGuaranteed = res.toNumber();
  // });    

  // $scope.contract.price.call(function(err, res) {
  //   $scope.price = +web3.fromWei( res.toNumber() );
  //   $scope.$apply();
  // });    

  // $scope.contract.priceGuaranteed.call(function(err, res) {
  //   $scope.priceGuaranteed = +web3.fromWei( res.toNumber() );
  // });  

  // $scope.contract.howMany.call(function(err, res) {
  //   $scope.howMany = res.toNumber();
  // });

  // $scope.contract.getAccountListLenght(function(err, res) {
  //   lenght = res.toNumber() + 1; // because we have HEAD and TAIL we do some shananigans here
  //   for (i=0; i<lenght; i++) {
  //     $scope.contract.bids(i, function(err2, res2) {

  //       console.log(res2);

  //       if(res2[3] === "0x0000000000000000000000000000000000000000") return; // dropping witdrawn / HEAD / TAIL bids

  //       var account = {
  //         bidder: res2[3],
  //         value: +web3.fromWei(res2[2].toNumber()) // BigNumber to Number to Ether to digits...
  //       }

  //       $scope.accounts.push(account);  
  //       $scope.$apply(); // TODO: promises, $apply only once towards the end

  //     });
  //   }
  // });  

  // $scope.contract.getGuaranteedContributorsLenght(function(err, res) {
  //   $scope.guaranteedSold = lenght = res.toNumber()
  //   for (i=0; i<lenght; i++) {
  //     $scope.contract.guaranteedContributors(i, function(err2, res2) {
  //       $scope.contract.guaranteedContributions(res2, function(err3, res3) {

  //         var guaranteed = {
  //           bidder: res2,
  //           value: +web3.fromWei(res3.toNumber()) // BigNumber to Number to Ether to digits...
  //         }
  //         $scope.guranteedBids.push(guaranteed);
  //         $scope.$apply();
  //       })
  //     });
  //   }
  // });

  // let bidEvent = $scope.contract.BidEvent({}, {fromBlock: 0, toBlock: 'latest'})
  // bidEvent.get(function(error, events) {

  //   console.log(events);

  //   events.forEach(function(event) {
  //     var bid = {
  //       bidder: event.args.bidder,
  //       value: +web3.fromWei( event.args.value.toNumber() ),
  //       timestamp: event.args.timestamp.toNumber(),
  //       tx: event.transactionHash
  //     }
  //     $scope.bids.push(bid);
  //   });

  //   $scope.$apply();
  // });   

  // let guaranteedBidEvent = $scope.contract.GuaranteedBid({}, {fromBlock: 0, toBlock: 'latest'})
  // guaranteedBidEvent.get(function(error, events) {

  //   console.log(events);

  //   events.forEach(function(event) {
  //     var bid = {
  //       bidder: event.args.bidder,
  //       value: +web3.fromWei( event.args.value.toNumber() ),
  //       timestamp: event.args.timestamp.toNumber(),
  //       tx: event.transactionHash
  //     }
  //     $scope.bids.push(bid);
  //   });

  //   $scope.$apply();
  // });  


  // let refundEvent = $scope.contract.Refund({}, {fromBlock: 0, toBlock: 'latest'})
  // refundEvent.get(function(error, events) {

  //   console.log(events);

  // 	events.forEach(function(event) {
  // 		var refund = {
  // 			bidder: event.args.bidder,
  // 			value: +web3.fromWei( event.args.value.toNumber() ),
  // 			timestamp: event.args.timestamp.toNumber(),
  // 			tx: event.transactionHash
  // 		}
  // 		$scope.refunds.push(refund);
  // 	});

  // 	$scope.$apply();
  // });



  // TODO: display popup as new bid is incoming
  // BidEvent = Instance.BidEvent();
  // BidEvent.watch(function(error, result){
  //  console.log(error, result);
  // });

});
