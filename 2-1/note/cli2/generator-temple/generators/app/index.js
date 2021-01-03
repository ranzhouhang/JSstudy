    //此文件作为Generator的核心入口
//需要导出一个继承自Yeoman Generator的类型
//Yeoman Generator在工作时会自动调用我们在此类型中定义的一些生命周期方法
//我们在这些方法中可以调用父类提供的一些工具方法，实现一些功能，比如文件的写入等

const Genertator = require('yeoman-generator')

module.exports = class extends Genertator {
    writing() {
        // //Yeoman在自动生成文件阶段调用此方法
        // //这里尝试向项目目录中写入文件
        // this.fs.write(
        //     //两个参数，文件的绝对路径，文件的内容
        //     this.destinationPath('temp.txt'),
        //     Math.random().toString()
        // )

        //那么在生成文件的时候，就不用fs.write方法去写入文件
        //而是使用fs中专门使用模板引擎的方法，通过模板方式写入文件到目录
        //分别有三个参数，模板文件的路径，生成文件的路径，模板文件内容的上下文
        //模板文件路径
        const tmpl = this.templatePath('foo.txt')//自动获取当前文件的路径
        //输出目标路径
        const output = this.destinationPath()
        //模板数据上下文
        const context = {title :"Hello",success:false}
        //传入参数
        this.fs.copyTpl(tmpl,output,context)//这个方法会自动的把模板文件，映射到生成的输出文件上
    }
}
//1.yarn link
//2.mkdir my-demo
//3.yo sample