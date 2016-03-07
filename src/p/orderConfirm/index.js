define(function(require, exports, module){
    var G=require('../../c/js/globale');
    require('../../c/sui/city-data');
    require('../../c/js/registerHelper');
    require('../../c/sui/city-picker');
    var Taddress=require('./address.handlebars');
    var Teditaddress=require('./edit-address.handlebars');
    var Tadd=require('./add.handlebars');
    var Tcart=require('./cart.handlebars');
    var Tactivity=require('./activity.handlebars');
    var Tgoods=require('./goods.handlebars');
    var ping=require('../../c/js/pingPay');
    var main = {
        goodsCount:1,
        init:function(){ 
            var self=this;
            var from=$('#J-from').val();
            self.PREURL=from ? '/'+from : '';
            self._event();
            self._orderType();

            /*点击选择收货地址*/
            $(document).on("pageInit", function(e, pageId, $page) {
                if(pageId == "address-list") {
                    self._getAddress($('#my-address'),Taddress);
                }
            });
            /*进入收货地址编辑列表*/
            $(document).on("pageInit", function(e, pageId, $page) {
                if(pageId == "edit-address-list") {
                    self._getAddress($('#edit-my-address'),Teditaddress);
                }
            });
            /*进入新增收货地址列表*/
            $(document).on("pageInit", function(e, pageId, $page) {
                if(pageId == "address-add") {
                    $('#address-add .list-block').html(Tadd());
                    self._setCity('#J-city');
                }
            });
            
        },
        _event:function(){
            var self=this;
            self.orderType=$('#J-order-type').val();//1是购物车2是单品3是套装
            if(self.orderType==1){
                /*增减数量*/
                $('.J-add').unbind('click').bind('click',function(){
                    var id=$(this).parents('li').attr('data-id');
                    self._editNum(true,id);
                });
                $('.J-cut').unbind('click').bind('click',function(){
                    var id=$(this).parents('li').attr('data-id');
                    self._editNum(false,id);
                });
            }else{
                /*增减购买数量*/
                G._editCount({
                    box:'.J-edit-count',
                    defaultCount:self.goodsCount
                });
                /*计算总价*/
                $('.J-edit-count').unbind('click').bind('click',function(){
                    var num=$('.J-number').text();
                    $('#J-totalPrice').text((num*self.onePrice).toFixed(2));
                });
            };
            /*删除*/
            $('.J-delete').unbind('click').bind('click',function(){
                var id=$(this).parents('li').attr('data-id');
                $.confirm('确定删除吗?', function () {
                    self._delete(id);
                });
            });
            /*如果没有收获地址去添加*/
            $('#J-add-address').unbind('click').bind('click',function(){
                // location.href="/customer/address.html";
            });
            /*确认支付*/
            $('#J-confirm-pay').unbind('click').bind('click',function(){
                /*如果没有收货地址则不能提交订单*/
                if($('#J-add-address').length){
                    $.alert('请填写收货地址');
                    return;
                }
                /*先验证库存*/
                if(self.goodsType==1){
                    self._selectPayType();
                }else{
                    self._createOrder();
                };
            });
            /*选择收货地址*/
            $('#my-address li').off().on('click',function(){
                var addressId=$(this).attr('data-id');
                self._selectAddress(addressId);
                $(this).addClass('active').siblings().removeClass('active');
                window.history.back();
            });
            /*编辑收货地址*/
            $('#edit-my-address li').unbind('click').bind('click',function(){
                var id=$(this).attr('data-id');
                var curItem;
                $.each(self.ADDRSS,function(i,item){
                    if(item.id==id){
                        curItem=item;
                    }
                });
                var consigneeName=curItem.consigneeName || '';
                var consigneeMobile=curItem.consigneeMobile || '';
                var zipCode=curItem.zipCode || '';
                var addressDetail=curItem.addressDetail || '';
                var areaAddress=curItem.areaAddress || '';
                $('#J-edit-name').val(consigneeName);
                $('#J-edit-phone').val(consigneeMobile);
                $('#J-edit-code').val(zipCode);
                $('#J-edit-detail-address').val(addressDetail);
                $('#J-edit-city').val(areaAddress);

                $('#edit-address').attr('data-edit-id',id);

                self._setCity('#J-edit-city');
            });
            $('#J-edit-confirm').unbind('click').bind('click',function(){
                var name,phone,code,city,address;
                name=$('#J-edit-name').val();
                phone=$('#J-edit-phone').val();
                code=$('#J-edit-code').val();
                city=$('#J-edit-city').val();
                address=$('#J-edit-detail-address').val();

                var id=$('#edit-address').attr('data-edit-id');

                if(!name || !phone || !code || !city || !address){
                    $.alert('请填写完整信息');
                    return;
                };
                self._addConfirm({
                    id:id,
                    // customerId:0,
                    areaAddress:city,
                    addressDetail:address,
                    zipCode:code,
                    consigneeName:name,
                    consigneeMobile:phone,
                    isDefault:0,
                    delFlag:0
                });
            });
            /*删除收货地址*/
            $('#J-delete').unbind('click').bind('click',function(){
                $.confirm('确定删除吗?', function () {
                    self._delete();
                });
            });
            /*设置为默认*/
            $('#J-default').unbind('click').bind('click',function(){
                self._default();
            });
            $('#J-confirm').unbind('click').bind('click',function(){
                /*新增收货地址*/
                self._add();
            });
        },
        // _validatorStock:function(){
        //     var self=this;
        //     var type=self.orderType;
        //     var data={//购物车
        //             isCart:true
        //         };
        //     if(type==2){//单个商品
        //         data={
        //             goodsId:$('#J-goodsId').val(),
        //             goodsNum:$('.J-number').text(),
        //             specify:$('#J-specify').val()
        //         }
        //     }else if(type==3){//套包
        //         data={
        //             activitySetId:$('#J-activitySetId').val(),
        //             goodsNum:$('.J-number').text()
        //         };
        //     };
        //     $.ajax({
        //         type:'get',
        //         cach:false,
        //         url:'/order/checkSkuStockNumByParams.json',
        //         data:data,
        //         success:function(res){
        //             if(res.info.ok==true){
        //                 if(self.goodsType==1){
        //                     self._selectPayType();
        //                 }else{
        //                     self._createOrder();
        //                 };
        //             }else{
        //                 self._noGoods(res);
        //             }
        //         },
        //         beforeSend:function(){
        //             $.showIndicator();
        //         },
        //         complete:function(){
        //             $.hideIndicator();
        //         },
        //         error:function(){
        //             // alert('error');
        //         }
        //     });
        // },
        _selectPayType:function(){
            var self=this;
            var buttons1 = [
                {
                  text: '使用兑换码',
                  bold: true,
                  color: 'danger',
                  onClick: function() {
                    $.prompt('输入兑换码',
                        function (value) {
                          if(value){
                            self._validatorCode(value);
                          };
                        }
                      );
                  }
                },
                {
                  text: '在线支付',
                  onClick: function() {
                    self._createOrder();
                  }
                }
              ];
              var buttons2 = [
                {
                  text: '取消',
                  bg: 'danger'
                }
              ];
              var groups = [buttons1, buttons2];
              $.actions(groups);
        },
        _validatorCode:function(code){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                data:{
                    inviteCode:code,
                    activityId:$('#J-goodsId').val()
                },
                url:'/activity/verifyInviteCode.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._createOrder(code);
                    }else{
                        $.alert(res.info.message);
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
        _createOrder:function(code){
            var self=this;
            var type=self.orderType;
            var data={//购物车
                    isCart:true,
                };
            if(type==2){//单个商品
                data={
                    goodsId:$('#J-goodsId').val(),
                    goodsNum:$('.J-number').text(),
                    specify:$('#J-specify').val(),
                }
            }else if(type==3){//套包
                data={
                    activitySetId:$('#J-activitySetId').val(),
                    goodsNum:$('.J-number').text(),
                };
            };
            data.repeatToken=$('#J-repeatToken').val();

            var addressId=$('[data-address-id]').attr('data-address-id');
            if(addressId){ data.addressId=addressId; };

            if(code){data.inviteCode=code;}
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/confirmPay.json',
                data:data,
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        /*app定制返回逻辑*/
                        if(G._navigator().ios){
                            G.connectWebViewJavascriptBridge(function(bridge) {
                                bridge.send({
                                    globale:'backRoot'
                                });
                            });
                        }else if(G._navigator().android && window.mall && window.mall.backRoot){
                            window.mall.backRoot();
                        };

                        if(res.data.GoodsSkuDTOs){
                            self._manageSku(res.data.GoodsSkuDTOs);
                        }else if(res.data.OrderDTO){
                        	var result = res.data.OrderDTO;
                            //var orderNo=res.data.orderNo;
                            var orderNo = result.orderNo || '';
                            var paymentType = result.paymentType;
                            self.orderNo=orderNo;
                            if(code || paymentType == 3){
                                location.href="/order/myOrder.html";
                            }else{
                                ping.init(orderNo);
                            }
                        };
                    }else{
                        if(res.info.errorCode=='911'){
                            if(self.orderNo){
                                var openId=$('#J-openId').val() || sessionStorage.openId || '';
                                var orderNo=self.orderNo || sessionStorage.orderNo;
                                location.href=self.PREURL+"/order/orderDetail.html?orderNo="+orderNo+'&openId='+openId
                            }else{
                                location.href=self.PREURL+'/order/myOrder.html';
                            }
                        }else{
                            $.alert(res.info.message);
                        }
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
        _manageSku:function(data){
            var self=this;
            if(data.stocknum && data.stocknum.length){
                $.each(data.stocknum,function(i,item){
                    var id=item.goodsId;
                    $('#J-cart-ontent .goods-list li[data-id="'+ id +'"]').append('<div class="cover-gray">\
                        <i class="iconfont mr5">&#xe686;</i>此商品库存不足！\
                    </div>');
                });
            };

            if(data.sku && data.sku.length){
                $.each(data.sku,function(i,item){
                    var kuid=item.goodsId;
                    $('#J-cart-ontent .goods-list li[data-id="'+ kuid +'"]').append('<div class="cover-gray">\
                        <i class="iconfont mr5">&#xe686;</i>此商品规格异常！\
                    </div>');
                });
            }

        },
        _noGoods:function(res){
            var self=this;
            res=res.data.GoodsSkuDTOs || {};
            $.each(res,function(i,item){

                $('li[data-id="'+ item.goodsId +'"]').css({
                    border:'solid 1px #f00',
                    backgroundColor:'#FCF6F8'
                });

            });

            $.alert('您的订单中存在库存不足的商品');
        },
        _confirmPay:function(){
            var self=this;
            var type=self.orderType;
            var data={//购物车
                    isCart:true,
                    repeatToken:$('#J-repeatToken').val()
                };
            if(type==2){//单个商品
                data={
                    goodsId:$('#J-goodsId').val(),
                    goodsNum:$('.J-number').text(),
                    specify:$('#J-specify').val(),
                    repeatToken:$('#J-repeatToken').val()
                }
            }else if(type==3){//套包
                data={
                    activitySetId:$('#J-activitySetId').val(),
                    goodsNum:$('.J-number').text(),
                    repeatToken:$('#J-repeatToken').val()
                };
            };
            /*防止重复提交的token*/
            data.token=$('#J-token').val() || '';
            /*判断是否是微信支付*/
            if(!G._navigator().isWeixin){
                data.isWeixin=true
                return;
            };
            $.ajax({
                type:'get',
                cach:false,
                url:'/payment/confirmPay.json',
                data:data,
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('body').html(res.data.alipayInput);
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
        _orderType:function(){
            var self=this;
            var type=self.orderType;
            self._getCartList();
            // if(type==1){^
            //     self._getCartList();
            // }else if(type==2){

            // }
        },
        _getCartList:function(){
            var self=this;
            var template=Tcart;
            var type=self.orderType;
            var data={
                    isCart:true
                };
            if(type==2){
                data={
                    goodsId:$('#J-goodsId').val(),
                    goodsNum:$('#J-goodsNum').val()
                }
                template=Tgoods;
            }else if(type==3){
                data={
                    activitySetId:$('#J-activitySetId').val(),
                    goodsNum:$('#J-goodsNum').val()
                };
                template=Tactivity;
            };
            $.ajax({
                type:'get',
                cach:false,
                url:'/order/confirmOrder.json',
                data:data,
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#J-cart-ontent').html(template(res.data.OrderVO));
                        /*总价*/
                        var totalPrice=res.data.OrderVO.totalPrice;
                        var totalSalePrice=res.data.OrderVO.totalSalePrice;
                        var goodsCount=res.data.OrderVO.goodsCount || 1;
                        var customerRedPacket=totalSalePrice-totalPrice || 0;
                        var goodsType=res.data.OrderVO.type || 0;
                        self.goodsType=goodsType;
                        self.goodsCount=goodsCount;
                        $('#J-totalPrice').html('￥<span class="J-total">'+totalPrice+'</span><span class="fz12 color-gray"> 已优惠'+customerRedPacket+'元</span>');
                        self.onePrice=(totalPrice/goodsCount).toFixed(2);

                        self._showSku();

                        self._event();


                        if(goodsType==1){//礼包商品不允许改变数量
                            $('.J-edit-count').hide();
                        }
                    }else{
                        location.href="/order/myOrder.html";
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
        _showSku:function(){
            var self=this;
            var type=self.orderType;
            /*展示SKU信息*/
            var sku=$('#J-specify').val();
            if(sku.indexOf(':')==-1){
                return;
            };

            if(type=2){
                if(sku.length){
                    var newSku=[];
                    sku='{'+sku+'}';
                    sku=eval('(' + sku + ')'); 
                    $.each(sku,function(k,v){
                        newSku.push(v);
                    });
                    newSku=newSku.join(',');
                    $('.J-specify-show').text(newSku);
                };
            }
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
                        self._getCartList();
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
                        self._getCartList();
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
        _setCity:function(id){
            $(id).cityPicker({
                toolbarTemplate: '<header class="bar bar-nav">\
                <button class="button button-link pull-right close-picker">确定</button>\
                <h1 class="title">选择收货地址</h1>\
                </header>'
              });
        },
        _getAddress:function(box,handle){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/address/listAddress.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        box.html(handle(res.data.addressVOList));
                        self.ADDRSS=res.data.addressVOList;

                        var curId=$('[data-address-id]').attr('data-address-id');
                        if(curId){
                            $('#my-address li').removeClass('active');
                            $('#my-address li[data-id="'+ curId +'"]').addClass('active');
                        }

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
        _selectAddress:function(id){
            var self=this;

            $.each(self.ADDRSS,function(i,item){
                if(item.id==id){
                    curItem=item;
                }
            });
            var consigneeName=curItem.consigneeName || '';
            var consigneeMobile=curItem.consigneeMobile || '';
            var fullAddress=curItem.fullAddress || '';

            $('.order-address').html('<a class="block color-gray" data-address-id="'+ id +'" href="#address-list">\
                <ul>\
                    <li>收货人：'+ consigneeName +'<span class="fr">'+ consigneeMobile +'</span></li>\
                    <li>'+ fullAddress +'</li>\
                </ul>\
                <i class="iconfont fz20 address color-gray absolute">&#xe617;</i><i class="iconfont absolute fz14 color-gray map">&#xe614;</i>\
            </a>');
        },
        _default:function(){
            var self=this;
            var id=$('#edit-address').attr('data-edit-id');
            $.ajax({
                type:'get',
                cach:false,
                url:'/address/updateDefault.json',
                data:{
                    addressId:id
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $.router.back();
                        self._getAddress($('#edit-my-address'),Teditaddress);
                        self._getAddress($('#my-address'),Taddress);
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
        _delete:function(){
            var self=this;
            var id=$('#edit-address').attr('data-edit-id');
            $.ajax({
                type:'get',
                cach:false,
                url:'/address/deleteAddress.json',
                data:{
                    addressId:id
                },
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $.router.back();
                        self._getAddress($('#edit-my-address'),Teditaddress);
                        self._getAddress($('#my-address'),Taddress);
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
        _add:function(){
            var self=this;
            var name,phone,code,city,address;
            name=$('#J-name').val();
            phone=$('#J-phone').val();
            code=$('#J-code').val();
            city=$('#J-city').val();
            address=$('#J-detail-address').val();

            if(!name || !phone || !code || !city || !address){
                $.alert('请填写完整信息');
                return;
            };

            self._addConfirm({
                // customerId:0,
                areaAddress:city,
                addressDetail:address,
                zipCode:code,
                consigneeName:name,
                consigneeMobile:phone,
                isDefault:0,
                delFlag:0
            });
        },
        _addConfirm:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/address/addOrUpdateAddress.json',
                data:data,
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $.router.back();
                        self._getAddress($('#edit-my-address'),Teditaddress);
                        self._getAddress($('#my-address'),Taddress);
                        /*在没有收货地址，并且新增后返回时把地址塞进去*/
                        $(document).on("pageAnimationEnd", function(e, pageId, $page) {
                            var flag=$('#J-add-address').children('a[href="#address-add"]').length ? true : false;
                            if(pageId=='current-page' && flag){
                                self._setAddress();
                            };
                        });
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
        _setAddress:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/address/listAddress.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self.ADDRSS=res.data.addressVOList;
                        var Adata=res.data.addressVOList[0];
                        var consigneeName=Adata.consigneeName || '';
                        var consigneeMobile=Adata.consigneeMobile || '';
                        var fullAddress=Adata.fullAddress || '';
                        var id=Adata.id || '';

                        $('#J-the-address').html('<div class="mb10 bg-white pd10 relative order-address"><a class="block color-gray" data-address-id="'+ id +'" href="#address-list">\
                            <ul>\
                                <li>收货人：'+ consigneeName +'<span class="fr">'+ consigneeMobile +'</span></li>\
                                <li>'+ fullAddress +'</li>\
                            </ul>\
                            <i class="iconfont fz20 address color-gray absolute">&#xe617;</i><i class="iconfont absolute fz14 color-gray map">&#xe614;</i>\
                        </a></div>');

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
        }
    };
    main.init();
});
