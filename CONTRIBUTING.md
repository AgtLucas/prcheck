# Contributing to PRCheck

So you're interested in giving us a hand? That's awesome! We've put together some brief guidelines that should help you get started quickly and easily.

Please, if you see anything wrong you can fix/improve it :ghost:

## Installing the project

1. Fork this project on github
1. Clone this project on your local
1. Then, you need to install `node` and `npm` to run the mainly packages.
1. After installed `node` and `npm`, run this script:

```bash
$ npm install
```

That's it! You're done.

## How to work

We are using a bunch of things to put all together and make the work easy.

Dependency | Description
---------- | -----------
[NodeJS >= v4.0.0](https://nodejs.org) | NodeJS
[NPM](http://npmjs.org) | Node package manager
[Yargs](https://github.com/bcoe/yargs) | Yargs the modern, pirate-themed successor to optimist
[Async Chainable](https://github.com/hash-bang/async-chainable) | An extension to Async adding better handling of mixed Series / Parallel tasks via object chaining
[Octonode](https://github.com/pksunkara/octonode) | Github api v3 in nodejs
[Inquirer](https://github.com/sboudrias/Inquirer.js) | A collection of common interactive command line user interfaces

So, have some scripts that you need to know to run the project locally. It's just fews, but it's very important.

Command | Description
------- | -----------
`node bin/prcheck <command> [payload] [--flags]` | Script to test the tool locally

## Submitting a Pull request

1. Create your feature branch: git checkout -b my-new-feature
1. Commit your changes: git commit -m 'Add some feature'
1. Push to the branch: git push origin my-new-feature
1. Make sure that all bundles are passing in [TravisCI](https://travis-ci.org/resultadosdigitais/prcheck)
1. Submit a pull request :D
