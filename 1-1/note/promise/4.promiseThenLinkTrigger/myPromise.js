const FULFILLED = 'fulfilled'
const PENDING = 'pending'
const REJECTED = 'rejected'
class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    status = PENDING
    sucessValue = undefined
    failReason = undefined
    successCallback = []
    failCallback = []
    resolve = sucessValue => {
        //查看状态是否是等待，否则不执行
        if (this.status !== PENDING) {
            return
        }
        this.status = FULFILLED//改变状态
        this.sucessValue = sucessValue//保存成功的传值
        while (this.successCallback.length) {//多次调用then方法
            this.successCallback.shift()(this.sucessValue)
        }
    }
    reject = failReason => {
        if (this.status !== PENDING) {
            return
        }
        this.status = REJECTED
        this.failReason = failReason//保存失败的原因
        while (this.failCallback.length) {
            this.failCallback.shift()(this.failReason)
        }
    }
    then = (successCallback, failCallback) => {
        return new MyPromise((resolve,reject) => {
            //判断状态
            if (this.status === FULFILLED) {
                //判断返回值是普通值还是promise对象
                //如果是普通值，直接用resolve
                //如果是promise对象，查看promise对象的返回结果，再决定使用reslove还是reject
                resolvePromise(successCallback(this.sucessValue),resolve,reject)
            } else if (this.status === REJECTED) {
                failCallback(this.failReason)
            } else {
                //等待，将成功回调和失败回调储存起来
                this.successCallback.push(successCallback)
                this.failCallback.push(failCallback)
            }
        })

    }
}

function resolvePromise(x,resolve,reject){
    if(x instanceof MyPromise){
        //Promise对象
        x.then(resolve,reject)
        //x.then(value=>resolve(value),reason=>reject(reason))
    }else{
        //普通值
        resolve(x)
    }
}

module.exports = MyPromise