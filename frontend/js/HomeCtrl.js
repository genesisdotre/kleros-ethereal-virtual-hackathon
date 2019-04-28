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