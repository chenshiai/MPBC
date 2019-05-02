function MPBpopup(theNode, json) {
  var _node = document.querySelector(theNode);
  var _content = {
    title: "Message",
    text: "Nothing in here",
    okFunc: () => { },
    noFunc: () => { this.hiddenPopup() },
    oneKey:false
  }
  _setData(json);
  // 若输入的节点class或id不存在，抛出异常
  if (!_node) {
    throw new Error('目标选取错误：' + theNode + '该元素不存在！');
  }

  // 初始化设置
  var _frame = _node.getElementsByClassName('saopopup-frame')[0];
  _node.classList.add('saopopup-close');
  _node.getElementsByClassName('saopopup-button-no')[0].onclick = function () {
    _content.noFunc();
  }
  _node.getElementsByClassName('saopopup-button-ok')[0].onclick = function () {
    _content.okFunc();
  }

  // 设置对象属性，用于数据合法性判断
  function _setData(json) {
    if (json) {
      if (json.title) _content.title = json.title;
      if (json.text) _content.text = json.text;
      if (json.okFunc) _content.okFunc = json.okFunc;
      if (json.noFunc) _content.noFunc = json.noFunc;
      if (json.oneKey) _content.oneKey = json.oneKey;
    } else {
      return;
    }
  }

  // 获取弹窗的高度，用于过渡效果
  function _getPopupHeight() {
    return _frame.offsetHeight;
  }

  // 设置弹窗的标题以及内容
  function _setContent() {
    _node.getElementsByClassName('saopopup-title')[0].innerHTML = _content.title;
    _node.getElementsByClassName('saopopup-text')[0].innerHTML = _content.text;
  }
  function setCallback(json) {
    _content = json || _content;

  }

  // 外部可调用方法：打开弹窗，输入json设置弹窗内容
  this.showPopup = function (json) {
    _setData(json)//不输入则使用默认或上一次输入的值
    _node.classList.remove('saopopup-close');
    _node.classList.add('saopopup-open');
    if(_content.oneKey){
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
    }else{
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'block';
    }
    _setContent();
    setTimeout(() => {
      _node.style.height = _getPopupHeight() + 'px';
    }, 300)
  }
  // 外部可调用方法：关闭弹窗
  this.hiddenPopup = function () {
    _node.classList.remove('saopopup-open');
    _node.style.height = '39px';
    setTimeout(() => {
      _node.classList.add('saopopup-close');
    }, 200)
  }
}