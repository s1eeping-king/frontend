// my-app/index.js
// const myUtils = require('mypackage1');

// console.log(myUtils.hello());  // 输出: Hello from my-utils!
// console.log(myUtils.goodbye());  // 输出: Goodbye from my-utils!


(async () => {
    const { player } = await import('mypackage1');
    let ans =await player.movement(BigInt(1));
    console.log(ans);
    // console.log(main('up'));
  })();

// (async () => {
//     const { register } = await import('mypackage1');
//     console.log(register());
//   })();

// (async () => {
//     const { addmoney } = await import('mypackage1');
//     console.log(addmoney());
//   })();

//   (async () => {
//     const { sayHello } = await import('mypackage1');
//     console.log(sayHello('World'));
//   })();


