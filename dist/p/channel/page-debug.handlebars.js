define("/WEB-UED/fancy/dist/p/channel/page-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
                stack1, helper;
            buffer += '\r\n    <div class="swiper-wrapper">\r\n        <div class="swiper-slide">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n            </a>\r\n        </div>\r\n    </div>\r\n    ';
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="col-33">\r\n        <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external auto-img">\r\n            <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" >\r\n        </a>\r\n    </div>\r\n    ';
            return buffer
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n        <div class="col-33">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external auto-img">\r\n                <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" >\r\n            </a>\r\n        </div>\r\n    ';
            return buffer
        }

        function program7(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n        ";
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                    <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '">\r\n                </a>\r\n            ';
            return buffer
        }

        function program10(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n            ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n        ";
            return buffer
        }

        function program12(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            return buffer
        }

        function program13(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block">\r\n                        <img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '">\r\n                    </a>\r\n                ';
            return buffer
        }

        function program15(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.sort, "==", 4, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.sort, "==", 4, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            ";
            return buffer
        }

        function program17(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n    <div class="row bg-white home-activity-img">\r\n        <div class="auto-img relative">\r\n            <a href="';
            if (helper = helpers.goodsUrl) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.goodsUrl;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '" class="external block"><img class="lazy" data-original="';
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
            buffer += escapeExpression(stack1) + '" ></a>\r\n        </div>\r\n        <p class="fz12 pdlr10 absolute">\r\n            <span class="price fr color-red">';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.price, {
                hash: {},
                inverse: self.noop,
                fn: self.program(18, program18, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "</span>\r\n            ";
            if (helper = helpers.title) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.title;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '\r\n        </p>\r\n    </div>\r\n    <div class="fz16 bg-white pd10">\r\n        ';
            if (helper = helpers.description) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.description;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + "\r\n    </div>\r\n";
            return buffer
        }

        function program18(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += " ￥";
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
            buffer += escapeExpression(stack1) + " ";
            return buffer
        }
        buffer += "<div class=\"swiper-container\" data-space-between='10'>\r\n    ";
        stack1 = helpers.each.call(depth0, depth0 && depth0.block1, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    <div class="swiper-pagination"></div>\r\n</div>\r\n\r\n<div class="row mb10 bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block2, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n</div>\r\n\r\n<div class="row mb10 bg-white">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block3, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n</div>\r\n\r\n<div class="row bg-white auto-img mb10">\r\n\r\n    <div class="col-40 auto-img">\r\n        ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    </div>\r\n    <div class="col-60 borderL">\r\n        <div class="borderB">\r\n        ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(10, program10, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n        </div>\r\n        <div class="row">\r\n            <div class="col-50 auto-img">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(12, program12, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n            </div>\r\n            <div class="col-50 borderL">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0 && depth0.block4, {
            hash: {},
            inverse: self.noop,
            fn: self.program(15, program15, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n";
        stack1 = helpers.each.call(depth0, depth0 && depth0.block5, {
            hash: {},
            inverse: self.noop,
            fn: self.program(17, program17, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += "\r\n<br><br>";
        return buffer
    })
});