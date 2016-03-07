define(function(require, exports, module){
        require('../../c/js/zepto.lazyload');
    var G=require('../../c/js/globale');
    var Tlist=require('./list.handlebars');
    var main = {
        init:function(){ 
            var self=main;
            self.activityId=G._getUrlParam('id');
            self._event();

            self._getData();
        },
        _event:function(){
        	var self=this;
            $('#J-signUp').off().on('click',function(){
                var from=$('#J-from').val();
            	var href='/activity/signup.html?id='+self.activityId;
                if(from=='fsl'){
                    href='/fsl'+'/activity/signup.html?id='+self.activityId;
                };
                if(G._navigator().isWeixin){
                    self._getWXurl({
                        gotoUrlType:4,//4是活动
                        isWeixin:true,
                        url:href
                    });
                }else{
                    location.href=href;
                };
            });

        },
        _getData:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/activity/getActivityDetail.json',
                data:{
                	activityId:self.activityId
                },
                success:function(res){
                    if(res=='noLogin' && $('#J-from').val()=='fsl'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#imgList').html(Tlist(res.data.imgList));
                        /*图片延迟加载*/
                        $(".content img.lazy").lazyload({
                            event:"sporty",
                            threshold : 100
                        });

                        var timeout = setTimeout(function() {
                            $("img.lazy").trigger("sporty")
                        }, 100);
                    };
                },
                beforeSend:function(){
                    $.showIndicator();
                },
                complete:function(){
                    $.hideIndicator();
                },
                error:function(){
                    // alert('error');
                }
            });
        },
        _getWXurl:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/getWxCodeURI.json',
                data:data,
                success:function(res){
                    if(res.info.ok==true){
                        location.href=res.data.wxCodeURl;
                    }else{
                        alert(res.info.message);
                    };
                },
                beforeSend:function(){
                    $.showIndicator();
                },
                complete:function(){
                    $.hideIndicator();
                },
                error:function(){
                    // alert('error');
                }
            });
        }
	};
	G._getLoginUser(main.init);
});