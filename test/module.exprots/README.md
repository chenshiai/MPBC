手撸 module 模块化
1. module.exports 导出模块的时候，将导出的内容添加到模块数组里
2. require 引入模块的时候，根据path从模块数组里取出内容

- 用函数柯里化实现导出不同类型的内容
  require(path)
  
* html里用script标签加载js脚本，都以及加载到浏览器里了，还有必要模块化吗？？？