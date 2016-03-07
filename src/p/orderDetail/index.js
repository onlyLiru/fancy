define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var Tpage=require('./page.handlebars');
    var ping=require('../../c/js/pingPay');
    var Texpress=require('./express.handlebars');
    var main = {
        init:function(){ 
            var self=this;
            self._event();

            self._getDetail();
            

            $(document).on("pageInit", function(e, pageId, $page) {
              if(pageId == "returnPage") {
                self._getReturnMoney();
              }
            });
        },
        _event:function(){
            var self=this;
            /*支付*/
            $('.J-pay').unbind('click').bind('click',function(){
                var orderNo=$('#J-orderNo').val();
                ping.init(orderNo);
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
            /*查看商品详情*/
            $('.goods-list-item a[_href]').on('click',function(){
                var href=$(this).attr('_href');
                var from=$('#J-from').val();
                if(from=='fsl'){
                    href='/'+from+href;
                };
                location.href=href;
            });
            /*退款*/
            $('#J-return-btn').off().on('click',function(){
                self._return();
            });
            /*取消退款*/
            $('#J-cancel-return-btn').off().on('click',function(){
                self._cancelReturn();
            });
        },
        _getDetail:function(){
            var self=this;
            var orderNo=$('#J-orderNo').val();
            $.ajax({
                type:'get',
                cach:false,
                url:'/order/getOrderVO.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };

                    if(res.info.ok==true){
                        $('#J-detail').append(Tpage(res.data.OrderVO));
                        
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
        _getReturnMoney:function(){
            var self=this;
            var orderNo=$('#J-orderNo').val();
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/applyForRefund.json',
                data:{
                    orderNo:orderNo
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };

                    if(res.info.ok==true){
                        self.money=res.data.refund.refundFee;
                        self.tradeNo=res.data.tradeNo;

                        $('#J-return-money').text(self.money);
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
        _return:function(){
            var self=this;
            var orderNo=$('#J-orderNo').val();
            var reason=$('#J-return-reason option:checked').val();
            var money=$('#J-return-money').text();
            var mes=$('#J-return-des').val();
            if(reason==0){
                $.alert('请选择退款原因');
                return;
            };

            // $.router.back();
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/commitRefundApply.json',
                data:{
                    orderNo:orderNo,
                    tradeNo:self.tradeNo,
                    refundFee:self.money,
                    reason:reason,
                    refundDesc:mes
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };

                    if(res.info.ok==true && res.data.commitFlag==true){
                        location.href="/payment/success-return.html";
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
        _cancelReturn:function(){
            var self=this;
            var orderNo=$('#J-orderNo').val();
            var reason=$('#J-cancel-return-reason option:checked').val();
            var mes=$('#J-cancel-return-des').val();
            if(reason==0){
                $.alert('请选择取消退款原因');
                return;
            };

            // $.router.back();
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/commitCancelRefund.json',
                data:{
                    orderNo:orderNo,
                    reason:reason,
                    refundDesc:mes
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };

                    if(res.info.ok==true && res.data.commitFlag==true){
                        location.href="/payment/success-cancel-return.html";
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