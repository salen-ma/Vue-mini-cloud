var eventUtils = {}

eventUtils.animation = function (obj, attrs, duration, fx, fn){
  if(typeof duration === 'undefined'){
    duration = 500;
    fx = 'easeOut';
  }
  if(typeof duration === 'number'){
    if(typeof fx === 'undefined'){
      fx = 'easeOut';
    }
    if(typeof fx === 'function'){
      fn = fx;
      fx = 'easeOut';
    }
  }
  if(typeof duration === 'string'){
    if(typeof fx === 'undefined'){
      fx = duration;
      duration = 500;
    }
    if(typeof fx === 'function'){
      fn = fx;
      fx = 'easeOut';
      duration = 500;
    }
  }
  if(typeof duration === 'function'){
    fn = duration;
    fx = 'easeOut';
    duration = 500;
  }
  var startVal = {};
  var changeVal = {};
  var _this = this;
  for(var key in attrs){
    startVal[key] = this.css(obj, key);
    changeVal[key] = attrs[key] - startVal[key];
  }
  var startTime = Date.now();
  
  window.cancelAnimationFrame(obj.move);
  
  (function move(){
    obj.move = window.requestAnimationFrame(move, obj);
    var t = Date.now() - startTime;
    if(t > duration){
      t = duration;
      window.cancelAnimationFrame(obj.move);
      obj.move = null;
      if(typeof fn === 'function'){
        fn.call(obj);
      }
    }

    for(var key in changeVal){
      var val = _this.Tween[fx](t, startVal[key], changeVal[key], duration);
      _this.css(obj, key, val);
    }
  })();
};

eventUtils.css = function (){
  var len = arguments.length;
  if(len < 2){
    return false;
  }
  var obj = arguments[0], attr = arguments[1], val = arguments[2];
  var _this = this;
  if(len == 2){
    if(typeof attr === 'string'){
      if(attr === ''){
        obj.style.cssText = '';
        return;
      }
      if(isTransfrom(attr)){
        return this.setTransform(obj, attr);
      }
      if(getStyle(attr)){
        return Number.parseFloat(getComputedStyle(obj)[attr]);
      }
      if(attr === 'opacity'){
        return Number.parseFloat(getComputedStyle(obj)[attr]);
      }
      return getComputedStyle(obj)[attr];
    }else{
      for(var key in attr){
        setStyle(key, attr[key])
      }
    }
  }
  if(len == 3 && (typeof val == 'string' || typeof val == 'number')){
    setStyle(attr, val);
  }
  function isTransfrom(attr){
    return attr == 'translateX' || attr == 'translateY' || attr == 'rotate' || attr == 'rotateX' || attr == 'rotateY' || attr == 'skewX' || attr == 'skewY' || attr == 'scale' || attr == 'scaleX' || attr == 'scaleY';
  }
  function getStyle(attr){
    return attr == 'width' || attr == 'height' || attr == 'left' || attr == 'top' || attr == 'bottom' || attr == 'right' || attr == 'margin-left' || attr == 'marginLeft' || attr == 'margin-right' || attr == 'marginRight' || attr == 'margin-bottom' || attr == 'marginBottom' || attr == 'margin-top' || attr == 'marginTop';
  }
  function setStyle(attr, value){
    if(getStyle(attr)){
      obj.style[attr] = value + 'px';
    }else if(isTransfrom(attr)){
      _this.setTransform(obj, attr, value);
    }else{
      obj.style[attr] = value;
    }
  }
}

// 获取元素位置信息
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

// 在元素指定位置按下时拖拽元素
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
  }
};

// 鼠标按下,拉出选框选择元素
eventUtils.duang = function (current, target){
  var currentRect = current.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var currentLeft = currentRect.left, 
      currentTop = currentRect.top,
      currentRight = currentRect.right,
      currentBottom = currentRect.bottom;
  var targetLeft = targetRect.left, 
      targetTop = targetRect.top,
      targetRight = targetRect.right,
      targetBottom = targetRect.bottom;
  return currentRight > targetLeft && currentBottom > targetTop && currentLeft < targetRight && currentTop < targetBottom;
};

