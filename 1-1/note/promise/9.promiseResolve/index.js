const { resolve } = require("./myPromise")
const MyPromise = require("./myPromise")

function p1(){
    return new MyPromise(resolve=>{
        resolve("p1")
    })
}

MyPromise.resolve(100).then(value => console.log(value))
MyPromise.resolve(p1()).then(value => console.log(value))