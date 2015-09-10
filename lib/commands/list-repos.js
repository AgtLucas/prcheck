"use strict";

const Table = require('cli-table');
const chalk = require('chalk');
const authenticator = require('../services/authenticator')
const getNow = require('../utils/getNow');
const Spinner = require('clui').Spinner;

const _sortAlphabetically = (repoA, repoB) => {
  const ownerA = repoA.owner.login.toLowerCase();
  const ownerB = repoB.owner.login.toLowerCase();

  return ownerA.localeCompare(ownerB.toLowerCase());
};

const _createRowObject = (repo) => {
  return [
    chalk.gray(repo.owner.login),
    repo.name,
    repo.language || ''
  ];
};

const _addRowAtTable = (t) => (repo) => t.push(repo);

const _showRepos = (countdown) => {
  const table = new Table({
    chars: {
      'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
      'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
      'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
      'right': '║' , 'right-mid': '╢' , 'middle': '│'
    },
    head: [ 'owner', 'repo', 'language' ],
    style: { compact: true, 'padding-left': 1 }
  });

  return (err, repos) => {
    repos
      .sort(_sortAlphabetically)
      .map(_createRowObject)
      .forEach(_addRowAtTable(table));

    countdown.stop();
    console.log(table.toString());
  };
};

module.exports = () => {
  const countdown = new Spinner('Loading repos...');

  authenticator.auth().done((client) => {
    countdown.start();
    client.me().repos({ per_page: 500 }, _showRepos(countdown));
  });
};
