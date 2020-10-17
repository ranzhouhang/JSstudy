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
    resolve = sucessValue => {
        if (this.status !== PENDING) {
            return
        }
        this.status = FULFILLED
        this.sucessValue = sucessValue
    }
    reject = failReason => {
        if (this.status !== PENDING) {
            return
        }
        this.status = REJECTED
        this.failReason = failReason
    }
    then = (successCallback, failCallback) => {
        if (this.status === FULFILLED) {
            successCallback(this.sucessValue)
        } else if (this.status === REJECTED) {
            failCallback(this.failReason)
        }
    }
}

module.exports =  MyPromise