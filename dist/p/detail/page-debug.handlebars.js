define("/WEB-UED/fancy/dist/p/detail/page-debug.handlebars", ["alinw/handlebars/1.3.0/runtime-debug"], function(require, exports, module) {
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
            blockHelperMissing = helpers.blockHelperMissing;

        function program1(depth0, data) {
            var buffer = "",
                stack1, helper;
            buffer += '\r\n                <div class="swiper-slide"><img src="';
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
            buffer += escapeExpression(stack1) + '@1e_480w_480h_1c_0i_1o_90Q_1x.jpg"></div>\r\n            ';
            return buffer
        }

        function program3(depth0, data) {
            var buffer = "";
            buffer += '\r\n            <img class="goods-desc-img lazy pb-standalone" data-original="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '">\r\n        ';
            return buffer
        }
        buffer += '    <div class="swiper-container bg-white" data-space-between=\'10\'>\r\n        <div class="swiper-wrapper">\r\n            ';
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
        buffer += '\r\n        </div>\r\n        <div class="banner-pagination"></div>\r\n    </div>\r\n\r\n    <div class="bg-white pd10">\r\n        <p>';
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
        buffer += escapeExpression(stack1) + '</p>\r\n        <p>\r\n            <span class="price">￥';
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
        buffer += escapeExpression(stack1) + '</span>　\r\n            <span class="color-gray fz10 line-throuth">￥';
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
        buffer += escapeExpression(stack1) + '</span>\r\n            <span class="fr">库存：<span id="J-stockNum">';
        if (helper = helpers.stockNum) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.stockNum;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '</span>件</span>\r\n        </p>\r\n        <ul class="flex-box1 borderB lh32">\r\n            <li class="al">快递：';
        if (helper = helpers.expressPrice) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.expressPrice;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '元</li>\r\n            <!-- li class="ar">月销：';
        if (helper = helpers.monthSalesNum) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            })
        } else {
            helper = depth0 && depth0.monthSalesNum;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper
        }
        buffer += escapeExpression(stack1) + '本</li -->\r\n        </ul>\r\n\r\n        <p class="lh32 borderB">\r\n        <i class="iconfont fr color-gray">&#xe614;</i>\r\n        <a href="javascript:" class="block color-gray open-panel" data-panel=\'#panel-sku\'>选择 颜色分类 尺码 数量</a></p>\r\n\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe674;</i>\r\n            <span class="fz14 millde color-black">100%正品</span>\r\n            <span class="fz12 millde">所售商品均为正品</span>\r\n        </div>\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe676;</i>\r\n            <span class="fz14 millde color-black">七天包退</span>\r\n            <span class="fz12 millde">7天无条件退换货</span>\r\n        </div>\r\n        <div>\r\n            <i class="iconfont color-orange fz20">&#xe675;</i>\r\n            <span class="fz14 millde color-black">闪电发货</span>\r\n            <span class="fz12 millde">所有商品72小时内发货</span>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <div class="row bg-opacity-title" id="J-collection"></div>\r\n\r\n    <h4 class="h4-title pd10">宝贝详情</h4>\r\n    <div class="bg-white pd10" id="J-g-detail">\r\n        <ul id="J-specify"></ul>\r\n        ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        };
        if (helper = helpers.introduction) {
            stack1 = helper.call(depth0, options)
        } else {
            helper = depth0 && depth0.introduction;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper
        }
        if (!helpers.introduction) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.program(3, program3, data),
                data: data
            })
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1
        }
        buffer += '\r\n    </div>\r\n\r\n    <!--h4 class="h4-title">宝贝评价<a class="fr" href="javascript:">更多</a></h4>\r\n    <ul class="goods-list bg-white">\r\n        <li class="goods-list-item clearfix">\r\n            <div class="goods-list-img">\r\n                <img class="borderRadius50" src="//m.360buyimg.com/n7/jfs/t1678/80/972239920/357576/2ce43ecf/55e02f07N9507b4ee.jpg!q70.jpg">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <h3 class="fz16 mb10">邓丽君<span class="fr fz12">22:08</span></h3>\r\n                <div class="color-gray">认识观匆匆流逝，我就喜欢这本书！！！！喜欢的不行不行的。</div>\r\n            </div>\r\n        </li>\r\n        <li class="goods-list-item">\r\n            <div class="goods-list-img">\r\n                <img class="borderRadius50" src="//m.360buyimg.com/n7/jfs/t1678/80/972239920/357576/2ce43ecf/55e02f07N9507b4ee.jpg!q70.jpg">\r\n            </div>\r\n            <div class="goods-list-description">\r\n                <h3 class="fz16 mb10">Tony<span class="fr fz12">22:08</span></h3>\r\n                <div class="color-gray">我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。我觉得这里书本很好，非常好，总之就一个字想到那个好。</div>\r\n            </div>\r\n        </li>\r\n    </ul>\r\n\r\n    <h3 class="h3-title"><span>猜你喜欢</span></h3>\r\n    <div class="goods-box">\r\n        <ul>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/jfs/t1099/340/584783761/444035/83bb7a9c/5530a843N5601590f.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接问哦发链接链接问哦发链接链接问哦发链接链接问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/g14/M01/01/15/rBEhV1KLJGYIAAAAAALQ2fs55p8AAF0LQKMJkAAAtDx560.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n            <li class="clearfix">\r\n                <a class="img" href="javascript:"><img  src="//m.360buyimg.com/n7/g13/M00/0F/1A/rBEhVFJWgtQIAAAAABYy8ainCvkAAD_CwIhjcQAFjMJ922.jpg!q70.jpg"></a>\r\n                <span class="desc">问哦发链接链接</span>\r\n                <span class="al color-orange fz16">￥120</span>\r\n            </li>\r\n        </ul>\r\n    </div -->';
        return buffer
    })
});