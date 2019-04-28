const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });

const app = angular.module('app', ['angularMoment', 'ngRoute', 'ui.bootstrap'])

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
  constructor(challengeID, url, comment, timestamp, state) {
    this.challengeID = challengeID;
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
  $rootScope.address = "0xe4939e481ec2f313f1428db8e2dc776868144ca8";
  
  $rootScope.ABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_arbitrator",
          "type": "address"
        },
        {
          "name": "_arbitratorExtraData",
          "type": "bytes"
        }
      ],
      "name": "changeArbitrator",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
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
          "name": "_challengeID",
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
      "inputs": [
        {
          "name": "_submissionID",
          "type": "uint256"
        },
        {
          "name": "metaEvidence",
          "type": "string"
        },
        {
          "name": "evidence",
          "type": "string"
        }
      ],
      "name": "disputeSubmission",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_disputeID",
          "type": "uint256"
        },
        {
          "name": "_ruling",
          "type": "uint256"
        }
      ],
      "name": "rule",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_arbitrator",
          "type": "address"
        },
        {
          "name": "_arbitratorExtraData",
          "type": "bytes"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "debugInfo",
          "type": "string"
        }
      ],
      "name": "Log",
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
          "name": "_metaEvidenceID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_evidence",
          "type": "string"
        }
      ],
      "name": "MetaEvidence",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_arbitrator",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_disputeID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_metaEvidenceID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_evidenceGroupID",
          "type": "uint256"
        }
      ],
      "name": "Dispute",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_arbitrator",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_evidenceGroupID",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "_party",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_evidence",
          "type": "string"
        }
      ],
      "name": "Evidence",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "_arbitrator",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "_disputeID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_ruling",
          "type": "uint256"
        }
      ],
      "name": "Ruling",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "arbitrator",
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
      "inputs": [],
      "name": "arbitratorExtraData",
      "outputs": [
        {
          "name": "",
          "type": "bytes"
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
      "name": "challengeIDtoMetaEvidenceHash",
      "outputs": [
        {
          "name": "",
          "type": "string"
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
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "disputeIDtoSubmissionID",
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
          "type": "uint256"
        },
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
          "name": "challengeID",
          "type": "uint256"
        },
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
          "name": "disputeID",
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
  ];

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

  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.url = "https://www.youtube.com/watch?v=R8MWKsheHxk";
  $scope.reason = "music";
  $scope.report = function() {

    var evidenceHash = Archon.utils.multihashFile($scope.url, 0x1B /* keccak-256 */);
    console.log(evidenceHash);

  }


  $scope.form = {
    deposit: "0.01",
    description: "20 pushups daily",
    start: new Date(),
    end: new Date( +new Date() + 30*24*60*60*1000), // 30 days from now
    howMany: 30
  };

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


  $scope.newChallenge = async function() {
    await contract.createChallenge($scope.form.description,  Math.floor(+$scope.form.start / 1000), Math.floor(+$scope.form.end / 1000), 
                                  $scope.form.howMany, { value: ethers.utils.parseEther($scope.form.deposit)});
  }

});

app.controller('ChallengeCtrl', function($scope, $q, $routeParams) {
  console.log($routeParams);
  $scope.id = $routeParams.id;
  $scope.submissions = [];

  $scope.form = {
    url: "https://www.youtube.com/watch?v=yQjHSIHPJfw",
    description: "20 minutes meditation Today",
  };

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
        $scope.submissions.push(new Submission(r[0], r[1], r[2], r[3].toNumber(), r[4] ))
      })
    })

  }, 1000); // HACK HACK HACK


  $scope.newEvidence = async function() {
    await contract.createSubmission($scope.form.url, $scope.form.description, $scope.id);
  }

  $scope.disputeSubmission = async function(s) {

    var reason = prompt("What is the reason?", "Someone is wrong on the internet.");
    if (reason == null) {
      console.log("prompt cancelled");
    } else if (reason === "") {
      alert("Need to provide a reason to ease Arbitrator work, sorry not sorry.");
    } else {
      console.log(reason);

      // build evidence object, JSON it (remove whitespaces), upload to IPFS, create hash (archin lib), create transaction... #complicated
      // {
      //   "fileURI": string,
      //   "fileHash": string,
      //   "fileTypeExtension": string,
      //   "name": string,
      //   "description": string
      // }
      // it's the nmae of the game to comply with the standard: https://github.com/ethereum/EIPs/issues/1497#issuecomment-487121885

      let evidence = {
        fileURI: s.url,
        name: reason,
        description: "Evidence submitted from the app"
      }

      let evidenceString = JSON.stringify(evidence);

      // https://github.com/dy/string-to-arraybuffer/blob/804d870138371bbdde7d3b2e738f0a0f822c6d3d/index.js#L22-L28
      function str2ab(str) {
        var array = new Uint8Array(str.length);
        for(var i = 0; i < str.length; i++) {
          array[i] = str.charCodeAt(i);
        }
        return array.buffer
      }

      let evidenceArrayBuffer = str2ab(evidenceString);

      let evidenceArrayBufferToBuffer = buffer.Buffer( evidenceArrayBuffer );
    
      ipfs.add(evidenceArrayBufferToBuffer, (err, result) => {
        console.log(err, result);
        console.log("https://gateway.ipfs.io/ipfs/" + result[0].hash,  result[0].hash);
      });


    }

  }


});