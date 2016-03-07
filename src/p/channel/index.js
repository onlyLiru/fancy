define(function(require, exports, module){
    var G=require('../../c/js/globale');
        
        require('../../c/js/registerHelper');
        require('../../c/js/zepto.lazyload');
    var Tpage=require('./page.handlebars');
    
    var main = {
        init:function(){
            var self=main;
            self.from=$('#J-from').val();
            //如果图片加载慢ios需要js滚动方式 
            G._scroll();
            /*获取登录信息*//*购物车数量*/
            G._getCartCount();

            self.pageId=G._getUrlParam('pageId');

            self._getData();
            

        },
        _getData:function(){
            var self=this;
            var url=self.from=='fsl' ? '/fsl/channel/listImg.json' : '/channel/listImg.json';
            $.ajax({
                type:'get',
                cach:false,
                url:url,
                data:{
                    pageId:self.pageId
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#page').html(Tpage(res.data.map.result)); 

                        /*图片延迟加载*/
                        $(".content img.lazy").lazyload({
                            event:"sporty",
                            threshold : 10
                        });

                        var timeout = setTimeout(function() {
                            $("img.lazy").trigger("sporty")
                        }, 200);

                        $.refreshScroller();

                        setTimeout(function(){
                            $.refreshScroller();
                            $.init();
                        },600);

                        setInterval(function(){
                            $.refreshScroller();
                        },600);

                    };
                },
                beforeSend:function(){
                    // $.showIndicator();
                },
                complete:function(){
                    // $.hideIndicator();
                },
                error:function(){
                    // alert('error');
                }
            });
        }
	};
	G._getLoginUser(main.init);
});