eventUtils.dragSelect = function(e,This){
  if(e.buttons !== 1){
    return;
  }

  if(e.target.classList.contains('file-list')){
   
    var folderWrap = e.target;
    var currentFiles = folderWrap.children;

    var box = document.createElement('div');
    box.style.border = '1px dotted #000';
    box.style.position = 'absolute';
    folderWrap.appendChild(box);    

    var x = e.pageX, y = e.pageY;
    box.style.left = x + 'px';
    box.style.top = y + 'px';    

    folderWrap.onmousemove = function (e){
      e.preventDefault()
      
      var cx = e.pageX, cy = e.pageY;  
      box.style.left = Math.min(cx, x) + 'px';
      box.style.top = Math.min(cy, y) + 'px';
      box.style.width = Math.abs(x - cx) + 'px';
      box.style.height = Math.abs(y - cy) + 'px'; 

      for(var i=0; i<currentFiles.length; i++){
        if(eventUtils.duang(box,currentFiles[i]) && i !== currentFiles.length - 1){
          This.currentData[i].checked = true     
        }else if(i !== currentFiles.length - 1){
          This.currentData[i].checked = false       
        }        
      }           
    }

    document.onmouseup = function (){
      this.onmouseup = folderWrap.onmousemove = null;
      box.remove(box);
    }    
  }
};

eventUtils.showContextmenu = function(e,_contextmenu,This){
  if(_contextmenu.flag){
    return;
  };

  _contextmenu.flag = true;

  var target = e.target;

  if( target.classList.contains('folder') ){
    This.cancelChecked()
    let index = target.dataset.index
    This.currentData[index].checked = true
  }

  var H = 240;
  var x = e.pageX, y = e.pageY;

  if(window.innerWidth - x < eventUtils.css(_contextmenu, 'width')){
      x = x - eventUtils.css(_contextmenu, 'width');
  };
  if(window.innerHeight - y < H){
      var flag = true;
  };

  eventUtils.css(_contextmenu, '');
  eventUtils.css(_contextmenu, {
      display: 'flex',
      left: x,
      top: y
  });
  
  if(flag){
      eventUtils.animation(_contextmenu, {height: H, top: y - H}, 'backOut');
  }else{
      eventUtils.animation(_contextmenu, {height: H}, 'backOut');
  }  
};

eventUtils.hideContextmenu = function(_contextmenu){
  eventUtils.animation(_contextmenu, {height: 0}, 200, 'backIn', function (){
      eventUtils.css(this, '');
  });
  _contextmenu.flag = false;  
}

eventUtils.Tween = {
  linear: function (t, b, c, d){  //匀速
    return c*t/d + b;
  },
  easeIn: function(t, b, c, d){  //加速曲线
    return c*(t/=d)*t + b;
  },
  easeOut: function(t, b, c, d){  //减速曲线
    return -c *(t/=d)*(t-2) + b;
  },
  easeBoth: function(t, b, c, d){  //加速减速曲线
    if ((t/=d/2) < 1) {
      return c/2*t*t + b;
    }
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInStrong: function(t, b, c, d){  //加加速曲线
    return c*(t/=d)*t*t*t + b;
  },
  easeOutStrong: function(t, b, c, d){  //减减速曲线
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
    if ((t/=d/2) < 1) {
      return c/2*t*t*t*t + b;
    }
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
    if (t === 0) {
      return b;
    }
    if ( (t /= d) == 1 ) {
      return b+c;
    }
    if (!p) {
      p=d*0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      var s = p/4;
    } else {
      var s = p/(2*Math.PI) * Math.asin (c/a);
    }
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
    if (t === 0) {
      return b;
    }
    if ( (t /= d) == 1 ) {
      return b+c;
    }
    if (!p) {
      p=d*0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else {
      var s = p/(2*Math.PI) * Math.asin (c/a);
    }
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  elasticBoth: function(t, b, c, d, a, p){
    if (t === 0) {
      return b;
    }
    if ( (t /= d/2) == 2 ) {
      return b+c;
    }
    if (!p) {
      p = d*(0.3*1.5);
    }
    if ( !a || a < Math.abs(c) ) {
      a = c;
      var s = p/4;
    }
    else {
      var s = p/(2*Math.PI) * Math.asin (c/a);
    }
    if (t < 1) {
      return - 0.5*(a*Math.pow(2,10*(t-=1)) *
          Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }
    return a*Math.pow(2,-10*(t-=1)) *
        Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
  },
  backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
    if (typeof s == 'undefined') {
       s = 1.70158;
    }
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  backOut: function(t, b, c, d, s){
    if (typeof s == 'undefined') {
      s = 3.70158;  //回缩的距离
    }
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  backBoth: function(t, b, c, d, s){
    if (typeof s == 'undefined') {
      s = 1.70158;
    }
    if ((t /= d/2 ) < 1) {
      return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    }
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
    return c - eventUtils.Tween['bounceOut'](d-t, 0, c, d) + b;
  },
  bounceOut: function(t, b, c, d){//*
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
    }
    return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
  },
  bounceBoth: function(t, b, c, d){
    if (t < d/2) {
      return eventUtils.Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
    }
    return eventUtils.Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
  }
}

export default eventUtils
