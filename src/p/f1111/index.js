define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var main = {
        init:function(){ 
            var self=main;
            self._event();
        },
        _event:function(){
            var self=main;
            var introducerId=G._getUrlParam('introducerId') || '';
            /*点击领取红包*/
            $('#J-get').unbind('click').bind('click',function(){
                if(!window.fancyLoginUser || !window.fancyLoginUser.customerId){
                    location.href="/login.do?target="+location.href;
                }else{
                    self._getRedPacket();
                };
            });
            /*返回上一步*/
            $('.back').unbind('click').bind('click',function(){
                var from=$('#J-from').val();
                if(from=='mall'){
                    window.history.go(-1);
                }else{
                    if(G._navigator().ios){
                        $('body').append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=close" ></iframe>');
                    }else if(G._navigator().android){
                        window.mall.h5Finish();
                    };
                }
                return false;
            });
            /*获取登录信息*//*购物车数量*/
            G._getCartCount(fancyLoginUser);
        },
        _getRedPacket:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/activity/drawRedPacket.json',
                data:{
                    amount:$('#J-amount').val()
                },
                success:function(res){
                    if(res.info.ok==true){
                        // location.reload();
                        $.alert('领取成功');
                        setTimeout(function(){
                            $.router.back();
                        },2000);
                    }else{
                        if(res.info && res.info.message){
                            alert(res.info.message);
                        }else{
                            $.alert('领取过了');
                        }
                    }
                },
                error:function(){
                    // alert('error');
                },
                complete:function(){
                    
                }
            });
        }
    };
    G._getLoginUser(main.init);
});