define(function(require, exports, module){
    var G=require('../../c/js/globale');
    require('../../c/js/zepto.lazyload');
    var main = {
        init:function(){ 
            var self=this;
            /*图片延迟加载*/
            $(".content img.lazy").lazyload({
                event:"sporty",
                threshold : 10
            });

            var timeout = setTimeout(function() {
                $("img.lazy").trigger("sporty")
            }, 200);
        }
	};
	main.init();
});