(function() {
    var root = this;
    var config = {
        alias: {
                    
        },
        paths: {},
        comboSyntax: ['??', ','],
        comboMaxLength: 1000,
        preload: [],
        charset: 'utf-8',
        timeout: 1000,
        debug: true
    };

    // 仅限浏览器时使用
    if (root.seajs) {
        if (typeof define === 'function') {
            define(function(require, exports, module) {
                module.exports = config; // avoid warning on console
            });
        }
        root.seajs.config(config);
    }

    return config;
}).call(this);
