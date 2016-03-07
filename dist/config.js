(function() {
    var root = this;
    var config = {
        alias: {},
        paths: {},
        comboSyntax: ["??", ","],
        comboMaxLength: 1e3,
        preload: [],
        charset: "utf-8",
        timeout: 1e3,
        debug: true
    };
    if (root.seajs) {
        if (typeof define === "function") {
            define("/WEB-UED/fancy/dist/config", [], function(require, exports, module) {
                module.exports = config
            })
        }
        root.seajs.config(config)
    }
    return config
}).call(this);