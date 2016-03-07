define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var QRCode = require('../../c/js/qrcode').QRCode;
    var Tlist=require('./list.handlebars');
    var main = {
        init:function(){
            var self=main;
            self.customerId=$('#J-customerId').val();
            self._event();
            /*获取登录信息*//*购物车数量*/
            G._getCartCount();
            /*个人名片二维码*/
            var qrcode = new QRCode($('#J-mycard'), {
                width : 160,//设置宽高
                height : 160
            });
            qrcode.makeCode("http://mall.fancyedu.com/index.html?introducerId="+self.customerId);
            /*显示昵称*/
            var nickName=window.fancyLoginUser.nickname || window.fancyLoginUser.mobile;
            $('#J-nickname').html(nickName);
            /*获取红包额度*/
            self._getRedPacket();
        },
        _event:function(){
            var self=this;
            /*扫码*/
            $('#barcode').bind('click',function(){
                if(G._navigator().ios){
                    $('body').append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=barcode" ></iframe>');
                }else if(G._navigator().android){
                    window.mall.barcode();
                };
            });
            /*去我的订单列表，如果是微信先去获取openid*/
            $('.J-gotoMyOrder').on('click',function(){
                var href=$(this).attr('_href') || '/order/myOrder.html';
                /*判断是否是微信支付*/
                if(G._navigator().isWeixin){
                    self._getWXurl({
                        gotoUrlType:2,//1是orderConfirm2是myOrder3是orderDetail
                        isWeixin:true
                    });
                }else{
                    location.href=href;
                };
            });
            /*客服*/
            $('#customerService').off().on('click',function(){
                var mobile=window.fancyLoginUser.mobile || null;
                var fid=window.fancyLoginUser.fancyId || null;
                var nickname=window.fancyLoginUser.nickname || null;
                var data='{mobile:'+mobile+',fid:'+fid+',nickName:'+nickname+'}';
                /*ios*/
                G.connectWebViewJavascriptBridge(function(bridge) {
                    data={
                        mobile:mobile,
                        fid:fid,
                        nickName:nickname,
                        globale:'chat'
                    };
                    bridge.send(data);

                });
                /*andro*/
                if (window.mall && window.mall.customerService) {
                    window.mall.customerService(data);
                };

            })
        },
        _getRedPacket:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/activity/getRedPacket.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        if(res.data.redPacket){
                            $('#J-red-packet').text(res.data.redPacket.balance);
                            $('#J-redPacket-ul').show();
                        };
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