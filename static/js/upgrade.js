/*!
 * https://github.com/tomieric/killie6-zh
 * http://getf2e.com
 */
~(function(root){
	var browserCheck = function(){
        var userAgent = navigator.userAgent.toLowerCase();
        var browser = {
            version: (userAgent.match( /.+(?:rv|it|ra|ie|me|on)[\/: ]([\d.]+)/ ) || [])[1],
            chrome: /chrome/.test( userAgent ),
            safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
            webkit: /webkit/.test( userAgent ),
            opera: /opera/.test( userAgent ),
            msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
            mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
            ios: userAgent.match(/iPad/i) || userAgent.match(/iPhone/i),
            isMobile: /iPhone/.test( userAgent ) || /iPad/.test( userAgent ) || /iPod/.test( userAgent ) || /Android/.test( userAgent )
        };

        return browser;
    };

    var aimH = function(obj, start, end) {
    	var timer = setInterval(function(){
    		if(start >= end) {
    			clearInterval(timer);
    			obj.style.height = end + 'px';
    		} else {
    			start += 5;
    			obj.style.height = start +'px';
    		}
    	}, 50);
    };

    /**
     * 提示浏览器版本
     * @return
     */
    var upgrade =  function(browser, ieVer) {
    	browser = browser || 'msie';
    	ieVer = ieVer || 8;
        var b = browserCheck();

        if(b[browser] && b.version <= ieVer) {

        	var obj = document.createElement('div');
        	obj.className = 'browser-upgrade';
        	obj.innerHTML = '您的浏览器版本为Internet Explorer '+ ieVer +'及以下，为了更好的浏览体验，请升级到<a href="http://cdn.dmeng.net/upgrade-your-browser.html" target="_blank"><span>标准浏览器</span></a>！';
        	document.body.insertBefore(obj, document.body.firstChild);

        	aimH(obj, 0, 30);
        }
    }

    root.BrowserUpgrade = upgrade;
})(window);
