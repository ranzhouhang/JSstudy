//promise的异步逻辑
let MyPromise = require('./myPromise')

let myPromise = new MyPromise((resolve, reject) => {
    setTimeout(()=>{
        resolve("success")
    },2000) 
})
myPromise.then(value => {
    console.log(value)
},reason=>{
    console.log(reason)
})