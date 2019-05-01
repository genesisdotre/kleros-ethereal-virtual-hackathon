const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });

var archon = new Archon('https://mainnet.infura.io');
archon.setIpfsGateway('https://gateway.ipfs.io');
console.log(archon.version, "Archon is on!");

const app = angular.module('app', ['angularMoment', 'ngRoute'])

app.run(async function($rootScope) {
  $rootScope.address = "0x02065e823843D9e5277786e6CdD4764D92AcE2a4";

  try {
    $rootScope.accounts = accounts = await ethereum.enable();
  } catch (error) {
    gotofail();
    console.log(error);
  }

  provider = new ethers.providers.Web3Provider(web3.currentProvider);

  network = await provider.getNetwork();

  console.log(network);

  if (network.chainId !== 42) {
    gotofail();
  }

  let networkLongPolling = setInterval(async function(){
    network = await provider.getNetwork()

    if (network.chainId !== 42) {
      clearInterval(networkLongPolling);
      gotofail();
    }
  }, 1000);

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

// OMFG such a beautiful hack
function gotofail() {
  $("[ng-view]").hide();
  $("#metamask-kovan").show();
}