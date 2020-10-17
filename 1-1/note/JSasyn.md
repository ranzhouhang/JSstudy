### 一 JavaScript异步编程
内容概述：
1. 同步模式与异步模式
2. 事件循环与消息队列
3. 异步编程的几种方式
4. Promise异步方案，宏任务和微任务
5. Generator方案，async和await语法糖
- 同步模式(Synchronous)

  后一个任务要等到前一个任务执行完之后才能执行，和代码的编写顺序一致。即排队执行，所以是栈执行。只有下图中的调用栈call stack
    ```
    console.log("global begin")
    //第一行代码，执行到这里时，压入调用栈，控制台输出global begin，离开调用栈，执行第二行代码
    function bar(){
        console.log("bar task")
    }
    //接下来是函数的声明，声明是不会进入调用栈，所以继续往下
    function foo(){
        console.log("foo task")
        bar()
    }
    //又是函数的声明，声明是不会进入调用栈，所以继续往下
    foo()
    //这一行是一个foo函数的调用，调用就要压入调用栈。
    //同时把console.log("foo task")继续压入调用栈，在foo函数的上面，因为栈是先进后出的原则
    
    //console.log输出后，离开调用栈。然后调用bar函数，这是后调用栈就有foo函数，bar函数
    
    //其中foo函数在栈底，bar函数在foo函数上面，然后console.log("bar task")继续进入调用栈
    
    //现在调用栈有三个，从下往上是foo，bar，console.log("bar task").
    //最后console.log("bar task")输出，离开调用栈，然后bar函数弹出，foo函数弹出

    console.log("global end")
    //最后执行这个，调用栈，工作表就清空了
    ```
  
  **问题**：如果其中有一项执行时间过长，会延迟了后面的执行，形成阻塞。对用户而言即是界面出现卡顿，或者卡死。

