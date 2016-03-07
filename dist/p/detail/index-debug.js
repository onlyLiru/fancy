define("/WEB-UED/fancy/dist/p/detail/index-debug", ["/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload", "/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/p/detail/page-debug.handlebars", "/WEB-UED/fancy/dist/p/detail/collection-debug.handlebars", "/WEB-UED/fancy/dist/p/detail/skuGoodsMes-debug.handlebars", "/WEB-UED/fancy/dist/p/detail/sku-debug.handlebars"], function(require, exports, module) {
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    require("/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload");
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var Tpage = require("/WEB-UED/fancy/dist/p/detail/page-debug.handlebars");
    var Tcollection = require("/WEB-UED/fancy/dist/p/detail/collection-debug.handlebars");
    var TskuMes = require("/WEB-UED/fancy/dist/p/detail/skuGoodsMes-debug.handlebars");
    var Tsku = require("/WEB-UED/fancy/dist/p/detail/sku-debug.handlebars");
    var main = {
        init: function() {
            var self = this;
            var from = $("#J-from").val();
            self.PREURL = from ? "/" + from : "";
            self.goodsId = G._getUrlParam("goodsId");
            self._getDetail()
        },
        _event: function() {
            var self = this;
            G._editCount({
                box: ".J-edit-count",
                defaultCount: 1
            });
            $("#J-add-cart").unbind("click").bind("click", function() {
                self._addCart()
            });
            $("#J-buy-now").unbind("click").bind("click", function() {
                var goodsNum = $("#J-goods-count .J-number").text() || 1;
                var goodsId = $("#J-goodsId").val();
                var stockNum = $("#J-stockNum").text();
                var attributeSymbolName = $("#J-attributeSymbolName").val();
                var specify = "";
                if (attributeSymbolName) {
                    specify = attributeSymbolName
                } else {
                    var specify = [];
                    if ($(".sku-item.active").length) {
                        $(".sku-item.active").each(function() {
                            var name = $(this).parent().attr("data-name");
                            var value = $(this).text();
                            specify.push('"' + name + '":"' + value + '"')
                        });
                        specify = specify.join(",")
                    }
                }
                if (G._navigator().isWeixin) {
                    self._getWXurl({
                        type: 2,
                        gotoUrlType: 1,
                        goodsNum: goodsNum,
                        goodsId: goodsId,
                        specify: specify,
                        isWeixin: true
                    })
                } else {
                    var from = $("#J-from").val();
                    if (from == "fsl") {
                        location.href = "/" + from + "/order/orderConfirm.html?type=2&goodsNum=" + goodsNum + "&goodsId=" + goodsId + "&specify=" + specify
                    } else {
                        location.href = "/order/orderConfirm.html?type=2&goodsNum=" + goodsNum + "&goodsId=" + goodsId + "&specify=" + specify
                    }
                }
            });
            $("#J-buy-box").unbind("click").bind("click", function() {
                var activitySetId = $(this).attr("data-id");
                var goodsNum = $("#J-box-goods .J-number").text() || 1;
                location.href = "/order/orderConfirm.html?type=3&goodsNum=" + goodsNum + "&activitySetId=" + activitySetId
            });
            $(".content img.lazy").lazyload({
                event: "sporty",
                threshold: 100
            });
            var timeout = setTimeout(function() {
                $("img.lazy").trigger("sporty")
            }, 100);
            $("#J-sku a").unbind("click").bind("click", function() {
                $(this).addClass("active").siblings().removeClass("active")
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
        },
        _addCart: function() {
            var self = this;
            var goodsNum = $(".J-number").text();
            var goodsId = $("#J-goodsId").val();
            var attributeSymbolName = $("#J-attributeSymbolName").val();
            var specify = [];
            if (attributeSymbolName) {
                specify = attributeSymbolName
            } else {
                if ($(".sku-item.active").length) {
                    $(".sku-item.active").each(function() {
                        var name = $(this).parent().attr("data-name");
                        var value = $(this).text();
                        specify.push(name + ":" + value)
                    })
                }
                specify = specify.join(",")
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/cart/addCart.json",
                data: {
                    goodsId: goodsId,
                    goodsNum: goodsNum,
                    specify: specify
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $.toast("添加成功")
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
        _getDetail: function() {
            var self = main;
            $.ajax({
                type: "get",
                cach: false,
                url: self.PREURL + "/goods/getGoods.json",
                data: {
                    goodsId: self.goodsId
                },
                success: function(res) {
                    if (res == "noLogin" && $("#J-from").val() == "fsl") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        var type = res.data.goodsEntityVO.type || 0;
                        var introduction = res.data.goodsEntityVO.introduction.split(",");
                        res.data.goodsEntityVO.introduction = introduction;
                        var myPhotoBrowserStandalone = $.photoBrowser({
                            photos: introduction
                        });
                        $(document).on("click", ".pb-standalone", function() {
                            myPhotoBrowserStandalone.open()
                        });
                        $("#J-page").html(Tpage(res.data.goodsEntityVO));
                        if (type == 1) {
                            $("#J-add-cart,#J-goods-count").remove()
                        }
                        self._setSpecify(res.data.goodsEntityVO.specify || "");
                        self._getActivitySetByGoodsId();
                        if (G._navigator().ios) {
                            $(".swiper-container").swiper({
                                pagination: ".banner-pagination",
                                effect: "cube",
                                cube: {
                                    slideShadows: true,
                                    shadow: true,
                                    shadowOffset: 10,
                                    shadowScale: .6
                                },
                                autoHeight: true
                            })
                        } else if (G._navigator().android) {
                            $(".swiper-container").swiper({
                                pagination: ".banner-pagination"
                            })
                        }
                        $("#sku-good").html(TskuMes(res.data.goodsEntityVO));
                        self._sku();
                        self._event()
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
        _setSpecify: function(specify) {
            var self = this;
            var html = [];
            if (!specify) {
                return
            }
            specify = eval("(" + specify + ")");
            $.each(specify, function(key, value) {
                html.push('<li class="borderB lh24 mb10"><span class="color-gray fr">' + value + "</span>" + key + "</li>")
            });
            $("#J-specify").html(html.join(""))
        },
        _getActivitySetByGoodsId: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: self.PREURL + "/activitySet/getActivitySetByGoodsId.json",
                data: {
                    goodsId: self.goodsId
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#J-collection").html(Tcollection(res.data.activitySetEntityVO));
                        self._event()
                    }
                },
                error: function() {}
            })
        },
        _sku: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: self.PREURL + "/goods/listGoodsSalesAttribute",
                data: {
                    goodsId: self.goodsId
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#J-sku").html(Tsku(res.data));
                        self._event()
                    }
                },
                beforeSend: function() {},
                complete: function() {},
                error: function() {}
            })
        }
    };
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
define("/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload", [], function(require, exports, module) {
    ! function(a, b, c, d) {
        var e = a(b);
        a.fn.lazyload = function(c) {
            function i() {
                var b = 0;
                f.each(function() {
                    var c = a(this);
                    if (!h.skip_invisible || "none" !== c.css("display"))
                        if (a.abovethetop(this, h) || a.leftofbegin(this, h));
                        else if (a.belowthefold(this, h) || a.rightoffold(this, h)) {
                        if (++b > h.failure_limit) return !1
                    } else c.trigger("appear"), b = 0
                })
            }
            var g, f = this,
                h = {
                    threshold: 0,
                    failure_limit: 0,
                    event: "scroll",
                    effect: "show",
                    container: b,
                    data_attribute: "original",
                    skip_invisible: !0,
                    appear: null,
                    load: null
                };
            return c && (d !== c.failurelimit && (c.failure_limit = c.failurelimit, delete c.failurelimit), d !== c.effectspeed && (c.effect_speed = c.effectspeed, delete c.effectspeed), a.extend(h, c)), g = h.container === d || h.container === b ? e : a(h.container), 0 === h.event.indexOf("scroll") && g.on(h.event, function() {
                return i()
            }), this.each(function() {
                var b = this,
                    c = a(b);
                b.loaded = !1, c.one("appear", function() {
                    if (!this.loaded) {
                        if (h.appear) {
                            var d = f.length;
                            h.appear.call(b, d, h)
                        }
                        a("<img />").on("load", function() {
                            var d, e;
                            c.hide().attr("src", c.data(h.data_attribute))[h.effect](h.effect_speed), b.loaded = !0, d = a.grep(f, function(a) {
                                return !a.loaded
                            }), f = a(d), h.load && (e = f.length, h.load.call(b, e, h))
                        }).attr("src", c.data(h.data_attribute))
                    }
                }), 0 !== h.event.indexOf("scroll") && c.on(h.event, function() {
                    b.loaded || c.trigger("appear")
                })
            }), e.on("resize", function() {
                i()
            }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && e.on("pageshow", function(b) {
                b = b.originalEvent || b, b.persisted && f.each(function() {
                    a(this).trigger("appear")
                })
            }), a(b).on("load", function() {
                i()
            }), this
        }, a.belowthefold = function(c, f) {
            var g;
            return g = f.container === d || f.container === b ? e.height() + e.scrollTop() : a(f.container).offset().top + a(f.container).height(), g <= a(c).offset().top - f.threshold
        }, a.rightoffold = function(c, f) {
            var g;
            return g = f.container === d || f.container === b ? e.width() + e[0].scrollX : a(f.container).offset().left + a(f.container).width(), g <= a(c).offset().left - f.threshold
        }, a.abovethetop = function(c, f) {
            var g;
            return g = f.container === d || f.container === b ? e.scrollTop() : a(f.container).offset().top, g >= a(c).offset().top + f.threshold + a(c).height()
        }, a.leftofbegin = function(c, f) {
            var g;
            return g = f.container === d || f.container === b ? e[0].scrollX : a(f.container).offset().left, g >= a(c).offset().left + f.threshold + a(c).width()
        }, a.inviewport = function(b, c) {
            return !(a.rightoffold(b, c) || a.leftofbegin(b, c) || a.belowthefold(b, c) || a.abovethetop(b, c))
        }, a.extend(a.fn, {
            "below-the-fold": function(b) {
                return a.belowthefold(b, {
                    threshold: 0
                })
            },
            "above-the-top": function(b) {
                return !a.belowthefold(b, {
                    threshold: 0
                })
            },
            "right-of-screen": function(b) {
                return a.rightoffold(b, {
                    threshold: 0
                })
            },
            "left-of-screen": function(b) {
                return !a.rightoffold(b, {
                    threshold: 0
                })
            },
            "in-viewport": function(b) {
                return a.inviewport(b, {
                    threshold: 0
                })
            },
            "above-the-fold": function(b) {
                return !a.belowthefold(b, {
                    threshold: 0
                })
            },
            "right-of-fold": function(b) {
                return a.rightoffold(b, {
                    threshold: 0
                })
            },
            "left-of-fold": function(b) {
                return !a.rightoffold(b, {
                    threshold: 0
                })
            }
        })
    }($, window, document)
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
define("/WEB-UED/fancy/dist/p/detail/page-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <div class="swiper-slide"><img src="';
            if (helper = helpers.imageUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imageUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '@1e_480w_480h_1c_0i_1o_90Q_1x.jpg"></div>\r\n            ';
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "";
            buffer += '\r\n            <img class="goods-desc-img lazy pb-standalone" data-original="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '">\r\n        ';
            return buffer
        }
        buffer += '    <div class="swiper-container bg-white" data-space-between=\'10\'>\r\n        <div class="swiper-wrapper">\r\n            ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        };
        if (helper = helpers.goodsImgDTOList) {
            stack1 = helper.call(depth0, options)
        } else {
            helper = depth0 && depth0.goodsImgDTOList;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
        }
        if (!helpers.goodsImgDTOList) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(1, program1, data),
                data: data
            })
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n        </div>\r\n        <div class="banner-pagination"></div>\r\n    </div>\r\n\r\n    <div class="bg-white pd10">\r\n        <p>';
        if (helper = helpers.name) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.name;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</p>\r\n        <p>\r\n            <span class="price">￥';
        if (helper = helpers.price) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.price;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</span>　\r\n            <span class="color-gray fz10 line-throuth">￥';
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
        buffer += escapeExpression(stack1) + '</span>\r\n            <span class="fr">库存：<span id="J-stockNum">';
        if (helper = helpers.stockNum) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.stockNum;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</span>件</span>\r\n        </p>\r\n        <ul class="flex-box1 borderB lh32">\r\n            <li class="al">快递：';
        if (helper = helpers.expressPrice) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.expressPrice;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '元</li>\r\n            <!-- li class="ar">月销：';
        if (helper = helpers.monthSalesNum) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.monthSalesNum;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '本</li -->\r\n        </ul>\r\n\r\n        <p class="lh32 borderB">\r\n        <i class="iconfont fr color-gray">&#xe614;</i>\r\n        <a href="javascript:" class="block color-gray open-panel" data-panel=\'#panel-sku\'>选择 颜色分类 尺码 数量</a></p>\r\n\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe674;</i>\r\n            <span class="fz14 millde color-black">100%正品</span>\r\n            <span class="fz12 millde">所售商品均为正品</span>\r\n        </div>\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe676;</i>\r\n            <span class="fz14 millde color-black">七天包退</span>\r\n            <span class="fz12 millde">7天无条件退换货</span>\r\n        </div>\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe675;</i>\r\n            <span class="fz14 millde color-black">闪电发货</span>\r\n            <span class="fz12 millde">所有商品72小时内发货</span>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div class="row bg-opacity-title" id="J-collection"></div>\r\n\r\n    <h4 class="h4-title pd10">宝贝详情</h4>\r\n    <div class="bg-white pd10" id="J-g-detail">\r\n        <ul id="J-specify"></ul>\r\n        ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        };
        if (helper = helpers.introduction) {
            stack1 = helper.call(depth0, options)
        } else {
            helper = depth0 && depth0.introduction;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
        }
        if (!helpers.introduction) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            })
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    </div>\r\n\r\n    <!--h4 class="h4-title">宝贝评价<a class="fr" href="javascript:">更多</a></h4>\r\n    <ul class="goods-list bg-white">\r\n        <li class="goods-list-item clearfix">\r\n            <div class="goods-list-img">\r\n                <img class="borderRadius50" src="//m.360buyimg.com/n7/jfs/t1678/80/972239920/357576/2ce43ecf/55e02f07N9507b4ee.jpg!q70.jpg">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <h3 class="fz16 mb10">邓丽君<span class="fr fz12">22:08</span></h3>\r\n                <div class="color-gray">认识观匆匆流逝，我就喜欢这本书！！！！喜欢的不行不行的。</div>\r\n            </div>\r\n        </li>\r\n        <li class="goods-list-item">\r\n            <div class="goods-list-img">\r\n                <img class="borderRadius50" src="//m.360buyimg.com/n7/jfs/t1678/80/972239920/357576/2ce43ecf/55e02f07N9507b4ee.jpg!q70.jpg">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <h3 class="fz16 mb10">Tony<span class="fr fz12">22:08</span></h3>\r\n                <div class="color-gray">我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。</div>\r\n            </div>\r\n        </li>\r\n    </ul>\r\n\r\n    <h3 class="h3-title"><span>猜你喜欢</span></h3>\r\n    <div class="goods-box">\r\n        <ul>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/jfs/t1099/340/584783761/444035/83bb7a9c/5530a843N5601590f.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接问哦发链接链接问哦发链接链接问哦发链接链接问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/g14/M01/01/15/rBEhV1KLJGYIAAAAAALQ2fs55p8AAF0LQKMJkAAAtDx560.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/g13/M00/0F/1A/rBEhVFJWgtQIAAAAABYy8ainCvkAAD_CwIhjcQAFjMJ922.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n        </ul>\r\n    </div -->';
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/detail/collection-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, helper, options, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <h4 class="h4-title pd10">图书套装</h4>\r\n    <div class="col-33 opacity-box auto-img bg-white">\r\n        <a class="img external" href="/goods/detail.html?goodsId=';
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
            buffer += escapeExpression(stack1) + '">\r\n            <img  src="http://img.fancyedu.com/image1.jpg@1e_85w_85h_1c_0i_1o_90Q_1x.jpg">\r\n        </a>\r\n        <div class="ac ellipsis opacity-title">';
            if (helper = helpers.name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\r\n        <i class="iconfont collection-add">&#xe608;</i>\r\n    </div>\r\n';
            return buffer
        }
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        };
        if (helper = helpers.goodsVOList) {
            stack1 = helper.call(depth0, options)
        } else {
            helper = depth0 && depth0.goodsVOList;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
        }
        if (!helpers.goodsVOList) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(1, program1, data),
                data: data
            })
        }
        if (stack1 || stack1 === 0) {
            return stack1
        } else {
            return ""
        }
    })
});
define("/WEB-UED/fancy/dist/p/detail/skuGoodsMes-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            helperMissing = helpers.helperMissing,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n      ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", 0, options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n    ";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <div class="item-media">\r\n          <img src="';
            if (helper = helpers.imageUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.imageUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '@1e_480w_480h_1c_0i_1o_90Q_1x.jpg" width="80">\r\n        </div>\r\n      ';
            return buffer
        }
        buffer += '<li>\r\n  <a href="#" class="item-content">\r\n    ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        };
        if (helper = helpers.goodsImgDTOList) {
            stack1 = helper.call(depth0, options)
        } else {
            helper = depth0 && depth0.goodsImgDTOList;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
        }
        if (!helpers.goodsImgDTOList) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(1, program1, data),
                data: data
            })
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\r\n    <div class="item-inner">\r\n      <div class="item-title-row">\r\n        <div class="item-title"><span class="price">￥';
        if (helper = helpers.price) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.price;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</span></div>\r\n      </div>\r\n      <div class="item-text">';
        if (helper = helpers.name) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.name;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + "</div>\r\n    </div>\r\n  </a>\r\n</li>";
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/detail/sku-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, self = this,
            helperMissing = helpers.helperMissing,
            functionType = "function",
            escapeExpression = this.escapeExpression;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n  <li>\r\n    <div class="item-content">\r\n      <div class="item-media color-gray fz12">';
            if (helper = helpers.attr_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\r\n      <div class="item-inner sku-select" data-name="';
            if (helper = helpers.attr_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n      ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.attr_value, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n      </div>\r\n    </div>\r\n  </li>\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\r\n            <a href="#" class="border sku-item ';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", 0, options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '">';
            if (helper = helpers.attr_v_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_v_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</a>\r\n      ";
            return buffer
        }

        function program3(depth0, data) {
            return " active "
        }
        buffer += "<ul>\r\n";
        stack1 = helpers.each.call(depth0, depth0 && depth0.salesAttribute, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n</ul>";
        return buffer
    })
});