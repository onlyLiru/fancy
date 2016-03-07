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