- 异步模式(Asynchronous)

    不会等待这个任务的结束才开启下一个任务，耗时任务开启过后，立即执行下一个任务。耗时任务的后续逻辑一般通过回调函数的方式去定义。

    **问题**：代码执行的顺序比较跳跃。

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="345px" viewBox="-0.5 -0.5 345 231" content="&lt;mxfile host=&quot;906a0c16-8f04-470d-8d8f-44d72bb713db&quot; modified=&quot;2020-10-07T05:43:33.877Z&quot; agent=&quot;5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.49.2 Chrome/83.0.4103.122 Electron/9.2.1 Safari/537.36&quot; etag=&quot;zqO4vamdfNbuuebndS8F&quot; version=&quot;13.1.3&quot;&gt;&lt;diagram id=&quot;6hGFLwfOUW9BJ-s0fimq&quot; name=&quot;Page-1&quot;&gt;&lt;mxGraphModel dx=&quot;634&quot; dy=&quot;680&quot; grid=&quot;1&quot; gridSize=&quot;10&quot; guides=&quot;1&quot; tooltips=&quot;1&quot; connect=&quot;1&quot; arrows=&quot;1&quot; fold=&quot;1&quot; page=&quot;1&quot; pageScale=&quot;1&quot; pageWidth=&quot;827&quot; pageHeight=&quot;1169&quot; math=&quot;0&quot; shadow=&quot;0&quot;&gt;&lt;root&gt;&lt;mxCell id=&quot;0&quot;/&gt;&lt;mxCell id=&quot;1&quot; parent=&quot;0&quot;/&gt;&lt;mxCell id=&quot;2&quot; value=&quot;call stack调用栈&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;130&quot; y=&quot;180&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;3&quot; value=&quot;web APIs&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;354&quot; y=&quot;180&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;4&quot; value=&quot;Event loop(Queue)消息队列&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;210&quot; y=&quot;330&quot; width=&quot;186&quot; height=&quot;80&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;5&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;entryX=0.5;entryY=1;entryDx=0;entryDy=0;exitX=0.5;exitY=0;exitDx=0;exitDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;4&quot; target=&quot;2&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;210&quot; y=&quot;330&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;260&quot; y=&quot;280&quot; as=&quot;targetPoint&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;6&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;3&quot; target=&quot;4&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;270&quot; y=&quot;350&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;320&quot; y=&quot;300&quot; as=&quot;targetPoint&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://app.diagrams.net/?client=1&amp;lightbox=1&amp;edit=_blank');}}})(this);" style="cursor:pointer;max-width:100%;max-height:231px;"><defs/><g><rect x="0" y="0" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">call stack调用栈</div></div></div></foreignObject><text x="60" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">call stack调用栈</text></switch></g><rect x="224" y="0" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 225px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">web APIs</div></div></div></foreignObject><text x="284" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">web APIs</text></switch></g><rect x="80" y="150" width="186" height="80" rx="12" ry="12" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 184px; height: 1px; padding-top: 190px; margin-left: 81px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; ">Event loop(Queue)消息队列</div></div></div></foreignObject><text x="173" y="194" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Event loop(Queue)消息队列</text></switch></g><path d="M 173 150 L 64.98 63.97" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 60.87 60.7 L 68.53 62.32 L 64.98 63.97 L 64.17 67.8 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><path d="M 284 60 L 177.95 145.99" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 173.87 149.3 L 177.1 142.17 L 177.95 145.99 L 181.51 147.61 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://desk.draw.io/support/solutions/articles/16000042487" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Viewer does not support full SVG 1.1</text></a></switch></svg>

    调用栈可以看作是JS立即执行的事件表，如果调用栈执行完毕，再从事件循环，消息队列中，找到待办的事件表（回调函数），重新压入调用栈中，继续执行。而web APIs中则是执行异步的倒计时操作。
    - 举个例子
    ``` 
    console.log("global begin")
    //进入call stack调用栈，输出global begin后，弹出调用栈
    setTimeout(function timer1(){
        console.log("time1 invoke")
    },1800)
    //执行setTimeout函数，进入调用栈
    //倒计时回调函数放入web APIs中，在web APIs中进行倒计时1.8s
    //完成后弹出调用栈
    setTimeout(function timer2(){
        console.log("time2 invoke")
        setTimeout(function inner(){
            console.log("inner invoke")
        },1000)
    },1000)
    //setTimeout先进入栈，开始timer2的定时器，在web APIs中倒计时
    //setTimeout弹出栈
    console.log("global end")
    //入栈，打印global end，弹出栈

    //这时候调用栈中就没有任务了，这个时候event loop就发挥作用了
    //event loop只做一件事情，就是监听调用栈和消息队列，当调用栈中所有任务都结束了
    //event loop就从消息队列中取出第一个回调函数，放入调用栈中执行
    //不过此时消息队列中也是空的，所以就什么都不执行

    //这时候可以回头看看之前的两个倒计时回调函数，放在web APIs中，其中timer1是1.8s
    //timer2是1s，所以timer2先执行完毕，进入消息队列中的第一位，timer1执行完后
    //就会放入消息队列的第二位

    //event loop会监听消息队列的变化，此时就会把消息队列的第一个，放入到call stack中，去执行timer2
    //这时候就会打印time2 invoke
    //这时候又遇到了相同情况的异步调用，settimeout入栈，执行倒计时回调函数inner
    //settimeou出栈，inner进入web APIs开始倒计时，time2这时候也执行完毕，出栈

    //timer1入栈，打印，出栈
    //inner倒计时结束，进入消息队列
    ```
    如果把调用栈理解成一个正在执行的事件表，那么消息队列就是一个待办的事件表

    js引擎先把调用栈中所有任务先执行完，在从消息队列中取出任务，进入调用栈，开始执行

    JavaScript是单线程的，但是浏览器不是单线程的。

    这里的同步异步指的是运行环境提供的API是以同步还是异步的模式工作

    ### 二 回调函数
    回调函数是所有异步编程方案的根基，回调函数是指一件想要做的事，但不知道什么时候能去做，于是就把这件事的方法或步骤写下来，交给事件的执行者，它知道什么时候结束，什么时候开始执行。简单来说，就是由调用者定义，执行者执行的函数，就是回调函数。

    常见的异步方式：传递回调函数，事件机制，发布订阅

    ### 三 Promise
    为了防止异步调用中出现的无限回调嵌套的问题，提出了promise方案，本质是一个对象，用来表示异步任务执行结束后，是成功还是失败。
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="601px" viewBox="-0.5 -0.5 601 221" content="&lt;mxfile host=&quot;906a0c16-8f04-470d-8d8f-44d72bb713db&quot; modified=&quot;2020-10-07T06:05:53.329Z&quot; agent=&quot;5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.49.2 Chrome/83.0.4103.122 Electron/9.2.1 Safari/537.36&quot; etag=&quot;Pycu5ikXXYl-pFwTPzMQ&quot; version=&quot;13.1.3&quot;&gt;&lt;diagram id=&quot;6hGFLwfOUW9BJ-s0fimq&quot; name=&quot;Page-1&quot;&gt;&lt;mxGraphModel dx=&quot;634&quot; dy=&quot;680&quot; grid=&quot;1&quot; gridSize=&quot;10&quot; guides=&quot;1&quot; tooltips=&quot;1&quot; connect=&quot;1&quot; arrows=&quot;1&quot; fold=&quot;1&quot; page=&quot;1&quot; pageScale=&quot;1&quot; pageWidth=&quot;827&quot; pageHeight=&quot;1169&quot; math=&quot;0&quot; shadow=&quot;0&quot;&gt;&lt;root&gt;&lt;mxCell id=&quot;0&quot;/&gt;&lt;mxCell id=&quot;1&quot; parent=&quot;0&quot;/&gt;&lt;mxCell id=&quot;7&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 19px&amp;quot;&amp;gt;promise&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;10&quot; y=&quot;260&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;8&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;Fulfilled&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;290&quot; y=&quot;170&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;9&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;Rejected&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;290&quot; y=&quot;330&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;10&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;onFulfilled&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;490&quot; y=&quot;170&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;11&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;onRejected&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;490&quot; y=&quot;330&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;14&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;onRejected&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;290&quot; y=&quot;330&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;16&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;onRejected&amp;lt;/font&amp;gt;&quot; style=&quot;rounded=1;whiteSpace=wrap;html=1;&quot; vertex=&quot;1&quot; parent=&quot;1&quot;&gt;&lt;mxGeometry x=&quot;490&quot; y=&quot;330&quot; width=&quot;120&quot; height=&quot;60&quot; as=&quot;geometry&quot;/&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;12&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;8&quot; target=&quot;10&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;420&quot; y=&quot;230&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;470&quot; y=&quot;180&quot; as=&quot;targetPoint&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;19&quot; value=&quot;&quot; style=&quot;endArrow=classic;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;14&quot; target=&quot;16&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;420&quot; y=&quot;390&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;470&quot; y=&quot;340&quot; as=&quot;targetPoint&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;23&quot; value=&quot;&quot; style=&quot;edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; target=&quot;8&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;160&quot; y=&quot;290&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;210&quot; y=&quot;240&quot; as=&quot;targetPoint&quot;/&gt;&lt;Array as=&quot;points&quot;&gt;&lt;mxPoint x=&quot;240&quot; y=&quot;250&quot;/&gt;&lt;/Array&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;24&quot; value=&quot;&quot; style=&quot;edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;&quot; edge=&quot;1&quot; parent=&quot;1&quot; source=&quot;7&quot; target=&quot;14&quot;&gt;&lt;mxGeometry width=&quot;50&quot; height=&quot;50&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;160&quot; y=&quot;290&quot; as=&quot;sourcePoint&quot;/&gt;&lt;mxPoint x=&quot;220&quot; y=&quot;350&quot; as=&quot;targetPoint&quot;/&gt;&lt;Array as=&quot;points&quot;&gt;&lt;mxPoint x=&quot;240&quot; y=&quot;340&quot;/&gt;&lt;/Array&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;mxCell id=&quot;25&quot; value=&quot;&amp;lt;font style=&amp;quot;font-size: 18px&amp;quot;&amp;gt;pending&amp;lt;/font&amp;gt;&quot; style=&quot;edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];&quot; vertex=&quot;1&quot; connectable=&quot;0&quot; parent=&quot;24&quot;&gt;&lt;mxGeometry x=&quot;-0.65&quot; y=&quot;-1&quot; relative=&quot;1&quot; as=&quot;geometry&quot;&gt;&lt;mxPoint x=&quot;10&quot; y=&quot;-21&quot; as=&quot;offset&quot;/&gt;&lt;/mxGeometry&gt;&lt;/mxCell&gt;&lt;/root&gt;&lt;/mxGraphModel&gt;&lt;/diagram&gt;&lt;/mxfile&gt;" onclick="(function(svg){var src=window.event.target||window.event.srcElement;while (src!=null&amp;&amp;src.nodeName.toLowerCase()!='a'){src=src.parentNode;}if(src==null){if(svg.wnd!=null&amp;&amp;!svg.wnd.closed){svg.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&amp;&amp;evt.source==svg.wnd){svg.wnd.postMessage(decodeURIComponent(svg.getAttribute('content')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);svg.wnd=window.open('https://app.diagrams.net/?client=1&amp;lightbox=1&amp;edit=_blank');}}})(this);" style="cursor:pointer;max-width:100%;max-height:221px;"><defs/><g><rect x="0" y="90" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 120px; margin-left: 1px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 19px">promise</font></div></div></div></foreignObject><text x="60" y="124" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">promise</text></switch></g><rect x="280" y="0" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 281px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">Fulfilled</font></div></div></div></foreignObject><text x="340" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Fulfilled</text></switch></g><rect x="280" y="160" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 190px; margin-left: 281px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">Rejected</font></div></div></div></foreignObject><text x="340" y="194" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">Rejected</text></switch></g><rect x="480" y="0" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 30px; margin-left: 481px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">onFulfilled</font></div></div></div></foreignObject><text x="540" y="34" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">onFulfilled</text></switch></g><rect x="480" y="160" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 190px; margin-left: 481px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">onRejected</font></div></div></div></foreignObject><text x="540" y="194" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">onRejected</text></switch></g><rect x="280" y="160" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 190px; margin-left: 281px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">onRejected</font></div></div></div></foreignObject><text x="340" y="194" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">onRejected</text></switch></g><rect x="480" y="160" width="120" height="60" rx="9" ry="9" fill="#ffffff" stroke="#000000" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 118px; height: 1px; padding-top: 190px; margin-left: 481px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 12px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; white-space: normal; word-wrap: normal; "><font style="font-size: 18px">onRejected</font></div></div></div></foreignObject><text x="540" y="194" fill="#000000" font-family="Helvetica" font-size="12px" text-anchor="middle">onRejected</text></switch></g><path d="M 400 30 L 473.63 30" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 478.88 30 L 471.88 33.5 L 473.63 30 L 471.88 26.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><path d="M 400 190 L 473.63 190" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 478.88 190 L 471.88 193.5 L 473.63 190 L 471.88 186.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><path d="M 150 120 L 220 120 Q 230 120 230 110 L 230 40 Q 230 30 240 30 L 273.63 30" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 278.88 30 L 271.88 33.5 L 273.63 30 L 271.88 26.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><path d="M 120 120 L 220 120 Q 230 120 230 130 L 230 180 Q 230 190 240 190 L 273.63 190" fill="none" stroke="#000000" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 278.88 190 L 271.88 193.5 L 273.63 190 L 271.88 186.5 Z" fill="#000000" stroke="#000000" stroke-miterlimit="10" pointer-events="all"/><g transform="translate(-0.5 -0.5)"><switch><foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"><div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: unsafe center; justify-content: unsafe center; width: 1px; height: 1px; padding-top: 101px; margin-left: 171px;"><div style="box-sizing: border-box; font-size: 0; text-align: center; "><div style="display: inline-block; font-size: 11px; font-family: Helvetica; color: #000000; line-height: 1.2; pointer-events: all; background-color: #ffffff; white-space: nowrap; "><font style="font-size: 18px">pending</font></div></div></div></foreignObject><text x="171" y="104" fill="#000000" font-family="Helvetica" font-size="11px" text-anchor="middle">pending</text></switch></g></g><switch><g requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"/><a transform="translate(0,-5)" xlink:href="https://desk.draw.io/support/solutions/articles/16000042487" target="_blank"><text text-anchor="middle" font-size="10px" x="50%" y="100%">Viewer does not support full SVG 1.1</text></a></switch></svg>

