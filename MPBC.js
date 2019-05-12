/**
 * 弹窗组件
 * @param {string} theNode 组件的class或id名 
 * @param {JSON} json 初始化属性 具体属性如下
 * @param  title string-弹窗标题
 * @param  text string-弹窗内容 用innerHTML插入弹窗
 * @param  okFunc function-点击“确定”调用方法
 * @param  noFunc function-点击“取消”调用方法 默认关闭弹窗
 * @param  showOk boolean-显示“确定”按钮
 * @param  showNo boolean-显示“取消”按钮
 * @param  oneKey boolean-只显示"确定"按钮 优先级高于showOk showNo
 * @param  width number-设置弹窗的宽度 默认300
 * @param  time number-设置自动关闭弹窗的时间，默认2000
 * @param  mode string-弹窗运行方式  
 * 确认/取消弹窗：confirm，自动关闭弹窗：auto，带有输入框的弹窗：prompt
 */
function MPBpopup(theNode, json) {
  var _node = document.querySelector(theNode);
  var _content = {
    title: "Message",
    text: "Nothing in here",
    mode:'confirm',
    okFunc: () => { },
    noFunc: () => { this.hiddenPopup() },

    showOk:true,
    showNo:true,

    oneKey: false,

    width: 300,
    time:2000,
    
  }
  let self = this;
  // 设置组件属性，用于数据合法性判断
  function _setData(json) {
    if (json) {
      if (json.title) _content.title = json.title;
      if (json.text) _content.text = json.text;
      if (json.mode) _content.mode = json.mode;
      if (json.okFunc) _content.okFunc = json.okFunc;
      if (json.noFunc) _content.noFunc = json.noFunc;
      if (!json.showOk) _content.showOk = json.showOk;
      if (!json.showNo) _content.showNo = json.showNo;
      if (json.oneKey) _content.oneKey = json.oneKey;
      if (json.width) _content.width = json.width;
    } else {
      return;
    }
  }
  _setData(json);
  // 若输入的节点class或id不存在，抛出异常
  if (!_node) {
    throw new Error('目标选取错误：' + theNode + '该元素不存在！');
  }

  // 组件初始化设置
  var _frame = _node.getElementsByClassName('saopopup-frame')[0];
  _node.classList.add('saopopup-close');
  _node.getElementsByClassName('saopopup-button-no')[0].onclick = function () {
    _content.noFunc();
  }
  _node.getElementsByClassName('saopopup-button-ok')[0].onclick = function () {
    _content.okFunc();
  }
  _node.style.width = '0px';

  

  // 获取弹窗的高度，用于过渡效果
  function _getPopupHeight() {
    return _frame.offsetHeight;
  }

  // 设置弹窗的标题以及内容
  function _setContent() {
    _node.getElementsByClassName('saopopup-title')[0].innerHTML = _content.title;
    _node.getElementsByClassName('saopopup-text')[0].innerHTML = _content.text;
  }

  // confirm 控制按钮显示
  function _showButton(){
    if(!_content.showOk){
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'none';
    }
    if(!_content.showNo){
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
    }
    if (_content.oneKey) {
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'inline-block';
    } else {
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'inline-block';
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'inline-block';
    }
  }
  // auto 隐藏按钮
  function _hideButton(){
    _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
    _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'none';
  }
  //弹窗模式选择
  function _popupMode (mode) {
    if(mode === 'confirm'){
      _showButton();
    }else if(mode === 'auto'){
      _hideButton();
      let a = document.createElement('div');
      a.setAttribute('style','height:40px');
      _node.getElementsByClassName('saopopup-bottom')[0].appendChild(a);
      let timer = setTimeout(()=>{
        _node.getElementsByClassName('saopopup-bottom')[0].removeChild(a);
        self.hiddenPopup();
        clearTimeout(timer);
      },_content.time);
    }else if(mode === 'prompt'){

      
    }else{
      throw new Error(mode+'-弹窗模式错误！')
    }
  }
  // 外部调用方法：打开弹窗，输入json设置弹窗属性
  this.showPopup = function (json) {
    _setData(json)//不输入则使用默认或上一次输入的值
    _node.classList.remove('saopopup-close');
    _node.classList.add('saopopup-open');
    _popupMode(_content.mode);//选择弹窗模式
    _setContent();
    setTimeout(() => {
      _node.style.width = _content.width + 'px';
    }, 20)
    setTimeout(() => {
      _node.style.height = _getPopupHeight() + 'px';
    }, 220)
  }
  // 外部调用方法：关闭弹窗
  this.hiddenPopup = function () {
    _node.classList.remove('saopopup-open');
    _node.style.height = '39px';
    setTimeout(() => {
      _node.style.width = '0px';
    }, 200)
    setTimeout(() => {
      _node.classList.add('saopopup-close');
    }, 300)
  }
}