/**
 * @file koa test file
 */

const Koa = require('./koa');
const app = new Koa();
const { log, sleep } = require('./utils')
const PORT = 3000;

app.use(async (ctx, next) => {
  log.request(ctx.path);
  await next()
})

app.use(async (ctx, next) => {
  await sleep();
  console.log('middleware 1');
  await next();
  console.log('3');
  console.log('4');
});

app.use((ctx, next) => {
  console.log('middleware 2');
  ctx.body = 'haha';
})

app.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});
