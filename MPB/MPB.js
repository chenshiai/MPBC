/**
 * SAOMDPB项目用对象字面量API  
 * 作者：丨ConGreat  
 * 起始时间：2019-04-23  
 * 最后修改时间：2019-06-03
 */
const MPB = {
  "Object": {
    ajax: null,
    scrollTop: 0
  },
  "error": function (msg) {
    throw new Error(msg);
  },
  "HTTP": function (bool) {
      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    return xhr;
  },
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
    this.close = function () {
      clearTimeout(_timer);
      _asyncArr = [];
      return true;
    }
  },
  "Queue": function () {
    this.queue = [];
    this.enqueue = function (data) {
      return this.queue.push(data);
    }
    this.dequeue = function (data) {
      return this.queue.shift(data);
    }
    this.front = function () {
      return this.queue[0];
    }
    this.back = function () {
      return this.queue[this.queue.length - 1];
    }
    this.toString = function () {
      var retStr = "";
      for (var i = 0; i < this.queue.length; ++i) {
        retStr += this.queue[i] + " "
      }
      return retStr;
    }
    this.isEmpty = function () {
      if (this.queue.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    this.count = function () {
      return this.queue.length;
    }
  },
  "debounce": function (
    abort = MPB.error('使用debounce，至少传入一个方法'),
    time = 100,
    options = { leading: true, trailing: true, context: null }) {
    var timer = null;
    var process = function (...args) {
      if (timer) { clearTimeout(timer) }
      if (options.leading && !timer) {
        timer = setTimeout(null, time);
        abort.apply(options.context, args)
      } else if (options.trailing) {
        timer = setTimeout(() => {
          abort.apply(options.context, args);
          timer = null;
        }, time)
      }
    }
    process.cancel = function () {
      clearTimeout(timer);
      timer = null;
    }
    return process;
  },
  "throttle": function (func, wait = 50) {
    var timer = null
    var throttle = function (...args) {
      if (!timer) {
        func.apply(this, args)
        timer = setTimeout(function () {
          clearTimeout(timer)
          timer = null
        }, wait)
      }
    }
    throttle.cancel = function () {
      clearTimeout(timer)
      timer = null
    }
    return throttle
  },
  "isJSON": function (str) {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        } else {
          return false;
        }

      } catch (e) {
        console.log('error：' + str + '!!!' + e);
        return false;
      }
    }
    console.log('It is not a string!')
  },
  "ajax": function ({
    method = "get",
    url = MPB.error('地址都不给人家！'),
    data = null,
    contentType = "application/x-www-form-urlencoded",
    dataType = "json",// 约定数据格式
    async = true,
    cache = true,
    timeout = 10000,
    beforeSend = function () { },
    success = MPB.error('给我一个成功回调函数嘛！'),
    error = function(){
      MPB.error("服务器返回错误！");
    },
    complete = function () { }
  }) {
    var xhr = MPB.HTTP();

    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-type", contentType);
    if (contentType === 'application/json') {
      var data = JSON.stringify(data);
      MPB.isJSON(data) ? true : MPB.error('数据传输格式错误！');
    }
    beforeSend();
    xhr.send(data);
    var timer = setTimeout(function () {
      xhr.abort();
      error();
    }, timeout)

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        clearTimeout(timer);
        var responseText = xhr.responseText;
        try {
          var res = JSON.parse(responseText);
        } catch {
          var res = responseText;
        }
        if (res) {
          success(res);
        } else {
          error();
        }
        complete(res);
      }
    }
  },
  "request": function ({
    url,
    needSubDomain = false, // 是否有子域名 这是一个知识点 但没有实现
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
  "Taglazyload": function (data, every, complete) {
    var _data = [...data],
      _callback = every,
      _complete = complete || function () { };
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
    this.getData = function () {
      return data;
    }
    this.callback = function () {
      _callback();
    }
  },
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
    if (async) {
      var loaded = 0;
      for (var i = 0; i < len; i++) {
        s[i] = createNode(type);
        s[i].onload = s[i].onreadystatechange = function () {
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
        s[i].onload = s[i].onreadystatechange = function () {
          if (!0 || this.readyState === "loaded" || this.readyState === "complete") {
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
            if (i != (len - 1)) {
              recursiveLoad(i + 1);
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
  "binarySearch": function (arr, data) {
    let min = 0, max = arr.length - 1, mid;
    while (min <= max) {
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
  "getClientHeight": function () {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
      clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  "getClientWidth": function () {
    var clienWidth = 0;
    if (document.body.clientWidth && document.documentElement.clientWidth) {
      clienWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    } else {
      clienWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
    }
    return clienWidth;
  },
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
  "windowScroll": function (trigger) {
    window.addEventListener('scroll', trigger);
  }
}
