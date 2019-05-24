function toString(queue) {
  var retStr = "";
  for (var i = 0; i < queue.length; ++i) {
    if(typeof queue[i] ==="function") queue[i]();
    retStr += queue[i] + " "
  }
  return retStr;
}
console.log(toString([1,{a:1,b:2},3,function(){console.log("这是一个函数")}]));