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