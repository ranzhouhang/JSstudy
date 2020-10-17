const FULFILLED = 'fulfilled'//成功
const PENDING = 'pending'//等待
const REJECTED = 'rejected'//失败 
class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)
        }

    }
    status = PENDING//promise的状态
    sucessValue = undefined//成功之后的值
    failReason = undefined//失败之后的原因
    successCallback = []//成功的回调
    failCallback = []//失败的回调
    resolve = sucessValue => {
        //查看状态是否是等待，否则不执行
        if (this.status !== PENDING) {
            return
        }
        this.status = FULFILLED//改变状态
        this.sucessValue = sucessValue//保存成功的传值
        while (this.successCallback.length) {//多次调用then方法
            this.successCallback.shift()()
        }
    }
    reject = failReason => {
        if (this.status !== PENDING) {
            return
        }
        this.status = REJECTED
        this.failReason = failReason//保存失败的原因
        while (this.failCallback.length) {
            this.failCallback.shift()()
        }
    }
    then = (successCallback, failCallback) => {
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        let promise2 = new MyPromise((resolve, reject) => {
            //判断状态
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        //判断返回值是普通值还是promise对象
                        //如果是普通值，直接用resolve
                        //如果是promise对象，查看promise对象的返回结果，再决定使用reslove还是reject
                        resolvePromise(promise2, successCallback(this.sucessValue), resolve, reject)
                        //promise2无法获取，根据执行顺序，要等到new Mypromise之后，在过程中不行，才能获取，所以要调用异步操作
                    } catch (error) {
                        reject(error)
                    }

                }, 0)
            } else if (this.status === REJECTED) {
                // 同样的方法处理失败
                setTimeout(() => {
                    try {
                        //判断返回值是普通值还是promise对象
                        //如果是普通值，直接用resolve
                        //如果是promise对象，查看promise对象的返回结果，再决定使用reslove还是reject
                        resolvePromise(promise2, failCallback(this.failReason), resolve, reject)
                        //promise2无法获取，根据执行顺序，要等到new Mypromise之后，在过程中不行，才能获取，所以要调用异步操作
                    } catch (error) {
                        reject(error)
                    }

                }, 0)
            } else {
                //等待，将成功回调和失败回调储存起来
                //处理异步和捕获错误的情况
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            //判断返回值是普通值还是promise对象
                            //如果是普通值，直接用resolve
                            //如果是promise对象，查看promise对象的返回结果，再决定使用reslove还是reject
                            resolvePromise(promise2, successCallback(this.sucessValue), resolve, reject)
                            //promise2无法获取，根据执行顺序，要等到new Mypromise之后，在过程中不行，才能获取，所以要调用异步操作
                        } catch (error) {
                            reject(error)
                        }

                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            //判断返回值是普通值还是promise对象
                            //如果是普通值，直接用resolve
                            //如果是promise对象，查看promise对象的返回结果，再决定使用reslove还是reject
                            resolvePromise(promise2, failCallback(this.failReason), resolve, reject)
                            //promise2无法获取，根据执行顺序，要等到new Mypromise之后，在过程中不行，才能获取，所以要调用异步操作
                        } catch (error) {
                            reject(error)
                        }

                    }, 0)
                })
            }
        })
        return promise2
    }
    static all(array){
        let result = []
        let index = 0
        return new Promise((resolve,reject)=>{
            function addData(key,value){
                result[key] = value
                index++
                if(index === array.length){
                    resolve(result)
                }
            }
           for(let i = 0;i<array.length;i++){
            let current = array[i]
            if(current instanceof MyPromise){
                //promise对象
                current.then(value=>addData(i,value),reason=>reject(reason))
            }else{
                //普通值
                addData(i,array[i])
            }
           }
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        //Promise对象
        x.then(resolve, reject)
        //x.then(value=>resolve(value),reason=>reject(reason))
    } else {
        //普通值
        resolve(x)
    }
}

module.exports = MyPromise 