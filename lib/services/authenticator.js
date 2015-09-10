"use strict";

const inquirer = require('inquirer');
const chalk = require('chalk');
const github = require('octonode');
const Promise = require('promise');
const getNow = require('../utils/getNow');
const red = chalk.red;
const green = chalk.green;

const REQUIRED_FIELDS = ['username', 'password'];

const QUESTIONS = [{
  type: 'input',
  message: 'Please, enter your Github user:',
  name: 'username'
}, {
  type: 'password',
  message: 'Now, enter your user password:',
  name: 'password'
}];

const _filterFieldsErrors = (obj) => {
  return (field) => {
    if (!obj[field]) {
      console.log(red(`${getNow()} Please enter your ${field}`));
    }

    return obj[field];
  };
};

const _checkRequiredFields = (obj, fields) => {
  return fields.filter(_filterFieldsErrors(obj)).length === 0;
};

const _authenticationCallback = (onSuccess, onError) => {
  return (err, status, body, headers) => {
    if (err) onError(err);
    else onSuccess(body);
  };
};

const _handleAuthSuccess = (resolve, client) => {
  return (body) => {
    resolve(client);
    console.log(green(`${getNow()} Successful authentication!\n`));
  };
};

const _handleAuthError = (reject) => {
  return (err) => {
    reject(err);
    console.log(red(`${getNow()} ${err}`));
  };
};

const _setupGithubClient = (opts) => {
  const client = github.client(opts.credentials);
  const promise = opts.promise;

  client.get('/user', {}, _authenticationCallback(
    _handleAuthSuccess(promise.resolve, client),
    _handleAuthError(promise.reject)
  ));
};

const _handleAnswers = (resolve, reject) => {
  return (answers) => {
    if (!_checkRequiredFields(answers, REQUIRED_FIELDS)) {
      _setupGithubClient({
        credentials: answers,
        promise: { resolve: resolve, reject: reject }
      });
    }
  };
};

exports.auth = () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt(QUESTIONS, _handleAnswers(resolve, reject));
  });
};
