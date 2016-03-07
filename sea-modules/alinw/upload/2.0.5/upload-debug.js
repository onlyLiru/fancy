/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 2014/06/17
 * Time: 10:45
 *
 */
define("alinw/upload/2.0.5/upload-debug", [ "$-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./form-debug.handlebars", "./blank-iframe-debug.handlebars", "./another-iframe-debug.handlebars", "./data-input-debug.handlebars", "arale/detector/1.3.0/detector-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Base = require("arale/base/1.1.1/base-debug");
    var formTemplate = require("./form-debug.handlebars");
    var blankIframeTemplate = require("./blank-iframe-debug.handlebars");
    var anotherIframeTemplate = require("./another-iframe-debug.handlebars");
    var dataInputTemplate = require("./data-input-debug.handlebars");
    var detector = require("arale/detector/1.3.0/detector-debug");
    var iframeCount = 0;
    var win = window;
    //    var runner = null;
    var bodySelector = $("body:first");
    var isSupportFormData = win.FormData ? true : false;
    var Uploader = Base.extend({
        attrs: {
            // 唤出文件选择器，可以是: selector, element, jQuery object
            trigger: null,
            // 即为 <input name="{{name}}"> 的值，即上传文件时对应的 name
            name: null,
            // <form action="{{action}}"> 的值，表单提交的地址
            action: null,
            // 支持的文件类型，比如 image/\* 为只上传图片类的文件。可选项
            accept: null,
            // 是否支持多文件上传。默认为 false
            multiple: false,
            // 随表单一起要提交的数据
            data: {},
            // 上传错误的回调
            error: null,
            // 上传成功的回调
            success: null,
            // input change事件错误时的回调
            change: null,
            // 进度
            progress: null,
            // 上传用到的表单
            form: null,
            // 上传表单外面的iframe
            iframe: null,
            // 具体上传的input[type=file]
            input: null,
            files: [],
            runner: null
        },
        initialize: function(config) {
            var self = this;
            Uploader.superclass.initialize.call(self, config);
            if (!(self.get("trigger") instanceof $)) {
                self.set("trigger", $(self.get("trigger")));
            }
            self.setup();
            self.bindEvents();
        },
        setup: function() {
            var self = this;
            var element = self.get("trigger");
            self.set("iframe", self.newIframe());
            var getFomStyles = function() {
                return {
                    top: element.offset().top + "px",
                    left: element.offset().left + "px",
                    width: element.outerWidth() + "px",
                    height: element.outerHeight() + "px",
                    zIndex: self.getZIndex(element) + 10
                };
            };
            self.set("form", $(formTemplate({
                target: self.get("iframe").attr("name"),
                option: {
                    action: self.get("action"),
                    name: self.get("name"),
                    accept: self.get("accept"),
                    multiple: self.get("multiple")
                },
                data: $.map(self.get("data"), function(value, key) {
                    return {
                        name: key,
                        value: value
                    };
                }),
                isSupportFormData: isSupportFormData,
                formStyles: getFomStyles(),
                fileInput: {
                    height: element.outerHeight() + "px",
                    fontSize: Math.max(64, element.outerHeight() * 5)
                }
            })).appendTo(bodySelector));
            // 这里的样式必须是用jQuery.css，不然自己写入的话，需要考虑浏览器的兼容性
            self.set("input", self.get("form").find("input[type=file]:last").attr("hidefocus", true).css({
                position: "absolute",
                top: 0,
                right: 0,
                opacity: 0,
                outline: 0,
                cursor: "pointer",
                height: element.outerHeight()
            }));
            self.get("input").attr("id", "input-" + Math.random());
            // fix issue: http://gitlab.alibaba-inc.com/alinw/upload/issues/1
            // 当dom结构有修改时，去更新form的位置
            // 这里得兼容IE8和其他浏览器
            if (detector.browser.ie && detector.browser.version <= 8) {
                setInterval(function() {
                    // http://gitlab.alibaba-inc.com/alinw/upload/issues/5
                    self.get("form").css(getFomStyles());
                }, 500);
            } else {
                $(document.body).on("DOMSubtreeModified", function(e) {
                    // http://gitlab.alibaba-inc.com/alinw/upload/issues/5
                    var target = $(e.target);
                    var hasLazyLoad = target.find("img").length > 0 || target.find("iframe").length > 0;
                    if (hasLazyLoad) {
                        $.each([ "img", "iframe" ], function(index, tagName) {
                            target.find(tagName).on("load", function() {
                                self.get("form").css(getFomStyles());
                            });
                        });
                    } else {
                        self.get("form").css(getFomStyles());
                    }
                });
            }
            return self;
        },
        bindEvents: function() {
            var self = this;
            self.bindEventsForInput();
        },
        bindEventsForInput: function() {
            var self = this;
            // last input value
            var last = null;
            if (isSupportFormData) {
                // ie9 don't support FileList Object
                // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
                self.get("input").on("change", function(e) {
                    self.set("files", this.files || [ {
                        name: e.currentTarget.value
                    } ]);
                    var file = e.currentTarget.value;
                    if ($.isFunction(self.get("change"))) {
                        self.get("change").call(self, self.get("files"));
                    } else if (file) {
                        self.submit();
                    }
                });
            } else {
                self.get("input").on("click", function() {
                    last = null;
                    self.get("input").val("");
                });
                if (self.get("runner")) {
                    win.clearInterval(self.get("runner"));
                }
                self.set("runner", win.setInterval(function() {
                    var current = self.get("input").val();
                    if (current !== last && current.length > 0) {
                        self.set("files", this.files || [ {
                            name: current
                        } ]);
                        if ($.isFunction(self.get("change"))) {
                            self.get("change").call(self, self.get("files"));
                        } else if (current) {
                            self.submit();
                        }
                    }
                    last = current;
                }, 300));
            }
        },
        /**
         * 上传
         * @returns {*}
         */
        submit: function() {
            var self = this;
            if (isSupportFormData && self.get("files")) {
                // build a FormData
                var form = new win.FormData(self.get("form").get(0));
                // use FormData to upload
                form.append(self.get("name"), self.get("files"));
                var optionXhr = null;
                if (typeof self.get("progress") === "function") {
                    var files = self.get("files");
                    optionXhr = function() {
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener("progress", function(event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                self.get("progress")(event, position, total, percent, files);
                            }, false);
                        }
                        return xhr;
                    };
                }
                $.ajax({
                    url: self.get("action"),
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: form,
                    xhr: optionXhr,
                    context: this,
                    success: self.get("success"),
                    error: self.get("error"),
                    // 2014-06-09 garcia.wul fix cannot upload same file on windows
                    complete: function() {
                        if (self.get("input") instanceof $) {
                            self.get("input").val("");
                        }
                    }
                });
                return self;
            } else {
                // 为什么这里需要一个新的iframe?
                // 因为否则会被浏览器阻止打开新的窗口，不信的可以试试
                self.set("iframe", self.newIframe());
                self.get("form").attr("target", self.get("iframe").attr("name"));
                bodySelector.append(self.get("iframe"));
                // 使用iframe upload
                self.get("iframe").one("load", function() {
                    var that = $(this);
                    // https://github.com/blueimp/jQuery-File-Upload/blob/9.5.6/js/jquery.iframe-transport.js#L102
                    // Fix for IE endless progress bar activity bug
                    // (happens on form submits to iframe targets):
                    $(anotherIframeTemplate({})).appendTo(self.get("form")).remove();
                    var response = that.contents().find("body:first").text();
                    that.remove();
                    if (!response) {
                        if ($.isFunction(self.get("error"))) {
                            self.get("error")(self.get("input").val());
                        }
                    } else {
                        if ($.isFunction(self.get("success"))) {
                            self.get("success")(response);
                        }
                    }
                });
                self.get("form").submit();
            }
            return self;
        },
        /**
         * 激活提交按钮
         */
        enable: function() {
            var self = this;
            if (self.get("input") instanceof $) {
                self.get("input").prop("disabled", false);
            }
        },
        /**
         * 禁用提交按钮
         */
        disable: function() {
            var self = this;
            if (self.get("input") instanceof $) {
                self.get("input").prop("disabled", true);
            }
        },
        newIframe: function() {
            var iframe = $(blankIframeTemplate({
                id: iframeCount
            })).hide();
            iframeCount += 1;
            return iframe;
        },
        getZIndex: function(element) {
            var zIndex = 0;
            element.parentsUntil("body").each(function() {
                var that = $(this);
                if (that.css("position") !== "static") {
                    zIndex = parseInt(that.css("zIndex"), 10) || zIndex;
                }
            });
            return zIndex;
        },
        /**
         * 创建一个空的hidden input，这个通常是没啥用，除非你想动态地去修改提交的数据
         */
        createDataInput: function(param) {
            return dataInputTemplate(param);
        }
    });
    module.exports = Uploader;
});

