const Promise = require('./Promise');

// 延迟1秒输出
const wait = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(ms);
  }, ms)
});

wait(100)
  .then(() => 2)
  .finally(res => {
  })
  .then(res => {
    console.log(res);
  });

// console.log('开始！');
// console.log('...');
// Promise.reject(500)
//   .then((res) => {
//     console.log('等待结束！结果1：', res);
//     return wait(res + 100)
//       .then(() => {
//         console.log('22222');
//         return 888;
//       });
//   })
//   .then((res) => {
//     console.log('等待结束！结果2：', res);
//     return res + 100;
//   })
//   .then((res) => {
//     console.log('等待结束！结果3：', res);
//     return res + 100;
//   })
//   .catch(res => {
//     console.log('last reject', res);
//   })

// console.log('我先执行');
