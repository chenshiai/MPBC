// const add = require('./add');
add("Hi");
function foo(x) {
  console.log(x);
};
Require.register("foo.js", function(Module){
  Module.exports = foo;
});