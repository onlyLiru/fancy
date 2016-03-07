define("/WEB-UED/fancy/dist/p/orderDetail/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/p/orderDetail/page-debug.handlebars", "/WEB-UED/fancy/dist/c/js/pingPay-debug", "/WEB-UED/fancy/dist/p/orderDetail/express-debug.handlebars"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    var Tpage = require("/WEB-UED/fancy/dist/p/orderDetail/page-debug.handlebars");
    var ping = require("/WEB-UED/fancy/dist/c/js/pingPay-debug");
    var Texpress = require("/WEB-UED/fancy/dist/p/orderDetail/express-debug.handlebars");
    var main = {
        init: function() {
            var self = this;
            self._event();
            self._getDetail();
            $(document).on("pageInit", function(e, pageId, $page) {
                if (pageId == "returnPage") {
                    self._getReturnMoney()
                }
            })
        },
        _event: function() {
            var self = this;
            $(".J-pay").unbind("click").bind("click", function() {
                var orderNo = $("#J-orderNo").val();
                ping.init(orderNo)
            });
            $(".J-view").off().on("click", function() {
                var expressNo = $(this).attr("data-expressNo") || "";
                var expressCode = $(this).attr("data-expressCode") || "";
                if (expressNo) {
                    self._viewExpress({
                        expressNo: expressNo,
                        expressCode: expressCode
                    })
                } else {
                    $.alert("物流信息不存在")
                }
            });
            $(".goods-list-item a[_href]").on("click", function() {
                var href = $(this).attr("_href");
                var from = $("#J-from").val();
                if (from == "fsl") {
                    href = "/" + from + href
                }
                location.href = href
            });
            $("#J-return-btn").off().on("click", function() {
                self._return()
            });
            $("#J-cancel-return-btn").off().on("click", function() {
                self._cancelReturn()
            })
        },
        _getDetail: function() {
            var self = this;
            var orderNo = $("#J-orderNo").val();
            $.ajax({
                type: "get",
                cach: false,
                url: "/order/getOrderVO.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#J-detail").append(Tpage(res.data.OrderVO));
                        self._event()
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
        _viewExpress: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/express/getExpressInfo.json",
                data: {
                    expressNo: data.expressNo,
                    expressCode: data.expressCode
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        var expressInfo = res.data.expressInfo;
                        self._showExpress(expressInfo)
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
        _showExpress: function(data) {
            var self = this;
            var trace = data.trace;
            trace = eval("(" + trace + ")");
            data.trace = trace.reverse();
            $.router.loadPage("#expressPage");
            $(document).on("pageInit", function(e, pageId, $page) {
                if (pageId == "expressPage") {
                    $("#express-detail").html(Texpress(data))
                }
            })
        },
        _getReturnMoney: function() {
            var self = this;
            var orderNo = $("#J-orderNo").val();
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/applyForRefund.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self.money = res.data.refund.refundFee;
                        self.tradeNo = res.data.tradeNo;
                        $("#J-return-money").text(self.money)
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
        _return: function() {
            var self = this;
            var orderNo = $("#J-orderNo").val();
            var reason = $("#J-return-reason option:checked").val();
            var money = $("#J-return-money").text();
            var mes = $("#J-return-des").val();
            if (reason == 0) {
                $.alert("请选择退款原因");
                return
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/commitRefundApply.json",
                data: {
                    orderNo: orderNo,
                    tradeNo: self.tradeNo,
                    refundFee: self.money,
                    reason: reason,
                    refundDesc: mes
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true && res.data.commitFlag == true) {
                        location.href = "/payment/success-return.html"
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
        _cancelReturn: function() {
            var self = this;
            var orderNo = $("#J-orderNo").val();
            var reason = $("#J-cancel-return-reason option:checked").val();
            var mes = $("#J-cancel-return-des").val();
            if (reason == 0) {
                $.alert("请选择取消退款原因");
                return
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/commitCancelRefund.json",
                data: {
                    orderNo: orderNo,
                    reason: reason,
                    refundDesc: mes
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true && res.data.commitFlag == true) {
                        location.href = "/payment/success-cancel-return.html"
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
define("/WEB-UED/fancy/dist/c/js/registerHelper-debug", ["handlebars-debug"], function(require, exports, module) {
    var Handlebars = require("handlebars-debug");
    Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
        switch (operator) {
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this)
        }
    })
});
define("/WEB-UED/fancy/dist/p/orderDetail/page-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, helper, options, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing;

        function program1(depth0, data) {
            return '\r\n    <nav class="bar bar-tab">\r\n        <a href="javascript:" class="tab-item bg-orange color-white external J-pay">\r\n            <span class="tab-label">立即支付</span>\r\n        </a>\r\n    </nav>\r\n'
        }

        function program3(depth0, data) {
            return '\r\n    <div class="bg-orange color-white fz16 lh24 mb10">\r\n        <div class="order-status relative clearfix">\r\n            <i class="iconfont fz60 fl relative">&#xe626;</i>\r\n            <div class="fl">\r\n                <p class="lh40">订单已取消</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    '
        }

        function program5(depth0, data) {
            return '\r\n    <div class="bg-orange color-white fz16 lh24 mb10">\r\n        <div class="order-status relative clearfix">\r\n            <i class="iconfont fz60 fl relative">&#xe622;</i>\r\n            <div class="fl">\r\n                <p class="lh40">等待买家付款</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    '
        }

        function program7(depth0, data) {
            return '\r\n    <div class="bg-orange color-white fz16 lh24 mb10">\r\n        <div class="order-status relative clearfix">\r\n            <i class="iconfont fz60 fl relative">&#xe651;</i>\r\n            <div class="fl">\r\n                <p>已付款</p>\r\n                <p>等待卖家发货</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    '
        }

        function program9(depth0, data) {
            return '\r\n    <div class="bg-orange color-white fz16 lh24 mb10">\r\n        <div class="order-status relative clearfix">\r\n            <i class="iconfont fz60 fl relative">&#xe633;</i>\r\n            <div class="fl">\r\n                <p>卖家已发货</p>\r\n                <p>请耐心等待收货</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    '
        }

        function program11(depth0, data) {
            return '\r\n    <div class="bg-orange color-white fz16 lh24 mb10">\r\n        <div class="order-status relative clearfix">\r\n            <i class="iconfont fz60 fl relative">&#xe653;</i>\r\n            <div class="fl">\r\n                <p class="lh40">交易成功</p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    '
        }

        function program13(depth0, data) {
            var buffer = "",
                stack1;
            buffer += '\r\n                <ul class="goods-list has-express">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(14, program14, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                </ul>\r\n            ";
            return buffer
        }

        function program14(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(15, program15, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "!=", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "!=", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            return buffer
        }

        function program15(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                        <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                        <a external _href="/goods/detail.html?goodsId=';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <div class="goods-list-img">\r\n                                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            </div>\r\n                            <div class="goods-list-description">\r\n                                <div class="goods-list-title color-gray">\r\n                                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
            if (helper = helpers.goodsName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                                </div>\r\n                                <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                <div class="color-gray">\r\n                                    <span class="price mr5">￥';
            if (helper = helpers.salePrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.salePrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                                    <span class="color-gray fz10 line-throuth">￥';
            if (helper = helpers.originalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.originalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                                </div>\r\n                            </div>\r\n                        </a>\r\n                        </li>\r\n                        <li class="goods-list-item bg-white mb10 hide ar J-view-li">\r\n                            <a class="f-btn f-btn-orange J-view" data-expressNo="';
            if (helper = helpers.expressNo) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.expressNo;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" data-expressCode="';
            if (helper = helpers.expressCompanyName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.expressCompanyName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">查看物流</a>\r\n                        </li>\r\n                    ';
            return buffer
        }

        function program17(depth0, data) {
            var buffer = "",
                stack1;
            buffer += "\r\n                ";
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(18, program18, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            return buffer
        }

        function program18(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                    ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(19, program19, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "==", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "==", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            return buffer
        }

        function program19(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                        <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                        <a external _href="/goods/detail.html?goodsId=';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <div class="goods-list-img">\r\n                                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            </div>\r\n                            <div class="goods-list-description">\r\n                                <div class="goods-list-title color-gray">\r\n                                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
            if (helper = helpers.goodsName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n                                </div>\r\n                                <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                <div class="color-gray">\r\n                                    <span class="price mr5">￥';
            if (helper = helpers.salePrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.salePrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                                    <span class="color-gray fz10 line-throuth">￥';
            if (helper = helpers.originalPrice) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.originalPrice;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</span>\r\n                                </div>\r\n                            </div>\r\n                        </a>\r\n                        </li>\r\n                    ";
            return buffer
        }

        function program21(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a class="fl ml5 J-return" href="#returnPage" data-orderNo="';
            if (helper = helpers.orderNo) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.orderNo;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">申请退款</a>\r\n            ';
            return buffer
        }

        function program23(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a class="fl ml5 J-cancel-return" href="#returnCancelPage" data-orderNo="';
            if (helper = helpers.orderNo) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.orderNo;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">取消退款</a>\r\n            ';
            return buffer
        }

        function program25(depth0, data) {
            return '\r\n                <span class="fl ml5" href="javascript:">退款完成</span>\r\n            '
        }
        buffer += "\r\n";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 0, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n<div class="content">\r\n    ';
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", -1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", -1, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n    ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 0, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n    ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 1, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n    ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 2, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n    ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(11, program11, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 3, options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\r\n    <div class="mb10 bg-white pd10 relative order-address">\r\n        <ul>\r\n            <li>收货人：';
        if (helper = helpers.receiveName) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.receiveName;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '<span class="fr">';
        if (helper = helpers.receivePhone) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.receivePhone;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</span></li>\r\n            <li>";
        if (helper = helpers.receiveAddress) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.receiveAddress;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</li>\r\n        </ul>\r\n        <i class="iconfont fz20 address color-gray absolute">&#xe617;</i>\r\n    </div>\r\n\r\n    <div class="mb10">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
            hash: {},
            inverse: self.noop,
            fn: self.program(13, program13, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n        <ul class="goods-list mb10">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
            hash: {},
            inverse: self.noop,
            fn: self.program(17, program17, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n        </ul>\r\n        \r\n        <div class="color-gray bg-white ar pd10 borderT borderB">\r\n            ';
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(21, program21, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", "1", options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", "1", options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n            ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(23, program23, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", "5", options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", "5", options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n            ";
        stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(25, program25, data),
            data: data
        }, helper ? helper.call(depth0, depth0 && depth0.state, "==", "7", options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", "7", options));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n\r\n            共计";
        if (helper = helpers.goodsCount) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.goodsCount;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '件 合计：<span class="color-orange">￥';
        if (helper = helpers.totalPrice) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.totalPrice;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</span>\r\n            (含运费￥";
        if (helper = helpers.expressCost) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.expressCost;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + ')\r\n        </div>\r\n    </div>\r\n\r\n    <div class="mb10 bg-white pd10">\r\n        <ul>\r\n            <!-- li class="color-orange">自动确认收货时间：还剩5天22小时</li -->\r\n            <li>订单编号：';
        if (helper = helpers.orderNo) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.orderNo;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li>\r\n            <!-- li>支付宝交易号：";
        if (helper = helpers.tradeNo) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.tradeNo;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li -->\r\n            <li>创建时间：";
        if (helper = helpers.createTimeString) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.createTimeString;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li>\r\n            <!-- li>付款时间：";
        if (helper = helpers.paymentTimeString) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.paymentTimeString;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li -->\r\n            <!-- li>发货时间：";
        if (helper = helpers.consignmentTimeString) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.consignmentTimeString;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li -->\r\n        </ul>\r\n    </div>\r\n\r\n</div>";
        return buffer
    })
});
define("/WEB-UED/fancy/dist/c/js/pingPay-debug", [], function(require, exports, module) {
    var main = {
        init: function(orderNo) {
            var self = this;
            var amount = $("#J-totalPrice .J-total").text() * 100 || "";
            var order_no = orderNo;
            var $openId = $("#J-openId");
            var openId = $openId.val();
            if (openId && !sessionStorage.openId) {
                sessionStorage.openId = openId
            }
            if (window.sessionStorage) {
                openId = openId || sessionStorage.openId
            }
            if (orderNo) {
                sessionStorage.orderNo = orderNo
            }
            var param = {
                openId: openId,
                orderNo: orderNo
            };
            pingpp_one.init({
                app_id: "app_arzrzD1SWX9CbzTO",
                amount: amount,
                channel: ["wx_pub", "alipay_wap"],
                charge_url: "/payment/getCharge.json",
                charge_param: param,
                open_id: openId,
                debug: false
            }, function(res) {
                if (res.debug && res.chargeUrlOutput) {
                    console.log(res.chargeUrlOutput)
                }
                if (!res.status) {
                    alert(res.msg)
                } else {
                    if (res.debug && !res.wxSuccess) {
                        if (confirm("当前为 debug 模式，是否继续支付？")) {
                            pingpp_one.resume()
                        }
                    } else pingpp_one.success(function(res) {
                        if (!res.status) {
                            alert(res.msg)
                        }
                    }, function() {
                        window.location.href = "/index.html"
                    })
                }
            });
            var timer = setInterval(function() {
                if ($("body").hasClass("p_one_open")) {
                    clearInterval(timer);
                    $("body").removeClass("p_one_open")
                }
            }, 10)
        },
        randomString: function(len) {
            var self = this;
            len = len || 32;
            var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
            var maxPos = chars.length;
            var pwd = "";
            for (i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos))
            }
            return pwd
        }
    };
    module.exports = main
});
define("/WEB-UED/fancy/dist/p/orderDetail/express-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, helper, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\n			";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", 0, options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\n			<li class="mb10">';
            if (helper = helpers.AcceptStation) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.AcceptStation;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '<br>\n				<span class="color-gray fz12">';
            if (helper = helpers.AcceptTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.AcceptTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\n				<i class="iconfont color-gray">&#xe620;</i>\n			</li>\n		';
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\n				<li class="mb10 color-orange">';
            if (helper = helpers.AcceptStation) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.AcceptStation;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '<br>\n					<span class="color-gray fz12">';
            if (helper = helpers.AcceptTime) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.AcceptTime;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</span>\n					<i class="iconfont">&#xe620;</i>\n				</li>\n			';
            return buffer
        }
        buffer += '<ul class="pd10">\n    <li>物流公司：';
        if (helper = helpers.expressCode) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.expressCode;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</li>\n    <li>物流单号：";
        if (helper = helpers.expressNo) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.expressNo;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</li>\n</ul>\n<div class="bg-white pd10 fz12">\n	<ul class="express-ul">\n		';
        stack1 = helpers.each.call(depth0, depth0 && depth0.trace, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\n	</ul>\n</div>";
        return buffer
    })
});