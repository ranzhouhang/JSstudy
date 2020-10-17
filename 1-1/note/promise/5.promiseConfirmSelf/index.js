//promise的处理循环调用自身的情况，并报错
let MyPromise = require('./myPromise')

let myPromise = new MyPromise((resolve, reject) => {
    // setTimeout(()=>{
    //     resolve("success")
    // },2000) 
    resolve("success")
    // throw new Error('exectuor error')
})



let p1 = myPromise.then(value => {
    console.log(value)//当then方法执行错误之后，下一个then方法的错误要捕获到错误
    return p1
})
p1.then(value => console.log(value), reason => console.log(reason))