define("/WEB-UED/fancy/dist/p/userMessage/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var main = {
        init: function() {
            var self = this;
            self._event();
            self._getMes()
        },
        _event: function() {
            var self = this;
            var RegEx = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            var RegEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            $("#J-login-out").click(function() {
                $.ajax({
                    type: "get",
                    cach: false,
                    url: "/logout.do",
                    success: function(res) {
                        if (res.info.ok == true) {
                            var isios = G._navigator().ios;
                            var isAndroid = G._navigator.android;
                            if (isAndroid && window.mall && window.mall.removeToken) {
                                window.mall.removeToken()
                            } else if (isios) {
                                G.connectWebViewJavascriptBridge(function(bridge) {
                                    bridge.send({
                                        logout: true,
                                        globale: "logout"
                                    })
                                })
                            }
                            location.href = "/index.html"
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
            $("#save-loginid").unbind("click").bind("click", function() {
                var loginId = $("#loginid-input").val();
                if (!RegEx.test(loginId)) {
                    $.alert("输入不合法");
                    return
                }
                self._edit({
                    loginId: loginId
                });
                $.router.back("/customer/userMessage.html")
            });
            $("#save-nick-name").unbind("click").bind("click", function() {
                var name = $("#nick-name-input").val();
                if (!RegEx.test(name)) {
                    $.alert("输入不合法");
                    return
                }
                self._edit({
                    nickname: name
                });
                $.router.back("/customer/userMessage.html")
            });
            $("#save-email").unbind("click").bind("click", function() {
                var email = $("#email-input").val();
                if (!RegEmail.test(email)) {
                    $.alert("邮箱不合法");
                    return
                }
                self._edit({
                    email: email
                });
                $.router.back("/customer/userMessage.html")
            });
            $("#datetime-picker").calendar({
                inputReadOnly: true,
                onClose: function() {
                    var birth = $("#datetime-picker").val();
                    self._edit({
                        birthdayWeb: birth
                    })
                }
            });
            $("#edit-male").unbind().bind("click", function() {
                var buttons1 = [{
                    text: "请选择",
                    label: true
                }, {
                    text: "男",
                    color: "warning",
                    onClick: function() {
                        $("#edit-male .item-after").text("男");
                        self._edit({
                            sex: 1
                        })
                    }
                }, {
                    text: "女",
                    onClick: function() {
                        $("#edit-male .item-after").text("女");
                        self._edit({
                            sex: 2
                        })
                    }
                }];
                var buttons2 = [{
                    text: "取消",
                    bg: "danger"
                }];
                var groups = [buttons1, buttons2];
                $.actions(groups)
            })
        },
        _getMes: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/customer/getCustomer.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._setMes(res.data.customer);
                        self.token = res.data.token
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
        _setMes: function(res) {
            var self = this;
            var loginId = res.loginId || "";
            var nickname = res.nickname || "";
            var sex = res.sex == 1 ? "男" : "女" || "";
            var mobile = res.mobile || '<a class="external" href="/login/register.do?target=/customer/customerMsg.html">还没有手机信息，请填写></a>';
            var birthday = res.birthdayWeb || "";
            var email = res.email || "";
            $("#mobile").html(mobile);
            $("#loginId").text(loginId);
            $("#loginid-input").val(loginId);
            $("#nickname").text(nickname);
            $("#nick-name-input").val(nickname);
            $("#email").text(email);
            $("#email-input").val(email);
            $("#sex").text(sex);
            $("#datetime-picker").val(birthday);
            self.customerId = res.customerId
        },
        _edit: function(data) {
            var self = this;
            data = $.extend(data, {
                customerId: self.customerId,
                token: self.token
            });
            $.ajax({
                type: "get",
                cach: false,
                url: "/customer/updateCustomer.json",
                data: data,
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getMes()
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