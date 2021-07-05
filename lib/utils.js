/**
 * 格式化日期时间
 *
 * @param {Object,String} time 日期时间
 * @param {String} cFormat 格式规则
 * @return 格式化后的日期
 *
 */
export function parseTime(time, cFormat = "") {
    if (arguments.length === 0) {
        return null;
    }
    //const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    const format = cFormat || "{y}.{m}.{d}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (("" + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return time_str;
}
/**
 * 格式化时间戳
 *
 * @param {String} time 时间戳
 * @param {String} option 格式规则
 * @return 格式化后的日期
 *
 */
export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/**
 * 获取url参数对象
 *
 * @param {String} url url
 * @return 参数对象
 *
 */
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf("?") + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        // eslint-disable-next-line no-control-regex
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1;
        } else {
            len += 0.5;
        }
    }
    return Math.floor(len);
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) return "";
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return "";
            return (
                encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
            );
        })
    ).join("&");
}

export function param2Obj(url) {
    const search = url.split("?")[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
            '"}'
    );
}

export function html2Text(val) {
    const div = document.createElement("div");
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
    /* Merges two  objects,
   giving the last one precedence */

    if (typeof target !== "object") {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === "object") {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

export function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;
    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += "" + className;
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}
export function removeClasss(ele, txt) {
    var str = ele.className,
        index = str.indexOf(txt);
    if (index > -1) {
        ele.className = str.replace(txt, "");
    }
}

export const pickerOptions = [
    {
        text: "今天",
        onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().toDateString());
            end.setTime(start.getTime());
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近一周",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近一个月",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近三个月",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
        }
    }
];

export function getTime(type) {
    if (type === "start") {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "shallowClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

export function getCookie(cookieName) {
    //获取所有的cookie "psw=1234we; rememberme=true; user=Annie"
    var totalCookie = document.cookie;
    //获取参数所在的位置
    var cookieStartAt = totalCookie.indexOf(cookieName + "=");
    //判断参数是否存在 不存在直接返回
    // eslint-disable-next-line eqeqeq
    if (cookieStartAt == -1) {
        return;
    }
    //获取参数值的开始位置
    var valueStartAt = totalCookie.indexOf("=", cookieStartAt) + 1;
    //以;来获取参数值的结束位置
    var valueEndAt = totalCookie.indexOf(";", cookieStartAt);
    //如果没有;则是最后一位
    // eslint-disable-next-line eqeqeq
    if (valueEndAt == -1) {
        valueEndAt = totalCookie.length;
    }
    //截取参数值的字符串
    var cookieValue = unescape(totalCookie.substring(valueStartAt, valueEndAt));
    return cookieValue;
}
export function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}

export function getCurrentMonth(val) {
    var myDate = val || new Date()
    var tYear = myDate.getFullYear()
    var tMonth = myDate.getMonth()

    var m = tMonth + 1
    // eslint-disable-next-line eqeqeq
    if (m.toString().length == 1) {
        m = "0" + m
    }
    return tYear + "-" + m;
}
export function getCurrentYear(val) {
    var myDate = val || new Date()
    var tYear = myDate.getFullYear()
    return tYear;
}
export function getCurrentDay(val) {
    var date = val || new Date()
    var seperator1 = "-"
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
}

export function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        // eslint-disable-next-line eqeqeq
        if (pair[0] == variable) {
            return pair[1]
        }
    }
    return false;
}
export function getRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    // eslint-disable-next-line no-new-object
    var theRequest = new Object()
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(
                strs[i].split("=")[1]
            )
        }
    }
    return theRequest
}