- Promise基本使用
  ```
  const Promise = new Promise(function(resolve,rejejct){
      //resolve(100)//成功
      reject(new Error('promise rejected'))//失败
  })
  Promise.then(function(value){
      console.log('resolve',value)
  },function(error){
      console.log('reject',error)
  })

  console.log('end')
  ```
  虽然promise中没有任何异步的操作，但是then依然要等到同步操作完之后才执行，所有end在最先打印
- Promise基本使用,Ajax
```
function ajax(url){
    return new Promise(function(resolve,reject){
        let xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

ajax('./api/user.json').then(function(res){
    console.log(res)
},function(error){
    console.log(error)
})
```
- Promise链式调用
```
let promise = ajax('api/user.json')
promise.then(function onFulfilled(value){
    console.log('onFulfilled',value)
},function onRejected(error){
    console.log('onReject',error)
}).then(function(value){
    console.log(vale)
}).then(function(value){
    console.log(vale)
}).then(function(value){
    console.log(vale)
}).then(function(value){
    console.log(vale)
}).then(function(value){
    console.log(vale)
})
```
    - Promise的then方法会返回一个全新的Promise对象
    - 后面的then方法就是为上一个then方法返回Promise注册回调
    - 前面then方法中回调函数的返回值会作为后面then方法回调的参数
    - 后面的then会等待前面的Promise结束，再注册回调
