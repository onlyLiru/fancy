define("alinw/select/2.0.0/select-debug", [ "arale/select/0.9.7/select-debug", "arale/overlay/1.1.1/overlay-debug", "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/templatable/0.9.1/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var araleSelect = require("arale/select/0.9.7/select-debug");
    var $ = require("$-debug");
    //  require("select.css");
    var Select = araleSelect.extend({
        attrs: {
            triggerTpl: '<div class="kuma-select"><a href="javascript:void(0);"><span data-role="trigger-content"></span><i class="kuma-icon kuma-icon-triangle-down" title="下拉"></i></a></div>',
            classPrefix: "kuma-select"
        },
        /**
         * 继承arale 原生select控件的setup方法
         */
        setup: function() {
            Select.superclass.setup.call(this);
            this._initSelectWidth();
            var selectSource = this.get("selectSource");
            selectSource && this.on("change", function() {
                selectSource.trigger("change");
            });
        },
        /**
         * 初始化下拉框宽度
         * @private
         */
        _initSelectWidth: function() {
            var selectSource = this.get("selectSource");
            if (selectSource) {
                var selectSourceWidth = this.get("selectSource").outerWidth() || 0;
                if (!this.get("width") && selectSourceWidth > 0) {
                    this.set("width", parseInt(selectSourceWidth));
                }
            }
            this.render();
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
