const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });

var archon = new Archon('https://mainnet.infura.io');
archon.setIpfsGateway('https://gateway.ipfs.io');
console.log(archon.version, "Archon is on!");

const app = angular.module('app', ['angularMoment', 'ngRoute', 'ui.bootstrap'])

app.run(async function($rootScope) {
  $rootScope.address = "0xe4939e481ec2f313f1428db8e2dc776868144ca8";
  
  try {
    accounts = await ethereum.enable();
  } catch (error) {
    console.log(error);
  }

  provider = new ethers.providers.Web3Provider(web3.currentProvider);

  console.log(await provider.getNetwork());

  signer = provider.getSigner();

  contract = new ethers.Contract($rootScope.address, ABI, signer);

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