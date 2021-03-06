## 一  函数式编程
- 概述： 函数式编程(Functional Programming,FP)FP就是编程规范之一，我们常听说的编程规范还有面向对象编程，面向过程编程。

- 面向对象的编程思维方式：把现实世界中的事物抽象成程序世界的类和对象，通过封装，继承和多态演示事物事件的联系
- 函数编程的思维方式：把现实世界的事物和事物之间的**联系**抽象到程序世界(对运算过程进行抽象)
    - 程序的本质：根据输入，通过某种运算，获得相应的输出
    - 函数式编程中的函数不是指程序中的(函数)方法，**而是数学中的函数，即映射关系**
    - 相同的输入始终要得到相同的输出(纯函数)
    - 函数式编程用来描述数据(函数)之间的映射关系
  
```
//非函数式编程,面向过程的编程方式
let num1 = 1
let num2 = 2
let sum = num1 + num2

//函数式编程,对面向过程的抽象
function sum(n1,n2){
    return n1+n2
}
let result = sum(1,2)
```
### 1. JS函数基本知识
- 函数可以储存在变量中
- 函数可以作为参数
- 函数可以作为返回值

在JavaScript中，函数就是一个普通的对象，(可以通过new Function()),我们可以把函数存储到变量/数组中，它还可以作为另一个函数的参数和返回值，甚至我们还可以在程序运行的时候通过new Function('alert(1)')来构建一个新的函数
- 把函数赋值给变量
```
let fn = function(){
    console.log('First-class Function MDN')
}
```
### 2.高阶函数
- 高阶函数(Higher-order function)
    - 可以把函数作为参数传递给另一个函数
    - 可以把函数作为另一个函数的返回结果
1. 函数作为参数

```
//forEach
function forEach(array,fn){
    for(let item of array){
        fn(item)
    }
}

//filter
function filter(array,fn){
    let result = []
    for (let item of array){    
        if(fn(item)){
            result.push(item)
        }
    }
    return result
}

//测试
let array = [1,2,3,4,5,6,7]
forEach(array,function(item){
    console.log(item)
})

let r = filter(array,function(item){
    return item%2 === 0
})
console.log(r)
```
2. 函数作为返回值
```
//高阶函数，函数作为返回值
function makeFn(){
    let msg = 'Highter-order Function'
    return function (){
        console.log(msg)
    }
}
//第一种调用方式
const fn = makeFn()
fn()
//第二种调用方式
makeFn()()
//once只能执行一次的函数
function once(fn){
    let done = false
    return function (){
        if(!done){
            done = true
            return fn.apply(this,arguments)
        }
    }
}
let pay = once(function(money){
    console.log(`支付${money}`)
})
pay(5)
pay(5)
pay(5)
pay(5)
pay(5)
```
### 3.闭包
**概述**:有权访问另一个函数作用域中的变量的函数

**本质**:函数执行的时候会入栈，当执行完后会移除栈，但是堆上的作用域成员因为被外部引用而不能释放。因此内部函数依然可以访问外部函数的成员。

**栈**：栈会自动分配内存，会自动释放，存放基本数据类型，占据固定大小的空间。

**栈的溢出**：递归调用方法，随着栈的深度增加，直到内存不够分配，产生溢出。

**栈的优势**：所有方法中的变量都存在栈中，随着方法执行的结束，这个方法的内存栈也随之销毁，存取速度很快，仅次于CPU的寄存器，可以共享。

**堆**：动态分配内存，大小不定，也不会自动释放内存，不会随着方法的结束而销毁堆内存，存放引用数据类型，实际保存的不是变量本身，而是指向该对象的指针。

**堆溢出**：循环创建对象，就是不断的new对象

chrome source 断点调试



