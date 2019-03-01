/**
 * @file colorful log out methods
 */

const chalk = require('chalk'); // colorful log out

module.exports = {
  request(path, method = 'GET') {
    console.log(chalk.bgGreen.white(` ${method} `), chalk.blue(path));
  },
  info(message) {
    console.log(chalk.blue(message));
  }
};
