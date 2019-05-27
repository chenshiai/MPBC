# MPB.js
>MPB是我自己写的一些API，主要用于实现这个项目里的一些功能。目前功能还不多，暂时先放在在这里。
- **Object**:  
如果多次调用重复的东西，对性能还是会有点影响的！所以，当第一次调用的时候创建一个实例存在这里。之后再次调用就直接用实例啦！
```
  {
    xhr: null,
    ajax: null,
    scrollTop: 0
  }
```
- **XMLHttpRequest**:  
发送请求都需要用到的句柄生成方法，使用后可以获得一个XMLHttpRequest对象，并且该对象会被存储在当前页的Object.xhr中。  
像这样使用就可以给你一个XMLHttpRequest对象，已经兼容。  
`var xhr = MPB.XMLHttpRequest()`

- **Timer(function,[,time])**:  
  *这是我写的第一个构造函数，创建一个计时器队列。可以用来做防抖...嗯就是这样。现在有专门做防抖的Processor*  
  当一个方法重复执行时，用队列来进行延时执行。  

  参数|描述|默认值
  --|:--:|--:
  function|重复执行的方法|null
  time|可选，延迟调用的时间|0毫秒

  方法|描述|返回值
  --|:--:|--:
  open(bool)|将方法插入队列，取出延时执行。参数`bool`为布尔值,默认false，true则不进入队列直接调用延时执行|无
  close()|清空所有未调用的方法|无  

  例子：  
  ```
  var T = new MPB.Timer(()=>{
    console.log('test');
  },1000);
  T.open();
  T.open();
  // 等待1s后 => 'test'
  // 等待1s后 => 'test'

  T.open();
  T.open(true);
  // 等待1s后 => 'test'\n'test'
  
  T.open();
  T.close();
  T.open();
  // 等待1s后 => 'test'
  ```

- **Queue() **:  
  *创建一个队列对象*
  方法|描述|返回值
  --|:--:|--:
  enqueue(data)|入队列|