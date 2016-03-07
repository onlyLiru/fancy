define("/WEB-UED/fancy/dist/p/list/index-debug", ["/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload", "/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/p/list/list-debug.handlebars"], function(require, exports, module) {
    require("/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload");
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    var Tlist = require("/WEB-UED/fancy/dist/p/list/list-debug.handlebars");
    var main = {
        curPage: 1,
        totalPage: 2,
        load: true,
        isFirstLoad: true,
        init: function() {
            var self = this;
            self.categoryId = G._getUrlParam("categoryId");
            self.brandId = G._getUrlParam("brandId");
            self.from = $("#J-from").val();
            self._page();
            G._getLoginUser(G._getCartCount);
            self._pullToFresh()
        },
        _pullToFresh: function() {
            var self = this;
            $(document).on("refresh", ".pull-to-refresh-content", function(e) {
                self.curPage = 1;
                self.isPullToFresh = true;
                self._getList()
            })
        },
        _page: function() {
            var self = this;
            self._getList();
            $(document).on("infinite", ".infinite-scroll", function() {
                if (self.curPage > self.totalPage || self.loading) {
                    return
                } else {
                    self.isPullToFresh = false;
                    self._getList()
                }
            })
        },
        _getList: function() {
            var self = this;
            var data = {
                curPage: self.curPage,
                pageSize: 10,
                categoryId: self.categoryId
            };
            var url = "/goods/listGoodsPage.json";
            if (self.brandId) {
                url = "/goods/listGoodsPageByBrandId.json";
                data = {
                    curPage: self.curPage,
                    pageSize: 10,
                    brandId: self.brandId
                }
            }
            $.ajax({
                type: "get",
                cach: false,
                url: url,
                data: data,
                success: function(res) {
                    if (res == "noLogin" && $("J-from").val() == "fsl") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        if (res.data.page) {
                            self.curPage = res.data.page.curPage + 1;
                            self.totalPage = res.data.page.totalPage;
                            if (self.isPullToFresh) {
                                $("#J-list").html(Tlist(res.data));
                                $.pullToRefreshDone(".pull-to-refresh-content")
                            } else {
                                $("#J-list").append(Tlist(res.data))
                            }
                            $.refreshScroller();
                            if (self.isFirstLoad) {
                                $.init();
                                self.isFirstLoad = false
                            }
                            $(".content img.lazy").lazyload({
                                event: "sporty",
                                threshold: 100
                            });
                            var timeout = setTimeout(function() {
                                $("img.lazy").trigger("sporty")
                            }, 100)
                        } else {
                            $("#J-list").html('<p class="pd10">暂无数据</p>')
                        }
                        $("a[_href]").off().on("click", function() {
                            var href = $(this).attr("_href");
                            if (self.from == "fsl") {
                                href = "/" + self.from + href
                            } else {
                                href = href
                            }
                            location.href = href
                        })
                    }
                },
                beforeSend: function() {
                    self.loading = true;
                    $(".infinite-scroll-preloader").show()
                },
                complete: function() {
                    self.loading = false;
                    $(".infinite-scroll-preloader").hide()
                },
                error: function() {}
            })
        }
    };
    main.init()
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
define("/WEB-UED/fancy/dist/p/list/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            buffer += '\r\n    <li class="goods-list-item">\r\n        <a class="goods-list-link external" _href="/goods/detail.html?goodsId=';
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
            buffer += escapeExpression(stack1) + '">\r\n            <div class="goods-list-img">\r\n                <img class="lazy" data-original="';
            if (helper = helpers.defaultImgUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.defaultImgUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '@1e_120w_120h_1c_0i_1o_90Q_1x.jpg">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <div class="goods-list-title">\r\n                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                </div>\r\n                <div class="goods-list-price color-orange fz16 mt20">\r\n                    <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                    <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                </div>\r\n            </div>\r\n        </a>\r\n    </li>\r\n";
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