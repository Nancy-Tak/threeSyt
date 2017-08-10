/**!
 * 页面共同部分
 * by frontpay F2E Team
 * created on 2015-08-25
 */


var detectBrowser = (function() {
  var win = window;
  var nav = win.navigator;
  var ua = nav.userAgent;
  var doc = win.document;
  var ieAX = win.ActiveXObject;
  var ieMode = doc.documentMode;
  var REG_APPLE = /^Apple/;
  var ieVer = _getIeVersion() || ieMode || 0;
  var isIe = ieAX || ieMode;
  var chromiumType = _getChromiumType();

  var exports = {
    /**
     * 判断是否为 IE 浏览器
     *
     * @example
     * shell.isIE;
     * // true or false
     */
    isIE: (function () {
      return !!ieVer;
    })(),
    /**
     * IE 版本
     *
     * @example
     * shell.ieVersion;
     * // 6/7/8/9/10/11/12...
     */
    ieVersion: (function () {
      return ieVer;
    })(),
    /**
     * 是否为谷歌 chrome 浏览器
     *
     * @example
     * shell.isChrome;
     * // true or false
     */
    isChrome: (function () {
      return chromiumType === 'chrome';
    })(),
    /**
     * 是否为360安全浏览器
     *
     * @example
     * shell.is360se;
     * // true or false
     */
    is360se: (function () {
      return chromiumType === '360se';
    })(),
    /**
     * 是否为360极速浏览器
     *
     * @example
     * shell.is360ee;
     * // true or false
     */
    is360ee: (function () {
      return chromiumType === '360ee' || Browser360EE();
    })(),
    /**
     * 是否为猎豹安全浏览器
     *
     * @example
     * shell.isLiebao;
     * // true or false
     */
    isLiebao: (function () {
      return chromiumType === 'liebao' || ua.indexOf('LBBROWSER') > -1;
    })(),
    /**
     * 是否搜狗高速浏览器
     *
     * @example
     * shell.isSogou;
     * // true or false
     */
    isSogou: (function () {
      return chromiumType === 'sogou';
    })(),
    /**
     * 是否为 QQ 浏览器
     *
     * @example
     * shell.isQQ;
     * // true or false
     */
    isQQ: (function () {
      return chromiumType === 'qq';
    })()
  };


//    /**
//     * 测试 MIME
//     * @param where
//     * @param value
//     * @param [name]
//     * @param [nameReg]
//     * @returns {boolean}
//     * @private
//     */
//    function _mime(where, value, name, nameReg) {
//        var mimeTypes = navigator.mimeTypes;
//        var i;
//
//        for (i in mimeTypes) {
//            if (mimeTypes[i][where] == value) {
//                if (name !== undefined && nameReg.test(mimeTypes[i][name])) {
//                    return true;
//                }
//                else if (name === undefined) {
//                    return true;
//                }
//            }
//        }
//
//        return false;
//    }


  /**
   * 检测 external 是否包含该字段
   * @param reg 正则
   * @param type 检测类型，0为键，1为值
   * @returns {boolean}
   * @private
   */
  function _testExternal(reg, type) {
    var external = win.external || {};

    for (var i in external) {
      if (reg.test(type ? external[i] : i)) {
        return true;
      }
    }

    return false;
  }


  /**
   * 获取 Chromium 内核浏览器类型
   * @link http://www.adtchrome.com/js/help.js
   * @link https://ext.chrome.360.cn/webstore
   * @link https://ext.se.360.cn
   * @return {String}
   *         360ee 360极速浏览器
   *         360se 360安全浏览器
   *         sougou 搜狗浏览器
   *         liebao 猎豹浏览器
   *         chrome 谷歌浏览器
   *         ''    无法判断
   * @version 1.0
   * 2014年3月12日20:39:55
   */

  function _getChromiumType() {
    if (isIe || typeof win.scrollMaxX !== 'undefined' || REG_APPLE.test(nav.vendor || '')) {
      return '';
    }

    var _track = 'track' in document.createElement('track');
    var webstoreKeysLength = win.chrome && win.chrome.webstore ? Object.keys(win.chrome.webstore).length : 0;

    // 搜狗浏览器
    if (_testExternal(/^sogou/i, 0)) {
      return 'sogou';
    }

    // 猎豹浏览器
    if (_testExternal(/^liebao/i, 0)) {
      return 'liebao';
    }

    // chrome
    if (win.clientInformation && win.clientInformation.permissions) {
      return 'chrome';
    }

    if (_track) {
      // 360极速浏览器
      // 360安全浏览器
      return webstoreKeysLength > 1 ? '360ee' : '360se';
    }

    return '';
  }


  // 获得ie浏览器版本

  function _getIeVersion() {
    var v = 3,
      p = document.createElement('p'),
      all = p.getElementsByTagName('i');

    while (
      p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]);

    return v > 4 ? v : 0;
  }

  function Browser360EE() {
    var _ = {
      GetRunPath: function(){
        try {
          var path = external.GetRunPath(external.GetSID(window));
          return path.toLowerCase();
        } catch (e) {
          return '';
        }
      },
      Is360Chrome: function(){
        return this.GetRunPath().indexOf('360chrome.exe') > -1;
      },
      is360chrome:function () {
        var _is360chrome=false;
        try{
          if(typeof( chrome )!= "undefined" && typeof( chrome.webstorePrivate)!='undefined' && typeof (chrome.webstorePrivate.beginInstallWithManifest3)!='undefined'){
            _is360chrome=true;
          }else {
            _is360chrome=navigator.userAgent.toLowerCase().indexOf('360ee')!=-1;
          }
        }catch(e){};
        return _is360chrome||this.Is360Chrome();
      }
    };

    return _.is360chrome();
  }


  return exports;
})();

