define("/WEB-UED/fancy/dist/p/address/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            buffer += '\r\n      <li data-id="';
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
            buffer += '">\r\n        <a href="#router-edit" class="item-link item-content">\r\n          <div class="item-inner">\r\n            <div class="item-title-row">\r\n              <div class="item-title">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n              <div class="item-after">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n            </div>\r\n            <div class="item-text">';
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
            buffer += escapeExpression(stack1) + "</div>\r\n          </div>\r\n        </a>\r\n      </li>\r\n      ";
            return buffer
        }

        function program2(depth0, data) {
            return " active "
        }
        buffer += '\r\n<div class="list-block media-list">\r\n    <ul>\r\n	';
        stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        }));
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n    </ul>\r\n  </div>";
        return buffer
    })
});