define("/WEB-UED/fancy/dist/p/login/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/md5-debug", "/WEB-UED/fancy/dist/c/js/base64-debug"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var md5 = require("/WEB-UED/fancy/dist/c/js/md5-debug").md5;
    var encode64 = require("/WEB-UED/fancy/dist/c/js/base64-debug").encode64;
    var main = {
        init: function() {
            var self = this;
            self.target = G._getUrlParam("target") || "";
            self.loginToken = $("#J-loginToken").val();
            if (self.target.indexOf("fsl/") != -1) {
                var isios = G._navigator().ios;
                var isAndroid = G._navigator.android;
                if (isAndroid && window.mall && window.mall.fslLogin) {
                    window.mall.fslLogin()
                } else if (isios) {
                    G.connectWebViewJavascriptBridge(function(bridge) {
                        bridge.send({
                            globale: "fslLogin"
                        })
                    })
                }
            } else {
                $(".theme-pink").removeClass("hide")
            }
            self._login();
            self._event();
            $("a.add-target").each(function() {
                var url = $(this).attr("href") + "?target=" + self.target;
                $(this).attr("href", url)
            })
        },
        _event: function() {
            var self = this
        },
        _login: function() {
            var self = this;
            var $nameInput = $("#J-login-name");
            var $passwordInput = $("#J-login-password");
            var $btn = $("#J-login-btn");
            var name, password;
            $passwordInput.bind("keyup", function() {
                var $this = $(this);
                if ($this.val().length >= 4 && $nameInput.val().length > 0) {
                    $btn.removeClass("color-gray")
                } else {
                    $btn.addClass("color-gray")
                }
            });
            $nameInput.bind("keyup", function() {
                $passwordInput.val("");
                $btn.addClass("color-gray")
            });
            $btn.unbind("click").bind("click", function() {
                var $this = $(this);
                var flag = $this.hasClass("color-gray");
                var mobileReg = /^1[3|4|5|8][0-9]\d{4,8}$/;
                name = $nameInput.val();
                password = $passwordInput.val();
                if (flag) {
                    alert("请正确输入用户名，密码")
                } else {
                    password32 = encode64(self.loginToken + password);
                    password = md5(self.loginToken + md5(password));
                    self._go({
                        mobile: name,
                        password: password,
                        password32: password32
                    })
                }
            })
        },
        _go: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/login/jsonLogin.do",
                data: data,
                success: function(res) {
                    var url = G._getUrlParam("target") || "/index.html";
                    if (res.info.ok == true) {
                        if (res.data.loginResult) {
                            var fancyId = res.data.loginUser.fancyId || "";
                            var mobile = res.data.loginUser.mobile || "";
                            var token = res.data.loginUser.token || "";
                            var isios = G._navigator().ios;
                            var isAndroid = G._navigator.android;
                            if (isAndroid && window.mall && window.mall.setToken) {
                                window.mall.setToken("{token:" + token + ",fid:" + fancyId + ",mobile:" + mobile + "}")
                            } else if (isios) {
                                G.connectWebViewJavascriptBridge(function(bridge) {
                                    bridge.send({
                                        token: token,
                                        fid: fancyId,
                                        mobile: mobile,
                                        globale: "login"
                                    })
                                })
                            }
                            location.href = url
                        } else {
                            self.loginToken = res.data.loginToken;
                            alert(res.data.errorMsg)
                        }
                    } else {
                        alert(res.info.message)
                    }
                },
                beforeSend: function() {
                    $.showIndicator()
                },
                complete: function() {
                    $.hideIndicator()
                },
                error: function() {}
            })
        }
    };
    main.init()
});
define("/WEB-UED/fancy/dist/c/js/globale-debug", [], function(require, exports, module) {
    var main = {
        init: function() {
            var self = this;
            self._back()
        },
        _back: function() {
            var self = this;
            if (self._navigator().mobileWebKit) {
                $(".J-back").off().on("click", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    window.history.go(-1)
                })
            }
        },
        _getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null
        },
        _getLoginUser: function(callback) {
            var self = main;
            var loginUser;
            $.ajax({
                type: "get",
                cache: false,
                url: "/login/getLoginUser.do",
                success: function(res) {
                    if (res.info.ok == true) {
                        loginUser = res.data.loginUser;
                        window.fancyLoginUser = loginUser;
                        if (callback) {
                            callback(loginUser)
                        }
                    } else {
                        alert(res.info.message)
                    }
                },
                beforeSend: function() {},
                complete: function() {},
                error: function() {}
            })
        },
        _getCartCount: function(userMes) {
            var self = this;
            userMes = userMes || window.fancyLoginUser;
            if (!userMes) {
                return
            }
            $.ajax({
                type: "get",
                cache: false,
                url: "/cart/countCart.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        if (res.data.count > 0) {
                            $("#J-cart-count").show().html(res.data.count)
                        }
                    } else {
                        alert(res.info.message)
                    }
                },
                beforeSend: function() {
                    $.showIndicator()
                },
                complete: function() {
                    $.hideIndicator()
                },
                error: function() {}
            })
        },
        _editCount: function(d) {
            var box = $(d.box);
            var defaultCount = d.defaultCount || 1;
            box.html('<p class="edit-count color-gray">                <i class="iconfont J-cut">&#xe607;</i>                <span class="J-number">' + defaultCount + '</span>                <i class="iconfont J-add">&#xe608;</i>            </p>');
            $(".J-cut").bind("click", function() {
                var curNum = parseInt($(this).parent().find(".J-number").text());
                if (curNum <= 1) {
                    return
                } else {
                    $(this).parent().find(".J-number").text(curNum - 1)
                }
            });
            $(".J-add").bind("click", function() {
                var curNum = parseInt($(this).parent().find(".J-number").text());
                $(this).parent().find(".J-number").text(curNum + 1)
            })
        },
        _navigator: function() {
            var u = navigator.userAgent;
            return {
                isWeixin: u.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
                trident: u.indexOf("Trident") > -1,
                presto: u.indexOf("Presto") > -1,
                webKit: u.indexOf("AppleWebKit") > -1,
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
                deskWebkit: u.indexOf("Android") == -1 && u.indexOf("Mobile") == -1,
                mobileWebKit: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/) || !!u.match(/.*Mobile.*/),
                ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/),
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
                iPhone: u.indexOf("iPhone") > -1 && u.indexOf("Mac") > -1,
                iPad: u.indexOf("iPad") > -1,
                webApp: u.indexOf("Safari") == -1
            }
        },
        connectWebViewJavascriptBridge: function(callback) {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge)
            } else {
                document.addEventListener("WebViewJavascriptBridgeReady", function() {
                    callback(WebViewJavascriptBridge)
                }, false)
            }
        },
        _scroll: function(obj) {
            var self = this;
            if (!obj) obj = $(".content");
            $.config = {
                showPageLoadingIndicator: true
            };
            if (self._navigator().ios) {
                self.scroller = {
                    type: "js"
                }
            } else {
                self.scroller = {
                    type: "auto"
                }
            }
            obj.scroller(self.scroller)
        }
    };
    module.exports = main;
    main.init()
});
define("/WEB-UED/fancy/dist/c/js/md5-debug", [], function(require, exports, module) {
    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3])
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32(a << s | a >>> 32 - s, b)
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn(b & c | ~b & d, a, b, x, s, t)
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn(b & d | c & ~d, a, b, x, s, t)
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t)
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | ~d), a, b, x, s, t)
    }

    function md51(s) {
        if (/[\x80-\xFF]/.test(s)) {
            s = unescape(encodeURI(s))
        }
        txt = "";
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)))
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
        tail[i >> 2] |= 128 << (i % 4 << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state
    }

    function md5blk(s) {
        var md5blks = [],
            i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24)
        }
        return md5blks
    }
    var hex_chr = "0123456789abcdef".split("");

    function rhex(n) {
        var s = "",
            j = 0;
        for (; j < 4; j++) s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
        return s
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
        return x.join("")
    }
    var md5 = function(s) {
        return hex(md51(s))
    };

    function add32(a, b) {
        return a + b & 4294967295
    }
    if (md5("hello") != "5d41402abc4b2a76b9719d911017c592") {
        function add32(x, y) {
            var lsw = (x & 65535) + (y & 65535),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return msw << 16 | lsw & 65535
        }
    }
    exports.md5 = md5
});
define("/WEB-UED/fancy/dist/c/js/base64-debug", [], function(require, exports, module) {
    var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";

    function encode64(input) {
        input = unicodetoBytes(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];
            enc1 = chr1 >> 2;
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else if (isNaN(chr3)) {
                enc4 = 64
            }
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = ""
        } while (i < input.length);
        return output
    }

    function decode64(input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        var base64test = /[^A-Za-z0-9\/+\/\/\/=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text./n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/', and '='/n" + "Expect errors in decoding.")
        }
        input = input.replace(/[^A-Za-z0-9\/+\/\/\/=]/g, "");
        output = new Array;
        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
            output.push(chr1);
            if (enc3 != 64) {
                output.push(chr2)
            }
            if (enc4 != 64) {
                output.push(chr3)
            }
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = ""
        } while (i < input.length);
        return bytesToUnicode(output)
    }

    function unicodetoBytes(s) {
        var result = new Array;
        if (s == null || s == "") return result;
        result.push(255);
        result.push(254);
        for (var i = 0; i < s.length; i++) {
            var c = s.charCodeAt(i).toString(16);
            if (c.length == 1) i = "000" + c;
            else if (c.length == 2) c = "00" + c;
            else if (c.length == 3) c = "0" + c;
            var var1 = parseInt(c.substring(2), 16);
            var var2 = parseInt(c.substring(0, 2), 16);
            result.push(var1);
            result.push(var2)
        }
        return result
    }

    function bytesToUnicode(bs) {
        var result = "";
        var offset = 0;
        if (bs.length >= 2 && bs[0] == 255 && bs[1] == 254) offset = 2;
        for (var i = offset; i < bs.length; i += 2) {
            var code = bs[i] + (bs[i + 1] << 8);
            result += String.fromCharCode(code)
        }
        return result
    }
    exports.encode64 = encode64
});