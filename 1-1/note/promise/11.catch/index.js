const MyPromise = require('./myPromise')



function p2() {
    return new MyPromise((resolve, reject) => {
        reject("p2 reject")
        // resolve('p2 resolve')
    })
}

p2().then(value => console.log(value)).catch(reason=>console.log(reason))