define("/WEB-UED/fancy/dist/p/register/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/base64-debug"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var encode64 = require("/WEB-UED/fancy/dist/c/js/base64-debug").encode64;
    var main = {
        init: function() {
            var self = this;
            self.loginToken = $("#J-loginToken").val();
            self._event();
            self.target = G._getUrlParam("target") || "";
            $("a.add-target").each(function() {
                var url = $(this).attr("href") + "?target=" + self.target;
                $(this).attr("href", url)
            })
        },
        _event: function() {
            var timer;
            var self = this;
            var mobileInput = $("#J-phonenumber");
            var codeInput = $("#J-register-code");
            var passwordInput = $("#J-register-password");
            var passwordAgainInput = $("#J-register-password-again");
            var mobileReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
            mobileInput.unbind("keyup").bind("keyup", function() {
                if (mobileReg.test(mobileInput.val())) {
                    $("#J-next").attr("href", "#next-page").removeClass("external")
                } else {
                    $("#J-next").attr("href", "javascript:").addClass("external")
                }
            });
            $("#J-next").unbind("click").bind("click", function() {
                if ($(this).hasClass("external")) {
                    alert("请输入正确的手机号码")
                } else {
                    clearInterval(timer);
                    $("#J-register-code-box a").html("获取验证码")
                }
            });
            $("#J-register-code-box a").unbind("click").bind("click", function() {
                var $this = $(this);
                var time = 60;
                $.ajax({
                    type: "get",
                    cach: false,
                    url: "/login/ucSendRegisterVerifyCode.do",
                    data: {
                        mobile: mobileInput.val()
                    },
                    success: function(res) {
                        if (res.info.ok == true) {
                            $this.text("剩余" + time + "秒");
                            clearInterval(timer);
                            timer = setInterval(function() {
                                if (time <= 0) {
                                    $this.text("重新获取");
                                    clearInterval(timer)
                                } else {
                                    time--;
                                    $this.text("剩余" + time + "秒")
                                }
                            }, 1e3)
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
            });
            $("#J-register-btn").unbind("click").bind("click", function() {
                var mobile = $("#J-phonenumber").val();
                var code = $("#J-register-code").val();
                var password = $("#J-register-password").val();
                var passwordAgain = $("#J-register-password-again").val();
                if (!code.length) {
                    alert("请输入验证码");
                    return
                }
                if (!password.length) {
                    alert("请输入密码");
                    return
                } else if (password.length < 6) {
                    alert("密码长度不能少于6位");
                    return
                }
                if (!passwordAgain.length) {
                    alert("请确认密码");
                    return
                }
                if (password != passwordAgain) {
                    alert("两次输入密码不一致");
                    return
                }
                password = self.loginToken + password;
                password = encode64(password);
                self._register({
                    mobile: mobile,
                    vCode: code,
                    password: password
                })
            })
        },
        _register: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/login/jsonRegister.do",
                data: data,
                success: function(res) {
                    var url = "/index.html";
                    if (window.fancyLoginUser) {
                        url = G._getUrlParam("target") || "/index.html"
                    } else {
                        url = "/login.do?target=" + G._getUrlParam("target")
                    }
                    if (res.info.ok == true) {
                        location.href = url
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