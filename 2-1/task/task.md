## 简答题

### 1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。
#### 解决的问题
- 一切以提高效率，降低成本，质量保证为目的的手段都属于**工程化**
- 一切重复的功能都应该被自动化
1. 传统语言或语法的弊端
2. 无法使用模块化和组件化
3. 重复机械的操作
4. 代码风格统一，质量保证
5. 依赖后端服务接口支持
6. 整体依赖后端项目

### 2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？

把开发过程中要用到的工具、环境提前配置，就可以直接开始做开发，专注业务，提升效率。

## 编程题
### 1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具
- 选择模板
- 安装模板和项目依赖
```
const inquirer = require('inquirer')
const fse = require('fs-extra')
let prompts = []

if (typeof projectName !== 'string') {
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称:',
    validate(input) {
      if (!input) {
        return '项目名称不能为空'
      }
      if (fse.existsSync(input)) {
        return '已经存在同名项目，请重新输入项目名'
      }
      return true
    }
  })
} else if (fse.existsSync(projectName)) {
  prompts.push({
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称:',
    validate(input) {
      if (!input) {
        return '项目名称不能为空'
      }
      if (fse.existsSync(input)) {
        return '已经存在同名项目，请重新输入项目名'
      }
      return true
    }
  })
}
// 项目描述
prompts.push({
  type: 'input',
  name: 'description',
  message: '请输入项目描述'
})
// 选择模板
prompts.push({
  type: 'list',
  message: '请选择要下载的模板',
  name: 'template',
  choices: [
    {
      name: "PC",
      value: "PC-master"
    }, {
      name: "mobile",
      value: "mobile-master"
    }
  ]
})
inquirer.prompt(prompts).then(answer => {
    // answer 为用户输入的内容
    // 问询之后的操作，一般为下载模板
})
```
## yeoman
  - 找到合适的generator
  - 全局范围安装找到的generator
  - 通过yo运行对应的generator
  - 通过命令行交互填写选项
  - 生成你所需要的项目结构

- yarn init创建package.json
- yarn add yeoman-generator提供一个生成器的基类，基类中提供一些生成器的函数，让我们创建生成器更加便捷
- 按照Generator基本结构，创建generators/app/index.js
  - 此文件作为Generator的核心入口，导出一个继承Yeoman Generator的类型
  - Yeoman Generator在工作的时候会自动调用我们在此类型中定义的一些生命周期的方法
  - 我们可以在这些方法中调用父类提供的一些工具方法实现一些功能，例如文件写入
```
//generators/app/index.js
const Generator = require('yeoman-generator')
module.exports = class extends Generator {
  writing () {
    //Yeoman会在自动生成文件阶段调用此方法
    //因此可以通过文件读写的方法在这个目录下写入文件
     this.fs.write(
       //两个参数，文件的绝对路径，文件的内容
       this.destinationPath('temp.txt')
       Math.random().toString()
     )
  }
}
```
- yarn link先链接到全局
- yo sample

### yeoman根据模板去创建
```
//foot.txt
这是一个模板文件
内部可以使用 EJS 模板标记数据（模板内部完全遵循EJS语法）
例如，<%= title %>去动态的去输出一些数据，也可以做判断循环等操作
//index.js
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
```
- yarn link先链接到全局
- yo sample
- 根据模板去创建文件
## plop
```
//plopfile.js
//Plop的入口文件，需要导出一个函数
//此函数接受一个plop对象，这个对象里面提供了一系列的工具函数，用于创建生成器的任务
module.exports = plop => {
  //setGenerator接收两个参数，一个是生成器的名字，一个是配置参数
  plop.setGenerator('component',{
  //配置选项中，需要去指定下生成器的描述
  description:'create a component',
  //指定命令行要发出的问题，出现在交互环节
  prompts:[
    {
      type:'input',//type定义交付的方式
      name:'name',//本次交互的key值
      message:'component name',//交互的提示信息
      default:'MyComponent'//本次交互的默认答案
    }
  ],
  //actions顾名思义，完成命令行交互后，执行的动作，可以是一个数组，其中每一个对象就是一个动作
  actions:[
    {
      type:'add',//type指定动作的类型，add指添加一个全新的文件
      path:'src/components{{name}}/{{name}}.js',//指定添加文件所在的路径，可以使用双花括号替换刚刚在命令行中指定的数据
      templateFile:'plop-templates/component.hbs',//还需要指定本次添加文件的模板文件是什么
    }
  ]
  })
}
```
通过yarn plop componet执行
### 2、尝试使用 Gulp 完成项目的自动化构建
见项目文件夹gulpfile.js
