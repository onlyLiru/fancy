!function(a){function b(a){return Object.prototype.toString.call(a)}function c(a){return"[object Object]"===b(a)}function d(a){return"[object Function]"===b(a)}function e(a,b){for(var c=0,d=a.length;d>c&&b.call(a,a[c],c)!==!1;c++);}function f(a){if(!p.test(a))return null;var b,c,d,e,f;if(-1!==a.indexOf("trident/")&&(b=/\btrident\/([0-9.]+)/.exec(a),b&&b.length>=2)){d=b[1];var g=b[1].split(".");g[0]=parseInt(g[0],10)+4,f=g.join(".")}b=p.exec(a),e=b[1];var h=b[1].split(".");return"undefined"==typeof f&&(f=e),h[0]=parseInt(h[0],10)-4,c=h.join("."),"undefined"==typeof d&&(d=c),{browserVersion:f,browserMode:e,engineVersion:d,engineMode:c,compatible:d!==c}}function g(b){if(o)try{var c=o.twGetRunPath.toLowerCase(),d=o.twGetSecurityID(a),e=o.twGetVersion(d);if(c&&-1===c.indexOf(b))return!1;if(e)return{version:e}}catch(f){}}function h(a,e,f){var g=d(e)?e.call(null,f):e;if(!g)return null;var h={name:a,version:k,codename:""},i=b(g);if(g===!0)return h;if("[object String]"===i){if(-1!==f.indexOf(g))return h}else{if(c(g))return g.hasOwnProperty("version")&&(h.version=g.version),h;if(g.exec){var j=g.exec(f);if(j)return h.version=j.length>=2&&j[1]?j[1].replace(/_/g,"."):k,h}}}function i(a,b,c,d){var f=u;e(b,function(b){var c=h(b[0],b[1],a);return c?(f=c,!1):void 0}),c.call(d,f.name,f.version)}var j={},k="-1",l=navigator.userAgent||"",m=navigator.appVersion||"",n=navigator.vendor||"",o=a.external,p=/\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/,q=[["nokia",function(a){return-1!==a.indexOf("nokia ")?/\bnokia ([0-9]+)?/:-1!==a.indexOf("noain")?/\bnoain ([a-z0-9]+)/:/\bnokia([a-z0-9]+)?/}],["samsung",function(a){return-1!==a.indexOf("samsung")?/\bsamsung(?:\-gt)?[ \-]([a-z0-9\-]+)/:/\b(?:gt|sch)[ \-]([a-z0-9\-]+)/}],["wp",function(a){return-1!==a.indexOf("windows phone ")||-1!==a.indexOf("xblwp")||-1!==a.indexOf("zunewp")||-1!==a.indexOf("windows ce")}],["pc","windows"],["ipad","ipad"],["ipod","ipod"],["iphone",/\biphone\b|\biph(\d)/],["mac","macintosh"],["mi",/\bmi[ \-]?([a-z0-9 ]+(?= build))/],["aliyun",/\baliyunos\b(?:[\-](\d+))?/],["meizu",/\b(?:meizu\/|m)([0-9]+)\b/],["nexus",/\bnexus ([0-9s.]+)/],["huawei",function(a){return-1!==a.indexOf("huawei-huawei")?/\bhuawei\-huawei\-([a-z0-9\-]+)/:/\bhuawei[ _\-]?([a-z0-9]+)/}],["lenovo",function(a){return-1!==a.indexOf("lenovo-lenovo")?/\blenovo\-lenovo[ \-]([a-z0-9]+)/:/\blenovo[ \-]?([a-z0-9]+)/}],["zte",function(a){return/\bzte\-[tu]/.test(a)?/\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/:/\bzte[ _\-]?([a-su-z0-9\+]+)/}],["vivo",/\bvivo ([a-z0-9]+)/],["htc",function(a){return/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(a)?/\bhtc[ _\-]?([a-z0-9 ]+(?= build))/:/\bhtc[ _\-]?([a-z0-9 ]+)/}],["oppo",/\boppo[_]([a-z0-9]+)/],["konka",/\bkonka[_\-]([a-z0-9]+)/],["sonyericsson",/\bmt([a-z0-9]+)/],["coolpad",/\bcoolpad[_ ]?([a-z0-9]+)/],["lg",/\blg[\-]([a-z0-9]+)/],["android","android"],["blackberry","blackberry"]],r=[["wp",function(a){return-1!==a.indexOf("windows phone ")?/\bwindows phone (?:os )?([0-9.]+)/:-1!==a.indexOf("xblwp")?/\bxblwp([0-9.]+)/:-1!==a.indexOf("zunewp")?/\bzunewp([0-9.]+)/:"windows phone"}],["windows",/\bwindows nt ([0-9.]+)/],["macosx",/\bmac os x ([0-9._]+)/],["ios",function(a){return/\bcpu(?: iphone)? os /.test(a)?/\bcpu(?: iphone)? os ([0-9._]+)/:-1!==a.indexOf("iph os ")?/\biph os ([0-9_]+)/:/\bios\b/}],["yunos",/\baliyunos ([0-9.]+)/],["android",/\bandroid[\/\- ]?([0-9.x]+)?/],["chromeos",/\bcros i686 ([0-9.]+)/],["linux","linux"],["windowsce",/\bwindows ce(?: ([0-9.]+))?/],["symbian",/\bsymbian(?:os)?\/([0-9.]+)/],["meego",/\bmeego\b/],["blackberry","blackberry"]],s=[["trident",p],["webkit",/\bapplewebkit[\/]?([0-9.+]+)/],["gecko",/\bgecko\/(\d+)/],["presto",/\bpresto\/([0-9.]+)/],["androidwebkit",/\bandroidwebkit\/([0-9.]+)/],["coolpadwebkit",/\bcoolpadwebkit\/([0-9.]+)/]],t=[["sg",/ se ([0-9.x]+)/],["tw",function(){var a=g("theworld");return"undefined"!=typeof a?a:"theworld"}],["360",function(a){var b=g("360se");return"undefined"!=typeof b?b:-1!==a.indexOf("360 aphone browser")?/\b360 aphone browser \(([^\)]+)\)/:/\b360(?:se|ee|chrome|browser)\b/}],["mx",function(){try{if(o&&(o.mxVersion||o.max_version))return{version:o.mxVersion||o.max_version}}catch(a){}return/\bmaxthon(?:[ \/]([0-9.]+))?/}],["qq",/\bm?qqbrowser\/([0-9.]+)/],["green","greenbrowser"],["tt",/\btencenttraveler ([0-9.]+)/],["lb",function(a){if(-1===a.indexOf("lbbrowser"))return!1;var b;try{o&&o.LiebaoGetVersion&&(b=o.LiebaoGetVersion())}catch(c){}return{version:b||k}}],["tao",/\btaobrowser\/([0-9.]+)/],["fs",/\bcoolnovo\/([0-9.]+)/],["sy","saayaa"],["baidu",/\bbidubrowser[ \/]([0-9.x]+)/],["ie",p],["mi",/\bmiuibrowser\/([0-9.]+)/],["opera",function(a){var b=/\bopera.+version\/([0-9.ab]+)/,c=/\bopr\/([0-9.]+)/;return b.test(a)?b:c}],["chrome",/ (?:chrome|crios|crmo)\/([0-9.]+)/],["uc",function(a){return a.indexOf("ucbrowser/")>=0?/\bucbrowser\/([0-9.]+)/:/\buc\/[0-9]/.test(a)?/\buc\/([0-9.]+)/:a.indexOf("ucweb")>=0?/\bucweb[\/]?([0-9.]+)?/:/\b(?:ucbrowser|uc)\b/}],["android",function(a){return-1!==a.indexOf("android")?/\bversion\/([0-9.]+(?: beta)?)/:void 0}],["safari",/\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],["webview",/\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],["firefox",/\bfirefox\/([0-9.ab]+)/],["nokia",/\bnokiabrowser\/([0-9.]+)/]],u={name:"na",version:k},v=function(a){a=(a||"").toLowerCase();var b={};i(a,q,function(a,c){var d=parseFloat(c);b.device={name:a,version:d,fullVersion:c},b.device[a]=d},b),i(a,r,function(a,c){var d=parseFloat(c);b.os={name:a,version:d,fullVersion:c},b.os[a]=d},b);var c=f(a);return i(a,s,function(a,d){var e=d;c&&(d=c.engineVersion||c.engineMode,e=c.engineMode);var f=parseFloat(d);b.engine={name:a,version:f,fullVersion:d,mode:parseFloat(e),fullMode:e,compatible:c?c.compatible:!1},b.engine[a]=f},b),i(a,t,function(a,d){var e=d;c&&("ie"===a&&(d=c.browserVersion),e=c.browserMode);var f=parseFloat(d);b.browser={name:a,version:f,fullVersion:d,mode:parseFloat(e),fullMode:e,compatible:c?c.compatible:!1},b.browser[a]=f},b),b};j=v(l+" "+m+" "+n),j.parse=v,"function"==typeof define?define("arale/detector/1.3.0/detector",[],function(a,b,c){c.exports=j}):a.detector=j}(this);
