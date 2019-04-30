const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });

var archon = new Archon('https://mainnet.infura.io');
archon.setIpfsGateway('https://gateway.ipfs.io');
console.log(archon.version, "Archon is on!");

const app = angular.module('app', ['angularMoment', 'ngRoute', 'ui.bootstrap'])

app.run(async function($rootScope) {
  $rootScope.address = "0xe75142aa2a7ca74dad04ebcc3c9608f0f28bfdcd";


  assistInstance.onboard()
  .then(function(success) {
    alert("hurray");
    console.log(success);
    // User has been successfully onboarded and is ready to transact
    // This means we can be sure of the follwing user properties:
    //  - They are using a compatible browser
    //  - They have a web3-enabled wallet installed
    //  - The wallet is connected to the config-specified networkId
    //  - The wallet is unlocked and contains at least `minimumBalance` in wei
    //  - They have connected their wallet to the dapp, congruent with EIP1102
  })
  .catch(function(error) {
    // The user exited onboarding before completion
    // Will let you know which stage of onboarding the user reached when they exited
    console.log(error.message);
  })



  // try {
  //   accounts = await ethereum.enable();
  // } catch (error) {
  //   console.log(error);
  // }

  // provider = new ethers.providers.Web3Provider(web3.currentProvider);

  // console.log(await provider.getNetwork());

  // signer = provider.getSigner();

  // contract = new ethers.Contract($rootScope.address, ABI, signer);

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

app.filter('challenge', function() {
  return function(input) { return ChallengeState[input] };
});

app.filter('submission', function() {
  return function(input) { return SubmissionState[input] };
});