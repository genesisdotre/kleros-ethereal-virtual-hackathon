let ABI = [
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
				"name": "_metaEvidenceURI",
				"type": "string"
			},
			{
				"name": "_evidenceURI",
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
		"constant": false,
		"inputs": [
			{
				"name": "_challengeID",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
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
		"name": "chalengeIDToSubmissionIDs",
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
		"name": "challengeIDToMetaEvidenceHash",
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
		"name": "disputeIDToSubmissionID",
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
		"inputs": [
			{
				"name": "_challengeID",
				"type": "uint256"
			}
		],
		"name": "isChallengeSuccessfulInTheCurrentState",
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
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "MetaEvidenceHashes",
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
		"name": "userToChallengeIDs",
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