const log = require('./log');

module.exports = {
  log,

  /**
   * sleep promise function
   *
   * @param {number} time sleep time
   * @return {Promise} sleep promise
   */
  sleep(time = 200) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, time)
    });
  }
};
