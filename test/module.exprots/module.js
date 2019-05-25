// 来自阮一峰老师的浏览器实现CommonJS

// var Module = {
//   exports: {}
// };
// (function (Module, Exports) {
//   Exports.multiply = function (n) { return n * 1000 };
// })(Module, Module.exports);

function Require(url) {
  var path = Require.resolve(url); // 处理传进来的url 绝对路径/相对路径/还是文件夹名字
  var mod = Require.modules[path]; // 根据处理过的url 从modules中取得模块内容
  if (!mod) throw new Error('failed to Require "' + url + '"'); // 如果没取到则报错
  if (!mod.exports) { // 如果取到的模块上没有exports属性
    mod.exports = {}; // 声明并初始化exports
    mod.call(mod.exports, mod);
  }
  return mod.exports;
}
Require.modules = {};

Require.resolve = function (path) {
  var orig = path; // "./foo.js"
  var reg = path + '.js'; // "./foo.js.js"
  var index = path + '/index.js'; // "./foo.js/index.js"
  return Require.modules[reg] && reg
    || Require.modules[index] && index
    || orig;
};

Require.register = function (path, fn){
  Require.modules[path] = fn;
};

Require.relative = function (parent) {
  return function(p){
    if ('.' != p.charAt(0)) return Require(p); // 如果处理后的url第一个字符不是"."
    var path = parent.split('/');
    var segs = p.split('/');
    path.pop();

    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if ('..' == seg) path.pop();
      else if ('.' != seg) path.push(seg);
    }
    return Require(path.join('/'));
  };
};
