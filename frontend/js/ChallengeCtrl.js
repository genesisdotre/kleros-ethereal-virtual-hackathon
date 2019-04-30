app.controller('ChallengeCtrl', function($scope, $http, $q, $routeParams, utils) {
    console.log($routeParams);
    $scope.id = $routeParams.id;
    $scope.submissions = [];
  
    $scope.form = {
      url: "https://www.youtube.com/watch?v=yQjHSIHPJfw",
      description: "20 minutes meditation Today",
    };
  
    setTimeout(async function() { // HACK HACK HACK
      let submissionIDs = await contract.getChallengeSubmissionIDs($scope.id);
      submissionIDs = submissionIDs.map(s => s.toNumber()); // these do not have consecutive numbers
      let arrayOfPromises = [];
    
      for (let i=0; i<submissionIDs.length; i++) {
        arrayOfPromises.push(contract.getSubmissionById(submissionIDs[i]));
      }
    
      $q.all(arrayOfPromises).then(function(results) {
        console.log(results);
  
        results.forEach((r, index) => {
          $scope.submissions.push(new Submission(submissionIDs[index], r[0], r[1], r[2], r[3].toNumber(), r[4] ))
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
  
        
        // Evidence Standard: https://github.com/ethereum/EIPs/issues/1497#issuecomment-487121885
  
        let evidence = {
          fileURI: s.url,
          name: reason,
          description: "Evidence submitted from the app."
        }
  
        let evidencePromise = utils.uploadToIPFS(evidence);
  
        // MetaEvidence
        // {
        //   "fileURI": string,
        //   "fileHash": string,
        //   “fileTypeExtension": string,
        //   "category": string,
        //   "title": string,
        //   "description": string,
        //   "aliases": {
        //     [string]: string
        //   },
        //   "question": string,
        //   "rulingOptions": {
        //     "type": string,
        //     "precision": number,
        //     "titles": [],
        //     "descriptions": []
        //   },
        //   "evidenceDisplayInterfaceURI": string,
        //   "evidenceDisplayInterfaceHash": string,
        //   "dynamicScriptURI": string,
        //   "dynamicScriptHash: string
        // }
        // All fields are optional.
  
        let fileContent = (await $http.get("../readme.md")).data; // we are hosted on GitHub pages, readme is right there, no CORS issues
        var fileHash = Archon.utils.multihashFile(fileContent, 0x1B); // keccak-256
  
        let metaEvidence = {
          fileURI: "https://raw.githubusercontent.com/genesisdotre/kleros-ethereal-virtual-hackathon/master/readme.md",
          fileHash: fileHash,
          title: "TODO: Challenge title <img src='xss' onerror='alert(\"title\")'>", // TODO: retrieve it https://github.com/genesisdotre/kleros-ethereal-virtual-hackathon/issues/3
          question: "Is this submission to the challenge valid <img src='xss' onerror='alert(\"question\")'>?",
          rulingOptions: {
            type: "single",
            titles: ["yes <img src='xss' onerror='alert(\"titles\")'> 🔥🔥🔥", "no"],
            descriptions: ["Yes, submission is valid. <img src='xss' onerror='alert(\"descriptions\")'> 🔥🔥🔥", "No, submission is not valid."]
          }
        }
        
        let metaEvidencePromise = utils.uploadToIPFS(metaEvidence);
  
        $q.all([evidencePromise, metaEvidencePromise]).then(function(results) {
  
          console.log(results);
          contract.disputeSubmission(s.ID, "ipfs://" + results[0], "ipfs://" + results[1]);
  
        });
  
      }
  
    }
  
  });