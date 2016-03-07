define(function(require, exports, module){
        
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var Tpage=require('./page.handlebars');
    var main = {
        init:function(){
            var self=main;
            self.from=$('#J-from').val();
            self._getData();
        },
        _getData:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/activity/getHotActivity.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('.swiper-wrapper').html(Tpage(res.data.map));
                        $(".swiper-container").swiper({
                            effect : 'coverflow',
                            loop : true,
                            autoHeight: true,
                            autoplay: 5000
                        });

                        $('a[_href]').off().on('click',function(){
                            var href=$(this).attr('_href');
                            if(self.from=='fsl'){
                                href='/'+self.from+href;
                            }else{
                                href=href;
                            }
                            location.href=href;
                        })
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