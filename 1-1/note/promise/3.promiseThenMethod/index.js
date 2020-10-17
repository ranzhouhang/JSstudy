//then方法是可以多次调用的，同步和异步的情况
let MyPromise = require('./myPromise')

let myPromise = new MyPromise((resolve, reject) => {
    // setTimeout(()=>{
    //     resolve("success")
    // },2000) 
    resolve("success")
})

myPromise.then(value => {
    console.log(value)
})

myPromise.then(value => {
    console.log(value)
})

myPromise.then(value => {
    console.log(value)
})

myPromise.then(value => {
    console.log(value)
})