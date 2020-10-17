//promise的then方法是可以被链式调用的
let MyPromise = require('./myPromise')

let myPromise = new MyPromise((resolve, reject) => {
    // setTimeout(()=>{
    //     resolve("success")
    // },2000) 
    resolve("success")
})

function otherMyPromise(){
    return new MyPromise((resolve,reject)=>{
        resolve("other")
    })
}

myPromise.then(value => {
    console.log(value)
    return 1
}).then(value => {
    console.log(value)
    return 2
}).then(value => {
    console.log(value)
    return otherMyPromise()
}).then(value => {
    console.log(value)
})
