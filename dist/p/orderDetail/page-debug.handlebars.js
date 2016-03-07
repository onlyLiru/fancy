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