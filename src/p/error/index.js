define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var main = {
        init:function(){
            var self=this;
            self._event();
        },
        _event:function(){
            var self=this;
            /*关闭商城*/
            $('#shut-fmall-btn').bind('click',function(){
                if(self._navigator().ios){
                    $('body').append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=close" ></iframe>');
                }else if(self._navigator().android){
                    window.mall.h5Finish();
                };
            });
        },
        _navigator:function(){
            var u = navigator.userAgent;
                return{
                    trident:u.indexOf('Trident') > -1,
                    presto:u.indexOf('Presto') > -1, //opera内核
                    webKit:u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    deskWebkit:(u.indexOf("Android") == -1 && u.indexOf("Mobile") == -1),
                    mobileWebKit:!!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/) || !!u.match(/.*Mobile.*/), //是否为移动终端
                    ios:!!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), //ios终端
                    android:u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端
                    iPhone:u.indexOf('iPhone') > -1 && u.indexOf('Mac') > -1, //是否为iPhoneD
                    iPad:u.indexOf('iPad') > -1, //是否iPad
                    webApp:u.indexOf('Safari') == -1 //是否为App应用程序，没有头部与底部
                };
        }
	};
	main.init();
});