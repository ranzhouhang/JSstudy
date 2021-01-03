//此文件作为Generator的核心入口
//需要导出一个继承自Yeoman Generator的类型
//Yeoman Generator在工作时会自动调用我们在此类型中定义的一些生命周期方法
//我们在这些方法中可以调用父类提供的一些工具方法，实现一些功能，比如文件的写入等

const Genertator = require('yeoman-generator')

module.exports = class extends Genertator {
    writing() {
        //Yeoman在自动生成文件阶段调用此方法
        //这里尝试向项目目录中写入文件
        this.fs.write(
            //两个参数，文件的绝对路径，文件的内容
            this.destinationPath('temp.txt'),
            Math.random().toString()
        )
    }
}
//1.yarn link
//2.mkdir my-demo
//3.yo sample