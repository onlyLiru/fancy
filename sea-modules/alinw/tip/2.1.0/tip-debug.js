define("alinw/tip/2.1.0/tip-debug", [ "$-debug", "arale/tip/1.2.2/tip-debug.js", "arale/popup/1.1.6/popup-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), araleTip = require("arale/tip/1.2.2/tip-debug.js");
    var tip = araleTip.extend({
        attrs: {
            theme: "white",
            arrowPosition: 7,
            directionType: "down",
            arrowMargins: false,
            inViewport: true
        },
        setup: function() {
            if (this.get("arrowPosition") == "auto") {
                araleTip.superclass.constructor.superclass.setup.call(this);
                this.after("show", function() {
                    this._makesureAutoViewport();
                });
            } else {
                this._originArrowPosition = this.get("arrowPosition");
                araleTip.superclass.setup.call(this);
                this.after("show", function() {
                    this._makesureInViewport();
                });
            }
        },
        _makesureAutoViewport: function() {
            var arrowSpacing = this.get("arrowSpacing"), arrowMargins = 0, scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft(), viewportHeight = $(window).outerHeight(), viewportWidth = $(window).outerWidth(), elemHeight = this.element.height(), elemWidth = this.element.width(), triggerTop = this.get("trigger").offset().top, triggerLeft = this.get("trigger").offset().left, triggerHeight = this.get("trigger").outerHeight(), triggerWidth = this.get("trigger").outerWidth(), direction = arguments[0] || this.get("directionType"), arrow = this.$(".ui-poptip-arrow"), ifExtreme = arguments[0] || false, ap = 7, pointPos = 0, arrowShift = 0;
            this.element.css({
                left: 0,
                top: 0
            });
            if (direction == "up") {
                ap = 7;
                if (triggerTop - scrollTop < elemHeight && !ifExtreme) {
                    this._makesureAutoViewport("down", true);
                    return;
                }
            } else if (direction == "down") {
                ap = 11;
                if (viewportHeight + scrollTop < triggerTop + triggerHeight + elemHeight && triggerTop - scrollTop > elemHeight && !ifExtreme) {
                    this._makesureAutoViewport("up", true);
                    return;
                }
            } else if (direction == "left") {
                ap = 2;
                if (triggerLeft - scrollLeft < elemWidth && !ifExtreme) {
                    this._makesureAutoViewport("right", true);
                    return;
                }
            } else if (direction == "right") {
                ap = 10;
                if (viewportWidth + scrollLeft < triggerLeft + triggerWidth + elemWidth && triggerLeft - scrollLeft > elemWidth && !ifExtreme) {
                    this._makesureAutoViewport("left", true);
                    return;
                }
            } else {
                this._makesureAutoViewport("down", true);
                return;
            }
            arrow.get(0).className = "ui-poptip-arrow ui-poptip-arrow-" + ap;
            if (direction == "left" || direction == "right") {
                arrowMargins = this.get("arrowMargins") || triggerHeight / 2 - arrow.children("span").outerHeight() / 2 - 2;
                //注：这里2是边框和影阴
                if (triggerTop + elemHeight > viewportHeight + scrollTop) {
                    pointPos = "100%";
                    arrowShift = "100%";
                    arrow.css({
                        top: elemHeight - triggerHeight + arrowMargins
                    });
                } else {
                    arrow.css({
                        top: arrowMargins
                    });
                }
            }
            if (direction == "up" || direction == "down") {
                arrowMargins = this.get("arrowMargins") || triggerWidth / 2 - arrow.children("span").outerWidth() / 2 - 2;
                if (triggerLeft + elemWidth > viewportWidth + scrollLeft) {
                    pointPos = "100%";
                    arrowShift = "100%";
                    arrow.css({
                        left: elemWidth - triggerWidth + arrowMargins
                    });
                } else {
                    arrow.css({
                        left: arrowMargins
                    });
                }
            }
            this.set("direction", direction);
            this.set("pointPos", pointPos);
            this.set("arrowShift", arrowShift);
            araleTip.superclass._setAlign.call(this);
        },
        _makesureInViewport: function() {
            if (!this.get("inViewport")) {
                return;
            }
            var ap = this._originArrowPosition, scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft(), viewportHeight = $(window).outerHeight(), viewportWidth = $(window).outerWidth(), elemHeight = this.element.height(), elemWidth = this.element.width(), triggerTop = this.get("trigger").offset().top, triggerLeft = this.get("trigger").offset().left, triggerHeight = this.get("trigger").outerHeight(), triggerWidth = this.get("trigger").outerWidth(), arrowMap = {
                "12": 6,
                "6": 12,
                "2": 10,
                "10": 2,
                "3": 9,
                "9": 3,
                "4": 8,
                "8": 4
            };
            if (ap == 12 && triggerTop + triggerHeight > scrollTop + viewportHeight - elemHeight) {
                // tip 溢出屏幕下方
                this.set("arrowPosition", arrowMap[ap]);
            } else if (ap == 6 && triggerTop < scrollTop + elemHeight) {
                // tip 溢出屏幕上方
                this.set("arrowPosition", arrowMap[ap]);
            } else if ((ap == 2 || ap == 3 || ap == 4) && triggerLeft < scrollLeft + elemWidth) {
                //tip 溢出屏幕左方
                this.set("arrowPosition", arrowMap[ap]);
            } else if ((ap == 8 || ap == 9 || ap == 10) && triggerLeft + triggerWidth + elemWidth > viewportWidth + scrollLeft) {
                //tip 溢出屏幕右方
                this.set("arrowPosition", arrowMap[ap]);
            } else {
                araleTip.prototype._makesureInViewport.call(this);
            }
            this._makeWindowInView();
        },
        _makeWindowInView: function() {
            var ap = this.get("arrowPosition"), arrow = this.$(".ui-poptip-arrow"), elemTop = this.element.offset().top, elemLeft = this.element.offset().left, elemHeight = this.element.height(), elemWidth = this.element.width(), scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft(), viewportHeight = $(window).outerHeight(), viewportWidth = $(window).outerWidth(), arrowMap = {
                "2": 4,
                "3D": 4,
                "10": 8,
                "9D": 8,
                "4": 2,
                "3T": 2,
                "8": 10,
                "9T": 10,
                "1": 11,
                "12L": 11,
                "5": 7,
                "6L": 7,
                "11": 1,
                "12R": 1,
                "7": 5,
                "6R": 5
            }, direction = this.get("direction");
            if (direction == "left" || direction == "right") {
                if (elemTop + elemHeight > scrollTop + viewportHeight) {
                    //下面超出边界
                    this.element.css({
                        left: 0,
                        top: 0
                    });
                    arrow.removeAttr("style").removeClass().addClass("ui-poptip-arrow");
                    ap = ap == 3 || ap == 9 ? ap + "D" : ap;
                    this.set("arrowPosition", arrowMap[ap]);
                } else if (elemHeight > elemTop + elemHeight - scrollTop) {
                    //上面超出边界
                    this.element.css({
                        left: 0,
                        top: 0
                    });
                    arrow.removeAttr("style").removeClass().addClass("ui-poptip-arrow");
                    ap = ap == 3 || ap == 9 ? ap + "T" : ap;
                    this.set("arrowPosition", arrowMap[ap]);
                }
            }
            if (direction == "up" || direction == "down") {
                if (elemLeft + elemWidth > scrollLeft + viewportWidth) {
                    //右面超出边界
                    this.element.css({
                        left: 0,
                        top: 0
                    });
                    ap = ap == 12 || ap == 6 ? ap + "R" : ap;
                    this.set("arrowPosition", arrowMap[ap]);
                } else if (elemWidth > elemLeft + elemWidth - scrollLeft) {
                    //左面超出边界
                    this.element.css({
                        left: 0,
                        top: 0
                    });
                    ap = ap == 12 || ap == 6 ? ap + "L" : ap;
                    this.set("arrowPosition", arrowMap[ap]);
                }
            }
        },
        _onRenderArrowPosition: function(val, prev) {
            if (this._specifiedAlign) {
                return;
            }
            val = parseInt(val, 10);
            var arrow = this.$(".ui-poptip-arrow"), pointPos = "50%";
            // 用户设置了 align
            // 则直接使用 align 表示的位置信息，忽略 arrowPosition
            var direction = "", arrowShift = 0;
            if (val === 4) {
                direction = "left";
                val = 3;
                arrow.css({
                    bottom: 20,
                    top: "inherit"
                });
                arrowShift = -20;
            } else if (val === 8) {
                direction = "right";
                arrowShift = -20;
                arrow.css({
                    bottom: 20,
                    top: "inherit"
                });
                val = 10;
            } else if (val === 12) {
                direction = "down";
                arrowShift = "50%";
            } else if (val === 6) {
                direction = "up";
                arrowShift = "50%";
            } else if (val === 3) {
                direction = "left";
                arrowShift = "50%";
            } else if (val === 9) {
                direction = "right";
                arrowShift = "50%";
            } else {
                araleTip.prototype._onRenderArrowPosition.call(this, val, prev);
                return;
            }
            arrow.get(0).className = "ui-poptip-arrow ui-poptip-arrow-" + val;
            this.set("pointPos", pointPos);
            this.set("direction", direction);
            this.set("arrowShift", arrowShift);
            this._setAlign();
        },
        // 用于 set 属性后的界面更新
        _onRenderContent: function(val, prev) {
            var ctn = this.$('[data-role="content"]');
            if ($.isFunction(val)) {
                val = val.call(this);
            }
            ctn && ctn.html(val);
            if (prev !== undefined) {
                this.show();
            }
        }
    });
    module.exports = tip;
});
