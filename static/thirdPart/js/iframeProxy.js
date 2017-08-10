/**!
 * iframe嵌套跨域 高度自适应
 * @author: tommyshao <jinhong.shao@frontpay.cn>
 * @copyright www.frontpay.cn
 * @date:   2015-06-18
 * @update: 2015-09-24
 */

/**
 * domReady
 *
 * @fileOverview
 *    Cross browser object to attach functions that will be called
 *    immediatly when the DOM is ready.
 *    Released under MIT license.
 * @version 3.0.0
 * @author Victor Villaverde Laan
 * @license MIT  * @link http://www.freelancephp.net/domready-javascript-object-cross-browser/
 * @link https://github.com/freelancephp/DOMReady
 */
(function (window) {

  'use strict';

  var document = window.document;
  var fns = [];
  var args = [];
  var isReady = false;
  var errorHandler = null;

  /**
   * Call a ready handler
   * @private
   * @param {function} fn
   */
  var call = function (fn) {
    try {
      // call function
      fn.apply(this, args);
    } catch (e) {
      // error occured while executing function
      if (errorHandler !== null) {
        errorHandler.call(this, e);
      }
    }
  };

  /**
   * Call all ready handlers
   * @private
   */
  var run = function () {
    var x;

    isReady = true;

    // call all registered functions
    for (x = 0; x < fns.length; x = x + 1) {
      call(fns[x]);
    }

    // clear handlers
    fns = [];
  };

  /**
   * Initialize
   * @private
   */
  var init = function () {
    if (window.addEventListener) {
      // for all browsers except IE
      document.addEventListener('DOMContentLoaded', function () { run(); }, false);
    } else {
      // for IE
      // code taken from http://javascript.nwbox.com/IEContentLoaded/
      var poll = function () {
        // check IE's proprietary DOM members
        if (!document.uniqueID && document.expando) {
          return;
        }

        // you can create any tagName, even customTag like <document :ready />
        var tempNode = document.createElement('document:ready');

        try {
          // see if it throws errors until after ondocumentready
          tempNode.doScroll('left');

          // call run
          run();
        } catch (e) {
          window.setTimeout(poll, 10);
        }
      };

      // trying to always fire before onload
      document.onreadystatechange = function() {
        if (document.readyState === 'complete') {
          document.onreadystatechange = null;
          run();
        }
      };

      poll();
    }
  };

  /**
   * @namespace domReady
   *
   * @public
   * @param {function} fn
   * @return {domReady}
   */
  var domReady = function (fn) {
    return domReady.on(fn);
  };

  /**
   * Add code or function to execute when the DOM is ready
   * @public
   * @param {function} fn
   * @return {domReady}
   */
  domReady.on = function (fn) {
    // call imediately when DOM is already ready
    if (isReady) {
      call(fn);
    } else {
      // add to the list
      fns[fns.length] = fn;
    }

    return this;
  };

  /**
   * Set params that will be passed to every ready handler
   * @public
   * @param {Array.<*>} params
   * @return {domReady}
   */
  domReady.params = function (params) {
    args = params;
    return this;
  };

  /**
   * Set error callback
   * @public
   * @param {function([Error|string])} fn
   * @return {domReady}
   */
  domReady.error = function (fn) {
    errorHandler = fn;
    return this;
  };

  // initialize
  init();

  // make global
  window.domReady = domReady;

})(window);


~(function(root, d, undefined){
  // 配置proxyUrl地址
  // if(!root['proxyUrl']) return;
  var proxyUrl = root['proxyUrl'], 
      proxyIframe, 
      autoIfrTimer = null,
      originHeight = 0;
  var parent = root.top;
  var isFrame = root != parent;

  function getStyle( elem, attr ) {
    var oStyle = elem.currentStyle? elem.currentStyle : window.getComputedStyle(elem, null);
    return oStyle[attr];
  }
  // 判断IE版本
  function isIE(ver){
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
  };


  function setIframeHeight(height){
    clearTimeout(autoIfrTimer);
    // 自动检测内容高度
    autoIfrTimer = setTimeout(setIframeHeight, 1e3);

    // 不被iframe嵌套时不操作
    if(!isFrame) return;
    var oBody = d.body;
    var bodyHeight = oBody.scrollHeight;
    var docHeight = 0;

    var oContainer = oBody.children[0];
    var i = 0, len = 0, mgTop = 0, childrens = null;

    if(!height) {
      childrens = oContainer.children;
      //docHeight = oContainer ? oContainer.offsetHeight : docHeight;
      for(len = childrens.length; i < len; i++) {
        mgTop = parseInt(getStyle(childrens[i], 'marginTop'), 10);
        docHeight += childrens[i].offsetHeight;
        docHeight += parseInt(isNaN(mgTop) ? 0 : mgTop);
      }
    } else {
      docHeight = height;
    }

    //docHeight = Math.max(bodyHeight, docHeight);
    //console.log('bodyHeight:'+bodyHeight+',docHeight:'+docHeight);
    // docHeight = h;
    //alert(oContainer.offsetHeight)
    
    if(originHeight == docHeight) return;

    if(!proxyIframe){
      var container = d.createElement("div");
      container.innerHTML = '<iframe style="display:none;" src="'+ proxyUrl +'#height='+ docHeight +'" scrolling="no" height="0" width="0"></iframe>';
      proxyIframe = container.firstChild;
      oBody.appendChild(proxyIframe);
    } else {
      //height = height || docHeight;
      proxyIframe.src = proxyUrl+'#height='+docHeight;
    }

    originHeight = docHeight;
  }

  // 隐藏滚动条
  function setStyle(){
    var cssText = 'html,body{ overflow: hidden; height: 100%}';
    var oHead = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet) {
      try{
        style.styleSheet.cssText = cssText;
      }catch(e){}
    } else{
      var textNode = document.createTextNode(cssText);
      style.appendChild(textNode);
    }

    oHead.appendChild(style);
  }

  // 有bug
  /*var loaded = function(element, fn){
    if(element.attachEvent){ // ie
      element.attachEvent("onreadystatechange", fn);
      element.attachEvent("onload", fn);
    }else if(element.addEventListener){
      element.addEventListener('DOMContentLoaded', fn, false)
    } else {
      window.onload = fn;
    }
  };*/

  if(isFrame && root['proxyUrl']){
    setStyle();
    /*loaded(window, function(){
      setIframeHeight();
    })*/
    //domReady();

    domReady(setIframeHeight)


    // 自动检测
    //autoIfrTimer = setTimeout(setIframeHeight, 1e3)
  }

  root.setIframeHeight = setIframeHeight;

})(window, document);

// 新的 iframe 高度设置方法
$(function() {
    var post = function (msg) {
        parent.postMessage(msg, '*');
    }

    function getStyle ( elem, attr ) {
        var style = elem.currentStyle? elem.currentStyle : window.getComputedStyle(elem, null);
        return style[attr];
    }

    setInterval(function () {
        var height = 0;
        var container = document.body.children[0];
        var mgTop = 0;
        var childrens = container.children;

        for(var i = 0; i < childrens.length; i++) {
            mgTop = parseInt(getStyle(childrens[i], 'marginTop'), 10);
            height += childrens[i].offsetHeight;
            height += parseInt(isNaN(mgTop) ? 0 : mgTop);
        }

        post( 'frontpay.cn;iframeHeight;' + height);
    }, 1000);
});
