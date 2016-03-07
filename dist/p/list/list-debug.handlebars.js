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