- Promise 异常处理
1. 利用then的第二个参数
```
ajax('./api/user.json').then(function(res){
    console.log(res)
},function(error){
    console.log(error)
})
```
2. catch
```
ajax('./api/user.json').then(function(res){
    console.log(res)
})//=>Promise {}
.catch(function(error){
    console.log(error)
})
```
3. unhandledrejection
```
window.addEventListener('unhandledRejection',event=>{
    const {reason,promise} = event
    console.log(reason,promise)
    //reason,Promise失败的原因，一般是一个错误对象
    //promise，出现异常的promise对象
    event.preventDefault()
},false)
```
   -  尽量在代码中明确的捕获错误
   -  catch可以链式的捕获错误，包括前面promise产生的错误
   -  then的第二个参数只能捕获当前promise产生的错误，无法捕获之前promise产生的错误

- Promise的静态方法
    - resolve
    ```

    //1.传递字符串的时候，下面两个方法等价
    Promise.resolve("foo").then(function(value){
        console.log(value)
    })
    new  Promise(function(resolve,reject){
        resolve("foo")
    })

    //2.传递promise的时候

    let promise = ajax('api/users.json')
    let promise2 = Promise.resovle(promise)
    console.log(promise === promise2)//true

    //传递带有then方法的对象

    Promise.resolve({
        then:function(onFulfilled,onRejected){
            onFulfilled("foo")
        }
    }).then(function(value){
         console.log(value)
    })
    //reject方法,快速创建一定失败的promise
    Promise.reject(new Error('rejected')).catch(function(error){
        console.log(error)
    })  
    ```
