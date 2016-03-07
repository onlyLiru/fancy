define("/WEB-UED/fancy/dist/p/myOrder/index-debug", ["/WEB-UED/fancy/dist/c/js/globale-debug", "/WEB-UED/fancy/dist/c/js/registerHelper-debug", "handlebars-debug", "/WEB-UED/fancy/dist/c/js/qrcode-debug", "/WEB-UED/fancy/dist/p/myOrder/list-debug.handlebars", "/WEB-UED/fancy/dist/c/js/pingPay-debug", "/WEB-UED/fancy/dist/p/myOrder/express-debug.handlebars"], function(require, exports, module) {
    var G = require("/WEB-UED/fancy/dist/c/js/globale-debug");
    require("/WEB-UED/fancy/dist/c/js/registerHelper-debug");
    var QRCode = require("/WEB-UED/fancy/dist/c/js/qrcode-debug").QRCode;
    var Tlist = require("/WEB-UED/fancy/dist/p/myOrder/list-debug.handlebars");
    var ping = require("/WEB-UED/fancy/dist/c/js/pingPay-debug");
    var Texpress = require("/WEB-UED/fancy/dist/p/myOrder/express-debug.handlebars");
    var main = {
        init: function() {
            var self = main;
            var from = $("#J-from").val();
            self.PREURL = from ? "/" + from : "";
            self._event();
            var state = G._getUrlParam("state") || "";
            self.state = state;
            self._getList(state);
            G._getCartCount()
        },
        _event: function() {
            var self = this;
            $("li[data-state]").unbind("click").bind("click", function() {
                var state = $(this).attr("data-state");
                self.state = state;
                $(this).addClass("active").siblings().removeClass("active");
                self._getList(state)
            });
            $(".J-cancle").unbind("click").bind("click", function() {
                var orderNo = $(this).attr("data-orderNo");
                $.confirm("确定取消吗?", function() {
                    self._cancle(orderNo)
                })
            });
            $(".J-delete").unbind("click").bind("click", function() {
                var orderNo = $(this).attr("data-orderNo");
                $.confirm("确定删除吗?", function() {
                    self._delete(orderNo)
                })
            });
            $(".J-confirm").unbind("click").bind("click", function() {
                var orderNo = $(this).attr("data-orderNo");
                self._confirm(orderNo)
            });
            $(".J-pay").unbind("click").bind("click", function() {
                var orderNo = $(this).attr("data-orderNo");
                var paymenttype = $(this).attr("paymenttype");
                ping.init(orderNo)
            });
            $(".goods-list-item a").on("click", function() {
                var href = $(this).attr("_href");
                var openId = $("#J-openId").val() || "";
                var from = $("#J-from").val();
                if (from == "fsl") {
                    href = "/" + from + href
                }
                location.href = href + "&openId=" + openId
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
            })
        },
        _getList: function(state) {
            var self = this;
            $("li[data-state]").removeClass("active");
            $('li[data-state="' + state + '"]').addClass("active");
            $.ajax({
                type: "get",
                cach: false,
                url: self.PREURL + "/order/listOrderVO.json",
                data: {
                    orderState: state,
                    curPage: 1,
                    pageSize: 10
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href
                    }
                    if (res.info.ok == true) {
                        $("#J-list-box").html(Tlist(res.data.OrderVOList));
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
        _cancle: function(orderNo) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/order/cancelOrder.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getList(self.state)
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
        _pay: function(orderNo) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/payment/immediateAlipay.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        $("body").html(res.data.alipayInput)
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
        _delete: function(orderNo) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/order/deleteOrder.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getList(self.state)
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
        _confirm: function(orderNo) {
            var self = this;
            $.ajax({
                type: "get",
                cach: false,
                url: "/order/confirmReceipt.json",
                data: {
                    orderNo: orderNo
                },
                success: function(res) {
                    if (res == "noLogin") {
                        location.href = "/login.do?target=" + location.href;
                        return
                    }
                    if (res.info.ok == true) {
                        self._getList(self.state)
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
define("/WEB-UED/fancy/dist/c/js/qrcode-debug", [], function(require, exports, module) {
    var QRCode;
    (function() {
        function QR8bitByte(data) {
            this.mode = QRMode.MODE_8BIT_BYTE;
            this.data = data;
            this.parsedData = [];
            for (var i = 0, l = this.data.length; i < l; i++) {
                var byteArray = [];
                var code = this.data.charCodeAt(i);
                if (code > 65536) {
                    byteArray[0] = 240 | (code & 1835008) >>> 18;
                    byteArray[1] = 128 | (code & 258048) >>> 12;
                    byteArray[2] = 128 | (code & 4032) >>> 6;
                    byteArray[3] = 128 | code & 63
                } else if (code > 2048) {
                    byteArray[0] = 224 | (code & 61440) >>> 12;
                    byteArray[1] = 128 | (code & 4032) >>> 6;
                    byteArray[2] = 128 | code & 63
                } else if (code > 128) {
                    byteArray[0] = 192 | (code & 1984) >>> 6;
                    byteArray[1] = 128 | code & 63
                } else {
                    byteArray[0] = code
                }
                this.parsedData.push(byteArray)
            }
            this.parsedData = Array.prototype.concat.apply([], this.parsedData);
            if (this.parsedData.length != this.data.length) {
                this.parsedData.unshift(191);
                this.parsedData.unshift(187);
                this.parsedData.unshift(239)
            }
        }
        QR8bitByte.prototype = {
            getLength: function(buffer) {
                return this.parsedData.length
            },
            write: function(buffer) {
                for (var i = 0, l = this.parsedData.length; i < l; i++) {
                    buffer.put(this.parsedData[i], 8)
                }
            }
        };

        function QRCodeModel(typeNumber, errorCorrectLevel) {
            this.typeNumber = typeNumber;
            this.errorCorrectLevel = errorCorrectLevel;
            this.modules = null;
            this.moduleCount = 0;
            this.dataCache = null;
            this.dataList = []
        }

        function QRPolynomial(num, shift) {
            if (num.length == undefined) throw new Error(num.length + "/" + shift);
            var offset = 0;
            while (offset < num.length && num[offset] == 0) offset++;
            this.num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
        }

        function QRRSBlock(totalCount, dataCount) {
            this.totalCount = totalCount, this.dataCount = dataCount
        }

        function QRBitBuffer() {
            this.buffer = [], this.length = 0
        }
        QRCodeModel.prototype = {
            addData: function(data) {
                var newData = new QR8bitByte(data);
                this.dataList.push(newData), this.dataCache = null
            },
            isDark: function(row, col) {
                if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(row + "," + col);
                return this.modules[row][col]
            },
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                this.makeImpl(!1, this.getBestMaskPattern())
            },
            makeImpl: function(test, maskPattern) {
                this.moduleCount = this.typeNumber * 4 + 17, this.modules = new Array(this.moduleCount);
                for (var row = 0; row < this.moduleCount; row++) {
                    this.modules[row] = new Array(this.moduleCount);
                    for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null
                }
                this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(test, maskPattern), this.typeNumber >= 7 && this.setupTypeNumber(test), this.dataCache == null && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, maskPattern)
            },
            setupPositionProbePattern: function(row, col) {
                for (var r = -1; r <= 7; r++) {
                    if (row + r <= -1 || this.moduleCount <= row + r) continue;
                    for (var c = -1; c <= 7; c++) {
                        if (col + c <= -1 || this.moduleCount <= col + c) continue;
                        0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1
                    }
                }
            },
            getBestMaskPattern: function() {
                var minLostPoint = 0,
                    pattern = 0;
                for (var i = 0; i < 8; i++) {
                    this.makeImpl(!0, i);
                    var lostPoint = QRUtil.getLostPoint(this);
                    if (i == 0 || minLostPoint > lostPoint) minLostPoint = lostPoint, pattern = i
                }
                return pattern
            },
            createMovieClip: function(target_mc, instance_name, depth) {
                var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth),
                    cs = 1;
                this.make();
                for (var row = 0; row < this.modules.length; row++) {
                    var y = row * cs;
                    for (var col = 0; col < this.modules[row].length; col++) {
                        var x = col * cs,
                            dark = this.modules[row][col];
                        dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill())
                    }
                }
                return qr_mc
            },
            setupTimingPattern: function() {
                for (var r = 8; r < this.moduleCount - 8; r++) {
                    if (this.modules[r][6] != null) continue;
                    this.modules[r][6] = r % 2 == 0
                }
                for (var c = 8; c < this.moduleCount - 8; c++) {
                    if (this.modules[6][c] != null) continue;
                    this.modules[6][c] = c % 2 == 0
                }
            },
            setupPositionAdjustPattern: function() {
                var pos = QRUtil.getPatternPosition(this.typeNumber);
                for (var i = 0; i < pos.length; i++)
                    for (var j = 0; j < pos.length; j++) {
                        var row = pos[i],
                            col = pos[j];
                        if (this.modules[row][col] != null) continue;
                        for (var r = -2; r <= 2; r++)
                            for (var c = -2; c <= 2; c++) r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1
                    }
            },
            setupTypeNumber: function(test) {
                var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
                for (var i = 0; i < 18; i++) {
                    var mod = !test && (bits >> i & 1) == 1;
                    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod
                }
                for (var i = 0; i < 18; i++) {
                    var mod = !test && (bits >> i & 1) == 1;
                    this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
                }
            },
            setupTypeInfo: function(test, maskPattern) {
                var data = this.errorCorrectLevel << 3 | maskPattern,
                    bits = QRUtil.getBCHTypeInfo(data);
                for (var i = 0; i < 15; i++) {
                    var mod = !test && (bits >> i & 1) == 1;
                    i < 6 ? this.modules[i][8] = mod : i < 8 ? this.modules[i + 1][8] = mod : this.modules[this.moduleCount - 15 + i][8] = mod
                }
                for (var i = 0; i < 15; i++) {
                    var mod = !test && (bits >> i & 1) == 1;
                    i < 8 ? this.modules[8][this.moduleCount - i - 1] = mod : i < 9 ? this.modules[8][15 - i - 1 + 1] = mod : this.modules[8][15 - i - 1] = mod
                }
                this.modules[this.moduleCount - 8][8] = !test
            },
            mapData: function(data, maskPattern) {
                var inc = -1,
                    row = this.moduleCount - 1,
                    bitIndex = 7,
                    byteIndex = 0;
                for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                    col == 6 && col--;
                    for (;;) {
                        for (var c = 0; c < 2; c++)
                            if (this.modules[row][col - c] == null) {
                                var dark = !1;
                                byteIndex < data.length && (dark = (data[byteIndex] >>> bitIndex & 1) == 1);
                                var mask = QRUtil.getMask(maskPattern, row, col - c);
                                mask && (dark = !dark), this.modules[row][col - c] = dark, bitIndex--, bitIndex == -1 && (byteIndex++, bitIndex = 7)
                            }
                        row += inc;
                        if (row < 0 || this.moduleCount <= row) {
                            row -= inc, inc = -inc;
                            break
                        }
                    }
                }
            }
        }, QRCodeModel.PAD0 = 236, QRCodeModel.PAD1 = 17, QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
            var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel),
                buffer = new QRBitBuffer;
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                buffer.put(data.mode, 4), buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)), data.write(buffer)
            }
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
            if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
            buffer.getLengthInBits() + 4 <= totalDataCount * 8 && buffer.put(0, 4);
            while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(!1);
            for (;;) {
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD0, 8);
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD1, 8)
            }
            return QRCodeModel.createBytes(buffer, rsBlocks)
        }, QRCodeModel.createBytes = function(buffer, rsBlocks) {
            var offset = 0,
                maxDcCount = 0,
                maxEcCount = 0,
                dcdata = new Array(rsBlocks.length),
                ecdata = new Array(rsBlocks.length);
            for (var r = 0; r < rsBlocks.length; r++) {
                var dcCount = rsBlocks[r].dataCount,
                    ecCount = rsBlocks[r].totalCount - dcCount;
                maxDcCount = Math.max(maxDcCount, dcCount), maxEcCount = Math.max(maxEcCount, ecCount), dcdata[r] = new Array(dcCount);
                for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
                offset += dcCount;
                var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount),
                    rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1),
                    modPoly = rawPoly.mod(rsPoly);
                ecdata[r] = new Array(rsPoly.getLength() - 1);
                for (var i = 0; i < ecdata[r].length; i++) {
                    var modIndex = i + modPoly.getLength() - ecdata[r].length;
                    ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
                }
            }
            var totalCodeCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
            var data = new Array(totalCodeCount),
                index = 0;
            for (var i = 0; i < maxDcCount; i++)
                for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
            for (var i = 0; i < maxEcCount; i++)
                for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
            return data
        };
        var QRMode = {
                MODE_NUMBER: 1,
                MODE_ALPHA_NUM: 2,
                MODE_8BIT_BYTE: 4,
                MODE_KANJI: 8
            },
            QRErrorCorrectLevel = {
                L: 1,
                M: 0,
                Q: 3,
                H: 2
            },
            QRMaskPattern = {
                PATTERN000: 0,
                PATTERN001: 1,
                PATTERN010: 2,
                PATTERN011: 3,
                PATTERN100: 4,
                PATTERN101: 5,
                PATTERN110: 6,
                PATTERN111: 7
            },
            QRUtil = {
                PATTERN_POSITION_TABLE: [
                    [],
                    [6, 18],
                    [6, 22],
                    [6, 26],
                    [6, 30],
                    [6, 34],
                    [6, 22, 38],
                    [6, 24, 42],
                    [6, 26, 46],
                    [6, 28, 50],
                    [6, 30, 54],
                    [6, 32, 58],
                    [6, 34, 62],
                    [6, 26, 46, 66],
                    [6, 26, 48, 70],
                    [6, 26, 50, 74],
                    [6, 30, 54, 78],
                    [6, 30, 56, 82],
                    [6, 30, 58, 86],
                    [6, 34, 62, 90],
                    [6, 28, 50, 72, 94],
                    [6, 26, 50, 74, 98],
                    [6, 30, 54, 78, 102],
                    [6, 28, 54, 80, 106],
                    [6, 32, 58, 84, 110],
                    [6, 30, 58, 86, 114],
                    [6, 34, 62, 90, 118],
                    [6, 26, 50, 74, 98, 122],
                    [6, 30, 54, 78, 102, 126],
                    [6, 26, 52, 78, 104, 130],
                    [6, 30, 56, 82, 108, 134],
                    [6, 34, 60, 86, 112, 138],
                    [6, 30, 58, 86, 114, 142],
                    [6, 34, 62, 90, 118, 146],
                    [6, 30, 54, 78, 102, 126, 150],
                    [6, 24, 50, 76, 102, 128, 154],
                    [6, 28, 54, 80, 106, 132, 158],
                    [6, 32, 58, 84, 110, 136, 162],
                    [6, 26, 54, 82, 110, 138, 166],
                    [6, 30, 58, 86, 114, 142, 170]
                ],
                G15: 1335,
                G18: 7973,
                G15_MASK: 21522,
                getBCHTypeInfo: function(data) {
                    var d = data << 10;
                    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
                    return (data << 10 | d) ^ QRUtil.G15_MASK
                },
                getBCHTypeNumber: function(data) {
                    var d = data << 12;
                    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
                    return data << 12 | d
                },
                getBCHDigit: function(data) {
                    var digit = 0;
                    while (data != 0) digit++, data >>>= 1;
                    return digit
                },
                getPatternPosition: function(typeNumber) {
                    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
                },
                getMask: function(maskPattern, i, j) {
                    switch (maskPattern) {
                        case QRMaskPattern.PATTERN000:
                            return (i + j) % 2 == 0;
                        case QRMaskPattern.PATTERN001:
                            return i % 2 == 0;
                        case QRMaskPattern.PATTERN010:
                            return j % 3 == 0;
                        case QRMaskPattern.PATTERN011:
                            return (i + j) % 3 == 0;
                        case QRMaskPattern.PATTERN100:
                            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                        case QRMaskPattern.PATTERN101:
                            return i * j % 2 + i * j % 3 == 0;
                        case QRMaskPattern.PATTERN110:
                            return (i * j % 2 + i * j % 3) % 2 == 0;
                        case QRMaskPattern.PATTERN111:
                            return (i * j % 3 + (i + j) % 2) % 2 == 0;
                        default:
                            throw new Error("bad maskPattern:" + maskPattern)
                    }
                },
                getErrorCorrectPolynomial: function(errorCorrectLength) {
                    var a = new QRPolynomial([1], 0);
                    for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
                    return a
                },
                getLengthInBits: function(mode, type) {
                    if (1 <= type && type < 10) switch (mode) {
                        case QRMode.MODE_NUMBER:
                            return 10;
                        case QRMode.MODE_ALPHA_NUM:
                            return 9;
                        case QRMode.MODE_8BIT_BYTE:
                            return 8;
                        case QRMode.MODE_KANJI:
                            return 8;
                        default:
                            throw new Error("mode:" + mode)
                    } else if (type < 27) switch (mode) {
                        case QRMode.MODE_NUMBER:
                            return 12;
                        case QRMode.MODE_ALPHA_NUM:
                            return 11;
                        case QRMode.MODE_8BIT_BYTE:
                            return 16;
                        case QRMode.MODE_KANJI:
                            return 10;
                        default:
                            throw new Error("mode:" + mode)
                    } else {
                        if (!(type < 41)) throw new Error("type:" + type);
                        switch (mode) {
                            case QRMode.MODE_NUMBER:
                                return 14;
                            case QRMode.MODE_ALPHA_NUM:
                                return 13;
                            case QRMode.MODE_8BIT_BYTE:
                                return 16;
                            case QRMode.MODE_KANJI:
                                return 12;
                            default:
                                throw new Error("mode:" + mode)
                        }
                    }
                },
                getLostPoint: function(qrCode) {
                    var moduleCount = qrCode.getModuleCount(),
                        lostPoint = 0;
                    for (var row = 0; row < moduleCount; row++)
                        for (var col = 0; col < moduleCount; col++) {
                            var sameCount = 0,
                                dark = qrCode.isDark(row, col);
                            for (var r = -1; r <= 1; r++) {
                                if (row + r < 0 || moduleCount <= row + r) continue;
                                for (var c = -1; c <= 1; c++) {
                                    if (col + c < 0 || moduleCount <= col + c) continue;
                                    if (r == 0 && c == 0) continue;
                                    dark == qrCode.isDark(row + r, col + c) && sameCount++
                                }
                            }
                            sameCount > 5 && (lostPoint += 3 + sameCount - 5)
                        }
                    for (var row = 0; row < moduleCount - 1; row++)
                        for (var col = 0; col < moduleCount - 1; col++) {
                            var count = 0;
                            qrCode.isDark(row, col) && count++, qrCode.isDark(row + 1, col) && count++, qrCode.isDark(row, col + 1) && count++, qrCode.isDark(row + 1, col + 1) && count++;
                            if (count == 0 || count == 4) lostPoint += 3
                        }
                    for (var row = 0; row < moduleCount; row++)
                        for (var col = 0; col < moduleCount - 6; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
                    for (var col = 0; col < moduleCount; col++)
                        for (var row = 0; row < moduleCount - 6; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
                    var darkCount = 0;
                    for (var col = 0; col < moduleCount; col++)
                        for (var row = 0; row < moduleCount; row++) qrCode.isDark(row, col) && darkCount++;
                    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                    return lostPoint += ratio * 10, lostPoint
                }
            },
            QRMath = {
                glog: function(n) {
                    if (n < 1) throw new Error("glog(" + n + ")");
                    return QRMath.LOG_TABLE[n]
                },
                gexp: function(n) {
                    while (n < 0) n += 255;
                    while (n >= 256) n -= 255;
                    return QRMath.EXP_TABLE[n]
                },
                EXP_TABLE: new Array(256),
                LOG_TABLE: new Array(256)
            };
        for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
        for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
        for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
        QRPolynomial.prototype = {
            get: function(index) {
                return this.num[index]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(e) {
                var num = new Array(this.getLength() + e.getLength() - 1);
                for (var i = 0; i < this.getLength(); i++)
                    for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
                return new QRPolynomial(num, 0)
            },
            mod: function(e) {
                if (this.getLength() - e.getLength() < 0) return this;
                var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)),
                    num = new Array(this.getLength());
                for (var i = 0; i < this.getLength(); i++) num[i] = this.get(i);
                for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
                return new QRPolynomial(num, 0).mod(e)
            }
        }, QRRSBlock.RS_BLOCK_TABLE = [
            [1, 26, 19],
            [1, 26, 16],
            [1, 26, 13],
            [1, 26, 9],
            [1, 44, 34],
            [1, 44, 28],
            [1, 44, 22],
            [1, 44, 16],
            [1, 70, 55],
            [1, 70, 44],
            [2, 35, 17],
            [2, 35, 13],
            [1, 100, 80],
            [2, 50, 32],
            [2, 50, 24],
            [4, 25, 9],
            [1, 134, 108],
            [2, 67, 43],
            [2, 33, 15, 2, 34, 16],
            [2, 33, 11, 2, 34, 12],
            [2, 86, 68],
            [4, 43, 27],
            [4, 43, 19],
            [4, 43, 15],
            [2, 98, 78],
            [4, 49, 31],
            [2, 32, 14, 4, 33, 15],
            [4, 39, 13, 1, 40, 14],
            [2, 121, 97],
            [2, 60, 38, 2, 61, 39],
            [4, 40, 18, 2, 41, 19],
            [4, 40, 14, 2, 41, 15],
            [2, 146, 116],
            [3, 58, 36, 2, 59, 37],
            [4, 36, 16, 4, 37, 17],
            [4, 36, 12, 4, 37, 13],
            [2, 86, 68, 2, 87, 69],
            [4, 69, 43, 1, 70, 44],
            [6, 43, 19, 2, 44, 20],
            [6, 43, 15, 2, 44, 16],
            [4, 101, 81],
            [1, 80, 50, 4, 81, 51],
            [4, 50, 22, 4, 51, 23],
            [3, 36, 12, 8, 37, 13],
            [2, 116, 92, 2, 117, 93],
            [6, 58, 36, 2, 59, 37],
            [4, 46, 20, 6, 47, 21],
            [7, 42, 14, 4, 43, 15],
            [4, 133, 107],
            [8, 59, 37, 1, 60, 38],
            [8, 44, 20, 4, 45, 21],
            [12, 33, 11, 4, 34, 12],
            [3, 145, 115, 1, 146, 116],
            [4, 64, 40, 5, 65, 41],
            [11, 36, 16, 5, 37, 17],
            [11, 36, 12, 5, 37, 13],
            [5, 109, 87, 1, 110, 88],
            [5, 65, 41, 5, 66, 42],
            [5, 54, 24, 7, 55, 25],
            [11, 36, 12],
            [5, 122, 98, 1, 123, 99],
            [7, 73, 45, 3, 74, 46],
            [15, 43, 19, 2, 44, 20],
            [3, 45, 15, 13, 46, 16],
            [1, 135, 107, 5, 136, 108],
            [10, 74, 46, 1, 75, 47],
            [1, 50, 22, 15, 51, 23],
            [2, 42, 14, 17, 43, 15],
            [5, 150, 120, 1, 151, 121],
            [9, 69, 43, 4, 70, 44],
            [17, 50, 22, 1, 51, 23],
            [2, 42, 14, 19, 43, 15],
            [3, 141, 113, 4, 142, 114],
            [3, 70, 44, 11, 71, 45],
            [17, 47, 21, 4, 48, 22],
            [9, 39, 13, 16, 40, 14],
            [3, 135, 107, 5, 136, 108],
            [3, 67, 41, 13, 68, 42],
            [15, 54, 24, 5, 55, 25],
            [15, 43, 15, 10, 44, 16],
            [4, 144, 116, 4, 145, 117],
            [17, 68, 42],
            [17, 50, 22, 6, 51, 23],
            [19, 46, 16, 6, 47, 17],
            [2, 139, 111, 7, 140, 112],
            [17, 74, 46],
            [7, 54, 24, 16, 55, 25],
            [34, 37, 13],
            [4, 151, 121, 5, 152, 122],
            [4, 75, 47, 14, 76, 48],
            [11, 54, 24, 14, 55, 25],
            [16, 45, 15, 14, 46, 16],
            [6, 147, 117, 4, 148, 118],
            [6, 73, 45, 14, 74, 46],
            [11, 54, 24, 16, 55, 25],
            [30, 46, 16, 2, 47, 17],
            [8, 132, 106, 4, 133, 107],
            [8, 75, 47, 13, 76, 48],
            [7, 54, 24, 22, 55, 25],
            [22, 45, 15, 13, 46, 16],
            [10, 142, 114, 2, 143, 115],
            [19, 74, 46, 4, 75, 47],
            [28, 50, 22, 6, 51, 23],
            [33, 46, 16, 4, 47, 17],
            [8, 152, 122, 4, 153, 123],
            [22, 73, 45, 3, 74, 46],
            [8, 53, 23, 26, 54, 24],
            [12, 45, 15, 28, 46, 16],
            [3, 147, 117, 10, 148, 118],
            [3, 73, 45, 23, 74, 46],
            [4, 54, 24, 31, 55, 25],
            [11, 45, 15, 31, 46, 16],
            [7, 146, 116, 7, 147, 117],
            [21, 73, 45, 7, 74, 46],
            [1, 53, 23, 37, 54, 24],
            [19, 45, 15, 26, 46, 16],
            [5, 145, 115, 10, 146, 116],
            [19, 75, 47, 10, 76, 48],
            [15, 54, 24, 25, 55, 25],
            [23, 45, 15, 25, 46, 16],
            [13, 145, 115, 3, 146, 116],
            [2, 74, 46, 29, 75, 47],
            [42, 54, 24, 1, 55, 25],
            [23, 45, 15, 28, 46, 16],
            [17, 145, 115],
            [10, 74, 46, 23, 75, 47],
            [10, 54, 24, 35, 55, 25],
            [19, 45, 15, 35, 46, 16],
            [17, 145, 115, 1, 146, 116],
            [14, 74, 46, 21, 75, 47],
            [29, 54, 24, 19, 55, 25],
            [11, 45, 15, 46, 46, 16],
            [13, 145, 115, 6, 146, 116],
            [14, 74, 46, 23, 75, 47],
            [44, 54, 24, 7, 55, 25],
            [59, 46, 16, 1, 47, 17],
            [12, 151, 121, 7, 152, 122],
            [12, 75, 47, 26, 76, 48],
            [39, 54, 24, 14, 55, 25],
            [22, 45, 15, 41, 46, 16],
            [6, 151, 121, 14, 152, 122],
            [6, 75, 47, 34, 76, 48],
            [46, 54, 24, 10, 55, 25],
            [2, 45, 15, 64, 46, 16],
            [17, 152, 122, 4, 153, 123],
            [29, 74, 46, 14, 75, 47],
            [49, 54, 24, 10, 55, 25],
            [24, 45, 15, 46, 46, 16],
            [4, 152, 122, 18, 153, 123],
            [13, 74, 46, 32, 75, 47],
            [48, 54, 24, 14, 55, 25],
            [42, 45, 15, 32, 46, 16],
            [20, 147, 117, 4, 148, 118],
            [40, 75, 47, 7, 76, 48],
            [43, 54, 24, 22, 55, 25],
            [10, 45, 15, 67, 46, 16],
            [19, 148, 118, 6, 149, 119],
            [18, 75, 47, 31, 76, 48],
            [34, 54, 24, 34, 55, 25],
            [20, 45, 15, 61, 46, 16]
        ], QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
            var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
            if (rsBlock == undefined) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
            var length = rsBlock.length / 3,
                list = [];
            for (var i = 0; i < length; i++) {
                var count = rsBlock[i * 3 + 0],
                    totalCount = rsBlock[i * 3 + 1],
                    dataCount = rsBlock[i * 3 + 2];
                for (var j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount))
            }
            return list
        }, QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
            switch (errorCorrectLevel) {
                case QRErrorCorrectLevel.L:
                    return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
                case QRErrorCorrectLevel.M:
                    return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
                case QRErrorCorrectLevel.Q:
                    return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
                case QRErrorCorrectLevel.H:
                    return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
                default:
                    return undefined
            }
        }, QRBitBuffer.prototype = {
            get: function(index) {
                var bufIndex = Math.floor(index / 8);
                return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1
            },
            put: function(num, length) {
                for (var i = 0; i < length; i++) this.putBit((num >>> length - i - 1 & 1) == 1)
            },
            getLengthInBits: function() {
                return this.length
            },
            putBit: function(bit) {
                var bufIndex = Math.floor(this.length / 8);
                this.buffer.length <= bufIndex && this.buffer.push(0), bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8), this.length++
            }
        };
        var QRCodeLimitLength = [
            [17, 14, 11, 7],
            [32, 26, 20, 14],
            [53, 42, 32, 24],
            [78, 62, 46, 34],
            [106, 84, 60, 44],
            [134, 106, 74, 58],
            [154, 122, 86, 64],
            [192, 152, 108, 84],
            [230, 180, 130, 98],
            [271, 213, 151, 119],
            [321, 251, 177, 137],
            [367, 287, 203, 155],
            [425, 331, 241, 177],
            [458, 362, 258, 194],
            [520, 412, 292, 220],
            [586, 450, 322, 250],
            [644, 504, 364, 280],
            [718, 560, 394, 310],
            [792, 624, 442, 338],
            [858, 666, 482, 382],
            [929, 711, 509, 403],
            [1003, 779, 565, 439],
            [1091, 857, 611, 461],
            [1171, 911, 661, 511],
            [1273, 997, 715, 535],
            [1367, 1059, 751, 593],
            [1465, 1125, 805, 625],
            [1528, 1190, 868, 658],
            [1628, 1264, 908, 698],
            [1732, 1370, 982, 742],
            [1840, 1452, 1030, 790],
            [1952, 1538, 1112, 842],
            [2068, 1628, 1168, 898],
            [2188, 1722, 1228, 958],
            [2303, 1809, 1283, 983],
            [2431, 1911, 1351, 1051],
            [2563, 1989, 1423, 1093],
            [2699, 2099, 1499, 1139],
            [2809, 2213, 1579, 1219],
            [2953, 2331, 1663, 1273]
        ];

        function _isSupportCanvas() {
            return typeof CanvasRenderingContext2D != "undefined"
        }

        function _getAndroid() {
            var android = false;
            var sAgent = navigator.userAgent;
            if (/android/i.test(sAgent)) {
                android = true;
                aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);
                if (aMat && aMat[1]) {
                    android = parseFloat(aMat[1])
                }
            }
            return android
        }
        var svgDrawer = function() {
            var Drawing = function(el, htOption) {
                this._el = el;
                this._htOption = htOption
            };
            Drawing.prototype.draw = function(oQRCode) {
                var _htOption = this._htOption;
                var _el = this._el;
                var nCount = oQRCode.getModuleCount();
                var nWidth = Math.floor(_htOption.width / nCount);
                var nHeight = Math.floor(_htOption.height / nCount);
                this.clear();

                function makeSVG(tag, attrs) {
                    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                    for (var k in attrs)
                        if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
                    return el
                }
                var svg = makeSVG("svg", {
                    viewBox: "0 0 " + String(nCount) + " " + String(nCount),
                    width: "100%",
                    height: "100%",
                    fill: _htOption.colorLight
                });
                svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                _el.append(svg);
                svg.append(makeSVG("rect", {
                    fill: _htOption.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
                for (var row = 0; row < nCount; row++) {
                    for (var col = 0; col < nCount; col++) {
                        if (oQRCode.isDark(row, col)) {
                            var child = makeSVG("use", {
                                x: String(row),
                                y: String(col)
                            });
                            child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template");
                            svg.append(child)
                        }
                    }
                }
            };
            Drawing.prototype.clear = function() {
                while (this._el.hasChildNodes()) this._el.removeChild(this._el.lastChild)
            };
            return Drawing
        }();
        var useSVG = document.documentElement.tagName.toLowerCase() === "svg";
        var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? function() {
            var Drawing = function(el, htOption) {
                this._el = el;
                this._htOption = htOption
            };
            Drawing.prototype.draw = function(oQRCode) {
                var _htOption = this._htOption;
                var _el = this._el;
                var nCount = oQRCode.getModuleCount();
                var nWidth = Math.floor(_htOption.width / nCount);
                var nHeight = Math.floor(_htOption.height / nCount);
                var aHTML = ['<table style="border:0;border-collapse:collapse;">'];
                for (var row = 0; row < nCount; row++) {
                    aHTML.push("<tr>");
                    for (var col = 0; col < nCount; col++) {
                        aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + "px;height:" + nHeight + "px;background-color:" + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>')
                    }
                    aHTML.push("</tr>")
                }
                aHTML.push("</table>");
                _el.innerHTML = aHTML.join("");
                var elTable = _el.childNodes[0];
                var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
                var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
                if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
                    elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px"
                }
            };
            Drawing.prototype.clear = function() {
                this._el.innerHTML = ""
            };
            return Drawing
        }() : function() {
            function _onMakeImage() {
                this._elImage.src = this._elCanvas.toDataURL("image/png");
                this._elImage.style.display = "block";
                this._elCanvas.style.display = "none"
            }
            if (this._android && this._android <= 2.1) {
                var factor = 1 / window.devicePixelRatio;
                var drawImage = CanvasRenderingContext2D.prototype.drawImage;
                CanvasRenderingContext2D.prototype.drawImage = function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
                    if ("nodeName" in image && /img/i.test(image.nodeName)) {
                        for (var i = arguments.length - 1; i >= 1; i--) {
                            arguments[i] = arguments[i] * factor
                        }
                    } else if (typeof dw == "undefined") {
                        arguments[1] *= factor;
                        arguments[2] *= factor;
                        arguments[3] *= factor;
                        arguments[4] *= factor
                    }
                    drawImage.apply(this, arguments)
                }
            }

            function _safeSetDataURI(fSuccess, fFail) {
                var self = this;
                self._fFail = fFail;
                self._fSuccess = fSuccess;
                if (self._bSupportDataURI === null) {
                    var el = document.createElement("img");
                    var fOnError = function() {
                        self._bSupportDataURI = false;
                        if (self._fFail) {
                            _fFail.call(self)
                        }
                    };
                    var fOnSuccess = function() {
                        self._bSupportDataURI = true;
                        if (self._fSuccess) {
                            self._fSuccess.call(self)
                        }
                    };
                    el.onabort = fOnError;
                    el.onerror = fOnError;
                    el.onload = fOnSuccess;
                    el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
                    return
                } else if (self._bSupportDataURI === true && self._fSuccess) {
                    self._fSuccess.call(self)
                } else if (self._bSupportDataURI === false && self._fFail) {
                    self._fFail.call(self)
                }
            }
            var Drawing = function(el, htOption) {
                this._bIsPainted = false;
                this._android = _getAndroid();
                this._htOption = htOption;
                this._elCanvas = document.createElement("canvas");
                this._elCanvas.width = htOption.width;
                this._elCanvas.height = htOption.height;
                el.append(this._elCanvas);
                this._el = el;
                this._oContext = this._elCanvas.getContext("2d");
                this._bIsPainted = false;
                this._elImage = document.createElement("img");
                this._elImage.alt = "Scan me!";
                this._elImage.style.display = "none";
                this._el.append(this._elImage);
                this._bSupportDataURI = null
            };
            Drawing.prototype.draw = function(oQRCode) {
                var _elImage = this._elImage;
                var _oContext = this._oContext;
                var _htOption = this._htOption;
                var nCount = oQRCode.getModuleCount();
                var nWidth = _htOption.width / nCount;
                var nHeight = _htOption.height / nCount;
                var nRoundedWidth = Math.round(nWidth);
                var nRoundedHeight = Math.round(nHeight);
                _elImage.style.display = "none";
                this.clear();
                for (var row = 0; row < nCount; row++) {
                    for (var col = 0; col < nCount; col++) {
                        var bIsDark = oQRCode.isDark(row, col);
                        var nLeft = col * nWidth;
                        var nTop = row * nHeight;
                        _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                        _oContext.lineWidth = 1;
                        _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                        _oContext.fillRect(nLeft, nTop, nWidth, nHeight);
                        _oContext.strokeRect(Math.floor(nLeft) + .5, Math.floor(nTop) + .5, nRoundedWidth, nRoundedHeight);
                        _oContext.strokeRect(Math.ceil(nLeft) - .5, Math.ceil(nTop) - .5, nRoundedWidth, nRoundedHeight)
                    }
                }
                this._bIsPainted = true
            };
            Drawing.prototype.makeImage = function() {
                if (this._bIsPainted) {
                    _safeSetDataURI.call(this, _onMakeImage)
                }
            };
            Drawing.prototype.isPainted = function() {
                return this._bIsPainted
            };
            Drawing.prototype.clear = function() {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
                this._bIsPainted = false
            };
            Drawing.prototype.round = function(nNumber) {
                if (!nNumber) {
                    return nNumber
                }
                return Math.floor(nNumber * 1e3) / 1e3
            };
            return Drawing
        }();

        function _getTypeNumber(sText, nCorrectLevel) {
            var nType = 1;
            var length = _getUTF8Length(sText);
            for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
                var nLimit = 0;
                switch (nCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        nLimit = QRCodeLimitLength[i][0];
                        break;
                    case QRErrorCorrectLevel.M:
                        nLimit = QRCodeLimitLength[i][1];
                        break;
                    case QRErrorCorrectLevel.Q:
                        nLimit = QRCodeLimitLength[i][2];
                        break;
                    case QRErrorCorrectLevel.H:
                        nLimit = QRCodeLimitLength[i][3];
                        break
                }
                if (length <= nLimit) {
                    break
                } else {
                    nType++
                }
            }
            if (nType > QRCodeLimitLength.length) {
                throw new Error("Too long data")
            }
            return nType
        }

        function _getUTF8Length(sText) {
            var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
            return replacedText.length + (replacedText.length != sText ? 3 : 0)
        }
        QRCode = function(el, vOption) {
            this._htOption = {
                width: 256,
                height: 256,
                typeNumber: 4,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRErrorCorrectLevel.H
            };
            if (typeof vOption === "string") {
                vOption = {
                    text: vOption
                }
            }
            if (vOption) {
                for (var i in vOption) {
                    this._htOption[i] = vOption[i]
                }
            }
            if (typeof el == "string") {
                el = document.getElementById(el)
            }
            this._android = _getAndroid();
            this._el = el;
            this._oQRCode = null;
            this._oDrawing = new Drawing(this._el, this._htOption);
            if (this._htOption.text) {
                this.makeCode(this._htOption.text)
            }
        };
        QRCode.prototype.makeCode = function(sText) {
            this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
            this._oQRCode.addData(sText);
            this._oQRCode.make();
            this._el.title = sText;
            this._oDrawing.draw(this._oQRCode);
            this.makeImage()
        };
        QRCode.prototype.makeImage = function() {
            if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
                this._oDrawing.makeImage()
            }
        };
        QRCode.prototype.clear = function() {
            this._oDrawing.clear()
        };
        QRCode.CorrectLevel = QRErrorCorrectLevel
    })();
    exports.QRCode = QRCode
});
define("/WEB-UED/fancy/dist/p/myOrder/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1;
            buffer += "\r\n    ";
            stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\r\n        <div class="bg-white mb10">\r\n            ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n            <ul class="goods-list mb10">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
                hash: {},
                inverse: self.noop,
                fn: self.program(7, program7, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n            </ul>\r\n            <div class="color-gray ar pd10 borderB">\r\n                共计';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                (含运费￥";
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
            buffer += escapeExpression(stack1) + ')\r\n            </div>\r\n            <div class="pd10 ar">\r\n                ';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(11, program11, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", -1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", -1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(15, program15, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(17, program17, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(19, program19, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(21, program21, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 5, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 5, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(23, program23, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 5, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 5, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(25, program25, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 7, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 7, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            </div>\r\n        </div>\r\n    ";
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "",
                stack1;
            buffer += '\r\n                <ul class="goods-list  borderB has-express">\r\n                    ';
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                </ul>\r\n            ";
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                        ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(5, program5, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "!=", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "!=", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                    ";
            return buffer
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                            <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <a external _href="/order/orderDetail.html?orderNo=';
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
            buffer += escapeExpression(stack1) + '">\r\n                                <div class="goods-list-img">\r\n                                    <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                                </div>\r\n                                <div class="goods-list-description">\r\n                                    <div class="goods-list-title color-gray">\r\n                                        <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                                    </div>\r\n                                    <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                    <div class="color-gray">\r\n                                        <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                        <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                    </div>\r\n                                </div>\r\n                            </a>\r\n                            </li>\r\n                            <li class="goods-list-item bg-white hide ar J-view-li">\r\n                                <a class="f-btn f-btn-orange J-view" data-expressNo="';
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
            buffer += escapeExpression(stack1) + '">查看物流</a>\r\n                            </li>\r\n                        ';
            return buffer
        }

        function program7(depth0, data) {
            var buffer = "",
                stack1;
            buffer += "\r\n                    ";
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                        ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(9, program9, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "==", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "==", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                    ";
            return buffer
        }

        function program9(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                            <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <a external _href="/order/orderDetail.html?orderNo=';
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
            buffer += escapeExpression(stack1) + '">\r\n                                <div class="goods-list-img">\r\n                                    <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                                </div>\r\n                                <div class="goods-list-description">\r\n                                    <div class="goods-list-title color-gray">\r\n                                        <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                                    </div>\r\n                                    <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                    <div class="color-gray">\r\n                                        <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                        <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                                    </div>\r\n                                </div>\r\n                            </a>\r\n                            </li>\r\n                        ";
            return buffer
        }

        function program11(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    已取消　\r\n                    <a class="f-btn f-btn-gray J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                ';
            return buffer
        }

        function program13(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    <a class="f-btn f-btn-gray mr5 J-cancle" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">取消订单</a>\r\n                    <a class="f-btn f-btn-orange J-pay" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '" paymentType="';
            if (helper = helpers.paymentType) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.paymentType;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">立即付款</a>\r\n                ';
            return buffer
        }

        function program15(depth0, data) {
            return "\r\n                    已付款，等待卖家发货\r\n                "
        }

        function program17(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    卖家已发货,等待收货\r\n                    <a class="f-btn f-btn-orange ml5 J-confirm" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '"> 确认收货</a>\r\n                ';
            return buffer
        }

        function program19(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    交易成功\r\n                    <a class="f-btn f-btn-gray mr5 J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                    <!-- a class="f-btn f-btn-orange J-comments">评价</a -->\r\n                ';
            return buffer
        }

        function program21(depth0, data) {
            return "\r\n                    退款申请中\r\n                "
        }

        function program23(depth0, data) {
            return "\r\n                    退款处理中\r\n                "
        }

        function program25(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    退款完成\r\n                    <a class="f-btn f-btn-gray mr5 J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                ';
            return buffer
        }

        function program27(depth0, data) {
            return '\r\n    <div class="no-data">\r\n        <p>暂无数据</p>\r\n        <i class="iconfont">&#xe688;</i>\r\n    </div>\r\n'
        }
        stack1 = helpers["if"].call(depth0, depth0, {
            hash: {},
            inverse: self.program(27, program27, data),
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
define("/WEB-UED/fancy/dist/p/myOrder/express-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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