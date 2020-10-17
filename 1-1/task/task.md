### 一 谈谈是如何理解JS的异步编程，EventLoop，消息队列都是做什么的，什么是宏任务，什么是微任务？
答： 
- 异步编程的目的：
  
  JavaScript原本是网页端的脚本语言，属于同步模式进行，如果其中的某一个任务，或者说某一行代码，执行时间过长，那么它后面的任务就会被阻塞，这种阻塞对于用户而言就意味着卡死或者卡顿，所以必须要有异步模式，去解决哪些程序中无法避免的耗时操作。比如ajax请求，node端的大文件读写等
- 异步编程的特点：
  
  不会等待这个任务的结束才开始执行下一个任务，对于耗时的操作，都是开启过后，就立即执行下一个任务。耗时任务的后续逻辑，一般会通过回调函数的模式去定义，在内部执行完耗时任务后，就会自动执行回调函数的内容。
- 异步函数的执行过程：

  JS引擎会先执行call stack中的事件，按顺序执行。异步线程会单独去执行，执行完后，会把回调函数放入消息队列，event loop会监听消息队列中的事件，当消息队列中的事件发生变化的时候，依次将第一个事件放入call stack中，因此js主线程会依次开始消息队列压入call stack中的任务。
  - event loop：监听消息队列中的变化，将事件依次按顺序压入call stack
  - 消息队列：异步任务结束后，按顺序将回调事件放入消息队列中排队