/**
 * 倒计时
 * @param {object} 小时dom元素
 * @param {object} 分钟dom元素
 * @param {object} 秒钟dom元素
 * @param {Number} 开始时间时间戳
 * @return {Object}
 */
function clockTick(start, callback) {
  if(!start) return void(0);
  var args = [].slice.call(arguments);
  var Handler = {
    init: function(ss) {
      //this.hours = h;
      //this.minutes = m;
      //this.seconds = s;
      this.start = ss;
      this.timer = null;

      this.tick();
      return this;
    },
    tick: function() {
      var self = this,
          now = new Date(),
          startTime = this.start,
          diff = 	startTime - now;

      function loop() {

        // 秒倒计时
        diff -= 1000;

        if(diff <= 0) {
          typeof callback === 'function' && callback(-1);
          clearInterval(self.timer)
        } else {
          var days = Math.floor(diff / (24 * 60 * 60 * 1000)),
              h = Math.floor(diff / (60 * 60 * 1000)) - (days * 24),
              m = Math.floor(diff / (60 * 1000)) - (h * 60) - (days * 24 * 60),
              s = Math.floor(diff / 1000) - (m * 60) - (h * 60 * 60) - (days * 24 * 60 * 60);

          // 更新时分秒
          //that.hours.innerHTML = h + days * 24;
          //that.minutes.innerHTML = m;
          //that.seconds.innerHTML = s;
          //console.log(diff);
          typeof callback === 'function' && callback(days, h, m, s);
        }


      }
      this.timer = setInterval(loop, 1000);
    },
    stop: function() {
      clearInterval(this.timer);
    }
  };

  return Handler.init.apply(Handler, args);
}

