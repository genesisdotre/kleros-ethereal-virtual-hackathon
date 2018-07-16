pragma solidity ^0.4.23;

import "./AuctionMultiple.sol";

// 100000000000000000, "membership in Casa Crypto", 1546300799, "0x8855Ef4b740Fc23D822dC8e1cb44782e52c07e87", 20, 5, 5000000000000000000

// 100000000000000000, "membership in Casa Crypto", 1538351999, "0x09b25F7627A8d509E5FaC01cB7692fdBc26A2663", 5, 2, 1000000000000000000

// For instance: effering limited "Early Bird" tickets that are guaranteed
contract AuctionMultipleGuaranteed is AuctionMultiple {

  uint public howManyGuaranteed; // after guaranteed slots are used, we decrease the number of slots available (in the parent contract)
  uint public priceGuaranteed;
  address[] public guaranteedContributors; // cannot iterate mapping, keeping addresses in an array
  mapping (address => uint) public guaranteedContributions;
  function getGuaranteedContributorsLenght() public constant returns(uint) { return guaranteedContributors.length; } // lenght is not accessible from DApp, exposing convenience method: https://stackoverflow.com/questions/43016011/getting-the-length-of-public-array-variable-getter

  event GuaranteedBid(address indexed bidder, uint value, uint timestamp);
  
  constructor(uint _price, string _description, uint _timestampEnd, address _beneficiary, uint _howMany, uint _howManyGuaranteed, uint _priceGuaranteed) AuctionMultiple(_price, _description, _timestampEnd, _beneficiary, _howMany) public {
    require(_howMany >= _howManyGuaranteed, "The number of guaranteed items should be less or equal than total items. If equal = fixed price sell, kind of OK with me");
    require(_priceGuaranteed > 0, "Guranteed price must be greated than zero");

    howManyGuaranteed = _howManyGuaranteed;
    priceGuaranteed = _priceGuaranteed;
  }

  function bid() public payable {
    require(now < timestampEnd, "cannot bid after the auction ends");
    require(guaranteedContributions[msg.sender] == 0, "already a guranteed contributor, cannot more than once");

    // Handling the case when we were not guaranteed and now we are adding extra money so we are guaranteed after all
    uint myBidId = contributors[msg.sender];
    if (myBidId > 0) {
      uint newTotalValue = bids[myBidId].value + msg.value;
      if (newTotalValue >= priceGuaranteed && howManyGuaranteed > 0) {
        _removeBid(myBidId);
        _guarantedBid(newTotalValue);
      } else {
        super.bid(); // regular bid (sum is smaller than guranteed or guranteed already used)
      }
    } else if (msg.value >= priceGuaranteed && howManyGuaranteed > 0) {
      _guarantedBid(msg.value);
    } else {
       super.bid(); // regular bid (completely new one)
    }
  }

  function _guarantedBid(uint value) private {
    guaranteedContributors.push(msg.sender);
    guaranteedContributions[msg.sender] = value;
    howManyGuaranteed--;
    howMany--;
    emit GuaranteedBid(msg.sender, value, now);
  }

  function finalize() public ended() onlyOwner() {
    require(finalized == false, "auction already finalized, can withdraw only once");
    finalized = true;

    uint sumContributions = 0;
    uint counter = 0;
    Bid memory currentBid = bids[HEAD];
    while(counter++ < howMany && currentBid.prev != TAIL) {
      currentBid = bids[ currentBid.prev ];
      sumContributions += currentBid.value;
    }

    // At all times we are aware of gas limits - that's why we limit auction to 2000 participants, see also `test-gasLimit` folder
    for (uint i=0; i<guaranteedContributors.length; i++) {
      sumContributions += guaranteedContributions[ guaranteedContributors[i] ];
    }

    beneficiary.transfer(sumContributions);
  }
}
