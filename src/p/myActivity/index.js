define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var Tlist=require("./list.handlebars");
    var main = {
        init:function(){ 
            var self=main;
            self.from=$('#J-from').val();
            self.PREURL=self.from ? '/'+self.from : '';
            /*获取登录信息*//*购物车数量*/
            G._getCartCount();

            self._getList('all');

            self._event();
        },
        _event:function(){
        	var self=this;
        	$('.buttons-tab a').off().on('click',function(){
        		$(this).addClass('active').siblings().removeClass('active');
        		var type=$(this).attr('rel');
        		self._getList(type)
        	});
        },
        _getList:function(type){
        	var self=this;
        	$.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/activity/listActivitySignup.json',
                data:{
                    isFinish:type
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('.media-list').html(Tlist(res.data.list));
                    };

                    $('a[_href]').off().on('click',function(){
                        var href=$(this).attr('_href');
                        if(self.from=='fsl'){
                            href='/'+self.from+href;
                        }else{
                            href=href;
                        }
                        location.href=href;
                    })
                },
                beforeSend:function(){
                    // $.showIndicator();
                    $('.media-list').html('<div style="margin:1.5rem auto" class="infinite-scroll-preloader">\
                        <div class="preloader"></div>\
                    </div>');
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
	main.init();
});