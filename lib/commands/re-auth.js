'use strict';

const authenticator = require('../services/authenticator');

module.exports = (yargs) => {
  authenticator.disconnect();
  authenticator.auth();
};
