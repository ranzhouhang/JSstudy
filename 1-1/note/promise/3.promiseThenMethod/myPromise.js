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
        if (this.status !== PENDING) {
            return
        }
        this.status = FULFILLED
        this.sucessValue = sucessValue
        while (this.successCallback.length) {
            this.successCallback.shift()(this.sucessValue)
        }
    }
    reject = failReason => {
        if (this.status !== PENDING) {
            return
        }
        this.status = REJECTED
        this.failReason = failReason
        while (this.failCallback.length) {
            this.failCallback.shift()(this.failReason)
        }
    }
    then = (successCallback, failCallback) => {
        if (this.status === FULFILLED) {
            successCallback(this.sucessValue)
        } else if (this.status === REJECTED) {
            failCallback(this.failReason)
        } else {
            this.successCallback.push(successCallback)
            this.failCallback.push(failCallback)
        }
    }
}

module.exports = MyPromise