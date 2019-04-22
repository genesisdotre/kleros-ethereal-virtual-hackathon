var app = angular.module('app', ['angularMoment', 'ngRoute'])

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

class Submission {
  constructor(url, comment, timestamp, state) {
    this.url = url;
    this.comment = comment;
    this.timestamp = timestamp;
    this.state = state;
  }
}

let ChallengeState = { 0: "initial", 1: "inprogress", 2: "success", 3: "failed" };
let SubmissionState = { 0: "initial", 1: "voting", 2: "accepted", 3: "rejected" };

app.filter('challenge', function() {
  return function(input) { return ChallengeState[input] };
});

app.filter('submission', function() {
  return function(input) { return SubmissionState[input] };
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'partials/home.html',
      controller: "HomeCtrl"
    })
    .when('/challenge/:id', {
      templateUrl: 'partials/challenge.html',
      controller: "ChallengeCtrl"
    })
    .otherwise('/home')
});

app.run(async function($rootScope) {
  $rootScope.address = "0x95e6b7b2d4a286ea924bbdf18362ecf532d95bd7";
  
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
          "name": "challengeID",
          "type": "uint256"
        }
      ],
      "name": "getChallengeSubmissionIDs",
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

app.controller('HomeCtrl', function($scope, $q) {
  $scope.message = "WORK STARTED";
  $scope.challenges = [];

  setTimeout(async function() { // HACK HACK HACK
    let temp = await contract.getChallengesCount();
    let challengesCount = temp.toNumber()
    let arrayOfPromises = [];
  
    for (let i=0; i<challengesCount; i++) {
      arrayOfPromises.push(contract.getChallengeById(i));
    }
  
    $q.all(arrayOfPromises).then(function(results) {
      console.log(results);
      results.forEach((r) => {
        $scope.challenges.push(new Challenge(r[0], parseFloat(ethers.utils.formatEther(r[1])).toFixed(3), r[2], r[3].toNumber(), r[4].toNumber(), r[5].toNumber(), r[6] ))
      })
    })

  }, 1000); // HACK HACK HACK

});

app.controller('ChallengeCtrl', function($scope, $q, $routeParams) {
  console.log($routeParams);
  $scope.id = $routeParams.id;
  $scope.submissions = [];

  setTimeout(async function() { // HACK HACK HACK
    let submissions = await contract.getChallengeSubmissionIDs($scope.id);
    submissions = submissions.map(s => s.toNumber()); // these do not have consecutive numbers
    let arrayOfPromises = [];
  
    for (let i=0; i<submissions.length; i++) {
      arrayOfPromises.push(contract.getSubmissionById(submissions[i]));
    }
  
    $q.all(arrayOfPromises).then(function(results) {
      console.log(results);
      results.forEach((r) => {
        $scope.submissions.push(new Submission(r[0], r[1], r[2].toNumber(), r[3] ))
      })
    })

  }, 1000); // HACK HACK HACK


});