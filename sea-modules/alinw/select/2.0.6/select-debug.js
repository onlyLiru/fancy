define("alinw/select/2.0.6/select-debug", [ "arale/select/0.9.9/select-debug", "arale/overlay/1.1.4/overlay-debug", "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var araleSelect = require("arale/select/0.9.9/select-debug");
    var $ = require("$-debug");
    var Select = araleSelect.extend({
        attrs: {
            triggerTpl: '<div class="kuma-select"><a href="javascript:void(0);"><span data-role="trigger-content"></span><i class="kuma-icon kuma-icon-triangle-down" title="下拉"></i></a></div>',
            classPrefix: "kuma-select"
        },
        /**
         * 继承arale 原生select控件的setup方法
         */
        setup: function() {
            var me = this;
            Select.superclass.setup.call(me);
            if (!me.get("notInitWidth")) {
                me._initSelectWidth();
            }
            var selectSource = me.get("selectSource");
            selectSource && me.on("change", function() {
                selectSource.trigger("change");
                me.get("trigger").attr("title", me.get("trigger").text());
            });
            me.get("trigger").attr("title", me.get("trigger").text());
            me.element.css({
                "min-width": me.element.width(),
                width: "auto"
            });
            me.after("show", function() {
                me._setPosition(me.get("align"));
            });
        },
        /**
         * 初始化下拉框宽度
         */
        _initSelectWidth: function() {
            var selectSource = this.get("selectSource");
            if (selectSource) {
                var selectSourceWidth = this.get("selectSource").outerWidth() || 0;
                if (!this.get("width") && selectSourceWidth > 0) {
                    this.set("width", parseInt(selectSourceWidth, 10));
                }
            }
            this.render();
        },
        _setTriggerWidth: function() {
            var trigger = this.get("trigger");
            if (this.get("width")) {
                // 减2是为了fix http://gitlab.alibaba-inc.com/alinw/select/issues/4
                trigger.css({
                    width: parseInt(this.get("width"), 10) - 26,
                    "padding-right": 24,
                    overflow: "hidden"
                });
            } else {
                var width = this.element.outerWidth();
                var pl = parseInt(trigger.css("padding-left"), 10);
                var pr = parseInt(trigger.css("padding-right"), 10);
                // maybe 'thin|medium|thick' in IE
                // just give a 0
                var bl = parseInt(trigger.css("border-left-width"), 10) || 0;
                var br = parseInt(trigger.css("border-right-width"), 10) || 0;
                trigger.css({
                    width: width - pl - pr - bl - br - 24,
                    "padding-right": 24,
                    overflow: "hidden"
                });
            }
        }
    });
    Select.init = function(selector) {
        $(selector).each(function() {
            new Select({
                trigger: this
            });
        });
    };
    module.exports = Select;
});