/*
* 开户行自动辨识
* @fn autoCompleteBankName
* @placeholder {string}
* @return [function]
* @useage:
* <input type="text" data-toggle="autoCompleteBankName" data-target="#bankName" />
* $('[data-toggle="autoCompleteBankName"]').autoCompleteBankName()
* API:
* $('[data-toggle="autoCompleteBankName"]').on('hasChanged', function(e, data){ data.value, data.target })
* 更新视图 $('[data-toggle="autoCompleteBankName"]').trigger('updateView', data)
*/
;(function($) {
  // 扩展银行卡自动完成
  $.extend($.fn, {
    autoCompleteBankName: function(placeholder) {
      var that = $(this),
          // 更新视图
          updateView = function(el, data) {
            // 符合银行信息配置{icon: 'icbc', text: '招商银行'}
            if(data['icon'] && data['text']) {
              el.html(
                '<span class="bank-icon icon-'+ data.icon +'"></span>'
                +'<span class="form-control-bank-card">'+ data.text +'</span>'
              )
            } else {
              // 占位符
              el.html(data || placeholder || '请输入银行卡号')
            }
          },
          // 监听数值变化
          handler = function(event) {
            var $target = $($(this).attr('data-target')),
                _Ev = $.Event('hasChanged')
                value = $.trim($(this).val()).replace(/[^0-9]/g,'');
            // 开户行不存在
            if(!$target.length) return;
            // 非数字
            //if(!onlyNumber(event)) return;
            // 触发事件
            $(this).val(value).trigger(_Ev, {value: value, target: $target})
          },
          // 更新数据视图
          update = function(e, data) {
            var $target = $($(this).attr('data-target'))
            if(!!$target.length) {
              updateView($target, data)
            }
          },
          // 只能输入数字
          onlyNumber = function(e) {
            var keyCode = e.which;
            /*if(keyCode == 110 || keyCode == 190) return true;
            if((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 8 || keyCode == 37 || keyCode == 39 || keyCode == 46) {
              return true;
            } else {
              e.preventDefault();
              return false;
            }*/
            //允许按Ctrl, Shift, Tab
            if (event.ctrlKey || event.shiftKey || keyCode == 9) {
                return true;
            }

            if (event.ctrlKey && keyCode == 65) { //Ctrl+A
                return true;
            }
            if(!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which >= 37 && e.which <= 40) || e.which == 8)) {
              e.preventDefault();
              return false;
            }
            return true;
          }
      // 鼠标键入银行卡
      that.on('keyup.acb change.acb input.acb propertychange.acb', handler)
      // 限制只能输入[0-9.]
      that.on('keydown.onlyNumber', onlyNumber)
      // 更新开户行
      that.on('updateView', update)

      // 禁止中文输入
      that.css({'ime-mode':'disabled'})
    }
  })

  $(function(){
    // global plugin initialize
    $('[data-toggle="autoCompleteBankName"]').autoCompleteBankName();
  })

})(jQuery);

