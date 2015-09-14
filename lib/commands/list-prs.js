'use strict';

const _ = require('lodash');
const path = require('path');
const asyncChainable = require('async-chainable');
const Table = require('cli-table');
const Promise = require('promise');
const chalk = require('chalk');
const argv = require('yargs').argv;
const Spinner = require('clui').Spinner;
const authenticator = require('../services/authenticator');
const getNow = require('../utils/getNow');

const _getListValues = (l) => l ? l.split(',').map((v) => v.trim()) : null;

const _sortAlphabetically = (prA, prB) => {
  const ownerA = prA.title.toLowerCase();
  const ownerB = prB.title.toLowerCase();

  return ownerA.localeCompare(ownerB.toLowerCase());
};

const _startCountdown = (cd) => (next) => { cd.start(); next(); };
const _stopCountdown = (cd) => (next) => { cd.stop(); next(); };

const _fetchFirstPrList = function(opts, countdown) {
  return function(next) {
    opts.client
      .repo(`${opts.user}/${opts.repo}`)
      .prs({ per_page: 1000 }, (err, prs) => {
        if (err) {
          countdown.stop();
          console.log(`${getNow()} ${chalk.red('Please enter a valid repo and github user')}`);
          process.exit();
        }

        next(null, prs);
      });
  };
};

const _filterPrsByAuthors = function(next) {
  const authors = _getListValues(argv.a);
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
    const exts = _getListValues(argv.e);

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

const _mountMessage = (opts, prs) => {
  const exts = _getListValues(argv.e);
  const authors = _getListValues(argv.a);
  const label = (msg) => chalk.blue.bold(msg);

  let message = `${getNow()} ${chalk.blue.bold('User:')} ${opts.user}
${getNow()} ${label('Repo:')} ${opts.repo}
${getNow()} ${label('PR\'s Open:')} ${prs.length}`;

  if (authors) {
    message += `\n${getNow()} ${label('Authors filtered:')} ${authors.join(', ')}`
  }
  if (exts) {
    message += `\n${getNow()} ${label('Extensions filtered:')} ${exts.join(', ')}`
  }

  return `${message}\n`;
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

const _logMsgs = function(opts) {
  return function(results) {
    const prs = this.prsFilteredByExtensions;

    if (prs && prs.length > 0) {
      console.log(_mountMessage(opts, prs));
      console.log(_tableOfPulLRequests(prs));
    }
    else {
      console.log(`${getNow()} ${chalk.red('Ops, no results found!')}`);
    }
  };
};

module.exports = () => {
  var userAndRepo = argv._[1];
  const regexp = /(\w\S+)\/(\w\S+)/;
  const user = regexp.test(userAndRepo) ? userAndRepo.match(regexp)[1] : null;
  const repo = regexp.test(userAndRepo) ? userAndRepo.match(regexp)[2] : null;
  const countdown = new Spinner('Loading repository pull requests...');

  if (!user || !repo) {
    console.log(`${getNow()} Please, fill required fields!`);
  }
  else {
    authenticator.auth().done((client) => {
      const opts = { client: client, user: user, repo: repo };

      asyncChainable()
        .then('startCountdown', _startCountdown(countdown))
        .then('firstPrList', _fetchFirstPrList(opts, countdown))
        .then('prsFilteredByAuthors', _filterPrsByAuthors)
        .then('prsFilteredByExtensions', _filterPrsByExtensions(opts))
        .then('stopCountdown', _stopCountdown(countdown))
        .end(_logMsgs(opts));
    });
  }
};
