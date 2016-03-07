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