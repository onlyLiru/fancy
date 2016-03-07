define("/WEB-UED/fancy/dist/p/detail/sku-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var buffer = "",
            stack1, self = this,
            helperMissing = helpers.helperMissing,
            functionType = "function",
            escapeExpression = this.escapeExpression;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n  <li>\r\n    <div class="item-content">\r\n      <div class="item-media color-gray fz12">';
            if (helper = helpers.attr_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '</div>\r\n      <div class="item-inner sku-select" data-name="';
            if (helper = helpers.attr_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">\r\n      ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.attr_value, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n      </div>\r\n    </div>\r\n  </li>\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\r\n            <a href="#" class="border sku-item ';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.index, "==", 0, options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.index, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '">';
            if (helper = helpers.attr_v_name) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.attr_v_name;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "</a>\r\n      ";
            return buffer
        }

        function program3(depth0, data) {
            return " active "
        }
        buffer += "<ul>\r\n";
        stack1 = helpers.each.call(depth0, depth0 && depth0.salesAttribute, {
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