define("/WEB-UED/fancy/dist/p/orderConfirm/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/sui/city-data-debug", "/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/c/sui/city-picker-debug", "/WEB-UED/fancy/dist/p/orderConfirm/address-debug.handlebars", "/WEB-UED/fancy/dist/p/orderConfirm/edit-address-debug.handlebars", "/WEB-UED/fancy/dist/p/orderConfirm/add-debug.handlebars", "/WEB-UED/fancy/dist/p/orderConfirm/cart-debug.handlebars", "/WEB-UED/fancy/dist/p/orderConfirm/activity-debug.handlebars", "/WEB-UED/fancy/dist/p/orderConfirm/goods-debug.handlebars", "/WEB-UED/fancy/dist/c/js/pingPay-debug"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    require("/WEB-UED/fancy/dist/c/sui/city-data-debug");
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    require("/WEB-UED/fancy/dist/c/sui/city-picker-debug");
    var Taddress = require("/WEB-UED/fancy/dist/p/orderConfirm/address-debug.handlebars");
    var Teditaddress = require("/WEB-UED/fancy/dist/p/orderConfirm/edit-address-debug.handlebars");
    var Tadd = require("/WEB-UED/fancy/dist/p/orderConfirm/add-debug.handlebars");
    var Tcart = require("/WEB-UED/fancy/dist/p/orderConfirm/cart-debug.handlebars");
    var Tactivity = require("/WEB-UED/fancy/dist/p/orderConfirm/activity-debug.handlebars");
    var Tgoods = require("/WEB-UED/fancy/dist/p/orderConfirm/goods-debug.handlebars");
    var ping = require("/WEB-UED/fancy/dist/c/js/pingPay-debug");
    var main = {
        goodsCount: 1,
        init: function() {
            var self = this;
            var from = $("#J-from").val();
            self.PREURL = from ? "/" + from : "";
            self._event();
            self._orderType();
            $(document).on("pageInit", function(e, pageId, $page) {
                if (pageId == "address-list") {
                    self._getAddress($("#my-address"), Taddress)
                }
            });
            $(document).on("pageInit", function(e, pageId, $page) {
                if (pageId == "edit-address-list") {
                    self._getAddress($("#edit-my-address"), Teditaddress)
                }
            });
            $(document).on("pageInit", function(e, pageId, $page) {
                if (pageId == "address-add") {
                    $("#address-add .list-block").html(Tadd());
                    self._setCity("#J-city")
                }
            })
        },
        _event: function() {
            var self = this;
            self.orderType = $("#J-order-type").val();
            if (self.orderType == 1) {
                $(".J-add").unbind("click").bind("click", function() {
                    var id = $(this).parents("li").attr("data-id");
                    self._editNum(true, id)
                });
                $(".J-cut").unbind("click").bind("click", function() {
                    var id = $(this).parents("li").attr("data-id");
                    self._editNum(false, id)
                })
            } else {
                G._editCount({
                    box: ".J-edit-count",
                    defaultCount: self.goodsCount
                });
                $(".J-edit-count").unbind("click").bind("click", function() {
                    var num = $(".J-number").text();
                    $("#J-totalPrice").text((num * self.onePrice).toFixed(2))
                })
            }
            $(".J-delete").unbind("click").bind("click", function() {
                var id = $(this).parents("li").attr("data-id");
                $.confirm("确定删除吗?", function() {
                    self._delete(id)
                })
            });
            $("#J-add-address").unbind("click").bind("click", function() {});
            $("#J-confirm-pay").unbind("click").bind("click", function() {
                if ($("#J-add-address").length) {
                    $.alert("请填写收货地址");
                    return
                }
                if (self.goodsType == 1) {
                    self._selectPayType()
                } else {
                    self._createOrder()
                }
            });
            $("#my-address li").off().on("click", function() {
                var addressId = $(this).attr("data-id");
                self._selectAddress(addressId);
                $(this).addClass("active").siblings().removeClass("active");
                window.history.back()
            });
            $("#edit-my-address li").unbind("click").bind("click", function() {
                var id = $(this).attr("data-id");
                var curItem;
                $.each(self.ADDRSS, function(i, item) {
                    if (item.id == id) {
                        curItem = item
                    }
                });
                var consigneeName = curItem.consigneeName || "";
                var consigneeMobile = curItem.consigneeMobile || "";
                var zipCode = curItem.zipCode || "";
                var addressDetail = curItem.addressDetail || "";
                var areaAddress = curItem.areaAddress || "";
                $("#J-edit-name").val(consigneeName);
                $("#J-edit-phone").val(consigneeMobile);
                $("#J-edit-code").val(zipCode);
                $("#J-edit-detail-address").val(addressDetail);
                $("#J-edit-city").val(areaAddress);
                $("#edit-address").attr("data-edit-id", id);
                self._setCity("#J-edit-city")
            });
            $("#J-edit-confirm").unbind("click").bind("click", function() {
                var name, phone, code, city, address;
                name = $("#J-edit-name").val();
                phone = $("#J-edit-phone").val();
                code = $("#J-edit-code").val();
                city = $("#J-edit-city").val();
                address = $("#J-edit-detail-address").val();
                var id = $("#edit-address").attr("data-edit-id");
                if (!name || !phone || !code || !city || !address) {
                    $.alert("请填写完整信息");
                    return
                }
                self._addConfirm({
                    id: id,
                    areaAddress: city,
                    addressDetail: address,
                    zipCode: code,
                    consigneeName: name,
                    consigneeMobile: phone,
                    isDefault: 0,
                    delFlag: 0
                })
            });
            $("#J-delete").unbind("click").bind("click", function() {
                $.confirm("确定删除吗?", function() {
                    self._delete()
                })
            });
            $("#J-default").unbind("click").bind("click", function() {
                self._default()
            });
            $("#J-confirm").unbind("click").bind("click", function() {
                self._add()
            })
        },
        _selectPayType: function() {
            var self = this;
            var buttons1 = [{
                text: "使用兑换码",
                bold: true,
                color: "danger",
                onClick: function() {
                    $.prompt("输入兑换码", function(value) {
                        if (value) {
                            self._validatorCode(value)
                        }
                    })
                }
            }, {
                text: "在线支付",
                onClick: function() {
                    self._createOrder()
                }
            }];
            var buttons2 = [{
                text: "取消",
                bg: "danger"
            }];
            var groups = [buttons1, buttons2];
            $.actions(groups)
        },
        _validatorCode: function(code) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                data: {
                    inviteCode: code,
                    activityId: $("#J-goodsId").val()
                },
                url: "/activity/verifyInviteCode.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._createOrder(code)
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
        _createOrder: function(code) {
            var self = this;
            var type = self.orderType;
            var data = {
                isCart: true
            };
            if (type == 2) {
                data = {
                    goodsId: $("#J-goodsId").val(),
                    goodsNum: $(".J-number").text(),
                    specify: $("#J-specify").val()
                }
            } else if (type == 3) {
                data = {
                    activitySetId: $("#J-activitySetId").val(),
                    goodsNum: $(".J-number").text()
                }
            }
            data.repeatToken = $("#J-repeatToken").val();
            var addressId = $("[data-address-id]").attr("data-address-id");
            if (addressId) {
                data.addressId = addressId
            }
            if (code) {
                data.inviteCode = code
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/confirmPay.json",
                data: data,
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        if (G._navigator().ios) {
                            G.connectWebViewJavascriptBridge(function(bridge) {
                                bridge.send({
                                    globale: "backRoot"
                                })
                            })
                        } else if (G._navigator().android && window.mall && window.mall.backRoot) {
                            window.mall.backRoot()
                        }
                        if (res.data.GoodsSkuDTOs) {
                            self._manageSku(res.data.GoodsSkuDTOs)
                        } else if (res.data.OrderDTO) {
                            var result = res.data.OrderDTO;
                            var orderNo = result.orderNo || "";
                            var paymentType = result.paymentType;
                            self.orderNo = orderNo;
                            if (code || paymentType == 3) {
                                location.href = "/order/myOrder.html"
                            } else {
                                ping.init(orderNo)
                            }
                        }
                    } else {
                        if (res.info.errorCode == "911") {
                            if (self.orderNo) {
                                var openId = $("#J-openId").val() || sessionStorage.openId || "";
                                var orderNo = self.orderNo || sessionStorage.orderNo;
                                location.href = self.PREURL + "/order/orderDetail.html?orderNo=" + orderNo + "&openId=" + openId
                            } else {
                                location.href = self.PREURL + "/order/myOrder.html"
                            }
                        } else {
                            $.alert(res.info.message)
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
        _manageSku: function(data) {
            var self = this;
            if (data.stocknum && data.stocknum.length) {
                $.each(data.stocknum, function(i, item) {
                    var id = item.goodsId;
                    $('#J-cart-ontent .goods-list li[data-id="' + id + '"]').append('<div class="cover-gray">                        <i class="iconfont mr5">&#xe686;</i>此商品库存不足！                    </div>')
                })
            }
            if (data.sku && data.sku.length) {
                $.each(data.sku, function(i, item) {
                    var kuid = item.goodsId;
                    $('#J-cart-ontent .goods-list li[data-id="' + kuid + '"]').append('<div class="cover-gray">                        <i class="iconfont mr5">&#xe686;</i>此商品规格异常！                    </div>')
                })
            }
        },
        _noGoods: function(res) {
            var self = this;
            res = res.data.GoodsSkuDTOs || {};
            $.each(res, function(i, item) {
                $('li[data-id="' + item.goodsId + '"]').css({
                    border: "solid 1px #f00",
                    backgroundColor: "#FCF6F8"
                })
            });
            $.alert("您的订单中存在库存不足的商品")
        },
        _confirmPay: function() {
            var self = this;
            var type = self.orderType;
            var data = {
                isCart: true,
                repeatToken: $("#J-repeatToken").val()
            };
            if (type == 2) {
                data = {
                    goodsId: $("#J-goodsId").val(),
                    goodsNum: $(".J-number").text(),
                    specify: $("#J-specify").val(),
                    repeatToken: $("#J-repeatToken").val()
                }
            } else if (type == 3) {
                data = {
                    activitySetId: $("#J-activitySetId").val(),
                    goodsNum: $(".J-number").text(),
                    repeatToken: $("#J-repeatToken").val()
                }
            }
            data.token = $("#J-token").val() || "";
            if (!G._navigator().isWeixin) {
                data.isWeixin = true;
                return
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/confirmPay.json",
                data: data,
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("body").html(res.data.alipayInput)
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
        _orderType: function() {
            var self = this;
            var type = self.orderType;
            self._getCartList()
        },
        _getCartList: function() {
            var self = this;
            var template = Tcart;
            var type = self.orderType;
            var data = {
                isCart: true
            };
            if (type == 2) {
                data = {
                    goodsId: $("#J-goodsId").val(),
                    goodsNum: $("#J-goodsNum").val()
                };
                template = Tgoods
            } else if (type == 3) {
                data = {
                    activitySetId: $("#J-activitySetId").val(),
                    goodsNum: $("#J-goodsNum").val()
                };
                template = Tactivity
            }
            $.ajax({
                type: "get",
                cach: false,
                url: "/order/confirmOrder.json",
                data: data,
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("#J-cart-ontent").html(template(res.data.OrderVO));
                        var totalPrice = res.data.OrderVO.totalPrice;
                        var totalSalePrice = res.data.OrderVO.totalSalePrice;
                        var goodsCount = res.data.OrderVO.goodsCount || 1;
                        var customerRedPacket = totalSalePrice - totalPrice || 0;
                        var goodsType = res.data.OrderVO.type || 0;
                        self.goodsType = goodsType;
                        self.goodsCount = goodsCount;
                        $("#J-totalPrice").html('￥<span class="J-total">' + totalPrice + '</span><span class="fz12 color-gray"> 已优惠' + customerRedPacket + "元</span>");
                        self.onePrice = (totalPrice / goodsCount).toFixed(2);
                        self._showSku();
                        self._event();
                        if (goodsType == 1) {
                            $(".J-edit-count").hide()
                        }
                    } else {
                        location.href = "/order/myOrder.html"
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
        _showSku: function() {
            var self = this;
            var type = self.orderType;
            var sku = $("#J-specify").val();
            if (sku.indexOf(":") == -1) {
                return
            }
            if (type = 2) {
                if (sku.length) {
                    var newSku = [];
                    sku = "{" + sku + "}";
                    sku = eval("(" + sku + ")");
                    $.each(sku, function(k, v) {
                        newSku.push(v)
                    });
                    newSku = newSku.join(",");
                    $(".J-specify-show").text(newSku)
                }
            }
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
                        self._getCartList()
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
                        self._getCartList()
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
        _setCity: function(id) {
            $(id).cityPicker({
                toolbarTemplate: '<header class="bar bar-nav">                <button class="button button-link pull-right close-picker">确定</button>                <h1 class="title">选择收货地址</h1>                </header>'
            })
        },
        _getAddress: function(box, handle) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/address/listAddress.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        box.html(handle(res.data.addressVOList));
                        self.ADDRSS = res.data.addressVOList;
                        var curId = $("[data-address-id]").attr("data-address-id");
                        if (curId) {
                            $("#my-address li").removeClass("active");
                            $('#my-address li[data-id="' + curId + '"]').addClass("active")
                        }
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
        _selectAddress: function(id) {
            var self = this;
            $.each(self.ADDRSS, function(i, item) {
                if (item.id == id) {
                    curItem = item
                }
            });
            var consigneeName = curItem.consigneeName || "";
            var consigneeMobile = curItem.consigneeMobile || "";
            var fullAddress = curItem.fullAddress || "";
            $(".order-address").html('<a class="block color-gray" data-address-id="' + id + '" href="#address-list">                <ul>                    <li>收货人：' + consigneeName + '<span class="fr">' + consigneeMobile + "</span></li>                    <li>" + fullAddress + '</li>                </ul>                <i class="iconfont fz20 address color-gray absolute">&#xe617;</i><i class="iconfont absolute fz14 color-gray map">&#xe614;</i>            </a>')
        },
        _default: function() {
            var self = this;
            var id = $("#edit-address").attr("data-edit-id");
            $.ajax({
                type: "get",
                cach: false,
                url: "/address/updateDefault.json",
                data: {
                    addressId: id
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $.router.back();
                        self._getAddress($("#edit-my-address"), Teditaddress);
                        self._getAddress($("#my-address"), Taddress)
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
        _delete: function() {
            var self = this;
            var id = $("#edit-address").attr("data-edit-id");
            $.ajax({
                type: "get",
                cach: false,
                url: "/address/deleteAddress.json",
                data: {
                    addressId: id
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $.router.back();
                        self._getAddress($("#edit-my-address"), Teditaddress);
                        self._getAddress($("#my-address"), Taddress)
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
        _add: function() {
            var self = this;
            var name, phone, code, city, address;
            name = $("#J-name").val();
            phone = $("#J-phone").val();
            code = $("#J-code").val();
            city = $("#J-city").val();
            address = $("#J-detail-address").val();
            if (!name || !phone || !code || !city || !address) {
                $.alert("请填写完整信息");
                return
            }
            self._addConfirm({
                areaAddress: city,
                addressDetail: address,
                zipCode: code,
                consigneeName: name,
                consigneeMobile: phone,
                isDefault: 0,
                delFlag: 0
            })
        },
        _addConfirm: function(data) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/address/addOrUpdateAddress.json",
                data: data,
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $.router.back();
                        self._getAddress($("#edit-my-address"), Teditaddress);
                        self._getAddress($("#my-address"), Taddress);
                        $(document).on("pageAnimationEnd", function(e, pageId, $page) {
                            var flag = $("#J-add-address").children('a[href="#address-add"]').length ? true : false;
                            if (pageId == "current-page" && flag) {
                                self._setAddress()
                            }
                        })
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
        _setAddress: function() {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/address/listAddress.json",
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self.ADDRSS = res.data.addressVOList;
                        var Adata = res.data.addressVOList[0];
                        var consigneeName = Adata.consigneeName || "";
                        var consigneeMobile = Adata.consigneeMobile || "";
                        var fullAddress = Adata.fullAddress || "";
                        var id = Adata.id || "";
                        $("#J-the-address").html('<div class="mb10 bg-white pd10 relative order-address"><a class="block color-gray" data-address-id="' + id + '" href="#address-list">                            <ul>                                <li>收货人：' + consigneeName + '<span class="fr">' + consigneeMobile + "</span></li>                                <li>" + fullAddress + '</li>                            </ul>                            <i class="iconfont fz20 address color-gray absolute">&#xe617;</i><i class="iconfont absolute fz14 color-gray map">&#xe614;</i>                        </a></div>');
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
define("/WEB-UED/fancy/dist/c/sui/city-data-debug", [], function(require, exports, module) {
    $.smConfig.rawCitiesData = [{
        name: "北京市",
        sub: [{
            name: "东城区"
        }, {
            name: "西城区"
        }, {
            name: "朝阳区"
        }, {
            name: "丰台区"
        }, {
            name: "石景山区"
        }, {
            name: "海淀区"
        }, {
            name: "门头沟区"
        }, {
            name: "房山区"
        }, {
            name: "通州区"
        }, {
            name: "顺义区"
        }, {
            name: "昌平区"
        }, {
            name: "大兴区"
        }, {
            name: "怀柔区"
        }, {
            name: "平谷区"
        }, {
            name: "密云县"
        }, {
            name: "延庆县"
        }],
        type: 0
    }, {
        name: "天津市",
        sub: [{
            name: "和平区"
        }, {
            name: "河东区"
        }, {
            name: "河西区"
        }, {
            name: "南开区"
        }, {
            name: "河北区"
        }, {
            name: "红桥区"
        }, {
            name: "东丽区"
        }, {
            name: "西青区"
        }, {
            name: "津南区"
        }, {
            name: "北辰区"
        }, {
            name: "武清区"
        }, {
            name: "宝坻区"
        }, {
            name: "滨海新区"
        }, {
            name: "宁河县"
        }, {
            name: "静海县"
        }, {
            name: "蓟县"
        }],
        type: 0
    }, {
        name: "河北省",
        sub: [{
            name: "石家庄市",
            sub: [{
                name: "长安区"
            }, {
                name: "桥东区"
            }, {
                name: "桥西区"
            }, {
                name: "新华区"
            }, {
                name: "井陉矿区"
            }, {
                name: "裕华区"
            }, {
                name: "井陉县"
            }, {
                name: "正定县"
            }, {
                name: "栾城县"
            }, {
                name: "行唐县"
            }, {
                name: "灵寿县"
            }, {
                name: "高邑县"
            }, {
                name: "深泽县"
            }, {
                name: "赞皇县"
            }, {
                name: "无极县"
            }, {
                name: "平山县"
            }, {
                name: "元氏县"
            }, {
                name: "赵县"
            }, {
                name: "辛集市"
            }, {
                name: "藁城市"
            }, {
                name: "晋州市"
            }, {
                name: "新乐市"
            }, {
                name: "鹿泉市"
            }],
            type: 0
        }, {
            name: "唐山市",
            sub: [{
                name: "路南区"
            }, {
                name: "路北区"
            }, {
                name: "古冶区"
            }, {
                name: "开平区"
            }, {
                name: "丰南区"
            }, {
                name: "丰润区"
            }, {
                name: "曹妃甸区"
            }, {
                name: "滦县"
            }, {
                name: "滦南县"
            }, {
                name: "乐亭县"
            }, {
                name: "迁西县"
            }, {
                name: "玉田县"
            }, {
                name: "遵化市"
            }, {
                name: "迁安市"
            }],
            type: 0
        }, {
            name: "秦皇岛市",
            sub: [{
                name: "海港区"
            }, {
                name: "山海关区"
            }, {
                name: "北戴河区"
            }, {
                name: "青龙满族自治县"
            }, {
                name: "昌黎县"
            }, {
                name: "抚宁县"
            }, {
                name: "卢龙县"
            }],
            type: 0
        }, {
            name: "邯郸市",
            sub: [{
                name: "邯山区"
            }, {
                name: "丛台区"
            }, {
                name: "复兴区"
            }, {
                name: "峰峰矿区"
            }, {
                name: "邯郸县"
            }, {
                name: "临漳县"
            }, {
                name: "成安县"
            }, {
                name: "大名县"
            }, {
                name: "涉县"
            }, {
                name: "磁县"
            }, {
                name: "肥乡县"
            }, {
                name: "永年县"
            }, {
                name: "邱县"
            }, {
                name: "鸡泽县"
            }, {
                name: "广平县"
            }, {
                name: "馆陶县"
            }, {
                name: "魏县"
            }, {
                name: "曲周县"
            }, {
                name: "武安市"
            }],
            type: 0
        }, {
            name: "邢台市",
            sub: [{
                name: "桥东区"
            }, {
                name: "桥西区"
            }, {
                name: "邢台县"
            }, {
                name: "临城县"
            }, {
                name: "内丘县"
            }, {
                name: "柏乡县"
            }, {
                name: "隆尧县"
            }, {
                name: "任县"
            }, {
                name: "南和县"
            }, {
                name: "宁晋县"
            }, {
                name: "巨鹿县"
            }, {
                name: "新河县"
            }, {
                name: "广宗县"
            }, {
                name: "平乡县"
            }, {
                name: "威县"
            }, {
                name: "清河县"
            }, {
                name: "临西县"
            }, {
                name: "南宫市"
            }, {
                name: "沙河市"
            }],
            type: 0
        }, {
            name: "保定市",
            sub: [{
                name: "新市区"
            }, {
                name: "北市区"
            }, {
                name: "南市区"
            }, {
                name: "满城县"
            }, {
                name: "清苑县"
            }, {
                name: "涞水县"
            }, {
                name: "阜平县"
            }, {
                name: "徐水县"
            }, {
                name: "定兴县"
            }, {
                name: "唐县"
            }, {
                name: "高阳县"
            }, {
                name: "容城县"
            }, {
                name: "涞源县"
            }, {
                name: "望都县"
            }, {
                name: "安新县"
            }, {
                name: "易县"
            }, {
                name: "曲阳县"
            }, {
                name: "蠡县"
            }, {
                name: "顺平县"
            }, {
                name: "博野县"
            }, {
                name: "雄县"
            }, {
                name: "涿州市"
            }, {
                name: "定州市"
            }, {
                name: "安国市"
            }, {
                name: "高碑店市"
            }],
            type: 0
        }, {
            name: "张家口市",
            sub: [{
                name: "桥东区"
            }, {
                name: "桥西区"
            }, {
                name: "宣化区"
            }, {
                name: "下花园区"
            }, {
                name: "宣化县"
            }, {
                name: "张北县"
            }, {
                name: "康保县"
            }, {
                name: "沽源县"
            }, {
                name: "尚义县"
            }, {
                name: "蔚县"
            }, {
                name: "阳原县"
            }, {
                name: "怀安县"
            }, {
                name: "万全县"
            }, {
                name: "怀来县"
            }, {
                name: "涿鹿县"
            }, {
                name: "赤城县"
            }, {
                name: "崇礼县"
            }],
            type: 0
        }, {
            name: "承德市",
            sub: [{
                name: "双桥区"
            }, {
                name: "双滦区"
            }, {
                name: "鹰手营子矿区"
            }, {
                name: "承德县"
            }, {
                name: "兴隆县"
            }, {
                name: "平泉县"
            }, {
                name: "滦平县"
            }, {
                name: "隆化县"
            }, {
                name: "丰宁满族自治县"
            }, {
                name: "宽城满族自治县"
            }, {
                name: "围场满族蒙古族自治县"
            }],
            type: 0
        }, {
            name: "沧州市",
            sub: [{
                name: "新华区"
            }, {
                name: "运河区"
            }, {
                name: "沧县"
            }, {
                name: "青县"
            }, {
                name: "东光县"
            }, {
                name: "海兴县"
            }, {
                name: "盐山县"
            }, {
                name: "肃宁县"
            }, {
                name: "南皮县"
            }, {
                name: "吴桥县"
            }, {
                name: "献县"
            }, {
                name: "孟村回族自治县"
            }, {
                name: "泊头市"
            }, {
                name: "任丘市"
            }, {
                name: "黄骅市"
            }, {
                name: "河间市"
            }],
            type: 0
        }, {
            name: "廊坊市",
            sub: [{
                name: "安次区"
            }, {
                name: "广阳区"
            }, {
                name: "固安县"
            }, {
                name: "永清县"
            }, {
                name: "香河县"
            }, {
                name: "大城县"
            }, {
                name: "文安县"
            }, {
                name: "大厂回族自治县"
            }, {
                name: "霸州市"
            }, {
                name: "三河市"
            }],
            type: 0
        }, {
            name: "衡水市",
            sub: [{
                name: "桃城区"
            }, {
                name: "枣强县"
            }, {
                name: "武邑县"
            }, {
                name: "武强县"
            }, {
                name: "饶阳县"
            }, {
                name: "安平县"
            }, {
                name: "故城县"
            }, {
                name: "景县"
            }, {
                name: "阜城县"
            }, {
                name: "冀州市"
            }, {
                name: "深州市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "山西省",
        sub: [{
            name: "太原市",
            sub: [{
                name: "小店区"
            }, {
                name: "迎泽区"
            }, {
                name: "杏花岭区"
            }, {
                name: "尖草坪区"
            }, {
                name: "万柏林区"
            }, {
                name: "晋源区"
            }, {
                name: "清徐县"
            }, {
                name: "阳曲县"
            }, {
                name: "娄烦县"
            }, {
                name: "古交市"
            }],
            type: 0
        }, {
            name: "大同市",
            sub: [{
                name: "城区"
            }, {
                name: "矿区"
            }, {
                name: "南郊区"
            }, {
                name: "新荣区"
            }, {
                name: "阳高县"
            }, {
                name: "天镇县"
            }, {
                name: "广灵县"
            }, {
                name: "灵丘县"
            }, {
                name: "浑源县"
            }, {
                name: "左云县"
            }, {
                name: "大同县"
            }],
            type: 0
        }, {
            name: "阳泉市",
            sub: [{
                name: "城区"
            }, {
                name: "矿区"
            }, {
                name: "郊区"
            }, {
                name: "平定县"
            }, {
                name: "盂县"
            }],
            type: 0
        }, {
            name: "长治市",
            sub: [{
                name: "城区"
            }, {
                name: "郊区"
            }, {
                name: "长治县"
            }, {
                name: "襄垣县"
            }, {
                name: "屯留县"
            }, {
                name: "平顺县"
            }, {
                name: "黎城县"
            }, {
                name: "壶关县"
            }, {
                name: "长子县"
            }, {
                name: "武乡县"
            }, {
                name: "沁县"
            }, {
                name: "沁源县"
            }, {
                name: "潞城市"
            }],
            type: 0
        }, {
            name: "晋城市",
            sub: [{
                name: "城区"
            }, {
                name: "沁水县"
            }, {
                name: "阳城县"
            }, {
                name: "陵川县"
            }, {
                name: "泽州县"
            }, {
                name: "高平市"
            }],
            type: 0
        }, {
            name: "朔州市",
            sub: [{
                name: "朔城区"
            }, {
                name: "平鲁区"
            }, {
                name: "山阴县"
            }, {
                name: "应县"
            }, {
                name: "右玉县"
            }, {
                name: "怀仁县"
            }],
            type: 0
        }, {
            name: "晋中市",
            sub: [{
                name: "榆次区"
            }, {
                name: "榆社县"
            }, {
                name: "左权县"
            }, {
                name: "和顺县"
            }, {
                name: "昔阳县"
            }, {
                name: "寿阳县"
            }, {
                name: "太谷县"
            }, {
                name: "祁县"
            }, {
                name: "平遥县"
            }, {
                name: "灵石县"
            }, {
                name: "介休市"
            }],
            type: 0
        }, {
            name: "运城市",
            sub: [{
                name: "盐湖区"
            }, {
                name: "临猗县"
            }, {
                name: "万荣县"
            }, {
                name: "闻喜县"
            }, {
                name: "稷山县"
            }, {
                name: "新绛县"
            }, {
                name: "绛县"
            }, {
                name: "垣曲县"
            }, {
                name: "夏县"
            }, {
                name: "平陆县"
            }, {
                name: "芮城县"
            }, {
                name: "永济市"
            }, {
                name: "河津市"
            }],
            type: 0
        }, {
            name: "忻州市",
            sub: [{
                name: "忻府区"
            }, {
                name: "定襄县"
            }, {
                name: "五台县"
            }, {
                name: "代县"
            }, {
                name: "繁峙县"
            }, {
                name: "宁武县"
            }, {
                name: "静乐县"
            }, {
                name: "神池县"
            }, {
                name: "五寨县"
            }, {
                name: "岢岚县"
            }, {
                name: "河曲县"
            }, {
                name: "保德县"
            }, {
                name: "偏关县"
            }, {
                name: "原平市"
            }],
            type: 0
        }, {
            name: "临汾市",
            sub: [{
                name: "尧都区"
            }, {
                name: "曲沃县"
            }, {
                name: "翼城县"
            }, {
                name: "襄汾县"
            }, {
                name: "洪洞县"
            }, {
                name: "古县"
            }, {
                name: "安泽县"
            }, {
                name: "浮山县"
            }, {
                name: "吉县"
            }, {
                name: "乡宁县"
            }, {
                name: "大宁县"
            }, {
                name: "隰县"
            }, {
                name: "永和县"
            }, {
                name: "蒲县"
            }, {
                name: "汾西县"
            }, {
                name: "侯马市"
            }, {
                name: "霍州市"
            }],
            type: 0
        }, {
            name: "吕梁市",
            sub: [{
                name: "离石区"
            }, {
                name: "文水县"
            }, {
                name: "交城县"
            }, {
                name: "兴县"
            }, {
                name: "临县"
            }, {
                name: "柳林县"
            }, {
                name: "石楼县"
            }, {
                name: "岚县"
            }, {
                name: "方山县"
            }, {
                name: "中阳县"
            }, {
                name: "交口县"
            }, {
                name: "孝义市"
            }, {
                name: "汾阳市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "内蒙古自治区",
        sub: [{
            name: "呼和浩特市",
            sub: [{
                name: "新城区"
            }, {
                name: "回民区"
            }, {
                name: "玉泉区"
            }, {
                name: "赛罕区"
            }, {
                name: "土默特左旗"
            }, {
                name: "托克托县"
            }, {
                name: "和林格尔县"
            }, {
                name: "清水河县"
            }, {
                name: "武川县"
            }],
            type: 0
        }, {
            name: "包头市",
            sub: [{
                name: "东河区"
            }, {
                name: "昆都仑区"
            }, {
                name: "青山区"
            }, {
                name: "石拐区"
            }, {
                name: "白云鄂博矿区"
            }, {
                name: "九原区"
            }, {
                name: "土默特右旗"
            }, {
                name: "固阳县"
            }, {
                name: "达尔罕茂明安联合旗"
            }],
            type: 0
        }, {
            name: "乌海市",
            sub: [{
                name: "海勃湾区"
            }, {
                name: "海南区"
            }, {
                name: "乌达区"
            }],
            type: 0
        }, {
            name: "赤峰市",
            sub: [{
                name: "红山区"
            }, {
                name: "元宝山区"
            }, {
                name: "松山区"
            }, {
                name: "阿鲁科尔沁旗"
            }, {
                name: "巴林左旗"
            }, {
                name: "巴林右旗"
            }, {
                name: "林西县"
            }, {
                name: "克什克腾旗"
            }, {
                name: "翁牛特旗"
            }, {
                name: "喀喇沁旗"
            }, {
                name: "宁城县"
            }, {
                name: "敖汉旗"
            }],
            type: 0
        }, {
            name: "通辽市",
            sub: [{
                name: "科尔沁区"
            }, {
                name: "科尔沁左翼中旗"
            }, {
                name: "科尔沁左翼后旗"
            }, {
                name: "开鲁县"
            }, {
                name: "库伦旗"
            }, {
                name: "奈曼旗"
            }, {
                name: "扎鲁特旗"
            }, {
                name: "霍林郭勒市"
            }],
            type: 0
        }, {
            name: "鄂尔多斯市",
            sub: [{
                name: "东胜区"
            }, {
                name: "达拉特旗"
            }, {
                name: "准格尔旗"
            }, {
                name: "鄂托克前旗"
            }, {
                name: "鄂托克旗"
            }, {
                name: "杭锦旗"
            }, {
                name: "乌审旗"
            }, {
                name: "伊金霍洛旗"
            }],
            type: 0
        }, {
            name: "呼伦贝尔市",
            sub: [{
                name: "海拉尔区"
            }, {
                name: "扎赉诺尔区"
            }, {
                name: "阿荣旗"
            }, {
                name: "莫力达瓦达斡尔族自治旗"
            }, {
                name: "鄂伦春自治旗"
            }, {
                name: "鄂温克族自治旗"
            }, {
                name: "陈巴尔虎旗"
            }, {
                name: "新巴尔虎左旗"
            }, {
                name: "新巴尔虎右旗"
            }, {
                name: "满洲里市"
            }, {
                name: "牙克石市"
            }, {
                name: "扎兰屯市"
            }, {
                name: "额尔古纳市"
            }, {
                name: "根河市"
            }],
            type: 0
        }, {
            name: "巴彦淖尔市",
            sub: [{
                name: "临河区"
            }, {
                name: "五原县"
            }, {
                name: "磴口县"
            }, {
                name: "乌拉特前旗"
            }, {
                name: "乌拉特中旗"
            }, {
                name: "乌拉特后旗"
            }, {
                name: "杭锦后旗"
            }],
            type: 0
        }, {
            name: "乌兰察布市",
            sub: [{
                name: "集宁区"
            }, {
                name: "卓资县"
            }, {
                name: "化德县"
            }, {
                name: "商都县"
            }, {
                name: "兴和县"
            }, {
                name: "凉城县"
            }, {
                name: "察哈尔右翼前旗"
            }, {
                name: "察哈尔右翼中旗"
            }, {
                name: "察哈尔右翼后旗"
            }, {
                name: "四子王旗"
            }, {
                name: "丰镇市"
            }],
            type: 0
        }, {
            name: "兴安盟",
            sub: [{
                name: "乌兰浩特市"
            }, {
                name: "阿尔山市"
            }, {
                name: "科尔沁右翼前旗"
            }, {
                name: "科尔沁右翼中旗"
            }, {
                name: "扎赉特旗"
            }, {
                name: "突泉县"
            }],
            type: 0
        }, {
            name: "锡林郭勒盟",
            sub: [{
                name: "二连浩特市"
            }, {
                name: "锡林浩特市"
            }, {
                name: "阿巴嘎旗"
            }, {
                name: "苏尼特左旗"
            }, {
                name: "苏尼特右旗"
            }, {
                name: "东乌珠穆沁旗"
            }, {
                name: "西乌珠穆沁旗"
            }, {
                name: "太仆寺旗"
            }, {
                name: "镶黄旗"
            }, {
                name: "正镶白旗"
            }, {
                name: "正蓝旗"
            }, {
                name: "多伦县"
            }],
            type: 0
        }, {
            name: "阿拉善盟",
            sub: [{
                name: "阿拉善左旗"
            }, {
                name: "阿拉善右旗"
            }, {
                name: "额济纳旗"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "辽宁省",
        sub: [{
            name: "沈阳市",
            sub: [{
                name: "和平区"
            }, {
                name: "沈河区"
            }, {
                name: "大东区"
            }, {
                name: "皇姑区"
            }, {
                name: "铁西区"
            }, {
                name: "苏家屯区"
            }, {
                name: "东陵区"
            }, {
                name: "沈北新区"
            }, {
                name: "于洪区"
            }, {
                name: "辽中县"
            }, {
                name: "康平县"
            }, {
                name: "法库县"
            }, {
                name: "新民市"
            }],
            type: 0
        }, {
            name: "大连市",
            sub: [{
                name: "中山区"
            }, {
                name: "西岗区"
            }, {
                name: "沙河口区"
            }, {
                name: "甘井子区"
            }, {
                name: "旅顺口区"
            }, {
                name: "金州区"
            }, {
                name: "长海县"
            }, {
                name: "瓦房店市"
            }, {
                name: "普兰店市"
            }, {
                name: "庄河市"
            }],
            type: 0
        }, {
            name: "鞍山市",
            sub: [{
                name: "铁东区"
            }, {
                name: "铁西区"
            }, {
                name: "立山区"
            }, {
                name: "千山区"
            }, {
                name: "台安县"
            }, {
                name: "岫岩满族自治县"
            }, {
                name: "海城市"
            }],
            type: 0
        }, {
            name: "抚顺市",
            sub: [{
                name: "新抚区"
            }, {
                name: "东洲区"
            }, {
                name: "望花区"
            }, {
                name: "顺城区"
            }, {
                name: "抚顺县"
            }, {
                name: "新宾满族自治县"
            }, {
                name: "清原满族自治县"
            }],
            type: 0
        }, {
            name: "本溪市",
            sub: [{
                name: "平山区"
            }, {
                name: "溪湖区"
            }, {
                name: "明山区"
            }, {
                name: "南芬区"
            }, {
                name: "本溪满族自治县"
            }, {
                name: "桓仁满族自治县"
            }],
            type: 0
        }, {
            name: "丹东市",
            sub: [{
                name: "元宝区"
            }, {
                name: "振兴区"
            }, {
                name: "振安区"
            }, {
                name: "宽甸满族自治县"
            }, {
                name: "东港市"
            }, {
                name: "凤城市"
            }],
            type: 0
        }, {
            name: "锦州市",
            sub: [{
                name: "古塔区"
            }, {
                name: "凌河区"
            }, {
                name: "太和区"
            }, {
                name: "黑山县"
            }, {
                name: "义县"
            }, {
                name: "凌海市"
            }, {
                name: "北镇市"
            }],
            type: 0
        }, {
            name: "营口市",
            sub: [{
                name: "站前区"
            }, {
                name: "西市区"
            }, {
                name: "鲅鱼圈区"
            }, {
                name: "老边区"
            }, {
                name: "盖州市"
            }, {
                name: "大石桥市"
            }],
            type: 0
        }, {
            name: "阜新市",
            sub: [{
                name: "海州区"
            }, {
                name: "新邱区"
            }, {
                name: "太平区"
            }, {
                name: "清河门区"
            }, {
                name: "细河区"
            }, {
                name: "阜新蒙古族自治县"
            }, {
                name: "彰武县"
            }],
            type: 0
        }, {
            name: "辽阳市",
            sub: [{
                name: "白塔区"
            }, {
                name: "文圣区"
            }, {
                name: "宏伟区"
            }, {
                name: "弓长岭区"
            }, {
                name: "太子河区"
            }, {
                name: "辽阳县"
            }, {
                name: "灯塔市"
            }],
            type: 0
        }, {
            name: "盘锦市",
            sub: [{
                name: "双台子区"
            }, {
                name: "兴隆台区"
            }, {
                name: "大洼县"
            }, {
                name: "盘山县"
            }],
            type: 0
        }, {
            name: "铁岭市",
            sub: [{
                name: "银州区"
            }, {
                name: "清河区"
            }, {
                name: "铁岭县"
            }, {
                name: "西丰县"
            }, {
                name: "昌图县"
            }, {
                name: "调兵山市"
            }, {
                name: "开原市"
            }],
            type: 0
        }, {
            name: "朝阳市",
            sub: [{
                name: "双塔区"
            }, {
                name: "龙城区"
            }, {
                name: "朝阳县"
            }, {
                name: "建平县"
            }, {
                name: "喀喇沁左翼蒙古族自治县"
            }, {
                name: "北票市"
            }, {
                name: "凌源市"
            }],
            type: 0
        }, {
            name: "葫芦岛市",
            sub: [{
                name: "连山区"
            }, {
                name: "龙港区"
            }, {
                name: "南票区"
            }, {
                name: "绥中县"
            }, {
                name: "建昌县"
            }, {
                name: "兴城市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "吉林省",
        sub: [{
            name: "长春市",
            sub: [{
                name: "南关区"
            }, {
                name: "宽城区"
            }, {
                name: "朝阳区"
            }, {
                name: "二道区"
            }, {
                name: "绿园区"
            }, {
                name: "双阳区"
            }, {
                name: "农安县"
            }, {
                name: "九台市"
            }, {
                name: "榆树市"
            }, {
                name: "德惠市"
            }],
            type: 0
        }, {
            name: "吉林市",
            sub: [{
                name: "昌邑区"
            }, {
                name: "龙潭区"
            }, {
                name: "船营区"
            }, {
                name: "丰满区"
            }, {
                name: "永吉县"
            }, {
                name: "蛟河市"
            }, {
                name: "桦甸市"
            }, {
                name: "舒兰市"
            }, {
                name: "磐石市"
            }],
            type: 0
        }, {
            name: "四平市",
            sub: [{
                name: "铁西区"
            }, {
                name: "铁东区"
            }, {
                name: "梨树县"
            }, {
                name: "伊通满族自治县"
            }, {
                name: "公主岭市"
            }, {
                name: "双辽市"
            }],
            type: 0
        }, {
            name: "辽源市",
            sub: [{
                name: "龙山区"
            }, {
                name: "西安区"
            }, {
                name: "东丰县"
            }, {
                name: "东辽县"
            }],
            type: 0
        }, {
            name: "通化市",
            sub: [{
                name: "东昌区"
            }, {
                name: "二道江区"
            }, {
                name: "通化县"
            }, {
                name: "辉南县"
            }, {
                name: "柳河县"
            }, {
                name: "梅河口市"
            }, {
                name: "集安市"
            }],
            type: 0
        }, {
            name: "白山市",
            sub: [{
                name: "浑江区"
            }, {
                name: "江源区"
            }, {
                name: "抚松县"
            }, {
                name: "靖宇县"
            }, {
                name: "长白朝鲜族自治县"
            }, {
                name: "临江市"
            }],
            type: 0
        }, {
            name: "松原市",
            sub: [{
                name: "宁江区"
            }, {
                name: "前郭尔罗斯蒙古族自治县"
            }, {
                name: "长岭县"
            }, {
                name: "乾安县"
            }, {
                name: "扶余市"
            }],
            type: 0
        }, {
            name: "白城市",
            sub: [{
                name: "洮北区"
            }, {
                name: "镇赉县"
            }, {
                name: "通榆县"
            }, {
                name: "洮南市"
            }, {
                name: "大安市"
            }],
            type: 0
        }, {
            name: "延边朝鲜族自治州",
            sub: [{
                name: "延吉市"
            }, {
                name: "图们市"
            }, {
                name: "敦化市"
            }, {
                name: "珲春市"
            }, {
                name: "龙井市"
            }, {
                name: "和龙市"
            }, {
                name: "汪清县"
            }, {
                name: "安图县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "黑龙江省",
        sub: [{
            name: "哈尔滨市",
            sub: [{
                name: "道里区"
            }, {
                name: "南岗区"
            }, {
                name: "道外区"
            }, {
                name: "平房区"
            }, {
                name: "松北区"
            }, {
                name: "香坊区"
            }, {
                name: "呼兰区"
            }, {
                name: "阿城区"
            }, {
                name: "依兰县"
            }, {
                name: "方正县"
            }, {
                name: "宾县"
            }, {
                name: "巴彦县"
            }, {
                name: "木兰县"
            }, {
                name: "通河县"
            }, {
                name: "延寿县"
            }, {
                name: "双城市"
            }, {
                name: "尚志市"
            }, {
                name: "五常市"
            }],
            type: 0
        }, {
            name: "齐齐哈尔市",
            sub: [{
                name: "龙沙区"
            }, {
                name: "建华区"
            }, {
                name: "铁锋区"
            }, {
                name: "昂昂溪区"
            }, {
                name: "富拉尔基区"
            }, {
                name: "碾子山区"
            }, {
                name: "梅里斯达斡尔族区"
            }, {
                name: "龙江县"
            }, {
                name: "依安县"
            }, {
                name: "泰来县"
            }, {
                name: "甘南县"
            }, {
                name: "富裕县"
            }, {
                name: "克山县"
            }, {
                name: "克东县"
            }, {
                name: "拜泉县"
            }, {
                name: "讷河市"
            }],
            type: 0
        }, {
            name: "鸡西市",
            sub: [{
                name: "鸡冠区"
            }, {
                name: "恒山区"
            }, {
                name: "滴道区"
            }, {
                name: "梨树区"
            }, {
                name: "城子河区"
            }, {
                name: "麻山区"
            }, {
                name: "鸡东县"
            }, {
                name: "虎林市"
            }, {
                name: "密山市"
            }],
            type: 0
        }, {
            name: "鹤岗市",
            sub: [{
                name: "向阳区"
            }, {
                name: "工农区"
            }, {
                name: "南山区"
            }, {
                name: "兴安区"
            }, {
                name: "东山区"
            }, {
                name: "兴山区"
            }, {
                name: "萝北县"
            }, {
                name: "绥滨县"
            }],
            type: 0
        }, {
            name: "双鸭山市",
            sub: [{
                name: "尖山区"
            }, {
                name: "岭东区"
            }, {
                name: "四方台区"
            }, {
                name: "宝山区"
            }, {
                name: "集贤县"
            }, {
                name: "友谊县"
            }, {
                name: "宝清县"
            }, {
                name: "饶河县"
            }],
            type: 0
        }, {
            name: "大庆市",
            sub: [{
                name: "萨尔图区"
            }, {
                name: "龙凤区"
            }, {
                name: "让胡路区"
            }, {
                name: "红岗区"
            }, {
                name: "大同区"
            }, {
                name: "肇州县"
            }, {
                name: "肇源县"
            }, {
                name: "林甸县"
            }, {
                name: "杜尔伯特蒙古族自治县"
            }],
            type: 0
        }, {
            name: "伊春市",
            sub: [{
                name: "伊春区"
            }, {
                name: "南岔区"
            }, {
                name: "友好区"
            }, {
                name: "西林区"
            }, {
                name: "翠峦区"
            }, {
                name: "新青区"
            }, {
                name: "美溪区"
            }, {
                name: "金山屯区"
            }, {
                name: "五营区"
            }, {
                name: "乌马河区"
            }, {
                name: "汤旺河区"
            }, {
                name: "带岭区"
            }, {
                name: "乌伊岭区"
            }, {
                name: "红星区"
            }, {
                name: "上甘岭区"
            }, {
                name: "嘉荫县"
            }, {
                name: "铁力市"
            }],
            type: 0
        }, {
            name: "佳木斯市",
            sub: [{
                name: "向阳区"
            }, {
                name: "前进区"
            }, {
                name: "东风区"
            }, {
                name: "郊区"
            }, {
                name: "桦南县"
            }, {
                name: "桦川县"
            }, {
                name: "汤原县"
            }, {
                name: "抚远县"
            }, {
                name: "同江市"
            }, {
                name: "富锦市"
            }],
            type: 0
        }, {
            name: "七台河市",
            sub: [{
                name: "新兴区"
            }, {
                name: "桃山区"
            }, {
                name: "茄子河区"
            }, {
                name: "勃利县"
            }],
            type: 0
        }, {
            name: "牡丹江市",
            sub: [{
                name: "东安区"
            }, {
                name: "阳明区"
            }, {
                name: "爱民区"
            }, {
                name: "西安区"
            }, {
                name: "东宁县"
            }, {
                name: "林口县"
            }, {
                name: "绥芬河市"
            }, {
                name: "海林市"
            }, {
                name: "宁安市"
            }, {
                name: "穆棱市"
            }],
            type: 0
        }, {
            name: "黑河市",
            sub: [{
                name: "爱辉区"
            }, {
                name: "嫩江县"
            }, {
                name: "逊克县"
            }, {
                name: "孙吴县"
            }, {
                name: "北安市"
            }, {
                name: "五大连池市"
            }],
            type: 0
        }, {
            name: "绥化市",
            sub: [{
                name: "北林区"
            }, {
                name: "望奎县"
            }, {
                name: "兰西县"
            }, {
                name: "青冈县"
            }, {
                name: "庆安县"
            }, {
                name: "明水县"
            }, {
                name: "绥棱县"
            }, {
                name: "安达市"
            }, {
                name: "肇东市"
            }, {
                name: "海伦市"
            }],
            type: 0
        }, {
            name: "大兴安岭地区",
            sub: [{
                name: "呼玛县"
            }, {
                name: "塔河县"
            }, {
                name: "漠河县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "上海市",
        sub: [{
            name: "黄浦区"
        }, {
            name: "徐汇区"
        }, {
            name: "长宁区"
        }, {
            name: "静安区"
        }, {
            name: "普陀区"
        }, {
            name: "闸北区"
        }, {
            name: "虹口区"
        }, {
            name: "杨浦区"
        }, {
            name: "闵行区"
        }, {
            name: "宝山区"
        }, {
            name: "嘉定区"
        }, {
            name: "浦东新区"
        }, {
            name: "金山区"
        }, {
            name: "松江区"
        }, {
            name: "青浦区"
        }, {
            name: "奉贤区"
        }, {
            name: "崇明县"
        }],
        type: 0
    }, {
        name: "江苏省",
        sub: [{
            name: "南京市",
            sub: [{
                name: "玄武区"
            }, {
                name: "秦淮区"
            }, {
                name: "建邺区"
            }, {
                name: "鼓楼区"
            }, {
                name: "浦口区"
            }, {
                name: "栖霞区"
            }, {
                name: "雨花台区"
            }, {
                name: "江宁区"
            }, {
                name: "六合区"
            }, {
                name: "溧水区"
            }, {
                name: "高淳区"
            }],
            type: 0
        }, {
            name: "无锡市",
            sub: [{
                name: "崇安区"
            }, {
                name: "南长区"
            }, {
                name: "北塘区"
            }, {
                name: "锡山区"
            }, {
                name: "惠山区"
            }, {
                name: "滨湖区"
            }, {
                name: "江阴市"
            }, {
                name: "宜兴市"
            }],
            type: 0
        }, {
            name: "徐州市",
            sub: [{
                name: "鼓楼区"
            }, {
                name: "云龙区"
            }, {
                name: "贾汪区"
            }, {
                name: "泉山区"
            }, {
                name: "铜山区"
            }, {
                name: "丰县"
            }, {
                name: "沛县"
            }, {
                name: "睢宁县"
            }, {
                name: "新沂市"
            }, {
                name: "邳州市"
            }],
            type: 0
        }, {
            name: "常州市",
            sub: [{
                name: "天宁区"
            }, {
                name: "钟楼区"
            }, {
                name: "戚墅堰区"
            }, {
                name: "新北区"
            }, {
                name: "武进区"
            }, {
                name: "溧阳市"
            }, {
                name: "金坛市"
            }],
            type: 0
        }, {
            name: "苏州市",
            sub: [{
                name: "虎丘区"
            }, {
                name: "吴中区"
            }, {
                name: "相城区"
            }, {
                name: "姑苏区"
            }, {
                name: "吴江区"
            }, {
                name: "常熟市"
            }, {
                name: "张家港市"
            }, {
                name: "昆山市"
            }, {
                name: "太仓市"
            }],
            type: 0
        }, {
            name: "南通市",
            sub: [{
                name: "崇川区"
            }, {
                name: "港闸区"
            }, {
                name: "通州区"
            }, {
                name: "海安县"
            }, {
                name: "如东县"
            }, {
                name: "启东市"
            }, {
                name: "如皋市"
            }, {
                name: "海门市"
            }],
            type: 0
        }, {
            name: "连云港市",
            sub: [{
                name: "连云区"
            }, {
                name: "新浦区"
            }, {
                name: "海州区"
            }, {
                name: "赣榆县"
            }, {
                name: "东海县"
            }, {
                name: "灌云县"
            }, {
                name: "灌南县"
            }],
            type: 0
        }, {
            name: "淮安市",
            sub: [{
                name: "清河区"
            }, {
                name: "淮安区"
            }, {
                name: "淮阴区"
            }, {
                name: "清浦区"
            }, {
                name: "涟水县"
            }, {
                name: "洪泽县"
            }, {
                name: "盱眙县"
            }, {
                name: "金湖县"
            }],
            type: 0
        }, {
            name: "盐城市",
            sub: [{
                name: "亭湖区"
            }, {
                name: "盐都区"
            }, {
                name: "响水县"
            }, {
                name: "滨海县"
            }, {
                name: "阜宁县"
            }, {
                name: "射阳县"
            }, {
                name: "建湖县"
            }, {
                name: "东台市"
            }, {
                name: "大丰市"
            }],
            type: 0
        }, {
            name: "扬州市",
            sub: [{
                name: "广陵区"
            }, {
                name: "邗江区"
            }, {
                name: "江都区"
            }, {
                name: "宝应县"
            }, {
                name: "仪征市"
            }, {
                name: "高邮市"
            }],
            type: 0
        }, {
            name: "镇江市",
            sub: [{
                name: "京口区"
            }, {
                name: "润州区"
            }, {
                name: "丹徒区"
            }, {
                name: "丹阳市"
            }, {
                name: "扬中市"
            }, {
                name: "句容市"
            }],
            type: 0
        }, {
            name: "泰州市",
            sub: [{
                name: "海陵区"
            }, {
                name: "高港区"
            }, {
                name: "姜堰区"
            }, {
                name: "兴化市"
            }, {
                name: "靖江市"
            }, {
                name: "泰兴市"
            }],
            type: 0
        }, {
            name: "宿迁市",
            sub: [{
                name: "宿城区"
            }, {
                name: "宿豫区"
            }, {
                name: "沭阳县"
            }, {
                name: "泗阳县"
            }, {
                name: "泗洪县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "浙江省",
        sub: [{
            name: "杭州市",
            sub: [{
                name: "上城区"
            }, {
                name: "下城区"
            }, {
                name: "江干区"
            }, {
                name: "拱墅区"
            }, {
                name: "西湖区"
            }, {
                name: "滨江区"
            }, {
                name: "萧山区"
            }, {
                name: "余杭区"
            }, {
                name: "桐庐县"
            }, {
                name: "淳安县"
            }, {
                name: "建德市"
            }, {
                name: "富阳市"
            }, {
                name: "临安市"
            }],
            type: 0
        }, {
            name: "宁波市",
            sub: [{
                name: "海曙区"
            }, {
                name: "江东区"
            }, {
                name: "江北区"
            }, {
                name: "北仑区"
            }, {
                name: "镇海区"
            }, {
                name: "鄞州区"
            }, {
                name: "象山县"
            }, {
                name: "宁海县"
            }, {
                name: "余姚市"
            }, {
                name: "慈溪市"
            }, {
                name: "奉化市"
            }],
            type: 0
        }, {
            name: "温州市",
            sub: [{
                name: "鹿城区"
            }, {
                name: "龙湾区"
            }, {
                name: "瓯海区"
            }, {
                name: "洞头县"
            }, {
                name: "永嘉县"
            }, {
                name: "平阳县"
            }, {
                name: "苍南县"
            }, {
                name: "文成县"
            }, {
                name: "泰顺县"
            }, {
                name: "瑞安市"
            }, {
                name: "乐清市"
            }],
            type: 0
        }, {
            name: "嘉兴市",
            sub: [{
                name: "南湖区"
            }, {
                name: "秀洲区"
            }, {
                name: "嘉善县"
            }, {
                name: "海盐县"
            }, {
                name: "海宁市"
            }, {
                name: "平湖市"
            }, {
                name: "桐乡市"
            }],
            type: 0
        }, {
            name: "湖州市",
            sub: [{
                name: "吴兴区"
            }, {
                name: "南浔区"
            }, {
                name: "德清县"
            }, {
                name: "长兴县"
            }, {
                name: "安吉县"
            }],
            type: 0
        }, {
            name: "绍兴市",
            sub: [{
                name: "越城区"
            }, {
                name: "绍兴县"
            }, {
                name: "新昌县"
            }, {
                name: "诸暨市"
            }, {
                name: "上虞市"
            }, {
                name: "嵊州市"
            }],
            type: 0
        }, {
            name: "金华市",
            sub: [{
                name: "婺城区"
            }, {
                name: "金东区"
            }, {
                name: "武义县"
            }, {
                name: "浦江县"
            }, {
                name: "磐安县"
            }, {
                name: "兰溪市"
            }, {
                name: "义乌市"
            }, {
                name: "东阳市"
            }, {
                name: "永康市"
            }],
            type: 0
        }, {
            name: "衢州市",
            sub: [{
                name: "柯城区"
            }, {
                name: "衢江区"
            }, {
                name: "常山县"
            }, {
                name: "开化县"
            }, {
                name: "龙游县"
            }, {
                name: "江山市"
            }],
            type: 0
        }, {
            name: "舟山市",
            sub: [{
                name: "定海区"
            }, {
                name: "普陀区"
            }, {
                name: "岱山县"
            }, {
                name: "嵊泗县"
            }],
            type: 0
        }, {
            name: "台州市",
            sub: [{
                name: "椒江区"
            }, {
                name: "黄岩区"
            }, {
                name: "路桥区"
            }, {
                name: "玉环县"
            }, {
                name: "三门县"
            }, {
                name: "天台县"
            }, {
                name: "仙居县"
            }, {
                name: "温岭市"
            }, {
                name: "临海市"
            }],
            type: 0
        }, {
            name: "丽水市",
            sub: [{
                name: "莲都区"
            }, {
                name: "青田县"
            }, {
                name: "缙云县"
            }, {
                name: "遂昌县"
            }, {
                name: "松阳县"
            }, {
                name: "云和县"
            }, {
                name: "庆元县"
            }, {
                name: "景宁畲族自治县"
            }, {
                name: "龙泉市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "安徽省",
        sub: [{
            name: "合肥市",
            sub: [{
                name: "瑶海区"
            }, {
                name: "庐阳区"
            }, {
                name: "蜀山区"
            }, {
                name: "包河区"
            }, {
                name: "长丰县"
            }, {
                name: "肥东县"
            }, {
                name: "肥西县"
            }, {
                name: "庐江县"
            }, {
                name: "巢湖市"
            }],
            type: 0
        }, {
            name: "芜湖市",
            sub: [{
                name: "镜湖区"
            }, {
                name: "弋江区"
            }, {
                name: "鸠江区"
            }, {
                name: "三山区"
            }, {
                name: "芜湖县"
            }, {
                name: "繁昌县"
            }, {
                name: "南陵县"
            }, {
                name: "无为县"
            }],
            type: 0
        }, {
            name: "蚌埠市",
            sub: [{
                name: "龙子湖区"
            }, {
                name: "蚌山区"
            }, {
                name: "禹会区"
            }, {
                name: "淮上区"
            }, {
                name: "怀远县"
            }, {
                name: "五河县"
            }, {
                name: "固镇县"
            }],
            type: 0
        }, {
            name: "淮南市",
            sub: [{
                name: "大通区"
            }, {
                name: "田家庵区"
            }, {
                name: "谢家集区"
            }, {
                name: "八公山区"
            }, {
                name: "潘集区"
            }, {
                name: "凤台县"
            }],
            type: 0
        }, {
            name: "马鞍山市",
            sub: [{
                name: "花山区"
            }, {
                name: "雨山区"
            }, {
                name: "博望区"
            }, {
                name: "当涂县"
            }, {
                name: "含山县"
            }, {
                name: "和县"
            }],
            type: 0
        }, {
            name: "淮北市",
            sub: [{
                name: "杜集区"
            }, {
                name: "相山区"
            }, {
                name: "烈山区"
            }, {
                name: "濉溪县"
            }],
            type: 0
        }, {
            name: "铜陵市",
            sub: [{
                name: "铜官山区"
            }, {
                name: "狮子山区"
            }, {
                name: "郊区"
            }, {
                name: "铜陵县"
            }],
            type: 0
        }, {
            name: "安庆市",
            sub: [{
                name: "迎江区"
            }, {
                name: "大观区"
            }, {
                name: "宜秀区"
            }, {
                name: "怀宁县"
            }, {
                name: "枞阳县"
            }, {
                name: "潜山县"
            }, {
                name: "太湖县"
            }, {
                name: "宿松县"
            }, {
                name: "望江县"
            }, {
                name: "岳西县"
            }, {
                name: "桐城市"
            }],
            type: 0
        }, {
            name: "黄山市",
            sub: [{
                name: "屯溪区"
            }, {
                name: "黄山区"
            }, {
                name: "徽州区"
            }, {
                name: "歙县"
            }, {
                name: "休宁县"
            }, {
                name: "黟县"
            }, {
                name: "祁门县"
            }],
            type: 0
        }, {
            name: "滁州市",
            sub: [{
                name: "琅琊区"
            }, {
                name: "南谯区"
            }, {
                name: "来安县"
            }, {
                name: "全椒县"
            }, {
                name: "定远县"
            }, {
                name: "凤阳县"
            }, {
                name: "天长市"
            }, {
                name: "明光市"
            }],
            type: 0
        }, {
            name: "阜阳市",
            sub: [{
                name: "颍州区"
            }, {
                name: "颍东区"
            }, {
                name: "颍泉区"
            }, {
                name: "临泉县"
            }, {
                name: "太和县"
            }, {
                name: "阜南县"
            }, {
                name: "颍上县"
            }, {
                name: "界首市"
            }],
            type: 0
        }, {
            name: "宿州市",
            sub: [{
                name: "埇桥区"
            }, {
                name: "砀山县"
            }, {
                name: "萧县"
            }, {
                name: "灵璧县"
            }, {
                name: "泗县"
            }],
            type: 0
        }, {
            name: "六安市",
            sub: [{
                name: "金安区"
            }, {
                name: "裕安区"
            }, {
                name: "寿县"
            }, {
                name: "霍邱县"
            }, {
                name: "舒城县"
            }, {
                name: "金寨县"
            }, {
                name: "霍山县"
            }],
            type: 0
        }, {
            name: "亳州市",
            sub: [{
                name: "谯城区"
            }, {
                name: "涡阳县"
            }, {
                name: "蒙城县"
            }, {
                name: "利辛县"
            }],
            type: 0
        }, {
            name: "池州市",
            sub: [{
                name: "贵池区"
            }, {
                name: "东至县"
            }, {
                name: "石台县"
            }, {
                name: "青阳县"
            }],
            type: 0
        }, {
            name: "宣城市",
            sub: [{
                name: "宣州区"
            }, {
                name: "郎溪县"
            }, {
                name: "广德县"
            }, {
                name: "泾县"
            }, {
                name: "绩溪县"
            }, {
                name: "旌德县"
            }, {
                name: "宁国市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "福建省",
        sub: [{
            name: "福州市",
            sub: [{
                name: "鼓楼区"
            }, {
                name: "台江区"
            }, {
                name: "仓山区"
            }, {
                name: "马尾区"
            }, {
                name: "晋安区"
            }, {
                name: "闽侯县"
            }, {
                name: "连江县"
            }, {
                name: "罗源县"
            }, {
                name: "闽清县"
            }, {
                name: "永泰县"
            }, {
                name: "平潭县"
            }, {
                name: "福清市"
            }, {
                name: "长乐市"
            }],
            type: 0
        }, {
            name: "厦门市",
            sub: [{
                name: "思明区"
            }, {
                name: "海沧区"
            }, {
                name: "湖里区"
            }, {
                name: "集美区"
            }, {
                name: "同安区"
            }, {
                name: "翔安区"
            }],
            type: 0
        }, {
            name: "莆田市",
            sub: [{
                name: "城厢区"
            }, {
                name: "涵江区"
            }, {
                name: "荔城区"
            }, {
                name: "秀屿区"
            }, {
                name: "仙游县"
            }],
            type: 0
        }, {
            name: "三明市",
            sub: [{
                name: "梅列区"
            }, {
                name: "三元区"
            }, {
                name: "明溪县"
            }, {
                name: "清流县"
            }, {
                name: "宁化县"
            }, {
                name: "大田县"
            }, {
                name: "尤溪县"
            }, {
                name: "沙县"
            }, {
                name: "将乐县"
            }, {
                name: "泰宁县"
            }, {
                name: "建宁县"
            }, {
                name: "永安市"
            }],
            type: 0
        }, {
            name: "泉州市",
            sub: [{
                name: "鲤城区"
            }, {
                name: "丰泽区"
            }, {
                name: "洛江区"
            }, {
                name: "泉港区"
            }, {
                name: "惠安县"
            }, {
                name: "安溪县"
            }, {
                name: "永春县"
            }, {
                name: "德化县"
            }, {
                name: "石狮市"
            }, {
                name: "晋江市"
            }, {
                name: "南安市"
            }],
            type: 0
        }, {
            name: "漳州市",
            sub: [{
                name: "芗城区"
            }, {
                name: "龙文区"
            }, {
                name: "云霄县"
            }, {
                name: "漳浦县"
            }, {
                name: "诏安县"
            }, {
                name: "长泰县"
            }, {
                name: "东山县"
            }, {
                name: "南靖县"
            }, {
                name: "平和县"
            }, {
                name: "华安县"
            }, {
                name: "龙海市"
            }],
            type: 0
        }, {
            name: "南平市",
            sub: [{
                name: "延平区"
            }, {
                name: "顺昌县"
            }, {
                name: "浦城县"
            }, {
                name: "光泽县"
            }, {
                name: "松溪县"
            }, {
                name: "政和县"
            }, {
                name: "邵武市"
            }, {
                name: "武夷山市"
            }, {
                name: "建瓯市"
            }, {
                name: "建阳市"
            }],
            type: 0
        }, {
            name: "龙岩市",
            sub: [{
                name: "新罗区"
            }, {
                name: "长汀县"
            }, {
                name: "永定县"
            }, {
                name: "上杭县"
            }, {
                name: "武平县"
            }, {
                name: "连城县"
            }, {
                name: "漳平市"
            }],
            type: 0
        }, {
            name: "宁德市",
            sub: [{
                name: "蕉城区"
            }, {
                name: "霞浦县"
            }, {
                name: "古田县"
            }, {
                name: "屏南县"
            }, {
                name: "寿宁县"
            }, {
                name: "周宁县"
            }, {
                name: "柘荣县"
            }, {
                name: "福安市"
            }, {
                name: "福鼎市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "江西省",
        sub: [{
            name: "南昌市",
            sub: [{
                name: "东湖区"
            }, {
                name: "西湖区"
            }, {
                name: "青云谱区"
            }, {
                name: "湾里区"
            }, {
                name: "青山湖区"
            }, {
                name: "南昌县"
            }, {
                name: "新建县"
            }, {
                name: "安义县"
            }, {
                name: "进贤县"
            }],
            type: 0
        }, {
            name: "景德镇市",
            sub: [{
                name: "昌江区"
            }, {
                name: "珠山区"
            }, {
                name: "浮梁县"
            }, {
                name: "乐平市"
            }],
            type: 0
        }, {
            name: "萍乡市",
            sub: [{
                name: "安源区"
            }, {
                name: "湘东区"
            }, {
                name: "莲花县"
            }, {
                name: "上栗县"
            }, {
                name: "芦溪县"
            }],
            type: 0
        }, {
            name: "九江市",
            sub: [{
                name: "庐山区"
            }, {
                name: "浔阳区"
            }, {
                name: "九江县"
            }, {
                name: "武宁县"
            }, {
                name: "修水县"
            }, {
                name: "永修县"
            }, {
                name: "德安县"
            }, {
                name: "星子县"
            }, {
                name: "都昌县"
            }, {
                name: "湖口县"
            }, {
                name: "彭泽县"
            }, {
                name: "瑞昌市"
            }, {
                name: "共青城市"
            }],
            type: 0
        }, {
            name: "新余市",
            sub: [{
                name: "渝水区"
            }, {
                name: "分宜县"
            }],
            type: 0
        }, {
            name: "鹰潭市",
            sub: [{
                name: "月湖区"
            }, {
                name: "余江县"
            }, {
                name: "贵溪市"
            }],
            type: 0
        }, {
            name: "赣州市",
            sub: [{
                name: "章贡区"
            }, {
                name: "赣县"
            }, {
                name: "信丰县"
            }, {
                name: "大余县"
            }, {
                name: "上犹县"
            }, {
                name: "崇义县"
            }, {
                name: "安远县"
            }, {
                name: "龙南县"
            }, {
                name: "定南县"
            }, {
                name: "全南县"
            }, {
                name: "宁都县"
            }, {
                name: "于都县"
            }, {
                name: "兴国县"
            }, {
                name: "会昌县"
            }, {
                name: "寻乌县"
            }, {
                name: "石城县"
            }, {
                name: "瑞金市"
            }, {
                name: "南康市"
            }],
            type: 0
        }, {
            name: "吉安市",
            sub: [{
                name: "吉州区"
            }, {
                name: "青原区"
            }, {
                name: "吉安县"
            }, {
                name: "吉水县"
            }, {
                name: "峡江县"
            }, {
                name: "新干县"
            }, {
                name: "永丰县"
            }, {
                name: "泰和县"
            }, {
                name: "遂川县"
            }, {
                name: "万安县"
            }, {
                name: "安福县"
            }, {
                name: "永新县"
            }, {
                name: "井冈山市"
            }],
            type: 0
        }, {
            name: "宜春市",
            sub: [{
                name: "袁州区"
            }, {
                name: "奉新县"
            }, {
                name: "万载县"
            }, {
                name: "上高县"
            }, {
                name: "宜丰县"
            }, {
                name: "靖安县"
            }, {
                name: "铜鼓县"
            }, {
                name: "丰城市"
            }, {
                name: "樟树市"
            }, {
                name: "高安市"
            }],
            type: 0
        }, {
            name: "抚州市",
            sub: [{
                name: "临川区"
            }, {
                name: "南城县"
            }, {
                name: "黎川县"
            }, {
                name: "南丰县"
            }, {
                name: "崇仁县"
            }, {
                name: "乐安县"
            }, {
                name: "宜黄县"
            }, {
                name: "金溪县"
            }, {
                name: "资溪县"
            }, {
                name: "东乡县"
            }, {
                name: "广昌县"
            }],
            type: 0
        }, {
            name: "上饶市",
            sub: [{
                name: "信州区"
            }, {
                name: "上饶县"
            }, {
                name: "广丰县"
            }, {
                name: "玉山县"
            }, {
                name: "铅山县"
            }, {
                name: "横峰县"
            }, {
                name: "弋阳县"
            }, {
                name: "余干县"
            }, {
                name: "鄱阳县"
            }, {
                name: "万年县"
            }, {
                name: "婺源县"
            }, {
                name: "德兴市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "山东省",
        sub: [{
            name: "济南市",
            sub: [{
                name: "历下区"
            }, {
                name: "市中区"
            }, {
                name: "槐荫区"
            }, {
                name: "天桥区"
            }, {
                name: "历城区"
            }, {
                name: "长清区"
            }, {
                name: "平阴县"
            }, {
                name: "济阳县"
            }, {
                name: "商河县"
            }, {
                name: "章丘市"
            }],
            type: 0
        }, {
            name: "青岛市",
            sub: [{
                name: "市南区"
            }, {
                name: "市北区"
            }, {
                name: "黄岛区"
            }, {
                name: "崂山区"
            }, {
                name: "李沧区"
            }, {
                name: "城阳区"
            }, {
                name: "胶州市"
            }, {
                name: "即墨市"
            }, {
                name: "平度市"
            }, {
                name: "莱西市"
            }],
            type: 0
        }, {
            name: "淄博市",
            sub: [{
                name: "淄川区"
            }, {
                name: "张店区"
            }, {
                name: "博山区"
            }, {
                name: "临淄区"
            }, {
                name: "周村区"
            }, {
                name: "桓台县"
            }, {
                name: "高青县"
            }, {
                name: "沂源县"
            }],
            type: 0
        }, {
            name: "枣庄市",
            sub: [{
                name: "市中区"
            }, {
                name: "薛城区"
            }, {
                name: "峄城区"
            }, {
                name: "台儿庄区"
            }, {
                name: "山亭区"
            }, {
                name: "滕州市"
            }],
            type: 0
        }, {
            name: "东营市",
            sub: [{
                name: "东营区"
            }, {
                name: "河口区"
            }, {
                name: "垦利县"
            }, {
                name: "利津县"
            }, {
                name: "广饶县"
            }],
            type: 0
        }, {
            name: "烟台市",
            sub: [{
                name: "芝罘区"
            }, {
                name: "福山区"
            }, {
                name: "牟平区"
            }, {
                name: "莱山区"
            }, {
                name: "长岛县"
            }, {
                name: "龙口市"
            }, {
                name: "莱阳市"
            }, {
                name: "莱州市"
            }, {
                name: "蓬莱市"
            }, {
                name: "招远市"
            }, {
                name: "栖霞市"
            }, {
                name: "海阳市"
            }],
            type: 0
        }, {
            name: "潍坊市",
            sub: [{
                name: "潍城区"
            }, {
                name: "寒亭区"
            }, {
                name: "坊子区"
            }, {
                name: "奎文区"
            }, {
                name: "临朐县"
            }, {
                name: "昌乐县"
            }, {
                name: "青州市"
            }, {
                name: "诸城市"
            }, {
                name: "寿光市"
            }, {
                name: "安丘市"
            }, {
                name: "高密市"
            }, {
                name: "昌邑市"
            }],
            type: 0
        }, {
            name: "济宁市",
            sub: [{
                name: "市中区"
            }, {
                name: "任城区"
            }, {
                name: "微山县"
            }, {
                name: "鱼台县"
            }, {
                name: "金乡县"
            }, {
                name: "嘉祥县"
            }, {
                name: "汶上县"
            }, {
                name: "泗水县"
            }, {
                name: "梁山县"
            }, {
                name: "曲阜市"
            }, {
                name: "兖州市"
            }, {
                name: "邹城市"
            }],
            type: 0
        }, {
            name: "泰安市",
            sub: [{
                name: "泰山区"
            }, {
                name: "岱岳区"
            }, {
                name: "宁阳县"
            }, {
                name: "东平县"
            }, {
                name: "新泰市"
            }, {
                name: "肥城市"
            }],
            type: 0
        }, {
            name: "威海市",
            sub: [{
                name: "环翠区"
            }, {
                name: "文登市"
            }, {
                name: "荣成市"
            }, {
                name: "乳山市"
            }],
            type: 0
        }, {
            name: "日照市",
            sub: [{
                name: "东港区"
            }, {
                name: "岚山区"
            }, {
                name: "五莲县"
            }, {
                name: "莒县"
            }],
            type: 0
        }, {
            name: "莱芜市",
            sub: [{
                name: "莱城区"
            }, {
                name: "钢城区"
            }],
            type: 0
        }, {
            name: "临沂市",
            sub: [{
                name: "兰山区"
            }, {
                name: "罗庄区"
            }, {
                name: "河东区"
            }, {
                name: "沂南县"
            }, {
                name: "郯城县"
            }, {
                name: "沂水县"
            }, {
                name: "苍山县"
            }, {
                name: "费县"
            }, {
                name: "平邑县"
            }, {
                name: "莒南县"
            }, {
                name: "蒙阴县"
            }, {
                name: "临沭县"
            }],
            type: 0
        }, {
            name: "德州市",
            sub: [{
                name: "德城区"
            }, {
                name: "陵县"
            }, {
                name: "宁津县"
            }, {
                name: "庆云县"
            }, {
                name: "临邑县"
            }, {
                name: "齐河县"
            }, {
                name: "平原县"
            }, {
                name: "夏津县"
            }, {
                name: "武城县"
            }, {
                name: "乐陵市"
            }, {
                name: "禹城市"
            }],
            type: 0
        }, {
            name: "聊城市",
            sub: [{
                name: "东昌府区"
            }, {
                name: "阳谷县"
            }, {
                name: "莘县"
            }, {
                name: "茌平县"
            }, {
                name: "东阿县"
            }, {
                name: "冠县"
            }, {
                name: "高唐县"
            }, {
                name: "临清市"
            }],
            type: 0
        }, {
            name: "滨州市",
            sub: [{
                name: "滨城区"
            }, {
                name: "惠民县"
            }, {
                name: "阳信县"
            }, {
                name: "无棣县"
            }, {
                name: "沾化县"
            }, {
                name: "博兴县"
            }, {
                name: "邹平县"
            }],
            type: 0
        }, {
            name: "菏泽市",
            sub: [{
                name: "牡丹区"
            }, {
                name: "曹县"
            }, {
                name: "单县"
            }, {
                name: "成武县"
            }, {
                name: "巨野县"
            }, {
                name: "郓城县"
            }, {
                name: "鄄城县"
            }, {
                name: "定陶县"
            }, {
                name: "东明县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "河南省",
        sub: [{
            name: "郑州市",
            sub: [{
                name: "中原区"
            }, {
                name: "二七区"
            }, {
                name: "管城回族区"
            }, {
                name: "金水区"
            }, {
                name: "上街区"
            }, {
                name: "惠济区"
            }, {
                name: "中牟县"
            }, {
                name: "巩义市"
            }, {
                name: "荥阳市"
            }, {
                name: "新密市"
            }, {
                name: "新郑市"
            }, {
                name: "登封市"
            }],
            type: 0
        }, {
            name: "开封市",
            sub: [{
                name: "龙亭区"
            }, {
                name: "顺河回族区"
            }, {
                name: "鼓楼区"
            }, {
                name: "禹王台区"
            }, {
                name: "金明区"
            }, {
                name: "杞县"
            }, {
                name: "通许县"
            }, {
                name: "尉氏县"
            }, {
                name: "开封县"
            }, {
                name: "兰考县"
            }],
            type: 0
        }, {
            name: "洛阳市",
            sub: [{
                name: "老城区"
            }, {
                name: "西工区"
            }, {
                name: "瀍河回族区"
            }, {
                name: "涧西区"
            }, {
                name: "吉利区"
            }, {
                name: "洛龙区"
            }, {
                name: "孟津县"
            }, {
                name: "新安县"
            }, {
                name: "栾川县"
            }, {
                name: "嵩县"
            }, {
                name: "汝阳县"
            }, {
                name: "宜阳县"
            }, {
                name: "洛宁县"
            }, {
                name: "伊川县"
            }, {
                name: "偃师市"
            }],
            type: 0
        }, {
            name: "平顶山市",
            sub: [{
                name: "新华区"
            }, {
                name: "卫东区"
            }, {
                name: "石龙区"
            }, {
                name: "湛河区"
            }, {
                name: "宝丰县"
            }, {
                name: "叶县"
            }, {
                name: "鲁山县"
            }, {
                name: "郏县"
            }, {
                name: "舞钢市"
            }, {
                name: "汝州市"
            }],
            type: 0
        }, {
            name: "安阳市",
            sub: [{
                name: "文峰区"
            }, {
                name: "北关区"
            }, {
                name: "殷都区"
            }, {
                name: "龙安区"
            }, {
                name: "安阳县"
            }, {
                name: "汤阴县"
            }, {
                name: "滑县"
            }, {
                name: "内黄县"
            }, {
                name: "林州市"
            }],
            type: 0
        }, {
            name: "鹤壁市",
            sub: [{
                name: "鹤山区"
            }, {
                name: "山城区"
            }, {
                name: "淇滨区"
            }, {
                name: "浚县"
            }, {
                name: "淇县"
            }],
            type: 0
        }, {
            name: "新乡市",
            sub: [{
                name: "红旗区"
            }, {
                name: "卫滨区"
            }, {
                name: "凤泉区"
            }, {
                name: "牧野区"
            }, {
                name: "新乡县"
            }, {
                name: "获嘉县"
            }, {
                name: "原阳县"
            }, {
                name: "延津县"
            }, {
                name: "封丘县"
            }, {
                name: "长垣县"
            }, {
                name: "卫辉市"
            }, {
                name: "辉县市"
            }],
            type: 0
        }, {
            name: "焦作市",
            sub: [{
                name: "解放区"
            }, {
                name: "中站区"
            }, {
                name: "马村区"
            }, {
                name: "山阳区"
            }, {
                name: "修武县"
            }, {
                name: "博爱县"
            }, {
                name: "武陟县"
            }, {
                name: "温县"
            }, {
                name: "沁阳市"
            }, {
                name: "孟州市"
            }],
            type: 0
        }, {
            name: "濮阳市",
            sub: [{
                name: "华龙区"
            }, {
                name: "清丰县"
            }, {
                name: "南乐县"
            }, {
                name: "范县"
            }, {
                name: "台前县"
            }, {
                name: "濮阳县"
            }],
            type: 0
        }, {
            name: "许昌市",
            sub: [{
                name: "魏都区"
            }, {
                name: "许昌县"
            }, {
                name: "鄢陵县"
            }, {
                name: "襄城县"
            }, {
                name: "禹州市"
            }, {
                name: "长葛市"
            }],
            type: 0
        }, {
            name: "漯河市",
            sub: [{
                name: "源汇区"
            }, {
                name: "郾城区"
            }, {
                name: "召陵区"
            }, {
                name: "舞阳县"
            }, {
                name: "临颍县"
            }],
            type: 0
        }, {
            name: "三门峡市",
            sub: [{
                name: "湖滨区"
            }, {
                name: "渑池县"
            }, {
                name: "陕县"
            }, {
                name: "卢氏县"
            }, {
                name: "义马市"
            }, {
                name: "灵宝市"
            }],
            type: 0
        }, {
            name: "南阳市",
            sub: [{
                name: "宛城区"
            }, {
                name: "卧龙区"
            }, {
                name: "南召县"
            }, {
                name: "方城县"
            }, {
                name: "西峡县"
            }, {
                name: "镇平县"
            }, {
                name: "内乡县"
            }, {
                name: "淅川县"
            }, {
                name: "社旗县"
            }, {
                name: "唐河县"
            }, {
                name: "新野县"
            }, {
                name: "桐柏县"
            }, {
                name: "邓州市"
            }],
            type: 0
        }, {
            name: "商丘市",
            sub: [{
                name: "梁园区"
            }, {
                name: "睢阳区"
            }, {
                name: "民权县"
            }, {
                name: "睢县"
            }, {
                name: "宁陵县"
            }, {
                name: "柘城县"
            }, {
                name: "虞城县"
            }, {
                name: "夏邑县"
            }, {
                name: "永城市"
            }],
            type: 0
        }, {
            name: "信阳市",
            sub: [{
                name: "浉河区"
            }, {
                name: "平桥区"
            }, {
                name: "罗山县"
            }, {
                name: "光山县"
            }, {
                name: "新县"
            }, {
                name: "商城县"
            }, {
                name: "固始县"
            }, {
                name: "潢川县"
            }, {
                name: "淮滨县"
            }, {
                name: "息县"
            }],
            type: 0
        }, {
            name: "周口市",
            sub: [{
                name: "川汇区"
            }, {
                name: "扶沟县"
            }, {
                name: "西华县"
            }, {
                name: "商水县"
            }, {
                name: "沈丘县"
            }, {
                name: "郸城县"
            }, {
                name: "淮阳县"
            }, {
                name: "太康县"
            }, {
                name: "鹿邑县"
            }, {
                name: "项城市"
            }],
            type: 0
        }, {
            name: "驻马店市",
            sub: [{
                name: "驿城区"
            }, {
                name: "西平县"
            }, {
                name: "上蔡县"
            }, {
                name: "平舆县"
            }, {
                name: "正阳县"
            }, {
                name: "确山县"
            }, {
                name: "泌阳县"
            }, {
                name: "汝南县"
            }, {
                name: "遂平县"
            }, {
                name: "新蔡县"
            }],
            type: 0
        }, {
            name: "省直辖县级行政区划",
            sub: [{
                name: "济源市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "湖北省",
        sub: [{
            name: "武汉市",
            sub: [{
                name: "江岸区"
            }, {
                name: "江汉区"
            }, {
                name: "硚口区"
            }, {
                name: "汉阳区"
            }, {
                name: "武昌区"
            }, {
                name: "青山区"
            }, {
                name: "洪山区"
            }, {
                name: "东西湖区"
            }, {
                name: "汉南区"
            }, {
                name: "蔡甸区"
            }, {
                name: "江夏区"
            }, {
                name: "黄陂区"
            }, {
                name: "新洲区"
            }],
            type: 0
        }, {
            name: "黄石市",
            sub: [{
                name: "黄石港区"
            }, {
                name: "西塞山区"
            }, {
                name: "下陆区"
            }, {
                name: "铁山区"
            }, {
                name: "阳新县"
            }, {
                name: "大冶市"
            }],
            type: 0
        }, {
            name: "十堰市",
            sub: [{
                name: "茅箭区"
            }, {
                name: "张湾区"
            }, {
                name: "郧县"
            }, {
                name: "郧西县"
            }, {
                name: "竹山县"
            }, {
                name: "竹溪县"
            }, {
                name: "房县"
            }, {
                name: "丹江口市"
            }],
            type: 0
        }, {
            name: "宜昌市",
            sub: [{
                name: "西陵区"
            }, {
                name: "伍家岗区"
            }, {
                name: "点军区"
            }, {
                name: "猇亭区"
            }, {
                name: "夷陵区"
            }, {
                name: "远安县"
            }, {
                name: "兴山县"
            }, {
                name: "秭归县"
            }, {
                name: "长阳土家族自治县"
            }, {
                name: "五峰土家族自治县"
            }, {
                name: "宜都市"
            }, {
                name: "当阳市"
            }, {
                name: "枝江市"
            }],
            type: 0
        }, {
            name: "襄阳市",
            sub: [{
                name: "襄城区"
            }, {
                name: "樊城区"
            }, {
                name: "襄州区"
            }, {
                name: "南漳县"
            }, {
                name: "谷城县"
            }, {
                name: "保康县"
            }, {
                name: "老河口市"
            }, {
                name: "枣阳市"
            }, {
                name: "宜城市"
            }],
            type: 0
        }, {
            name: "鄂州市",
            sub: [{
                name: "梁子湖区"
            }, {
                name: "华容区"
            }, {
                name: "鄂城区"
            }],
            type: 0
        }, {
            name: "荆门市",
            sub: [{
                name: "东宝区"
            }, {
                name: "掇刀区"
            }, {
                name: "京山县"
            }, {
                name: "沙洋县"
            }, {
                name: "钟祥市"
            }],
            type: 0
        }, {
            name: "孝感市",
            sub: [{
                name: "孝南区"
            }, {
                name: "孝昌县"
            }, {
                name: "大悟县"
            }, {
                name: "云梦县"
            }, {
                name: "应城市"
            }, {
                name: "安陆市"
            }, {
                name: "汉川市"
            }],
            type: 0
        }, {
            name: "荆州市",
            sub: [{
                name: "沙市区"
            }, {
                name: "荆州区"
            }, {
                name: "公安县"
            }, {
                name: "监利县"
            }, {
                name: "江陵县"
            }, {
                name: "石首市"
            }, {
                name: "洪湖市"
            }, {
                name: "松滋市"
            }],
            type: 0
        }, {
            name: "黄冈市",
            sub: [{
                name: "黄州区"
            }, {
                name: "团风县"
            }, {
                name: "红安县"
            }, {
                name: "罗田县"
            }, {
                name: "英山县"
            }, {
                name: "浠水县"
            }, {
                name: "蕲春县"
            }, {
                name: "黄梅县"
            }, {
                name: "麻城市"
            }, {
                name: "武穴市"
            }],
            type: 0
        }, {
            name: "咸宁市",
            sub: [{
                name: "咸安区"
            }, {
                name: "嘉鱼县"
            }, {
                name: "通城县"
            }, {
                name: "崇阳县"
            }, {
                name: "通山县"
            }, {
                name: "赤壁市"
            }],
            type: 0
        }, {
            name: "随州市",
            sub: [{
                name: "曾都区"
            }, {
                name: "随县"
            }, {
                name: "广水市"
            }],
            type: 0
        }, {
            name: "恩施土家族苗族自治州",
            sub: [{
                name: "恩施市"
            }, {
                name: "利川市"
            }, {
                name: "建始县"
            }, {
                name: "巴东县"
            }, {
                name: "宣恩县"
            }, {
                name: "咸丰县"
            }, {
                name: "来凤县"
            }, {
                name: "鹤峰县"
            }],
            type: 0
        }, {
            name: "省直辖县级行政区划",
            sub: [{
                name: "仙桃市"
            }, {
                name: "潜江市"
            }, {
                name: "天门市"
            }, {
                name: "神农架林区"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "湖南省",
        sub: [{
            name: "长沙市",
            sub: [{
                name: "芙蓉区"
            }, {
                name: "天心区"
            }, {
                name: "岳麓区"
            }, {
                name: "开福区"
            }, {
                name: "雨花区"
            }, {
                name: "望城区"
            }, {
                name: "长沙县"
            }, {
                name: "宁乡县"
            }, {
                name: "浏阳市"
            }],
            type: 0
        }, {
            name: "株洲市",
            sub: [{
                name: "荷塘区"
            }, {
                name: "芦淞区"
            }, {
                name: "石峰区"
            }, {
                name: "天元区"
            }, {
                name: "株洲县"
            }, {
                name: "攸县"
            }, {
                name: "茶陵县"
            }, {
                name: "炎陵县"
            }, {
                name: "醴陵市"
            }],
            type: 0
        }, {
            name: "湘潭市",
            sub: [{
                name: "雨湖区"
            }, {
                name: "岳塘区"
            }, {
                name: "湘潭县"
            }, {
                name: "湘乡市"
            }, {
                name: "韶山市"
            }],
            type: 0
        }, {
            name: "衡阳市",
            sub: [{
                name: "珠晖区"
            }, {
                name: "雁峰区"
            }, {
                name: "石鼓区"
            }, {
                name: "蒸湘区"
            }, {
                name: "南岳区"
            }, {
                name: "衡阳县"
            }, {
                name: "衡南县"
            }, {
                name: "衡山县"
            }, {
                name: "衡东县"
            }, {
                name: "祁东县"
            }, {
                name: "耒阳市"
            }, {
                name: "常宁市"
            }],
            type: 0
        }, {
            name: "邵阳市",
            sub: [{
                name: "双清区"
            }, {
                name: "大祥区"
            }, {
                name: "北塔区"
            }, {
                name: "邵东县"
            }, {
                name: "新邵县"
            }, {
                name: "邵阳县"
            }, {
                name: "隆回县"
            }, {
                name: "洞口县"
            }, {
                name: "绥宁县"
            }, {
                name: "新宁县"
            }, {
                name: "城步苗族自治县"
            }, {
                name: "武冈市"
            }],
            type: 0
        }, {
            name: "岳阳市",
            sub: [{
                name: "岳阳楼区"
            }, {
                name: "云溪区"
            }, {
                name: "君山区"
            }, {
                name: "岳阳县"
            }, {
                name: "华容县"
            }, {
                name: "湘阴县"
            }, {
                name: "平江县"
            }, {
                name: "汨罗市"
            }, {
                name: "临湘市"
            }],
            type: 0
        }, {
            name: "常德市",
            sub: [{
                name: "武陵区"
            }, {
                name: "鼎城区"
            }, {
                name: "安乡县"
            }, {
                name: "汉寿县"
            }, {
                name: "澧县"
            }, {
                name: "临澧县"
            }, {
                name: "桃源县"
            }, {
                name: "石门县"
            }, {
                name: "津市市"
            }],
            type: 0
        }, {
            name: "张家界市",
            sub: [{
                name: "永定区"
            }, {
                name: "武陵源区"
            }, {
                name: "慈利县"
            }, {
                name: "桑植县"
            }],
            type: 0
        }, {
            name: "益阳市",
            sub: [{
                name: "资阳区"
            }, {
                name: "赫山区"
            }, {
                name: "南县"
            }, {
                name: "桃江县"
            }, {
                name: "安化县"
            }, {
                name: "沅江市"
            }],
            type: 0
        }, {
            name: "郴州市",
            sub: [{
                name: "北湖区"
            }, {
                name: "苏仙区"
            }, {
                name: "桂阳县"
            }, {
                name: "宜章县"
            }, {
                name: "永兴县"
            }, {
                name: "嘉禾县"
            }, {
                name: "临武县"
            }, {
                name: "汝城县"
            }, {
                name: "桂东县"
            }, {
                name: "安仁县"
            }, {
                name: "资兴市"
            }],
            type: 0
        }, {
            name: "永州市",
            sub: [{
                name: "零陵区"
            }, {
                name: "冷水滩区"
            }, {
                name: "祁阳县"
            }, {
                name: "东安县"
            }, {
                name: "双牌县"
            }, {
                name: "道县"
            }, {
                name: "江永县"
            }, {
                name: "宁远县"
            }, {
                name: "蓝山县"
            }, {
                name: "新田县"
            }, {
                name: "江华瑶族自治县"
            }],
            type: 0
        }, {
            name: "怀化市",
            sub: [{
                name: "鹤城区"
            }, {
                name: "中方县"
            }, {
                name: "沅陵县"
            }, {
                name: "辰溪县"
            }, {
                name: "溆浦县"
            }, {
                name: "会同县"
            }, {
                name: "麻阳苗族自治县"
            }, {
                name: "新晃侗族自治县"
            }, {
                name: "芷江侗族自治县"
            }, {
                name: "靖州苗族侗族自治县"
            }, {
                name: "通道侗族自治县"
            }, {
                name: "洪江市"
            }],
            type: 0
        }, {
            name: "娄底市",
            sub: [{
                name: "娄星区"
            }, {
                name: "双峰县"
            }, {
                name: "新化县"
            }, {
                name: "冷水江市"
            }, {
                name: "涟源市"
            }],
            type: 0
        }, {
            name: "湘西土家族苗族自治州",
            sub: [{
                name: "吉首市"
            }, {
                name: "泸溪县"
            }, {
                name: "凤凰县"
            }, {
                name: "花垣县"
            }, {
                name: "保靖县"
            }, {
                name: "古丈县"
            }, {
                name: "永顺县"
            }, {
                name: "龙山县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "广东省",
        sub: [{
            name: "广州市",
            sub: [{
                name: "荔湾区"
            }, {
                name: "越秀区"
            }, {
                name: "海珠区"
            }, {
                name: "天河区"
            }, {
                name: "白云区"
            }, {
                name: "黄埔区"
            }, {
                name: "番禺区"
            }, {
                name: "花都区"
            }, {
                name: "南沙区"
            }, {
                name: "萝岗区"
            }, {
                name: "增城市"
            }, {
                name: "从化市"
            }],
            type: 0
        }, {
            name: "韶关市",
            sub: [{
                name: "武江区"
            }, {
                name: "浈江区"
            }, {
                name: "曲江区"
            }, {
                name: "始兴县"
            }, {
                name: "仁化县"
            }, {
                name: "翁源县"
            }, {
                name: "乳源瑶族自治县"
            }, {
                name: "新丰县"
            }, {
                name: "乐昌市"
            }, {
                name: "南雄市"
            }],
            type: 0
        }, {
            name: "深圳市",
            sub: [{
                name: "罗湖区"
            }, {
                name: "福田区"
            }, {
                name: "南山区"
            }, {
                name: "宝安区"
            }, {
                name: "龙岗区"
            }, {
                name: "盐田区"
            }],
            type: 0
        }, {
            name: "珠海市",
            sub: [{
                name: "香洲区"
            }, {
                name: "斗门区"
            }, {
                name: "金湾区"
            }],
            type: 0
        }, {
            name: "汕头市",
            sub: [{
                name: "龙湖区"
            }, {
                name: "金平区"
            }, {
                name: "濠江区"
            }, {
                name: "潮阳区"
            }, {
                name: "潮南区"
            }, {
                name: "澄海区"
            }, {
                name: "南澳县"
            }],
            type: 0
        }, {
            name: "佛山市",
            sub: [{
                name: "禅城区"
            }, {
                name: "南海区"
            }, {
                name: "顺德区"
            }, {
                name: "三水区"
            }, {
                name: "高明区"
            }],
            type: 0
        }, {
            name: "江门市",
            sub: [{
                name: "蓬江区"
            }, {
                name: "江海区"
            }, {
                name: "新会区"
            }, {
                name: "台山市"
            }, {
                name: "开平市"
            }, {
                name: "鹤山市"
            }, {
                name: "恩平市"
            }],
            type: 0
        }, {
            name: "湛江市",
            sub: [{
                name: "赤坎区"
            }, {
                name: "霞山区"
            }, {
                name: "坡头区"
            }, {
                name: "麻章区"
            }, {
                name: "遂溪县"
            }, {
                name: "徐闻县"
            }, {
                name: "廉江市"
            }, {
                name: "雷州市"
            }, {
                name: "吴川市"
            }],
            type: 0
        }, {
            name: "茂名市",
            sub: [{
                name: "茂南区"
            }, {
                name: "茂港区"
            }, {
                name: "电白县"
            }, {
                name: "高州市"
            }, {
                name: "化州市"
            }, {
                name: "信宜市"
            }],
            type: 0
        }, {
            name: "肇庆市",
            sub: [{
                name: "端州区"
            }, {
                name: "鼎湖区"
            }, {
                name: "广宁县"
            }, {
                name: "怀集县"
            }, {
                name: "封开县"
            }, {
                name: "德庆县"
            }, {
                name: "高要市"
            }, {
                name: "四会市"
            }],
            type: 0
        }, {
            name: "惠州市",
            sub: [{
                name: "惠城区"
            }, {
                name: "惠阳区"
            }, {
                name: "博罗县"
            }, {
                name: "惠东县"
            }, {
                name: "龙门县"
            }],
            type: 0
        }, {
            name: "梅州市",
            sub: [{
                name: "梅江区"
            }, {
                name: "梅县"
            }, {
                name: "大埔县"
            }, {
                name: "丰顺县"
            }, {
                name: "五华县"
            }, {
                name: "平远县"
            }, {
                name: "蕉岭县"
            }, {
                name: "兴宁市"
            }],
            type: 0
        }, {
            name: "汕尾市",
            sub: [{
                name: "城区"
            }, {
                name: "海丰县"
            }, {
                name: "陆河县"
            }, {
                name: "陆丰市"
            }],
            type: 0
        }, {
            name: "河源市",
            sub: [{
                name: "源城区"
            }, {
                name: "紫金县"
            }, {
                name: "龙川县"
            }, {
                name: "连平县"
            }, {
                name: "和平县"
            }, {
                name: "东源县"
            }],
            type: 0
        }, {
            name: "阳江市",
            sub: [{
                name: "江城区"
            }, {
                name: "阳西县"
            }, {
                name: "阳东县"
            }, {
                name: "阳春市"
            }],
            type: 0
        }, {
            name: "清远市",
            sub: [{
                name: "清城区"
            }, {
                name: "清新区"
            }, {
                name: "佛冈县"
            }, {
                name: "阳山县"
            }, {
                name: "连山壮族瑶族自治县"
            }, {
                name: "连南瑶族自治县"
            }, {
                name: "英德市"
            }, {
                name: "连州市"
            }],
            type: 0
        }, {
            name: "东莞市",
            sub: [{
                name: "东莞市"
            }],
            type: 0
        }, {
            name: "中山市",
            sub: [{
                name: "中山市"
            }],
            type: 0
        }, {
            name: "潮州市",
            sub: [{
                name: "湘桥区"
            }, {
                name: "潮安区"
            }, {
                name: "饶平县"
            }],
            type: 0
        }, {
            name: "揭阳市",
            sub: [{
                name: "榕城区"
            }, {
                name: "揭东区"
            }, {
                name: "揭西县"
            }, {
                name: "惠来县"
            }, {
                name: "普宁市"
            }],
            type: 0
        }, {
            name: "云浮市",
            sub: [{
                name: "云城区"
            }, {
                name: "新兴县"
            }, {
                name: "郁南县"
            }, {
                name: "云安县"
            }, {
                name: "罗定市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "广西壮族自治区",
        sub: [{
            name: "南宁市",
            sub: [{
                name: "兴宁区"
            }, {
                name: "青秀区"
            }, {
                name: "江南区"
            }, {
                name: "西乡塘区"
            }, {
                name: "良庆区"
            }, {
                name: "邕宁区"
            }, {
                name: "武鸣县"
            }, {
                name: "隆安县"
            }, {
                name: "马山县"
            }, {
                name: "上林县"
            }, {
                name: "宾阳县"
            }, {
                name: "横县"
            }],
            type: 0
        }, {
            name: "柳州市",
            sub: [{
                name: "城中区"
            }, {
                name: "鱼峰区"
            }, {
                name: "柳南区"
            }, {
                name: "柳北区"
            }, {
                name: "柳江县"
            }, {
                name: "柳城县"
            }, {
                name: "鹿寨县"
            }, {
                name: "融安县"
            }, {
                name: "融水苗族自治县"
            }, {
                name: "三江侗族自治县"
            }],
            type: 0
        }, {
            name: "桂林市",
            sub: [{
                name: "秀峰区"
            }, {
                name: "叠彩区"
            }, {
                name: "象山区"
            }, {
                name: "七星区"
            }, {
                name: "雁山区"
            }, {
                name: "临桂区"
            }, {
                name: "阳朔县"
            }, {
                name: "灵川县"
            }, {
                name: "全州县"
            }, {
                name: "兴安县"
            }, {
                name: "永福县"
            }, {
                name: "灌阳县"
            }, {
                name: "龙胜各族自治县"
            }, {
                name: "资源县"
            }, {
                name: "平乐县"
            }, {
                name: "荔浦县"
            }, {
                name: "恭城瑶族自治县"
            }],
            type: 0
        }, {
            name: "梧州市",
            sub: [{
                name: "万秀区"
            }, {
                name: "长洲区"
            }, {
                name: "龙圩区"
            }, {
                name: "苍梧县"
            }, {
                name: "藤县"
            }, {
                name: "蒙山县"
            }, {
                name: "岑溪市"
            }],
            type: 0
        }, {
            name: "北海市",
            sub: [{
                name: "海城区"
            }, {
                name: "银海区"
            }, {
                name: "铁山港区"
            }, {
                name: "合浦县"
            }],
            type: 0
        }, {
            name: "防城港市",
            sub: [{
                name: "港口区"
            }, {
                name: "防城区"
            }, {
                name: "上思县"
            }, {
                name: "东兴市"
            }],
            type: 0
        }, {
            name: "钦州市",
            sub: [{
                name: "钦南区"
            }, {
                name: "钦北区"
            }, {
                name: "灵山县"
            }, {
                name: "浦北县"
            }],
            type: 0
        }, {
            name: "贵港市",
            sub: [{
                name: "港北区"
            }, {
                name: "港南区"
            }, {
                name: "覃塘区"
            }, {
                name: "平南县"
            }, {
                name: "桂平市"
            }],
            type: 0
        }, {
            name: "玉林市",
            sub: [{
                name: "玉州区"
            }, {
                name: "福绵区"
            }, {
                name: "容县"
            }, {
                name: "陆川县"
            }, {
                name: "博白县"
            }, {
                name: "兴业县"
            }, {
                name: "北流市"
            }],
            type: 0
        }, {
            name: "百色市",
            sub: [{
                name: "右江区"
            }, {
                name: "田阳县"
            }, {
                name: "田东县"
            }, {
                name: "平果县"
            }, {
                name: "德保县"
            }, {
                name: "靖西县"
            }, {
                name: "那坡县"
            }, {
                name: "凌云县"
            }, {
                name: "乐业县"
            }, {
                name: "田林县"
            }, {
                name: "西林县"
            }, {
                name: "隆林各族自治县"
            }],
            type: 0
        }, {
            name: "贺州市",
            sub: [{
                name: "八步区"
            }, {
                name: "昭平县"
            }, {
                name: "钟山县"
            }, {
                name: "富川瑶族自治县"
            }],
            type: 0
        }, {
            name: "河池市",
            sub: [{
                name: "金城江区"
            }, {
                name: "南丹县"
            }, {
                name: "天峨县"
            }, {
                name: "凤山县"
            }, {
                name: "东兰县"
            }, {
                name: "罗城仫佬族自治县"
            }, {
                name: "环江毛南族自治县"
            }, {
                name: "巴马瑶族自治县"
            }, {
                name: "都安瑶族自治县"
            }, {
                name: "大化瑶族自治县"
            }, {
                name: "宜州市"
            }],
            type: 0
        }, {
            name: "来宾市",
            sub: [{
                name: "兴宾区"
            }, {
                name: "忻城县"
            }, {
                name: "象州县"
            }, {
                name: "武宣县"
            }, {
                name: "金秀瑶族自治县"
            }, {
                name: "合山市"
            }],
            type: 0
        }, {
            name: "崇左市",
            sub: [{
                name: "江州区"
            }, {
                name: "扶绥县"
            }, {
                name: "宁明县"
            }, {
                name: "龙州县"
            }, {
                name: "大新县"
            }, {
                name: "天等县"
            }, {
                name: "凭祥市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "海南省",
        sub: [{
            name: "海口市",
            sub: [{
                name: "秀英区"
            }, {
                name: "龙华区"
            }, {
                name: "琼山区"
            }, {
                name: "美兰区"
            }],
            type: 0
        }, {
            name: "三亚市",
            sub: [{
                name: "市辖区"
            }],
            type: 0
        }, {
            name: "三沙市",
            sub: [{
                name: "西沙群岛"
            }, {
                name: "南沙群岛"
            }, {
                name: "中沙群岛的岛礁及其海域"
            }],
            type: 0
        }, {
            name: "省直辖县级行政区划",
            sub: [{
                name: "五指山市"
            }, {
                name: "琼海市"
            }, {
                name: "儋州市"
            }, {
                name: "文昌市"
            }, {
                name: "万宁市"
            }, {
                name: "东方市"
            }, {
                name: "定安县"
            }, {
                name: "屯昌县"
            }, {
                name: "澄迈县"
            }, {
                name: "临高县"
            }, {
                name: "白沙黎族自治县"
            }, {
                name: "昌江黎族自治县"
            }, {
                name: "乐东黎族自治县"
            }, {
                name: "陵水黎族自治县"
            }, {
                name: "保亭黎族苗族自治县"
            }, {
                name: "琼中黎族苗族自治县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "重庆市",
        sub: [{
            name: "万州区"
        }, {
            name: "涪陵区"
        }, {
            name: "渝中区"
        }, {
            name: "大渡口区"
        }, {
            name: "江北区"
        }, {
            name: "沙坪坝区"
        }, {
            name: "九龙坡区"
        }, {
            name: "南岸区"
        }, {
            name: "北碚区"
        }, {
            name: "綦江区"
        }, {
            name: "大足区"
        }, {
            name: "渝北区"
        }, {
            name: "巴南区"
        }, {
            name: "黔江区"
        }, {
            name: "长寿区"
        }, {
            name: "江津区"
        }, {
            name: "合川区"
        }, {
            name: "永川区"
        }, {
            name: "南川区"
        }, {
            name: "潼南县"
        }, {
            name: "铜梁县"
        }, {
            name: "荣昌县"
        }, {
            name: "璧山县"
        }, {
            name: "梁平县"
        }, {
            name: "城口县"
        }, {
            name: "丰都县"
        }, {
            name: "垫江县"
        }, {
            name: "武隆县"
        }, {
            name: "忠县"
        }, {
            name: "开县"
        }, {
            name: "云阳县"
        }, {
            name: "奉节县"
        }, {
            name: "巫山县"
        }, {
            name: "巫溪县"
        }, {
            name: "石柱土家族自治县"
        }, {
            name: "秀山土家族苗族自治县"
        }, {
            name: "酉阳土家族苗族自治县"
        }, {
            name: "彭水苗族土家族自治县"
        }],
        type: 0
    }, {
        name: "四川省",
        sub: [{
            name: "成都市",
            sub: [{
                name: "锦江区"
            }, {
                name: "青羊区"
            }, {
                name: "金牛区"
            }, {
                name: "武侯区"
            }, {
                name: "成华区"
            }, {
                name: "龙泉驿区"
            }, {
                name: "青白江区"
            }, {
                name: "新都区"
            }, {
                name: "温江区"
            }, {
                name: "金堂县"
            }, {
                name: "双流县"
            }, {
                name: "郫县"
            }, {
                name: "大邑县"
            }, {
                name: "蒲江县"
            }, {
                name: "新津县"
            }, {
                name: "都江堰市"
            }, {
                name: "彭州市"
            }, {
                name: "邛崃市"
            }, {
                name: "崇州市"
            }],
            type: 0
        }, {
            name: "自贡市",
            sub: [{
                name: "自流井区"
            }, {
                name: "贡井区"
            }, {
                name: "大安区"
            }, {
                name: "沿滩区"
            }, {
                name: "荣县"
            }, {
                name: "富顺县"
            }],
            type: 0
        }, {
            name: "攀枝花市",
            sub: [{
                name: "东区"
            }, {
                name: "西区"
            }, {
                name: "仁和区"
            }, {
                name: "米易县"
            }, {
                name: "盐边县"
            }],
            type: 0
        }, {
            name: "泸州市",
            sub: [{
                name: "江阳区"
            }, {
                name: "纳溪区"
            }, {
                name: "龙马潭区"
            }, {
                name: "泸县"
            }, {
                name: "合江县"
            }, {
                name: "叙永县"
            }, {
                name: "古蔺县"
            }],
            type: 0
        }, {
            name: "德阳市",
            sub: [{
                name: "旌阳区"
            }, {
                name: "中江县"
            }, {
                name: "罗江县"
            }, {
                name: "广汉市"
            }, {
                name: "什邡市"
            }, {
                name: "绵竹市"
            }],
            type: 0
        }, {
            name: "绵阳市",
            sub: [{
                name: "涪城区"
            }, {
                name: "游仙区"
            }, {
                name: "三台县"
            }, {
                name: "盐亭县"
            }, {
                name: "安县"
            }, {
                name: "梓潼县"
            }, {
                name: "北川羌族自治县"
            }, {
                name: "平武县"
            }, {
                name: "江油市"
            }],
            type: 0
        }, {
            name: "广元市",
            sub: [{
                name: "利州区"
            }, {
                name: "元坝区"
            }, {
                name: "朝天区"
            }, {
                name: "旺苍县"
            }, {
                name: "青川县"
            }, {
                name: "剑阁县"
            }, {
                name: "苍溪县"
            }],
            type: 0
        }, {
            name: "遂宁市",
            sub: [{
                name: "船山区"
            }, {
                name: "安居区"
            }, {
                name: "蓬溪县"
            }, {
                name: "射洪县"
            }, {
                name: "大英县"
            }],
            type: 0
        }, {
            name: "内江市",
            sub: [{
                name: "市中区"
            }, {
                name: "东兴区"
            }, {
                name: "威远县"
            }, {
                name: "资中县"
            }, {
                name: "隆昌县"
            }],
            type: 0
        }, {
            name: "乐山市",
            sub: [{
                name: "市中区"
            }, {
                name: "沙湾区"
            }, {
                name: "五通桥区"
            }, {
                name: "金口河区"
            }, {
                name: "犍为县"
            }, {
                name: "井研县"
            }, {
                name: "夹江县"
            }, {
                name: "沐川县"
            }, {
                name: "峨边彝族自治县"
            }, {
                name: "马边彝族自治县"
            }, {
                name: "峨眉山市"
            }],
            type: 0
        }, {
            name: "南充市",
            sub: [{
                name: "顺庆区"
            }, {
                name: "高坪区"
            }, {
                name: "嘉陵区"
            }, {
                name: "南部县"
            }, {
                name: "营山县"
            }, {
                name: "蓬安县"
            }, {
                name: "仪陇县"
            }, {
                name: "西充县"
            }, {
                name: "阆中市"
            }],
            type: 0
        }, {
            name: "眉山市",
            sub: [{
                name: "东坡区"
            }, {
                name: "仁寿县"
            }, {
                name: "彭山县"
            }, {
                name: "洪雅县"
            }, {
                name: "丹棱县"
            }, {
                name: "青神县"
            }],
            type: 0
        }, {
            name: "宜宾市",
            sub: [{
                name: "翠屏区"
            }, {
                name: "南溪区"
            }, {
                name: "宜宾县"
            }, {
                name: "江安县"
            }, {
                name: "长宁县"
            }, {
                name: "高县"
            }, {
                name: "珙县"
            }, {
                name: "筠连县"
            }, {
                name: "兴文县"
            }, {
                name: "屏山县"
            }],
            type: 0
        }, {
            name: "广安市",
            sub: [{
                name: "广安区"
            }, {
                name: "前锋区"
            }, {
                name: "岳池县"
            }, {
                name: "武胜县"
            }, {
                name: "邻水县"
            }, {
                name: "华蓥市"
            }],
            type: 0
        }, {
            name: "达州市",
            sub: [{
                name: "通川区"
            }, {
                name: "达川区"
            }, {
                name: "宣汉县"
            }, {
                name: "开江县"
            }, {
                name: "大竹县"
            }, {
                name: "渠县"
            }, {
                name: "万源市"
            }],
            type: 0
        }, {
            name: "雅安市",
            sub: [{
                name: "雨城区"
            }, {
                name: "名山区"
            }, {
                name: "荥经县"
            }, {
                name: "汉源县"
            }, {
                name: "石棉县"
            }, {
                name: "天全县"
            }, {
                name: "芦山县"
            }, {
                name: "宝兴县"
            }],
            type: 0
        }, {
            name: "巴中市",
            sub: [{
                name: "巴州区"
            }, {
                name: "恩阳区"
            }, {
                name: "通江县"
            }, {
                name: "南江县"
            }, {
                name: "平昌县"
            }],
            type: 0
        }, {
            name: "资阳市",
            sub: [{
                name: "雁江区"
            }, {
                name: "安岳县"
            }, {
                name: "乐至县"
            }, {
                name: "简阳市"
            }],
            type: 0
        }, {
            name: "阿坝藏族羌族自治州",
            sub: [{
                name: "汶川县"
            }, {
                name: "理县"
            }, {
                name: "茂县"
            }, {
                name: "松潘县"
            }, {
                name: "九寨沟县"
            }, {
                name: "金川县"
            }, {
                name: "小金县"
            }, {
                name: "黑水县"
            }, {
                name: "马尔康县"
            }, {
                name: "壤塘县"
            }, {
                name: "阿坝县"
            }, {
                name: "若尔盖县"
            }, {
                name: "红原县"
            }],
            type: 0
        }, {
            name: "甘孜藏族自治州",
            sub: [{
                name: "康定县"
            }, {
                name: "泸定县"
            }, {
                name: "丹巴县"
            }, {
                name: "九龙县"
            }, {
                name: "雅江县"
            }, {
                name: "道孚县"
            }, {
                name: "炉霍县"
            }, {
                name: "甘孜县"
            }, {
                name: "新龙县"
            }, {
                name: "德格县"
            }, {
                name: "白玉县"
            }, {
                name: "石渠县"
            }, {
                name: "色达县"
            }, {
                name: "理塘县"
            }, {
                name: "巴塘县"
            }, {
                name: "乡城县"
            }, {
                name: "稻城县"
            }, {
                name: "得荣县"
            }],
            type: 0
        }, {
            name: "凉山彝族自治州",
            sub: [{
                name: "西昌市"
            }, {
                name: "木里藏族自治县"
            }, {
                name: "盐源县"
            }, {
                name: "德昌县"
            }, {
                name: "会理县"
            }, {
                name: "会东县"
            }, {
                name: "宁南县"
            }, {
                name: "普格县"
            }, {
                name: "布拖县"
            }, {
                name: "金阳县"
            }, {
                name: "昭觉县"
            }, {
                name: "喜德县"
            }, {
                name: "冕宁县"
            }, {
                name: "越西县"
            }, {
                name: "甘洛县"
            }, {
                name: "美姑县"
            }, {
                name: "雷波县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "贵州省",
        sub: [{
            name: "贵阳市",
            sub: [{
                name: "南明区"
            }, {
                name: "云岩区"
            }, {
                name: "花溪区"
            }, {
                name: "乌当区"
            }, {
                name: "白云区"
            }, {
                name: "观山湖区"
            }, {
                name: "开阳县"
            }, {
                name: "息烽县"
            }, {
                name: "修文县"
            }, {
                name: "清镇市"
            }],
            type: 0
        }, {
            name: "六盘水市",
            sub: [{
                name: "钟山区"
            }, {
                name: "六枝特区"
            }, {
                name: "水城县"
            }, {
                name: "盘县"
            }],
            type: 0
        }, {
            name: "遵义市",
            sub: [{
                name: "红花岗区"
            }, {
                name: "汇川区"
            }, {
                name: "遵义县"
            }, {
                name: "桐梓县"
            }, {
                name: "绥阳县"
            }, {
                name: "正安县"
            }, {
                name: "道真仡佬族苗族自治县"
            }, {
                name: "务川仡佬族苗族自治县"
            }, {
                name: "凤冈县"
            }, {
                name: "湄潭县"
            }, {
                name: "余庆县"
            }, {
                name: "习水县"
            }, {
                name: "赤水市"
            }, {
                name: "仁怀市"
            }],
            type: 0
        }, {
            name: "安顺市",
            sub: [{
                name: "西秀区"
            }, {
                name: "平坝县"
            }, {
                name: "普定县"
            }, {
                name: "镇宁布依族苗族自治县"
            }, {
                name: "关岭布依族苗族自治县"
            }, {
                name: "紫云苗族布依族自治县"
            }],
            type: 0
        }, {
            name: "毕节市",
            sub: [{
                name: "七星关区"
            }, {
                name: "大方县"
            }, {
                name: "黔西县"
            }, {
                name: "金沙县"
            }, {
                name: "织金县"
            }, {
                name: "纳雍县"
            }, {
                name: "威宁彝族回族苗族自治县"
            }, {
                name: "赫章县"
            }],
            type: 0
        }, {
            name: "铜仁市",
            sub: [{
                name: "碧江区"
            }, {
                name: "万山区"
            }, {
                name: "江口县"
            }, {
                name: "玉屏侗族自治县"
            }, {
                name: "石阡县"
            }, {
                name: "思南县"
            }, {
                name: "印江土家族苗族自治县"
            }, {
                name: "德江县"
            }, {
                name: "沿河土家族自治县"
            }, {
                name: "松桃苗族自治县"
            }],
            type: 0
        }, {
            name: "黔西南布依族苗族自治州",
            sub: [{
                name: "兴义市"
            }, {
                name: "兴仁县"
            }, {
                name: "普安县"
            }, {
                name: "晴隆县"
            }, {
                name: "贞丰县"
            }, {
                name: "望谟县"
            }, {
                name: "册亨县"
            }, {
                name: "安龙县"
            }],
            type: 0
        }, {
            name: "黔东南苗族侗族自治州",
            sub: [{
                name: "凯里市"
            }, {
                name: "黄平县"
            }, {
                name: "施秉县"
            }, {
                name: "三穗县"
            }, {
                name: "镇远县"
            }, {
                name: "岑巩县"
            }, {
                name: "天柱县"
            }, {
                name: "锦屏县"
            }, {
                name: "剑河县"
            }, {
                name: "台江县"
            }, {
                name: "黎平县"
            }, {
                name: "榕江县"
            }, {
                name: "从江县"
            }, {
                name: "雷山县"
            }, {
                name: "麻江县"
            }, {
                name: "丹寨县"
            }],
            type: 0
        }, {
            name: "黔南布依族苗族自治州",
            sub: [{
                name: "都匀市"
            }, {
                name: "福泉市"
            }, {
                name: "荔波县"
            }, {
                name: "贵定县"
            }, {
                name: "瓮安县"
            }, {
                name: "独山县"
            }, {
                name: "平塘县"
            }, {
                name: "罗甸县"
            }, {
                name: "长顺县"
            }, {
                name: "龙里县"
            }, {
                name: "惠水县"
            }, {
                name: "三都水族自治县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "云南省",
        sub: [{
            name: "昆明市",
            sub: [{
                name: "五华区"
            }, {
                name: "盘龙区"
            }, {
                name: "官渡区"
            }, {
                name: "西山区"
            }, {
                name: "东川区"
            }, {
                name: "呈贡区"
            }, {
                name: "晋宁县"
            }, {
                name: "富民县"
            }, {
                name: "宜良县"
            }, {
                name: "石林彝族自治县"
            }, {
                name: "嵩明县"
            }, {
                name: "禄劝彝族苗族自治县"
            }, {
                name: "寻甸回族彝族自治县"
            }, {
                name: "安宁市"
            }],
            type: 0
        }, {
            name: "曲靖市",
            sub: [{
                name: "麒麟区"
            }, {
                name: "马龙县"
            }, {
                name: "陆良县"
            }, {
                name: "师宗县"
            }, {
                name: "罗平县"
            }, {
                name: "富源县"
            }, {
                name: "会泽县"
            }, {
                name: "沾益县"
            }, {
                name: "宣威市"
            }],
            type: 0
        }, {
            name: "玉溪市",
            sub: [{
                name: "红塔区"
            }, {
                name: "江川县"
            }, {
                name: "澄江县"
            }, {
                name: "通海县"
            }, {
                name: "华宁县"
            }, {
                name: "易门县"
            }, {
                name: "峨山彝族自治县"
            }, {
                name: "新平彝族傣族自治县"
            }, {
                name: "元江哈尼族彝族傣族自治县"
            }],
            type: 0
        }, {
            name: "保山市",
            sub: [{
                name: "隆阳区"
            }, {
                name: "施甸县"
            }, {
                name: "腾冲县"
            }, {
                name: "龙陵县"
            }, {
                name: "昌宁县"
            }],
            type: 0
        }, {
            name: "昭通市",
            sub: [{
                name: "昭阳区"
            }, {
                name: "鲁甸县"
            }, {
                name: "巧家县"
            }, {
                name: "盐津县"
            }, {
                name: "大关县"
            }, {
                name: "永善县"
            }, {
                name: "绥江县"
            }, {
                name: "镇雄县"
            }, {
                name: "彝良县"
            }, {
                name: "威信县"
            }, {
                name: "水富县"
            }],
            type: 0
        }, {
            name: "丽江市",
            sub: [{
                name: "古城区"
            }, {
                name: "玉龙纳西族自治县"
            }, {
                name: "永胜县"
            }, {
                name: "华坪县"
            }, {
                name: "宁蒗彝族自治县"
            }],
            type: 0
        }, {
            name: "普洱市",
            sub: [{
                name: "思茅区"
            }, {
                name: "宁洱哈尼族彝族自治县"
            }, {
                name: "墨江哈尼族自治县"
            }, {
                name: "景东彝族自治县"
            }, {
                name: "景谷傣族彝族自治县"
            }, {
                name: "镇沅彝族哈尼族拉祜族自治县"
            }, {
                name: "江城哈尼族彝族自治县"
            }, {
                name: "孟连傣族拉祜族佤族自治县"
            }, {
                name: "澜沧拉祜族自治县"
            }, {
                name: "西盟佤族自治县"
            }],
            type: 0
        }, {
            name: "临沧市",
            sub: [{
                name: "临翔区"
            }, {
                name: "凤庆县"
            }, {
                name: "云县"
            }, {
                name: "永德县"
            }, {
                name: "镇康县"
            }, {
                name: "双江拉祜族佤族布朗族傣族自治县"
            }, {
                name: "耿马傣族佤族自治县"
            }, {
                name: "沧源佤族自治县"
            }],
            type: 0
        }, {
            name: "楚雄彝族自治州",
            sub: [{
                name: "楚雄市"
            }, {
                name: "双柏县"
            }, {
                name: "牟定县"
            }, {
                name: "南华县"
            }, {
                name: "姚安县"
            }, {
                name: "大姚县"
            }, {
                name: "永仁县"
            }, {
                name: "元谋县"
            }, {
                name: "武定县"
            }, {
                name: "禄丰县"
            }],
            type: 0
        }, {
            name: "红河哈尼族彝族自治州",
            sub: [{
                name: "个旧市"
            }, {
                name: "开远市"
            }, {
                name: "蒙自市"
            }, {
                name: "弥勒市"
            }, {
                name: "屏边苗族自治县"
            }, {
                name: "建水县"
            }, {
                name: "石屏县"
            }, {
                name: "泸西县"
            }, {
                name: "元阳县"
            }, {
                name: "红河县"
            }, {
                name: "金平苗族瑶族傣族自治县"
            }, {
                name: "绿春县"
            }, {
                name: "河口瑶族自治县"
            }],
            type: 0
        }, {
            name: "文山壮族苗族自治州",
            sub: [{
                name: "文山市"
            }, {
                name: "砚山县"
            }, {
                name: "西畴县"
            }, {
                name: "麻栗坡县"
            }, {
                name: "马关县"
            }, {
                name: "丘北县"
            }, {
                name: "广南县"
            }, {
                name: "富宁县"
            }],
            type: 0
        }, {
            name: "西双版纳傣族自治州",
            sub: [{
                name: "景洪市"
            }, {
                name: "勐海县"
            }, {
                name: "勐腊县"
            }],
            type: 0
        }, {
            name: "大理白族自治州",
            sub: [{
                name: "大理市"
            }, {
                name: "漾濞彝族自治县"
            }, {
                name: "祥云县"
            }, {
                name: "宾川县"
            }, {
                name: "弥渡县"
            }, {
                name: "南涧彝族自治县"
            }, {
                name: "巍山彝族回族自治县"
            }, {
                name: "永平县"
            }, {
                name: "云龙县"
            }, {
                name: "洱源县"
            }, {
                name: "剑川县"
            }, {
                name: "鹤庆县"
            }],
            type: 0
        }, {
            name: "德宏傣族景颇族自治州",
            sub: [{
                name: "瑞丽市"
            }, {
                name: "芒市"
            }, {
                name: "梁河县"
            }, {
                name: "盈江县"
            }, {
                name: "陇川县"
            }],
            type: 0
        }, {
            name: "怒江傈僳族自治州",
            sub: [{
                name: "泸水县"
            }, {
                name: "福贡县"
            }, {
                name: "贡山独龙族怒族自治县"
            }, {
                name: "兰坪白族普米族自治县"
            }],
            type: 0
        }, {
            name: "迪庆藏族自治州",
            sub: [{
                name: "香格里拉县"
            }, {
                name: "德钦县"
            }, {
                name: "维西傈僳族自治县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "西藏自治区",
        sub: [{
            name: "拉萨市",
            sub: [{
                name: "城关区"
            }, {
                name: "林周县"
            }, {
                name: "当雄县"
            }, {
                name: "尼木县"
            }, {
                name: "曲水县"
            }, {
                name: "堆龙德庆县"
            }, {
                name: "达孜县"
            }, {
                name: "墨竹工卡县"
            }],
            type: 0
        }, {
            name: "昌都地区",
            sub: [{
                name: "昌都县"
            }, {
                name: "江达县"
            }, {
                name: "贡觉县"
            }, {
                name: "类乌齐县"
            }, {
                name: "丁青县"
            }, {
                name: "察雅县"
            }, {
                name: "八宿县"
            }, {
                name: "左贡县"
            }, {
                name: "芒康县"
            }, {
                name: "洛隆县"
            }, {
                name: "边坝县"
            }],
            type: 0
        }, {
            name: "山南地区",
            sub: [{
                name: "乃东县"
            }, {
                name: "扎囊县"
            }, {
                name: "贡嘎县"
            }, {
                name: "桑日县"
            }, {
                name: "琼结县"
            }, {
                name: "曲松县"
            }, {
                name: "措美县"
            }, {
                name: "洛扎县"
            }, {
                name: "加查县"
            }, {
                name: "隆子县"
            }, {
                name: "错那县"
            }, {
                name: "浪卡子县"
            }],
            type: 0
        }, {
            name: "日喀则地区",
            sub: [{
                name: "日喀则市"
            }, {
                name: "南木林县"
            }, {
                name: "江孜县"
            }, {
                name: "定日县"
            }, {
                name: "萨迦县"
            }, {
                name: "拉孜县"
            }, {
                name: "昂仁县"
            }, {
                name: "谢通门县"
            }, {
                name: "白朗县"
            }, {
                name: "仁布县"
            }, {
                name: "康马县"
            }, {
                name: "定结县"
            }, {
                name: "仲巴县"
            }, {
                name: "亚东县"
            }, {
                name: "吉隆县"
            }, {
                name: "聂拉木县"
            }, {
                name: "萨嘎县"
            }, {
                name: "岗巴县"
            }],
            type: 0
        }, {
            name: "那曲地区",
            sub: [{
                name: "那曲县"
            }, {
                name: "嘉黎县"
            }, {
                name: "比如县"
            }, {
                name: "聂荣县"
            }, {
                name: "安多县"
            }, {
                name: "申扎县"
            }, {
                name: "索县"
            }, {
                name: "班戈县"
            }, {
                name: "巴青县"
            }, {
                name: "尼玛县"
            }, {
                name: "双湖县"
            }],
            type: 0
        }, {
            name: "阿里地区",
            sub: [{
                name: "普兰县"
            }, {
                name: "札达县"
            }, {
                name: "噶尔县"
            }, {
                name: "日土县"
            }, {
                name: "革吉县"
            }, {
                name: "改则县"
            }, {
                name: "措勤县"
            }],
            type: 0
        }, {
            name: "林芝地区",
            sub: [{
                name: "林芝县"
            }, {
                name: "工布江达县"
            }, {
                name: "米林县"
            }, {
                name: "墨脱县"
            }, {
                name: "波密县"
            }, {
                name: "察隅县"
            }, {
                name: "朗县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "陕西省",
        sub: [{
            name: "西安市",
            sub: [{
                name: "新城区"
            }, {
                name: "碑林区"
            }, {
                name: "莲湖区"
            }, {
                name: "灞桥区"
            }, {
                name: "未央区"
            }, {
                name: "雁塔区"
            }, {
                name: "阎良区"
            }, {
                name: "临潼区"
            }, {
                name: "长安区"
            }, {
                name: "蓝田县"
            }, {
                name: "周至县"
            }, {
                name: "户县"
            }, {
                name: "高陵县"
            }],
            type: 0
        }, {
            name: "铜川市",
            sub: [{
                name: "王益区"
            }, {
                name: "印台区"
            }, {
                name: "耀州区"
            }, {
                name: "宜君县"
            }],
            type: 0
        }, {
            name: "宝鸡市",
            sub: [{
                name: "渭滨区"
            }, {
                name: "金台区"
            }, {
                name: "陈仓区"
            }, {
                name: "凤翔县"
            }, {
                name: "岐山县"
            }, {
                name: "扶风县"
            }, {
                name: "眉县"
            }, {
                name: "陇县"
            }, {
                name: "千阳县"
            }, {
                name: "麟游县"
            }, {
                name: "凤县"
            }, {
                name: "太白县"
            }],
            type: 0
        }, {
            name: "咸阳市",
            sub: [{
                name: "秦都区"
            }, {
                name: "杨陵区"
            }, {
                name: "渭城区"
            }, {
                name: "三原县"
            }, {
                name: "泾阳县"
            }, {
                name: "乾县"
            }, {
                name: "礼泉县"
            }, {
                name: "永寿县"
            }, {
                name: "彬县"
            }, {
                name: "长武县"
            }, {
                name: "旬邑县"
            }, {
                name: "淳化县"
            }, {
                name: "武功县"
            }, {
                name: "兴平市"
            }],
            type: 0
        }, {
            name: "渭南市",
            sub: [{
                name: "临渭区"
            }, {
                name: "华县"
            }, {
                name: "潼关县"
            }, {
                name: "大荔县"
            }, {
                name: "合阳县"
            }, {
                name: "澄城县"
            }, {
                name: "蒲城县"
            }, {
                name: "白水县"
            }, {
                name: "富平县"
            }, {
                name: "韩城市"
            }, {
                name: "华阴市"
            }],
            type: 0
        }, {
            name: "延安市",
            sub: [{
                name: "宝塔区"
            }, {
                name: "延长县"
            }, {
                name: "延川县"
            }, {
                name: "子长县"
            }, {
                name: "安塞县"
            }, {
                name: "志丹县"
            }, {
                name: "吴起县"
            }, {
                name: "甘泉县"
            }, {
                name: "富县"
            }, {
                name: "洛川县"
            }, {
                name: "宜川县"
            }, {
                name: "黄龙县"
            }, {
                name: "黄陵县"
            }],
            type: 0
        }, {
            name: "汉中市",
            sub: [{
                name: "汉台区"
            }, {
                name: "南郑县"
            }, {
                name: "城固县"
            }, {
                name: "洋县"
            }, {
                name: "西乡县"
            }, {
                name: "勉县"
            }, {
                name: "宁强县"
            }, {
                name: "略阳县"
            }, {
                name: "镇巴县"
            }, {
                name: "留坝县"
            }, {
                name: "佛坪县"
            }],
            type: 0
        }, {
            name: "榆林市",
            sub: [{
                name: "榆阳区"
            }, {
                name: "神木县"
            }, {
                name: "府谷县"
            }, {
                name: "横山县"
            }, {
                name: "靖边县"
            }, {
                name: "定边县"
            }, {
                name: "绥德县"
            }, {
                name: "米脂县"
            }, {
                name: "佳县"
            }, {
                name: "吴堡县"
            }, {
                name: "清涧县"
            }, {
                name: "子洲县"
            }],
            type: 0
        }, {
            name: "安康市",
            sub: [{
                name: "汉滨区"
            }, {
                name: "汉阴县"
            }, {
                name: "石泉县"
            }, {
                name: "宁陕县"
            }, {
                name: "紫阳县"
            }, {
                name: "岚皋县"
            }, {
                name: "平利县"
            }, {
                name: "镇坪县"
            }, {
                name: "旬阳县"
            }, {
                name: "白河县"
            }],
            type: 0
        }, {
            name: "商洛市",
            sub: [{
                name: "商州区"
            }, {
                name: "洛南县"
            }, {
                name: "丹凤县"
            }, {
                name: "商南县"
            }, {
                name: "山阳县"
            }, {
                name: "镇安县"
            }, {
                name: "柞水县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "甘肃省",
        sub: [{
            name: "兰州市",
            sub: [{
                name: "城关区"
            }, {
                name: "七里河区"
            }, {
                name: "西固区"
            }, {
                name: "安宁区"
            }, {
                name: "红古区"
            }, {
                name: "永登县"
            }, {
                name: "皋兰县"
            }, {
                name: "榆中县"
            }],
            type: 0
        }, {
            name: "嘉峪关市",
            sub: [{
                name: "市辖区"
            }],
            type: 0
        }, {
            name: "金昌市",
            sub: [{
                name: "金川区"
            }, {
                name: "永昌县"
            }],
            type: 0
        }, {
            name: "白银市",
            sub: [{
                name: "白银区"
            }, {
                name: "平川区"
            }, {
                name: "靖远县"
            }, {
                name: "会宁县"
            }, {
                name: "景泰县"
            }],
            type: 0
        }, {
            name: "天水市",
            sub: [{
                name: "秦州区"
            }, {
                name: "麦积区"
            }, {
                name: "清水县"
            }, {
                name: "秦安县"
            }, {
                name: "甘谷县"
            }, {
                name: "武山县"
            }, {
                name: "张家川回族自治县"
            }],
            type: 0
        }, {
            name: "武威市",
            sub: [{
                name: "凉州区"
            }, {
                name: "民勤县"
            }, {
                name: "古浪县"
            }, {
                name: "天祝藏族自治县"
            }],
            type: 0
        }, {
            name: "张掖市",
            sub: [{
                name: "甘州区"
            }, {
                name: "肃南裕固族自治县"
            }, {
                name: "民乐县"
            }, {
                name: "临泽县"
            }, {
                name: "高台县"
            }, {
                name: "山丹县"
            }],
            type: 0
        }, {
            name: "平凉市",
            sub: [{
                name: "崆峒区"
            }, {
                name: "泾川县"
            }, {
                name: "灵台县"
            }, {
                name: "崇信县"
            }, {
                name: "华亭县"
            }, {
                name: "庄浪县"
            }, {
                name: "静宁县"
            }],
            type: 0
        }, {
            name: "酒泉市",
            sub: [{
                name: "肃州区"
            }, {
                name: "金塔县"
            }, {
                name: "瓜州县"
            }, {
                name: "肃北蒙古族自治县"
            }, {
                name: "阿克塞哈萨克族自治县"
            }, {
                name: "玉门市"
            }, {
                name: "敦煌市"
            }],
            type: 0
        }, {
            name: "庆阳市",
            sub: [{
                name: "西峰区"
            }, {
                name: "庆城县"
            }, {
                name: "环县"
            }, {
                name: "华池县"
            }, {
                name: "合水县"
            }, {
                name: "正宁县"
            }, {
                name: "宁县"
            }, {
                name: "镇原县"
            }],
            type: 0
        }, {
            name: "定西市",
            sub: [{
                name: "安定区"
            }, {
                name: "通渭县"
            }, {
                name: "陇西县"
            }, {
                name: "渭源县"
            }, {
                name: "临洮县"
            }, {
                name: "漳县"
            }, {
                name: "岷县"
            }],
            type: 0
        }, {
            name: "陇南市",
            sub: [{
                name: "武都区"
            }, {
                name: "成县"
            }, {
                name: "文县"
            }, {
                name: "宕昌县"
            }, {
                name: "康县"
            }, {
                name: "西和县"
            }, {
                name: "礼县"
            }, {
                name: "徽县"
            }, {
                name: "两当县"
            }],
            type: 0
        }, {
            name: "临夏回族自治州",
            sub: [{
                name: "临夏市"
            }, {
                name: "临夏县"
            }, {
                name: "康乐县"
            }, {
                name: "永靖县"
            }, {
                name: "广河县"
            }, {
                name: "和政县"
            }, {
                name: "东乡族自治县"
            }, {
                name: "积石山保安族东乡族撒拉族自治县"
            }],
            type: 0
        }, {
            name: "甘南藏族自治州",
            sub: [{
                name: "合作市"
            }, {
                name: "临潭县"
            }, {
                name: "卓尼县"
            }, {
                name: "舟曲县"
            }, {
                name: "迭部县"
            }, {
                name: "玛曲县"
            }, {
                name: "碌曲县"
            }, {
                name: "夏河县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "青海省",
        sub: [{
            name: "西宁市",
            sub: [{
                name: "城东区"
            }, {
                name: "城中区"
            }, {
                name: "城西区"
            }, {
                name: "城北区"
            }, {
                name: "大通回族土族自治县"
            }, {
                name: "湟中县"
            }, {
                name: "湟源县"
            }],
            type: 0
        }, {
            name: "海东市",
            sub: [{
                name: "乐都区"
            }, {
                name: "平安县"
            }, {
                name: "民和回族土族自治县"
            }, {
                name: "互助土族自治县"
            }, {
                name: "化隆回族自治县"
            }, {
                name: "循化撒拉族自治县"
            }],
            type: 0
        }, {
            name: "海北藏族自治州",
            sub: [{
                name: "门源回族自治县"
            }, {
                name: "祁连县"
            }, {
                name: "海晏县"
            }, {
                name: "刚察县"
            }],
            type: 0
        }, {
            name: "黄南藏族自治州",
            sub: [{
                name: "同仁县"
            }, {
                name: "尖扎县"
            }, {
                name: "泽库县"
            }, {
                name: "河南蒙古族自治县"
            }],
            type: 0
        }, {
            name: "海南藏族自治州",
            sub: [{
                name: "共和县"
            }, {
                name: "同德县"
            }, {
                name: "贵德县"
            }, {
                name: "兴海县"
            }, {
                name: "贵南县"
            }],
            type: 0
        }, {
            name: "果洛藏族自治州",
            sub: [{
                name: "玛沁县"
            }, {
                name: "班玛县"
            }, {
                name: "甘德县"
            }, {
                name: "达日县"
            }, {
                name: "久治县"
            }, {
                name: "玛多县"
            }],
            type: 0
        }, {
            name: "玉树藏族自治州",
            sub: [{
                name: "玉树市"
            }, {
                name: "杂多县"
            }, {
                name: "称多县"
            }, {
                name: "治多县"
            }, {
                name: "囊谦县"
            }, {
                name: "曲麻莱县"
            }],
            type: 0
        }, {
            name: "海西蒙古族藏族自治州",
            sub: [{
                name: "格尔木市"
            }, {
                name: "德令哈市"
            }, {
                name: "乌兰县"
            }, {
                name: "都兰县"
            }, {
                name: "天峻县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "宁夏回族自治区",
        sub: [{
            name: "银川市",
            sub: [{
                name: "兴庆区"
            }, {
                name: "西夏区"
            }, {
                name: "金凤区"
            }, {
                name: "永宁县"
            }, {
                name: "贺兰县"
            }, {
                name: "灵武市"
            }],
            type: 0
        }, {
            name: "石嘴山市",
            sub: [{
                name: "大武口区"
            }, {
                name: "惠农区"
            }, {
                name: "平罗县"
            }],
            type: 0
        }, {
            name: "吴忠市",
            sub: [{
                name: "利通区"
            }, {
                name: "红寺堡区"
            }, {
                name: "盐池县"
            }, {
                name: "同心县"
            }, {
                name: "青铜峡市"
            }],
            type: 0
        }, {
            name: "固原市",
            sub: [{
                name: "原州区"
            }, {
                name: "西吉县"
            }, {
                name: "隆德县"
            }, {
                name: "泾源县"
            }, {
                name: "彭阳县"
            }],
            type: 0
        }, {
            name: "中卫市",
            sub: [{
                name: "沙坡头区"
            }, {
                name: "中宁县"
            }, {
                name: "海原县"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "新疆维吾尔自治区",
        sub: [{
            name: "乌鲁木齐市",
            sub: [{
                name: "天山区"
            }, {
                name: "沙依巴克区"
            }, {
                name: "新市区"
            }, {
                name: "水磨沟区"
            }, {
                name: "头屯河区"
            }, {
                name: "达坂城区"
            }, {
                name: "米东区"
            }, {
                name: "乌鲁木齐县"
            }],
            type: 0
        }, {
            name: "克拉玛依市",
            sub: [{
                name: "独山子区"
            }, {
                name: "克拉玛依区"
            }, {
                name: "白碱滩区"
            }, {
                name: "乌尔禾区"
            }],
            type: 0
        }, {
            name: "吐鲁番地区",
            sub: [{
                name: "吐鲁番市"
            }, {
                name: "鄯善县"
            }, {
                name: "托克逊县"
            }],
            type: 0
        }, {
            name: "哈密地区",
            sub: [{
                name: "哈密市"
            }, {
                name: "巴里坤哈萨克自治县"
            }, {
                name: "伊吾县"
            }],
            type: 0
        }, {
            name: "昌吉回族自治州",
            sub: [{
                name: "昌吉市"
            }, {
                name: "阜康市"
            }, {
                name: "呼图壁县"
            }, {
                name: "玛纳斯县"
            }, {
                name: "奇台县"
            }, {
                name: "吉木萨尔县"
            }, {
                name: "木垒哈萨克自治县"
            }],
            type: 0
        }, {
            name: "博尔塔拉蒙古自治州",
            sub: [{
                name: "博乐市"
            }, {
                name: "阿拉山口市"
            }, {
                name: "精河县"
            }, {
                name: "温泉县"
            }],
            type: 0
        }, {
            name: "巴音郭楞蒙古自治州",
            sub: [{
                name: "库尔勒市"
            }, {
                name: "轮台县"
            }, {
                name: "尉犁县"
            }, {
                name: "若羌县"
            }, {
                name: "且末县"
            }, {
                name: "焉耆回族自治县"
            }, {
                name: "和静县"
            }, {
                name: "和硕县"
            }, {
                name: "博湖县"
            }],
            type: 0
        }, {
            name: "阿克苏地区",
            sub: [{
                name: "阿克苏市"
            }, {
                name: "温宿县"
            }, {
                name: "库车县"
            }, {
                name: "沙雅县"
            }, {
                name: "新和县"
            }, {
                name: "拜城县"
            }, {
                name: "乌什县"
            }, {
                name: "阿瓦提县"
            }, {
                name: "柯坪县"
            }],
            type: 0
        }, {
            name: "克孜勒苏柯尔克孜自治州",
            sub: [{
                name: "阿图什市"
            }, {
                name: "阿克陶县"
            }, {
                name: "阿合奇县"
            }, {
                name: "乌恰县"
            }],
            type: 0
        }, {
            name: "喀什地区",
            sub: [{
                name: "喀什市"
            }, {
                name: "疏附县"
            }, {
                name: "疏勒县"
            }, {
                name: "英吉沙县"
            }, {
                name: "泽普县"
            }, {
                name: "莎车县"
            }, {
                name: "叶城县"
            }, {
                name: "麦盖提县"
            }, {
                name: "岳普湖县"
            }, {
                name: "伽师县"
            }, {
                name: "巴楚县"
            }, {
                name: "塔什库尔干塔吉克自治县"
            }],
            type: 0
        }, {
            name: "和田地区",
            sub: [{
                name: "和田市"
            }, {
                name: "和田县"
            }, {
                name: "墨玉县"
            }, {
                name: "皮山县"
            }, {
                name: "洛浦县"
            }, {
                name: "策勒县"
            }, {
                name: "于田县"
            }, {
                name: "民丰县"
            }],
            type: 0
        }, {
            name: "伊犁哈萨克自治州",
            sub: [{
                name: "伊宁市"
            }, {
                name: "奎屯市"
            }, {
                name: "伊宁县"
            }, {
                name: "察布查尔锡伯自治县"
            }, {
                name: "霍城县"
            }, {
                name: "巩留县"
            }, {
                name: "新源县"
            }, {
                name: "昭苏县"
            }, {
                name: "特克斯县"
            }, {
                name: "尼勒克县"
            }],
            type: 0
        }, {
            name: "塔城地区",
            sub: [{
                name: "塔城市"
            }, {
                name: "乌苏市"
            }, {
                name: "额敏县"
            }, {
                name: "沙湾县"
            }, {
                name: "托里县"
            }, {
                name: "裕民县"
            }, {
                name: "和布克赛尔蒙古自治县"
            }],
            type: 0
        }, {
            name: "阿勒泰地区",
            sub: [{
                name: "阿勒泰市"
            }, {
                name: "布尔津县"
            }, {
                name: "富蕴县"
            }, {
                name: "福海县"
            }, {
                name: "哈巴河县"
            }, {
                name: "青河县"
            }, {
                name: "吉木乃县"
            }],
            type: 0
        }, {
            name: "自治区直辖县级行政区划",
            sub: [{
                name: "石河子市"
            }, {
                name: "阿拉尔市"
            }, {
                name: "图木舒克市"
            }, {
                name: "五家渠市"
            }],
            type: 0
        }],
        type: 1
    }, {
        name: "香港",
        sub: [{
            name: "中西区"
        }, {
            name: "湾仔区"
        }, {
            name: "东区"
        }, {
            name: "九龙城区 "
        }, {
            name: "南区"
        }, {
            name: "深水埗区"
        }, {
            name: "油尖旺区"
        }, {
            name: "黄大仙区"
        }, {
            name: "观塘区"
        }, {
            name: "大埔区"
        }, {
            name: "沙田区"
        }, {
            name: "西贡区"
        }, {
            name: "元朗区"
        }, {
            name: "屯门区"
        }, {
            name: "荃湾区"
        }, {
            name: "葵青区"
        }, {
            name: "离岛区"
        }, {
            name: "其他"
        }],
        type: 0
    }, {
        name: "澳门",
        sub: [{
            name: "花地玛堂区"
        }, {
            name: "圣安多尼堂区"
        }, {
            name: "大堂区"
        }, {
            name: "望德堂区"
        }, {
            name: "风顺堂区"
        }, {
            name: "嘉模堂区"
        }, {
            name: "圣方济各堂区"
        }, {
            name: "路凼"
        }, {
            name: "其他"
        }],
        type: 0
    }, {
        name: "台湾",
        sub: [{
            name: "台北市"
        }, {
            name: "高雄市"
        }, {
            name: "台北县"
        }, {
            name: "桃园县"
        }, {
            name: "新竹县"
        }, {
            name: "苗栗县"
        }, {
            name: "台中县"
        }, {
            name: "彰化县"
        }, {
            name: "南投县"
        }, {
            name: "云林县"
        }, {
            name: "嘉义县"
        }, {
            name: "台南县"
        }, {
            name: "高雄县"
        }, {
            name: "屏东县"
        }, {
            name: "宜兰县"
        }, {
            name: "花莲县"
        }, {
            name: "台东县"
        }, {
            name: "澎湖县"
        }, {
            name: "基隆市"
        }, {
            name: "新竹市"
        }, {
            name: "台中市"
        }, {
            name: "嘉义市"
        }, {
            name: "台南市"
        }, {
            name: "其他"
        }],
        type: 0
    }, {
        name: "海外",
        sub: [{
            name: "其他"
        }],
        type: 0
    }]
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
define("/WEB-UED/fancy/dist/c/sui/city-picker-debug", [], function(require, exports, module) {
    + function($) {
        "use strict";
        var format = function(data) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                if (d.name === "请选择") continue;
                result.push(d.name)
            }
            if (result.length) return result;
            return [""]
        };
        var sub = function(data) {
            if (!data.sub) return [""];
            return format(data.sub)
        };
        var getCities = function(d) {
            for (var i = 0; i < raw.length; i++) {
                if (raw[i].name === d) return sub(raw[i])
            }
            return [""]
        };
        var getDistricts = function(p, c) {
            for (var i = 0; i < raw.length; i++) {
                if (raw[i].name === p) {
                    for (var j = 0; j < raw[i].sub.length; j++) {
                        if (raw[i].sub[j].name === c) {
                            return sub(raw[i].sub[j])
                        }
                    }
                }
            }
            return [""]
        };
        var raw = $.smConfig.rawCitiesData;
        var provinces = raw.map(function(d) {
            return d.name
        });
        var initCities = sub(raw[0]);
        var initDistricts = [""];
        var currentProvince = provinces[0];
        var currentCity = initCities[0];
        var currentDistrict = initDistricts[0];
        var defaults = {
            cssClass: "city-picker",
            rotateEffect: false,
            onChange: function(picker, values, displayValues) {
                var newProvince = picker.cols[0].value;
                var newCity;
                if (newProvince !== currentProvince) {
                    var newCities = getCities(newProvince);
                    newCity = newCities[0];
                    var newDistricts = getDistricts(newProvince, newCity);
                    picker.cols[1].replaceValues(newCities);
                    picker.cols[2].replaceValues(newDistricts);
                    currentProvince = newProvince;
                    currentCity = newCity;
                    picker.updateValue();
                    return
                }
                newCity = picker.cols[1].value;
                if (newCity !== currentCity) {
                    picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
                    currentCity = newCity;
                    picker.updateValue()
                }
            },
            cols: [{
                values: provinces,
                cssClass: "col-province"
            }, {
                values: initCities,
                cssClass: "col-city"
            }, {
                values: initDistricts,
                cssClass: "col-district"
            }]
        };
        $.fn.cityPicker = function(params) {
            return this.each(function() {
                if (!this) return;
                var p = $.extend(defaults, params);
                var val = $(this).val();
                if (val) {
                    p.value = val.split(" ");
                    if (p.value[0]) {
                        p.cols[1].values = getCities(p.value[0])
                    }
                    if (p.value[1]) {
                        p.cols[2].values = getDistricts(p.value[0], p.value[1])
                    } else {
                        p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0])
                    }
                }
                $(this).picker(p)
            })
        }
    }(Zepto)
});
define("/WEB-UED/fancy/dist/p/orderConfirm/address-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            helperMissing = helpers.helperMissing,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\n          <li data-id="';
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
            buffer += escapeExpression(stack1) + '" class="';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.isDefault, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.isDefault, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '">\n            <a external href="javascript:" class="item-link item-content">\n              <div class="item-inner">\n                <div class="item-title-row">\n                  <div class="item-title">';
            if (helper = helpers.consigneeName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.consigneeName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\n                  <div class="item-after">';
            if (helper = helpers.consigneeMobile) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.consigneeMobile;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\n                </div>\n                <div class="item-text">';
            if (helper = helpers.fullAddress) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.fullAddress;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</div>\n              </div>\n            </a>\n          </li>\n      ";
            return buffer
        }

        function program2(depth0, data) {
            return " active "
        }
        buffer += '<div class="list-block media-list">\n    <ul>\n    	';
        stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\n    </ul>\n</div>";
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/orderConfirm/edit-address-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            helperMissing = helpers.helperMissing,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\n      <li data-id="';
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
            buffer += escapeExpression(stack1) + '" class="';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.isDefault, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.isDefault, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '">\n        <a href="#edit-address" class="item-link item-content">\n          <div class="item-inner">\n            <div class="item-title-row">\n              <div class="item-title">';
            if (helper = helpers.consigneeName) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.consigneeName;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\n              <div class="item-after">';
            if (helper = helpers.consigneeMobile) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.consigneeMobile;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\n            </div>\n            <div class="item-text">';
            if (helper = helpers.fullAddress) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.fullAddress;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</div>\n          </div>\n        </a>\n      </li>\n      ";
            return buffer
        }

        function program2(depth0, data) {
            return " active "
        }
        buffer += '<div class="list-block media-list">\n    <ul>\n  ';
        stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\n    </ul>\n  </div>";
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/orderConfirm/add-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        return '<!-- Text inputs -->\r\n<ul>\r\n    <li>\r\n        <div class="item-content">\r\n            <div class="item-inner">\r\n                <div class="item-title label">姓名</div>\r\n                <div class="item-input">\r\n                    <input type="text" id="J-name" placeholder="收货人姓名">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li>\r\n        <div class="item-content">\r\n            <div class="item-inner">\r\n                <div class="item-title label">手机</div>\r\n                <div class="item-input">\r\n                    <input type="number" id="J-phone" placeholder="手机号码">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li>\r\n        <div class="item-content">\r\n            <div class="item-inner">\r\n                <div class="item-title label">邮编</div>\r\n                <div class="item-input">\r\n                    <input type="number" id="J-code" placeholder="邮编">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <!-- Select -->\r\n    <li>\r\n        <div class="item-content">\r\n            <div class="item-inner">\r\n                <div class="item-title label">省市区</div>\r\n                <div class="item-input">\r\n                    <input type="text" id=\'J-city\' value="" />\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n    <li class="align-top">\r\n        <div class="item-content">\r\n            <div class="item-inner">\r\n                <div class="item-title label">详细地址</div>\r\n                <div class="item-input">\r\n                    <textarea id="J-detail-address"></textarea>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </li>\r\n</ul>'
    })
});
define("/WEB-UED/fancy/dist/p/orderConfirm/cart-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="mb10 bg-white pd10 relative order-address">\r\n    <a class="block color-gray" href="#address-list">\r\n        <ul>\r\n            <li>收货人：';
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
            buffer += escapeExpression(stack1) + '</li>\r\n        </ul>\r\n        <i class="iconfont fz20 address color-gray absolute">&#xe617;</i>\r\n        <i class="iconfont absolute fz14 color-gray map">&#xe614;</i>\r\n    </a>\r\n    </div>\r\n';
            return buffer
        }

        function program3(depth0, data) {
            return '\r\n    <div id="J-the-address">\r\n        <div class="mb10 bg-white pd40 ac" id="J-add-address">\r\n            <a href="#address-add"><i class="iconfont fz60 color-orange">&#xe65b;</i></a>\r\n        </div>\r\n    </div>\r\n'
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    	<li class="goods-list-item" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n        <a class="goods-list-link external" href="javascript:">\r\n            <div class="goods-list-img">\r\n                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <div class="goods-list-title">\r\n                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                </div>\r\n                <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                    <span class="fr">x';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                </div>\r\n            </div>\r\n        </a>\r\n        </li>\r\n    ";
            return buffer
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.receiveAddress, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\r\n<ul class="goods-list bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.orderDetailVOList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n</ul>";
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/orderConfirm/activity-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, helper, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="mb10 bg-white pd10 relative order-address">\r\n    <a class="block color-gray" href="#address-list">\r\n        <ul>\r\n            <li>收货人：';
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
            buffer += escapeExpression(stack1) + '</li>\r\n        </ul>\r\n        <i class="iconfont fz20 address color-gray absolute">&#xe617;</i>\r\n        <i class="iconfont absolute fz14 color-gray map">&#xe614;</i>\r\n    </a>\r\n    </div>\r\n';
            return buffer
        }

        function program3(depth0, data) {
            return '\r\n    <div id="J-the-address">\r\n        <div class="mb10 bg-white pd40 ac" id="J-add-address">\r\n            <a href="#address-add"><i class="iconfont fz60 color-orange">&#xe65b;</i></a>\r\n        </div>\r\n    </div>\r\n'
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    	<li class="goods-list-item">\r\n            <div class="goods-list-img">\r\n                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <div class="goods-list-title">\r\n                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                </div>\r\n                <div class="goods-list-price">\r\n                    <span class="color-orange fz16">￥';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                </div>\r\n            </div>\r\n        </li>\r\n    ";
            return buffer
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.receiveAddress, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\r\n<div class="pd10 bg-white borderB">';
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
        buffer += escapeExpression(stack1) + '</div>\r\n<ul class="goods-list bg-gray">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.orderDetailVOList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n</ul>\r\n<div class="pd10 bg-white borderT clearfix">\r\n    <div class="J-edit-count fr"></div>\r\n    <p class="lh32">购买数量:</p>\r\n</div>';
        return buffer
    })
});
define("/WEB-UED/fancy/dist/p/orderConfirm/goods-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="mb10 bg-white pd10 relative order-address">\r\n    <a class="block color-gray" href="#address-list">\r\n        <ul>\r\n            <li>收货人：';
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
            buffer += escapeExpression(stack1) + '</li>\r\n        </ul>\r\n        <i class="iconfont fz20 address color-gray absolute">&#xe617;</i>\r\n        <i class="iconfont absolute fz14 color-gray map">&#xe614;</i>\r\n    </a>\r\n    </div>\r\n';
            return buffer
        }

        function program3(depth0, data) {
            return '\r\n    <div id="J-the-address">\r\n        <div class="mb10 bg-white pd40 ac" id="J-add-address">\r\n            <a href="#address-add"><i class="iconfont fz60 color-orange">&#xe65b;</i></a>\r\n        </div>\r\n    </div>\r\n'
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <li class="goods-list-item" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n            <div class="goods-list-img">\r\n                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <div class="goods-list-title">\r\n                    <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                </div>\r\n                <div class="J-specify-show fz12 color-gray"></div>\r\n                <div>\r\n                    <!--<div class="J-edit-count fr">\r\n                       <p class="edit-count color-gray">\r\n                           <i class="iconfont J-cut">&#xe607;</i>\r\n                            <span class="J-number">';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                            <i class="iconfont J-add">&#xe608;</i>\r\n                        </p>\r\n                    </div>-->\r\n                    <div class="color-gray">\r\n                        <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                        <span class="fr">x\r\n                         <span class="J-number">';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                         </span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </li>\r\n    ";
            return buffer
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.receiveAddress, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n\r\n<ul class="goods-list bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.orderDetailVOList, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n</ul>";
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