### 4. 纯函数
- 概念：相同的输入永远会得到相同的输出，而且没有任何可观察的副作用，类似数学中的函数y=f(x)
- 例子：slice函数就是纯函数，对一个数组，相同的输入永远得到相同的输出，splice就是非纯函数，相同的输入可能会得到不同的结果，因为会改变原数组
- 函数式编程不会保留计算中间的结果，所以变量不可变(无状态)
- 可以把一个函数的执行结果交给另一个函数去执行
- 纯函数可以缓存,因为相同的输入必然有相同的输出
```
//memoize函数
function memoize(fn){
    let cache = {}
    return function(){
        let key = JSON.stringfy(arguments)
        cache[key] = cache[key] || fn.apply(fn,arguments)
        return cache[key]
    }
}
```
- 可测试，让测试更方便
- 多线程环境下操作共享的内存数据可能会出现意外的情况，而纯函数不需要共享的数据空间，只和输入有关，所以并行环境下可以任意运行纯函数
- 副作用，副作用会让纯函数变的不纯，比如依赖外部的状态，就无法保证输出相同，带来副作用，副作用来源：配置文件，数据库，获取用户的输入等等...所有的外部交互都可能带来副作用，副作用使得方法通用性下降，不适合扩展和重用，同时给程序带来安全隐患，副作用不可能完全禁止，只能尽可能的在控制范围内。
```
//不纯的函数
let mini = 18
function checkAge(age){
    return age>min
}
//纯函数(有硬编码，后续可以通过柯里化来解决)
function checkAge(age){
    let mini = 18
    return age>mini
}
```
### 3.柯里化(Haskll Brooks Curry)

```
//解决上述硬编码的问题
function checkAge(min){
    return function(age){
        return age>=min
    }
}
let checkAge18 = checkAge(18)
checkAge18(22)
```
es6进行简化
```
let checkAge = min => ( age => age >= min )
```
- 当一个函数有多个参数的时候，可以先传递一部分，先调用它，并返回一个函数(这部分参数以后保持不变)
- 然后返回一个新的函数接受剩下的参数，返回结果
- lodash中的柯里化函数
    - _.curry(func)
    - 功能：创建一个函数，该函数接受一个或多个func的参数，如果该函数所有的参数都被传递，则返回函数的结果，否则，返回该函数并等待继续传递参数
    - 参数：需要柯里化的函数
    - 返回值：柯里化后的函数
    ```
    //lodash中的curry的使用
    const _ = require('loadsh')
    function getSum(a ,b ,c){
        return a + b + c
    }
    const curried = _.curry(getSum)
    console.log(curried(1 , 2 , 3))    //6
    console.log(curried(1)(2 , 3))     //6
    console.log(curried(1)(2)(3))      //6
    ```
    - 自己实现一个curry函数
    ```
    function curry(func){
        return function curriedFn(...args){
            if(args.length<func.length){
                return function(){
                    return curriedFn(...args.concat(Array.form(arguments)))
                }
            }else{
                return func(...args)
            }
        }
    }
    ```
- 总结：柯里化可以让我们给一个函数传递较少的参数，返回一个记住来某些固定参数的新函数，这是一种对函数参数的缓存，让函数变的更灵活， 让函数的粒度更小。可以把多元函数转换成一元的函数，可以组合使用函数产生强大的功能。

### 4.函数的组合
- 纯函数和柯里化很容易让我们写出洋葱代码，比如`h(f(g(x)))`
    - 获取数组的最后一个元素并转化为大写字母，`_.toUpper(._first(_.revers(array)))`
    - 函数的组合可以让我们把细粒度的函数，重新组合成一个新的函数
- lodash中的组合函数
    - lodash中的组合函数flow()和flowRight(),都可以组合多个函数
    - flow()是从左到右执行
    - flowRight()是从右到左执行
    - 自己实现一个flowRight函数：
    ```
    function composeRight(...args){
        return function (value){
            args.reverse().reduce(function(acc,fn){
                return fn(acc)
                },value)
        }
    }
    //箭头函数
    const compose = (...args)=>value=>args.reverse().reduce((acc,fn)=>fn(acc),value)
    //如果是表达式赋值的话，不会变量提升
    ```
