"use strict";

const moment = require('moment');
const chalk = require('chalk');

module.exports = () => chalk.gray(`[${moment().format('HH:mm:ss')}]`);
