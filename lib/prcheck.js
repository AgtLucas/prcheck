"use strict";

const program = require('commander');
const commands = require('./commands');
const pkg = require('../package.json');

program
  .option('-a, --authors <value>', 'Filter by author')
  .option('-e, --extensions <values>', 'Filter by extension (eg: js)');

program
  .version(pkg.version)
  .command('list-repos')
  .action(commands['list-repos']);

program
  .version(pkg.version)
  .command('re-auth')
  .action(commands['re-auth']);

program
  .version(pkg.version)
  .command('list-prs [user/repo]')
  .action(commands['list-prs']);

program.parse(process.argv);
