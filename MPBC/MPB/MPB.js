/**
 * SAOMDPB项目用对象字面量API  
 * 作者：丨ConGreat  
 * 起始时间：2019-04-23  
 * 最后修改时间：2019-05-23
 */
const MPB = {
  /**
   * 如果多次调用重复的东西，对性能还是会有点影响的！  
   * 所以，当第一次调用的时候创建一个实例存在这里。  
   * 之后再次调用就直接用实例啦！
   */
  "Object": {
    xhr: null,
    ajax: null,
    scrollTop: 0
  },
  "error": function (msg) {
    throw new Error(msg);
  },
  /**
   * 只需一次调用就可获得兼容的XMLHttpRequest对象~
   */
  "HTTP": function (bool) {
    if (MPB.Object.xhr === null) {
      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      MPB.Object.xhr = xhr;
    }
    return MPB.Object.xhr;
  },
  /**
   * 创建一个计时器队列对象。可以用来做防抖,但不是为了防抖而做的。
   * @function open(bool) 调用一次该计时器，参数bool默认false，所有计时器同步执行，
   * true则进行一次异步调用。
   * @function close() 直接关闭该对象上的所有计时器。
   * @param {function} abort_u 倒计时结束时调用的函数。
   * @param {number} time_u 倒计时时长,默认为0(毫秒)。
   */
  "Timer": function (abort_u, time_u) {
    var _abort = abort_u,
      _time = time_u,
      _async = false,
      _timer = null,
      _asyncArr = [];
    function out() {
      if (_asyncArr.length > 0) {
        _timer = setTimeout(() => {
          _asyncArr.shift()();
          out();
        }, _time);
      }
    }
    this.getData = function () {
      return {
        abort: _abort,
        time: _time,
        async: _async,
        timer: _timer,
        asyncArr: _asyncArr
      }
    }
    if (typeof _abort != "function") {
      MPB.error("计时器对象Timer(function, number)中的function参数类型错误！");
    }
    if (typeof _time != "number") {
      MPB.error("计时器对象Timer(function, number)中的number参数类型错误！");
    }

    /**
     * 向该计时器队列中新增一次调用
     */
    this.open = function (bool) {
      var openAsync = bool || _async;
      if (openAsync) {
        _timer = setTimeout(_abort, _time);
        return true;
      } else {
        _asyncArr.push(_abort);
      }
      if (_asyncArr.length == 1) {
        out();
      }
      return openAsync;
    }
    /**
     * 清空该计时器队列，同时将上一次异步调用取消
     */
    this.close = function () {
      clearTimeout(_timer);
      _asyncArr = [];
      return true;
    }
  },
  /**
   * 创建一个队列对象。
   * @function enqueue(data) 入队列
   * @function dequeue(data) 出队列
   * @function front() 获取队列第一个
   * @function back() 获取队列最后一个
   * @function toString() 打印队列
   * @function isEmpty() 判断队列是否为空
   * @function count() 返回队列中元素的个数
   */
  "Queue": function () {
    this.queue = [];//队列

    //入队列
    this.enqueue = function (data) {
      return this.queue.push(data);
    }
    //出队列
    this.dequeue = function (data) {
      return this.queue.shift(data);
    }
    //获取队列第一个
    this.front = function () {
      return this.queue[0];
    }
    //获取队列最后一个
    this.back = function () {
      return this.queue[this.queue.length - 1];
    }
    //打印队列
    this.toString = function () {
      var retStr = "";
      for (var i = 0; i < this.queue.length; ++i) {
        retStr += this.queue[i] + " "
      }
      return retStr;
    }
    //判断队列是否为空
    this.isEmpty = function () {
      if (this.queue.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    //返回队列中元素的个数
    this.count = function () {
      return this.queue.length;
    }
  },
  /**
   * 防抖处理，用着方法包住想要防抖的方法
   * @param {function} abort 需要调用的函数 
   * @param {number} time 设置抖动时间
   */
  "Processor": function (abort, time) {
    this.timeoutId = null; // 相当于延时setTimeout的一个标记，方便清除的时候使用
    this.time = time || 100;
    this.abort = abort || function () { };
    let self = this;

    // 初始处理调用的方法
    // 在实际需要触发的代码外面包一层延时clearTimeout方法，以便控制连续触发带来的无用调用
    this.process = function () {
      clearTimeout(self.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      self.timeoutId = setTimeout(function () {
        self.abort();
      }, self.time) // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    }
  },
  /**
   * ajax请求方法，服务器返回的要是json！
   * @param {string} method 请求方式，默认GET （可选）。
   * @param {string} url 请求的地址 （必须）。
   * @param {string} data 发送的数据，默认null。
   * @param {boolean} async 是否异步，默认true。
   * @param {function} beforeSend 发送请求前调用函数 （可选）。
   * @param {function} success 成功回调函数 （必须）。
   * @param {function} error 失败回调函数（可选）。
   * @param {string} contentType 发送数据到服务器时所使用的内容类型 （可选）。
   * @param {number} timeout 设置本地的请求超时时间，默认60秒（可选）。
   * @param {function} complete 请求完毕回调函数（可选）。
   */
  "ajax": function ({
    method = "get",
    url = MPB.error('地址都不给人家！'),
    data = null,
    contentType = "application/x-www-form-urlencoded",
    dataType = "",// 尚未实现.....
    async = true,
    cache = true,
    timeout = 60000,
    beforeSend = function () { },
    success = MPB.error('给我一个成功回调函数嘛！'),
    error = MPB.error("服务器返回错误！"),
    complete = function () { },
    timeoutTodo = function () { }
  }) {
    if (typeof url === "function") {
      url();
    }
    var xhr = MPB.HTTP();
    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-type", contentType);
    beforeSend();
    xhr.send(data);
    var timer = setTimeout(function () {
      xhr.abort();
      timeoutTodo();
    }, timeout)//设置计时器

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        clearTimeout(timer);// 规定时间内完成响应，关闭计时器
        var responseText = xhr.responseText;//返回结果
        var res = JSON.parse(responseText);//回调函数
        /**
         * 返回结果模板
         * res:{
         *  status:number,
         *  datas:{
         *    ...你的数据
         *  }
         * }
         */
        if (res.status > 0) {
          success(res.datas);
        } else {
          error(res.datas);
        }
        complete();
      }
    }
  },
  /**
   * 封装MPB.ajax请求方法，用来做简单的API
   */
  "request": function ({
    url,
    needSubDomain = false,
    method = 'get',
    data = null,
    success = function () { },
    error = function () { }
  }) {
    return new Promise((resolve, reject) => {
      MPB.ajax({
        url: url,
        method: method,
        data: data,
        success: function (res) { success(res); resolve(res) },
        error: function (res) { error(res); reject(res) }
      })
    })
  },
  /**
   * 标签懒加载,将需要添加入html的标签分批加载。
   * @param {array} data json对象数组。
   * @param {function} every 数据处理方法
   * @param {function} complete 所有数据处理完后执行的方法（可选）
   */
  "Taglazyload": function (data, every, complete) {
    var _data = [...data],
      _callback = every,
      _complete = complete || function () { };

    /**
     * Taglazyload对象上的方法。
     * @param {number} num 设置每批多少数据。
     */
    this.lazyload = function (num) {
      if (_data.length < num && _data.length > 0) {
        num = _data.length;
      }
      for (let i = num; i-- && _data.length > 0;) {
        _callback(_data.shift());
      }
      if (_data.length === 0) {
        _complete();
      }
    }
    /**
     * 查看当前-标签懒加载-对象的data。
     */
    this.getData = function () {
      return data;
    }
    /**
     * 直接调用一次回调函数。
     */
    this.callback = function () {
      _callback();
    }
  },
  /**
   * 加载外部文件
   * @param {array} urls 地址数组（必须）。
   * @param {string} type 添加的标签名字，默认'script'。
   * @param {string} tagname 需要加载哪个标签中，可选id和class，默认'head'。
   * @param {function} callback 回调函数（可选）。
   * @param {boolean} async 是否异步加载，默认true。
   */
  "load": function ({
    urls = MPB.error('必须传入一个存地址的数组才行哦！'),
    type = "script",
    tagname = "head",
    callback = function () { },
    async = true
  }) {
    if (typeof urls === "function") {
      urls();
    }
    /**
     * 根据type来设置其专有属性
     */
    function createNode(type) {
      var tag = document.createElement(type);
      switch (type) {
        case "script": { tag.setAttribute("type", "text/javascript"); break; }
        case "img": { tag.setAttribute("alt", "image"); break; }
        default: break;
      }
      return tag;
    }
    var HEAD = document.querySelector(tagname) || document.documentElement;
    var s = [], len = urls.length;

    //加载
    if (async) {
      var loaded = 0;
      for (var i = 0; i < len; i++) {
        s[i] = createNode(type);
        s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
          if (!0 || this.readyState === "loaded" || this.readyState === "complete") {
            loaded++;
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
            if (loaded === len) callback();
          }
        }
        s[i].setAttribute("src", urls[i]);
        HEAD.appendChild(s[i]);
      }
    } else {
      var recursiveLoad = function (i) {
        s[i] = createNode(type);
        s[i].setAttribute("src", urls[i]);
        s[i].onload = s[i].onreadystatechange = function () { //兼容浏览器
          if (!0 || this.readyState === "loaded" || this.readyState === "complete") {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);//下载完后，从html文档中移除
            if (i != (len - 1)) {
              recursiveLoad(i + 1);//递归
            } else {
              callback();
            }
          }
        }
        HEAD.appendChild(s[i]);
      };
      recursiveLoad(0);
    }
  },
  /**
   * 窗口滚动触发器(防抖版)
   * @param {number} scrollTop 滚动触发条件。
   * @param {function} afterFunc 设置触发后调用。
   * @param {function} beforeFunc 设置触发前调用。
   */
  "ScrollTrigger": function (scrollTop, afterFunc, beforeFunc) {
    var _scrollTop = scrollTop,
      _after = afterFunc || function () { },
      _before = beforeFunc || function () { };

    this.getData = function () {
      return {
        after: _after,
        before: _before
      }
    }
    function _trigger() {
      if (Scroll.getScrollTop() >= _scrollTop) {
        _after();
      } else {
        _before();
      }
    }
    Scroll.windowScroll(new MPB.Processor(_trigger, 100).process);
  },
  /**
   * 来自张鑫旭老师的缓动小算法
   * 从起始值接近目标值的算法。每当浏览器重绘页面时调用callback
   * @param {number} A 起始值
   * @param {number} B 目标值
   * @param {number} rate 缓动速率，越小越快
   * @param {function} callback 是变化的位置回调，支持两个参数，value和isEnding，表示当前的位置值（数值）以及是否动画结束了（布尔值）；
   */
  "easeout": function (A, B, rate, callback) {
    if (A == B || typeof A != 'number') {
      return;
    }
    B = B || 0;
    rate = rate || 2;
    var step = function () {
      callback(A, false);
      A = A + (B - A) / rate;
      if (A < 1) {
        callback(B, true);
        return;
      }
      requestAnimationFrame(step);
    };
    step();
  },
  //加一个循环生成标签功能
  //加一个上下出现的菜单组件
  "setCookie": function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  },
  "getCookie": function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
  },
  /**
   * 分页器
   * @param {Array} arr 需要分页的数据
   * @param {number} size 数量
   * @param {boolean} pages 默认false 每页多少，true 固定多少页
   */
  "paging": function (arr, size, pages) {
    if (pages) {
      let length = arr.length / size;
      return Array.from({
        length: size
      }, (v, i) => arr.slice(i * length, i * length + length))
    } else {
      return Array.from({
        length: Math.ceil(arr.length / size)
      }, (v, i) => arr.slice(i * size, i * size + size))
    }
  },
  /**
   * 二分查找（仅限有序数组）返回下标  
   * 项目组暂未使用，当作笔记记录以下
   * @param {Array} arr 
   * @param {any} data 
   */
  "binarySearch": function (arr, data) {
    let min = 0, max = arr.length - 1, mid;
    while (min <= max) {
      // mid = parseInt((min + max) / 2);
      // mid = min + parseInt((max - min) / 2);
      mid = min + ((max - min) >> 1);
      if (arr[mid] > data) {
        max = mid - 1;
      } else if (arr[mid] < data) {
        min = mid + 1;
      } else {
        return mid
      }
    }
    return -1;
  }
}
const Scroll = {
  "ToTop": function () {
    var currentScroll = Scroll.getScrollTop();
    if (currentScroll > 0) {
      window.requestAnimationFrame(Scroll.ToTop);
      window.scrollTo(0, currentScroll - (currentScroll / 10));
    }
  },
  /**
   * 取窗口可视范围的高度
   */
  "getClientHeight": function () {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
      clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  /**
   * 取窗口可视范围的宽度
   */
  "getClientWidth": function () {
    var clienWidth = 0;
    if (document.body.clientWidth && document.documentElement.clientWidth) {
      clienWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    } else {
      clienWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    }
    return clienWidth;
  },
  /**
   * 取窗口滚动条高度
   */
  "getScrollTop": function () {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  "getScrollHeight": function () {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  "getWindowHeight": function () {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  /**
   * 绑定窗口滚动事件
   * @param {function} trigger 需要绑定的事件
   */
  "windowScroll": function (trigger) {
    window.addEventListener('scroll', trigger);
  }
}
