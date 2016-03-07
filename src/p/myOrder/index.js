define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var QRCode = require('../../c/js/qrcode').QRCode;
    var Tlist=require('./list.handlebars');
    var ping=require('../../c/js/pingPay');
    var Texpress=require('./express.handlebars');
    var main = {
        init:function(){
            var self=main;
            var from=$('#J-from').val();
            self.PREURL=from ? '/'+from : '';
            self._event();

            var state=G._getUrlParam('state') || '';
            self.state=state;
            self._getList(state);
            
            /*获取登录信息*//*购物车数量*/
            G._getCartCount();
        },
        _event:function(){
            var self=this;
            /*按照订单状态筛选*/
            $('li[data-state]').unbind('click').bind('click',function(){
                var state=$(this).attr('data-state');
                self.state=state;
                $(this).addClass('active').siblings().removeClass('active');
                self._getList(state);
            });
            /*取消订单*/
            $('.J-cancle').unbind('click').bind('click',function(){
                var orderNo=$(this).attr('data-orderNo');
                $.confirm('确定取消吗?', function () {
                    self._cancle(orderNo);
                });
            });
            /*删除订单*/
            $('.J-delete').unbind('click').bind('click',function(){
                var orderNo=$(this).attr('data-orderNo');
                $.confirm('确定删除吗?', function () {
                    self._delete(orderNo);
                });
            });
            /*删除订单*/
            $('.J-confirm').unbind('click').bind('click',function(){
                var orderNo=$(this).attr('data-orderNo');
                    self._confirm(orderNo);
                // $.confirm('确定删除吗?', function () {
                // });
            });
            /*支付*/
            $('.J-pay').unbind('click').bind('click',function(){
                var orderNo=$(this).attr('data-orderNo');
                var paymenttype=$(this).attr('paymenttype');
                ping.init(orderNo);
            });
            /*查看订单详情*/
            $('.goods-list-item a').on('click',function(){
                var href=$(this).attr('_href');
                var openId=$('#J-openId').val() || '';
                var from=$('#J-from').val();
                if(from=='fsl'){
                    href='/'+from+href;
                };
                location.href=href+'&openId='+openId;
            });
            /*查看物流*/
            $('.J-view').off().on('click',function(){
                var expressNo=$(this).attr('data-expressNo') || '';
                var expressCode=$(this).attr('data-expressCode') || '';
                if(expressNo){
                    self._viewExpress({
                        expressNo:expressNo,
                        expressCode:expressCode
                    });
                }else{
                    $.alert('物流信息不存在');
                }
            });
        },
        _getList:function(state){
            var self=this;

            $('li[data-state]').removeClass('active');
            $('li[data-state="'+ state +'"]').addClass('active');

            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/order/listOrderVO.json',
                data:{
                    orderState:state,
                    curPage:1,
                    pageSize:10
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                    };
                    if(res.info.ok==true){
                        $('#J-list-box').html(Tlist(res.data.OrderVOList));
                        
                        self._event();
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
        _viewExpress:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/express/getExpressInfo.json',
                data:{
                    expressNo:data.expressNo,
                    expressCode:data.expressCode
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        var expressInfo=res.data.expressInfo;
                        self._showExpress(expressInfo);
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
        _showExpress:function(data){
            var self=this;
            var trace=data.trace;
            trace= eval('(' + trace + ')');
            data.trace=trace.reverse();
            
            $.router.loadPage("#expressPage");
            $(document).on("pageInit", function(e, pageId, $page) {
                if(pageId == "expressPage") {
                    $('#express-detail').html(Texpress(data));
                }
            });
        },
        _cancle:function(orderNo){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/order/cancelOrder.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getList(self.state);
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
        _pay:function(orderNo){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/immediateAlipay.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('body').html(res.data.alipayInput);
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
        _delete:function(orderNo){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/order/deleteOrder.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getList(self.state);
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
        _confirm:function(orderNo){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/order/confirmReceipt.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getList(self.state);
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
        }
	};
	main.init();
});