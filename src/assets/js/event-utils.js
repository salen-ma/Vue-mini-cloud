var eventUtils = {}

eventUtils.getRect = function (obj, type){
  var rect = obj.getBoundingClientRect();
  switch(type){
    case 'left':
      return rect.left;
    break;
    case 'top':
      return rect.top;
    break;
    case 'right':
      return rect.right;
    break;
    case 'bottom':
      return rect.bottom;
    break;
  }
};

eventUtils.drapEle = function (eleDown, eleMove, scope){
  eleDown.onmousedown = function (e){
    e.preventDefault();
    var dx = e.pageX - eventUtils.getRect(eleMove, 'left');
    var dy = e.pageY - eventUtils.getRect(eleMove, 'top');
    document.onmousemove = function (e){
      var L = e.pageX - dx - eventUtils.getRect(eleMove.offsetParent, 'left');
      var T = e.pageY - dy - eventUtils.getRect(eleMove.offsetParent, 'top');
      
      if(scope){
        L = L <=0 ? 0 : L;
        T = T <=0 ? 0 : T;
        L = L > eleMove.offsetParent.clientWidth - eleMove.offsetWidth ? eleMove.offsetParent.clientWidth - eleMove.offsetWidth : L;
        T = T > eleMove.offsetParent.clientHeight - eleMove.offsetHeight ? eleMove.offsetParent.clientHeight - eleMove.offsetHeight : T;
      }
      
      eleMove.style.left = L + 'px';
      eleMove.style.top = T + 'px';
    };
    document.onmouseup = function (){
      this.onmouseup = this.onmousemove = null;
    }
  };
}

export default eventUtils
