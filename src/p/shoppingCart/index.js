define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var Tlist=require('./list.handlebars');
    var main = {
        isFirstLoad:true,
        init:function(){
            var self=this;
            var from=$('#J-from').val();
            self.PREURL=from ? '/'+from : '';
            self._event();
            self._getList();

            self._pullToFresh();
        },
        _pullToFresh:function(){
            var self=this;
            // 添加'refresh'监听器
            $(document).on('refresh', '.pull-to-refresh-content',function(e) {
                self.isPullToFresh=true;
                self._getList();
            });

            /*如果是微信先去获取openid*/
            $('#J-goPay').on('click',function(){
                /*判断是否是微信支付*/
                if(G._navigator().isWeixin){
                    self._getWXurl({
                        gotoUrlType:1,//1是orderConfirm2是myOrder3是orderDetail
                        isWeixin:true,
                        type:1//购物车
                    });
                }else{
                    location.href='/order/orderConfirm.html?type=1';
                };
            });
            
        },
        _event:function(){
            var self=this;
            /*增减数量*/
            $('.J-add').unbind('click').bind('click',function(){
                var id=$(this).parents('li').attr('data-id');
                self._editNum(true,id);
            });
            $('.J-cut').unbind('click').bind('click',function(){
                var id=$(this).parents('li').attr('data-id');
                self._editNum(false,id);
            });
            /*删除*/
            $('.J-delete').unbind('click').bind('click',function(){
                var id=$(this).parents('li').attr('data-id');
                $.confirm('确定删除吗?', function () {
                    self._delete(id);
                });
            });
            /*产看订单详情*/
            $('a[_href]').off().on('click',function(){
                var href=$(this).attr('_href');
                var from=$('#J-from').val();
                if(from=='fsl') href='/'+from+href;
                location.href=href;
            });
        },
        _getList:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/cart/listCart.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        if(res.data.CartVOList.length<=0){
                            //购物车没有商品
                            $('.bar-tab').remove();
                        };
                        $('#J-goods-list').html(Tlist(res.data));
                        /*总价*/
                        var totalPrice=res.data.totalPrice;
                        $('#J-totalPrice').text('￥'+totalPrice);

                        if(self.isPullToFresh){
                            // 加载完毕需要重置
                            $.pullToRefreshDone('.pull-to-refresh-content');
                        };

                        self._event();

                        if(self.isFirstLoad){
                            $.init();
                            self.isFirstLoad=false;
                        }
                    }else{
                        alert(res.info.message);
                    }
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
        _delete:function(id){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/cart/deleteCart.json',
                data:{
                    cartId:id
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getList();
                    }else{
                        alert(res.info.message);
                    }
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
        _editNum:function(flag,id){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/cart/updateCart.json',
                data:{
                    flag:flag,
                    id:id
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getList();
                    }else{
                        alert(res.info.message);
                    }
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
    main.init();
});