- Promise并行执行

同步执行多个promise的方式
```
//promise.all()只有所有的任务都完成了，才结束
//promise.race()只要有一个完成了，就结束
let promise = Promise.all([
    ajax('api/users.json')
    ajax('api/users.json')
])

promise.then(function(value){
    console.log(value)//[value1,value2]
}).catch(function(error){
    console.log(error)//只要有一个任务失败，就返回失败
})

//ajax请求的超时控制
const request = ajax('api/users.json')
const promise = new Promise((resolve,reject)=>{
    setTimeout(()=>reject(new Error('timeout')),500)
})
Promise.race([
    request,
    promise
]).then((value)=>{
    console.log(value)
}).catch(error=>{
    console.log(error)
})
//利用chrome中的network控制网速，达成超过500毫秒，返回错误
```
- Promise的异步执行顺序
Promise是微任务，mutationObserver，node中的processnextTick都是微任务
settimeout是宏任务
- Generator函数的基本使用
```

function *foo(){
    console.log('start')

    yield 'foo'
}
const generator = foo()//不会立即执行，只是得到生成器对象
//generator.next()//调用next方法才执行
const resutl = generator.next()
console.log(result)
//{value:'foo',done:false}//done表示执行完毕

//可以用yield来接受参数
function *foo2(){
    const res = yield 'foo'
    console.log(res)//param
}
const generator2 = foo2()
generator2.next('param')

//可以抛出错误，用try catch捕获
function *foo3(){
    try{
         const res = yield 'foo'
         console.log(res)//param
    }catch(error){
        console.log(error)//捕获错误
    }
}
const generator3 = foo3()
generator3.throw(new Error('Generator error'))//抛出一个异常
```
- Generator异步方案
```
function co(generator){
    const g= generator()
    function handleResult(reuslt){
        if(result.done)return
        result.value.then(data=>{
            handleResult(g.next(data))
        },error=>{
            g.throw(error)
        })
    }
    handleResult(g.next())
}

function *main(){
    try{
        const users = yield ajax('api/user.json')
        console.log(users)
        const post = yield ajax('api/user.json')
        console.log(post)
        const usl = yield ajax('api/user.json')
        console.log(usl)
    }catch(error){
        console.log(error)
    }
}

co(main)
```
- Async/Await函数

跟上面的代码相比,把yield改成await，函数名前面加一个async就可以来
```
async function main(){
    try{
        const users = await ajax('api/user.json')
        console.log(users)
        const post = await ajax('api/user.json')
        console.log(post)
        const usl = await ajax('api/user.json')
        console.log(usl)
    }catch(error){
        console.log(error)
    }
}
```


   


   
    



