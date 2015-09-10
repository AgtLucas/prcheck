"use strict";

const program = require('commander');
const commands = require('./commands');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('list-repos')
  .action(commands['list-repos']);

program
  .version(pkg.version)
  .command('re-auth')
  .action(commands['re-auth']);

program.parse(process.argv);
