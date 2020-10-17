//promise捕获错误，并用reject返回
let MyPromise = require('./myPromise')

let myPromise = new MyPromise((resolve, reject) => {
    setTimeout(()=>{
        resolve("success")
    },2000) 
    // resolve("success")
    // reject("fail")
    // throw new Error('exectuor error')
})

function otherMyPromise(){
    return new MyPromise((resolve,reject)=>{
        resolve("other")
    })
}

myPromise.then(value => {
    console.log(value)//当then方法执行错误之后，下一个then方法的错误要捕获到错误
    // throw Error('then error')
    return 'aaa'
},reason=>{
    // console.log(reason.message)
    console.log(reason)
    return 100
}).then(value => {
    console.log(value)//当then方法执行错误之后，下一个then方法的错误要捕获到错误
},reason=>{
    // console.log('aaa')
    console.log(reason)
})