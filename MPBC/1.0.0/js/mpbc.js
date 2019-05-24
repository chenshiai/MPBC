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
  function _setData(json) {
    if (json) {
      if (json.title) _content.title = json.title;
      if (json.text) _content.text = json.text;
      if (json.mode) _content.mode = json.mode;
      if (json.okFunc) _content.okFunc = json.okFunc; else () => { };
      if (json.noFunc) _content.noFunc = json.noFunc; else () => { this.hiddenPopup() };
      if (!json.showOk) _content.showOk = json.showOk;
      if (!json.showNo) _content.showNo = json.showNo;
      if (json.oneKey!=null || json.oneKey!=undefined && typeof json.oneKey === 'boolean') _content.oneKey = json.oneKey;
      if (json.width) _content.width = json.width;
    } else {
      return;
    }
  }
  _setData(json);
  if (!_node) {
    throw new Error('目标选取错误：' + theNode + '该元素不存在！');
  }
  var _frame = _node.getElementsByClassName('saopopup-frame')[0];
  _node.classList.add('saopopup-close');
  _node.getElementsByClassName('saopopup-button-no')[0].onclick = function () {
    _content.noFunc();
  }
  _node.getElementsByClassName('saopopup-button-ok')[0].onclick = function () {
    _content.okFunc();
  }
  _node.style.width = '0px';
  function _getPopupHeight() {
    return _frame.offsetHeight;
  }
  function _setContent() {
    _node.getElementsByClassName('saopopup-title')[0].innerHTML = _content.title;
    _node.getElementsByClassName('saopopup-text')[0].innerHTML = _content.text;
  }
  function _showButton(){
    if(!_content.showOk){
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'none';
    }else{
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'inline-block';
    }
    if(!_content.showNo){
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
    }else{
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'inline-block';
    }
    if (_content.oneKey) {
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'inline-block';
    } else {
      _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'inline-block';
      _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'inline-block';
    }
  }
  function _hideButton(){
    _node.getElementsByClassName('saopopup-button-no')[0].style.display = 'none';
    _node.getElementsByClassName('saopopup-button-ok')[0].style.display = 'none';
  }
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
  this.showPopup = function (json) {
    _setData(json)
    _node.classList.remove('saopopup-close');
    _node.classList.add('saopopup-open');
    _popupMode(_content.mode);
    _setContent();
    setTimeout(() => {
      _node.style.width = _content.width + 'px';
    }, 20)
    setTimeout(() => {
      _node.style.height = _getPopupHeight() + 'px';
    }, 220)
  }
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