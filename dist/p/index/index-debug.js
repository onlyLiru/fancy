define("/WEB-UED/fancy/dist/p/index/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var main = {
        init: function() {
            var self = main;
            self._event();
            if (!window.sessionStorage.getDialog) {
                window.sessionStorage.getDialog = "true"
            }
            if (window.sessionStorage.getDialog == "true") {
                self._getImg()
            }

            function doUpload() {
                var formData = new FormData($("#uploadForm")[0]);
                $.ajax({
                    url: "/upload/uploadUserHeaderImage.json",
                    type: "POST",
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(returndata) {
                        alert(returndata)
                    },
                    error: function(returndata) {
                        alert(returndata)
                    }
                })
            }
            $("#file").on("change", doUpload)
        },
        _getImg: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/home/getGuidingLayer.do",
                success: function(res) {
                    if (res.info.ok == true) {
                        if (res.data.imgList && res.data.imgList.length) {
                            var html = [];
                            $.each(res.data.imgList, function(i, item) {
                                html.push('<div class="swiper-slide"><a href="' + item.goodsUrl + '" class="external auto-img"><img src="' + item.imageUrl + '"></a></div>')
                            });
                            self._dialog(html.join(""));
                            window.sessionStorage.getDialog = "false"
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
        _dialog: function(data) {
            var modal = $.modal({
                afterText: '<div class="swiper-container">' + '<div class="swiper-pagination"></div>' + '<div class="swiper-wrapper">' + data + "</div>" + "</div>",
                buttons: [{
                    text: '<i class="iconfont fz26 color-white">&#xe681;</i>'
                }]
            });
            $.swiper($(modal).find(".swiper-container"), {
                pagination: ".swiper-pagination",
                effect: "coverflow",
                loop: true,
                autoHeight: true,
                autoplay: 3e3
            })
        },
        _event: function() {
            var self = this;
            if (window.fancyLoginUser && window.fancyLoginUser.loginType && window.fancyLoginUser.loginType == 2) {
                $("#shut-fmall-btn").show()
            }
            if (window.fancyLoginUser) {
                var name = window.fancyLoginUser.nickname || window.fancyLoginUser.mobile || "游客";
                $(".me span").text(name)
            } else {
                $(".me span").text("游客");
                var isios = G._navigator().ios;
                var isAndroid = G._navigator.android;
                if (isAndroid && window.mall && window.mall.getToken) {
                    var appUser = window.mall.getToken();
                    var appUser = eval("(" + appUser + ")");
                    var token = appUser.token;
                    var fancyId = appUser.fid;
                    var firstLogin = appUser.firstLogin;
                    var mobile = appUser.mobile;
                    if (firstLogin) {
                        self._appLogin({
                            token: token,
                            fancyId: fancyId,
                            mobile: mobile
                        })
                    }
                } else if (isios) {
                    G.connectWebViewJavascriptBridge(function(bridge) {
                        bridge.init(function(data) {
                            self._appLogin({
                                token: data.token,
                                fancyId: data.fid,
                                mobile: data.mobile
                            })
                        })
                    })
                }
            }
            $("#shut-fmall-btn").bind("click", function() {
                if (G._navigator().ios) {
                    $("body").append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=close" ></iframe>')
                } else if (G._navigator().android) {
                    window.mall.h5Finish()
                }
            });
            $("#barcode").bind("click", function() {
                if (G._navigator().ios) {
                    $("body").append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=barcode" ></iframe>')
                } else if (G._navigator().android) {
                    window.mall.barcode()
                }
            })
        },
        _appLogin: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/login/appAutoLogin.do",
                data: data,
                success: function(res) {
                    if (res.info.ok == true) {
                        if (res.data.isLogin == true) {
                            var name = res.data.loginUser.nickname || res.data.loginUser.mobile || "游客";
                            $(".me span").text(name)
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
                error: function() {
                    alert("error")
                }
            })
        }
    };
    G._getLoginUser(main.init)
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