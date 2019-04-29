# Kleros Ethereal Virtual Hackathon



### Self Commitment App

It takes ___ days to build habit

It's a freedom but we suggest 30.

You commit to do 30 workouts in 30 days.


But... Sometimes life happens.

1. Early morning international flight across several timezones
2. Battery on the phone dying
3. Running out of storage
4. Not pressing record button
5. Internet too slow to upload
6. Anything really, life happens, especially if you are a guy like me.

It is OK to upload 2 videos a day later. If you do 30 workouts in 30 days and you miss one day and 2x the following one - it's OK with me, it's perfectly acceptable outcome.

It may happen that jurors will reject the submission. That is OK too.

To keep it simple - we are not doing an appeal process. It's not $1m on the line, it's a workout that you can do in 15 minutes. Just do it again and this time make sure 




# Similar Projects


This time in a decentralized manner.



Reminds me: https://gofuckingdoit.com/

Pavlock
Stickk
Anticharity - giving money to orphanage in Africa doesn't feel as bad as neo-nazi-hitler-legacy-institute

(especially if they have public record of donors)






### Development

Realistically speaking - it's a hackathon project.

I already have some other ideas how to use Kleros.

#### 1. No surprises here

* `git clone`
* `npm install`

#### 2. Check open issues

MetaMask usability - if we are talking wider adoption it has to improve.


#### 3. Local version of Truffle (required to run the tests)
Kleros reference implementation is using `pragma solidity ^0.4.15;` it means there are some deprecated solidity features.

If you have `Truffle` installed globally and run `truffle test` **IT WILL NOT WORK** - the command will use gloablly installed `Truffle` that in turn has a different version of `Solidity` compiler.

If you want to run tests *(hint: you want to run tests)* you should do `npm run test` - in that way it will use locally installed `Truffle` in `node_modules`. It will compile, it will run.

#### 4. Preserve credentials in MetaMask for interactions in the UI

Have the same mnemonic each time, to preserve settings in MetaMask:
* `ganache-cli -m "____ ____ ____ ____"



### Further Reading

* Kleros.io
* Kleros whitepaper:
* Kleros book:
* ERC - Arbitrable standard
* ERC - Evidence standard