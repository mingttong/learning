const http = require('http')

module.exports = class Koa {
  listen(...args) {
    const [port = 3000, callback = () => {}] = args;
    const app = http.createServer((req, res) => {
      res.body = 'haha';
      res.end();
    });
    app.listen(port, callback);
  }
};
