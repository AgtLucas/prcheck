'use strict';

const authenticator = require('../services/authenticator');

module.exports = () => {
  authenticator.disconnect();
  authenticator.auth();
};