~(function(root, $) {

    // 判断IE版本
    var isIE = function(ver){
      var b = document.createElement('b');
      b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
      return b.getElementsByTagName('i').length === 1;
    };

    var FrontUI = {
        pwdLock: function(option) {
          var defaults = {
            title: '您的账户由于支付密码连续错误，已锁定！',
            content: '不可进行提现、交易及安全设置操作，账户将于明日解锁，如有其他疑问，请拨打：',
            tel: '400-106-6698',
            link: '/',
            linkText: '返回账户总览',
            callback: $.noop
          };

          var config = $.extend(defaults, option);

          var template = '<h3 class="fn-mb-10">'+ config.title +'</h3>'+
                          '<p class="fn-mb-5">'+ config.content +'</p>'+
                          '<p><b class="warning-FontColor fs-18">'+ config.tel +'</b></p>'+
                          '<div class="text-align-center fn-mt-30">'+
                          '  <button class="btn primary" data-dismiss="modal">确认</button>'+
                          '  <a href="'+ config.link +'" class="btn links">'+ config.linkText +'</a>'+
                          '</div>';

          $('#modal_pwdLock').modal({ title: '提示', content: template, callback: function() {
            $(this).on('hide.ui.modal', config.callback);
          }})

        }
    };

    var commApi = function() {
      // 设置第三方iframe高度
      typeof setIframeHeight == "function" && setIframeHeight();
    };

    var App = {
        // 页面初始化
        initPage: function(){
            for(var i in App) {
                i != 'initPage' && typeof App[i] === 'function' && App[i]();
            }
        },
        // 提现金额展开隐藏
        amountRemind: function(){
            $("#sh").on('click', function(){
                var isOpen = $(this).data('isOpen'), strText = $(this).text(), strLabel = $(this).data('label'), target = $(this).data('target');
                if(isIE(7)) { // i7 bug
                  $("#arb")[isOpen ? 'hide': 'show']();
                  $(target).slider('init');
                  // 共同接口
                  commApi();
                } else {
                  $("#arb")[isOpen ? 'slideUp': 'slideDown'](function(){
                    //console.log(target);
                    if($(this).is(':visible')) {
                      $(target).slider('init');
                    }
                    // 共同接口
                    commApi();
                  });
                }
                $(this).html(strLabel).data('label', strText).data('isOpen', !isOpen);



            });
        },
        moreBanks:function(){
            var $ul=$(".j-banks-more"),
                $li=$ul.find("li"),
                $btn=$ul.find(".more-ebank"),
                iLen=$li.length,
                e = $.Event('bankMore:action'),
                Toggle={
                    isHidden:!0,
                    init:function(){
                        this[this.isHidden?"show":"hide"]();

                        $ul.trigger(e)
                    },
                    show:function(){
                        this.isHidden=!1,
                            $li.show(),
                            $btn.html("收起").hide()
                    },
                    hide:function(){
                        this.isHidden=!0,
                            $li.slice(8,iLen-1).hide(),
                            $btn.html("查看更多")
                    }
                };
            Toggle.hide(),
            $btn.on("click",$.proxy(Toggle.init,Toggle))
        },
        // 搜索框
        searchInput: function(){
          var handler = {
            // 延迟隐藏
            timer: null,
            // 自动隐藏，如果input是focus状态则不自动隐藏
            autoHide: true,
            // 按钮是否点击，点击保持不隐藏，等input再次blur隐藏
            clicked: false,
            // 显示 obj-按钮, ip 是否input触发
            show: function(obj, ip){
              if(!obj) return;
              clearTimeout(this.timer);
              // 设置自动隐藏状态
              this.autoHide = ip ? true : false;
              $(obj).removeClass('hidden');
            },
            // 隐藏 obj-按钮, ip 是否input触发
            hide: function(obj, ip) {
              if(!obj) return;
              var that = this;
              clearTimeout(this.timer);
              this.timer = setTimeout(function(){
                $(obj).addClass('hidden');
                // 设置自动隐藏状态
                that.autoHide = true;
              }, 500)
            }
            //},
            //bindEvent: function(obj) {
            //  var that = this;
            //  // 按钮鼠标移入移开
            //  $(obj).off('mouseenter mouseleave').on('mouseenter mouseleave', function(e) {
            //    if(e.type == 'mouseenter') {
            //      handler.show(obj, 1);
            //    } else {
            //      if(!that.clicked && that.autoHide) { // 未点击，自动隐藏
            //        handler.hide(obj, 1);
            //      }
            //    }
            //  });
            //  // 按钮点击
            //  $(obj).off('click').on('click', function(){
            //    that.clicked = true;
            //    that.show($(this), 1)
            //  });
            //}
          };
          $('[data-toggle="searchInput"]').on('focus blur', function(e){
            var obj = $(this).next('button');
            //if(e.type == 'focus') {
            //  handler.show(obj, 0);
            //} else {
            //  if($.trim($(this).val()) == '' && $(this).val().length == 0) {
            //    handler.hide(obj, 0);
            //  }
            //}
            // input触发显示隐藏
            handler[e.type == 'focus' ? 'show' : 'hide'](obj, 0);
            // 按钮鼠标滑过、移开、点击事件
            //handler.bindEvent(obj)
          });
        },
      // 密码输入框禁止复制黏贴
      pwdLimit: function() {
      	//var tips;
        $('input[type="password"]').on('copy paste cut', function(e) { e.preventDefault(); return false; })
        							.on('keyup', function(e) {  // 不能输入空格
        								if(e.keyCode == 32) {
        									$(this).val($.trim($(this).val()));
        									//!tips && $.notify({message: '<i class="icon-info"></i> 密码不能包括空格！', timeout: 1000, onClose: function(){ tips = false }});
        									//tips = !0;
        									e.preventDefault();
        								}
        							})

      },
      // 扩展 tab
      extTab: function() {
        $('.tabs-btn').on('shown.ui.tab', function(e) {
          var $current = $(this),
              $prev = $(e.relatedTarget),
              panel = $current.attr('data-panel'),
              prevPanel = $prev.attr('data-panel');
          var $panel = $(panel),
              $prevPanel = $(prevPanel);

          if(panel !== prevPanel) {
            !!$panel.length && $panel.show();
            !!$prevPanel.length && $prevPanel.hide();
          }
        });
      },
      // 格式化银行卡
      formatCard: function() {
        /**
         * 卡号格式化
         * - 4位数字一个空格
         * @param str
           */
        function convertBankCard(str) {
          return str.replace(/\d{4}/g, function(match) {
            return match + '&emsp;';
          });
        }

        /**
         * 格式化动作
         */
        var format = function() {
          var that = $(this), thisVal = $.trim(that.val());
          var $target = that.next('.format-card');
          that.val(that.val().replace(/[^0-9]/g, ""));
          var thisVal = $.trim(that.val());
          // 清空文本框时
          if(thisVal === '' || thisVal != +thisVal){
            $target.html('').hide();
            return;
          }
          // 新添加元素
          if(!$target.length){
            $target = $('<div class="format-card"></div>');
            that.after($target);
          }

          // 显示格式化后的内容
          $target.show().html('<b class="warning-FontColor">'+ convertBankCard(thisVal)+'</b>');
        };

        // 限制数字
        var limit = function(e) {
          if(!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which >= 37 && e.which <= 40) || e.which == 8)) {
            return false;
          }
        };

        // 是否显示银行卡提示
        var show = function(e) {
          var $target = $(this).next('.format-card');
          $target.length && $target[e.type === 'focusin' ? 'show' : 'hide']();
        };

        // 事件代理
        $(document).on('keyup.formatCard', '[data-toggle="formatCard"]', format)
        // 限制输入数字
        $(document).on('keydown.formatCard', '[data-toggle="formatCard"]', limit)

        $(document).on('focus.formatCard blur.formatCard','[data-toggle="formatCard"]', show)
      },
      panel: function() {

        var toggle = function(e) {
          var that = $(this),
              $span = that.find('span'),
              isOpen = that.data('isOpen'),
              defaultText = $(this).data('defaultText'),
              text = $span.text(),
              $icon = that.find('i'),
              toggleText = $span.attr('data-text'),
              $target = $(that.attr('data-target'));

          if(!$target.length) return;

          if(!defaultText) {
            that.data('defaultText', (defaultText = text));
          }

          if(isOpen) {
            $target.slideUp(200);
            $.support.transition ? that.removeClass('active') : $icon.removeClass('icon-chevron-thin-up');
            $span.text(defaultText)
            that.data('isOpen', false)
          } else {
            $target.slideDown(400)
            $.support.transition ? that.addClass('active') : $icon.addClass('icon-chevron-thin-up');
            $span.text(toggleText)
            that.data('isOpen', true)
          }

          e.preventDefault();
        };

        // 展开更多
        $(document).on('click.panel', '[data-toggle="panel"]', toggle);
      }
    };

    $(document).ready(App.initPage);

    root.FrontUI = FrontUI;

})(window, jQuery);


