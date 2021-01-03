// 实现这个项目的构建任务
//gulpfile.js
const { src, dest, parallel, series, watch } = require('gulp')
//watch会监视一个文件路径的通配符，根据这些文件的变化，决定是否执行某个任务


//自动加载插件yarn add gulp-load-plugins --dev
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const { sass, babel, swig, imagemin } = plugins
//plugins是一个对象，所有plugin的插件都会成为这个对象下面的一个属性
//命名方式是去掉gulp-，比如gulp-sass=>sass,如果有两个gulp-load-plugins
//那么他会自动驼峰命名gulp-load-plugins=>loadPlugins

//自动热更新服务器模块yarn add browser-sync --dev
//提供一个开发的服务器，它支持热更新，代码修改后能立刻看到结果
const browserSync = require('browser-sync')
const bs = browserSync.create()

//自动清除文件 `yarn add del --dev`
const del = require('del')
const clean = () => {
    return del(['dist', 'temp'])
}

//样式编译
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })//输入的目录
        //同时规定输出时也带着的父级目录base
        //用了loadplugins后就是plugins.sass,下面同理
        .pipe(sass({ outputStyle: 'expanded' }))//sass样式转换，规定打括号换行
        .pipe(dest('temp'))//输出的目录
}
//js编译
const script = () => {
    return src('src/assets/styles/*.js', { base: 'src' })
        //如果直接babel(),可能没有任何效果。因为babel是一个js转换的平台
        //本身不做任何操作，转换的是其中的插件
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
    //这里需要安装yarn add @babel/core @babel/preset-env --dev
    //可以在最后pipe(bs.reload({stream:true}))//这样就可以不用files配置了
}
const data = {
    menus:[],
    pkg:require('./package.json'),
    date:new Date()
}
//页面目标编译
const page = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(swig({data}))
        .pipe(dest('temp'))
}

//图片压缩
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
    //yarn add gulp-imagemin --dev
}
//字体压缩，只能处理svg的字体，其他格式不支持压缩
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}
//其他的额外文件,只进行复制，没有做转换
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}
const useref = () => {
    return src('temp/*.html', { base: 'dist' })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        .pipe(plugins.if(/\.if$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true, //这个配置是折叠掉文件内所有的空白字符
            minifyCSS: true,//同理，折叠css和js中的空白字符
            minifyJS: true
        })))
        .pipe(dest('dist'))
}

const serve = () => {
    //watch指定目录文件发生变化后，执行指定的任务，再通过bs的files功能进行浏览器的更新
    //可能会遇到的问题，因为swig模板引擎缓存机制导致页面不会发生变化，此时需要额外的将
    //swig选项中的cache设置为false
    //一般在watch监视的时候，不会去监视转换font和image文件，最后发布的时候进行转换编译
    //在bs中的baseDir指定一个数组路径，一个请求过来，先到第一个路径去找，没有才到后面
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/styles/*.js', script)
    watch('src/**/*.html', page)
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)
    //初始化服务器的配置,定义完后记得导出
    bs.init({
        server: {
            // noifty: false,//通知
            // port: 2080,//默认3000
            files: 'dist/*',//指定监听目录下的文件，如果发生了变化，重启服务
            //定义网站的根目录，就是web服务器，把那个目录作为根目录
            baseDir: ['dist', 'src', 'public'],
            //让对于/node_modules开头的请求，都指到同一个目录下面去，这个会优先于baseDir
            //如果先有routes会先走routes,否则才是baseDir
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}


//并行处理样式，脚本，页面文件，一般是处理src文件下
const compile = parallel(style, script, page)
//先去clean，在去转换其他文件,上线之前的操作
const build = series(clean, parallel(series(compile, useref), image, font, extra))
//先进行编译，再启动服务，开发时候的操作
const develop = series(compile, serve)
module.exports = {
    clean,
    build,
    develop
}