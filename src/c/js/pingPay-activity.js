define(function(require, exports, module){
    
    var main={
        init:function(orderNo){
            var self=this;
                var amount=($('#J-totalPrice .J-total').text())*100 || '';
                var order_no = orderNo;
                var $openId=$('#J-openId');
                var openId=$openId.val();
                if(openId && !sessionStorage.openId){
                    sessionStorage.openId=openId;
                };
                if(window.sessionStorage){
                    openId=openId || sessionStorage.openId;
                };

                if(orderNo){
                    sessionStorage.orderNo=orderNo;
                };


                 var param={openId:openId,orderNo:orderNo};
                 pingpp_one.init({
                    app_id:'app_arzrzD1SWX9CbzTO',//该应用在 ping++ 的应用 ID
                    amount:amount,//订单价格，单位：人民币 分
                    // 壹收款页面上需要展示的渠道，数组，数组顺序即页面展示出的渠道的顺序
                    // upmp_wap 渠道在微信内部无法使用，若用户未安装银联手机支付控件，则无法调起支付
                    channel:['wx_pub','alipay_wap'],
                    charge_url:'/payment/getCharge.json',//商户服务端创建订单的 url
                    charge_param:param,//(可选，用户自定义参数，若存在自定义参数则壹收款会通过 POST 方法透传给 charge_url)
                    open_id:openId,//(可选，使用微信公众号支付时必须传入)
                    debug:false
                    },function(res){
                    //debug 模式下获取 charge_url 的返回结果
                    if(res.debug&&res.chargeUrlOutput){
                        console.log(res.chargeUrlOutput);
                    }
                    if(!res.status){
                        //处理错误
                        alert(res.msg); 
                    }
                    else{
                        //debug 模式下调用 charge_url 后会暂停，可以调用 pingpp_one.resume 方法继续执行
                        if(res.debug&&!res.wxSuccess){
                            if(confirm('当前为 debug 模式，是否继续支付？')){
                                pingpp_one.resume();
                            }
                        }
                        //若微信公众号渠道需要使用壹收款的支付成功页面，则在这里进行成功回调，
                        //调用 pingpp_one.success 方法，你也可以自己定义回调函数
                        //其他渠道的处理方法请见第 2 节
                        else pingpp_one.success(function(res){
                            if(!res.status){
                                alert(res.msg);
                            }else{

                            }
                        },function(){
                            //这里处理支付成功页面点击“继续购物”按钮触发的方法，
                            //例如：若你需要点击“继续购物”按钮跳转到你的购买页，
                            //则在该方法内写入 window.location.href = "你的购买页面 url"
                            window.location.href='/activity/myActivity.html';
                            
                        });
                    }
                });
        var timer=setInterval(function(){
                if($('body').hasClass('p_one_open')){
                    clearInterval(timer);
                    $('body').removeClass('p_one_open');
                }
            },10);
        },
        randomString:function(len){
            var self=this;

            len = len || 32;
　　        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　        var maxPos = chars.length;
　　        var pwd = '';
　　        for (i = 0; i < len; i++) {
　　　　        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　        }
　　        return pwd;
        }
    };
    module.exports=main;
});