//  简单封装一套弹窗，用于Alpha项目奇异的交互,by limit
;(function($) {
  function modal(){
    var me = this;
    me.data = {
      title : '提示',   //  默认标题
      close : false,    //  默认没有header的关闭按钮
      content : '',     //  默认内容为空
      buttons : {       //  默认按钮
        ok : {
          text : '确定',
          callback : function () {

          }
        },
        cancel : {
          text : '取消',
          callback : function () {

          }
        }
      }
    };

    //  事件绑定
    $("body").on("click","#modal-dialog .modal-close",function(){
      me.destroy();
    }).on("click","#modal-dialog .modal-ok",function(){
      if(me.data.buttons.ok && me.data.buttons.ok.callback){
        me.data.buttons.ok.callback();
      }
      me.destroy();
    }).on("click","#modal-dialog .modal-cancel",function(){
      if(me.data.buttons.cancel && me.data.buttons.cancel.callback){
        me.data.buttons.cancel.callback();
      }
      me.destroy();
    });

    //  方法
    me.display = function(data){
      me.dataSetting(data).renderRoot().render();
    }

    me.dataSetting = function(data){
      if(!data){ return me; }
      me.data = $.extend({},me.data,data);
      return me;
    }

    me.renderRoot = function(){
      var data = me.data;

      var header = me._renderHeader();
      var content = data.content;
      var buttons = me._renderButtons();

      me.root = '<div class="modal-background" data-keyboard="false" id="modal-dialog" role="dialog">\
                    <div class="modal-layer">\
                        <div class="modal-position">\
                            <div class="modal-wrap">\
                                ' + header + '\
                                <div class="modal-body">\
                                    ' + content + '\
                                    ' + buttons + '\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>';

      me.$root = $(me.root);

      return me;
    }

    me._renderHeader = function(){
      var data = me.data;
      var title = data.title;
      var close = data.close;
      if(!title && !close){
        return "";
      }

      title = !!title ? title : "";

      var closeBtn = close ? '<button class="modal-close" title="关闭"><i></i></button>' : '';

      var header = '<div class="modal-head">\
                        '+ title + closeBtn +'\
                    </div>';

      return header;
    }

    me._renderButtons = function(){
      var data = me.data;
      var buttons = data.buttons;

      if(!buttons || (!buttons.ok && !buttons.cancel) ){
        return "";
      }

      var okBtn = buttons.ok ? '<button type="button" class="btn primary modal-ok">' + buttons.ok.text + '</button>' : '';
      var cancelBtn = buttons.cancel ? '<button type="button" class="btn secondary modal-cancel">' + buttons.cancel.text + '</button>' : '';

      var buttons = '<div class="text-align-center margin-top-40px">\
                        <div class="btn-with-viceLink text-align-center plural-btns">\
                            ' + okBtn + cancelBtn +'\
                        </div>\
                    </div>';

      return buttons;

    }

    me.render = function(){
      $("body").append(me.$root);
      return me;
    }

    me.destroy = function(){
      me.$root.remove();
      return me;
    }
  }

  var Modal = new modal();

  $.extend({
    modal : function(data){
      Modal.display(data);
    },
    tipsModal : function(extendData){
      var close = extendData && extendData.close || false;      //  关闭按钮
      var type = extendData && extendData.type || 'success';    //  类型，有success info fail，默认为success
      var title = extendData && extendData.title || "";         //  内容title
      var modalTitle = extendData && extendData.modalTitle || false;  //  弹窗title
      var modalContent = extendData && extendData.content || "";      //  弹窗内容

      var content = '<div class="notice-wrap ' + type + ' in-modal">\
                       <div class="notice-box">\
                          <span class="notice-img"></span>\
                          <h3>' + title + '</h3>\
                          <p>' + modalContent + '</p>\
                       </div>\
                    </div>';
      var data = {
        modalTitle: modalTitle,
        title : modalTitle,
        close:  close ,
        content : content,
        buttons : extendData && extendData.buttons || false
      }

      Modal.display(data);
    }
  });

  ;(function($) {

  });

})(jQuery);

