'use strict';

const _ = require('lodash');
const path = require('path');
const asyncChainable = require('async-chainable');
const Table = require('cli-table');
const Promise = require('promise');
const chalk = require('chalk');
const program = require('commander');
const Spinner = require('clui').Spinner;
const authenticator = require('../services/authenticator');
const getNow = require('../utils/getNow');

const regex = /(\w\S+)\/(\w\S+)/;
const _getUserName = (v) => v.match(regex)[1];
const _getRepoName = (v) => v.match(regex)[2];
const _getListValues = (l) => l ? l.split(',').map((v) => v.trim()) : null;

const _sortAlphabetically = (prA, prB) => {
  const ownerA = prA.title.toLowerCase();
  const ownerB = prB.title.toLowerCase();

  return ownerA.localeCompare(ownerB.toLowerCase());
};

const _shortTitle = (title) => {
  return title.length > 50 ? `${title.slice(0, 50)}...` : title;
};

const _tableOfPulLRequests = (prs) => {
  const table = new Table({
    chars: {
      'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
      'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
      'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
      'right': '║', 'right-mid': '╢', 'middle': '│'
    },
    head: ['number', 'author', 'title', 'link'],
    style: { compact: true, 'padding-left': 1 }
  });

  prs
    .sort(_sortAlphabetically)
    .forEach((pr) => {
      table.push([
        chalk.gray(pr.number),
        chalk.gray(pr.user.login),
        _shortTitle(pr.title),
        chalk.yellow(pr.html_url)
      ]);
    });

  return table.toString();
};

const _startCountdown = (countdown) => (next) => {
  countdown.start();
  next();
};

const _stopCountdown = (countdown) => (next) => {
  countdown.stop();
  next();
};

const _fetchFirstPrList = function(opts) {
  return function(next) {
    opts.client
      .repo(`${opts.user}/${opts.repo}`)
      .prs({ per_page: 1000 }, (err, prs) => next(null, prs));
  };
};

const _filterPrsByAuthors = function(next) {
  const authors = _getListValues(program.authors);
  const prs = this.firstPrList;

  if (authors) {
    next(null, prs.filter((p) => authors.filter(a => p.user.login === a).length));
  }
  else {
    next(null, prs);
  }
};

const _getFilesExtension = (pr, resolve, reject) => (err, files) => {
  if (err) reject(err);

  var extension = files.map(file => {
    const extName = path.extname(file.filename);
    return extName.length > 0 ? extName.match(/(\.)(.+)/i)[2] : '';
  });

  resolve({ pr: pr, extensions: _.compact(extension) });
};

const _fetchPrsFileExtension = (opts, prs) => {
  return prs.map(function(pr) {
    return new Promise((resolve, reject) => {
      opts.client
        .pr(`${opts.user}/${opts.repo}`, pr.number)
        .files(_getFilesExtension(pr, resolve, reject));
    });
  });
};

const _filterItemsByExtension = (exts, next) => (data) => {
  const filteredItems = data.filter((item) => {
    return exts.filter(e => _.contains(item.extensions, e)).length;
  }).map((item) => item.pr);

  next(null, filteredItems);
};

const _filterPrsByExtensions = function(opts) {
  return function(next) {
    const prs = this.prsFilteredByAuthors;
    const exts = _getListValues(program.extensions);

    if (exts) {
      Promise
        .all(_fetchPrsFileExtension(opts, prs))
        .then(_filterItemsByExtension(exts, next))
        .catch((err) => console.log(err));
    }
    else {
      next(null, prs);
    }
  };
};

const _logMsgs = function(opts) {
  return function(results) {
    const prs = this.prsFilteredByExtensions;
    const label = (msg) => chalk.blue.bold(msg);
    const exts = _getListValues(program.extensions);
    const authors = _getListValues(program.authors);

    console.log(exts);

    let message = `${getNow()} ${chalk.blue.bold('User:')} ${opts.user}
${getNow()} ${label('Repo:')} ${opts.repo}
${getNow()} ${label('PR\'s Open:')} ${prs.length}`;

    if (authors) message += `\n${getNow()} ${label('Authors filtered:')} ${authors.join(', ')}`
    if (exts) message += `\n${getNow()} ${label('Extensions filtered:')} ${exts.join(', ')}`

    if (prs.length > 0) {
      console.log(`${message}\n`);
      console.log(_tableOfPulLRequests(prs));
    }
    else {
      console.log(`${getNow()} ${chalk.red('Ops, no results found!')}`);
    }
  };
};

module.exports = (userAndRepo) => {
  const countdown = new Spinner('Loading repository pull requests...');

  authenticator.auth().done((client) => {
    const opts = {
      client: client,
      user: _getUserName(userAndRepo),
      repo: _getRepoName(userAndRepo)
    };

    asyncChainable()
      .then('startCountdown', _startCountdown(countdown))
      .then('firstPrList', _fetchFirstPrList(opts))
      .then('prsFilteredByAuthors', _filterPrsByAuthors)
      .then('prsFilteredByExtensions', _filterPrsByExtensions(opts))
      .then('stopCountdown', _stopCountdown(countdown))
      .end(_logMsgs(opts));
  });
};
