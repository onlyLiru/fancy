define(function(require, exports, module){
        
        require('../../c/js/registerHelper');
        require('../../c/js/zepto.lazyload');
    var G=require('../../c/js/globale');
    var Tpage=require('./page.handlebars');
    var Tcollection=require('./collection.handlebars');
    var TskuMes=require('./skuGoodsMes.handlebars');
    var Tsku=require('./sku.handlebars');

    var main = {
        init:function(){ 
            var self=this;
            var from=$('#J-from').val();
            self.PREURL=from ? '/'+from : '';
            self.goodsId=G._getUrlParam('goodsId');
            self._getDetail();
        },
        _event:function(){
            var self=this;
            /*增减购买数量*/
            G._editCount({
                box:'.J-edit-count',
                defaultCount:1
            });
            /*加入购物车*/
            $('#J-add-cart').unbind('click').bind('click',function(){
                // if(!window.fancyLoginUser || !window.fancyLoginUser.customerId){
                //     location.href="/login.do?target="+location.href;
                //     return;
                // };
                self._addCart();
            });
            /*立即购买*/
            $('#J-buy-now').unbind('click').bind('click',function(){
                // if(!window.fancyLoginUser || !window.fancyLoginUser.customerId){
                //     location.href="/login.do?target="+location.href;
                //     return;
                // };
                var goodsNum=$('#J-goods-count .J-number').text() || 1;
                var goodsId=$('#J-goodsId').val();
                var stockNum=$('#J-stockNum').text();
                var attributeSymbolName=$('#J-attributeSymbolName').val();
                /*SKU信息*/
                var specify ='';
                if(attributeSymbolName){
                    specify=attributeSymbolName;
                }else{
                    var specify =[];
                    if($('.sku-item.active').length){
                        $('.sku-item.active').each(function(){
                            var name=$(this).parent().attr('data-name');
                            var value=$(this).text();
                            specify.push('"'+name+'":"'+value+'"');
                        });
                        specify=specify.join(',');
                    };
                };
                // if(stockNum<=0){//如果库存没了
                //     $.alert('宝贝太受欢迎，已经卖光了');
                // }else if(stockNum<goodsNum){
                //     $.alert('库存只有'+ stockNum +'件商品了');
                // }else{
                    /*判断是否是微信支付*/
                    if(G._navigator().isWeixin){
                        self._getWXurl({
                            type:2,//是单品
                            gotoUrlType:1,//1是orderConfirm2是myOrder3是orderDetail
                            goodsNum:goodsNum,
                            goodsId:goodsId,
                            specify:specify,
                            isWeixin:true
                        });
                    }else{
                        var from=$('#J-from').val();
                        if(from=="fsl"){
                            location.href='/'+from+'/order/orderConfirm.html?type=2&goodsNum='+ goodsNum+'&goodsId='+goodsId+'&specify='+specify;
                        }else{
                            location.href='/order/orderConfirm.html?type=2&goodsNum='+ goodsNum+'&goodsId='+goodsId+'&specify='+specify;
                        }
                    };
                // }
            });
            /*购买套包*/
            $('#J-buy-box').unbind('click').bind('click',function(){
                var activitySetId=$(this).attr('data-id');
                var goodsNum=$('#J-box-goods .J-number').text() || 1;
                location.href='/order/orderConfirm.html?type=3&goodsNum='+ goodsNum+'&activitySetId='+activitySetId
            });
            /*图片延迟加载*/
            $(".content img.lazy").lazyload({
                event:"sporty",
                threshold : 100
            });

            var timeout = setTimeout(function() {
                $("img.lazy").trigger("sporty")
            }, 100);
            /*SKU选择*/
            $('#J-sku a').unbind('click').bind('click',function(){
                $(this).addClass('active').siblings().removeClass('active');
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
        },
        _addCart:function(){
            var self=this;
            var goodsNum=$('.J-number').text();
            var goodsId=$('#J-goodsId').val();
            var attributeSymbolName=$('#J-attributeSymbolName').val();
            /*SKU信息*/
            var specify =[];
            
            if(attributeSymbolName){
                specify=attributeSymbolName;
            }else{
                if($('.sku-item.active').length){
                    $('.sku-item.active').each(function(){
                        var name=$(this).parent().attr('data-name');
                        var value=$(this).text();
                        specify.push(name+':'+value);
                    });
                };
                specify=specify.join(',');
            };
            $.ajax({
                type:'get',
                cach:false,
                url:'/cart/addCart.json',
                data:{
                    goodsId:goodsId,
                    goodsNum:goodsNum,
                    specify:specify
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };

                    if(res.info.ok==true){
                        $.toast("添加成功");
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
        _getDetail:function(){
            var self=main;
            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/goods/getGoods.json',
                data:{
                    goodsId:self.goodsId
                },
                success:function(res){
                    if(res=='noLogin' && $('#J-from').val()=='fsl'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        var type=res.data.goodsEntityVO.type || 0;

                        var introduction=(res.data.goodsEntityVO.introduction).split(',');
                        res.data.goodsEntityVO.introduction=introduction;

                        /*图片放大*/
                        var myPhotoBrowserStandalone = $.photoBrowser({
                              photos : introduction
                        });
                        $(document).on('click','.pb-standalone',function () {
                            myPhotoBrowserStandalone.open();
                        });

                        $('#J-page').html(Tpage(res.data.goodsEntityVO));
                        /*type=1说明是礼包商品，去掉加购物车和不能修改数量*/
                        if(type==1){
                            $('#J-add-cart,#J-goods-count').remove();
                        };

                        /*设置规格*/
                        self._setSpecify(res.data.goodsEntityVO.specify || '');

                        /*套包*/
                        self._getActivitySetByGoodsId();
                        /*banner*/
                        if(G._navigator().ios){
                            $(".swiper-container").swiper({
                                pagination:'.banner-pagination',
                                effect : 'cube',
                                cube: {
                                    slideShadows: true,
                                    shadow: true,
                                    shadowOffset: 10,
                                    shadowScale: 0.6
                                },
                                autoHeight: true
                            });
                        }else if(G._navigator().android){
                            $(".swiper-container").swiper({
                                pagination:'.banner-pagination'
                            });
                        };
                        /*设置SKU*/
                        $('#sku-good').html(TskuMes(res.data.goodsEntityVO));
                        self._sku();
                        

                        self._event();
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
        _setSpecify:function(specify){
            var self=this;
            var html=[];
            if(!specify){
                return;
            };
            specify=eval('('+ specify +')')

            $.each(specify,function(key,value){
                html.push('<li class="borderB lh24 mb10"><span class="color-gray fr">'+ value +'</span>'+ key +'</li>');
            });

            $('#J-specify').html(html.join(''));

        },
        _getActivitySetByGoodsId:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/activitySet/getActivitySetByGoodsId.json',
                data:{
                    goodsId:self.goodsId
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#J-collection').html(Tcollection(res.data.activitySetEntityVO));
                        self._event();
                    }
                },
                error:function(){
                    // alert('error');
                }
            });
        },
        _sku:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/goods/listGoodsSalesAttribute',
                data:{
                    goodsId:self.goodsId
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#J-sku').html(Tsku(res.data));
                        self._event();
                    }
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
	main.init();
});