- 函数的组合要满足结合律，即f,g,h三个函数，无论先组合那几个，结果都是等效的,即flowRight(_.toUpper,_.first,_.revers)
- 函数组合如何进行调试？
```
const log = (v)=>{
    console.log(v)
    return v
}
```
- lodash库中的fp模块
    - lodash的fp模块提供了实用的对函数式编程友好的方法
    - 提供了不可变的**auto-curried iteratee-first data-last**的方法
    ```
    //lodash方法
    const _ = require('lodash')
    _.map(['a','b','c'],_.toUpper)
    //=>['A','B','C']
    _.map(['a','b','c'])
    //=>['a','b','c']
    //loadsh/fp模块
    const fp = require('lodasg/fp')
    fp.map(fp.toUpper,['a','b','c'])
    fp.map(fp.toUpper)(['a','b','c'])
    ```
### 5.Point Free
我们可以把数据处理的过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，只要把简单的运算步骤合成到一起，在使用这种模式之前我们需要定义一些辅助的基本运算函数。
- 不需要指明处理的数据
- 只需要合成运算过程
- 需要定义一些辅助的基本运算函数
```
const f = fp.flowRight(fp.join('-'),fp.map(_.toLower),fp.splite(''))
```
### 6.functor(函子)
- 为什么要了解函子
目前没有解决如何在函数式编程中，把副作用控制在可控的范围内，异常处理，异步操作等等。
- Functor
    - 容器：包含值和值的变形关系(这个变形关系就是函数)
    - 函子：是一个特殊的容器，通过一个普通对象来实现，该对象具有map方法，map方法可以运行一个函数对值进行处理(变形关系)
    ```
    //Functor函子
    class Container{
        //函子内部要有一个值
        constructor(value){
            //这个值是传入进来的，且不对外公布
            this._value = value
        }
        map(fn){
            //map方法，接受一个处理值的函数,去处理这个值。
            //并且要把处理的值，传给一个新的函子，最后返回这个新的函子
            return new Container(fn(this._value ))
        }
        }
        
        //新建一个函子
        let r = new Container(5).map(x=>x+1).map(x=>x*x)
    ```
    - of方法：
    ```
    //of方法用来返回一个函子对象
    class Container{
        constructor(value){
            this._value = value
        }
        static of(value){
            //传入值，返回一个新的函子对象
            return new Container(value)

        }
        map(fn){
            return Container.of(fn(this._value))
        }
    }
    let r = Container.of(5).map(x=>x+1).map(x=>x*x)
    console.log(r)//打印出来的是一个函子，不是值，永远不会把这个值取出来，需要改变这个值的时候，使用map方法传入一个函数去处理，进行链式调用。
    ```
- 总结
  - 函数式编程的运算不直接操作值，而是由函子完成
  - 函子就是一个实现了map契约的对象
  - 我们可以把函子想象成一个盒子，这个盒子里封装了一个值
  - 想要处理盒子中的值，我们需要给盒子的map方法传递一个处理值的函数（纯函数），由这个函数对值进行处理
  - 最终map方法返回一个包含新值的盒子（函子）

- MayBe函子
  - 我们在编程过程中可能会遇到很多的错误，需要对这些错误进行相应的处理
  - MayBe函子的作用就是可以对外部的空值情况做处理（控制副作用在允许的范围之内）
    ```
    //MayBe函子
    class MayBe{
        static of(value){
            return new MayBe(value)
        }
        constructor(value){
            this._value = value
        }
        map(fn){
            return this.isNothing()?MayBe.of(null):MayBe.of(fn(this._value))
        }
        isNothing(){
            return this._value === null || this._value === undefined
        }
    }
    let r = MayBe.of(null).map(x=>x+1).map(x=>x*x)
    console.log(r)
    ```
  - 问题：如果多次调用map，中间出现了null空值的情况，最后会返回包含null的函子。虽然maybe函子可以处理空值的情况，但不知道是哪一步出现了空值
  
- Either函子
  - Either两者中的任意一个，类似于if...else...的处理
  - 异常会让函数变的不纯，Either函子可以用来做异常处理
    ```
    //Either函子
    class Left{
        static of(value){
            return new Left(value)
        }
        constructor(value){
            this._value = value
        }
        map(fn){
            return this
        }

    }

    class Right{
        static of(value){
            return new Right(value)
        }
        constructor(value){
            this._value = value
        }
        map(fn){
            return Right.of(fn(this._value))
        }
    }
    
    function parseJSON(str){
        try{
            return Right.of(JSON.parse(str))
        }catch(error){
            return Left.of({error:error.message})
        }
    }
    let l = parseJSON('{name:zs}')//error
    console.log(l)
    let r = parseJSON('{"name":"zs"}')
    console.log(r)
    r.map(x=>x.toUpper())
    ```
