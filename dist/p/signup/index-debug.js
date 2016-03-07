define("/WEB-UED/fancy/dist/p/signup/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/c/js/pingPay-activity-debug", "/WEB-UED/fancy/dist/p/signup/participator-debug.handlebars"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    var ping = require("/WEB-UED/fancy/dist/c/js/pingPay-activity-debug");
    var Tparticipator = require("/WEB-UED/fancy/dist/p/signup/participator-debug.handlebars");
    var main = {
        code: false,
        init: function() {
            var self = main;
            self.activityId = G._getUrlParam("id");
            self._getParticipator();
            self._getSalMes();
            self._event();
            $(document).on("pageReinit", function(e, pageId, $page) {
                if (pageId == "current-page") {
                    self._getPrice()
                }
            });
            $("#getCode").on("click", function() {
                self._getCode()
            });
            if (window.fancyLoginUser && window.fancyLoginUser.mobile) {
                $("#sign-phone").val(window.fancyLoginUser.mobile)
            }
        },
        _getCode: function() {
            var self = this;
            var code = $("#invitationCode").val();
            if (!code) {
                $.alert("请输入邀请码");
                return
            } else {
                self.inviteCode = code
            }
            $.ajax({
                type: "get",
                cach: false,
                data: {
                    inviteCode: code,
                    activityId: self.activityId
                },
                url: "/activity/verifyInviteCode.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $(".nav1").hide();
                        $(".nav2").show();
                        self.code = true;
                        $("#getCode").hide();
                        $.alert("成功！请添加活动成员")
                    } else {
                        $.alert(res.info.message)
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
        _event: function() {
            var self = this;
            $(".J-confirm-pay").off().on("click", function() {
                var param = self._param();
                if (param) {
                    self._sign(param)
                } else {
                    return
                }
            });
            $("#add-save").off().on("click", function() {
                self._addPeople()
            });
            $("#history-people li").off().on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                var checkBox = $(this).find('input[type="checkbox"]');
                var isChecked = checkBox.is(":checked");
                var id = $(this).attr("data-id");
                if (!isChecked) {
                    self._addToJoin({
                        checkbox: this
                    })
                } else {
                    $('#join-people li[data-id="' + id + '"]').remove();
                    $('#history-people li[data-id="' + id + '"]').find('input[type="checkbox"]').prop("checked", false)
                }
            });
            $('#history-people li i[rel="delete"]').off().on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                var id = $(this).parents("li").attr("data-id");
                $.confirm("确定删除吗?", function() {
                    self._delete(id)
                })
            });
            $("#sign-safe").parent().off().on("click", function() {
                self._getPrice()
            });
            $("#sign-code").parent().off().on("click", function() {
                var flag = $(this).find('input[type="checkbox"]').is(":checked");
                if (flag) {
                    $(".yaoqingCode").show()
                } else {
                    $(".yaoqingCode").hide()
                }
            })
        },
        _getSalMes: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                data: {
                    activityId: self.activityId
                },
                url: "/activity/getSellInfo.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        var data = res.data.sellInfo;
                        var transportationType = data.transportationType || "";
                        var isInsurance = data.isInsurance || "";
                        var insurancePrice = data.insurancePrice || 0;
                        if (transportationType == 1) {
                            $(".transportationType").removeClass("hide")
                        }
                        if (isInsurance == 1) {
                            $("#sign-safe").parents(".item-input").append('<span class="price">￥<i class="insurancePrice">' + insurancePrice + "</i></span>");
                            $(".isInsurance").removeClass("hide")
                        }
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
        _getPrice: function() {
            var self = this;
            var ids = [];
            var data = {
                activityId: self.activityId
            };
            var signSafe = $("#sign-safe").is(":checked") ? 1 : 0;
            if (signSafe == "1") {
                data.isInsurance = signSafe;
                data.insurancePrice = $(".insurancePrice").text()
            }
            var jpBox = $("#join-people");
            jpBox.find("li").each(function() {
                ids.push($(this).attr("data-id"))
            });
            if (ids.length <= 0) {
                $("#J-totalPrice").html(" ");
                return
            } else {
                data.participatorIds = ids.join(",")
            }
            $.ajax({
                type: "get",
                cach: false,
                data: data,
                url: "/activity/getPrice.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        var price = res.data.price;
                        $("#J-totalPrice").html('合计￥:<span class="price">' + price + "</span>")
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
        _getParticipator: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/activity/listParticipator.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#history-people").html(Tparticipator(res.data.participatorList));
                        $("#join-people li").each(function() {
                            var id = $(this).attr("data-id");
                            var checkbox = $('#history-people li[data-id="' + id + '"]').find('input[type="checkbox"]');
                            checkbox.prop("checked", true)
                        });
                        self._event()
                    }
                },
                beforeSend: function() {},
                complete: function() {},
                error: function() {}
            })
        },
        _addPeople: function() {
            var self = this;
            var mobileReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
            var addParam = {};
            var addName = $("#add-name").val();
            var addPhone = $("#add-phone").val();
            var addAge = $("#add-age").val();
            var sex = $("#add-sex").val();
            if (!addName) {
                $.alert("请填写参加人姓名");
                return
            } else if (!addAge) {
                $.alert("请填写年龄");
                return
            }
            if (addPhone && !mobileReg.test(addPhone)) {
                $.alert("手机号填写错误");
                return
            }
            addParam = {
                realName: addName,
                age: addAge,
                mobile: addPhone,
                sex: sex
            };
            self._canAdd(addParam)
        },
        _canAdd: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                data: data,
                url: "/activity/addParticipator.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getParticipator();
                        $.router.back();
                        $("#add-people input").val("")
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
            $('#join-people li[data-id="' + id + '"]').remove();
            $.ajax({
                type: "get",
                cach: false,
                data: {
                    participatorId: id
                },
                url: "/activity/delParticipator.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getParticipator()
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
        _addToJoin: function(param) {
            var self = this;
            var $li = $(param.checkbox);
            var name = $li.find("span[rel=name]").html();
            var phone = $li.find("div[rel=phone]").text();
            var id = $li.attr("data-id");
            $("#join-people ul").prepend('<li data-id="' + id + '">                <a href="#" class="item-content">                  <div class="item-inner">                    <div class="item-title-row">                        <div class="item-title fz22"> ' + name + ' </div>                    </div>                    <div class="color-gray">' + phone + "</div>                  </div>                </a>              </li>");
            $('#history-people li[data-id="' + id + '"]').find('input[type="checkbox"]').prop("checked", true);
            self._event()
        },
        _param: function() {
            var self = this;
            var activityId = G._getUrlParam("id") || "";
            var mobileReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
            var signParam = {};
            var signName = $("#sign-name").val();
            var signPhone = $("#sign-phone").val();
            var signTraffick = $("#sign-traffick").val();
            var signSafe = $("#sign-safe").is(":checked") ? 1 : 0;
            var price = $("#J-totalPrice .price").text();
            var ids = [];
            if (!signName) {
                $.alert("请填写报名人姓名");
                return
            } else if (!mobileReg.test(signPhone)) {
                $.alert("手机号填写错误");
                return
            }
            var jpBox = $("#join-people");
            jpBox.find("li").each(function() {
                ids.push($(this).attr("data-id"))
            });
            if (ids.length <= 0) {
                $.alert("请添加参与人");
                return
            } else {
                ids = ids.join(",");
                signParam = {
                    realName: signName,
                    mobile: signPhone,
                    price: price,
                    participatorIds: ids,
                    activityId: activityId
                };
                if (!$(".transportationType").hasClass("hide")) {
                    signParam.transportationType = signTraffick
                }
                if (!$(".isInsurance").hasClass("hide")) {
                    signParam.isInsurance = signSafe
                }
                if (signSafe == "1") {
                    signParam.insurancePrice = $(".insurancePrice").text()
                }
                return signParam
            }
        },
        _sign: function(data) {
            var self = this;
            if (self.code) {
                data.isUseCode = 1, data.inviteCode = self.inviteCode
            }
            $.ajax({
                type: "get",
                cach: false,
                data: data,
                url: "/activity/jsonSignup.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        if (self.code) {
                            var from = $("#J-from").val();
                            var href = "/activity/myActivity.html";
                            if (from == "fsl") {
                                href = "/" + href
                            }
                            window.location.href = href
                        } else {
                            var orderNo = res.data.orderNo;
                            ping.init(orderNo, "acitvity")
                        }
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
define("/WEB-UED/fancy/dist/c/js/pingPay-activity-debug", [], function(require, exports, module) {
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
                        } else {}
                    }, function() {
                        window.location.href = "/activity/myActivity.html"
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
define("/WEB-UED/fancy/dist/p/signup/participator-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
                stack1, helper, options;
            buffer += "\r\n  <li data-id=";
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
            buffer += escapeExpression(stack1) + '>\r\n    <label class="label-checkbox item-content">\r\n      <input type="checkbox" name="my-checkbox" data-type="0">\r\n      <div class="item-media"><i class="icon icon-form-checkbox"></i></div>\r\n      <div class="item-inner">\r\n        <div class="item-title-row">\r\n          <div class="item-title fz22">\r\n            <span rel="name">';
            if (helper = helpers.realName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.realName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "\r\n              ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sex, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sex, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n              ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sex, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sex, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n              <span class="fz14 color-gray">\r\n                ';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.age, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n              </span>\r\n            </span>\r\n          </div>\r\n          <div class="item-after">\r\n            <i class="color-orange iconfont" rel="delete">&#xe602;</i>\r\n          </div>\r\n        </div>\r\n        <div class="color-gray" rel="phone">';
            if (helper = helpers.mobile) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.mobile;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</div>\r\n      </div>\r\n    </label>\r\n  </li>\r\n";
            return buffer
        }

        function program2(depth0, data) {
            return "\r\n                (男)\r\n              "
        }

        function program4(depth0, data) {
            return "\r\n                (女)\r\n              "
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += "\r\n                  ";
            if (helper = helpers.age) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.age;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "岁\r\n                ";
            return buffer
        }
        buffer += "<ul>\r\n";
        stack1 = helpers.each.call(depth0, depth0, {
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