- 宏任务：
  
  - 由node或浏览器发起(宿主)
  
  - 具体对象：
  1. script (可以理解为外层同步代码）
  2. setTimeout/setInterval
  3. UI rendering/UI事件
  4. postMessage，MessageChannel
  5. setImmediate，I/O（Node.js）等
    
    会在所有同步操作和微任务执行完后执行。

- 微任务：
  - 由JS引擎自己发起(ES3之前，JS没有异步的能力，ES5之后，引入Promise，可以发起异步)
  - 具体对象：1. Promise，2. MutaionObserver 3. Object.observe（已废弃；Proxy 对象替代）4. process.nextTick（Node.js）


### 代码问题
#### 一 将下列代码用promise方式改进
```
setTimeout(function () {
    var a = 'hello '
    setTimeout(function () {
        var b = 'lagou '
        setTimeout(function () {
            var c = 'I love you '
            console.log(a + b + c)
        }, 10)
    }, 10)
}, 10)
```
答：
```
Promise
.resolve("hello ")
.then(value=>value+"lagou ")
.then(value=>value+"I love you ")
.then(value=>console.log(value))
```
#### 二 基于以下代码完成下面四个练习
```
const fp = require('lodash/fp')
//数据
//horsepower马力，dollar_value价格，in_stock库存
const cars = [{
    name: 'Ferrari FF', housepower: 660, dollar_value: 700000, in_stock: true
}, {
    name: 'Spker C12 Zagato', housepower: 650, dollar_value: 648000, in_stock: false
}, {
    name: 'Jaguar XKR-S', housepower: 550, dollar_value: 132000, in_stock: false
}, {
    name: 'Audi R8', housepower: 525, dollar_value: 114200, in_stock: false
}, {
    name: 'Aston Martin One-77', housepower: 750, dollar_value: 1850000, in_stock: true
}, {
    name: 'Pagani Huayra', housepower: 700, dollar_value: 1320000, in_stock: false
},
]
```
**练习1**：使用函数组合fp.flowRight()重新实现下面这个函数
```
let isLastInStock = function(cars){
    //获取最后一条数据
    let last_car = fp.last(cars)
    //获取最后一条数据的in_stock属性值
    return fp.prop('in_stock',last_car)
}
```
答：
```
let result = fp.flowRight(fp.prop('in_stock'),fp.last)(cars)
console.log(result)
```
**练习2**： 使用fp.flowRight(),fp.pop(),fp.first()获取第一个car的name
答：
```
let result = fp.flowRight(fp.prop("name"),fp.first)(cars)
console.log(result)
```
**练习3**：使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现
```
let _average = function(xs){
    return fp.reduce(fp.add,0,xs) / xs.length
}//无需改动 
let averageDollarValue = function(cars){
    let dollar_values = fp.map(function(car){
        return car.dollar_value
    },cars)
    return _average(dollar_values)
}
```
答：
```
let result = fp.flowRight(_average,fp.map(item=>item.dollar_value))(cars)
console.log(result)
```
**练习4**：使用flowRight写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如：
sanitizeNames(['Hello World'])=>['hello_world']
```
let _underscore = fp.replace(/\w+/g,'_')//无需改动，并在sanitizeNames中使用它
```
答：
```
let sanitizeNames = fp.flowRight(_underscore,fp.toLower,fp.map(item=>item))
```
#### 三 基于下面提供的代码，完成后续的四个练习
```
//support.js
class Container{
    static of(value){
        return new Container(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return Container.of(fn(this._value))
    }
}

class Maybe {
    static of(x){
        return new Maybe(x)
    }
    isNothing(){
        return this._value === null || this._value === undefined
    }
    constructor(x){
        this._value = x
    }
    map(fn){
        return this._isNothing() ? this:Maybe.of(fn(this._value))
    }
}
module.exports = {Maybe,Container}
```
**练习1**：使用fp.add(x,y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1
```
//app.js
const fp = require('lodash/fp')
const {Maybe,Container} = require('./support')
let maybe = Maybe.of([5,6,1])
let ex1 = () => {
    //你需要实现的函数
}
```
答：
```
let ex1 = fp.map(fp.add(1))
maybe.map(ex1)
```
**练习2**：实现一个函数ex2，能使用fp.first获取列表的第一个元素
```
//app.js
const fp = require('lodash/fp')
const {Maybe,Container} = require('./support')
let xs = Container.of(['do','ray','me','fa','so','la','ti','do'])
let ex2 = () => {
    //你需要实现的函数
}
```
答：
```
let ex2 = fp.first
xs.map(ex2)
```
**练习3**：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
```
//app.js
const fp = require('lodash/fp')
const {Maybe,Container} = require('./support')
let safeProp = fp.curry(function(x,o){
    return Maybe.of(o[x])
})
let user = {id:2,name:'Albert'}
let ex3 = () => {
    //你需要实现的函数
}
```
答：
```
return safeProp('name')(user).map(fp.first)
```
**练习4**：使用Maybe重写ex4，不要有if语句
```
//app.js
const fp = require('lodash/fp')
const {Maybe,Container} = require('./support')
let ex4 = function(n){
    if(n){
        return parseInt(n)
    }
}
```
答：
```
class Maybe {
    static of(x){
        return new Maybe(x)
    }
    isNothing(){
        return this._value === null || this._value === undefined
    }
    constructor(x){
        this._value = x
    }
    map(fn){
        return this._isNothing() ? this:Maybe.of(fn(this._value))
    }
}
let maybe = Maybe.of(n).map(parseInt)
```
#### 四，手写实现Promise源码
```
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
    finally = (callback) => {
        //finally方法，无论结果是失败还是成功，都能返回结果，且then方法都能拿到最后的结果。
        return this.then(value=>{
            return MyPromise.resolve(callback()).then(()=>value)
            // callback()
            // return value
        },reason=>{
            return MyPromise.resolve(callback()).then(()=>{throw reason})
            // callback()
            // throw reason
        })
    }
    catch = (failCallback) => {
        return this.then(undefined,failCallback)
    }
    static all(array){
        //all方法传入一个数组，并且按照数组元素的顺序进行输出，所以要控制异步的行为
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
    static resolve(value){
        if(value instanceof MyPromise){
            return value
        }else{
            return new MyPromise(resolve=>resolve(value))
        }
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        //判断promise回调自身的情况，不可循环回调
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
```