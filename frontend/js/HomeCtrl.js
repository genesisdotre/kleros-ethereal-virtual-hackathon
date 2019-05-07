app.controller('HomeCtrl', function($scope, $q) {
    $scope.challenges = [];
  
    $scope.form = {
      deposit: "",
      description: "",
      start: new Date( +new Date() + 5*60*60*1000), // 5 minutes from now (challenge can start only in the future)
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
      if ($scope.form.start < new Date( +new Date() + 1*60*60*1000)) { // by default we are 5 minutes in the future
        alert("Challenges can start only in the future");
        return;
      }

      await contract.createChallenge($scope.form.description,  Math.floor(+$scope.form.start / 1000), Math.floor(+$scope.form.end / 1000), 
                                    $scope.form.howMany, { value: ethers.utils.parseEther($scope.form.deposit)});
    }
  
});