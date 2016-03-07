define("/WEB-UED/fancy/dist/p/me/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            blockHelperMissing = helpers.blockHelperMissing,
            helperMissing = helpers.helperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\r\n    <div class="bg-white mb10">\r\n        <ul class="goods-list">\r\n            ';
            options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            };
            if (helper = helpers.orderDetailVOList) {
                stack1 = helper.call(depth0, options)
            } else {
                helper = depth0 && depth0.orderDetailVOList;
                stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
            }
            if (!helpers.orderDetailVOList) {
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
            buffer += '\r\n        </ul>\r\n        <div class="color-gray ar pd10 borderT borderB">\r\n            共计';
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
            buffer += escapeExpression(stack1) + ')\r\n        </div>\r\n        <div class="pd10 ar">\r\n            ';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", -1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", -1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(10, program10, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(12, program12, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n        </div>\r\n    </div>\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a class="external" href="/order/orderDetail.html?orderNo=';
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
            buffer += escapeExpression(stack1) + '">\r\n                <li class="goods-list-item" data-id="';
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
            buffer += escapeExpression(stack1) + '" >\r\n                    <div class="goods-list-img">\r\n                        <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                    </div>\r\n                    <div class="goods-list-description">\r\n                        <div class="goods-list-title color-gray">\r\n                            <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                        </div>\r\n                        <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                        <div class="color-gray">\r\n                            <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                            <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                            <span class="fr">x';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n                </a>\r\n            ";
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                已取消　\r\n                <a class="f-btn f-btn-gray J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n            ';
            return buffer
        }

        function program6(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a class="f-btn f-btn-gray mr5 J-cancle" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">取消订单</a>\r\n                <a class="f-btn f-btn-orange J-pay" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">立即付款</a>\r\n            ';
            return buffer
        }

        function program8(depth0, data) {
            return "\r\n                已付款，等待卖家发货\r\n            "
        }

        function program10(depth0, data) {
            return "\r\n                卖家已发货,等待收货\r\n            "
        }

        function program12(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                交易成功\r\n                <a class="f-btn f-btn-gray mr5 J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                <!-- a class="f-btn f-btn-orange J-comments">评价</a -->\r\n            ';
            return buffer
        }
        stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }));
        if (stack1 || stack1 === 0) {
            return stack1
        } else {
            return ""
        }
    })
});