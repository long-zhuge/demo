class Drag {
  constructor() {
    this.dragging = false;
    this.tLeft = 0;
    this.tTop = 0;
  }

  // 判断当前传入的 node 是否为一个 html 元素
  create (node) {
    if (node instanceof HTMLElement) {
      return Drag.onMouseDown(node);
    }

    throw `${node} 不是一个 HTML 元素`;
  }

  // 目标元素鼠标摁下后
  static onMouseDown (node) {
    var _this = this;

    node.onmousedown = function (e) {
      e.preventDefault();
      /*
      * getBoundingClientRect: 返回一个 DomRect 对象
      *   包含该元素的 top、right、bottom、left 值，对应的是到屏幕上方和左边的距离，单位 px
      * */
      var dragDomRect = node.getBoundingClientRect();
      /*
      * e.clientX、e.clientY
      *   获取鼠标的坐标位置
      * */
      _this.dragging = true; // 激活拖拽状态
      _this.tLeft = e.clientX - dragDomRect.left; // 鼠标按下时和选中元素的坐标偏移:x坐标
      _this.tTop = e.clientY - dragDomRect.top; // 鼠标按下时和选中元素的坐标偏移:y坐标

      _this.onMouseMove(node);
      _this.onMouseUp(node);
    };
  }

  // 目标元素鼠标放开事件
  static onMouseUp (node) {
    var _this = this;

    node.onmouseup = function (e) {
      e.preventDefault();
      _this.dragging = false; // 停止移动状态
      document.onmousemove = null; // 停止鼠标移动事件
    };
  }

  // 监听鼠标移动事件
  static onMouseMove (node) {
    var _this = this;

    document.onmousemove = function (e) {
      e.preventDefault();
      // 当目标元素处于移动激活状态
      if (_this.dragging) {
        var moveX = e.clientX - _this.tLeft,
          moveY = e.clientY - _this.tTop;
        var bodyWidth = window.innerWidth, // 获取浏览器内容宽度
          bodyHeight = window.innerHeight; // 获取浏览器内容高度
        /*
        * 防止元素移动超出左边和上边
        * */
        moveX < 0 ? moveX = 0 : null;
        moveY < 0 ? moveY = 0 : null;
        /*
        * 防止元素移动超出右边和下边
        * dragDom.offsetWidth：获取元素宽度
        * dragDom.offsetHeight：获取元素高度
        * */
        var offsetWidth = node.offsetWidth,
            offsetHeight = node.offsetHeight;
        (moveX + offsetWidth) > bodyWidth ? moveX = bodyWidth - offsetWidth : null;
        (moveY + offsetHeight) > bodyHeight ? moveY = bodyHeight - offsetHeight : null;

        node.style.left = moveX + 'px';
        node.style.top = moveY + 'px';
      }
    }
  }
}