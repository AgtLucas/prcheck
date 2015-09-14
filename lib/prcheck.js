"use strict";

const argv = require('yargs');
const commands = require('./commands');
const pkg = require('../package.json');

argv
  .usage('Usage: $0 <command> [payload] [--flags]')
  .command('list-repos', 'List your available repositories', commands['list-repos'])
  .command('re-auth', 'Reconnect via Github OAuth', commands['re-auth'])
  .command('list-prs', 'List all pull requests from a Github repository', commands['list-prs'])
  .example('$0 list-prs <user/repo> -e "js" -a "author1"')
  .example('$0 list-prs <user/repo> -e "js, rb" -a "author1, author2"')
  .help('help')
  .wrap(200)
  .alias('h', 'help')
  .alias('a', 'authors')
  .describe('a', 'Filter by authors (eg: "john, mike")')
  .alias('e', 'extensions')
  .describe('e', 'Filter by extension (eg: "js, rb")')
  .argv;
