define(function(require, exports, module){
    var $=zepto=require("zepto"); 
        require('touch'); 
    var IScroll=require('iscroll');
        require('../../c/js/registerHelper');
        require('../../c/js/swiper.3.1.2.jquery.min'); 
    var G=require('../../c/js/globale');

    var main = {
        init:function(){ 
            var self=this;
            self._event();
            
        },
        _event:function(){
            var self=this;
        }
    };
    main.init();
});