export function detect() {
    if (isServer) return

    let { userAgent, platform } = window.navigator
    var ua = userAgent;
    var os = {},
        browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        ie =
            ua.match(/MSIE\s([\d.]+)/) ||
            ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview =
            !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari =
            webview ||
            ua.match(
                /Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/
            );

    if ((browser.webkit = !!webkit)) browser.version = webkit[1];

    if (android) (os.android = true), (os.version = android[2]);
    if (iphone && !ipod)
        (os.ios = os.iphone = true),
        (os.version = iphone[2].replace(/_/g, "."));
    if (ipad)
        (os.ios = os.ipad = true), (os.version = ipad[2].replace(/_/g, "."));
    if (ipod)
        (os.ios = os.ipod = true),
        (os.version = ipod[3] ? ipod[3].replace(/_/g, ".") : null);
    if (wp) (os.wp = true), (os.version = wp[1]);
    if (webos) (os.webos = true), (os.version = webos[2]);
    if (touchpad) os.touchpad = true;
    if (blackberry) (os.blackberry = true), (os.version = blackberry[2]);
    if (bb10) (os.bb10 = true), (os.version = bb10[2]);
    if (rimtabletos) (os.rimtabletos = true), (os.version = rimtabletos[2]);
    if (playbook) browser.playbook = true;
    if (kindle) (os.kindle = true), (os.version = kindle[1]);
    if (silk) (browser.silk = true), (browser.version = silk[1]);
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
    if (chrome) (browser.chrome = true), (browser.version = chrome[1]);
    if (firefox) (browser.firefox = true), (browser.version = firefox[1]);
    if (ie) (browser.ie = true), (browser.version = ie[1]);
    if (safari && (osx || os.ios || win)) {
        browser.safari = true;
        if (!os.ios) browser.version = safari[1];
    }
    if (webview) browser.webview = true;

    os.tablet = !!(
        ipad ||
        playbook ||
        (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) ||
        (ie && !ua.match(/Phone/) && ua.match(/Touch/))
    );
    os.phone = !!(
        !os.tablet &&
        !os.ipod &&
        (android ||
            iphone ||
            webos ||
            blackberry ||
            bb10 ||
            (chrome && ua.match(/Android/)) ||
            (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
            (firefox && ua.match(/Mobile/)) ||
            (ie && ua.match(/Touch/)))
    );

    browser.special = {
        safari: /Safari/gi.test(navigator.appVersion),
        qq: /MQQBrowser|CriOS/.test(ua),
        baidu: /baidubrowser/.test(ua),
        uc: /UCBrowser/.test(ua)
    };

    return {
        os,
        browser
    }
}

export function isWxBrowser() {
    const ua = navigator.userAgent.toLowerCase()
    return /micromessenger/.test(ua) ? true : false
}

 
function guid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    var uuid = s.join("");
    return uuid;
} 
	 
export  function getUID(key) {    
		 try {
		     const value = uni.getStorageSync(key);
		     if (value) {
		         return value;
		     }else{
				let uid = guid();
				 try {
				     uni.setStorageSync(key, uid);
				 } catch (e) {
				      
				 }
				return uid;
			 }
		 } catch (e) {
		     
		 }
  }
   
 function bodyMoveEvent(e){
 	e.preventDefault()
 }
 
 export  function removeBodyEvent(){
 		//#ifdef H5  
 	document.body.removeEventListener( 'touchmove',bodyMoveEvent, {
 		passive: false
 	})
 		//#endif
 }
  export function bindBodyEvent(){
 	//#ifdef H5  
 	document.body.addEventListener( 'touchmove',bodyMoveEvent, {
 		passive: false
 	})  
 	//#endif
 }
   function tow(n) {
     return n >= 0 && n < 10 ? '0' + n : '' + n;
   } 
 /* 倒计时 */
 export function timeCount(endtime = 1575542975){   
			  let newTime = endtime;//2019年距离1970年的毫秒数
			  let second = Math.floor((newTime*1000 - new Date().getTime()) / 1000);//未来时间距离现在的秒数
			  let day = Math.floor(second / 86400);
			  let  leave1 = second % 86400;//余数代表剩下的秒数；
			  let hour = Math.floor(leave1 / 3600);//整数部分代表小时；
			  let leave2 = leave1 % 3600; //余数代表 剩下的秒数；
			  var minute = Math.floor(leave2 / 60);
			  let  leave3  = leave2 % 60; 
			  var seconds = Math.round( leave3 );
			   let str  = '';
			    if(day > 0 ){
					str+= tow(day) + '天'
			    }
				str += tow(hour) + ':';
				str +=tow(minute) + ':' ;
				str +=tow(seconds);
			   return str
 }

