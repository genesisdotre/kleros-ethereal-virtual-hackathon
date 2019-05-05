# [genesis.re/kleros-ethereal-virtual-hackathon/frontend](https://genesis.re/kleros-ethereal-virtual-hackathon/frontend/)

Deployed to GitHub pages, directly from the `master` branch.

# 🥇 Kleros Ethereal Virtual Hackathon 🥇

* Will stay at home: https://twitter.com/marsxrobertson/status/1124572930275467264
* The Ethereal Hackathon: https://gitcoin.co/hackathon/ethhack2019/
* Medium blog post announcement: https://medium.com/gitcoin/the-ethereal-hackathon-4f5dc2eb56d6
* Gitcoin bounty: https://gitcoin.co/issue/kleros/hackathon/1/2824
* Deployed to GitHub pages: https://genesis.re/kleros-ethereal-virtual-hackathon/frontend
* The idea on Kleros forum: https://forum.kleros.io/t/self-commitment-in-todo-app/87
* [ERC792](https://github.com/ethereum/EIPs/issues/792) - Arbitrable standard
* [ERC1497](https://github.com/ethereum/EIPs/issues/1497) - Evidence standard
* Communication channels: <a href="https://kleros.slack.com/messages/hackathon/">Kleros Slack hackathon channel</a> + <a href="https://slack.kleros.io/">invite</a> + <a href="https://t.me/kleros">Telegram</a>

# Video walkthrough _(hackathon 7:15am quality)_

### https://youtu.be/M_aVCHRCups

[![](youtube.jpg?raw=true "YouTube thumbnail")](https://youtu.be/M_aVCHRCups)

# Self Commitment App

It takes 30 days to build habit

You commit to do 30 workouts in 30 days.

### Create a new challenge

<img src="create-new-challenge.png?raw=true" width="500px">

<!---
But... Sometimes life happens.

1. Early morning international flight across several timezones
2. Battery out of juice
3. Running out of storage
4. Not pressing record button
5. Internet too slow to upload
6. Anything really, life happens, especially if you are a guy like me.

It is OK to upload 2 videos a day later. If you do 30 workouts in 30 days and you miss one day and do 2x the following one - it's OK with me, it's perfectly acceptable outcome.

To keep it simple - we are not doing an appeal process. It's not $1m on the line, it's a workout that you can do in 15 minutes. Just do it again and this time make sure there are no doubts.

It may happen that jurors will reject the submission. That is OK too. I believe in incentives and training of Klerors jurors to sufficiently tell whether your submission was valid in the first place.

-->

### Good things

* End to end
* Verified on Etherscan
* Uses the Arbitration and Evidence standards

### Development

Realistically speaking - it's a hackathon project, unlikely to be continued.

I already have some other ideas how to use Kleros. *"Oracle as a Service"* - human intelligence API to tell the factual state, knowing that rational game-theory incentives are in play on the Kleros side. 

![](kleros-simple-use-case.png?raw=true "simple Kleros")

Check also: https://blog.kleros.io/launching-kleros-fellowship-second-edition/

#### 1. No surprises here

* `git clone`
* `npm install`
* `npm run ganache && npm run test`

#### 2. Check open issues

Actually if I was to report everything, there would be too many. 

#### 3. Local version of Truffle (required to run the tests)
Kleros reference implementation is using `pragma solidity ^0.4.15;` it means there are some deprecated solidity features.

If you have `Truffle` installed globally and run `truffle test` **IT WILL NOT WORK** - the command will use gloablly installed `Truffle` that in turn has a different version of `Solidity` compiler.

If you want to run tests *(hint: you want to run tests)* you should do `npm run test` - in that way it will use locally installed `Truffle` in `node_modules`. It will compile, it will run.

<img src="tests-are-cool.png?raw=true" width="600px">

#### 4. Debugging unit tests

1. Put `debugger` statement in the JavaScript code

2. `node --inspect-brk ./node_modules/truffle/build/cli.bundled.js test test/test_to_debug.js`

3. Open `chrome://inspect`

#### 5. Preserve credentials in MetaMask for interactions in the UI

Have the same mnemonic each time, to preserve account in MetaMask:
* `ganache-cli -m "____ ____ ____ ____"`

#### 6. Increase gasLimit to 8000000

Especially if you are using Remix.

<!--- 

### Similar Projects

Idea is by no means original. The difference - using decentralized architecture and Kleros arbitration and evidence standards.

* Reminds me: https://gofuckingdoit.com/
* Pavlock
* Stickk
* Anticharity - giving money to orphanage in Africa doesn't feel as bad as neo-nazi-hitler-legacy-institute

(especially if they have public record of donors)

-->

### Related, also ethereal hackathon project

Until recently I've never uploaded stuff to IPFS.

Now it is much simpler, go figure: https://genesis.re/kleros-metaevidence-metahash/

### Consulting gigs and impactful work

Effective altruism. Exponential technologies. 

**I live in one of the most expensive cities on this planet and I'm open to extra work.**

* https://genesis.re/360/cop24/
* https://genesis.re/wiki/#Open_letter_to_Extinction_Rebellion

![](shenzhen-hackathon.png?raw=true "Shenzhen hackathon")
