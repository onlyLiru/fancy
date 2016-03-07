define("/WEB-UED/fancy/dist/p/channel/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload", "/WEB-UED/fancy/dist/p/channel/page-debug.handlebars"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    require("/WEB-UED/fancy/dist/c/js/zepto-debug.lazyload");
    var Tpage = require("/WEB-UED/fancy/dist/p/channel/page-debug.handlebars");
    var main = {
        init: function() {
            var self = main;
            self.from = $("#J-from").val();
            G._scroll();
            G._getCartCount();
            self.pageId = G._getUrlParam("pageId");
            self._getData()
        },
        _getData: function() {
            var self = this;
            var url = self.from == "fsl" ? "/fsl/channel/listImg.json" : "/channel/listImg.json";
            $.ajax({
                type: "get",
                cach: false,
                url: url,
                data: {
                    pageId: self.pageId
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#page").html(Tpage(res.data.map.result));
                        $(".content img.lazy").lazyload({
                            event: "sporty",
                            threshold: 10
                        });
                        var timeout = setTimeout(function() {
                            $("img.lazy").trigger("sporty")
                        }, 200);
                        $.refreshScroller();
                        setTimeout(function() {
                            $.refreshScroller();
                            $.init()
                        }, 600);
                        setInterval(function() {
                            $.refreshScroller()
                        }, 600)
                    }
                },
                beforeSend: function() {},
                complete: function() {},
                error: function() {}
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
define("/WEB-UED/fancy/dist/p/channel/page-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="swiper-wrapper">\r\n        <div class="swiper-slide">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n            </a>\r\n        </div>\r\n    </div>\r\n    ';
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="col-33">\r\n        <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external auto-img">\r\n            <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" >\r\n        </a>\r\n    </div>\r\n    ';
            return buffer
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <div class="col-33">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external auto-img">\r\n                <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" >\r\n            </a>\r\n        </div>\r\n    ';
            return buffer
        }

        function program7(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n        ";
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                    <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n            ';
            return buffer
        }

        function program10(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n        ";
            return buffer
        }

        function program12(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            return buffer
        }

        function program13(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                        <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '">\r\n                    </a>\r\n                ';
            return buffer
        }

        function program15(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 4, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 4, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            return buffer
        }

        function program17(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="row bg-white home-activity-img">\r\n        <div class="auto-img relative">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block"><img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" ></a>\r\n        </div>\r\n        <p class="fz12 pdlr10 absolute">\r\n            <span class="price fr color-red">';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.price, {
                hash: {},
                inverse: self.noop,
                fn: self.program(18, program18, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "</span>\r\n            ";
            if (helper = helpers.title) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.title;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n        </p>\r\n    </div>\r\n    <div class="fz16 bg-white pd10">\r\n        ';
            if (helper = helpers.description) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.description;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "\r\n    </div>\r\n";
            return buffer
        }

        function program18(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += " ￥";
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
            buffer += escapeExpression(stack1) + " ";
            return buffer
        }
        buffer += "<div class=\"swiper-container\" data-space-between='10'>\r\n    ";
        stack1 = helpers.each.call(depth0, depth0 && depth0.block1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    <div class="swiper-pagination"></div>\r\n</div>\r\n\r\n<div class="row mb10 bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block2, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n</div>\r\n\r\n<div class="row mb10 bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block3, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n</div>\r\n\r\n<div class="row bg-white auto-img mb10">\r\n\r\n    <div class="col-40 auto-img">\r\n        ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    </div>\r\n    <div class="col-60 borderL">\r\n        <div class="borderB">\r\n        ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(10, program10, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n        </div>\r\n        <div class="row">\r\n            <div class="col-50 auto-img">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(12, program12, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n            </div>\r\n            <div class="col-50 borderL">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(15, program15, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n";
        stack1 = helpers.each.call(depth0, depth0 && depth0.block5, {
            hash: {},
            inverse: self.noop,
            fn: self.program(17, program17, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n<br><br>";
        return buffer
    })
});