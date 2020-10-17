//promise.all方法,接受一个数组作为参数，得到的结果和数组的顺序一致，可以链式调用，所有都成功，则返回成功的数组，有一个失败，就返回失败
let MyPromise = require("./myPromise")

function p1() {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('p1')
        }, 2000)
    })
}

function p2() {
    return new MyPromise((resolve, reject) => {
        resolve('p2')
    })
}


MyPromise.all(['a', 'b', p1(), p2(), 'c']).then(value => console.log(value), reason => console.log(reason))