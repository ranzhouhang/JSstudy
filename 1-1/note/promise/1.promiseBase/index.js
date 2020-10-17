//1.Promise就是一个类，可以传入一个回调函数(立即执行)
//2.回调函数有两个参数，resolve和reject，这两个参数是两个函数，调用这两个函数可以改变Promise的状态
//3.Promise有三种状态，等待(pending)，成功(fulfilled)，失败(rejected)。
//只能pending->fulfilled（调用reslove）或者pending->rejected（调用rejected），一旦状态确定，就不可更改
//4.promise有一个then方法，then方法有两个参数，都是回调函数，第一个是成功之后执行的回调函数，第二个是失败后调用的回调函数

// promise的核心逻辑
let MyPromise = require('./myPromise')

let promise = new Promise((resolve, reject) => {
    resolve("success")
})

promise.then(value => { }, reason => { })

let myPromise = new MyPromise((resolve, reject) => {
    // resolve("success")
    reject('fail')
})
myPromise.then(value => {
    console.log(value)
},reason=>{
    console.log(reason)
})