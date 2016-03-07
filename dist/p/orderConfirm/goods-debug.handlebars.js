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