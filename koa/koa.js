/**
 * @file try to make a koa: stack-like middleware, context
 * @author mingttong(zhouwunan@qq.com)
 */

const http = require('http')
const { log } = require('./utils');

class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * get request pathname
   *
   * @return {string} pathname
   */
  get path() {
    return this.req.url;
  }
}

function compose(middleware) {

  return function (context) {

    return dispatch(0);
    // this is the exact next function
    function dispatch(i) {
      const fn = middleware[i];
      if (!fn) {
        return Promise.resolve();
      }

      return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
    }
  }
}

module.exports = class Koa {
  constructor() {
    this.middlewares = []; // use a list to save middleware
    this.ctx = null;
  }

  /**
   * start a server
   *
   * @param  {...any} args ...
   */

  listen(...args) {
    const fn = compose(this.middlewares);
    const app = http.createServer((req, res) => {
      const ctx = new Context(req, res);
      return fn(ctx).then(() => {
        log.info('done all');
        res.end();
      });
    });
    app.listen(...args);
  }

  /**
   * add a middleware
   *
   * @param {Function} fn middleware function
   * @return {Koa} koa instance
   */
  use(fn) {
    this.middlewares.push(fn);
    return this;
  }
};
