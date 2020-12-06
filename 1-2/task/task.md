### 一 下列执行结果和原因
```
var a = []
for(var i = 0; i < 10; i++){
    a[i] = function () {
        console.log(i)
    }
}
a[6]()
```
#### 答：
- 结果：10

- 原因：数组a和i都是全局变量，数组中每个元素保存着一个匿名函数，console的i为全局唯一的i值。i的最后值为10，所以结果为10。如果换成let的话，每个块级作用域都会保存一个i值，就会按照i的顺序console。

### 二 下列执行结果和原因
```
var tmp = 123;
if(true){
    console.log(tmp)
    let tmp
}
```
#### 答：
- 结果：Cannot access 'tmp' before initialization
- 原因：var声明的变量，创建和初始化阶段都会提升
let声明的变量，创建阶段被提升了，初始化阶段没有提升，存在暂时性死区。

### 三 结合ES6新语法，找出数组中最小值
```
var arr = [12, 34, 32, 89, 4]
```
#### 答：
`Math.max(...arr)`
### 四 说明var, let, const, 三种声明变量的方式之间的具体差别
- var:作用全局作用域或者函数作用域。var声明的变量，创建和初始化阶段都会提升
- let:作用域块级作用域。let声明的变量，创建阶段被提升了，初始化阶段没有提升，存在暂时性死区。
- const:在let的基础上多了一个只读的特性，变量一旦声明过后，就不能再修改。(对于对象和数组，只读是指不改变内存指向)
### 五 下列执行结果和原因
```
var a = 10;
var obj = {
    a: 20,
    fn () {
        setTimeout(()=>{
            console.log(this.a)
        })
    }
}
obj.fn()
```
#### 答：
- 结果：20
- 原因：箭头函数没有自己的this值，this来自于作用域链。而上个作用域链是fn，fn是由obj调用的，所以this指向obj，所以console结果是20。将箭头函数改成普通函数，结果会是10。
### 六 简述Symbol类型的用途
#### 答：
1. 对象的属性名
2. 利用symbol来建立私有属性
3. 做内部方法的标示 
4. 修改默认的内部方法，比如迭代器
### 七 浅拷贝和深拷贝
#### 答：
- 浅拷贝：
只复制引用的地址，而不是复制值，比如引用类型，对象，数组，函数等。
- 深拷贝：
复制本身，比如基本数据类型，如果层级很多，会拷贝各个层级的属性。
### 八 简述TypeScript和JavaScript的关系
1. ts是js的超集，即你可以在ts中使用原生js语法。
2. ts补充了JS中没有的强类型与更多面向对象的内容。
3. ts最终仍要编译为弱类型，基于对象的原生的js，再运行。
4. TypeScript = Javascript+类型系统+新特性的支持ES6+
### 九 TypeScript优缺点
- 优点：
1. bug暴露的更早，编码阶段就能暴露出类型的异常，而不是在运行的时候暴露问题
2. 代码更加智能，编码更加准确
3. 重构更加可靠(某些具有破坏力的改动)
4. 减少在代码层面一些不必要的类型判断(typeof)

- 缺点：

1. 项目初期，TypeScript会增加一些成本
### 十 引用计数工作原理和优缺点
- 工作原理：设置引用数，当引用关系发生变化的时候，例如，有一个变量名指向一个内存空间，那么引用数值就加一，如果是减少的情况减一。当引用数字为0，GC就会立即工作，将这个空间立刻回收
- 优点：
1. 发现垃圾立即回收，看数值是否为0，为0就立即释放
2. 最大限度减少程序暂停，防止内存被占满
- 缺点：
1. 无法回收循环引用的对象
2. 因为引用计数器的存在，使其在效率上和其他计数器有所差别
### 十一 标记整理算法工作流程
- 工作流程
1. 遍历所有对象，找到活动的对象(可达对象)，进行标记操作
2. 执行整理操作，移动标记对象的位置，让他们在地址上产生连续。
3. 清除没有标记的对象，同时会抹去上个阶段的标记，让下次GC能正常工作
### 十二 V8 中新生代存储区垃圾回收流程
1. V8内存空间一分为二，小空间用于存储新生代对象(32M|16M)
2. 新生代内存分为两个等大的空间
3. 使用空间为From，空闲空间为To，活动对象存储于From空间
4. 标记整理后将活动对象拷贝至To，拷贝过程可能出现晋升，
5. From空间To交换空间完成释放，如果新生代中的对象经过一轮GC还活着，那么就需要晋升，移动至老生代
6. To的空间使用率超过25%，就会移动至老生代。因为需要Form和To进行交换，to空间使用率太高，会导致新的对象存不进去，内存不够用。

### 十三 增量标记算法在何时使用和原理