- IO函子
  - IO函子中的_value是一个函数，这里是把函数当作值来处理
  - IO函子可以把不纯的函数储存到_value中，延迟执行这个不纯的操作(惰性执行)
  - 把不纯的操作交给调用者来处理
    ```
    const fp = require('lodash/fp')
    class IO{
         static of(x){
             return new IO(function(){
                 return x
             })
         }
         constructor(fn){
             this._value = fn
         }
         map(fn){
             return IO.of(fp.flowRight(fn,this._value))
         }
    }
    //调用
    //因为是在node环境，所以直接传递process对象，node的进程
    let r = IO.of(process).map(p=>p.execPath)
    console.log(r)        //IO {_value :[Function]}
    console.log(r._value())    //执行node进程的路径
    ```
- folktale
  - folktale是一个标准的函数式编程库
  - 和lodash，ramda不同的是，他没有提供很多功能函数
  - 只提供了函数式处理的操作，例如，curry，compose等，和一些函子Task，Either,MayBe等
  ```
    //folktale  2.3.2
    //Task处理异步任务
    const fs = require('fs')
    const {task} = require('folktale/concurrency/task')
    const {split,find} = require('loadsh/fp')

    function readFile(filename){
        return task(resolver=>{
            fs.readFile(filename,'utf-8',(error,data)=>{
                if(error){
                    resolver.reject(err)
                }else{
                    resolver.resolve(data)
                }

            })
        })
    }
    //会返回一个Task函子
    readFile('package.json')
    .run()
    .listen({//监听事件的状态
        onRejected:err=>{
            console.log(err)
        },
        onResolved:value=>{
            console.log(value)
        }
    })
    //可以在run之前调用map，去处理返回的结果
    readFile('package.json')
    .map(split('\n'))
    .map(find(x=>x.includes('version')))
    .run()
    .listen({//监听事件的状态
        onRejected:err=>{
            console.log(err)
        },
        onResolved:value=>{
            console.log(value)
        }
    })
  ```
- Pointed函子
    - Pointed函子是实现的静态方法of的函子
    - of是为了避免使用new来创建对象，更深层的含义是of方法用来把值放到上下文Context中(把值放到容器中，使用map来处理值)
- Monad函子
  - Monad函子是为来解决IO函子嵌套的问题
    ```
    const fp = require('lodash/fp')
    const fs = require('fs')
    class IO{
         static of(x){
             return new IO(function(){
                 return x
             })
         }
         constructor(fn){
             this._value = fn
         }
         map(fn){
             return IO.of(fp.flowRight(fn,this._value))
         }
    }
    let readFile = function(filename){
        return new IO(function(){
            return fs.readFileSync(filename,'utf-8')
        })
    }
    let print = function(x){
        return new IO(function(x){
            console.log(x)
            return x
        })
    }
    let cat = fp.flowRight(print,readFile)
    let r = cat('package.json')._value()._value()
    console.log(r)
    ```
  - Monad函子是一个可以变扁的Pointed函子，变扁就是解决函子嵌套的问题IO(IO(x))
  - 一个函子如果具有join和of两个方法并遵守一些定律就是一个Monad
  ```
  //注意看join方法
   const fp = require('lodash/fp')
   const fs = require('fs')
   class IO{
         static of(x){
             return new IO(function(){
                 return x
             })
         }
         constructor(fn){
             this._value = fn
         }
         map(fn){
             return IO.of(fp.flowRight(fn,this._value))
         }
         join(){
             return this._value()
         }
         flatMap(fn){
            //经常会用到map和join方法，所以就用flatMap将其变扁
            return this.map(fn).join()
         }
    }
    let print = function(x){
        return new IO(function(){
            console.log(x)
            return x
        })
    }
    let r = readFile('package.json')//这里可以用map去处理内容
                .flatMap(print)
                .join()
  ```