define("alinw/upload/2.0.5/form-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <input type="hidden" name="';
            if (stack1 = helpers.name) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.name;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" value="';
            if (stack1 = helpers.value) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.value;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" />\n    ';
            return buffer;
        }
        function program3(depth0, data) {
            return '\n        <input type="hidden" name="_uploader_" value="formdata" />\n    ';
        }
        function program5(depth0, data) {
            return '\n        <input type="hidden" name="_uploader_" value="iframe" />\n    ';
        }
        function program7(depth0, data) {
            var buffer = "", stack1;
            buffer += 'accept="' + escapeExpression((stack1 = (stack1 = depth0.option, stack1 == null || stack1 === false ? stack1 : stack1.accept), 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" ';
            return buffer;
        }
        function program9(depth0, data) {
            return 'multiple="multiple"';
        }
        buffer += "\n" + "\n" + "\n" + "\n" + '\n\n<form method="POST" enctype="multipart/form-data" target="';
        if (stack1 = helpers.target) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.target;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" action="' + escapeExpression((stack1 = (stack1 = depth0.option, 
        stack1 == null || stack1 === false ? stack1 : stack1.action), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" style="position:absolute;top: ' + escapeExpression((stack1 = (stack1 = depth0.formStyles, 
        stack1 == null || stack1 === false ? stack1 : stack1.top), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ";left: " + escapeExpression((stack1 = (stack1 = depth0.formStyles, 
        stack1 == null || stack1 === false ? stack1 : stack1.left), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ";overflow: hidden;width: " + escapeExpression((stack1 = (stack1 = depth0.formStyles, 
        stack1 == null || stack1 === false ? stack1 : stack1.width), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + "; height: " + escapeExpression((stack1 = (stack1 = depth0.formStyles, 
        stack1 == null || stack1 === false ? stack1 : stack1.height), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ";z-index: " + escapeExpression((stack1 = (stack1 = depth0.formStyles, 
        stack1 == null || stack1 === false ? stack1 : stack1.zIndex), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">\n    ';
        stack2 = helpers.each.call(depth0, depth0.data, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += "\n    ";
        stack2 = helpers["if"].call(depth0, depth0.isSupportFormData, {
            hash: {},
            inverse: self.program(5, program5, data),
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '\n    <input type="file" name="' + escapeExpression((stack1 = (stack1 = depth0.option, 
        stack1 == null || stack1 === false ? stack1 : stack1.name), typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" ';
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.option, stack1 == null || stack1 === false ? stack1 : stack1.accept), {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += " ";
        stack2 = helpers["if"].call(depth0, (stack1 = depth0.option, stack1 == null || stack1 === false ? stack1 : stack1.multiple), {
            hash: {},
            inverse: self.noop,
            fn: self.program(9, program9, data),
            data: data
        });
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += " />\n</form>";
        return buffer;
    });
});

define("alinw/upload/2.0.5/blank-iframe-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += "\n" + "\n" + "\n" + "\n" + '\n\n<iframe name="iframe-uploader-';
        if (stack1 = helpers.id) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.id;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\n</iframe>';
        return buffer;
    });
});

define("alinw/upload/2.0.5/another-iframe-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "";
        buffer += "\n" + "\n" + "\n" + "\n" + '\n<iframe src="javascript:false;"></iframe>';
        return buffer;
    });
});

define("alinw/upload/2.0.5/data-input-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var stack1;
            if (stack1 = helpers.type) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.type;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            return escapeExpression(stack1);
        }
        function program3(depth0, data) {
            return "hidden";
        }
        buffer += "\n" + "\n" + "\n" + "\n" + '\n\n<input type="';
        stack1 = helpers["if"].call(depth0, depth0.type, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" name="';
        if (stack1 = helpers.name) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.name;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" value="';
        if (stack1 = helpers.value) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.value;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" />';
        return buffer;
    });
});
