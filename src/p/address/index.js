define(function(require, exports, module){
    require('../../c/sui/city-data');
    require('../../c/sui/city-picker');
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var Tlist=require('./list.handlebars');
    var Tadd=require('./add.handlebars');

    var main = {
        init:function(){ 
            var self=this;
            self._event();
            /*获取收货地址列表*/
            self._getList();

            $(document).on("pageReinit", '#router-list', function(e, pageId, $page) {
                self._getList();
            });
            $(document).on("pageInit", function(e, pageId, $page) {
                if(pageId == "router-add") {
                    $('#router-add .list-block').html(Tadd());
                    self._setCity('#J-city');
                }
            });
        },
        _event:function(){
            var self=this;
            $('#J-confirm').unbind('click').bind('click',function(){
                /*新增收货地址*/
                self._add();
            });
            /*编辑*/
            $('.media-list li').unbind('click').bind('click',function(){
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
        _getList:function(){
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
                        $('#J-address-list').html(Tlist(res.data.addressVOList));
                        self.ADDRSS=res.data.addressVOList;

                        $('[href="#router-add"]').show();

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