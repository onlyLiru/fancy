define("/WEB-UED/fancy/dist/p/myOrder/list-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
    var Handlebars = require("alinw/handlebars/1.3.0/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [4, ">= 1.0.0"];
        helpers = this.merge(helpers, Handlebars.helpers);
        data = data || {};
        var stack1, functionType = "function",
            escapeExpression = this.escapeExpression,
            self = this,
            helperMissing = helpers.helperMissing,
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1;
            buffer += "\r\n    ";
            stack1 = (stack1 = typeof depth0 === functionType ? depth0.apply(depth0) : depth0, blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            }));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n";
            return buffer
        }

        function program2(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += '\r\n        <div class="bg-white mb10">\r\n            ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n            <ul class="goods-list mb10">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0 && depth0.detailMap, {
                hash: {},
                inverse: self.noop,
                fn: self.program(7, program7, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += '\r\n            </ul>\r\n            <div class="color-gray ar pd10 borderB">\r\n                共计';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                (含运费￥";
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
            buffer += escapeExpression(stack1) + ')\r\n            </div>\r\n            <div class="pd10 ar">\r\n                ';
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(11, program11, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", -1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", -1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 0, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 0, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(15, program15, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 1, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 1, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(17, program17, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 2, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 2, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(19, program19, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 3, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 3, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(21, program21, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 5, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 5, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(23, program23, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 5, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 5, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(25, program25, data),
                data: data
            }, helper ? helper.call(depth0, depth0 && depth0.state, "==", 7, options) : helperMissing.call(depth0, "ifCond", depth0 && depth0.state, "==", 7, options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n            </div>\r\n        </div>\r\n    ";
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "",
                stack1;
            buffer += '\r\n                <ul class="goods-list  borderB has-express">\r\n                    ';
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                </ul>\r\n            ";
            return buffer
        }

        function program4(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                        ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(5, program5, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "!=", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "!=", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                    ";
            return buffer
        }

        function program5(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                            <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <a external _href="/order/orderDetail.html?orderNo=';
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
            buffer += escapeExpression(stack1) + '">\r\n                                <div class="goods-list-img">\r\n                                    <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                                </div>\r\n                                <div class="goods-list-description">\r\n                                    <div class="goods-list-title color-gray">\r\n                                        <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                                    </div>\r\n                                    <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                    <div class="color-gray">\r\n                                        <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                        <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                    </div>\r\n                                </div>\r\n                            </a>\r\n                            </li>\r\n                            <li class="goods-list-item bg-white hide ar J-view-li">\r\n                                <a class="f-btn f-btn-orange J-view" data-expressNo="';
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
            buffer += escapeExpression(stack1) + '">查看物流</a>\r\n                            </li>\r\n                        ';
            return buffer
        }

        function program7(depth0, data) {
            var buffer = "",
                stack1;
            buffer += "\r\n                    ";
            stack1 = helpers.each.call(depth0, depth0, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                ";
            return buffer
        }

        function program8(depth0, data) {
            var buffer = "",
                stack1, helper, options;
            buffer += "\r\n                        ";
            stack1 = (helper = helpers.ifCond || depth0 && depth0.ifCond, options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(9, program9, data),
                data: data
            }, helper ? helper.call(depth0, data == null || data === false ? data : data.key, "==", "N", options) : helperMissing.call(depth0, "ifCond", data == null || data === false ? data : data.key, "==", "N", options));
            if (stack1 || stack1 === 0) {
                buffer += stack1
            }
            buffer += "\r\n                    ";
            return buffer
        }

        function program9(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                            <li class="goods-list-item bg-white" data-id="';
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
            buffer += escapeExpression(stack1) + '">\r\n                            <a external _href="/order/orderDetail.html?orderNo=';
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
            buffer += escapeExpression(stack1) + '">\r\n                                <div class="goods-list-img">\r\n                                    <img src="';
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
            buffer += escapeExpression(stack1) + '">\r\n                                </div>\r\n                                <div class="goods-list-description">\r\n                                    <div class="goods-list-title color-gray">\r\n                                        <i class="iconfont fz18 color-orange mr5">&#xe646;</i>';
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
            buffer += escapeExpression(stack1) + '\r\n                                    </div>\r\n                                    <div class="fz12 color-gray">';
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
            buffer += escapeExpression(stack1) + '</div>\r\n                                    <div class="color-gray">\r\n                                        <span class="price mr5">￥';
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
            buffer += escapeExpression(stack1) + '</span>\r\n                                        <span class="color-gray fz10 line-throuth">￥';
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
            buffer += escapeExpression(stack1) + "</span>\r\n                                    </div>\r\n                                </div>\r\n                            </a>\r\n                            </li>\r\n                        ";
            return buffer
        }

        function program11(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    已取消　\r\n                    <a class="f-btn f-btn-gray J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                ';
            return buffer
        }

        function program13(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    <a class="f-btn f-btn-gray mr5 J-cancle" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">取消订单</a>\r\n                    <a class="f-btn f-btn-orange J-pay" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '" paymentType="';
            if (helper = helpers.paymentType) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                })
            } else {
                helper = depth0 && depth0.paymentType;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper
            }
            buffer += escapeExpression(stack1) + '">立即付款</a>\r\n                ';
            return buffer
        }

        function program15(depth0, data) {
            return "\r\n                    已付款，等待卖家发货\r\n                "
        }

        function program17(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    卖家已发货,等待收货\r\n                    <a class="f-btn f-btn-orange ml5 J-confirm" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '"> 确认收货</a>\r\n                ';
            return buffer
        }

        function program19(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    交易成功\r\n                    <a class="f-btn f-btn-gray mr5 J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                    <!-- a class="f-btn f-btn-orange J-comments">评价</a -->\r\n                ';
            return buffer
        }

        function program21(depth0, data) {
            return "\r\n                    退款申请中\r\n                "
        }

        function program23(depth0, data) {
            return "\r\n                    退款处理中\r\n                "
        }

        function program25(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                    退款完成\r\n                    <a class="f-btn f-btn-gray mr5 J-delete" data-orderNo="';
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
            buffer += escapeExpression(stack1) + '">删除订单</a>\r\n                ';
            return buffer
        }

        function program27(depth0, data) {
            return '\r\n    <div class="no-data">\r\n        <p>暂无数据</p>\r\n        <i class="iconfont">&#xe688;</i>\r\n    </div>\r\n'
        }
        stack1 = helpers["if"].call(depth0, depth0, {
            hash: {},
            inverse: self.program(27, program27, data),
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