//防止页面刷新倒计时失效
/*
 * @param { Object } obj  获取验证码按钮
 */
function monitor( obj ) {

    var LocalDelay = getLocalDelay();

    var getCodeBtn = document.getElementById( "getCode" );

    if( LocalDelay.time != null ) {

        var timeLine = parseInt( ( new Date().getTime() - LocalDelay.time ) / 1000 );

        if ( timeLine > LocalDelay.delay ) {
            console.log( "验证码过期" );
        } else {
            _delay = LocalDelay.delay - timeLine;
            obj.text( _delay+"秒后重新发送" );
            getCodeBtn.disabled = true;
            getCodeBtn.className = "btn form-control-verify-btn disabled";
            var timer = setInterval(function() {
                if ( _delay > 1 ) {
                    _delay--;
                    obj.text( _delay+"秒后重新发送" );
                    setLocalDelay( _delay );
                } else {
                    clearInterval( timer );
                    getCodeBtn.disabled = false;
                    getCodeBtn.className = "btn form-control-verify-btn";
                    obj.text("获取验证码");
                }
            }, 1000);
        }
    }
};

//倒计时效果
/*
 *
 * @param {Object} obj 获取验证码按钮
 * @param {Function} callback  获取验证码接口函数
 */
function countDown( obj, callback ) {

    var getCodeBtn = document.getElementById( "getCode" );

    if ( obj.text() == "获取验证码" ) {
        var _delay = 60;
        var delay = _delay;
        obj.text( _delay+"秒后重新发送" );
        document.getElementById( "getCode" ).disabled = true;
        getCodeBtn.className = "btn form-control-verify-btn disabled";
        var timer = setInterval(function() {
            if ( delay > 1 ) {
                delay--;
                obj.html( delay+"秒后重新发送" );
                setLocalDelay( delay );
            } else {
                getCodeBtn.className = "btn form-control-verify-btn";
                getCodeBtn.disabled = false;
                clearInterval( timer );
                obj.text("获取验证码");
            }
        }, 1000);

        callback();
    } else {
        return false;
    }
}

//设置setLocalDelay
function setLocalDelay(delay) {
    //location.href作为页面的唯一标识，可能一个项目中会有很多页面需要获取验证码。
    sessionStorage.setItem("delay_" + location.href, delay);
    sessionStorage.setItem("time_" + location.href, new Date().getTime());
}

//getLocalDelay()
function getLocalDelay() {
    var LocalDelay = {};
    LocalDelay.delay = sessionStorage.getItem("delay_" + location.href);
    LocalDelay.time = sessionStorage.getItem("time_" + location.href);
    return LocalDelay;
}
