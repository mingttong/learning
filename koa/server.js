const Koa = require('./koa');
const app = new Koa();

// app.use(ctx => {
//   ctx.body = 'zhouwunan';
// });

app.listen(3000, () => {
  console.log('listening port 3000');
});
