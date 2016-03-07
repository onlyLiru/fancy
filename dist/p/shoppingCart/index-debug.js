define("/WEB-UED/fancy/dist/p/shoppingCart/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/p/shoppingCart/list-debug.handlebars"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var Tlist = require("/WEB-UED/fancy/dist/p/shoppingCart/list-debug.handlebars");
    var main = {
        isFirstLoad: true,
        init: function() {
            var self = this;
            var from = $("#J-from").val();
            self.PREURL = from ? "/" + from : "";
            self._event();
            self._getList();
            self._pullToFresh()
        },
        _pullToFresh: function() {
            var self = this;
            $(document).on("refresh", ".pull-to-refresh-content", function(e) {
                self.isPullToFresh = true;
                self._getList()
            });
            $("#J-goPay").on("click", function() {
                if (G._navigator().isWeixin) {
                    self._getWXurl({
                        gotoUrlType: 1,
                        isWeixin: true,
                        type: 1
                    })
                } else {
                    location.href = "/order/orderConfirm.html?type=1"
                }
            })
        },
        _event: function() {
            var self = this;
            $(".J-add").unbind("click").bind("click", function() {
                var id = $(this).parents("li").attr("data-id");
                self._editNum(true, id)
            });
            $(".J-cut").unbind("click").bind("click", function() {
                var id = $(this).parents("li").attr("data-id");
                self._editNum(false, id)
            });
            $(".J-delete").unbind("click").bind("click", function() {
                var id = $(this).parents("li").attr("data-id");
                $.confirm("确定删除吗?", function() {
                    self._delete(id)
                })
            });
            $("a[_href]").off().on("click", function() {
                var href = $(this).attr("_href");
                var from = $("#J-from").val();
                if (from == "fsl") href = "/" + from + href;
                location.href = href
            })
        },
        _getList: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: self.PREURL + "/cart/listCart.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        if (res.data.CartVOList.length <= 0) {
                            $(".bar-tab").remove()
                        }
                        $("#J-goods-list").html(Tlist(res.data));
                        var totalPrice = res.data.totalPrice;
                        $("#J-totalPrice").text("￥" + totalPrice);
                        if (self.isPullToFresh) {
                            $.pullToRefreshDone(".pull-to-refresh-content")
                        }
                        self._event();
                        if (self.isFirstLoad) {
                            $.init();
                            self.isFirstLoad = false
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
        _delete: function(id) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/cart/deleteCart.json",
                data: {
                    cartId: id
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getList()
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
        _editNum: function(flag, id) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/cart/updateCart.json",
                data: {
                    flag: flag,
                    id: id
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getList()
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
        _getWXurl: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/getWxCodeURI.json",
                data: data,
                success: function(res) {
                    if (res.info.ok == true) {
                        location.href = res.data.wxCodeURl
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
define("/WEB-UED/fancy/dist/p/shoppingCart/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n    ";
            options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            };
            if (helper = helpers.CartVOList) {
                stack1 = helper.call(depth0, options)
            } else {
                helper = depth0 && depth0.CartVOList;
                stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
            }
            if (!helpers.CartVOList) {
                stack1 = blockHelperMissing.call(depth0, stack1, {
                    hash: {},
                    inverse: self.noop,
                    fn: self.program(2, program2, data),
                    data: data
                })
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    	<li class="goods-list-item" data-id="';
            if (helper = helpers.id) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.id;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n            <div class="goods-list-img">\r\n                <a class="goods-list-link external" _href="/goods/detail.html?goodsId=';
            if (helper = helpers.goodsId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                    <img src="';
            if (helper = helpers.goodsImgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsImgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <div class="goods-list-title pdlr10">\r\n                    <a class="goods-list-link external" _href="/goods/detail.html?goodsId=';
            if (helper = helpers.goodsId) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsId;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
            if (helper = helpers.goodsTitle) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsTitle;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                    </a>\r\n                </div>\r\n                <div class="fz12 color-gray">';
            if (helper = helpers.specify) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.specify;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\r\n                <div class="color-gray">\r\n                    <span class="price mr5">￥';
            if (helper = helpers.goodsPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                    <span class="color-gray fz10 line-throuth">￥';
            if (helper = helpers.goodsOriginalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsOriginalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                </div>\r\n                <div class="pdlr10">\r\n                    <i class="iconfont fr color-gray J-delete">&#xe60d;</i>\r\n                    <div class="J-edit-count">\r\n                        <p class="edit-count color-gray">\r\n                            <i class="iconfont J-cut">&#xe607;</i>\r\n                            <span class="J-number">';
            if (helper = helpers.goodsNum) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsNum;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                            <i class="iconfont J-add">&#xe608;</i>\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </li>\r\n    ';
            return buffer
        }

        function program4(depth0, data) {
            return '\r\n    <div class="no-data">\r\n        <p>暂无数据</p>\r\n        <i class="iconfont">&#xe688;</i>\r\n    </div>\r\n'
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.CartVOList, {
            hash: {},
            inverse: self.program(4, program4, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1
        } else {
            return ""
        }
    })
});