- 标记增量优化垃圾回收
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="819px" viewBox="-0.5 -0.5 819 171" content="&lt;mxfile host=&quot;e65d3a10-4f4c-4620-aa5d-4af15e94452d&quot; modified=&quot;2020-11-15T15:56:07.362Z&quot; agent=&quot;5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.51.0 Chrome/83.0.4103.122 Electron/9.3.3 Safari/537.36&quot; version=&quot;13.6.5&quot; etag=&quot;vrHi4RVIEKvapFE6tlW_&quot;&gt;&lt;diagram id=&quot;eRQsvwLWjOItZQGmFMB6&quot; name=&quot;Page-1&quot;&gt;&lt;mxGraphModel dx=&quot;1508&quot; dy=&quot;680&quot; grid=&quot;1&quot; gridSize=&quot;10&quot; guides=&quot;1&quot; tooltips=&quot;1&quot; connect=&quot;1&quot; arrows=&quot;1&quot; fold=&quot;1&quot; page=&quot;1&quot; pageScale=&quot;1&quot; pageWidth=&quot;827&quot; pageHeight=&quot;1169&quot; math=&quot;0&quot; shadow=&quot;0&quot;&gt;&lt;root&gt;&lt;mxCell id=&quot;0&quot;/&gt;&lt;mxCell id=&quot;1&quot; parent=&quot;0&quot;/&gt;&lt;mxCell id=&quot;45&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;&quot; edge=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;20&quot; y=&quot;360&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;800&quot; y=&quot;360&quot; as=&quot;targetPoint&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;46&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;垃圾回收&amp;lt;/font&amp;gt;&quot; style=&quot;text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;-10&quot; y=&quot;350&quot; width=&quot;40&quot; height=&quot;20&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;53&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;程序执行&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;20&quot; y=&quot;280&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;54&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 14px&amp;quot;&amp;gt;遍历对象进行标记&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;140&quot; y=&quot;390&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;55&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;执行&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;260&quot; y=&quot;280&quot; width=&quot;70&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;56&quot; value=&quot;&amp;lt;span style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;标记&amp;lt;/span&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;330&quot; y=&quot;390&quot; width=&quot;70&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;57&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;执行&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;400&quot; y=&quot;280&quot; width=&quot;70&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;58&quot; value=&quot;&amp;lt;span style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;标记&amp;lt;/span&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;470&quot; y=&quot;390&quot; width=&quot;70&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;59&quot; value=&quot;&amp;lt;span style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;完成清除&amp;lt;/span&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;580&quot; y=&quot;390&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;60&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 21px&amp;quot;&amp;gt;执行&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;700&quot; y=&quot;290&quot; width=&quot;70&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://viewer.diagrams.net/?client=1&amp;edit=_blank');}}})(this);" style="cursor:pointer;max-width:100%;max-height:171px;"><defs/><g><path d="M 30 80 L 803.63 80" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 808.88 80 L 801.88 83.5 L 803.63 80 L 801.88 76.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><rect x="0" y="70" width="40" height="20" fill="none" stroke="none" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 38px; height: 1px; padding-top: 80px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 21px">垃圾回收</font></div></div></div></foreignObject><text x="20" y="84" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">垃圾回收</text></switch></g><rect x="30" y="0" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 31px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 21px">程序执行</font></div></div></div></foreignObject><text x="90" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">程序执行</text></switch></g><rect x="150" y="110" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 140px; margin-left: 151px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 14px">遍历对象进行标记</font></div></div></div></foreignObject><text x="210" y="144" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">遍历对象进行标记</text></switch></g><rect x="270" y="0" width="70" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 68px; height: 1px; padding-top: 30px; margin-left: 271px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 21px">执行</font></div></div></div></foreignObject><text x="305" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">执行</text></switch></g><rect x="340" y="110" width="70" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 68px; height: 1px; padding-top: 140px; margin-left: 341px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><span style="font-size: 21px">标记</span></div></div></div></foreignObject><text x="375" y="144" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">标记</text></switch></g><rect x="410" y="0" width="70" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 68px; height: 1px; padding-top: 30px; margin-left: 411px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 21px">执行</font></div></div></div></foreignObject><text x="445" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">执行</text></switch></g><rect x="480" y="110" width="70" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 68px; height: 1px; padding-top: 140px; margin-left: 481px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><span style="font-size: 21px">标记</span></div></div></div></foreignObject><text x="515" y="144" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">标记</text></switch></g><rect x="590" y="110" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 140px; margin-left: 591px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><span style="font-size: 21px">完成清除</span></div></div></div></foreignObject><text x="650" y="144" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">完成清除</text></switch></g><rect x="710" y="10" width="70" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 68px; height: 1px; padding-top: 40px; margin-left: 711px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 21px">执行</font></div></div></div></foreignObject><text x="745" y="44" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">执行</text></switch></g></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://desk.draw.io/support/solutions/articles/16000042487" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Viewer does not support full SVG 1.1</text></a></switch></svg>

  - 上面是程序的执行，下面是垃圾的回收，当进行垃圾回收操作的时候，是会阻塞JS程序执行，所以会有空档期，即程序执行完，再进行垃圾回收操作
  - 标记增量就是将一整段的垃圾回收操作，拆分成一小部分组合的完成回收，去替代一口气实现垃圾回收，这样带来的时间消耗更加合理
  - 因为是针对老年代的垃圾回收，所以存在遍历操作，在进行标记的时候，可以不用一口气标记完，因为存在直接可达和间接可达，比如，我们先找到第一层的可达对象，进行标记，程序执行，再标记第二层的可达对象等，最后完成清除，程序再继续执行
  - V8引擎在使用非增量标记的情况下，达到全部内存1.5G，释放也才1秒中，再标记增量把时间打碎的情况下，分段时间更短，用户体验更好。
