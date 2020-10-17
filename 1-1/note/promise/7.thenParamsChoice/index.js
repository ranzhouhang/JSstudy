//then方法参数变成可选的参数
let MyPromise = require('./myPromise')

let mypormise = new MyPromise((resolve, reject) => {
    // resolve("success")
    reject("fail")
})

mypormise
    .then()
    .then()
    .then()
    .then(value => {
        console.log(value)
    }, reason => {
        console.log(reason)
    })